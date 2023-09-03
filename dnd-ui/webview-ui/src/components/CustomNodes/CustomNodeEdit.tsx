import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { ICustomNode } from '../../types/customNodes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuid } from 'uuid';
import { vscode } from '../../utilities/vscode';
import EditBtn from '../share/EditBtn';
import useClickOutside from '../../hooks/useClickOutside';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function CustomNodeEdit({
  setModal,
  setNode,
  node,
}: {
  setModal: Dispatch<SetStateAction<number>>;
  setNode: Dispatch<SetStateAction<ICustomNode | null>>;
  node: ICustomNode | null;
}) {
  const [stringVals, setStringVals] = useState<Record<string, string>>(
    node?.params || {}
  );
  const [compiledText, setCompiledText] = useState(node?.compiledCode || '');
  const [desc, setDesc] = useState(node?.description || '');
  const [title, setTitle] = useState(node?.name || '');
  const editRef = useRef(null);

  useClickOutside(editRef, () => setModal(0));

  function handleEdit() {
    if (!node?.id) {
      console.error('Node id is not defined');
      return;
    }
    vscode.postMessage({
      type: 'editCustomNode',
      data: {
        compiler: 'cypress',
        payload: {
          id: node.id,
          name: title,
          params: {
            ...stringVals,
          },
          compiledCode: compiledText,
          description: desc,
        },
      },
    });
    setModal(0);
  }

  return (
    <section className="bg-white w-[300px] h-[583px] p-2">
      <div className="pt-4">
        <div className="flex p-2 justify-between items-center">
          <div className="font-bold text-lg flex items-center mx-auto text-black">
            Custom Node
          </div>
          <div>
            <button className="block m-2" onClick={() => setModal(0)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
        <hr />

        <div className="mt-5">
          <span>Node title: </span>
          <span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your node title"
              style={{ color: 'black', paddingLeft: '4px' }}
            />
          </span>
        </div>

        <br />

        <div>Add string values: </div>
        <div className="mt-2">
          <button
            className="border p-2 rounded dashed border-gray-600 border-dotted block w-full"
            onClick={() =>
              setStringVals((prev) => ({
                ...prev,
                [`$${Object.keys(stringVals).length + 1}`]: '',
              }))
            }
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className="max-h-28 overflow-scroll">
          {Object.keys(stringVals).map((str: string, index) => {
            return (
              <div
                key={index}
                className="p-2 border-solid border-t-0 border-gray-600 rounded-bl rounded-br"
              >
                <span>Title: </span>
                <input
                  type="text"
                  value={stringVals[str]}
                  onChange={(e) =>
                    setStringVals((prev) => ({
                      ...prev,
                      [str]: e.target.value,
                    }))
                  }
                  placeholder="value"
                  style={{ color: 'black', paddingLeft: '4px' }}
                />
                &nbsp;
                <span>as ${index + 1}</span>
              </div>
            );
          })}
        </div>
        <br />
        <div>
          <div>Compiled text: </div>
          <div>
            <textarea
              value={compiledText}
              onChange={(e) => setCompiledText(e.target.value)}
              placeholder='E.g: cy.get("$1").find("$2").first().as("$3")'
              style={{ color: 'black', paddingLeft: '4px' }}
              className="w-full h-16"
            />
          </div>
        </div>
        <div>
          <div>Description: </div>
          <div>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="How to use this node"
              style={{ color: 'black', paddingLeft: '4px' }}
              className="w-full h-16"
            />
          </div>
        </div>
        <div>
          <EditBtn onClick={handleEdit}>Edit</EditBtn>
        </div>
      </div>
    </section>
  );
}
