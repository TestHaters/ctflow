// @ts-nocheck
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Node, Viewport } from 'reactflow';
import { ICustomNode } from '../../types/customNodes';
import { RFNode } from '../../models/nodeFactory';
import { NodeDataType } from '../../pages/Flow';

export default function CustomNodeList({
  setShow,
  setModal,
  viewport,
  setNodes,
  setCurNode,
}: {
  setShow: Dispatch<SetStateAction<boolean>>;
  setModal: Dispatch<SetStateAction<number>>;
  viewport: Viewport;
  setNodes: Dispatch<SetStateAction<Node<NodeDataType>[]>>;
  setCurNode: Dispatch<SetStateAction<ICustomNode | null>>;
}) {
  const [customNodes, setCustomNodes] = useState<ICustomNode[]>([]);
  useEffect(() => {
    window.addEventListener('message', handleCallback);
    () => window.removeEventListener('message', handleCallback);
  }, []);

  function handleCallback(event: React.MouseEvent<HTMLElement>) {
    if (event?.data?.type === 'customNodeList') {
      setCustomNodes(event.data.payload.customNodes);
    }
  }

  function handleSelectNode(
    event: React.MouseEvent<HTMLElement>,
    nodeData: ICustomNode
  ) {
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

  function handleEdit(event: React.MouseEvent<HTMLElement>, node) {
    event.stopPropagation();
    setCurNode(customNodes.find((n) => n.id === node.id));
    setModal(4);
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
              <div className="group flex">
                <button id={'custom_node' + node.id}>{node.name}</button>
                &nbsp;&nbsp;
                <button
                  className="hidden group-hover:block"
                  onClick={(event) => handleEdit(event, node)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </div>
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
