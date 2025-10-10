import { useNavigate } from '@tanstack/react-router';
import { Activity, Battery, MapPin, Plug, TrendingUp, Zap } from 'lucide-react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StationsMap } from '@/components/ui/stations-map';
import { useAuth } from '@/context/auth/use-auth';
import { useStations } from '@/queries/station.queries';
import type { IUserProfile } from '@/types/user';

export function UserDashboard() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { data: stations, isLoading } = useStations();

	const userProfile = user as IUserProfile;
	const isBackoffice = userProfile?.role === 'backOffice';
	const isOperator = userProfile?.role === 'operator';

	// Calculate statistics
	const stats = useMemo(() => {
		if (!stations) {
			return {
				total: 0,
				active: 0,
				inactive: 0,
				totalSlots: 0,
				availableSlots: 0,
				occupancyRate: 0,
				dcFastChargers: 0,
				acChargers: 0,
			};
		}

		const total = stations.length;
		const active = stations.filter((s) => s.isActive).length;
		const inactive = total - active;
		const totalSlots = stations.reduce((sum, s) => sum + s.totalSlots, 0);
		const availableSlots = stations.reduce(
			(sum, s) => sum + s.availableSlots,
			0,
		);
		const occupancyRate =
			totalSlots > 0 ? ((totalSlots - availableSlots) / totalSlots) * 100 : 0;
		const dcFastChargers = stations.filter(
			(s) => s.type === 'DC Fast Charger',
		).length;
		const acChargers = stations.filter((s) => s.type === 'AC Charger').length;

		return {
			total,
			active,
			inactive,
			totalSlots,
			availableSlots,
			occupancyRate,
			dcFastChargers,
			acChargers,
		};
	}, [stations]);

	const handleStationClick = (stationId: string) => {
		navigate({ to: '/stations/$stationId', params: { stationId } });
	};

	const handleViewAllStations = () => {
		navigate({ to: '/stations' });
	};

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div>
				<h1 className='text-3xl font-bold'>Dashboard</h1>
				<p className='text-muted-foreground'>
					Welcome back, {user?.username || 'User'}!
				</p>
			</div>

			{/* Statistics Cards */}
			{isLoading ? (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} className='h-32' />
					))}
				</div>
			) : (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
					{/* Total Stations */}
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Total Stations
							</CardTitle>
							<MapPin className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{stats.total}</div>
							<p className='text-xs text-muted-foreground mt-1'>
								{stats.dcFastChargers} DC Fast • {stats.acChargers} AC
							</p>
						</CardContent>
					</Card>

					{/* Active Stations */}
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Active Stations
							</CardTitle>
							<Activity className='h-4 w-4 text-green-600' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold text-green-600'>
								{stats.active}
							</div>
							<p className='text-xs text-muted-foreground mt-1'>
								{stats.total > 0
									? ((stats.active / stats.total) * 100).toFixed(1)
									: 0}
								% operational
							</p>
						</CardContent>
					</Card>

					{/* Inactive Stations */}
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Inactive Stations
							</CardTitle>
							<Zap className='h-4 w-4 text-red-600' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold text-red-600'>
								{stats.inactive}
							</div>
							<p className='text-xs text-muted-foreground mt-1'>
								{stats.total > 0
									? ((stats.inactive / stats.total) * 100).toFixed(1)
									: 0}
								% offline
							</p>
						</CardContent>
					</Card>

					{/* Charging Slots */}
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Charging Slots
							</CardTitle>
							<Plug className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>
								{stats.availableSlots}/{stats.totalSlots}
							</div>
							<p className='text-xs text-muted-foreground mt-1'>
								{stats.occupancyRate.toFixed(1)}% occupancy
							</p>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Map and Additional Info */}
			<div className='grid gap-6 lg:grid-cols-3'>
				{/* Map */}
				<Card className='lg:col-span-2'>
					<CardHeader className='flex flex-row items-center justify-between'>
						<div>
							<CardTitle>Stations Map</CardTitle>
							<p className='text-sm text-muted-foreground mt-1'>
								All charging stations across Sri Lanka
							</p>
						</div>
						<Button variant='outline' size='sm' onClick={handleViewAllStations}>
							View All
						</Button>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<Skeleton className='h-[400px] w-full' />
						) : stations && stations.length > 0 ? (
							<div className='h-[400px] w-full relative z-0'>
								<StationsMap
									stations={stations}
									onStationClick={handleStationClick}
								/>
							</div>
						) : (
							<div className='h-[400px] flex items-center justify-center border rounded-lg'>
								<div className='text-center'>
									<MapPin className='h-12 w-12 text-muted-foreground mx-auto mb-2' />
									<p className='text-muted-foreground'>No stations available</p>
								</div>
							</div>
						)}
						<div className='flex items-center gap-4 mt-4 text-sm'>
							<div className='flex items-center gap-2'>
								<div className='h-3 w-3 rounded-full bg-green-500' />
								<span className='text-muted-foreground'>Active</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='h-3 w-3 rounded-full bg-red-500' />
								<span className='text-muted-foreground'>Inactive</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Additional Stats and Info */}
				<div className='space-y-6'>
					{/* Capacity Overview */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<Battery className='h-5 w-5' />
								Capacity Overview
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<div className='flex items-center justify-between text-sm'>
									<span className='text-muted-foreground'>Total Slots</span>
									<span className='font-semibold'>{stats.totalSlots}</span>
								</div>
								<div className='flex items-center justify-between text-sm'>
									<span className='text-muted-foreground'>Available</span>
									<span className='font-semibold text-green-600'>
										{stats.availableSlots}
									</span>
								</div>
								<div className='flex items-center justify-between text-sm'>
									<span className='text-muted-foreground'>In Use</span>
									<span className='font-semibold text-orange-600'>
										{stats.totalSlots - stats.availableSlots}
									</span>
								</div>
							</div>
							<div className='pt-2 border-t'>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-muted-foreground'>
										Occupancy Rate
									</span>
									<Badge
										variant={
											stats.occupancyRate > 75
												? 'destructive'
												: stats.occupancyRate > 50
													? 'default'
													: 'secondary'
										}
									>
										{stats.occupancyRate.toFixed(1)}%
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Charger Types */}
					<Card>
						<CardHeader>
							<CardTitle className='flex items-center gap-2'>
								<TrendingUp className='h-5 w-5' />
								Charger Types
							</CardTitle>
						</CardHeader>
						<CardContent className='space-y-3'>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>
									DC Fast Charger
								</span>
								<div className='flex items-center gap-2'>
									<span className='font-semibold'>{stats.dcFastChargers}</span>
									<span className='text-xs text-muted-foreground'>
										(
										{stats.total > 0
											? ((stats.dcFastChargers / stats.total) * 100).toFixed(0)
											: 0}
										%)
									</span>
								</div>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-sm text-muted-foreground'>
									AC Charger
								</span>
								<div className='flex items-center gap-2'>
									<span className='font-semibold'>{stats.acChargers}</span>
									<span className='text-xs text-muted-foreground'>
										(
										{stats.total > 0
											? ((stats.acChargers / stats.total) * 100).toFixed(0)
											: 0}
										%)
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					{(isBackoffice || isOperator) && (
						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2'>
								<Button
									variant='outline'
									className='w-full justify-start'
									onClick={handleViewAllStations}
								>
									<MapPin className='mr-2 h-4 w-4' />
									View All Stations
								</Button>
								{isBackoffice && (
									<Button
										variant='outline'
										className='w-full justify-start'
										onClick={() => navigate({ to: '/stations/create' })}
									>
										<Plug className='mr-2 h-4 w-4' />
										Add New Station
									</Button>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
