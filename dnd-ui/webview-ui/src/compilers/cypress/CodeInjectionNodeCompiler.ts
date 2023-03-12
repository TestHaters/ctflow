import { useStore } from '../../context/store';

export class CodeInjectionNodeCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: any): string {

    console.log("NODE DATA:", nodeData)

    return `
      ${nodeData.inPorts.code}
    `;
  }
}
