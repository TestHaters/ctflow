import { useState } from "react";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import createFastContext from "./context/createFastContext";

import { useEffect } from "react";
import Flow from "./Flow";
import { vscode } from "./utilities/vscode";
import "./App.css";
import { TextInput } from "./models/TextInput";
import { Provider, useStore } from "./context/store"
import InitGlobalState from "./InitGlobalState"
import { DataLoader } from "./dataLoader";
import { Router } from "./router";


declare global {
  interface Window {
    example: string;
    router: any;
    dataLoader: any;
  }
}


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

  // const [router, setRouter] = useStore((store) => store.router);
  // const [dataLoader, setDataLoader] = useStore((store) => store.dataLoader)
  // useEffect(() => {
  //   setRouter({ router: new Router() })
  //   setDataLoader({ dataLoader: new DataLoader })
  // }, [])




  // register router
  // window.router = new Router()
  // const [router, _] = useStore((store) => store.router)

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
