import { memo } from 'react';
import {
  getRectOfNodes,
  NodeProps,
  NodeToolbar,
  useReactFlow,
  useStore,
  useStoreApi,
  NodeResizer,
} from 'reactflow';
import useDetachNodes from '../hooks/useDetachNodes';

const lineStyle = { borderColor: 'rgb(75 85 99)', border: 'none' };
const padding = 25;

function GroupNode({ id }: NodeProps) {
  const store = useStoreApi();
  const { deleteElements } = useReactFlow();
  const detachNodes = useDetachNodes();
  const { minWidth, minHeight, hasChildNodes } = useStore((store) => {
    const childNodes = Array.from(store.nodeInternals.values()).filter(
      (n) => n.parentNode === id
    );
    const rect = getRectOfNodes(childNodes);

    return {
      minWidth: rect.width + padding * 4,
      minHeight: rect.height + padding * 4,
      hasChildNodes: childNodes.length > 0,
    };
  }, isEqual);

  const onDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const onDetach = () => {
    const childNodeIds = Array.from(store.getState().nodeInternals.values())
      .filter((n) => n.parentNode === id)
      .map((n) => n.id);

    detachNodes(childNodeIds, id);
  };

  return (
    <div style={{ minWidth, minHeight }}>
      <NodeResizer
        lineStyle={lineStyle}
        minWidth={minWidth}
        minHeight={minHeight}
      />
      <NodeToolbar className="nodrag">
        <button
          className="border-solid border-[1px] border-gray-600 rounded p-1"
          onClick={onDelete}
        >
          Delete
        </button>
        {hasChildNodes && (
          <button
            className="border-solid border-[1px] border-gray-600 rounded p-1"
            onClick={onDetach}
          >
            Ungroup
          </button>
        )}
      </NodeToolbar>
    </div>
  );
}

type IsEqualCompareObj = {
  minWidth: number;
  minHeight: number;
  hasChildNodes: boolean;
};

function isEqual(prev: IsEqualCompareObj, next: IsEqualCompareObj): boolean {
  return (
    prev.minWidth === next.minWidth &&
    prev.minHeight === next.minHeight &&
    prev.hasChildNodes === next.hasChildNodes
  );
}

export default memo(GroupNode);
