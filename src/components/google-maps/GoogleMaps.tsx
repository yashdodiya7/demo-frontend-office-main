// GoogleMaps.js
"use client"

import React, { ReactNode, useEffect, useState } from 'react';

const GoogleMaps = ({ children } : {children: ReactNode}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return scriptLoaded ? <>{children}</> : null;
};

export default GoogleMaps;
