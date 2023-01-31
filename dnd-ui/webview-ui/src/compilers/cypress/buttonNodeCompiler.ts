import { useStore } from "../../context/store";
import { NodeData } from "./type";

export class ButtonNodeCompiler {
  nodeData: NodeData;

  constructor(nodeData: NodeData) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: NodeData): string {
    console.log("HEllo from button node compiler", nodeData);
    // cy.contains("${nodeData.inPorts.field}").click()
    // cy.wait(500)
    return `
      cy.get('${nodeData.inPorts.field}').click()
    `;
  }
}
