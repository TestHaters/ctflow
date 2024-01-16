import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ReactFlowProvider } from 'reactflow';
import Flow from './pages/Flow';
import { Provider } from './context/store';
import InitGlobalState from './InitGlobalState';
import { ToastContainer } from 'react-toastify';
import 'vite/modulepreload-polyfill';
import GroupNodeProvider from './context/CollapsibleContext';

declare global {
  interface Window {
    example: string;
    router: any;
    dataLoader: any;
  }
}

function App() {
  return (
    <Provider>
      <GroupNodeProvider>
        <InitGlobalState>
          <ReactFlowProvider>
            <Flow />
          </ReactFlowProvider>
          <ToastContainer />
        </InitGlobalState>
      </GroupNodeProvider>
    </Provider>
  );
}

export default App;
