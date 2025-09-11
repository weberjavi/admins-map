import { useEffect, useState } from "react";
import {
  MapboxOverlay as DeckOverlay,
} from '@deck.gl/mapbox';
import styles from "./map.module.css";
import { Layer, Map, Source, useControl } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import {PolygonLayer} from '@deck.gl/layers';
import type { PickingInfo } from "@deck.gl/core";



type ZipCode = {
  zipcode: number;
  population: number;
  area: number;
  contour: [longitude: number, latitude: number][];
  timestamps: number[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DeckGLOverlay(props: any) {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
}

// Get the base URL for PMTiles files (works in dev and production)
const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return '';
  }
  return 'https://raw.githubusercontent.com/weberjavi/admins-map/main/public';
};


export default function App() {
  // State for controlling the date range (indices for 6-week cycle)
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(6); // Default to first week

  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
    };
  }, []);

  // Calculate average timestamp value for the selected date range
  const getAverageTimestamp = (timestamps: number[]) => {
    if (!timestamps || timestamps.length === 0) return 0;
    const selectedValues = timestamps.slice(startIndex, endIndex + 1);
    return selectedValues.reduce((sum, val) => sum + val, 0) / selectedValues.length;
  };

  const layer = new PolygonLayer<ZipCode>({
    id: 'PolygonLayer',
    data: `${getBaseUrl()}/zipcodes.json`,
    getPolygon: (d: ZipCode) => d.contour,
    getFillColor: (d: ZipCode) => {
      const timestampValue = getAverageTimestamp(d.timestamps);
      // Use timestamp value to create a color gradient from blue to red
      const intensity = Math.floor(timestampValue * 255);
      return [intensity, 100, 255 - intensity, 180]; // RGBA
    },
    getLineColor: [255, 255, 255],
    getLineWidth: 2,
    lineWidthMinPixels: 1,
    pickable: true,
    updateTriggers: {
      getFillColor: [startIndex, endIndex]
    }
  });

  
  return (
    <div className={styles.mapContainer}>
      {/* Date Range Control Panel */}
      <div className={styles.controlPanel}>
        <h3>Date Range Control</h3>
        <div className={styles.sliderGroup}>
          <label>
            Start Day (Week {Math.floor(startIndex / 7) + 1}, Day {(startIndex % 7) + 1}):
            <input
              type="range"
              min="0"
              max="41"
              value={startIndex}
              onChange={(e) => {
                const newStart = parseInt(e.target.value);
                setStartIndex(newStart);
                if (newStart >= endIndex) {
                  setEndIndex(Math.min(41, newStart + 1));
                }
              }}
              className={styles.slider}
            />
          </label>
        </div>
        <div className={styles.sliderGroup}>
          <label>
            End Day (Week {Math.floor(endIndex / 7) + 1}, Day {(endIndex % 7) + 1}):
            <input
              type="range"
              min="0"
              max="41"
              value={endIndex}
              onChange={(e) => {
                const newEnd = parseInt(e.target.value);
                setEndIndex(newEnd);
                if (newEnd <= startIndex) {
                  setStartIndex(Math.max(0, newEnd - 1));
                }
              }}
              className={styles.slider}
            />
          </label>
        </div>
        <div className={styles.rangeInfo}>
          Range: {endIndex - startIndex + 1} days selected
        </div>
      </div>
      <Map
        initialViewState={{
          longitude: -122.4,
      latitude: 37.74,
      zoom: 11
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
        mapLib={maplibregl}
      >
        <Source
          id="zipcodes"
          type="vector"
          url={`pmtiles://${getBaseUrl()}/SF-zipcodes.pmtiles`}
        >
          <Layer
            id="zipcodes"
            type="fill"
            source="zipcodes"
            source-layer="data"
            paint={{
              "fill-color": "#A4D48C",
              "fill-opacity": 0.2,
              "fill-outline-color": "#000",
            }}
          />
        </Source>
        <DeckGLOverlay layers={[layer]} getTooltip={({object}: PickingInfo<ZipCode>) => object && `${object.zipcode}\nPopulation: ${object.population}`} />
      </Map>
    </div>
  );
}