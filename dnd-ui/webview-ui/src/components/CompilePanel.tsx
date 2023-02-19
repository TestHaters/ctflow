// @ts-nocheck
import { memo } from 'react';
import { Panel } from 'reactflow';

function CompilePanel({ onClick }) {
  // TODO: loading state when onClick running
  return (
    <Panel
      className="rounded !text-white font-semibold py-2 px-5 bg-blue-500"
      position="top-left"
      // style={{ top: 50 }}
      onClick={onClick}
    >
      Compile
      <span className="ml-1">
        <i className="fa-solid fa-play"></i>
      </span>
    </Panel>
  );
}

export default memo(CompilePanel);
