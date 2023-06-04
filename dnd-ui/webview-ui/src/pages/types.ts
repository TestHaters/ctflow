export interface IDetail {
  type: string;
  text: string;
  storeState: { nodes: any; edges: any };
}

export interface IOptions {
  id?: string;
  type: string | undefined;
  data: any;
  position: { x: number; y: number } | undefined;
  inPorts: any;
  outPorts: any;
  icon?: string | undefined;
  description?: string | undefined;
  componentName?: string | null | undefined;
  outputQ?: any[] | undefined;
}
