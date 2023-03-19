import { Dispatch, SetStateAction, useState } from 'react';
import { Node, Panel, Viewport } from 'reactflow';
import { NodeDataType } from '../pages/Flow';
import { vscode } from '../utilities/vscode';
import CustomNodeForm from './CustomNodeForm';
import CustomNodeList from './CustomNodeList';

interface IMenuPanelProps {
  viewport: Viewport;
  setNodes: Dispatch<SetStateAction<Node<NodeDataType>[]>>;
}

export default function MenuPanel({ viewport, setNodes }: IMenuPanelProps) {
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState<number>(0);
  return (
    <>
      <Panel
        position="top-left"
        style={{ left: 230 }}
        onClick={() => setShow((prev) => !prev)}
        className="rounded !text-black font-semibold py-2 px-5 cursor-pointer"
      >
        <span className="ml-1">
          <i className="fa-solid fa-bars"></i>
        </span>
      </Panel>
      {show && (
        <Panel
          position="top-left"
          style={{ left: 242, top: 50, width: 150, marginLeft: 10 }}
        >
          <div className="hover:bg-slate-200 p-2 rounded">
            <button
              id="custom-node-openner"
              onClick={() => {
                setShow(false);
                setModal(1);
              }}
            >
              Create custom node
            </button>
          </div>
          <div className="hover:bg-slate-200 p-2 rounded">
            <button
              id="custom-node-openner"
              className="flex justify-between items-center w-full"
              onClick={() => {
                vscode.postMessage({ type: 'fetchCustomNodes' });
                setShow(false);
                setModal(2);
              }}
            >
              <span>Custom nodes list</span>
            </button>
          </div>
        </Panel>
      )}
      {modal === 1 && (
        <Panel position="top-right" style={{ right: 10 }}>
          <CustomNodeForm setModal={setModal} />
        </Panel>
      )}
      {modal === 2 && (
        <Panel
          position="top-left"
          style={{ left: 6, top: 50, width: 200, marginLeft: 10 }}
        >
          <CustomNodeList
            setShow={setShow}
            setModal={setModal}
            viewport={viewport}
            setNodes={setNodes}
          />
        </Panel>
      )}
    </>
  );
}
