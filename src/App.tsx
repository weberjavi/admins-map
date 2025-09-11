import { useEffect } from "react";
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
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DeckGLOverlay(props: any) {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
}

export default function App() {
  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
    };
  }, []);

  const layer = new PolygonLayer<ZipCode>({
    id: 'PolygonLayer',
    data: '/zipcodes.json',

    getPolygon: (d: ZipCode) => d.contour,
    getFillColor: (d: ZipCode) => [d.population / d.area / 60, 40, 100],
    getLineColor: [255, 255, 255],
    getLineWidth: 2,
    lineWidthMinPixels: 1,
    pickable: true,
  });

  // Get the base URL for PMTiles files (works in dev and production)
  const getBaseUrl = () => {
    return window.location.origin;
  };

  return (
    <div className={styles.mapContainer}>
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