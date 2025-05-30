import mongoose from 'mongoose';

const ParkingSpotSchema = new mongoose.Schema({
  floor: Number,
  spotNumber: Number,
  spotType: String,
  isOccupied: Boolean,
  vehicle: {
    vehicleType: String,
    plateNumber: String,
  },
});

const ParkingSpot = mongoose.models.ParkingSpot || mongoose.model('ParkingSpot', ParkingSpotSchema);

export default ParkingSpot;
