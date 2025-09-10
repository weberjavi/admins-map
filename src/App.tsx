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
          longitude: -77.05747,
          latitude: 38.91825,
          zoom: 15.2,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
        mapLib={maplibregl}
      >
        <Source
          id="trees"
          type="vector"
          url="pmtiles://https://raw.githubusercontent.com/weberjavi/caseytrees-vite-map/main/public/dc_trees.pmtiles"
        >
          <Layer
            id="trees"
            type="circle"
            source="trees"
            source-layer="dc_trees"
            paint={{
              "circle-radius": 3,
              "circle-color": "#A4D48C",
              "circle-opacity": 0.6,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}