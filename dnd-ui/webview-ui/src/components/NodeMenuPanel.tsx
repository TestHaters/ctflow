// @ts-nocheck
import { Dispatch, memo, SetStateAction, useRef } from 'react';
import { Panel } from 'reactflow';
import { v4 as uuid } from 'uuid';
import { RFNode } from '../models/nodeFactory';
import { NodeDataType } from '../pages/Flow';

interface INodeMenuPanel {
  setNodes: Dispatch<SetStateAction<Node<NodeDataType>[]>>;
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  viewport: Viewport;
}

function NodeMenuPanel({ setNodes, setShowMenu, viewport }: INodeMenuPanel) {
  const nodeMenuRef = useRef(null);

  function handleClick(event) {
    const { x, y, zoom } = viewport;
    const curX = x / zoom;
    const curY = y / zoom;
    const newNode = new RFNode({
      type: event.target.getAttribute('id'),
      position: { x: event.clientX - curX + 20, y: event.clientY - curY + 20 },
    });
    setNodes((prev) => [...prev, newNode]);
    setShowMenu(false);
  }
  return (
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

        <div className="hover:bg-slate-200 p-2 rounded">
          <button id="codeInjectionNode" onClick={handleClick}>
            Code injection node
          </button>
        </div>

        <div className="hover:bg-slate-200 p-2 rounded">
          <button id="CTFlowRecorderNode" onClick={handleClick}>
            CTFlow Recorder
          </button>
        </div>
      </Panel>
    </section>
  );
}

export default memo(NodeMenuPanel);
