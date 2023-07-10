// @ts-nocheck
import React, { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { v4 as uuid } from 'uuid';
import { TextInput } from '../../models/TextInput';
import { useStore } from '../../context/store';

const VisitPageNode = (props) => {
  const { id, data, isConnectable, xPos, yPos } = props;
  const [url, setUrl] = useState<string>(data?.inPorts?.url || '');
  const [description, setDescription] = useState(
    data?.inPorts?.description || ''
  );
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const { sourceHandleId, targetHandleId, inPorts } = data;
  const [edges] = useStore((store) => store.edges);
  const reactFlowInstance = useReactFlow();

  function commitChange(params: any) {
    const inputNode = new TextInput({
      id,
      type: 'visitNode',
      data,
      position: { x: xPos, y: yPos },
      inPorts: { url, description },
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
    console.log('url', url);
    setNodeStore({
      nodes: {
        ...nodesStore,
        [id]: { ...nodesStore[id], inPorts: { url, description } },
      },
    });
  }, [url, description]);

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
            className="nodrag"
            id="page"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Page url"
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

export default memo(VisitPageNode);
