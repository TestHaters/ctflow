// @ts-nocheck
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Node, Viewport } from 'reactflow';
import { RFNode } from '../models/nodeFactory';
import { NodeDataType } from '../pages/Flow';

export default function CustomNodeList({
  setShow,
  setModal,
  viewport,
  setNodes,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<number>>;
  viewport: Viewport;
  setNodes: Dispatch<SetStateAction<Node<NodeDataType>[]>>;
}) {
  const [customNodes, setCustomNodes] = useState<any[]>([]);
  useEffect(() => {
    window.addEventListener('message', handleCallback);
    () => window.removeEventListener('message', handleCallback);
  }, []);

  function handleCallback(event: any) {
    if (event?.data?.type === 'customNodeList') {
      setCustomNodes(event.data.payload.customNodes);
    }
  }

  function handleSelectNode(event: any, nodeData: any) {
    setShow(false);
    const { x, y, zoom } = viewport;
    const curX = x / zoom;
    const curY = y / zoom;
    const newNode = new RFNode({
      type: 'customNode',
      position: {
        x: event.clientX - curX + 20,
        y: event.clientY - curY + 20,
      },
      data: { customNode: { ...nodeData } },
    });
    setNodes((prev) => [...prev, newNode]);
  }
  return (
    <div className="bg-white w-[300px] h-[583px] p-2">
      <div className="pb-4">
        <div className="flex pb-2 justify-between items-center">
          <div className="font-bold text-lg flex items-center mx-auto text-black">
            Custom node list
          </div>
          <div>
            <button className="block m-2" onClick={() => setModal(0)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
        <hr />
        <br />
        {customNodes.map((node, index, array) => {
          return (
            <div
              key={node.id}
              className="text-base hover:bg-slate-200 p-2 rounded cursor-pointer"
              onClick={(event) => handleSelectNode(event, node)}
            >
              <button id={'custom_node' + node.id}>{node.name}</button>
              <div className="text-xs text-black italic">
                {node.description}
              </div>
              {index !== array.length - 1 && <br />}
              {index !== array.length - 1 && <hr />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
