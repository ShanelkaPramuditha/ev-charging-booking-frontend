import { useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth/use-auth';
import { useStations } from '@/queries/station.queries';
import type { IUserProfile } from '@/types/user';

import { StationCard } from './station-card';

export function StationsPage() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { data: stations, isLoading } = useStations();
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState<
		'all' | 'active' | 'inactive'
	>('all');

	const userProfile = user as IUserProfile;
	const isBackoffice = userProfile?.role === 'backOffice';

	const handleCreateStation = () => {
		navigate({ to: '/stations/create' });
	};

	// Filter stations
	const filteredStations = stations?.filter((station) => {
		const matchesSearch =
			station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			station.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			station.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			station.operator?.username
				?.toLowerCase()
				.includes(searchQuery.toLowerCase());

		const matchesStatus =
			filterStatus === 'all' ||
			(filterStatus === 'active' && station.isActive) ||
			(filterStatus === 'inactive' && !station.isActive);

		return matchesSearch && matchesStatus;
	});

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Charging Stations
					</h1>
					<p className='text-muted-foreground'>
						Manage EV charging stations and their availability
					</p>
				</div>
				{isBackoffice && (
					<Button onClick={handleCreateStation}>
						<Plus className='mr-2 h-4 w-4' />
						Add Station
					</Button>
				)}
			</div>

			{/* Filters */}
			<div className='flex flex-col gap-4 md:flex-row'>
				<Input
					placeholder='Search stations by name, city, or address...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='md:max-w-sm'
				/>
				<Select
					value={filterStatus}
					onValueChange={(value: 'all' | 'active' | 'inactive') =>
						setFilterStatus(value)
					}
				>
					<SelectTrigger className='md:w-[180px]'>
						<SelectValue placeholder='Filter by status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Stations</SelectItem>
						<SelectItem value='active'>Active</SelectItem>
						<SelectItem value='inactive'>Inactive</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Stations Grid */}
			{isLoading ? (
				<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{[...Array(6)].map((_, i) => (
						<Skeleton key={i} className='h-80' />
					))}
				</div>
			) : filteredStations && filteredStations.length > 0 ? (
				<>
					<div className='text-muted-foreground text-sm'>
						Showing {filteredStations.length} of {stations?.length || 0} station
						{stations?.length !== 1 ? 's' : ''}
					</div>
					<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
						{filteredStations.map((station) => (
							<StationCard key={station.id} station={station} />
						))}
					</div>
				</>
			) : (
				<div className='flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center'>
					<p className='text-muted-foreground'>
						{searchQuery || filterStatus !== 'all'
							? 'No stations found matching your filters'
							: 'No stations available'}
					</p>
					{isBackoffice && !searchQuery && filterStatus === 'all' && (
						<Button
							variant='outline'
							className='mt-4'
							onClick={handleCreateStation}
						>
							<Plus className='mr-2 h-4 w-4' />
							Add Your First Station
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
