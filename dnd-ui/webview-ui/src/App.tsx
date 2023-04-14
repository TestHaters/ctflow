import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ReactFlowProvider } from 'reactflow';
import Flow from './pages/Flow';
import { Provider } from './context/store';
import InitGlobalState from './InitGlobalState';
import { ToastContainer } from 'react-toastify';
import 'vite/modulepreload-polyfill';

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
      <InitGlobalState>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
        <ToastContainer />
      </InitGlobalState>
    </Provider>
  );
}

export default App;
