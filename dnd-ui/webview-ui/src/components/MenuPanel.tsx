import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  FormEvent,
  useRef,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Node, Panel, Viewport } from 'reactflow';
import { NodeDataType } from '../pages/Flow';
import { vscode } from '../utilities/vscode';
import { ICustomNode } from '../types/customNodes';
import CustomNodeForm from './CustomNodes/CustomNodeForm';
import CustomNodeList from './CustomNodes/CustomNodeList';
import CustomNodeEdit from './CustomNodes/CustomNodeEdit';
import SuccessBtn from './share/SuccessBtn';
import { useStaticClickAway } from '../hooks/useClickOutside';

interface IMenuPanelProps {
  viewport: Viewport;
  setNodes: Dispatch<SetStateAction<Node<NodeDataType>[]>>;
  undo: any;
  redo: any;
  cut: any;
  copy: any;
  paste: any;
  canCopy: boolean;
  canPaste: boolean;
}

export default function MenuPanel({
  viewport,
  setNodes,
  undo,
  redo,
  cut,
  copy,
  paste,
  canCopy,
  canPaste,
}: IMenuPanelProps) {
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState<number>(0);
  const [file, setFile] = useState<File>();
  const [curNode, setCurNode] = useState<ICustomNode | null>(null);

  const menuBtnRef = useRef(null);
  const menuRef = useRef(null);

  useStaticClickAway(menuRef, () => setShow(false), menuBtnRef);

  function openCreateCustomNodePanel() {
    setShow(false);
    setModal(1);
  }

  function openCustomNodesList() {
    vscode.postMessage({ type: 'fetchCustomNodes' });
    setShow(false);
    setModal(2);
  }

  function openFileUpload() {
    setModal(3);
  }

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    event.target.files && setFile(event.target.files[0]);
  }

  function handleSubmitFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const reader = new FileReader();
    file && reader.readAsText(file);
    reader.onload = () => {
      vscode.postMessage({
        type: 'importCustomNodes',
        data: {
          payload: reader.result,
          name: file?.name,
        },
      });
    };

    setModal(0);
  }

  return (
    <div className="primary-color">
      <Panel
        position="top-left"
        style={{ left: 230 }}
        // onClick={() => setShow((prev) => !prev)}
        className="rounded !text-black font-semibold py-2 px-5 cursor-pointer"
      >
        <div
          onClick={() => setShow((prev) => !prev)}
          ref={menuBtnRef}
          className="ml-1"
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
      </Panel>
      {show && (
        <Panel
          position="top-left"
          style={{ left: 242, top: 50, width: 200, marginLeft: 10 }}
          className="bg-white shadow-lg rounded-lg p-2"
        >
          <div ref={menuRef}>
            <div className="hover:bg-slate-200 p-2 rounded">
              <button
                id="custom-node-openner"
                onClick={openCreateCustomNodePanel}
              >
                Create custom node
              </button>
            </div>
            <div className="hover:bg-slate-200 p-2 rounded">
              <button
                id="custom-node-openner"
                className="flex justify-between items-center w-full"
                onClick={openCustomNodesList}
              >
                <span>Custom nodes list</span>
              </button>
            </div>
            <div className="hover:bg-slate-200 p-2 rounded">
              <button
                id="custom-node-openner"
                className="flex justify-between items-center w-full"
                onClick={openFileUpload}
              >
                <span>Import</span>
              </button>
            </div>
            <div className="hover:bg-slate-200 p-2 rounded">
              <button
                id="custom-node-openner"
                className="flex justify-between items-center w-full"
                onClick={undo}
              >
                <span>Undo</span>
              </button>
            </div>
            <div className="hover:bg-slate-200 p-2 rounded">
              <button
                id="custom-node-openner"
                className="flex justify-between items-center w-full"
                onClick={redo}
              >
                <span>Redo</span>
              </button>
            </div>
            <div className="hover:bg-slate-200 p-2 rounded">
              <button
                id="custom-node-openner"
                className="flex justify-between items-center w-full disabled:opacity-25"
                onClick={cut}
                disabled={!canCopy}
              >
                <span>Cut</span>
              </button>
            </div>
            <div className="hover:bg-slate-200 p-2 rounded">
              <button
                id="custom-node-openner"
                className="flex justify-between items-center w-full disabled:opacity-25"
                disabled={!canCopy}
                onClick={copy}
              >
                <span>Copy</span>
              </button>
            </div>
            <div className="hover:bg-slate-200 p-2 rounded">
              <button
                id="custom-node-openner"
                className="flex justify-between items-center w-full disabled:opacity-25"
                disabled={!canPaste}
                onClick={(e) => {
                  e.preventDefault();
                  paste();
                }}
              >
                <span>Paste</span>
              </button>
            </div>
          </div>
        </Panel>
      )}
      {modal === 1 && (
        <Panel position="top-right" style={{ right: 10 }}>
          <CustomNodeForm setModal={setModal} />
        </Panel>
      )}
      {modal === 2 && (
        <Panel
          position="top-left"
          style={{ left: 6, top: 50, width: 200, marginLeft: 10 }}
        >
          <CustomNodeList
            setShow={setShow}
            setModal={setModal}
            viewport={viewport}
            setNodes={setNodes}
            setCurNode={setCurNode}
          />
        </Panel>
      )}
      {modal === 3 && (
        <Panel position="top-left" style={{ left: 450, top: 50 }}>
          <div className="bg-white p-4 text-center rounded-2xl">
            <form onSubmit={handleSubmitFile} encType="multipart/form-data">
              <input
                className="block mx-auto mb-4"
                type="file"
                id="fileUpload"
                name="fileUpload"
                multiple
                onChange={handleFileSelect}
              />
              <label htmlFor="fileUpload" className="mb-4">
                Select a file to upload
              </label>
              <SuccessBtn type="submit">Upload</SuccessBtn>
            </form>
            <div className="absolute right-6 top-2">
              <button className="block m-2" onClick={() => setModal(0)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        </Panel>
      )}
      {modal === 4 && (
        <Panel position="top-right" style={{ right: 10 }}>
          <CustomNodeEdit
            setModal={setModal}
            setNode={setCurNode}
            node={curNode}
          />
        </Panel>
      )}
    </div>
  );
}
