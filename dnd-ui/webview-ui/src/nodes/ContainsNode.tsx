// @ts-nocheck
import React, { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { v4 as uuid } from 'uuid';
import { useStore } from '../context/store';
import { TextInput } from '../models/TextInput';

const TextInputNode = ({ id, data, isConnectable, xPos, yPos }) => {
  const [name, setName] = useState(data?.inPorts?.field || '');
  const [value, setValue] = useState(data?.inPorts?.value || '');
  const [description, setDescription] = useState(data?.inPorts?.description || '')
  const { sourceHandleId, targetHandleId, inPorts } = data;
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges] = useStore((store) => store.edges);
  const [textType, setTextType] = useState('text');
  const reactFlowInstance = useReactFlow();

  function commitChange(params: any) {
    const inputNode = new TextInput({
      id,
      type: 'containsNode',
      data,
      position: { x: xPos, y: yPos },
      inPorts: { field: name, value, description },
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
    setNodeStore({
      nodes: {
        ...nodesStore,
        [id]: { ...nodesStore[id], inPorts: { field: name, value, description } },
      },
    });
  }, [name, value, description]);

  return (
    <div className="w-48" >
      <div role="tooltip" className=" z-10 block inline-block px-3 py-2 w-full
      text-xs font-xs text-white bg-gray-500 rounded-lg shadow-sm
      tooltip resize" style={{}}>
          <textarea
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this node about?"
            className="w-full text-xs font-xs italic bg-gray-500 text-white resize-none"
            style={{  paddingLeft: '4px', fontSize: "70%"  }}
          />
      </div>
      <div className="mt-2 pt-0 text-center w-full text-gray-500" style={{marginTop: "-8px"}}> ▼ </div>


      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: 10, height: 10 }}
        id={sourceHandleId}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        <div className="p-1 px-2 border-solid border-[1px] border-gray-600 rounded-tl rounded-tr">
          <span className="mr-1">
            <i className="fa-solid fa-box"></i>
          </span>
          <label>Check contains</label>
          <span className="float-right" onClick={handleRemoveNode}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>
        <div className="px-2 pb-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
          <div>
            <div>
              <label className="text-[11px]">Selector</label>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your selector"
              style={{ color: 'black', paddingLeft: '4px' }}
            />
          </div>
          <div className="mt-2">
            <div>
              <label className="text-[11px]">Contains</label>
            </div>
            <input
              className="nodrag"
              type={textType}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Your value"
              style={{ color: 'black', paddingLeft: '4px' }}
            />
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={targetHandleId}
        onConnect={commitChange}
        style={{ top: 120, background: '#555', width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(TextInputNode);
