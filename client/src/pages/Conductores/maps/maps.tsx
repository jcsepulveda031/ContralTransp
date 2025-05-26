import React, { useState, useCallback, useRef } from 'react';
import { 
  GoogleMap, 
  LoadScript, 
  Marker, 
  InfoWindow,
  DrawingManager,
  Circle,
  Polygon,
  Polyline,
  StandaloneSearchBox
} from '@react-google-maps/api';
import { Button, Input, Select, Space, Card } from 'antd';
import { 
  EnvironmentOutlined, 
  AimOutlined, 
  CompassOutlined,
  DeleteOutlined,
  SaveOutlined
} from '@ant-design/icons';

const { Option } = Select;

interface MapLocation {
  lat: number;
  lng: number;
  title?: string;
  description?: string;
}

const Maps: React.FC = () => {
  const [markers, setMarkers] = useState<MapLocation[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapLocation | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [mapType, setMapType] = useState<string>('roadmap');
  const [drawingMode, setDrawingMode] = useState<string | null>(null);
  const [shapes, setShapes] = useState<any[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const mapStyles = {
    height: "600px",
    width: "100%"
  };
  
  const defaultCenter = {
    lat: 19.432608, 
    lng: -99.133209
  };

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newMarker: MapLocation = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        title: 'Nueva ubicación',
        description: 'Haz clic para editar'
      };
      setMarkers(prev => [...prev, newMarker]);
    }
  }, []);

  const onMarkerClick = (marker: MapLocation) => {
    setSelectedMarker(marker);
  };

  const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const location = {
          lat: place.geometry?.location?.lat() || defaultCenter.lat,
          lng: place.geometry?.location?.lng() || defaultCenter.lng,
          title: place.name,
          description: place.formatted_address
        };
        setMarkers(prev => [...prev, location]);
        if (mapRef.current) {
          mapRef.current.panTo({ lat: location.lat, lng: location.lng });
          mapRef.current.setZoom(15);
        }
      }
    }
  };

  const startTracking = () => {
    if (navigator.geolocation) {
      setIsTracking(true);
      navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            title: 'Mi ubicación actual',
            description: 'Actualizado en tiempo real'
          };
          setCurrentLocation(location);
          if (mapRef.current) {
            mapRef.current.panTo({ lat: location.lat, lng: location.lng });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsTracking(false);
        }
      );
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
    setCurrentLocation(null);
  };

  const clearMarkers = () => {
    setMarkers([]);
    setSelectedMarker(null);
  };

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  return (
    <Card title="Mapa Interactivo" style={{ margin: '20px' }}>
      <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }}>
        <Space>
          <Input.Search
            placeholder="Buscar ubicación..."
            onSearch={onPlacesChanged}
            style={{ width: 300 }}
          />
          <Select 
            value={mapType} 
            onChange={setMapType}
            style={{ width: 120 }}
          >
            <Option value="roadmap">Mapa</Option>
            <Option value="satellite">Satélite</Option>
            <Option value="hybrid">Híbrido</Option>
            <Option value="terrain">Terreno</Option>
          </Select>
          <Button 
            icon={<EnvironmentOutlined />} 
            onClick={clearMarkers}
          >
            Limpiar marcadores
          </Button>
          <Button 
            icon={isTracking ? <DeleteOutlined /> : <AimOutlined />}
            onClick={isTracking ? stopTracking : startTracking}
            type={isTracking ? 'primary' : 'default'}
          >
            {isTracking ? 'Detener seguimiento' : 'Iniciar seguimiento'}
          </Button>
        </Space>
      </Space>

      <LoadScript 
        googleMapsApiKey="AIzaSyAT4UJrNGwpHYOQqQfzIKAi_yiMqTWweGA"
        libraries={['places', 'drawing']}
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
          onClick={onMapClick}
          onLoad={onMapLoad}
          mapTypeId={mapType}
          options={{
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true
          }}
        >
          <StandaloneSearchBox
            onLoad={onSearchBoxLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <Input.Search
              placeholder="Buscar ubicación..."
              style={{
                boxSizing: 'border-box',
                border: '1px solid transparent',
                width: '240px',
                height: '32px',
                padding: '0 12px',
                borderRadius: '3px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                fontSize: '14px',
                outline: 'none',
                textOverflow: 'ellipses',
                position: 'absolute',
                top: '10px',
                left: '10px',
                marginTop: '10px'
              }}
            />
          </StandaloneSearchBox>

          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => onMarkerClick(marker)}
            />
          ))}

          {currentLocation && (
            <Marker
              position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              }}
            />
          )}

          {selectedMarker && (
            <InfoWindow
              position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <h3>{selectedMarker.title}</h3>
                <p>{selectedMarker.description}</p>
              </div>
            </InfoWindow>
          )}

          <DrawingManager
            drawingMode={drawingMode as google.maps.drawing.OverlayType}
            options={{
              drawingControl: true,
              drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                  google.maps.drawing.OverlayType.MARKER,
                  google.maps.drawing.OverlayType.CIRCLE,
                  google.maps.drawing.OverlayType.POLYGON,
                  google.maps.drawing.OverlayType.POLYLINE,
                  google.maps.drawing.OverlayType.RECTANGLE
                ]
              }
            }}
          />
        </GoogleMap>
      </LoadScript>
    </Card>
  );
};

export default Maps;