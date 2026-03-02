import { useEffect, useState } from "react";
import { Bus, Users, MapPin, Plus, Search, Trash2 } from "lucide-react";

export default function BusManager() {
  const [buses, setBuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, just showing the seeded bus
    setBuses([{ id: 1, bus_no: "BUS-01", route_name: "Route A - City Center", driver_name: "driver01" }]);
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Bus Management</h1>
          <p className="text-neutral-500">Manage college bus routes and driver assignments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add New Bus
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">Total Buses</p>
          <p className="text-3xl font-bold text-neutral-900">{buses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">Active Routes</p>
          <p className="text-3xl font-bold text-neutral-900">{buses.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">Total Drivers</p>
          <p className="text-3xl font-bold text-neutral-900">1</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search bus or route..." 
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Bus No</th>
                <th className="px-6 py-4 font-semibold">Route</th>
                <th className="px-6 py-4 font-semibold">Driver</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">{bus.bus_no}</td>
                  <td className="px-6 py-4 text-neutral-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    {bus.route_name}
                  </td>
                  <td className="px-6 py-4 text-neutral-600 capitalize">{bus.driver_name}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
