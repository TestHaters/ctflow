import { NodeData } from './type';

export class ButtonNodeCompiler {
  nodeData: NodeData;

  constructor(nodeData: NodeData) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: NodeData): string {
    // cy.contains("${nodeData.inPorts.field}").click()
    // cy.wait(500)
    return `
      cy.get('${nodeData.inPorts.field}').click()
    `;
  }
}
