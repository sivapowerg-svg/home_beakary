import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../services/api.ts';
import { Order, OrderStatus } from '../../types/bakery.ts';
import { useToast } from '../../context/ToastContext.tsx';
import {
  Search,
  Filter,
  Eye,
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Sparkles
} from 'lucide-react';

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'BAKING',
  'READY_FOR_DELIVERY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED'
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const { showToast } = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        const matchesStatus =
          selectedStatus === 'ALL' || o.status === selectedStatus;

        const matchesDate = !dateFilter || o.deliveryDate === dateFilter;

        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer?.name.toLowerCase().includes(q) ||
          o.customer?.phone.includes(q) ||
          o.product?.name.toLowerCase().includes(q);

        return matchesStatus && matchesDate && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [orders, selectedStatus, dateFilter, searchQuery, sortOrder]);

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      setStatusUpdating(true);
      const updated = await api.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus.replace(/_/g, ' ')}!`, 'success');

      // Update in state
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await api.deleteOrder(orderId);
      showToast('Order removed successfully', 'success');
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete order', 'error');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'CONFIRMED':
        return 'bg-sky-100 text-sky-900 border-sky-200';
      case 'BAKING':
        return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'READY_FOR_DELIVERY':
        return 'bg-indigo-100 text-indigo-900 border-indigo-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-900 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-script text-2xl text-[#C85A32]">order queue</span>
          <h1 className="font-serif text-3xl font-bold text-[#2B1E16] mt-0.5">
            Bakery Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4537] mt-1 font-light">
            Monitor, inspect customizations, and update live preparation statuses.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold px-3 py-2 bg-[#FAF7F0] border border-[#D9C8B5] rounded-xl text-[#2B1E16] hover:bg-[#F2ECE1] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF7F0] p-4 sm:p-5 rounded-2xl border border-[#EAE3D9] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#735A4C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order #, customer, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#D9C8B5] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-[#2B1E16] placeholder-[#9E8B7F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#D9C8B5] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#D9C8B5] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
            />
          </div>

          {/* Sort order */}
          <div className="flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={(e: any) => setSortOrder(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#D9C8B5] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40 cursor-pointer"
            >
              <option value="desc">Newest Orders First</option>
              <option value="asc">Oldest Orders First</option>
            </select>

            {(searchQuery || selectedStatus !== 'ALL' || dateFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStatus('ALL');
                  setDateFilter('');
                }}
                className="text-xs text-[#C85A32] hover:underline whitespace-nowrap px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#735A4C]">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF7F0] rounded-2xl border border-[#EAE3D9] p-8">
          <p className="font-serif text-lg font-bold text-[#2B1E16]">No orders found</p>
          <p className="text-xs text-[#735A4C] mt-1">
            Try adjusting your search query, status, or date filter.
          </p>
        </div>
      ) : (
        <div className="bg-[#FAF7F0] rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F2ECE1] text-[#735A4C] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Delivery Date</th>
                  <th className="py-3.5 px-4 font-semibold">Total</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D9]">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[#FDFBF7] transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-4 px-4 font-mono font-bold text-[#2B1E16]">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-[#2B1E16]">{order.customer?.name}</p>
                      <p className="text-xs text-[#735A4C]">{order.customer?.phone}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-[#2B1E16]">{order.product?.name}</p>
                      <p className="text-xs text-[#735A4C]">
                        {order.quantity} × {order.size}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-[#5A4537] whitespace-nowrap">
                      {order.deliveryDate}
                    </td>
                    <td className="py-4 px-4 font-serif font-bold text-[#2B1E16]">
                      ₹{order.total}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td
                      className="py-4 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-[#735A4C] hover:text-[#2B1E16] hover:bg-[#EAE3D9] rounded-lg transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL / DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF7F0] rounded-3xl border border-[#EAE3D9] max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-[#EAE3D9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="pr-10 pb-5 border-b border-[#EAE3D9]">
              <span className="text-xs uppercase tracking-wider text-[#735A4C]">
                Order Details
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#2B1E16] mt-0.5">
                {selectedOrder.orderNumber}
              </h2>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#735A4C]">
                <span>Ordered: {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                <span>·</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-semibold border ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Status Changer Section */}
            <div className="py-5 border-b border-[#EAE3D9] bg-white -mx-6 sm:-mx-8 px-6 sm:px-8">
              <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-2">
                Update Order Status (Instantly reflects in customer tracking)
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((st) => {
                  const isCurrent = selectedOrder.status === st;
                  return (
                    <button
                      key={st}
                      disabled={statusUpdating}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isCurrent
                          ? 'bg-[#2B1E16] text-[#FDFBF7] ring-2 ring-[#C85A32]'
                          : 'bg-[#FAF7F0] text-[#5A4537] hover:bg-[#F2ECE1] border border-[#EAE3D9]'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Body */}
            <div className="py-6 space-y-6 text-xs sm:text-sm text-[#2B1E16]">
              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base text-[#2B1E16]">
                  Treat & Recipe Specifications
                </h3>
                <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] space-y-2">
                  <p>
                    <strong>Product:</strong> {selectedOrder.product?.name}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {selectedOrder.quantity}
                  </p>
                  <p>
                    <strong>Portion Size:</strong> {selectedOrder.size}
                  </p>
                  <p>
                    <strong>Flavor:</strong> {selectedOrder.flavor}
                  </p>
                  <p>
                    <strong>Theme:</strong> {selectedOrder.theme}
                  </p>
                  {selectedOrder.eggless && (
                    <p className="text-emerald-800 font-bold">● 100% Eggless</p>
                  )}
                  {selectedOrder.cakeMessage && (
                    <p>
                      <strong>Cake Message:</strong> “{selectedOrder.cakeMessage}”
                    </p>
                  )}
                  {selectedOrder.additionalDecorations && (
                    <p>
                      <strong>Add-ons:</strong> {selectedOrder.additionalDecorations}
                    </p>
                  )}
                  {selectedOrder.specialInstructions && (
                    <p className="text-[#C85A32]">
                      <strong>Instructions:</strong> {selectedOrder.specialInstructions}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base text-[#2B1E16]">
                  Delivery Schedule & Location
                </h3>
                <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] space-y-1.5">
                  <p>
                    <strong>Date:</strong> {selectedOrder.deliveryDate}
                  </p>
                  <p>
                    <strong>Time Window:</strong> {selectedOrder.deliveryTime}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedOrder.deliveryAddress}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base text-[#2B1E16]">
                  Customer Contact
                </h3>
                <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] space-y-1.5">
                  <p>
                    <strong>Name:</strong> {selectedOrder.customer?.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.customer?.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.customer?.email}
                  </p>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-base text-[#2B1E16]">
                  Payment & Ledger Breakdown
                </h3>
                <div className="bg-white p-4 rounded-xl border border-[#EAE3D9] space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customization Fee:</span>
                    <span className="font-medium">₹{selectedOrder.customizationCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-medium">₹{selectedOrder.deliveryCharge}</span>
                  </div>
                  <div className="pt-2 border-t border-[#EAE3D9] flex justify-between font-serif font-bold text-base">
                    <span>Total Amount:</span>
                    <span className="text-[#C85A32]">₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-[#EAE3D9] flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-[#2B1E16] text-[#FDFBF7] rounded-xl text-xs font-semibold hover:bg-[#C85A32] transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
