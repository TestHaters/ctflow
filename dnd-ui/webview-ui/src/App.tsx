
import { useState } from 'react';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

import Flow from './Flow';
import { vscode } from './utilities/vscode';

import './App.css';

function App() {
  const [count, setCount] = useState(0);
  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  return (
    <main>
      <div className="App">
        <Flow />
      </div>
    </main>
  );
}

export default App;
