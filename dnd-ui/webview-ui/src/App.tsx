import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import Flow from './pages/Flow';
import { Provider } from './context/store';
import InitGlobalState from './InitGlobalState';
import { ToastContainer } from 'react-toastify';

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
        <Flow />
        <ToastContainer />
      </InitGlobalState>
    </Provider>
  );
}

export default App;
