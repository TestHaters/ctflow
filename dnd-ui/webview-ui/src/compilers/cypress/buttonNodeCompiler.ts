import { useStore } from '../../context/store';

export class ButtonNodeCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: any): string {
    // cy.contains("${nodeData.inPorts.field}").click()
    // cy.wait(500)

    let selectors = [nodeData.inPorts.field];
    if (typeof nodeData.inPorts.alternative_selectors === 'object') {
      selectors = selectors.concat(nodeData.inPorts.alternative_selectors);
    }

    return `
      cy.get('${selectors.join(', ')}').first().click()
    `;
  }
}
