import { useStore } from '../../context/store';

export class CheckboxNodeCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: any): string {
    let selectors = [nodeData.inPorts.field];
    if (typeof nodeData.inPorts.alternative_selectors === 'object') {
      selectors = selectors.concat(nodeData.inPorts.alternative_selectors);
    }

    return `
      cy.get('${selectors.join(', ')}').first().click()
    `;
  }
}
