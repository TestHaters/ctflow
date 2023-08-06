// @ts-nocheck
import { useState, useRef } from 'react';
import { memo } from 'react';
import { Panel } from 'reactflow';
import { getWebSocket } from '../socket/getWebSocket';
console.log('getWebSocket:', getWebSocket);

function SavePanel() {
  const [isCollab, setCollab] = useState(true);
  const style = 'rounded !text-white font-semibold py-2 px-5 cursor-pointer';

  function handleCollab(newStt) {
    setCollab(newStt);
    const ws = getWebSocket();
    if (newStt) {
      ws.connect();
    } else {
      ws.destroy();
    }
  }

  return (
    <Panel
      className={isCollab ? style + ' bg-red-500' : style + ' bg-blue-500'}
      position="top-right"
      style={{ right: 130 }}
      onClick={() => handleCollab(!isCollab)}
    >
      <span className="mr-1">
        {isCollab ? (
          <i className="animate-pulse fa-regular fa-handshake"></i>
        ) : (
          <i className="fa-regular fa-handshake"></i>
        )}
      </span>
    </Panel>
  );
}

export default memo(SavePanel);
