import { useMemo, useRef } from 'react';
import { Node, Edge } from 'reactflow';
import Dagre from '@dagrejs/dagre';
// import { useStore } from '../context/store';

type NodeData = {
  collapse: boolean;
};

export type UseExpandCollapseOptions = {
  layoutNodes?: boolean;
  treeWidth?: number;
  treeHeight?: number;
};

function filterCollapsedChildren(
  dagre: Dagre.graphlib.Graph,
  node: Node<NodeData>,
  nodes: Node[]
) {
  if (!node.data.collapse) return;
  const children = nodes.filter((n) => n.parentNode === node.id);

  for (const child of children) {
    dagre.removeNode(child.id);
  }
}

function useExpandCollapse(
  nodes: Node[],
  edges: Edge[],
  {
    layoutNodes = true,
    treeWidth = 220,
    treeHeight = 100,
  }: UseExpandCollapseOptions = {}
): { nodes: Node[]; edges: Edge[] } {
  return useMemo(() => {
    if (nodes.length === 0 && edges.length === 0) return { nodes, edges };

    if (!layoutNodes) return { nodes, edges };

    // 1. Create a new instance of `Dagre.graphlib.Graph` and set some default
    // properties.
    const dagre = new Dagre.graphlib.Graph()
      .setDefaultEdgeLabel(() => ({}))
      .setGraph({ rankdir: 'TB' });

    // 2. Add each node and edge to the dagre graph. Instead of using each node's
    // intrinsic width and height, we tell dagre to use the `treeWidth` and
    // `treeHeight` values. This lets you control the space between nodes.
    for (const node of nodes) {
      dagre.setNode(node.id, {
        width: treeWidth,
        height: treeHeight,
        data: node.data,
      });
    }

    for (const edge of edges) {
      dagre.setEdge(edge.source, edge.target);
    }

    // 3. Iterate over the nodes *again* to determine which ones should be hidden
    // based on expand/collapse state. Hidden nodes are removed from the dagre
    // graph entirely.
    for (const node of nodes) {
      filterCollapsedChildren(dagre, node, nodes);
    }

    const newNodes = nodes.flatMap((node) => {
      if (!dagre.hasNode(node.id)) return [];

      if (node.data.collapse) {
        return [{ ...node, style: { width: 130, height: 50 } }];
      }

      const data = { ...node.data };

      return [{ ...node, data }];
    });

    return {
      //   nodes,
      nodes: newNodes,
      edges,
    };
  }, [
    nodes,
    edges,
    layoutNodes,
    treeWidth,
    treeHeight,
    nodes.length,
    edges.length,
  ]);
}

export default useExpandCollapse;
