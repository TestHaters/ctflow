import React, { memo, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import { useStore } from "../context/store";
import { TextInput } from "../models/TextInput";

const VisitPageNode = ({ id, data, isConnectable, xPos, yPos }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges] = useStore((store) => store.edges);

  function commitChange(params: any) {
    const inputNode = new TextInput({
      id,
      type: "text",
      data,
      position: { x: xPos, y: yPos },
      inPorts: { url: nameRef?.current?.value },
      outPorts: {},
    });
    console.log("inputNode VISIT", inputNode);
    setNodeStore({
      nodes: {
        ...nodesStore,
        [id]: { ...inputNode },
      },
      edges: {
        ...edges,
        [id]: params,
      },
    });
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        id="w"
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div>
        <label htmlFor="page">Visit</label>
        &nbsp; &nbsp;
        <input id="page" type="text" ref={nameRef} placeholder="Page url" />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        onConnect={commitChange}
        style={{ top: 10, background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default memo(VisitPageNode);
