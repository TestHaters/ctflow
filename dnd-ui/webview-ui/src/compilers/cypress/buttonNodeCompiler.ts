import { useStore } from "../../context/store";


export class ButtonNodeCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData
  }

  static compile(nodeData: any): string {
    console.log("HEllo from button node compiler", nodeData)
    // cy.contains("${nodeData.inPorts.field}").click()
    // cy.wait(500)
    return `
      cy.get('${nodeData.inPorts.field}').click()
    `
  }
}


