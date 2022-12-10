export class AppModel {
  constructor(options?: any) {}
  id: string | undefined;
  type: string | undefined;
  data: any;
  position: { x: number; y: number; } | undefined;
  inPorts: any;
  outPorts: any;
  icon: string | undefined;
  description: string | undefined;
  componentName: string | null | undefined;
  outputQ: any[] | undefined;
}
