import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Order } from '../../types/bakery.ts';
import { CheckCircle2, ArrowRight, ShoppingBag, Clock, MapPin, User, ChevronRight } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (order || !orderNumber) return;
      try {
        setLoading(true);
        const data = await api.trackOrder(orderNumber);
        setOrder(data);
      } catch (err: any) {
        setError(err.message || 'Could not find order details');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderNumber, order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#C85A32] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-[#735A4C]">Retrieving order receipt...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-[#FAF7F0] p-8 rounded-2xl border border-[#EAE3D9]">
          <h2 className="font-serif text-2xl font-bold text-[#2B1E16]">Order Not Found</h2>
          <p className="text-sm text-[#735A4C] mt-2">{error || 'Please verify your order number'}</p>
          <Link
            to="/menu"
            className="inline-block mt-6 px-5 py-2.5 bg-[#C85A32] text-white rounded-xl text-sm font-medium"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Banner */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="font-script text-3xl text-[#C85A32] block">thank you</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2B1E16] tracking-tight">
            Your sweet order is confirmed! 🎉
          </h1>
          <p className="text-sm sm:text-base text-[#5A4537] max-w-lg mx-auto font-light">
            Our kitchen has received your details. We will bake your treat fresh with love on your requested date.
          </p>

          <div className="inline-block bg-[#F2ECE1] border border-[#D9C8B5] px-4 py-2 rounded-xl text-sm text-[#2B1E16] font-mono">
            Order Reference: <strong className="text-[#C85A32] font-sans text-base">{order.orderNumber}</strong>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#FAF7F0] rounded-3xl border border-[#EAE3D9] shadow-sm p-6 sm:p-9 space-y-8">
          {/* Status & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE3D9] gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#735A4C] block">
                Current Kitchen Status
              </span>
              <span className="font-serif text-xl font-bold text-[#2B1E16]">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-xs uppercase tracking-wider text-[#735A4C] block">
                Scheduled Delivery
              </span>
              <span className="font-serif text-lg font-bold text-[#2B1E16]">
                {order.deliveryDate} ({order.deliveryTime})
              </span>
            </div>
          </div>

          {/* Product & Customization summary */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2B1E16]">
              Treat & Customization Summary
            </h3>
            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-[#EAE3D9]">
              {order.product?.imageUrl && (
                <img
                  src={order.product.imageUrl}
                  alt={order.product.name}
                  className="w-20 h-20 object-cover rounded-xl border border-[#EAE3D9] flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-lg font-bold text-[#2B1E16]">
                  {order.product?.name || 'Artisanal Bake'}
                </h4>
                <div className="mt-1 text-xs text-[#5A4537] space-y-1">
                  <p>
                    <strong>Quantity:</strong> {order.quantity} · <strong>Size:</strong> {order.size}
                  </p>
                  <p>
                    <strong>Flavor:</strong> {order.flavor}
                  </p>
                  {order.eggless && (
                    <p className="text-emerald-800 font-semibold">● 100% Eggless Recipe</p>
                  )}
                  {order.cakeMessage && (
                    <p>
                      <strong>Message on Cake:</strong> “{order.cakeMessage}”
                    </p>
                  )}
                  {order.additionalDecorations && order.additionalDecorations !== 'None' && (
                    <p>
                      <strong>Decorations:</strong> {order.additionalDecorations}
                    </p>
                  )}
                  {order.specialInstructions && (
                    <p>
                      <strong>Instructions:</strong> {order.specialInstructions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EAE3D9] text-xs sm:text-sm text-[#4A3528]">
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-base text-[#2B1E16] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C85A32]" />
                <span>Delivery Address</span>
              </h4>
              <p className="text-[#5A4537] leading-relaxed">{order.deliveryAddress}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif font-bold text-base text-[#2B1E16] flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#C85A32]" />
                <span>Customer Contact</span>
              </h4>
              <p className="text-[#5A4537]">
                <strong>Name:</strong> {order.customer?.name}
              </p>
              <p className="text-[#5A4537]">
                <strong>Phone:</strong> {order.customer?.phone}
              </p>
              <p className="text-[#5A4537]">
                <strong>Email:</strong> {order.customer?.email}
              </p>
            </div>
          </div>

          {/* Pricing Ledger */}
          <div className="pt-4 border-t border-[#EAE3D9] space-y-2.5 text-sm text-[#4A3528]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-[#2B1E16]">₹{order.subtotal}</span>
            </div>
            {order.customizationCharge > 0 && (
              <div className="flex justify-between">
                <span>Customization Charges</span>
                <span className="font-medium text-[#2B1E16]">₹{order.customizationCharge}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="font-medium text-[#2B1E16]">₹{order.deliveryCharge}</span>
            </div>
            <div className="pt-3 border-t border-[#EAE3D9] flex justify-between items-baseline">
              <span className="font-serif text-lg font-bold text-[#2B1E16]">Grand Total</span>
              <span className="font-serif text-2xl font-bold text-[#C85A32]">
                ₹{order.total}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={`/track?order=${order.orderNumber}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#B34B24] text-white px-7 py-3.5 rounded-xl font-medium text-sm shadow-sm hover:shadow transition-all text-center"
          >
            <Clock className="w-4 h-4" />
            <span>Track My Order</span>
          </Link>

          <Link
            to="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-[#F2ECE1] border border-[#D9C8B5] text-[#2B1E16] px-6 py-3.5 rounded-xl font-medium text-sm transition-colors text-center"
          >
            <span>Back to Menu</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
