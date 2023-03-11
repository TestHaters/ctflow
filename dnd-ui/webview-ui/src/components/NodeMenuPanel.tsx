// @ts-nocheck
import { memo, SetStateAction, useRef } from 'react';
import { Panel } from 'reactflow';
import { RFNode } from '../models/nodeFactory';

function NodeMenuPanel({
  setNodes,
  setShowMenu,
  showMenu,
}: {
  setNodes: SetStateAction<Dispatch<unknown>>;
  setShowMenu: SetStateAction<Dispatch<unknown>>;
  showMenu: boolean;
}) {
  const nodeMenuRef = useRef(null);

  function handleClick(event) {
    const newNode = new RFNode({
      type: event.target.getAttribute('id'),
    });
    setNodes((prev) => [...prev, newNode]);
    setShowMenu(false);
  }

  return (
    <>
      <Panel
        position="top-left"
        style={{ left: 120 }}
        onClick={() => setShowMenu((prev) => !prev)}
        className="rounded !text-black font-semibold py-2 px-5 cursor-pointer"
      >
        Add Node
        <span className="ml-1">
          {showMenu ? (
            <i className="fa-solid fa-angle-down"></i>
          ) : (
            <i className="fa-solid fa-plus"></i>
          )}
        </span>
      </Panel>
      {showMenu && (
        <section ref={nodeMenuRef}>
          <Panel
            position="top-left"
            style={{ left: 125, top: 50, width: 119, marginLeft: 10 }}
          >
            <div className="hover:bg-slate-200 p-2 rounded">
              <button id="visitNode" onClick={handleClick}>
                Visit node
              </button>
            </div>

            <div className="hover:bg-slate-200 p-2 rounded">
              <button id="textInputType" onClick={handleClick}>
                Typing node
              </button>
            </div>

            <div className="hover:bg-slate-200 p-2 rounded">
              <button id="checkboxNode" onClick={handleClick}>
                Checkbox node
              </button>
            </div>

            <div className="hover:bg-slate-200 p-2 rounded">
              <button id="buttonNode" onClick={handleClick}>
                Button node
              </button>
            </div>

            <div className="hover:bg-slate-200 p-2 rounded">
              <button id="containsNode" onClick={handleClick}>
                Contains node
              </button>
            </div>

            <div className="hover:bg-slate-200 p-2 rounded">
              <button id="waitNode" onClick={handleClick}>
                Wait node
              </button>
            </div>
          </Panel>
        </section>
      )}
    </>
  );
}

export default memo(NodeMenuPanel);
