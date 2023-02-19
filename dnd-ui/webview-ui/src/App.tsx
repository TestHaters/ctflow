import './index.css';
import Editor from './pages/Flow';
import { Provider } from './context/store';
import InitGlobalState from './InitGlobalState';

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
        <Editor />
      </InitGlobalState>
    </Provider>
  );
}

export default App;
