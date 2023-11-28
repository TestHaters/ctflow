import 'reactflow/dist/style.css';
import './flow.css';

import get from 'lodash/get';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import {
  DragEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  FitViewOptions,
  MiniMap,
  Node,
  NodeChange,
  NodeDragHandler,
  OnNodesChange,
  OnSelectionChangeParams,
  Viewport,
  addEdge,
  applyNodeChanges,
  updateEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import YAML from 'yaml';

import { toast } from 'react-toastify';
import { Compiler } from '../compilers';
import CompilePanel from '../components/CompilePanel';
import CustomEdge from '../components/CustomEdge';
import HelperLines from '../components/HelperLine';
import MenuPanel from '../components/MenuPanel';
import NodeMenuPanel from '../components/NodeMenuPanel';
import SavePanel from '../components/SavePanel';
import { useStore } from '../context/store';
import useCopyPaste from '../hooks/useCopyPaste';
import { useGetWindowSize } from '../hooks/useGetWindowSize';
import useUndoRedo from '../hooks/useUndoRedo';
import AnyNode from '../nodes/AnyNode';
import CTFlowRecorderNode from '../nodes/CTFlowRecorderNode';
import CustomNodeRender from '../nodes/CustomNodeRender';
import GroupNode from '../nodes/GroupNode';
import ButtonNode from '../nodes/old_nodes/ButtonNode';
import CheckboxNode from '../nodes/old_nodes/CheckboxNode';
import ContainsNode from '../nodes/old_nodes/ContainsNode';
import TextInputNode from '../nodes/old_nodes/TextInputNode';
import VisitPageNode from '../nodes/old_nodes/VisitPageNode';
import WaitNode from '../nodes/old_nodes/WaitNode';
import { getHelperLines } from '../utilities/helperLines';
import { vscode } from '../utilities/vscode';
import {
  getId,
  getNodePositionInsideParent,
  sortNodes,
} from '../utilities/groupNodes';

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

export type NodeDataType = {
  id?: string | number;
  label: string;
  name: string;
  color: string;
};

const initialNodes: Node<NodeDataType>[] = [];

const initialEdges: Edge[] = [];
const defaultViewport: Viewport = { x: 0, y: 0, zoom: 1.5 };

const nodeTypes = {
  CTFlowRecorderNode: CTFlowRecorderNode,
  customNode: CustomNodeRender,
  anyNode: AnyNode,
  group: GroupNode,

  // TODO: remove old nodes in new version
  buttonNode: ButtonNode,
  textInputType: TextInputNode,
  visitNode: VisitPageNode,
  checkboxNode: CheckboxNode,
  containsNode: ContainsNode,
  waitNode: WaitNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const Editor = () => {
  const { height: windowHeight, width: windowWidth } = useGetWindowSize();
  const { takeSnapshot, undo, redo, setPast } = useUndoRedo();
  const wrapperRef = useRef<HTMLDivElement>(null);
  // useAutoLayout({ direction: 'TB' });

  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [, setSelectedNode] = useState<Node | null>(null);
  const [store, setStore] = useStore((store) => store);
  const [showMenu, setShowMenu] = useState(false);
  const [helperLineHorizontal, setHelperLineHorizontal] = useState<
    number | undefined
  >(undefined);
  const [helperLineVertical, setHelperLineVertical] = useState<
    number | undefined
  >(undefined);
  const { cut, copy, paste, bufferedNodes } = useCopyPaste();
  const canCopy = nodes.some(({ selected }) => selected);
  const canPaste = bufferedNodes.length > 0;

  const viewport = useRef<Viewport>(defaultViewport);
  const { project, getIntersectingNodes, fitView } = useReactFlow();
  const rfStore = useStoreApi();

  useEffect(() => {
    window.addEventListener('message', handleCallback);
    () => window.removeEventListener('message', handleCallback);
  }, []);

  useEffect(() => {
    fitView({ duration: 400 });
  }, [nodes, fitView]);

  const onConnect = useCallback(
    (connection: Connection) => {
      takeSnapshot();
      setEdges((eds) => addEdge({ ...connection, type: 'customEdge' }, eds));
    },
    [setEdges, takeSnapshot]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      takeSnapshot();

      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [setEdges, takeSnapshot]
  );

  const onSelectionChange = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      const selectedNodes = nodes.filter((node) => node.selected);

      if (selectedNodes.length === 0) setSelectedNode(null);
      if (selectedNodes.length === 1) setSelectedNode(selectedNodes[0]);
    },
    [takeSnapshot]
  );

  function reloadPageByFileData(fileData: any, firstLoad?: boolean) {
    const payload = YAML.parse(fileData.text);
    const allNodes = Object.values(payload.nodes);
    const allEdges = Object.values(payload.edges);
    const curNodes = allNodes.map((node) => {
      const cNode = {
        ...pick(node, ['id', 'position', 'type']),
        style: get(node, 'data.style', {}),
        data: {
          ...get(node, 'data', {}),
          inPorts: get(node, 'inPorts', {}),
        },
      };
      return cNode;
    });
    // @ts-ignore
    setNodes(curNodes);
    // @ts-ignore
    setEdges(allEdges);
    if (firstLoad && curNodes.length > 0 && allEdges.length > 0) {
      // @ts-ignore
      setPast([{ nodes: curNodes, edges: allEdges, originalState: true }]);
    }
    setStore({ ...payload, takeSnapshot });
  }

  // Reload UI (reactflow) by store
  function reloadReactFlow(storeState: any) {
    const newNodes = Object.values(storeState.nodes).map((node) => {
      const cNode = {
        ...pick(node, ['id', 'position', 'type']),
        style: get(node, 'data.style', {}),
        data: {
          ...get(node, 'data', {}),
          inPorts: get(node, 'inPorts', {}),
        },
      };
      return cNode;
    });
    // can not use nodeStore because not in UseEffect
    // @ts-ignore
    setNodes(newNodes);
    // // @ts-ignore
    setEdges(Object.values(storeState.edges));
  }

  function handleCallback(event: any) {
    if (
      event.detail &&
      event.detail.type === 'fileUpdate' &&
      event.detail.text
    ) {
      reloadPageByFileData(event.detail);
      handleCompile();
    }

    if (event.data && event.data.type === 'fileUpdate' && event.data.text) {
      reloadPageByFileData(event.data, true);
    }

    if (
      event.detail &&
      event.detail.type === 'reloadReactFlow' &&
      event.detail.storeState
    ) {
      reloadReactFlow(event.detail.storeState);
    }
  }

  function handleSave() {
    const inputNodes: any = nodes.reduce((acc, item) => {
      // @ts-ignore
      acc[item.id] = {
        ...pick(item, ['id', 'position', 'type']),
        description: 'description',
        componentName: 'compName',
        outputQ: ['outputQ'],
        // @ts-ignore
        inPorts: { ...store.nodes[item.id].inPorts },
        outPorts: {},
        data: { ...omit(item.data, ['inPorts']) },
      };
      return acc;
    }, {});
    console.log('inputNodes', inputNodes);

    // verify that nodes of edge are exist
    const validEdges = edges.filter((edge: any) => {
      return inputNodes[edge.source] && inputNodes[edge.target];
    });

    const inputEdges = validEdges.reduce((acc, item) => {
      // @ts-ignore
      acc[item.id] = { ...item };
      return acc;
    }, {});

    const payload = { nodes: inputNodes, edges: inputEdges };
    setStore({ ...payload });
    const yamlData = YAML.stringify(payload);

    vscode.postMessage({
      type: 'addEdit',
      data: {
        yamlData: yamlData,
      },
    });

    toast('Saved successfully !', {
      position: toast.POSITION.TOP_CENTER,
    });
  }

  function handleCompile() {
    toast('Compiled successfully !', {
      position: toast.POSITION.TOP_CENTER,
    });
    const compiledText = Compiler.compile(store);
    vscode.postMessage({
      type: 'writeCompiledFile',
      data: { compiledText, fileExtension: 'cy.js' },
    });
    return compiledText;
  }

  function handleMoveEnd(_: unknown, curViewport: Viewport) {
    viewport.current = curViewport;
  }

  const customApplyNodeChanges = useCallback(
    (changes: NodeChange[], nodes: Node[]): Node[] => {
      // reset the helper lines (clear existing lines, if any)
      setHelperLineHorizontal(undefined);
      setHelperLineVertical(undefined);

      // this will be true if it's a single node being dragged
      // inside we calculate the helper lines and snap position for the position where the node is being moved to
      if (
        changes.length === 1 &&
        changes[0].type === 'position' &&
        changes[0].dragging &&
        changes[0].position
      ) {
        const helperLines = getHelperLines(changes[0], nodes);

        // if we have a helper line, we snap the node to the helper line position
        // this is being done by manipulating the node position inside the change object
        changes[0].position.x =
          helperLines.snapPosition.x ?? changes[0].position.x;
        changes[0].position.y =
          helperLines.snapPosition.y ?? changes[0].position.y;

        // if helper lines are returned, we set them so that they can be displayed
        setHelperLineHorizontal(helperLines.horizontal);
        setHelperLineVertical(helperLines.vertical);
      }

      return applyNodeChanges(changes, nodes);
    },
    []
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nodes) => customApplyNodeChanges(changes, nodes));
    },
    [setNodes, customApplyNodeChanges]
  );

  const onNodeDrag: NodeDragHandler = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type !== 'anyNode' && !node.parentNode) {
        return;
      }

      const intersections = getIntersectingNodes(node).filter(
        (n) => n.type === 'group'
      );
      const groupClassName =
        intersections.length && node.parentNode !== intersections[0]?.id
          ? 'active'
          : '';

      setNodes((nds) => {
        return nds.map((n) => {
          if (n.type === 'group') {
            return {
              ...n,
              className: groupClassName,
            };
          } else if (n.id === node.id) {
            return {
              ...n,
              position: node.position,
            };
          }

          return { ...n };
        });
      });
    },
    [getIntersectingNodes, setNodes]
  );
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type !== 'anyNode' && !node.parentNode) {
        return;
      }

      const intersections = getIntersectingNodes(node).filter(
        (n) => n.type === 'group'
      );
      const groupNode = intersections[0];

      // when there is an intersection on drag stop, we want to attach the node to its new parent
      if (intersections.length && node.parentNode !== groupNode?.id) {
        const nextNodes: Node[] = rfStore
          .getState()
          .getNodes()
          .map((n) => {
            if (n.id === groupNode.id) {
              return {
                ...n,
                className: '',
              };
            } else if (n.id === node.id) {
              const position = getNodePositionInsideParent(n, groupNode) ?? {
                x: 0,
                y: 0,
              };

              return {
                ...n,
                position,
                parentNode: groupNode.id,
                // we need to set dragging = false, because the internal change of the dragging state
                // is not applied yet, so the node would be rendered as dragging
                dragging: false,
                extent: 'parent' as 'parent',
              };
            }

            return n;
          })
          .sort(sortNodes);

        setNodes(nextNodes);
      }
      takeSnapshot();
    },
    [getIntersectingNodes, setNodes, store, takeSnapshot]
  );
  const onDrop: DragEventHandler<HTMLDivElement> = (event: React.DragEvent) => {
    console.log('onDrop');

    event.preventDefault();
    console.log('wrapperRef.current:', wrapperRef.current);

    if (wrapperRef.current) {
      const wrapperBounds = wrapperRef.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const position = project({
        x: event.clientX - wrapperBounds.x - 20,
        y: event.clientY - wrapperBounds.top - 20,
      });
      console.log('position:', position);
      const nodeStyle =
        type === 'group' ? { width: 400, height: 200 } : undefined;

      const intersections = getIntersectingNodes({
        x: position.x,
        y: position.y,
        width: 40,
        height: 40,
      }).filter((n) => n.type === 'group');
      const groupNode = intersections[0];

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
        style: nodeStyle,
      };

      if (groupNode) {
        // if we drop a node on a group node, we want to position the node inside the group
        newNode.position = getNodePositionInsideParent(
          {
            position,
            width: 40,
            height: 40,
          },
          groupNode
        ) ?? { x: 0, y: 0 };
        newNode.parentNode = groupNode?.id;
        newNode.extent = groupNode ? 'parent' : undefined;
      }

      // we need to make sure that the parents are sorted before the children
      // to make sure that the children are rendered on top of the parents
      const sortedNodes = rfStore
        .getState()
        .getNodes()
        .concat(newNode)
        .sort(sortNodes);
      setNodes(sortedNodes);
    }
  };
  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };
  return (
    <div style={{ height: windowHeight, width: windowWidth }} ref={wrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeDragStop={onNodeDragStop}
        onEdgesChange={onEdgesChange}
        onMoveEnd={handleMoveEnd}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onNodeDrag={onNodeDrag}
        onDrop={onDrop}
        onDragOver={onDragOver}
        proOptions={{ hideAttribution: true }}
        selectNodesOnDrag={false}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onSelectionChange={onSelectionChange}
        fitViewOptions={fitViewOptions}
        defaultViewport={defaultViewport}
      >
        <Controls />
        <Background style={{ backgroundColor: '#f5f5f5' }} />
        <MiniMap />
        <CompilePanel onClick={handleCompile} />
        <SavePanel onClick={handleSave} />
        <NodeMenuPanel
          setShowMenu={setShowMenu}
          setNodes={setNodes}
          showMenu={showMenu}
          viewport={viewport.current}
        />
        <MenuPanel
          viewport={viewport.current}
          setNodes={setNodes}
          undo={undo}
          redo={redo}
          cut={cut}
          copy={copy}
          paste={paste}
          canCopy={canCopy}
          canPaste={canPaste}
        />
        <HelperLines
          horizontal={helperLineHorizontal}
          vertical={helperLineVertical}
        />
      </ReactFlow>
    </div>
  );
};

export default Editor;
