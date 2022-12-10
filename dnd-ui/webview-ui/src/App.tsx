import { useState } from "react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import createFastContext from "./context/createFastContext";

import Flow from "./Flow";
import { vscode } from "./utilities/vscode";

import "./App.css";
import { TextInput } from "./models/TextInput";
import { Router } from "./router";
import { Provider, useStore } from "./context/store"

function App() {
  // function handleHowdyClick() {
  //   vscode.postMessage({
  //     command: "hello",
  //     text: "Hey there partner! 🤠",
  //   });
  // }
  const textInputNode = new TextInput({
    id: "1",
    type: "text",
    data: { a: 1 },
    position: { x: 111, y: 222 },
    inPorts: { email: "hungdh131@gmail.com" },
    outPorts: {},
  });
  console.log("textInputNode", textInputNode);

  // register router
  window.router = new Router()
  // const [router, _] = useStore((store) => store.router)

  return (
    <Provider>
      <main>
        <div className="App">
          <Flow />
        </div>
      </main>
    </Provider>
  );
}

export default App;
