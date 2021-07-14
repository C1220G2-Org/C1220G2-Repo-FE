export interface BookingCancellation {
  cancellationReason: string;
  cancellationTime: string;
  userId: number;
  roomName: string;
  bookingId: number;
}
