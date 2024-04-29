import React from 'react';
import { OverlayView } from '@react-google-maps/api';

const CustomMarker = ({ position, user_name, profile_image, onClick }) => (
  <OverlayView
    position={position}
    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    getPixelPositionOffset={(width, height) => ({
      x: -(width / 2),
      y: -(height / 2),
    })}
  >
    <div
      style={{
        background: 'white',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <img src={profile_image} style={{ width: '35px', height: '35px', borderRadius: '50%' }} className='border-2 border-stone-800'/>
      <div className='font-bold'>{user_name}</div>
    </div>
  </OverlayView>
);

export default CustomMarker;
