"use client";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { useState } from "react";
import L from "leaflet";
import * as turf from "@turf/turf";

const LeafletMapWithDrawing = () => {
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);
  const [zoom, setZoom] = useState(13);
  const [polygons, setPolygons] = useState<any[]>([]);
  const [totalArea, setTotalArea] = useState<number>(0);

  const _onCreate = (e: any) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const coordinates = layer.getLatLngs();
      const latlngs = coordinates[0];

      const geoJsonCoords = latlngs.map((coord: any) => [coord.lng, coord.lat]);

      geoJsonCoords.push(geoJsonCoords[0]);

      const polygonGeoJson = turf.polygon([geoJsonCoords]);

      const area = turf.area(polygonGeoJson);

      const newPolygon = {
        id: layer._leaflet_id,
        geoJson: polygonGeoJson,
        area: area,
      };

      setPolygons((prevPolygons) => {
        const updatedPolygons = [...prevPolygons, newPolygon];

        const totalArea = updatedPolygons.reduce(
          (sum, polygon) => sum + polygon.area,
          0
        );
        setTotalArea(totalArea);

        return updatedPolygons;
      });
    }
  };

  return (
    <div>
      <h2 className="text-center">
        React Leaflet - Create, edit, and delete polygon on the map
      </h2>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={_onCreate}
            draw={{
              rectangle: false,
              polyline: false,
              polygon: true,
              marker: false,
              circle: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>

      <div className="polygon-info">
        <h3>Polygon Information:</h3>
        <ul>
          {polygons.map((polygon, index) => (
            <li key={polygon.id}>
              <p>
                <strong>Polygon {index + 1}:</strong> {polygon.area.toFixed(2)}{" "}
                square meters
              </p>
            </li>
          ))}
        </ul>
        <p>
          <strong>Total Area:</strong> {totalArea.toFixed(2)} square meters
        </p>
      </div>
    </div>
  );
};

export default LeafletMapWithDrawing;
