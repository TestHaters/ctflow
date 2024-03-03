// @ts-nocheck
import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Panel } from 'reactflow';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';
import { Compiler } from '../compilers';
import { useStore } from '../context/store';
import { useState } from 'react';

function SavePanel({ onClick }) {
  const [store] = useStore((store) => store);
  const [currentFileHandle, setCurrentFileHandle] = useState(null);

  // https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
  async function chooseFileToSave() {
    // Open file picker and destructure the result the first handle
    const [fileHandle] = await window.showOpenFilePicker();
    setCurrentFileHandle(fileHandle);
    return fileHandle;
  }

  async function exportCompiledFile() {
    const opts = {};
    opts.mode = 'readwrite';

    // Request permission to the file, if the user grants permission, return true.
    const fileHandle = currentFileHandle;
    await fileHandle.requestPermission(opts);
    const writableStream = await currentFileHandle.createWritable();

    const compiledText = Compiler.compile(store);

    // write our file
    await writableStream.write(compiledText);

    // close the file and write the contents to disk.
    await writableStream.close();
  }

  // TODO: loading state when onClick running
  return (
    <div>
      <Panel
        className="rounded !text-white"
        position="top-right"
        style={{ right: 230 }}
      >

        <button
          className="rounded !text-white font-semibold py-2 px-5 bg-green-500	cursor-pointer"
          type="button"
          onClick={chooseFileToSave}
        >
          {currentFileHandle === null ? 'Select File' : currentFileHandle.name}
        </button>

        <button
          className="rounded !text-white font-semibold py-2 ml-2 px-5 bg-green-500	cursor-pointer"
          type="button"
          onClick={exportCompiledFile}
        >
          Export Compiled To File
        </button>
      </Panel>

      <Panel
        className="rounded !text-white font-semibold py-2 px-5 bg-green-500	cursor-pointer"
        position="top-right"
        style={{ right: 30 }}
        onClick={onClick}
      >
        <span className="mr-1">
          <FontAwesomeIcon icon={faFloppyDisk} />
        </span>
        Save
      </Panel>
    </div>
  );
}

export default memo(SavePanel);
