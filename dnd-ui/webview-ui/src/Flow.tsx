import React, { useState, useCallback } from "react";
import { vscode } from "./utilities/vscode";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import { useStore } from './context/store';
import "reactflow/dist/style.css";
import axios from "axios";
import TextInputNode from "./nodes/TextInputNode";
import VisitPageNode from "./nodes/VisitPageNode";
import CheckboxNode from "./nodes/CheckboxNode";
import ButtonNode from "./nodes/ButtonNode";
import { useStore } from "./context/store";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const initialNodes = [
  {
    id: "1",
    data: { label: "PUSH_EVENT_HERE" },
    position: { x: 40, y: 40 },
  },
  {
    id: "9",
    type: "visitNode",
    data: { color: "#1A192B" },
    style: { border: "1px solid #777", padding: 10 },
    position: { x: 10, y: 100 },
  },
  {
    id: "2",
    type: "textInputType",
    data: { color: "#1A192B" },
    style: { border: "1px solid #777", padding: 10 },
    position: { x: 380, y: 50 },
  },
  {
    id: "3",
    type: "textInputType",
    data: { color: "#1A192B" },
    style: { border: "1px solid #777", padding: 10 },
    position: { x: 680, y: 50 },
  },
  {
    id: "4",
    type: "textInputType",
    data: { color: "#1A192B" },
    style: { border: "1px solid #777", padding: 10 },
    position: { x: 980, y: 50 },
  },
  {
    id: "5",
    type: "checkboxNode",
    data: { color: "#1A192B" },
    style: { border: "1px solid #777", padding: 10 },
    position: { x: 1280, y: 50 },
  },
  {
    id: "6",
    type: "buttonNode",
    data: { color: "#1A192B" },
    style: { border: "1px solid #777", padding: 10 },
    position: { x: 1580, y: 50 },
  },
  {
    id: "8",
    data: { label: "End" },
    position: { x: 1880, y: 40 },
  },
  {
    id: "7",
    data: { label: "Submit" },
    position: { x: 900, y: 300 },
    type: "input",
  },
];

const initialEdges = [
  // { id: "1-2", source: "1", target: "2", targetHandle: 'w', type: "step" },
  // { id: "2-3", source: "2", target: "3", sourceHandle: 'a', type: "step" },
  // { id: "2-4", source: "2", target: "4", sourceHandle: 'b', type: "step" },
] as any;

const nodeTypes = {
  buttonNode: ButtonNode,
  textInputType: TextInputNode,
  visitNode: VisitPageNode,
  checkboxNode: CheckboxNode,
};

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [router, _] = useStore(store => store.router);
  const [store] = useStore(store => store);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), []);

  const runTest = useCallback((_event: any, node: any) => {
    if (node.data.label === 'PUSH_EVENT_HERE') {
      vscode.postMessage({
        type: 'fireEventFromEditor',
        data: { eventType: 'fileUpdate' }
      })
    }
    if (node.id === '7') {
      const payload = { nodes: store.nodes, edges: store.edges }
      console.log('submit', payload);
      
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
  }, [store]);

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
      </ReactFlow>
    </div>
  );
}

export default Flow;
