import axios from "axios";
import { useEffect, useState } from "react";
import { BASEURL } from "../../../constant";

const OverViewPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(BASEURL + "/api/v1/booking/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        setStats(response.data.data);
      } catch (error) {
        console.log(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Total Orders Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
            <p className="text-2xl font-bold mt-2">{stats?.totalOrders || 0}</p>
          </div>

          {/* Completed Orders Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Completed Orders</h3>
            <p className="text-2xl font-bold mt-2 text-green-600">{stats?.completedOrders || 0}</p>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
            <p className="text-2xl font-bold mt-2 text-yellow-600">{stats?.pendingOrders || 0}</p>
          </div>

          {/* Paid Amount Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Paid Amount</h3>
            <p className="text-2xl font-bold mt-2 text-blue-600">
              ₹{new Intl.NumberFormat('en-IN').format(stats?.paidAmount || 0)}
            </p>
          </div>

          {/* Pending Amount Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-medium">Pending Amount</h3>
            <p className="text-2xl font-bold mt-2 text-red-600">
              ₹{new Intl.NumberFormat('en-IN').format(stats?.pendingAmount || 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverViewPage;