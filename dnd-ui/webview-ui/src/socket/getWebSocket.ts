import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const doc = new Y.Doc();
const wsProvider = new WebsocketProvider('ws://localhost:8888', '', doc);

// wsProvider.on('status', (event: any) => {
//   console.log('event stuff', event.status); // logs "connected" or "disconnected"
// });
export const getWebSocket = () => {
  return wsProvider;
};
