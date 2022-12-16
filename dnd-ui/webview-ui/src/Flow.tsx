import React, { useState, useCallback, useRef, useEffect } from "react";
import { vscode } from "./utilities/vscode";
import pick from "lodash.pick";
import get from "lodash.get";
import omit from "lodash.omit";
import YAML from "yaml";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import TextInputNode from "./nodes/TextInputNode";
import VisitPageNode from "./nodes/VisitPageNode";
import CheckboxNode from "./nodes/CheckboxNode";
import ButtonNode from "./nodes/ButtonNode";
import ContainsNode from "./nodes/ContainsNode";
import { useStore } from "./context/store";
import NodeMenuPanel from "./NodeMenuPanel";
import CompilePanel from "./CompilePanel";
import { Compiler } from "./compiler";
import SavePanel from "./SavePanel";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const initialEdges = [] as any;

const nodeTypes = {
  buttonNode: ButtonNode,
  textInputType: TextInputNode,
  visitNode: VisitPageNode,
  checkboxNode: CheckboxNode,
  containsNode: ContainsNode,
};

function Flow() {
  const [nodes, setNodes] = useState<
    Node<{
      color?: string;
      label: string;
    }>[]
  >([]);
  console.log("nodes", nodes);
  const [edges, setEdges] = useState(initialEdges);
  const [store, setStore] = useStore((store) => store);
  const [showMenu, setShowMenu] = useState(false);
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
    []
  );

  function handleCallback(event: any) {
    if (event.data.type === "fileUpdate" && event.data.text) {
      const payload = YAML.parse(event.data.text);
      const allNodes = Object.values(payload.nodes);
      const allEdges = Object.values(payload.edges);
      const curNodes = allNodes.map((node) => {
        const cNode = {
          ...pick(node, ["id", "position", "type"]),
          style: get(node, "data.style", {}),
          data: {
            ...get(node, "data", {}),
            inPorts: get(node, "inPorts", {}),
          },
        };
        return cNode;
      });
      setNodes(curNodes);
      setEdges(allEdges);
      setStore({ ...payload });
    }
  }

  function handleSave() {
    const inputNodes = nodes.reduce((acc, item) => {
      acc[item.id] = {
        ...pick(item, ["id", "position", "type"]),
        description: "description",
        componentName: "compName",
        outputQ: ["outputQ"],
        inPorts: { ...store.nodes[item.id].inPorts },
        outPorts: {},
        data: { ...omit(item.data, ["inPorts"]) },
      };
      return acc;
    }, {});
    console.log("inputNodes", inputNodes);

    const inputEdges = edges.reduce((acc, item) => {
      acc[item.source] = { ...item };
      return acc;
    }, {});

    vscode.postMessage({
      type: "addEdit",
      data: { yamlData: YAML.stringify({ nodes: inputNodes, edges: inputEdges }) },
    });
  }

  function handleCompile(event: any) {
    let compiledText = Compiler.compile(store);

    vscode.postMessage({
      type: "writeCompiledFile",
      data: { compiledText: compiledText, fileExtension: "spec.js" },
    });

    return true;
  }

  useEffect(() => {
    window.addEventListener("message", handleCallback);

    () => window.removeEventListener("message", handleCallback);
  }, []);

  const onConnect = useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), []);

  const runTest = useCallback((_event: any, node: any) => {}, [store]);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodeClick={runTest}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}>
        <Background />
        <Controls />
        <CompilePanel onClick={handleCompile} />
        <SavePanel onClick={handleSave} />
        <Panel
          position="top-left"
          style={{ left: 120 }}
          onClick={() => setShowMenu((prev) => !prev)}
          className="rounded !text-black font-semibold py-2 px-5">
          Add Node
          <span className="ml-1">
            {showMenu ? (
              <i className="fa-solid fa-angle-down"></i>
            ) : (
              <i className="fa-solid fa-bars"></i>
            )}
          </span>
        </Panel>
        {showMenu && <NodeMenuPanel setShowMenu={setShowMenu} setNodes={setNodes} />}
      </ReactFlow>
    </div>
  );
}

export default Flow;
