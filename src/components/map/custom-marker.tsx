import React from "react";
import { OverlayView } from "@react-google-maps/api";
import Image from "next/image";

interface CustomMarkerProps {
  position: any;
  user_name: string;
  profile_image: string;
  onClick?: () => void;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({
  position,
  user_name,
  profile_image,
  onClick,
}) => (
  <OverlayView
    position={position}
    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    getPixelPositionOffset={(width, height) => ({
      x: -(width / 2),
      y: -(height / 2),
    })}
  >
    <div
      className="bg-white cursor-pointer"
      onClick={onClick}
    >
      <Image
        alt="image"
        width={100}
        height={100}
        src={profile_image}
        className="border-2 border-stone-800 w-9 h-9 rounded-xl"
      />
      <div className="font-bold">{user_name}</div>
    </div>
  </OverlayView>
);

export default CustomMarker;
