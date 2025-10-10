import { BookingStatus, type IBooking } from '@/types/booking';

export const sampleBookings: IBooking[] = [
	{
		id: 'bkg-001',
		evOwnerId: 'ev-100',
		evOwnerName: 'Alice Johnson',
		stationId: 'st-01',
		stationName: 'Downtown Fast Charge',
		stationAddress: '123 Main St, Cityville',
		bookingDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // tomorrow
		timeSlot: { startTime: '09:00', endTime: '10:00' },
		status: BookingStatus.Pending,
		qrCode: '',
		vehicleInfo: 'Nissan Leaf - ABC-1234',
		notes: 'Customer requested priority access',
		cancellationReason: '',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: 'bkg-002',
		evOwnerId: 'ev-101',
		evOwnerName: 'Bob Smith',
		stationId: 'st-01',
		stationName: 'Downtown Fast Charge',
		stationAddress: '123 Main St, Cityville',
		bookingDate: new Date().toISOString(), // today
		timeSlot: { startTime: '14:00', endTime: '15:00' },
		status: BookingStatus.Approved,
		qrCode: 'QRSTRING-002',
		vehicleInfo: 'Tesla Model 3 - XYZ-5678',
		notes: '',
		cancellationReason: '',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: 'bkg-003',
		evOwnerId: 'ev-102',
		evOwnerName: 'Chen Lee',
		stationId: 'st-02',
		stationName: 'Uptown Charge Point',
		stationAddress: '456 Oak Ave, Cityville',
		bookingDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
		timeSlot: { startTime: '11:00', endTime: '12:00' },
		status: BookingStatus.Completed,
		qrCode: 'QRSTRING-003',
		vehicleInfo: 'BMW i3 - LMN-9012',
		notes: 'Customer arrived early',
		cancellationReason: '',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		id: 'bkg-004',
		evOwnerId: 'ev-103',
		evOwnerName: 'Diego Rivera',
		stationId: 'st-01',
		stationName: 'Downtown Fast Charge',
		stationAddress: '123 Main St, Cityville',
		bookingDate: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // in 2 days
		timeSlot: { startTime: '16:00', endTime: '17:00' },
		status: BookingStatus.Cancelled,
		qrCode: '',
		vehicleInfo: 'Hyundai Kona EV - QWE-3344',
		notes: 'Cancelled due to schedule conflict',
		cancellationReason: 'Owner had an emergency',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

export default sampleBookings;
