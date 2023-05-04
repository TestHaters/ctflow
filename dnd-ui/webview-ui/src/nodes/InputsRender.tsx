export default function InputsRender({
  value,
  onChange,
  defaultValue,
  placeholder,
  type,
}: any) {
  switch (type) {
    case 'visitNode': {
      return (
        <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
          <input
            type="text"
            className="nodrag"
            value={value}
            id="page"
            onChange={onChange}
            placeholder={placeholder}
            style={{ color: 'black', paddingLeft: '4px' }}
          />
        </div>
      );
    }
    case 'waitNode': {
      <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
        <input
          className="nodrag"
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{ color: 'black', paddingLeft: '4px' }}
        />
      </div>;
    }
    default: {
      return (
        <div className="p-2 border-solid border-[1px] border-t-0 border-gray-600 rounded-bl rounded-br">
          <input
            type="text"
            className="nodrag"
            value={value}
            onChange={onChange}
            defaultValue={defaultValue}
            placeholder={placeholder}
            style={{ color: 'black', paddingLeft: '4px' }}
          />
        </div>
      );
    }
  }
}
