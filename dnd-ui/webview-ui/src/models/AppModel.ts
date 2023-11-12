interface IOptions {
  id?: string;
  type: string | undefined;
  data: any;
  position: { x: number; y: number } | undefined;
  inPorts: any;
  outPorts: any;
  icon?: string | undefined;
  description?: string | undefined;
  componentName?: string | null | undefined;
  tags?: string[] | undefined;
  outputQ?: any[] | undefined;
}

export class AppModel {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
  inPorts: any;
  outPorts: any;
  icon?: string;
  description?: string;
  componentName?: string | null;
  tags?: string[] | undefined;
  outputQ?: any[];
  constructor(options: IOptions) {
    this.id = options.id || 'string';
    this.type = options.type || 'notype';
    this.data = options.data;
    this.position = options.position || { x: 0, y: 0 };
    this.inPorts = options.inPorts;
    this.outPorts = options.outPorts;
    this.icon = options.icon;
    this.description = options.description || 'description';
    this.componentName = options.componentName || 'compName';
    this.outputQ = options.outputQ || ['outputQ'];
  }
}
