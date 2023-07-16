import { useStore } from '../../context/store';

export class VisitPageNodeCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: any): string {
    return `
      cy.visit('${nodeData.inPorts.url || nodeData.inPorts.field}')
    `;
  }
}
