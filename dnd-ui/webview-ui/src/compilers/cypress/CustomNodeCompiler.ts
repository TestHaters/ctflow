export class CustomNodeCompiler {
  nodeData: any;

  constructor(nodeData: any) {
    this.nodeData = nodeData;
  }

  static compile(nodeData: any): string {
    let compiledText = nodeData.data.customNode.compiledCode;
    const values = nodeData.inPorts.values;
    Object.keys(values).map((val) => {
      compiledText = compiledText.replace(val, values[val]);
    });
    return '\n' + compiledText + '\n';
  }
}
