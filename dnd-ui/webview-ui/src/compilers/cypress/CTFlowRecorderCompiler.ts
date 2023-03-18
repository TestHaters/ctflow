import { useStore } from '../../context/store';

export class CTFlowRecorderCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: any): string {

    console.log("NODE DATA:", nodeData)

    return `

    `;
  }
}
