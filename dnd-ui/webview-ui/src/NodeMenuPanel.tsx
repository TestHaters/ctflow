import { memo, useRef } from "react";
import { Panel } from "reactflow";
import { v4 as uuid } from "uuid";
import { RFNode } from "./nodeFactory";
import { useOnClickOutside } from "./useClickOutside";

function NodeMenuPanel({ ref, setNodes, setShowMenu }) {
  const nodeMenuRef = useRef(null);

  function handleClick(event) {
    const newNode = new RFNode({
      type: event.target.getAttribute("id"),
    });
    console.log("newNode", newNode);
    setNodes((prev) => [...prev, newNode]);
    setShowMenu(false);
  }
  return (
    <section ref={nodeMenuRef}>
      <Panel position="top-left" style={{ left: 125, top: 50, width: 119, marginLeft: 10 }}>
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
  );
}

export default memo(NodeMenuPanel);
