import connectMongoDB from "@/lib/mongodb";
import ParkingSpot from "@/models/ParkingSpot";

export default async function handler(req, res) {
  await connectMongoDB();

  if (req.method === "DELETE") {
    const { plateNumber } = req.body;

    if (!plateNumber) {
      return res.status(400).json({ error: "Plate number is required" });
    }

    const spot = await ParkingSpot.findOne({
      "vehicle.plateNumber": plateNumber,
      isOccupied: true,
    });

    if (!spot) return res.status(404).json({ error: "Car not found" });

    spot.isOccupied = false;
    spot.vehicle = undefined;
    await spot.save();

    return res.status(200).json({ message: "Car unparked!" });
  }

  res.status(405).json({ error: "Method not allowed" });
}