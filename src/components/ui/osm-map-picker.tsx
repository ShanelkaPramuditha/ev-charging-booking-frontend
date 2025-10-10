import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

// Fix for default marker icon issue in Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
	iconUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
	shadowUrl:
		'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface OSMMapPickerProps {
	latitude: number;
	longitude: number;
	onLocationChange: (lat: number, lng: number) => void;
	className?: string;
}

// Sri Lanka bounds for validation
const SRI_LANKA_BOUNDS = {
	north: 9.9,
	south: 5.9,
	east: 81.9,
	west: 79.5,
};

function isWithinSriLanka(lat: number, lng: number): boolean {
	return (
		lat >= SRI_LANKA_BOUNDS.south &&
		lat <= SRI_LANKA_BOUNDS.north &&
		lng >= SRI_LANKA_BOUNDS.west &&
		lng <= SRI_LANKA_BOUNDS.east
	);
}

// Component to handle map click events
function MapClickHandler({
	onLocationChange,
}: {
	onLocationChange: (lat: number, lng: number) => void;
}) {
	useMapEvents({
		click: (e) => {
			const { lat, lng } = e.latlng;
			if (isWithinSriLanka(lat, lng)) {
				onLocationChange(lat, lng);
			} else {
				alert('Please select a location within Sri Lanka');
			}
		},
	});

	return null;
}

// Component to update map center when coordinates change
function MapCenterUpdater({
	latitude,
	longitude,
}: {
	latitude: number;
	longitude: number;
}) {
	const map = useMapEvents({});

	useEffect(() => {
		if (latitude && longitude && map) {
			map.setView([latitude, longitude], map.getZoom());
		}
	}, [latitude, longitude, map]);

	return null;
}

export function OSMMapPicker({
	latitude,
	longitude,
	onLocationChange,
	className = '',
}: OSMMapPickerProps) {
	const position: [number, number] = [latitude, longitude];

	return (
		<div className={`space-y-2 ${className}`}>
			<div className='h-[400px] w-full overflow-hidden rounded-lg border'>
				<MapContainer
					center={position}
					zoom={13}
					scrollWheelZoom={true}
					style={{ height: '100%', width: '100%' }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>
					<Marker
						position={position}
						draggable={true}
						eventHandlers={{
							dragend: (e) => {
								const marker = e.target;
								const { lat, lng } = marker.getLatLng();
								if (isWithinSriLanka(lat, lng)) {
									onLocationChange(lat, lng);
								} else {
									alert('Please select a location within Sri Lanka');
									marker.setLatLng(position);
								}
							},
						}}
					/>
					<MapClickHandler onLocationChange={onLocationChange} />
					<MapCenterUpdater latitude={latitude} longitude={longitude} />
				</MapContainer>
			</div>
			<p className='text-muted-foreground text-xs'>
				Click on the map or drag the marker to select a location within Sri
				Lanka
			</p>
		</div>
	);
}
