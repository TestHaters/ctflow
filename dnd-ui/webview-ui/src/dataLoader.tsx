// Data Loader will load YAML string to App Nodes (which located in src/models)

import { stringify } from "querystring";
import { DocumentSymbol } from "vscode";
import { vscode } from "./utilities/vscode";

// I know I'm stupid, just learn to write TS code 5 minutes ago...
// So, instead of dynamic load, I will load all model type manually here.


const yaml = require('js-yaml');
const fs = require('fs');
import { AppModel } from "./models/AppModel";
import { TextInput } from "./models/TextInput"

export class DataLoader {
  yamlData: String
  nodes: Array<any>
  edges: Array<any>

  constructor(yamlData: String) {
    this.yamlData = yamlData
    this.nodes = []
    this.edges = []
  }


  parseYaml() {
    const doc = yaml.load(this.yamlData)
    console.log("parse data:" + stringify(doc))

    doc.nodes.forEach((node: any) => {
      console.log("parse node: " + stringify(node))
      this.nodes.push(node)
    })

    doc.edges.forEach((edge: any) => {
      console.log("parse edge: " + stringify(edge))
      this.edges.push(edge)
    })

    return true
  }

  loadFromFile() {
  }

  toYaml() {
    return yaml.dump({
      nodes: this.nodes,
      edges: this.edges
    })
  }

  saveToFile() {
    vscode.postMessage(this.toYaml())
  }
}
