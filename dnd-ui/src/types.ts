export interface ICustomNodeCollection {
  collectionName: string;
  createdAt: string;
  updatedAt: string;
  compiler: string;
  customNodes: ICustomNode[];
}

export interface ICustomNodePayload {
  compiler: string;
  payload: ICustomNode;
}

export interface ICustomNode {
  id: string;
  params: Record<string, string>;
  name: string;
  compiledCode: string;
  description: string;
}
