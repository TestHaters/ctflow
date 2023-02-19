import { useStore } from '../../context/store';

export class ContainsNodeCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: any): string {
    return `
      cy.get('${nodeData.inPorts.field}').contains("${nodeData.inPorts.value}")
    `;
  }
}
