// Data Loader will load YAML string to App Nodes (which located in src/models)

// import { stringify } from "querystring";
import { DocumentSymbol } from "vscode";
import { vscode } from "./utilities/vscode";
import { Provider, useStore } from "./context/store"

// I know I'm stupid, just learn to write TS code 5 minutes ago...
// So, instead of dynamic load, I will load all model type manually here.

// data = { nodes: [1,2,3,4], edges: [1,2,3,4]}
// yamlText = '\nnodes:\n- 1\n- 2\n- 3\n- 4\nedges:\n- 1\n- 2\n- 3\n- 4'
// window.router.dispatch("fileUpdate", {data: {text: yamlText}})
// window.dataLoader.toYaml()


import YAML from 'yaml'
import { AppModel } from "./models/AppModel";
import { TextInput } from "./models/TextInput"
import { Router } from "./router";

export class DataLoader {
  yamlData: string
  nodes: Array<any>
  edges: Array<any>

  constructor() {
    this.yamlData = ""
    this.nodes = []
    this.edges = []
  }

  // data loader will subscribe to VS Editor
  subscribe(router: Router) {
    // const [router, _] = useStore((store) => store.router);
    router.subscribe("fileUpdate", this.onFileUpdate.bind(this))
    router.subscribe("flowUpdate", this.onFlowUpdate.bind(this))
  }

  onFileUpdate(event: any) {
    this.parseYaml(event.data.text)
    const [_, setGlobalStore] = useStore((store) => store.nodes);
    setGlobalStore({ nodes: this.nodes, edges: this.edges });
  }

  // when flow is updated, push a temporary version to ctflowEditor
  onFlowUpdate(event: any) {
    vscode.postMessage({
      type: 'addEdit',
      data: { yamlData: this.toYaml() }
    })
  }

  parseYaml(yamlData: string) {
    this.yamlData = yamlData
    const doc = YAML.parse(this.yamlData)
    // console.log("parse data:" + stringify(doc))

    for (const [nodeId, node] of Object.entries(doc.nodes)) {
      this.nodes.push(node)
    }

    for (const [edgeId, edge] of Object.entries(doc.edges)) {
      this.edges.push(edge)
    }

    return true
  }


  toYaml() {
    return YAML.stringify({
      nodes: this.nodes,
      edges: this.edges
    })
  }

}
