// @ts-nocheck
import defaultNodes from './defaultNode.json';
import { memo, useEffect, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import { useStore } from '../context/store';
import { TextInput } from '../models/TextInput';
import InputsRender from './InputsRender';
const iconsMap = {
  buttonNode: 'fa-solid fa-arrow-pointer',
  visitNode: 'fa-solid fa-door-open',
  waitNode: 'fa-solid fa-spinner',
  checkboxNode: 'fa-solid fa-square-check',
  textInputNode: 'fa-regular fa-keyboard',
  containsNode: 'fa-solid fa-box',
  codeInjectionNode: 'fa-solid fa-syringe',
};

const AnyNode = (props) => {
  const { id, data, isConnectable, xPos, yPos } = props;
  const reactFlowInstance = useReactFlow();
  const { sourceHandleId, targetHandleId, inPorts, componentType } = data;

  const [firstInput, setText] = useState<string>(data?.inPorts?.field || '');
  const [secondInput, setSecondInput] = useState<string>(
    data?.inPorts?.value || ''
  );
  const [description, setDescription] = useState(
    data?.inPorts?.description || ''
  );
  const [nodesStore, setNodeStore] = useStore((store) => store.nodes);
  const [edges] = useStore((store) => store.edges);
  const nodeData = defaultNodes[componentType];

  function commitChange(params: any) {
    const inputNode = new TextInput({
      id,
      type: 'anyNode',
      data,
      position: { x: xPos, y: yPos },
      inPorts: {
        description,
        field: firstInput,
        value: secondInput,
      },
      outPorts: {},
    });
    setNodeStore({
      nodes: {
        ...nodesStore,
        [id]: { ...inputNode },
      },
      edges: {
        ...edges,
        [id]: params,
      },
    });
  }

  function handleRemoveNode() {
    reactFlowInstance.setNodes((nds) => nds.filter((node) => node.id !== id));
  }

  function handleChange(event: KeyboardEvent<HTMLInputElement>, index: number) {
    event.preventDefault();

    const value =
      componentType === 'checkboxNode'
        ? event.target.checked
        : event.target.value;
    const setTextState = index === 0 ? setText : setSecondInput;
    console.log(value, index);
    setTextState(value);
  }

  useEffect(() => {
    setNodeStore({
      nodes: {
        ...nodesStore,
        [id]: {
          ...nodesStore[id],
          inPorts: { field: firstInput, value: secondInput, description },
        },
      },
    });
  }, [firstInput, secondInput, description]);

  return (
    <div className="w-48">
      <div
        role="tooltip"
        className=" z-10 block inline-block px-3 py-2 w-full
      text-xs font-xs text-white bg-gray-500 rounded-lg shadow-sm
      tooltip resize"
        style={{}}
      >
        <textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this node about?"
          className="w-full text-xs font-xs italic bg-gray-500 text-white resize-none"
          style={{ paddingLeft: '4px', fontSize: '70%' }}
        />
      </div>
      <div
        className="mt-2 pt-0 text-center w-full text-gray-500"
        style={{ marginTop: '-8px' }}
      >
        {' '}
        ▼{' '}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: 10, height: 10 }}
        id={sourceHandleId}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />

      <div>
        <div className="p-1 px-2 border-solid border-[1px] border-gray-600  rounded-tl rounded-tr">
          <span className="mr-1">
            <i className={iconsMap[componentType]}></i>
          </span>
          <label>{nodeData.name}</label>
          <span className="float-right" onClick={handleRemoveNode}>
            <i className="fa-solid fa-xmark"></i>
          </span>
        </div>

        {defaultNodes[componentType].inputs.map((input, index) => {
          const defaultValue =
            index === 0 ? inPorts?.field || '' : inPorts?.value || '';
          const value = index === 0 ? firstInput : secondInput;
          return (
            <div
              key={input.label + index}
              className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br"
            >
              <InputsRender
                componentType={componentType}
                type={input.type}
                label={input.label}
                index={index}
                htmlFor={input.htmlFor}
                value={value}
                defaultValue={defaultValue}
                placeholder={input.placeholder}
                onChange={(event) => handleChange(event, index)}
              />
            </div>
          );
        })}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={targetHandleId}
        onConnect={commitChange}
        style={{ top: 120, background: '#555', width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default memo(AnyNode);
