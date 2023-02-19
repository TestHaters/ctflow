import { useStore } from '../../context/store';

export class TextInputNodeCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: any): string {
    return `
    cy.get('${nodeData.inPorts.field}').type('${nodeData.inPorts.value}')
    `;
  }
}
