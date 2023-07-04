import { useStore } from '../../context/store';

export class CodeInjectionNodeCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: any): string {
    return `
      ${nodeData.inPorts.field}
    `;
  }
}
