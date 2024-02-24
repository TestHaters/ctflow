import { useStore } from '../../context/store';

export class TextInputNodeCompiler {
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
    cy.document().then((document) => {
      for (let selector of ${JSON.stringify(selectors)}) {
        if(document.querySelector(selector) != null) {
            cy.get(selector).type('${nodeData.inPorts.value}')
            break;
        }
      }
    })
    `;
  }
}
