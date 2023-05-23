type IInputsRender = {
  componentType: string;
  htmlFor: string;
  index: number;
  label: string;
  type: string;
  value: string | boolean;
  onChange: (_event: any) => void;
  defaultValue?: string;
  placeholder: string;
};
export default function InputsRender({
  htmlFor,
  index,
  label,
  type,
  value,
  defaultValue,
  placeholder,
  componentType,
  onChange,
}: IInputsRender) {
  switch (componentType) {
    case 'checkboxNode': {
      return (
        <>
          <label htmlFor={htmlFor + index} className="text-[11px] mr-1">
            {label}
          </label>
          <input
            type={type}
            className="nodrag"
            checked={value as boolean}
            onChange={onChange}
            id={htmlFor + index}
          />
        </>
      );
    }
    case 'codeInjectionNode': {
      return (
        <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
          <textarea
            onChange={onChange}
            className="nodrag"
            defaultValue={defaultValue}
            value={value as string}
            style={{
              color: 'black',
              paddingLeft: '4px',
              width: '100%',
              height: '300px',
            }}
          ></textarea>
        </div>
      );
    }

    default: {
      return (
        <>
          {label && (
            <div>
              <label className="text-[11px]">{label}</label>
            </div>
          )}
          <input
            type={type}
            className="nodrag"
            value={value as string}
            onChange={onChange}
            defaultValue={defaultValue}
            placeholder={placeholder}
            style={{ color: 'black', paddingLeft: '4px' }}
          />
        </>
      );
    }
  }
}
