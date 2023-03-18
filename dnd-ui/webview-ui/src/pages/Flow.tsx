import 'reactflow/dist/style.css';

import { get, omit, pick } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  FitViewOptions,
  MiniMap,
  Node,
  OnSelectionChangeParams,
  Panel,
  updateEdge,
  useEdgesState,
  useNodesState,
  Viewport,
} from 'reactflow';
import YAML from 'yaml';

import { Compiler } from '../compilers';
import CompilePanel from '../components/CompilePanel';
import NodeMenuPanel from '../components/NodeMenuPanel';
import SavePanel from '../components/SavePanel';
import { useStore } from '../context/store';
import { useGetWindowSize } from '../hooks/useGetWindowSize';
import ButtonNode from '../nodes/ButtonNode';
import CheckboxNode from '../nodes/CheckboxNode';
import ContainsNode from '../nodes/ContainsNode';
import TextInputNode from '../nodes/TextInputNode';
import VisitPageNode from '../nodes/VisitPageNode';
import WaitNode from '../nodes/WaitNode';
import codeInjectionNode from '../nodes/CodeInjectionNode';
import CTFlowRecorderNode from '../nodes/CTFlowRecorderNode';
import { vscode } from '../utilities/vscode';
import CustomEdge from '../components/CustomEdge';

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

export type NodeDataType = {
  label: string;
  name: string;
  color: string;
};

const initialNodes: Node<NodeDataType>[] = [];

const initialEdges: Edge[] = [];
const defaultViewport: Viewport = { x: 0, y: 0, zoom: 1.5 };

const nodeTypes = {
  buttonNode: ButtonNode,
  textInputType: TextInputNode,
  visitNode: VisitPageNode,
  checkboxNode: CheckboxNode,
  containsNode: ContainsNode,
  waitNode: WaitNode,
  codeInjectionNode: codeInjectionNode,
  CTFlowRecorderNode: CTFlowRecorderNode
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const Editor = () => {
  const { height: windowHeight, width: windowWidth } = useGetWindowSize();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [, setSelectedNode] = useState<Node | null>(null);
  const [store, setStore] = useStore((store) => store);
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edgeStore, setEdgeStore] = useStore((store) => store.edges);
  const [showMenu, setShowMenu] = useState(false);
  const viewport = useRef<Viewport>(defaultViewport);

  useEffect(() => {
    window.addEventListener('message', handleCallback);
    () => window.removeEventListener('message', handleCallback);
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: 'customEdge' }, eds));
    },
    [setEdges]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    [setEdges]
  );

  const onSelectionChange = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      const selectedNodes = nodes.filter((node) => node.selected);
      if (selectedNodes.length === 0) setSelectedNode(null);
      if (selectedNodes.length === 1) setSelectedNode(selectedNodes[0]);
    },
    []
  );

  function reloadPageByFileData(fileData: any) {
    console.log("reload page by file data")
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
    setStore({ ...payload });
  }

  // Reload UI (reactflow) by store
  function reloadReactFlow(storeState: any){
    console.log("reload react flow")
    // can not use nodeStore because not in UseEffect
    // @ts-ignore
    setNodes(Object.values(storeState.nodes).map((node) => {
      const cNode = {
        ...pick(node, ['id', 'position', 'type']),
        style: get(node, 'data.style', {}),
        data: {
          ...get(node, 'data', {}),
          inPorts: get(node, 'inPorts', {}),
        },
      };
      return cNode;
    }));
    // // @ts-ignore
    setEdges(Object.values(storeState.edges));
  }

  function handleCallback(event: any) {
    console.log('event', event)
    if (event.detail && event.detail.type === 'fileUpdate' && event.detail.text) {
      reloadPageByFileData(event.detail);
      handleCompile();
    }

    if (event.data && event.data.type === 'fileUpdate' && event.data.text) {
      reloadPageByFileData(event.data);
    }

    if (event.detail && event.detail.type === 'reloadReactFlow' && event.detail.storeState) {
      reloadReactFlow(event.detail.storeState);
    }
  }

  function handleSave() {

    const inputNodes : any = nodes.reduce((acc, item) => {
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

    // verify that nodes of edge are exist
    const validEdges = edges.filter((edge: any) => {
      return inputNodes[edge.source] && inputNodes[edge.target];
    });
    console.log("VALID EDGES", edges, validEdges)

    const inputEdges = validEdges.reduce((acc, item) => {
      // @ts-ignore
      acc[item.id] = { ...item };
      return acc;
    }, {});

    let payload = { nodes: inputNodes, edges: inputEdges }
    setStore({ ...payload });
    let yamlData = YAML.stringify(payload)



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
              <i className="fa-solid fa-bars"></i>
            )}
          </span>
        </Panel>
        {showMenu && (
          <NodeMenuPanel
            setShowMenu={setShowMenu}
            setNodes={setNodes}
            viewport={viewport.current}
          />
        )}
      </ReactFlow>
    </div>
  );
};

export default Editor;
