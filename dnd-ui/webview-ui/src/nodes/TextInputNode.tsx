import React, { memo, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import { v4 as uuid }  from 'uuid';
import { useStore } from "../context/store";
import { TextInput } from "../models/TextInput";

const noType = { email: false, password: false, text: false };

const TextInputNode = ({ id, data, isConnectable, xPos, yPos }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const { sourceHandleId, targetHandleId } = data;
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges] = useStore((store) => store.edges);
  const [textType, setTextType] = useState("text");

  function commitChange(params: any) {
    const inputNode = new TextInput({
      id,
      type: "textInputType",
      data,
      position: { x: xPos, y: yPos },
      inPorts: { field: nameRef?.current?.value, email: valueRef?.current?.value },
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
      <h5>User type</h5>
      <div>
        <input type="text" ref={nameRef} placeholder="Your selector" />
      </div>
      <br />
      <div>
        <input className="nodrag" type={textType} ref={valueRef} placeholder="Your value"/>
      </div>
      <br />
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

export default memo(TextInputNode);
