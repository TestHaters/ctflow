import React, { useState, useCallback, useRef, useEffect } from "react";
import { vscode } from "./utilities/vscode";
import pick from "lodash.pick";
import get from "lodash.get";
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
import { useStore } from "./context/store";
import NodeMenuPanel from "./NodeMenuPanel";
import CompilePanel from "./CompilePanel";
import { useOnClickOutside } from "./useClickOutside";
import { Compiler } from "./compiler";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

// const initialNodes = [
//   {
//     id: "1",
//     data: { label: "PUSH_EVENT_HERE" },
//     position: { x: 40, y: 40 },
//   },
//   {
//     id: "9",
//     type: "visitNode",
//     data: { sourceHandleId: "a", targetHandleId: "b", label: "" },
//     style: { border: "1px solid #777", padding: 10 },
//     position: { x: 10, y: 100 },
//   },
//   {
//     id: "2",
//     type: "textInputType",
//     data: { sourceHandleId: "c", targetHandleId: "d", label: "" },
//     style: { border: "1px solid #777", padding: 10 },
//     position: { x: 380, y: 50 },
//   },
//   {
//     id: "3",
//     type: "textInputType",
//     data: { sourceHandleId: "e", targetHandleId: "f", label: "" },
//     style: { border: "1px solid #777", padding: 10 },
//     position: { x: 680, y: 50 },
//   },
//   {
//     id: "4",
//     type: "textInputType",
//     data: { sourceHandleId: "g", targetHandleId: "h", label: "" },
//     style: { border: "1px solid #777", padding: 10 },
//     position: { x: 980, y: 50 },
//   },
//   {
//     id: "5",
//     type: "checkboxNode",
//     data: { sourceHandleId: "i", targetHandleId: "k", label: "" },
//     style: { border: "1px solid #777", padding: 10 },
//     position: { x: 1280, y: 50 },
//   },
//   {
//     id: "6",
//     type: "buttonNode",
//     data: { sourceHandleId: "l", targetHandleId: "m", label: "" },
//     style: { border: "1px solid #777", padding: 10 },
//     position: { x: 1580, y: 50 },
//   },
//   {
//     id: "8",
//     data: { label: "End", color: "" },
//     position: { x: 1880, y: 40 },
//   },
//   {
//     id: "7",
//     data: { label: "Submit", color: "" },
//     position: { x: 900, y: 300 },
//     type: "input",
//   },
// ];

const initialEdges = [] as any;

const nodeTypes = {
  buttonNode: ButtonNode,
  textInputType: TextInputNode,
  visitNode: VisitPageNode,
  checkboxNode: CheckboxNode,
};

function Flow() {
  const [nodes, setNodes] = useState<
    Node<{
      color?: string;
      label: string;
    }>[]
  >([]);
  const [edges, setEdges] = useState(initialEdges);
  const [store] = useStore((store) => store);
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
    }
  }

  function handleCompile(event: any) {
    let compiledText = Compiler.compile(store)

    vscode.postMessage({
      type: 'writeCompiledFile',
      data: { compiledText: compiledText, fileExtension: "spec.js" }
    })

    return true
  }

  useEffect(() => {
    window.addEventListener("message", handleCallback);

    () => window.removeEventListener("message", handleCallback);
  }, []);

  const onConnect = useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), []);

  const runTest = useCallback(
    (_event: any, node: any) => {
      if (node.data.label === "PUSH_EVENT_HERE") {
        // vscode.postMessage({
        //   type: "fireEventFromEditor",
        //   data: { eventType: "fileUpdate" },
        // });
      }
      if (node.id === "7") {
        const payload = { nodes: store.nodes, edges: store.edges };
        console.log("submit", payload);
      }
      if (node.data.label?.toLowerCase() !== "run") return;
      fetch("http://localhost:33333/", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        // mode: "no-cors", // no-cors, *cors, same-origin
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ a: 1, b: "Textual content" }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    },
    [store]
  );

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
        <Panel
          position="top-left"
          onClick={() => setShowMenu((prev) => !prev)}
          className="rounded !text-black font-semibold py-2 px-5">
          Add Node{" "}
          {showMenu ? (
            <i className="fa-solid fa-angles-right"></i>
          ) : (
            <i className="fa-solid fa-angle-right"></i>
          )}
        </Panel>
        {showMenu && <NodeMenuPanel setShowMenu={setShowMenu} setNodes={setNodes} />}
        <CompilePanel onClick={handleCompile} />
      </ReactFlow>
    </div>
  );
}

export default Flow;
