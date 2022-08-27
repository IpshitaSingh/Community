import { Marker } from "react-map-gl";
import axios from "axios";
import React, { useState } from "react";
import img from "../../graphics/redpin.svg";
import "../../App.css";

const MarkerItem = () => {
  const [drag, setDrag] = useState({
    lat: 32.8801,
    lon: -117.234,
    move: true,
  });

  return (
    <Marker
      latitude={drag.lat}
      longitude={drag.lon}
      onDrag={(event) =>
        setDrag({ ...drag, lat: event.lngLat[1], lon: event.lngLat[0] })
      }
      draggable={drag.move}
    >
      <img src={img} className="pin" />
    </Marker>
  );
};

export default MarkerItem;
