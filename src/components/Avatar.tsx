'use client';

import Image from "next/image";
import { useSelector } from "react-redux";

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = () => {
  const src = useSelector((state:any) => state.user?.userProfile?.profile_image)

  return ( 
    <Image 
      className="rounded-full" 
      height="30" 
      width="30" 
      alt="Avatar" 
      src={src || '/images/placeholder.jpg'}
    />
   );
}
 
export default Avatar;