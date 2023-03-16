import { v4 as uuid } from 'uuid';
interface IRFNode {
  id?: string | number;
  data?: { color?: string; label?: string };
  position?: { x: number; y: number };
  style?: Record<string, string | number>;
  type?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export class RFNode {
  id?: string | number;
  data?: any;
  position?: { x: number; y: number };
  style?: Record<string, string | number>;
  type?: string;
  width?: number;
  height?: number;
  constructor({ id, data, position, style, type, width, height }: IRFNode) {
    this.id = id || uuid();
    this.data = data || {};
    this.position = position || { x: 20, y: 250 };
    this.style = style || {};
    this.type = type;
    this.width = width || 168;
    this.height = height || 125;
  }
}
