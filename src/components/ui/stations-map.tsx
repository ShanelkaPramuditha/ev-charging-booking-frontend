import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import type { IStation } from '@/types/station';

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

// Create custom icons for active and inactive stations
const createCustomIcon = (isActive: boolean) => {
	const iconHtml = renderToStaticMarkup(
		<div
			style={{
				backgroundColor: isActive ? '#22c55e' : '#ef4444',
				borderRadius: '50%',
				width: '32px',
				height: '32px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				border: '3px solid white',
				boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
			}}
		>
			<MapPin size={20} color='white' />
		</div>,
	);

	return L.divIcon({
		html: iconHtml,
		className: 'custom-marker-icon',
		iconSize: [32, 32],
		iconAnchor: [16, 32],
		popupAnchor: [0, -32],
	});
};

interface StationsMapProps {
	stations: IStation[];
	onStationClick?: (stationId: string) => void;
	className?: string;
}

export function StationsMap({
	stations,
	onStationClick,
	className = '',
}: StationsMapProps) {
	// Calculate center point (Sri Lanka center as default)
	const defaultCenter: [number, number] = [7.8731, 80.7718];

	// If we have stations, center on them
	const center: [number, number] =
		stations.length > 0
			? [
					stations.reduce((sum, s) => sum + s.location.latitude, 0) /
						stations.length,
					stations.reduce((sum, s) => sum + s.location.longitude, 0) /
						stations.length,
				]
			: defaultCenter;

	return (
		<div className={`h-full w-full ${className}`}>
			<MapContainer
				center={center}
				zoom={stations.length > 0 ? 8 : 7}
				scrollWheelZoom={true}
				style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				{stations.map((station) => (
					<Marker
						key={station.id}
						position={[station.location.latitude, station.location.longitude]}
						icon={createCustomIcon(station.isActive)}
						eventHandlers={{
							click: () => {
								if (onStationClick) {
									onStationClick(station.id);
								}
							},
						}}
					>
						<Popup>
							<div className='min-w-[200px] space-y-2'>
								<h3 className='font-semibold text-base'>{station.name}</h3>
								<div className='space-y-1 text-sm'>
									<p className='text-muted-foreground'>{station.address}</p>
									<div className='flex items-center justify-between'>
										<span className='text-muted-foreground'>Status:</span>
										<span
											className={`font-medium ${station.isActive ? 'text-green-600' : 'text-red-600'}`}
										>
											{station.isActive ? 'Active' : 'Inactive'}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-muted-foreground'>Type:</span>
										<span className='font-medium'>{station.type}</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-muted-foreground'>Slots:</span>
										<span className='font-medium'>
											{station.availableSlots}/{station.totalSlots}
										</span>
									</div>
									{station.operator && (
										<div className='flex items-center justify-between'>
											<span className='text-muted-foreground'>Operator:</span>
											<span className='font-medium'>
												{station.operator.username}
											</span>
										</div>
									)}
								</div>
							</div>
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}
