import { useStore } from "../../context/store";


export class WaitNodeCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData
  }

  static compile(nodeData: any): string {
    return `
      cy.wait(${nodeData.inPorts.field})
    `
  }
}


