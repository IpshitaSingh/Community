import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, {
  Marker,
  FlyToInterpolator,
  Popup,
  GeolocateControl,
} from "react-map-gl";
import axios from "axios";
import img from "../../graphics/redpin.svg";
import * as d3 from "d3";
import "./map.css";
import { usePin, usePinUpdate } from "../../PinContext.js";

const geolocateControlStyle = {
  right: 10,
  top: 10,
};

const Map = ({ show, setShow }) => {
  const pinnedEvent = usePin();
  const setPinnedEvent = usePinUpdate();
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 32.8801,
    longitude: -117.234,
    zoom: 12,
  });

  useEffect(() => loadEvents(), [show]);

  const [markers, setMarkers] = useState(null);
  const [displayPopup, setDisplayPopup] = useState({
    display: false,
    latitude: 32.8801,
    longitude: -117.234,
    imageURL: "",
    title: "",
    description: "",
  });

  const loadEvents = async () => {
    const result = await axios.get("/api/posts");
    setMarkers(result.data);
  };

  const handleClick = (e) => {
    setViewport({
      ...viewport,
      longitude: e.coordinates.longitude,
      latitude: e.coordinates.latitude,
      zoom: 16,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: d3.easeCubicInOut,
    });
    setDisplayPopup({
      display: true,
      latitude: e.coordinates.latitude,
      longitude: e.coordinates.longitude,
      imageURL: e.imageURL,
      title: e.title,
      description: e.description,
    });
  };

  useEffect(() => {
    if (markers !== null && pinnedEvent !== null) {
      handleZoom(pinnedEvent);
    }
  }, [pinnedEvent]);

  const handleZoom = (id) => {
    let designatedPin = null;
    markers.forEach((map) => {
      if (map.id === id) {
        designatedPin = map;
      }
    });
    if (designatedPin !== null) {
      setViewport({
        ...viewport,
        longitude: designatedPin.coordinates.longitude,
        latitude: designatedPin.coordinates.latitude,
        zoom: 16,
        transitionDuration: 3000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: d3.easeCubicInOut,
      });
      setDisplayPopup({
        display: true,
        latitude: designatedPin.coordinates.latitude,
        longitude: designatedPin.coordinates.longitude,
        imageURL: designatedPin.imageURL,
        title: designatedPin.title,
        description: designatedPin.description,
      });
    }
  };

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onMouseDown={() => {
        if (displayPopup.display) {
          setDisplayPopup({ ...displayPopup, display: false });
        }
      }}
    >
      {markers &&
        markers.map((city) => (
          <Marker
            longitude={city.coordinates.longitude}
            latitude={city.coordinates.latitude}
            onClick={() => handleClick(city)}
          >
            <img src={img} className="pin" />
          </Marker>
        ))}
      {displayPopup.display && (
        <Popup
          latitude={displayPopup.latitude}
          longitude={displayPopup.longitude}
          closeButton
          closeOnClick
          onClose={() =>
            setDisplayPopup({
              display: false,
              latitude: 32.8801,
              longitude: -117.234,
              imageURL: "",
              title: "",
              description: "",
            })
          }
          anchor="bottom"
          offsetLeft={10}
          tipSize={10}
        >
          <div className="popup-container">
            <div id="popuptitle">{displayPopup.title}</div>
            <div id="popupdescription">{displayPopup.description}</div>
            <img
              src={displayPopup.imageURL}
              className="pin-style"
              padding-bottom="20px"
            />
          </div>
        </Popup>
      )}

      <GeolocateControl
        style={geolocateControlStyle}
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={false}
        showAccuracyCircle={true}
        auto={false}
      />
    </ReactMapGL>
  );
};

export default Map;
