// @ts-nocheck
import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Panel } from 'reactflow';
import { faFloppyDisk } from '@fortawesome/free-regular-svg-icons';

function SavePanel({ onClick }) {
  // TODO: loading state when onClick running
  return (
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
  );
}

export default memo(SavePanel);
