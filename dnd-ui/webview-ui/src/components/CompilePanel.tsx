// @ts-nocheck
import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Panel } from 'reactflow';

function CompilePanel({ onClick }) {
  // TODO: loading state when onClick running
  return (
    <Panel
      className="rounded !text-white font-semibold py-2 px-5 bg-blue-500 cursor-pointer"
      position="top-left"
      // style={{ top: 50 }}
      onClick={onClick}
    >
      Run
      <span className="ml-1">
        <FontAwesomeIcon icon={faPlay} />
      </span>
    </Panel>
  );
}

export default memo(CompilePanel);
