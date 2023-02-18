import 'reactflow/dist/style.css';

import get from 'lodash.get';
import omit from 'lodash.omit';
import pick from 'lodash.pick';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
    addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, Edge, Node, Panel
} from 'reactflow';
import YAML from 'yaml';

import { Compiler } from '@testhaters/cypress-compiler';

import CompilePanel from './CompilePanel';
import { useStore } from './context/store';
import NodeMenuPanel from './NodeMenuPanel';
import ButtonNode from './nodes/ButtonNode';
import CheckboxNode from './nodes/CheckboxNode';
import ContainsNode from './nodes/ContainsNode';
import TextInputNode from './nodes/TextInputNode';
import VisitPageNode from './nodes/VisitPageNode';
import WaitNode from './nodes/WaitNode';
import SavePanel from './SavePanel';
import { vscode } from './utilities/vscode';

const initialEdges = [] as any;

const nodeTypes = {
  buttonNode: ButtonNode,
  textInputType: TextInputNode,
  visitNode: VisitPageNode,
  checkboxNode: CheckboxNode,
  containsNode: ContainsNode,
  waitNode: WaitNode,
};

function Flow() {
  const [nodes, setNodes] = useState<
    Node<{
      color?: string;
      label: string;
    }>[]
  >([]);
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
      data: { compiledText: compiledText, fileExtension: "cy.js" },
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
