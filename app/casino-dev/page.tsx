'use client';

import SlotMachine from '@/components/SlotMachine';
import SlotMachineForm from '@/components/SlotMachineForm';
import { useEffect, useState } from 'react';

const CasinoDevPage = ({}) => {
  const [reelHeight, setReelHeight] = useState(5); //must be odd, at least 1 lower than the lowest amount of items in a reel, minimum 3
  const [reels, setReels] = useState([
    {
      reelIndex: 0,
      items: ['gpu: 0', 'ledx: 1', 'btc: 2', 'gpc: 3', 'vpx: 4', 'hds: 5'],
      odds: [20, 20, 10, 10, 30, 10],
    },
    {
      reelIndex: 1,
      items: ['gpu: 0', 'ledx: 1', 'btc: 2', 'gpc: 3', 'vpx: 4', 'hds: 5'],
      odds: [20, 20, 20, 20, 10, 10],
    },
    {
      reelIndex: 2,
      items: ['gpu: 0', 'ledx: 1', 'btc: 2', 'gpc: 3', 'vpx: 4', 'hds: 5'],
      odds: [20, 20, 20, 20, 10, 10],
    },
    {
      reelIndex: 3,
      items: ['gpu: 0', 'ledx: 1', 'btc: 2', 'gpc: 3', 'vpx: 4', 'hds: 5'],
      odds: [20, 20, 20, 20, 10, 10],
    },
  ]);

  useEffect(() => {
    console.log(reels);
  }, [reels]);

  useEffect(() => {
    console.log(reelHeight);
  }, [reelHeight]);

  return (
    <div className=''>
      <SlotMachine
        reels={reels}
        reelHeight={reelHeight}
      />
      <SlotMachineForm
        currentReels={reels}
        setReels={setReels}
        setReelHeight={setReelHeight}
      />
    </div>
  );
};

export default CasinoDevPage;
