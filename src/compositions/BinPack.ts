import type { RectangleConfig } from '@/types/KonvaConfig';
import type { Box } from '@/types/Pack';

// @ts-ignore
import binpack from 'bin-pack.js'

interface Node {
  id: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
}

export const binPack = (
  binWidth: number,
  binHeight: number,
  boxes: Box[],
  algorithm: string,
  sortBy: string,
  sortDirection: string,
): RectangleConfig[] => {
  const nodes: Node[] = boxes.map((box, index) => {
    const arr: Node[] = new Array(box.quantity);
    for (let i = 0; i < box.quantity; ++i) {
      arr[i] = {
        id: `${index}_${i}`,
        width: box.width,
        height: box.height,
      }
    }
    return arr;
  }).flat();

  const colors: Record<string, string> = boxes.reduce<Record<string, string>>((acc, i) => {
    acc[`${i.width}_${i.height}`] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return acc;
  }, {})

  binpack.sort(nodes, sortBy, sortDirection, true);
  binpack.pack(nodes, algorithm, binWidth, binHeight, 0, true, () => {});

  return nodes.map(node => ({
    width: node.width,
    height: node.height,
    x: node.x || 0,
    y: node.y || 0,
    fill: colors[`${node.width}_${node.height}`] || 'pink',
    stroke: 'grey',
  }));
}
