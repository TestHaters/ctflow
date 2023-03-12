// @ts-nocheck
import React, { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { v4 as uuid } from 'uuid';
import { useStore } from '../context/store';
import { TextArea } from '../models/TextArea';

const noType = { email: false, password: false, text: false };

const CodeInjectionNode = (props) => {
  const { id, data, isConnectable, xPos, yPos } = props;
  const reactFlowInstance = useReactFlow();

  const [code, setCode] = useState(data?.inPorts?.code || '');
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges] = useStore((store) => store.edges);
  const { sourceHandleId, targetHandleId, inPorts } = data;

  function commitChange(params: any) {
    const textAreaNode = new TextArea({
      id,
      type: 'codeInjectionNode',
      data,
      position: { x: xPos, y: yPos },
      inPorts: { code: code },
      outPorts: { initFuckme: uuid() },
    });
    setNodeStore({
      nodes: {
        ...nodesStore,
        [id]: { ...textAreaNode },
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
    const textAreaNode = new TextArea({
      id,
      type: 'codeInjectionNode',
      data,
      position: { x: xPos, y: yPos },
      inPorts: { code: code },
      outPorts: { initFuckme: uuid() },
    });
    console.log('textAreaNode', textAreaNode);
    setNodeStore({
      nodes: {
        ...nodesStore,
        [id]: { ...nodesStore[id], ...textAreaNode },
      },
    });
  }, [code]);

  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: 10, height: 10 }}
        id={sourceHandleId}
        onConnect={(params) => commitChange(params)}
        isConnectable={isConnectable}
      />

      <div>
        <div className="p-1 px-2 border-solid border-[1px] border-gray-600 rounded-tl rounded-tr">
          <span className="mr-1">
            <i className="fa-solid fa-arrow-pointer"></i>
          </span>
          <label>Injection Code</label>
          <span className="float-right" onClick={handleRemoveNode}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>

        <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">


          <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">

          <textarea
            onChange={(e) => setCode(e.target.value)}
            defaultValue={inPorts?.code}
            value={code}
            style={{ color: 'black', paddingLeft: '4px', width: "250px", height: "300px" }}
          >
          </textarea>


        </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={targetHandleId}
        onConnect={commitChange}
        style={{ top: 10, background: '#555', width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(CodeInjectionNode);
