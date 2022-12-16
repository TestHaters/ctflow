import React, { memo, useEffect, useRef, useState } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { v4 as uuid } from "uuid";
import { useStore } from "../context/store";
import { TextInput } from "../models/TextInput";

const VisitPageNode = (props) => {
  const { id, data, isConnectable, xPos, yPos } = props;
  const [url, setUrl] = useState<string>(data?.inPorts?.url || "");
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const { sourceHandleId, targetHandleId, inPorts } = data;
  const [edges] = useStore((store) => store.edges);
  const reactFlowInstance = useReactFlow();

  function commitChange(params: any) {
    const inputNode = new TextInput({
      id,
      type: "visitNode",
      data,
      position: { x: xPos, y: yPos },
      inPorts: { url },
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

  function handleRemoveNode() {
    reactFlowInstance.setNodes((nds) => nds.filter((node) => node.id !== id));
  }

  useEffect(() => {
    setNodeStore({ nodes: { ...nodesStore, [id]: { ...nodesStore[id], inPorts: { url } } } });
  }, [url]);

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
          <label htmlFor="page">
            <span className="mr-1">
              <i className="fa-solid fa-door-open"></i>
            </span>
            User visit
          </label>
          <span className="float-right" onClick={handleRemoveNode}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>

        <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
          <input
            id="page"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
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
