import { memo, useState } from 'react';
import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  getRectOfNodes,
  useReactFlow,
  useStore,
  useStoreApi,
} from 'reactflow';
// import { useStore as useCurrentStore } from '../context/store';
import { useCollapsibleNodes } from '../context/CollapsibleContext';
import useDetachNodes from '../hooks/useDetachNodes';

const lineStyle = { borderColor: 'rgb(75 85 99)', border: 'none' };
const padding = 25;

function GroupNode(props: NodeProps) {
  const { id, data } = props;
  console.log('data:', data);
  const store = useStoreApi();
  const { setGroupNodes, groupNodes } = useCollapsibleNodes();
  const { deleteElements, getNodes, setNodes } = useReactFlow();
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

  const onCollapse = (id: string) => {
    const nodes = getNodes();
    console.log('nodes:', nodes);
    const prevGroup = groupNodes[id] || {};
    setNodes((nds) => {
      console.log('nds:', nds);
      const newNodes = nds.map((n) => {
        if (n.id === id) {
          let result = { ...n };
          if (n.data?.collapse) {
            result = {
              ...n,
              ...prevGroup,
              style: {
                ...n.style,
                ...prevGroup,
              },
              data: { ...n.data, collapse: !n.data?.collapse },
            };
          }
          result.data.collapse = !n.data?.collapse;

          return result;
        }

        console.log('n', n);

        return n;
      });
      console.log('newNodes:', newNodes);

      return newNodes;
    });
  };
  console.log('!data?.collapse', !data?.collapse);

  return (
    <div style={{ minWidth, minHeight }}>
      {!data?.collapse ? (
        <NodeResizer
          lineStyle={lineStyle}
          minWidth={minWidth}
          maxWidth={data?.collapse ? 100 : undefined}
          maxHeight={data?.collapse ? 100 : undefined}
          minHeight={minHeight}
          shouldResize={data?.collapse}
          onResizeEnd={(event, data) => {
            const { width, height } = data;
            setGroupNodes((prev: any) => {
              return {
                ...prev,
                [id]: { width, height },
              };
            });
          }}
          isVisible={data?.collapse}
        />
      ) : (
        <div>stuff</div>
      )}
      <NodeToolbar className="nodrag">
        <button
          className="border-solid border-[1px] border-gray-600 rounded p-1"
          onClick={onDelete}
        >
          Delete
        </button>
        <button
          className="border-solid border-[1px] border-gray-600 rounded p-1"
          onClick={() => onCollapse(id)}
        >
          Collapse
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
