import React, { memo, useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import { v4 as uuid } from "uuid";
import { useStore } from "../context/store";
import { TextInput } from "../models/TextInput";

const VisitPageNode = ({ id, data, isConnectable, xPos, yPos }) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const { sourceHandleId, targetHandleId, inPorts } = data;
  const [edges] = useStore((store) => store.edges);

  function commitChange(params: any) {
    const inputNode = new TextInput({
      id,
      type: "visitNode",
      data,
      position: { x: xPos, y: yPos },
      inPorts: { url: nameRef?.current?.value },
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
    <div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        id={sourceHandleId || uuid()}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div>
        <div className="p-1 px-2 border-solid border-[1px] border-gray-600 rounded-tl rounded-tr">
          <label htmlFor="page">User visit</label>
        </div>

        <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
          <input
            id="page"
            type="text"
            ref={nameRef}
            defaultValue={inPorts?.url || ""}
            placeholder="Page url"
            style={{ color: "black", paddingLeft: "4px" }}
          />
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={targetHandleId || uuid()}
        onConnect={commitChange}
        style={{ top: 10, background: "#555" }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(VisitPageNode);
