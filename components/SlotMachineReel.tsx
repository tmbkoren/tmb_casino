import Image from "next/image";
import { useState } from "react";

interface SlotMachineReelProps {
  items: string[];
}

interface SlotMachineReelItemProps {
  image: string | React.ReactNode
  isWinning: boolean
}

const SlotMachineReelItem: React.FC<SlotMachineReelItemProps> = ({image}) => {
  return ( <div className="">{image}</div> );
}
 


const SlotMachineReel: React.FC<SlotMachineReelProps> = ({
  items,
}) => {
 
  return <div className="flex flex-col border">{items?.map((item) => {
    return <SlotMachineReelItem key={item} image={item} isWinning={false}/>
  })}</div>
};

export default SlotMachineReel;
