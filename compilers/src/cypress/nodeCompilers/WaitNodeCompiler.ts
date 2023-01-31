import { NodeData } from './type';

export class WaitNodeCompiler {
  nodeData: NodeData;

  constructor(nodeData: NodeData) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: NodeData): string {
    return `
      cy.wait(${nodeData.inPorts.field})
    `;
  }
}
