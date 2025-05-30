import ParkingSpot from "@/models/ParkingSpot.js";

export const spotPriority: Record<string, string[]> = {
  motorcycle: ["motorcycle", "compact", "large"],
  car: ["compact", "large"],
  bus: ["large"],
};

export const findAvailableSpot = async (vehicleType: string, floor: number) => {
  const allowedSpots = spotPriority[vehicleType];
  return await ParkingSpot.findOne({
    floor,
    spotType: { $in: allowedSpots },
    isOccupied: false,
  });
};
