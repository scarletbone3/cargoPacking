import type { Box } from '@/types/Pack';
import type { Pallet } from 'loading-pallets';
import type { RectangleConfig } from '@/types/KonvaConfig';

import { loader } from 'loading-pallets';

export const load = (
  binWidth: number,
  binHeight: number,
  padding: number,
  boxes: Box[],
  centerLoading: boolean,
): RectangleConfig[] => {
  const pallets: Pallet[] = boxes.map(box => {
    const arr: Pallet[] = new Array(box.quantity);
    for (let i = 0; i < box.quantity; ++i) {
      arr[i] = {
        height: box.width,
        width: box.height,
        allowRotation: box.allowRotation || false,
      }
    }
    return arr;
  }).flat();

  const colors: Record<string, string> = boxes.reduce<Record<string, string>>((acc, i) => {
    acc[`${i.height}_${i.width}`] = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return acc;
  }, {});

  console.log('start -----------')
  const loaded = loader(binWidth, binHeight, padding, pallets, centerLoading, false);
  console.log('end -----------')

  if (loaded.length) {
    return loaded.map(pallet => ({
      width: pallet.height,
      height: pallet.width,
      x: pallet.x || 0,
      y: pallet.y || 0,
      fill: colors[`${pallet.width}_${pallet.height}`] || 'pink',
      stroke: 'white',
      strokeWidth: 0,
    }))
  }

  return [];
}
