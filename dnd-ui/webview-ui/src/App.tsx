import Flow from "./Flow";
import "./App.css";
import { Provider } from "./context/store";
import InitGlobalState from "./InitGlobalState";

function App() {
  return (
    <Provider>
      <InitGlobalState>
        <main>
          <div className="App">
            <Flow />
          </div>
        </main>
      </InitGlobalState>
    </Provider>
  );
}

export default App;
