import { useStore } from "../../context/store";
import { NodeData } from "./type";


export class TextInputNodeCompiler {
  nodeData: NodeData;

  constructor(nodeData: NodeData) {
    this.nodeData = nodeData
  }

  static compile(nodeData: NodeData): string {
    return `
    cy.get('${nodeData.inPorts.field}').type('${nodeData.inPorts.value}')
    `
  }
}


