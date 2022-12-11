import React, { memo, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import { v4 as uuid } from "uuid";
import { useStore } from "../context/store";
import { TextInput } from "../models/TextInput";

const noType = { email: false, password: false, text: false };

const CheckboxNode = ({ id, data, isConnectable, xPos, yPos }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const { sourceHandleId, targetHandleId } = data;
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges] = useStore((store) => store.edges);

  function commitChange(params: any) {
    const inputNode = new TextInput({
      id,
      type: "text",
      data,
      position: { x: xPos, y: yPos },
      inPorts: { field: nameRef?.current?.value, isChecked: valueRef?.current?.value },
      outPorts: {},
    });
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
        id={sourceHandleId || uuid()}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <h5>User click on check box</h5>
      <div>
        <input type="text" ref={nameRef} placeholder="Your selector" />
      </div>
      <br />
      <div>
        <label htmlFor="email">status</label>
        <input
          type="checkbox"
          ref={valueRef}
          id="email"
          checked={Boolean(valueRef?.current?.value)}
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={targetHandleId || uuid()}
        onConnect={commitChange}
        style={{ top: 10, background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default memo(CheckboxNode);
