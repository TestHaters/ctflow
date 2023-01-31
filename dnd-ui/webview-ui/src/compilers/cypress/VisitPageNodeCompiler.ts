import { useStore } from "../../context/store";
import { NodeData } from "./type";

export class VisitPageNodeCompiler {
  nodeData: NodeData

  constructor(nodeData: NodeData) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: NodeData): string {
    return `
      cy.visit('${nodeData.inPorts.url}')
    `;
  }
}
