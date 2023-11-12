// @ts-nocheck
import React, { memo, useEffect, useRef, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { v4 as uuid } from 'uuid';
import { useStore } from '../context/store';
import { TextArea } from '../models/TextArea';
import YAML from 'yaml';
import { useNodesState, useEdgesState } from 'reactflow';
import { watchOnKey } from '../socket/firebase';
import { Timestamp } from 'firebase/firestore';
import { watch } from 'fs';

const noType = { email: false, password: false, text: false };

const CTFlowRecorderNode = (props) => {
  const { id, data, isConnectable, xPos, yPos } = props;
  const reactFlowInstance = useReactFlow();

  const [code, setCode] = useState(data?.inPorts?.code || '');
  const [recordingId, setRecordingId] = useState(
    data?.inPorts?.recordingId || ''
  );
  const [description, setDescription] = useState(
    data?.inPorts?.description || ''
  );
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges, setEdgeStore] = useStore((store) => store.edges);
  const [store, setStore] = useStore((store) => store);
  const { sourceHandleId, targetHandleId, inPorts } = data;
  const [watchMode, setWatchMode] = useState(false);

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

  // call 1 time when component int.
  useEffect(() => {
    console.log(watchMode)

    if (!watchMode && recordingId) {
      return () => {
        console.log('Ignore Watch Mode', watchMode, recordingId);
      };
    }

    const unsub = watchOnKey('recorders', recordingId, (doc) => {
      console.log('watch on key');
      const source = doc.metadata.hasPendingWrites ? 'Local' : 'Server';
      console.log(source, ' data: ', doc.data());

      const snapshotData = doc.data();
      const payload = { nodes: {}, edges: {} };

      // nodeId is timestamp but not uuid
      // we want to translate it to uuid but keep the references
      const timestamps_uuids = {};

      snapshotData.nodes.forEach((node) => {
        const newId = uuid();
        timestamps_uuids[node.id] = newId;
        node.tags = [
          'recording-id:' + recordingId,
          'original-recording-node-id:' + node.id,
        ];
        node.id = newId;
        payload.nodes[node.id] = node;
      });

      snapshotData.edges.forEach((edge) => {
        edge.source = timestamps_uuids[edge.source];
        edge.target = timestamps_uuids[edge.target];
        edge.tags = ['recording-id:' + recordingId];
        payload.edges[edge.id] = edge;
      });

      Object.keys(payload.nodes).map((nodeId, index) => {
        payload.nodes[nodeId].position = {
          x: Number(xPos) + 250 * index,
          y: yPos,
        };
      });

      // What is this? is this the pucking CTFlow Recorder node?
      const textAreaNode = new TextArea({
        id,
        type: 'CTFlowRecorderNode',
        data,
        position: {
          // new node position is based on the number of parsed nodes
          x: xPos + (Object.keys(payload.nodes).length + 1) * 250,
          y: yPos,
        },
        inPorts: { code: '' },
        outPorts: {},
      });

      console.log('textAreaNode', textAreaNode);

      // Remove duplicated nodes that generated from this recorder through tags with recording-id:${recordingId}
      const deduplicatedNodesStore = Object.fromEntries(
        Object.entries(nodesStore).filter(
          ([nodeId, node]) =>
            !node.tags?.includes('recording-id:' + recordingId)
        )
      );
      console.log('deduplicatedNodes', deduplicatedNodesStore);

      const newNodeStore = {
        ...deduplicatedNodesStore,
        ...payload.nodes,
        [id]: { ...deduplicatedNodesStore[id], ...textAreaNode, description },
      };

      const deduplicatedEdges = Object.fromEntries(
        Object.entries(edges).filter(
          ([edgeId, edge]) =>
            !edge.tags?.includes('recording-id:' + recordingId)
        )
      );

      const newEdgeStore = {
        ...deduplicatedEdges,
        ...payload.edges,
      };

      setNodeStore({
        nodes: newNodeStore,
        edges: newEdgeStore,
      });

      console.log('payload', payload);
      console.log('nodesStore', nodesStore);

      const event = new CustomEvent('message', {
        detail: {
          type: 'reloadReactFlow',
          storeState: { nodes: newNodeStore, edges: newEdgeStore },
        },
      });
      window.dispatchEvent(event);
    });

    // when unmount, call unsub
    return async () => {
      await unsub;
    };
  }, [watchMode]);

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
          <label>CTFlow Recorder</label>
          <span className="float-right" onClick={handleRemoveNode}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>

        <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
          <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
            <div className="py-2"> Recording key </div>

            <input
              value={recordingId}
              onPaste={(e) => {
                setRecordingId(e.target.value);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onChange={(e) => {
                setRecordingId(e.target.value);
              }}
              placeholder="an uuid"
              type="string"
              style={{
                color: 'black',
                paddingLeft: '4px',
                width: '250px',
                textAlign: 'center',
              }}
            />

            <button
              onClick={() => {
                setWatchMode(!watchMode);
              }}
            >
              {watchMode ? 'Stop Watching' : 'Start Watching'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CTFlowRecorderNode);
