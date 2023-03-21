// @ts-nocheck
import React, { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { v4 as uuid } from 'uuid';
import { useStore } from '../context/store';
import { TextArea } from '../models/TextArea';
import YAML from 'yaml';
import { useNodesState, useEdgesState } from 'reactflow';

const noType = { email: false, password: false, text: false };

const CTFlowRecorderNode = (props) => {
  const { id, data, isConnectable, xPos, yPos } = props;
  const reactFlowInstance = useReactFlow();

  const [code, setCode] = useState(data?.inPorts?.code || '');
  const [description, setDescription] = useState(
    data?.inPorts?.description || ''
  );
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges, setEdgeStore] = useStore((store) => store.edges);
  const [store, setStore] = useStore((store) => store);
  const { sourceHandleId, targetHandleId, inPorts } = data;

  function commitChange(params: any) {
    const textAreaNode = new TextArea({
      id,
      type: 'CTFlowRecorderNode',
      data,
      position: { x: xPos, y: yPos },
      inPorts: { code: code, description },
      outPorts: {},
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
    const parsedData = parseCTFlowCode(code);

    const textAreaNode = new TextArea({
      id,
      type: 'CTFlowRecorderNode',
      data,
      position: {
        // new node position is based on the number of parsed nodes
        x: xPos + (Object.keys(parsedData.nodes).length + 1) * 250,
        y: yPos,
      },
      inPorts: { code: '' },
      outPorts: {},
    });

    console.log('textAreaNode', textAreaNode);

    const newNodeStore = {
      ...nodesStore,
      ...parsedData.nodes,
      [id]: { ...nodesStore[id], ...textAreaNode, description },
    };

    const newEdgeStore = {
      ...edges,
      ...parsedData.edges,
    };

    setNodeStore({
      nodes: newNodeStore,
      edges: newEdgeStore,
    });

    console.log('parsedData', parsedData);
    console.log('nodesStore', nodesStore);
    const event = new CustomEvent('message', {
      detail: {
        type: 'reloadReactFlow',
        storeState: { nodes: newNodeStore, edges: newEdgeStore },
      },
    });
    window.dispatchEvent(event);
  }, [code, description]);

  // from code (YAML format), get all nodes and edges
  // for each node, create a new node with position from left to right.
  function parseCTFlowCode(code: string) {
    // TODO - better error handling
    let payload = null;
    try {
      payload = YAML.parse(code);
    } catch (error) {
      console.log('Fail to parse YAML');
    }
    if (payload === null) {
      return { nodes: {}, edges: {} };
    }

    // by default, all nodes position is 0,0
    // we need to calculate the position for each node
    // so that they are placed from left to right
    Object.keys(payload.nodes).map((nodeId, index) => {
      payload.nodes[nodeId].position = {
        x: Number(xPos) + 250 * index,
        y: yPos,
      };
    });

    return payload;
  }

  return (
    <div className="w-72">
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
          className="nodrag w-full text-xs font-xs italic bg-gray-500 text-white resize-none"
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
        onConnect={(params) => commitChange(params)}
        isConnectable={isConnectable}
      />

      <div>
        <div className="p-1 px-2 border-solid border-[1px] border-gray-600 rounded-tl rounded-tr">
          <span className="mr-1">
            <i className="fa-solid fa-arrow-pointer"></i>
          </span>
          <label>CTFlow Scripts</label>
          <span className="float-right" onClick={handleRemoveNode}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>

        <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
          <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
            <div className="py-2"> Code from CTFlow Recorder </div>

            <textarea
              className="nodrag"
              onChange={(e) => setCode(e.target.value)}
              value={''}
              style={{
                color: 'black',
                paddingLeft: '4px',
                width: '250px',
                height: '300px',
              }}
            ></textarea>

            <div className="btn">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-3"
                onClick={() => {
                  generateGraph(code);
                }}
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CTFlowRecorderNode);
