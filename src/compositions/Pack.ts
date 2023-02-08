import type { RectangleConfig } from '@/types/KonvaConfig';
import type { Box } from '@/types/Pack';

import { packer, SelectionStrategy, SortStrategy, SplitStrategy } from 'guillotine-packer';

interface Items {
  name: string;
  width: number;
  height: number;
}

export const pack = (
  binWidth: number,
  binHeight: number,
  boxes: Box[],
  selectionStrategy: string,
  sortStrategy: string,
  splitStrategy: string,
): RectangleConfig[] => {
  const items: Items[] = boxes.map(box => {
    const arr: Items[] = new Array(box.quantity);
    for (let i = 0; i < box.quantity; ++i) {
      arr[i] = {
        name: `${box.width}_${box.height}_${i}`,
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

  const options: Record<string, number> = {};
  if (SelectionStrategy[selectionStrategy as keyof typeof SelectionStrategy] !== undefined) {
    options['selectionStrategy'] = SelectionStrategy[selectionStrategy as keyof typeof SelectionStrategy];
  }
  if (SortStrategy[sortStrategy as keyof typeof SortStrategy] !== undefined) {
    options['sortStrategy'] = SortStrategy[sortStrategy as keyof typeof SortStrategy];
  }
  if (SplitStrategy[splitStrategy as keyof typeof SplitStrategy] !== undefined) {
    options['splitStrategy'] = SplitStrategy[splitStrategy as keyof typeof SplitStrategy];
  }

  const packed = packer({
    binWidth,
    binHeight,
    items,
  }, options);

  if (packed?.length) {
    return packed[0].map(pack => ({
      width: pack.width,
      height: pack.height,
      x: pack.x,
      y: pack.y,
      fill: colors[`${pack.width}_${pack.height}`] || 'pink',
      stroke: 'grey',
    }))
  }
  
  return [];
}
