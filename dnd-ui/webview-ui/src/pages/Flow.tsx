import 'reactflow/dist/style.css';

import { get, omit, pick } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  FitViewOptions,
  MiniMap,
  Node,
  NodeChange,
  OnNodesChange,
  OnSelectionChangeParams,
  Viewport,
  addEdge,
  applyNodeChanges,
  updateEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import YAML from 'yaml';

import { toast } from 'react-toastify';
import { Compiler } from '../compilers';
import CollabPanel from '../components/CollabPanel';
import CompilePanel from '../components/CompilePanel';
import CustomEdge from '../components/CustomEdge';
import MenuPanel from '../components/MenuPanel';
import NodeMenuPanel from '../components/NodeMenuPanel';
import SavePanel from '../components/SavePanel';
import { useStore } from '../context/store';
import { useGetWindowSize } from '../hooks/useGetWindowSize';
import useUndoRedo from '../hooks/useUndoRedo';
import AnyNode from '../nodes/AnyNode';
import CTFlowRecorderNode from '../nodes/CTFlowRecorderNode';
import CustomNodeRender from '../nodes/CustomNodeRender';
import ButtonNode from '../nodes/old_nodes/ButtonNode';
import CheckboxNode from '../nodes/old_nodes/CheckboxNode';
import ContainsNode from '../nodes/old_nodes/ContainsNode';
import TextInputNode from '../nodes/old_nodes/TextInputNode';
import VisitPageNode from '../nodes/old_nodes/VisitPageNode';
import WaitNode from '../nodes/old_nodes/WaitNode';
import { getHelperLines } from '../utilities/helperLines';
import { vscode } from '../utilities/vscode';
import HelperLines from '../components/HelperLine';

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

  const viewport = useRef<Viewport>(defaultViewport);

  useEffect(() => {
    window.addEventListener('message', handleCallback);
    () => window.removeEventListener('message', handleCallback);
  }, []);

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

    // When testing on browser, the vscode.postMessage won't work
    // we will manually emit fileUpdate event
    // if (window) {
    //   const simulateFileUpdateTriggerOnBrowser = new CustomEvent("message", {
    //     detail: {
    //       "type": 'fileUpdate',
    //       "text": yamlData,
    //     },
    //   });

    //   //  window.dispatchEvent(simulateFileUpdateTriggerOnBrowser)
    // }

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

  const dragStop = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

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

  return (
    <div style={{ height: windowHeight, width: windowWidth }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onMoveEnd={handleMoveEnd}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onNodeDragStop={dragStop}
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
        <CollabPanel />
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
