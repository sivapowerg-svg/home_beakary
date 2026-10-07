import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { AdminStats, Order } from '../../types/bakery.ts';
import {
  ShoppingBag,
  Clock,
  ChefHat,
  Bike,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Loader2,
  Calendar
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [statsData, ordersData] = await Promise.all([
          api.getAdminStats(),
          api.getOrders()
        ]);
        setStats(statsData);
        setRecentOrders(ordersData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-3" />
        <p className="text-sm text-[#735A4C]">Loading bakery dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Greeting Header */}
      <div>
        <span className="font-script text-2xl text-[#C85A32]">kitchen command</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1E16] mt-0.5">
          Good morning, Baker 👋
        </h1>
        <p className="text-sm text-[#5A4537] mt-1 font-light">
          Here’s what’s happening with your bakery today.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#EAE3D9] shadow-sm">
          <div className="flex items-center justify-between text-[#735A4C] mb-2">
            <span className="text-xs uppercase font-semibold">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#2B1E16]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#2B1E16]">
            {stats?.totalOrders || 0}
          </p>
          <span className="text-[11px] text-[#735A4C] mt-1 block">Lifetime orders</span>
        </div>

        {/* Pending */}
        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#EAE3D9] shadow-sm">
          <div className="flex items-center justify-between text-[#735A4C] mb-2">
            <span className="text-xs uppercase font-semibold">Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-3xl font-bold text-amber-600">
            {stats?.pendingOrders || 0}
          </p>
          <span className="text-[11px] text-[#735A4C] mt-1 block">Awaiting confirmation</span>
        </div>

        {/* Baking */}
        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#EAE3D9] shadow-sm">
          <div className="flex items-center justify-between text-[#735A4C] mb-2">
            <span className="text-xs uppercase font-semibold">Baking</span>
            <ChefHat className="w-4 h-4 text-[#C85A32]" />
          </div>
          <p className="font-serif text-3xl font-bold text-[#C85A32]">
            {stats?.bakingOrders || 0}
          </p>
          <span className="text-[11px] text-[#735A4C] mt-1 block">In the oven now</span>
        </div>

        {/* Out for Delivery */}
        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#EAE3D9] shadow-sm">
          <div className="flex items-center justify-between text-[#735A4C] mb-2">
            <span className="text-xs uppercase font-semibold">Out for Delivery</span>
            <Bike className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-serif text-3xl font-bold text-blue-700">
            {stats?.outForDelivery || 0}
          </p>
          <span className="text-[11px] text-[#735A4C] mt-1 block">On road to customer</span>
        </div>

        {/* Completed */}
        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#EAE3D9] shadow-sm">
          <div className="flex items-center justify-between text-[#735A4C] mb-2">
            <span className="text-xs uppercase font-semibold">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-3xl font-bold text-emerald-700">
            {stats?.completedOrders || 0}
          </p>
          <span className="text-[11px] text-[#735A4C] mt-1 block">Delivered safely</span>
        </div>

        {/* Revenue */}
        <div className="bg-[#2B1E16] text-[#FDFBF7] p-5 rounded-2xl shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-[#D4A373] mb-2">
            <span className="text-xs uppercase font-semibold">Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#E07A5F]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#FDFBF7]">
            ₹{stats?.revenue || 0}
          </p>
          <span className="text-[11px] text-[#D9C8B5] mt-1 block">Fulfilled sales</span>
        </div>
      </div>

      {/* Visual Pipeline Bar */}
      <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#EAE3D9]">
        <h3 className="font-serif text-lg font-bold text-[#2B1E16] mb-3">
          Kitchen Order Pipeline Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-[#EAE3D9]">
            <p className="text-[#735A4C]">Pending Confirmation</p>
            <p className="font-serif text-xl font-bold text-[#2B1E16] mt-1">
              {stats?.pendingOrders || 0}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#EAE3D9]">
            <p className="text-[#735A4C]">In Oven / Baking</p>
            <p className="font-serif text-xl font-bold text-[#C85A32] mt-1">
              {stats?.bakingOrders || 0}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#EAE3D9]">
            <p className="text-[#735A4C]">Ready / Dispatching</p>
            <p className="font-serif text-xl font-bold text-blue-700 mt-1">
              {stats?.readyOrders || 0}
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-[#EAE3D9]">
            <p className="text-[#735A4C]">Successfully Delivered</p>
            <p className="font-serif text-xl font-bold text-emerald-700 mt-1">
              {stats?.completedOrders || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-[#FAF7F0] rounded-2xl border border-[#EAE3D9] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#EAE3D9] flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2B1E16]">
              Recent Kitchen Orders
            </h3>
            <p className="text-xs text-[#735A4C] mt-0.5">Latest celebratory cakes and treats</p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C85A32] hover:text-[#B34B24]"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#735A4C]">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F2ECE1] text-[#735A4C] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5 font-semibold">Order ID</th>
                  <th className="py-3 px-5 font-semibold">Customer</th>
                  <th className="py-3 px-5 font-semibold">Product & Details</th>
                  <th className="py-3 px-5 font-semibold">Delivery Date</th>
                  <th className="py-3 px-5 font-semibold">Total</th>
                  <th className="py-3 px-5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D9]">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-4 px-5 font-mono font-bold text-[#2B1E16]">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-[#2B1E16]">{order.customer?.name}</p>
                      <p className="text-xs text-[#735A4C]">{order.customer?.phone}</p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-medium text-[#2B1E16]">{order.product?.name}</p>
                      <p className="text-xs text-[#735A4C]">
                        {order.size} · {order.flavor}
                      </p>
                    </td>
                    <td className="py-4 px-5 text-[#5A4537] whitespace-nowrap">
                      {order.deliveryDate}
                    </td>
                    <td className="py-4 px-5 font-serif font-bold text-[#2B1E16]">
                      ₹{order.total}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'BAKING'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'OUT_FOR_DELIVERY'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
