// @ts-nocheck
import React, { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { v4 as uuid } from 'uuid';
import { useStore } from '../context/store';
import { TextInput } from '../models/TextInput';
import { size } from 'lodash';

const noType = { email: false, password: false, text: false };

const ButtonNode = (props) => {
  const { id, data, isConnectable, xPos, yPos } = props;
  const reactFlowInstance = useReactFlow();

  const [name, setName] = useState(data?.inPorts?.field || '');
  const [description, setDescription] = useState(data?.inPorts?.description || '')
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges] = useStore((store) => store.edges);
  const { sourceHandleId, targetHandleId, inPorts } = data;

  function commitChange(params: any) {
    const inputNode = new TextInput({
      id,
      type: 'buttonNode',
      data,
      position: { x: xPos, y: yPos },
      inPorts: { description, field: name },
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
        [id]: { ...nodesStore[id], inPorts: { field: name, description } },
      },
    });
  }, [name, description]);

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


        <div className="p-1 px-2 border-solid border-[1px] border-gray-600  rounded-tl rounded-tr">
          <span className="mr-1">
            <i className="fa-solid fa-arrow-pointer"></i>
          </span>
          <label>User click</label>
          <span className="float-right" onClick={handleRemoveNode}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>

        <div className="p-2 border-solid border-[1px] border-t-0 border-b-0 border-gray-600  ">

        </div>


        <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            defaultValue={inPorts?.field}
            placeholder="Your selector"
            style={{ color: 'black', paddingLeft: '4px' }}
          />
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

export default memo(ButtonNode);
