import { useState } from 'react';
import { Panel } from 'reactflow';
import CustomNodeForm from './CustomNodeForm';

export default function MenuPanel() {
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
              onClick={() => {
                setShow(false);
                setModal(1);
              }}
            >
              Custom nodes list
            </button>
          </div>
        </Panel>
      )}
      {modal === 1 && (
        <Panel position="top-right" style={{ right: 10 }}>
          <CustomNodeForm setModal={setModal} />
        </Panel>
      )}
    </>
  );
}
