import { useEffect, useState } from "react";

interface Vehicle {
  vehicleType: string;
  plateNumber: string;
}

interface ParkingSpot {
  _id: string;
  floor: number;
  spotNumber: number;
  spotType: string;
  isOccupied: boolean;
  vehicle?: Vehicle;
}

export default function Home() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [floor, setFloor] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const res = await fetch("/api/all-spots");
        const data: ParkingSpot[] = await res.json();
        setSpots(data);
      } catch (error) {
        setMessage("Failed to fetch parking spots");
      }
    };

    fetchSpots();
  }, []);

  const handlePark = async () => {
    if (!plateNumber.trim()) {
      setMessage("Please enter a valid plate number");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/park", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vehicleType, floor, plateNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Parked successfully! ${data.message}`);
        const res = await fetch("/api/all-spots");
        const updatedSpots = await res.json();
        setSpots(updatedSpots);
        setPlateNumber("");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error parking vehicle");
    } finally {
      setLoading(false);
    }
  };

  const handleUnpark = async () => {
    if (!plateNumber.trim()) {
      setMessage("Please enter a valid plate number");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/unpark", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plateNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Unparked successfully! ${data.message}`);
        const res = await fetch("/api/all-spots");
        const updatedSpots = await res.json();
        setSpots(updatedSpots);
        setPlateNumber("");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error unparking vehicle");
    } finally {
      setLoading(false);
    }
  };

  const filteredSpots = spots.filter((spot) => spot.floor === floor);

  const floorSpots = spots.filter((s) => s.floor === floor);
  const availableSpots = floorSpots.filter((s) => !s.isOccupied).length;
  const totalSpots = floorSpots.length;

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-center">
      <div className="mx-auto max-w-6xl min-h-screen flex flex-col px-4">
        <header className="text-center py-10">
          <h1 className="text-4xl font-bold mb-6 text-black">
            Parking Lot System
          </h1>
        </header>

        <section className="bg-white p-8 rounded-2xl mb-12 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-8 text-center text-black">
            Park / Unpark Vehicle
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Plate Number
              </label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-black">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl text-black"
                disabled={loading}
              >
                <option value="motorcycle">Motorcycle</option>
                <option value="car">Car</option>
                <option value="bus">Bus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-black">Floor</label>
              <select
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-xl text-black"
                disabled={loading}
              >
                {[1, 2, 3, 4, 5].map((f) => (
                  <option key={f} value={f}>
                    Floor {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handlePark}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Park Vehicle"}
              </button>
              <button
                onClick={handleUnpark}
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Unpark Vehicle"}
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mt-6 p-4 text-center rounded-xl text-sm font-medium shadow-inner ${
                message.includes("Error")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
        </section>

        <section className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2 text-black">Floor {floor}</h3>
          <div className="text-sm text-gray-600 mb-4">
            {availableSpots} available out of {totalSpots} spots
          </div>
        </section>

        <section className="mb-12">
          {filteredSpots.length === 0 ? (
            <div className="text-center py-12 bg-gray-100 rounded-xl">
              <p className="text-black">No spots available on this floor</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
              {filteredSpots.map((spot) => (
                <div
                  key={spot._id}
                  className={`rounded-xl border-2 p-6 text-center transition-all duration-200 text-sm shadow-sm ${
                    spot.isOccupied
                      ? "bg-red-100 border-red-300 text-red-800"
                      : "bg-green-100 border-green-300 text-green-800"
                  }`}
                >
                  <div className="font-semibold text-sm mb-2">
                    Spot #{spot.spotNumber}
                  </div>
                  <div className="text-xs mb-3">({spot.spotType})</div>                  
                  {spot.isOccupied ? (
                    <div className="flex flex-col items-center justify-center bg-red-200 px-3 py-1 rounded-full text-xs font-medium">
                      <span>{spot.vehicle?.plateNumber}</span>
                      <span className="text-[10px] text-red-800">({spot.vehicle?.vehicleType})</span>
                    </div>
                  ) : (
                    <span className="inline-block bg-green-200 px-3 py-1 rounded-full text-xs font-medium">
                      Available
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
