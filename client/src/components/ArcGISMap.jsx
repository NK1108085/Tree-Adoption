// client/src/components/ArcGISMap.jsx
import React, { useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';

function ArcGISMap({ lat, lng, onCoordinatesChange }) {

    const mapRef = useRef();

    useEffect(()=>{
        let view;
        let graphicsLayer;

        // ArcGIS JS API
        loadModules([
            'esri/Map',
            'esri/views/MapView',
            'esri/Graphic',
            'esri/layers/GraphicsLayer'
        ], { css: true })
            .then(([ArcGISMap, MapView, Graphic, GraphicsLayer])=>{
                // creating map
                const map = new ArcGISMap({
                    basemap: 'streets-navigation-vector'
                }); 
                
                graphicsLayer = new GraphicsLayer();
                map.add(graphicsLayer);

                // Initializing view
                view = new MapView({
                    container: mapRef.current,
                    map: map,
                    center: lng && lat ? [parseFloat(lng), parseFloat(lat)] : [78.9629, 20.5937], // Default center: India
                    zoom: lat && lng ? 15 : 4
                });

                if (lat && lng) {
                    addMarker(parseFloat(lat), parseFloat(lng));
                }

                view.on('click', (event) => {
                // Convert screen coords to map coords
                    const point = view.toMap({ x: event.x, y: event.y });
                    if (point) {
                    const { latitude, longitude } = point;
                // Update marker & notify parent
                    addMarker(latitude, longitude);
                    onCoordinatesChange(latitude.toFixed(6), longitude.toFixed(6));
                    }
                });

                function addMarker(latitude, longitude) {
                    // Clear existing graphics
                    graphicsLayer.removeAll();
          
                    // Create a point graphic
                    const pointGraphic = new Graphic({
                      geometry: {
                        type: 'point',
                        latitude,
                        longitude
                      },
                      symbol: {
                        type: 'simple-marker',
                        style: 'circle',
                        color: [226, 119, 40],
                        size: '12px',
                        outline: {
                          color: [255, 255, 255],
                          width: 1
                        }
                      }
                    });
          
                    graphicsLayer.add(pointGraphic);
                  }
            

            }).catch((err) => console.error(err));
    })

  return (
    <div>
        <div
            style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}
            ref={mapRef}
        />
    </div>
  )
}

export default ArcGISMap