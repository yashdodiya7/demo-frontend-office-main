"use client";

import Image from "next/image";
import { useSelector } from "react-redux";

const Avatar: React.FC = () => {
  const src = useSelector(
    (state: any) => state.user?.userProfile?.profile_image
  );

  return (
    <div className="w-[30px] h-[30px]">
      <Image
        className="object-cover w-full h-full rounded-full"
        width={100}
        height={100}
        alt="Avatar"
        src={src || "/images/placeholder.jpg"}
      />
    </div>
  );
};

export default Avatar;
