import { Dispatch, SetStateAction, useState } from 'react';

export default function CustomNodeForm({
  setModal,
}: {
  setModal: Dispatch<SetStateAction<number>>;
}) {
  const [stringVals, setStringVals] = useState<Record<string, string>>({});
  const [compiledText, setCompiledText] = useState('');
  const [title, setTitle] = useState('');

  function handleCreate() {}

  return (
    <section className="bg-white w-[300px] h-[583px]">
      <div className="p-4">
        <div className="flex p-2 justify-between items-center">
          <div className="font-bold text-lg flex items-center mx-auto text-black">
            Custom Node
          </div>
          <div>
            <button className="block m-2" onClick={() => setModal(0)}>
              <i className="fa-solid fa-xmark"></i>
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

        <div>Input string values: </div>
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
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
        <div>
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
              className="w-full h-[100px]"
            />
          </div>
        </div>
        <div>
          <button
            className="bg-green-500 rounded-md text-white p-2 block mx-auto"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </section>
  );
}
