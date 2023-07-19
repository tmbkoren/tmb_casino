import { useState } from 'react';

export default function useReels(
  reels: {
    reelIndex: number;
    items: string[];
    odds: number[];
  }[]
) {
  const odds = reels.map((reel) => reel.odds);
  const [winningIndexes, setWinningIndexes] = useState<number[]>([]);

  const calculateWinningIndexes = () => {
    let tempArr: number[] = [];
    for (let i = 0; i < reels.length; ++i) {
      const result = Math.floor(Math.random() * 101);
      let winningIndex = 0;
      let temp = 0;
      for (let k = 0; k < odds[i].length; ++k) {
        temp += odds[i][k];
        if (result < temp) {
          break;
        }
        ++winningIndex;
      }
      tempArr.push(winningIndex);
    }
    setWinningIndexes(tempArr);
  };

  return { winningIndexes, calculateWinningIndexes };
}
