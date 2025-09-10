import { useEffect } from "react";
import styles from "./map.module.css";
import { Layer, Map, Source } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";

export default function App() {
  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
    };
  }, []);

  return (
    <div className={styles.mapContainer}>
      <Map
        initialViewState={{
          longitude: -75.72000,
          latitude: 42.72000,
          zoom: 7,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
        mapLib={maplibregl}
      >
        <Source
          id="admins"
          type="vector"
          url="pmtiles://https://raw.githubusercontent.com/weberjavi/admins-map/main/public/admins.pmtiles"
        >
          <Layer
            id="admins"
            type="fill"
            source="admins"
            source-layer="data"
            paint={{
              "fill-color": "#A4D48C",
              "fill-opacity": 1,
              "fill-outline-color": "#000000",
            }}
          />
        </Source>
      </Map>
    </div>
  );
}