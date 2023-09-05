/* eslint-disable react/prop-types */
// @ts-nocheck
import React, { memo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Handle, Position, useReactFlow } from 'reactflow';
import { useStore } from '../context/store';
import { CustomNodeInput } from '../models/CustomNodeInput';
import { faPuzzlePiece, faXmark } from '@fortawesome/free-solid-svg-icons';

const CustomNodeRender = (props) => {
  const { id, data, isConnectable, xPos, yPos } = props;
  const { sourceHandleId, targetHandleId, inPorts, customNode } = data;
  const reactFlowInstance = useReactFlow();

  // const [values, setValues] = useState(data?.inPorts?.field || '');
  const initialVals = Object.keys(customNode.params).reduce(
    (acc, key) => ({ ...acc, [key]: '' }),
    {}
  );
  const emptyVals = Object.keys(inPorts?.values || {}).every(
    (key) => inPorts.values[key] === ''
  );
  const [values, setValues] = useState(
    emptyVals ? initialVals : { ...inPorts.values }
  );
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges] = useStore((store) => store.edges);

  function commitChange(params: any) {
    const inputNode = new CustomNodeInput({
      id,
      type: 'customNode',
      data,
      position: { x: xPos, y: yPos },
      inPorts: { values },
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

  function updateNodeValue() {
    const inputNode = new CustomNodeInput({
      id,
      type: 'customNode',
      data,
      position: { x: xPos, y: yPos },
      inPorts: { values },
      outPorts: {},
    });
    setNodeStore({
      nodes: {
        ...nodesStore,
        [id]: { ...inputNode },
      },
    });
  }

  function handleRemoveNode() {
    reactFlowInstance.setNodes((nds) => nds.filter((node) => node.id !== id));
  }

  return (
    <div>
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
            <FontAwesomeIcon icon={faPuzzlePiece} />
          </span>
          <label>{customNode?.name || ''}</label>
          <span className="float-right" onClick={handleRemoveNode}>
            <FontAwesomeIcon icon={faXmark} />
          </span>
        </div>

        {Object.keys(customNode.params).map((key, index, array) => {
          return (
            <div
              key={key}
              className={`p-2 ${
                index === array.length - 1
                  ? 'border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br'
                  : 'border-solid border-x border-t-0 border-gray-600'
              }`}
            >
              <label className="block">{customNode.params[key]}</label>
              <input
                type="text"
                className="nodrag"
                value={values[key]}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [key]: e.target.value }))
                }
                onBlur={updateNodeValue}
                // defaultValue={inPorts?.field}
                placeholder="Your selector"
                style={{ color: 'black', paddingLeft: '4px' }}
              />
            </div>
          );
        })}
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

export default memo(CustomNodeRender);
