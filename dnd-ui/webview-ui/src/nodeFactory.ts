interface IRFNode {
  id: string | number;
  data: { color?: string; label?: string };
  position: { x: number; y: number };
  style?: Record<string, string | number>;
  type?: string;
}

export class RFNode {
  id: string | number;
  data: any;
  position: { x: number; y: number };
  style?: Record<string, string | number>;
  type?: string;
  constructor({ id, data, position, style, type }: IRFNode) {
    this.id = id;
    this.data = data;
    this.position = position;
    this.style = style;
    this.type = type;
  }
}
