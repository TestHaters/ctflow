import React, { useCallback, useEffect, useState } from 'react';
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
} from 'reactflow';
import YAML from 'yaml';
import { useGetWindowSize } from '../hooks/useGetWindowSize';
import VisitPageNode from '../nodes/VisitPageNode';
import 'reactflow/dist/style.css';
import CompilePanel from '../components/CompilePanel';
import { useStore } from '../context/store';
import { get, omit, pick } from 'lodash';
import { Compiler } from '../compilers';
import SavePanel from '../components/SavePanel';
import NodeMenuPanel from '../components/NodeMenuPanel';
import TextInputNode from '../nodes/TextInputNode';
import CheckboxNode from '../nodes/CheckboxNode';
import ButtonNode from '../nodes/ButtonNode';
import ContainsNode from '../nodes/ContainsNode';
import WaitNode from '../nodes/WaitNode';
import { vscode } from '../utilities/vscode';
import { toast } from 'react-toastify';

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
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const nodeTypes = {
  buttonNode: ButtonNode,
  textInputType: TextInputNode,
  visitNode: VisitPageNode,
  checkboxNode: CheckboxNode,
  containsNode: ContainsNode,
  waitNode: WaitNode,
};

const Editor = () => {
  const { height: windowHeight, width: windowWidth } = useGetWindowSize();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [, setSelectedNode] = useState<Node | null>(null);
  const [store, setStore] = useStore((store) => store);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    window.addEventListener('message', handleCallback);
    () => window.removeEventListener('message', handleCallback);
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
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

  function handleCallback(event: any) {
    console.log('event', event)
    if (event.detail && event.detail.type === 'fileUpdate' && event.detail.text) {
      reloadPageByFileData(event.detail);
      handleCompile();
    }

    if (event.data && event.data.type === 'fileUpdate' && event.data.text) {
      reloadPageByFileData(event.data);
      // const payload = YAML.parse(event.data.text);
      // const allNodes = Object.values(payload.nodes);
      // const allEdges = Object.values(payload.edges);
      // const curNodes = allNodes.map((node) => {
      //   const cNode = {
      //     ...pick(node, ['id', 'position', 'type']),
      //     style: get(node, 'data.style', {}),
      //     data: {
      //       ...get(node, 'data', {}),
      //       inPorts: get(node, 'inPorts', {}),
      //     },
      //   };
      //   return cNode;
      // });
      // // @ts-ignore
      // setNodes(curNodes);
      // // @ts-ignore
      // setEdges(allEdges);
      // setStore({ ...payload });
    }
  }

  function handleSave() {
    console.log("handle save")

    const inputNodes = nodes.reduce((acc, item) => {
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

    const inputEdges = edges.reduce((acc, item) => {
      // @ts-ignore
      acc[item.id] = { ...item };
      return acc;
    }, {});


    console.log("edges", edges)
    console.log("edges", edges)
    console.log("edges", edges)
    console.log("inputEdges", inputEdges)
    console.log("nodes", nodes)
    console.log("inputNodes", inputNodes)

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

  return (
    <div style={{ height: windowHeight, width: windowWidth }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        nodeTypes={nodeTypes}
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
          <NodeMenuPanel setShowMenu={setShowMenu} setNodes={setNodes} />
        )}
      </ReactFlow>
    </div>
  );
};

export default Editor;
