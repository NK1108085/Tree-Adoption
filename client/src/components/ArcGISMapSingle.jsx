// client/src/components/ArcGISMapSingle.jsx
import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

/**
 * ArcGISMapSingle
 * Displays a single ArcGIS map centered at [lng, lat] with one marker.
 * 
 * Props:
 * - lat (Number): Latitude
 * - lng (Number): Longitude
 * - treeName (String): Optional string for popup title
 */
function ArcGISMapSingle({ lat, lng, treeName }) {
  const mapRef = useRef(null);

  useEffect(() => {
    let view;
    let graphicsLayer;

    // Load the required ArcGIS modules
    loadModules(
      ["esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/GraphicsLayer"],
      { css: true }
    ).then(([ArcGISMap, MapView, Graphic, GraphicsLayer]) => {
      // Create the map
      const map = new ArcGISMap({
        basemap: "streets-navigation-vector",
      });

      // Create a GraphicsLayer for the marker
      graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      // Initialize the view
      view = new MapView({
        container: mapRef.current,
        map: map,
        // ArcGIS uses [longitude, latitude]
        center: [parseFloat(lng) || 0, parseFloat(lat) || 0],
        zoom: 13,
      });

      // Create a marker graphic
      const pointGraphic = new Graphic({
        geometry: {
          type: "point",
          longitude: parseFloat(lng) || 0,
          latitude: parseFloat(lat) || 0,
        },
        symbol: {
          type: "simple-marker",
          style: "circle",
          color: [226, 119, 40],
          size: "12px",
          outline: {
            color: [255, 255, 255],
            width: 1,
          },
        },
        popupTemplate: {
          title: treeName || "Plantation",
          content: `
            <p><strong>Latitude:</strong> ${lat}</p>
            <p><strong>Longitude:</strong> ${lng}</p>
          `,
        },
      });

      // Add the marker to the layer
      graphicsLayer.add(pointGraphic);
    }).catch((err) => {
      console.error("ArcGIS load error: ", err);
    });

    // Cleanup on unmount
    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [lat, lng, treeName]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "200px",
        marginTop: "10px",
      }}
    />
  );
}

export default ArcGISMapSingle;