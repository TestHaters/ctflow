// @ts-nocheck
import { memo } from 'react';
import { Panel } from 'reactflow';

function SavePanel({ onClick }) {
  // TODO: loading state when onClick running
  return (
    <Panel
      className="rounded !text-white font-semibold py-2 px-5 bg-green-500	"
      position="top-right"
      style={{ right: 30 }}
      onClick={onClick}
    >
      <span className="mr-1">
        <i className="fa-solid fa-floppy-disk"></i>
      </span>
      Save
    </Panel>
  );
}

export default memo(SavePanel);
