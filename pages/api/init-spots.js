import connectMongoDB from "@/lib/mongodb";
import ParkingSpot from "@/models/ParkingSpot";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectMongoDB();

  await ParkingSpot.deleteMany({});

  const spots = [];

  for (let floor = 1; floor <= 5; floor++) {
    for (let i = 1; i <= 24; i++) {
      let spotType = "compact";
      if (i <= 8) spotType = "motorcycle";
      else if (i <= 20) spotType = "compact";
      else spotType = "large";
            
      spots.push({
        floor,
        spotNumber: i,
        spotType,
        isOccupied: false,
        vehicle: null,
      });
    }
  }

  await ParkingSpot.insertMany(spots);

  return res.status(200).json({ message: "Parking spots initialized" });
}

