import connectMongoDB from "@/lib/mongodb";
import ParkingSpot from "@/models/ParkingSpot";

export default async function handler(req, res) {
  await connectMongoDB();

  const spots = await ParkingSpot.find();
  return res.status(200).json(spots);
}
