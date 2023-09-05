// @ts-nocheck
import { Dispatch, memo, SetStateAction, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Panel } from 'reactflow';
import defaultNodes from '../nodes/defaultNode.json';
import { RFNode } from '../models/nodeFactory';
import { useStore } from '../context/store';
import { useStaticClickAway } from '../hooks/useClickOutside';
import { faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons';

interface INodeMenuPanel {
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  showMenu: boolean;
  viewport: Viewport;
  setNodes: Dispatch<SetStateAction<Node<RFNode, string | undefined>[]>>;
}

function NodeMenuPanel({
  setNodes,
  setShowMenu,
  viewport,
  showMenu,
}: INodeMenuPanel) {
  const nodeMenuRef = useRef(null);
  const addNodeRef = useRef(null);
  const [takeSnapshot] = useStore((store) => store.takeSnapshot);

  useStaticClickAway(nodeMenuRef, () => setShowMenu(false), addNodeRef);

  async function handleClick(event, componentType) {
    const { x, y, zoom } = viewport;
    const curX = x / zoom;
    const curY = y / zoom;
    const newNode = new RFNode({
      type: event.target.getAttribute('id'),
      data: {
        componentType,
      },
      position: { x: event.clientX - curX + 20, y: event.clientY - curY + 20 },
    });
    await setNodes((prev) => [...prev, newNode]);
    setShowMenu(false);
    takeSnapshot();
  }

  return (
    <div className="primary-color">
      <Panel
        position="top-left"
        style={{ left: 120 }}
        className="rounded !text-black font-semibold py-2 px-5 cursor-pointer"
      >
        <div onClick={() => setShowMenu((prev) => !prev)} ref={addNodeRef}>
          Add Node
          <span className="ml-1">
            {showMenu ? (
              <FontAwesomeIcon icon={faAngleDown} />
            ) : (
              <FontAwesomeIcon icon={faPlus} />
            )}
          </span>
        </div>
      </Panel>
      {showMenu && (
        <section ref={nodeMenuRef}>
          <Panel
            position="top-left"
            className="bg-white rounded-lg p2 shadow-lg"
            style={{ left: 125, top: 50, width: 159, marginLeft: 10 }}
          >
            {Object.values(defaultNodes).map((node) => {
              const name =
                node.type.charAt(0).toUpperCase() + node.type.slice(1);
              return (
                <div className="hover:bg-slate-200 p-2 rounded" key={node.id}>
                  <button
                    id="anyNode"
                    onClick={(event) => handleClick(event, node.type)}
                  >
                    {name.replace('Node', '')} Node
                  </button>
                </div>
              );
            })}

            <div className="hover:bg-slate-200 p-2 rounded">
              <button id="CTFlowRecorderNode" onClick={handleClick}>
                CTFlow Recorder
              </button>
            </div>

            {/* <div className="hover:bg-slate-200 p-2 rounded">
              <button id="codeInjectionNode" onClick={handleClick}>
                Code injection node
              </button>
            </div> */}
          </Panel>
        </section>
      )}
    </div>
  );
}

export default memo(NodeMenuPanel);
