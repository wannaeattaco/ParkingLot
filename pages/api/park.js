import connectMongoDB from "@/lib/mongodb";
import ParkingSpot from "@/models/ParkingSpot";

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === "POST") {
    const { vehicleType, floor, plateNumber } = req.body;

    if (!vehicleType || !floor || !plateNumber) {
      res.status(400).json({ error: "Missing fields", body: req.body });
      return;
    }

    const spotPriority = {
      motorcycle: ["motorcycle", "compact", "large"],
      car: ["compact", "large"],
      bus: ["large"],
    };

    const allowedSpots = spotPriority[vehicleType];

    try {
      const spot = await ParkingSpot.findOne({
        floor,
        spotType: { $in: allowedSpots },
        isOccupied: false,
      });

      if (!spot) {
        res.status(400).json({ error: "No available spot on this floor" });
        return;
      }

      spot.isOccupied = true;
      spot.vehicle = { vehicleType, plateNumber };
      await spot.save();

      res.status(200).json({ message: `Vehicle parked on floor #${spot.floor} at spot #${spot.spotNumber} ` });
      return;
    } catch (err) {
      console.error("Error parking vehicle:", err);
      res.status(500).json({ error: "Server error" });
      return;
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
}
