import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Order, OrderStatus } from '../../types/bakery.ts';
import { useToast } from '../../context/ToastContext.tsx';
import {
  Search,
  CheckCircle2,
  Clock,
  Package,
  Bike,
  Home,
  AlertCircle,
  Sparkles,
  Loader2,
  Calendar,
  ChefHat
} from 'lucide-react';

interface StatusStep {
  status: OrderStatus;
  label: string;
  desc: string;
  icon: any;
}

const STEPS: StatusStep[] = [
  {
    status: 'PENDING',
    label: 'Order Placed',
    desc: 'We received your order request in our kitchen system.',
    icon: Clock
  },
  {
    status: 'CONFIRMED',
    label: 'Confirmed',
    desc: 'Baker has scheduled ingredients and oven slots for your treat.',
    icon: CheckCircle2
  },
  {
    status: 'BAKING',
    label: 'Baking',
    desc: 'Sponges are rising in our ovens and artisanal frosting is whipping.',
    icon: ChefHat
  },
  {
    status: 'READY_FOR_DELIVERY',
    label: 'Ready for Delivery',
    desc: 'Cake is decorated, boxed in insulated packaging, and chilled.',
    icon: Package
  },
  {
    status: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    desc: 'Our delivery partner is traveling to your celebration venue.',
    icon: Bike
  },
  {
    status: 'DELIVERED',
    label: 'Delivered',
    desc: 'Delivered to your doorstep. Enjoy every sweet moment!',
    icon: Home
  }
];

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const initialOrderNum = searchParams.get('order') || '';

  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNum);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  const handleTrack = async (numToSearch: string) => {
    const clean = numToSearch.trim();
    if (!clean) {
      showToast('Please enter an order number', 'error');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      const data = await api.trackOrder(clean);
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || `No order found for "${clean}". Please check your order ID.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNum) {
      handleTrack(initialOrderNum);
    }
  }, [initialOrderNum]);

  const getStepState = (stepStatus: OrderStatus) => {
    if (!order) return 'upcoming';
    if (order.status === 'CANCELLED') return 'cancelled';

    const orderIndex = STEPS.findIndex((s) => s.status === order.status);
    const stepIndex = STEPS.findIndex((s) => s.status === stepStatus);

    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="font-script text-3xl text-[#C85A32] block">kitchen status</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#2B1E16] mt-1">
            Track Your Order
          </h1>
          <p className="text-sm sm:text-base text-[#5A4537] mt-2 font-light">
            Check the live progress of your treat directly from our oven to your doorstep.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-[#FAF7F0] p-4 sm:p-6 rounded-2xl border border-[#EAE3D9] shadow-sm mb-10 max-w-xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(orderNumberInput);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#735A4C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order Number (e.g. SC-8421)"
                value={orderNumberInput}
                onChange={(e) => setOrderNumberInput(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#D9C8B5] rounded-xl pl-10 pr-4 py-3 text-sm text-[#2B1E16] placeholder-[#9E8B7F] uppercase tracking-wider font-mono focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#C85A32] hover:bg-[#B34B24] disabled:bg-stone-400 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <span>Track Order</span>
              )}
            </button>
          </form>

          {/* Quick Demo Help */}
          <div className="mt-3 text-center text-xs text-[#735A4C]">
            Try sample order IDs:{' '}
            <button
              type="button"
              onClick={() => {
                setOrderNumberInput('SC-8421');
                handleTrack('SC-8421');
              }}
              className="text-[#C85A32] underline hover:text-[#B34B24] font-mono mr-2"
            >
              SC-8421
            </button>
            or{' '}
            <button
              type="button"
              onClick={() => {
                setOrderNumberInput('SC-7934');
                handleTrack('SC-7934');
              }}
              className="text-[#C85A32] underline hover:text-[#B34B24] font-mono ml-1"
            >
              SC-7934
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#735A4C]">Looking up live kitchen log...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-[#FFF8F5] border border-amber-200 rounded-2xl p-6 text-center max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-[#C85A32] mx-auto mb-2" />
            <h3 className="font-serif text-lg font-bold text-[#2B1E16]">Order Not Found</h3>
            <p className="text-sm text-[#5A4537] mt-1">{error}</p>
          </div>
        )}

        {/* TRACKING TIMELINE DISPLAY */}
        {order && !loading && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Summary Banner */}
            <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-3xl border border-[#EAE3D9] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider text-[#735A4C]">
                    Order Number
                  </span>
                  <span className="font-mono text-xs bg-[#EAE3D9] px-2 py-0.5 rounded text-[#2B1E16] font-bold">
                    {order.orderNumber}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#2B1E16]">
                  {order.product?.name || 'Sweet Crumbs Treat'}
                </h2>
                <p className="text-xs text-[#5A4537]">
                  {order.quantity} × {order.size} · {order.flavor}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-[#EAE3D9] w-full md:w-auto justify-between md:justify-end">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#735A4C] block">
                    Delivery Date
                  </span>
                  <span className="font-serif font-bold text-base text-[#2B1E16]">
                    {order.deliveryDate}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-[#735A4C] block">
                    Order Total
                  </span>
                  <span className="font-serif font-bold text-lg text-[#C85A32]">
                    ₹{order.total}
                  </span>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider text-[#735A4C] block">
                    Current Status
                  </span>
                  <span
                    className={`inline-block font-sans text-xs font-bold px-3 py-1 rounded-full ${
                      order.status === 'CANCELLED'
                        ? 'bg-rose-100 text-rose-800'
                        : order.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#C85A32]/10 text-[#C85A32]'
                    }`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>

            {/* Cancelled Banner if applicable */}
            {order.status === 'CANCELLED' && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-900">
                <AlertCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                <h3 className="font-serif text-xl font-bold">This order has been cancelled</h3>
                <p className="text-sm text-rose-700 mt-1">
                  If you have questions regarding this order, please contact our kitchen team at orders@sweetcrumbs.com.
                </p>
              </div>
            )}

            {/* Premium Vertical Status Timeline */}
            {order.status !== 'CANCELLED' && (
              <div className="bg-[#FAF7F0] p-6 sm:p-9 rounded-3xl border border-[#EAE3D9]">
                <h3 className="font-serif text-xl font-bold text-[#2B1E16] mb-8">
                  Live Kitchen Progress Timeline
                </h3>

                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-[#EAE3D9]">
                  {STEPS.map((step) => {
                    const state = getStepState(step.status);
                    const StepIcon = step.icon;

                    let markerClass = 'bg-[#FAF7F0] border-2 border-stone-300 text-stone-400';
                    let titleClass = 'text-stone-400';
                    let descClass = 'text-stone-400';

                    if (state === 'completed') {
                      markerClass = 'bg-emerald-600 border-2 border-emerald-600 text-white';
                      titleClass = 'text-[#2B1E16] font-bold';
                      descClass = 'text-[#5A4537]';
                    } else if (state === 'current') {
                      markerClass =
                        'bg-[#C85A32] border-4 border-[#FDFBF7] text-white ring-4 ring-[#C85A32]/20 scale-110';
                      titleClass = 'text-[#C85A32] font-bold text-lg';
                      descClass = 'text-[#2B1E16] font-medium';
                    }

                    return (
                      <div key={step.status} className="relative group">
                        {/* Timeline Marker Icon */}
                        <div
                          className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${markerClass}`}
                        >
                          <StepIcon className="w-3.5 h-3.5" />
                        </div>

                        {/* Timeline Step Content */}
                        <div className="pl-3">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-serif ${titleClass}`}>{step.label}</h4>
                            {state === 'current' && (
                              <span className="text-[10px] font-sans uppercase font-bold tracking-wider bg-[#C85A32] text-white px-2 py-0.5 rounded-full">
                                Currently Active
                              </span>
                            )}
                            {state === 'completed' && (
                              <span className="text-xs text-emerald-600">✓</span>
                            )}
                          </div>
                          <p className={`text-xs sm:text-sm mt-0.5 leading-relaxed ${descClass}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => handleTrack(order.orderNumber)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#735A4C] hover:text-[#2B1E16] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Refresh Live Status</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
