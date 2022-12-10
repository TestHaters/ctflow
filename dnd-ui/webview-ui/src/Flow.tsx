import React, { useState, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const initialNodes = [
  {
    id: "1",
    data: { label: "Run" },
    position: { x: 40, y: 40 },
    type: "input",
  },
  {
    id: "2",
    data: { label: "First case" },
    position: { x: 300, y: 100 },
  },
];

const initialEdges = [{ id: "1-2", source: "1", target: "2", type: "step" }] as any;

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
    console.log("node", node);
    if (node.data.label.toLowerCase() !== "run") return;
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
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
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