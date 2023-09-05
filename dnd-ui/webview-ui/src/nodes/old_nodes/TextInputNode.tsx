// @ts-nocheck
import React, { memo, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { v4 as uuid } from 'uuid';
import { useStore } from '../../context/store';
import { TextInput } from '../../models/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faKeyboard } from '@fortawesome/free-regular-svg-icons';

const TextInputNode = ({ id, data, isConnectable, xPos, yPos }) => {
  const [name, setName] = useState(data?.inPorts?.field || '');
  const [value, setValue] = useState(data?.inPorts?.value || '');
  const [description, setDescription] = useState(
    data?.inPorts?.description || ''
  );
  const { sourceHandleId, targetHandleId, inPorts } = data;
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges] = useStore((store) => store.edges);
  const reactFlowInstance = useReactFlow();

  function commitChange(params: any) {
    const inputNode = new TextInput({
      id,
      type: 'textInputType',
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

  function handleNameChange(event: KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    setName(event.target.value);
  }

  function handleValueChange(event: KeyboardEvent<HTMLInputElement>) {
    event.preventDefault();
    setValue(event.target.value);
  }

  useEffect(() => {
    setNodeStore({
      nodes: {
        ...nodesStore,
        [id]: {
          ...nodesStore[id],
          inPorts: { field: name, value, description },
        },
      },
    });
  }, [name, value, description]);

  return (
    <div className="w-48">
      <div
        role="tooltip"
        className=" z-10 block inline-block px-3 py-2 w-full
      text-xs font-xs text-white bg-gray-500 rounded-lg shadow-sm
      tooltip resize"
        style={{}}
      >
        <textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this node about?"
          className="w-full text-xs font-xs italic bg-gray-500 text-white resize-none"
          style={{ paddingLeft: '4px', fontSize: '70%' }}
        />
      </div>
      <div
        className="mt-2 pt-0 text-center w-full text-gray-500"
        style={{ marginTop: '-8px' }}
      >
        {' '}
        ▼{' '}
      </div>

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
            <FontAwesomeIcon icon={faKeyboard} />
          </span>
          <label>User type</label>
          <span className="float-right" onClick={handleRemoveNode}>
            <FontAwesomeIcon icon={faXmark} />
          </span>
        </div>
        <div className="px-2 pb-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
          <div>
            <div>
              <label className="text-[11px]">Selector</label>
            </div>
            <input
              className="nodrag"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Your selector"
              style={{ color: 'black', paddingLeft: '4px' }}
            />
          </div>
          <div className="mt-2">
            <div>
              <label className="text-[11px]">Value</label>
            </div>
            <input
              className="nodrag"
              value={value}
              onChange={handleValueChange}
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
        style={{ background: '#555', width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(TextInputNode);
