'use client';

import { useEffect, useState } from 'react';
import SlotMachineReel from './SlotMachineReel';
import useReels from '@/hooks/useReels';

interface SlotMachineProps {
  reels: {
    reelIndex: number;
    items: string[];
    odds: number[];
  }[];
  reelHeight: number; //must be odd, at least 1 lower than the lowest amount of items in a reel, minimum 3
}

/* 

Reel = [index, [...items], [...odds]], minimun of 3 items, sum of odds must be 100

*/

const SlotMachine: React.FC<SlotMachineProps> = ({ reels, reelHeight }) => {
  const { winningIndexes, calculateWinningIndexes } = useReels(reels);
  const [displayItems, setDisplayItems] = useState<string[][]>([]);

  useEffect(() => {
    calculateDisplayItems();
    let temp: string[][] = [];
    reels.forEach((item) => {
      temp.push(item.items.slice(0, reelHeight));
    });
    setDisplayItems(temp);
    calculateWinningIndexes();
  }, []);

  useEffect(() => {
    console.log('reels changed');
    calculateDisplayItems();
    let temp: string[][] = [];
    reels.forEach((item) => {
      temp.push(item.items.slice(0, reelHeight));
    });
    setDisplayItems(temp);
    calculateWinningIndexes();
  }, [reels]);

  useEffect(() => {
    calculateDisplayItems();
    let temp: string[][] = [];
    reels.forEach((item) => {
      temp.push(item.items.slice(0, reelHeight));
    });
    setDisplayItems(temp);
    calculateWinningIndexes();
  }, [reelHeight]);

  const calculateDisplayItems = () => {
    const radius = (reelHeight - 1) / 2;
    const reelLength = reels[0].items.length;

    let tempArr = [];
    for (let i = 0; i < winningIndexes.length; ++i) {
      if (
        winningIndexes[i] + radius <= reelLength - 1 &&
        winningIndexes[i] - radius >= 0
      ) {
        tempArr.push(
          reels[i].items.slice(
            winningIndexes[i] - radius,
            winningIndexes[i] + radius + 1
          )
        );
      } else if (winningIndexes[i] + radius > reelLength - 1) {
        const temp = reelLength - winningIndexes[i];
        tempArr.push([
          ...reels[i].items.slice(winningIndexes[i] - radius),
          ...reels[i].items.slice(0, radius - temp + 1),
        ]);
      } else {
        tempArr.push([
          ...reels[i].items.slice(winningIndexes[i] - radius),
          ...reels[i].items.slice(0, winningIndexes[i] + radius + 1),
        ]);
      }
    }
    setDisplayItems(tempArr);
  };

  const handleSpin = () => {
    calculateWinningIndexes();
    calculateDisplayItems();
  };

  return (
    <div className='flex flex-row gap-5 p-5'>
      {reels.map((item) => {
        return (
          <SlotMachineReel
            key={item.reelIndex}
            items={displayItems[item.reelIndex]}
          />
        );
      })}
      <button onClick={handleSpin}>Spin</button>
    </div>
  );
};

export default SlotMachine;
