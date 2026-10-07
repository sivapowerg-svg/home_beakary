import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api.ts';
import { Product } from '../../types/bakery.ts';
import { useToast } from '../../context/ToastContext.tsx';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  User,
  Check,
  ShoppingBag,
  Info,
  Loader2
} from 'lucide-react';

const SIZES = [
  { label: '0.5 kg (Serves 4-6)', value: '0.5 kg', priceAddon: 0 },
  { label: '1.0 kg (Serves 8-12)', value: '1 kg', priceAddon: 350 },
  { label: '1.5 kg (Serves 12-16)', value: '1.5 kg', priceAddon: 650 },
  { label: '2.0 kg (Serves 18-24)', value: '2 kg', priceAddon: 950 }
];

const FLAVORS = [
  'Signature Classic Dark Chocolate',
  'Madagascar Vanilla Cream',
  'Belgian Truffle & Espresso',
  'Red Velvet & Cream Cheese',
  'Salted Caramel Butterscotch',
  'Pistachio Rose Cardamom'
];

const THEMES = [
  'Minimalist Botanical & Cream',
  'Birthday Celebration & Confetti',
  'Vintage Pastel Ruffles',
  'Golden Elegance & Foil',
  'Rustic Woods & Berries',
  'Contemporary Text Art'
];

const COLOR_PALETTES = [
  'Warm Cream & Terracotta',
  'Sage Green & Gold',
  'Blush Rose & Pearl White',
  'Cocoa Velvet & Espresso',
  'Pastel Buttercream Rainbow'
];

const DECORATIONS = [
  { label: 'Standard Baker Piping (+₹0)', value: 'None', addon: 0 },
  { label: 'Handmade French Macarons & Gold Leaf (+₹150)', value: 'Gold Foil & Macarons', addon: 150 },
  { label: 'Fresh Mixed Berries & Edible Petals (+₹120)', value: 'Fresh Berries & Flowers', addon: 120 },
  { label: 'Belgian Truffle Bombs & Chocolate Drip (+₹100)', value: 'Chocolate Drip & Truffles', addon: 100 },
  { label: 'Hand-sculpted Custom Fondant Topper (+₹180)', value: 'Custom Fondant Topper', addon: 180 }
];

const TIME_SLOTS = [
  '10:00 AM - 12:00 PM',
  '01:00 PM - 03:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM'
];

export default function OrderCustomizePage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState<string>('0.5 kg');
  const [flavor, setFlavor] = useState<string>(FLAVORS[0]);
  const [theme, setTheme] = useState<string>(THEMES[0]);
  const [cakeColor, setCakeColor] = useState<string>(COLOR_PALETTES[0]);
  const [cakeMessage, setCakeMessage] = useState<string>('');
  const [eggless, setEggless] = useState<boolean>(false);
  const [decorations, setDecorations] = useState<string>(DECORATIONS[0].value);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Delivery State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [deliveryDate, setDeliveryDate] = useState<string>(minDateStr);
  const [deliveryTime, setDeliveryTime] = useState<string>(TIME_SLOTS[0]);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [city, setCity] = useState<string>('Bengaluru');
  const [pincode, setPincode] = useState<string>('560038');

  // Customer State
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingProduct(true);
        const products = await api.getProducts();
        setAllProducts(products);

        if (productId) {
          const match = products.find((p) => p.id === Number(productId));
          if (match) setSelectedProduct(match);
          else if (products.length > 0) setSelectedProduct(products[0]);
        } else if (products.length > 0) {
          setSelectedProduct(products[0]);
        }
      } catch (err: any) {
        showToast('Could not load products for customization', 'error');
      } finally {
        setLoadingProduct(false);
      }
    }
    loadData();
  }, [productId, showToast]);

  // Client-side visual preview calculation
  // (NOTE: The real authoritative final price is calculated by the backend upon submission)
  const currentSizeObj = SIZES.find((s) => s.value === size) || SIZES[0];
  const currentDecoObj = DECORATIONS.find((d) => d.value === decorations) || DECORATIONS[0];

  const previewBase = (selectedProduct?.price || 0) + currentSizeObj.priceAddon;
  const previewSubtotal = previewBase * quantity;
  const previewCustomization = ( (eggless ? 50 : 0) + currentDecoObj.addon ) * quantity;
  const previewDelivery = 50;
  const previewTotal = previewSubtotal + previewCustomization + previewDelivery;

  const validateForm = () => {
    const errs: Record<string, string> = {};

    if (!selectedProduct) errs.product = 'Please select a treat';
    if (quantity < 1) errs.quantity = 'Quantity must be at least 1';

    if (!deliveryDate) {
      errs.deliveryDate = 'Delivery date is required';
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      if (deliveryDate < todayStr) {
        errs.deliveryDate = 'Delivery date cannot be in the past';
      }
    }

    if (!deliveryAddress.trim()) errs.deliveryAddress = 'Delivery address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!pincode.trim() || !/^[0-9]{5,8}$/.test(pincode.trim())) {
      errs.pincode = 'Please enter a valid postal pincode';
    }

    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!phone.trim() || !/^\+?[0-9\s-]{8,15}$/.test(phone.trim())) {
      errs.phone = 'Please enter a valid phone number (8-15 digits)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedProduct) {
      showToast('Please fix the errors highlighted in the form', 'error');
      return;
    }

    try {
      setSubmitting(true);

      const fullInstructions = [
        specialInstructions.trim(),
        cakeColor ? `Color Palette: ${cakeColor}` : ''
      ]
        .filter(Boolean)
        .join(' | ');

      const payload = {
        productId: selectedProduct.id,
        quantity,
        size,
        flavor,
        theme,
        cakeMessage: cakeMessage.trim(),
        eggless,
        additionalDecorations: decorations,
        specialInstructions: fullInstructions,
        deliveryDate,
        deliveryTime,
        deliveryAddress: `${deliveryAddress.trim()}, ${city.trim()} - ${pincode.trim()}`,
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: deliveryAddress.trim(),
          city: city.trim(),
          pincode: pincode.trim()
        }
      };

      const createdOrder = await api.createOrder(payload);
      showToast('Order placed successfully! 🎉', 'success');
      navigate(`/confirmation/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
    } catch (err: any) {
      console.error('Order submission failed:', err);
      showToast(err.message || 'Failed to place order. Please review your details.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto" />
          <p className="text-sm font-medium text-[#735A4C]">Preparing customization atelier...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#735A4C] hover:text-[#2B1E16] mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </Link>
          <span className="font-script text-2xl text-[#C85A32] block">bespoke orders</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2B1E16]">
            Customize & Place Order
          </h1>
          <p className="text-sm text-[#5A4537] mt-1 font-light">
            Tailor every layer to your celebration. Handcrafted fresh with pure ingredients.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT / CENTER: MULTI-SECTION CUSTOMIZATION FORM */}
            <div className="lg:col-span-7 space-y-8">
              {/* SECTION 1: PRODUCT SELECTION */}
              <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#EAE3D9]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl font-bold text-[#2B1E16] flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#2B1E16] text-[#FDFBF7] text-xs flex items-center justify-center font-sans">
                      1
                    </span>
                    <span>Selected Treat</span>
                  </h2>
                  <span className="text-xs text-[#735A4C]">Choose cake or change</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {allProducts.map((p) => {
                    const isSelected = selectedProduct?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-[#C85A32] shadow-sm ring-1 ring-[#C85A32]'
                            : 'bg-[#FDFBF7] border-[#EAE3D9] hover:border-[#D9C8B5]'
                        }`}
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-bold text-sm text-[#2B1E16] truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-[#735A4C]">₹{p.price}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#C85A32] flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Quantity, Size & Flavor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#EAE3D9]">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl bg-white border border-[#D9C8B5] text-[#2B1E16] font-bold text-base hover:bg-[#F2ECE1] transition-colors"
                      >
                        -
                      </button>
                      <span className="font-serif text-lg font-bold w-8 text-center text-[#2B1E16]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-xl bg-white border border-[#D9C8B5] text-[#2B1E16] font-bold text-base hover:bg-[#F2ECE1] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                      Portion Size
                    </label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                    >
                      {SIZES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label} {s.priceAddon > 0 ? `(+₹${s.priceAddon})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                      Sponge & Crumb Flavor
                    </label>
                    <select
                      value={flavor}
                      onChange={(e) => setFlavor(e.target.value)}
                      className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                    >
                      {FLAVORS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: MAKE IT YOURS (CUSTOMIZATION) */}
              <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#EAE3D9]">
                <h2 className="font-serif text-xl font-bold text-[#2B1E16] mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#2B1E16] text-[#FDFBF7] text-xs flex items-center justify-center font-sans">
                    2
                  </span>
                  <span>Make It Yours</span>
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                        Design Theme
                      </label>
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                      >
                        {THEMES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                        Color Palette
                      </label>
                      <select
                        value={cakeColor}
                        onChange={(e) => setCakeColor(e.target.value)}
                        className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                      >
                        {COLOR_PALETTES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Cake Message */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                      Message on Cake / Plaque (Optional)
                    </label>
                    <input
                      type="text"
                      maxLength={45}
                      placeholder="e.g. Happy 21st Birthday Sarah! ✨"
                      value={cakeMessage}
                      onChange={(e) => setCakeMessage(e.target.value)}
                      className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] placeholder-[#9E8B7F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                    />
                    <span className="text-[11px] text-[#735A4C] mt-1 block">
                      Max 45 characters piped delicately on chocolate plaque or buttercream.
                    </span>
                  </div>

                  {/* Eggless Option Toggle */}
                  <div className="pt-2">
                    <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                      Dietary Requirement
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEggless(false)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${
                          !eggless
                            ? 'bg-white border-[#C85A32] shadow-sm text-[#2B1E16] ring-1 ring-[#C85A32]'
                            : 'bg-[#FDFBF7] border-[#EAE3D9] text-[#735A4C]'
                        }`}
                      >
                        <span className="font-semibold block">Standard Recipe</span>
                        <span className="text-xs text-[#735A4C]">With farm-fresh eggs</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEggless(true)}
                        className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${
                          eggless
                            ? 'bg-white border-[#C85A32] shadow-sm text-[#2B1E16] ring-1 ring-[#C85A32]'
                            : 'bg-[#FDFBF7] border-[#EAE3D9] text-[#735A4C]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-800">100% Eggless</span>
                          <span className="text-xs text-[#C85A32] font-bold">+₹50</span>
                        </div>
                        <span className="text-xs text-[#735A4C]">Condensed milk & curd crumb</span>
                      </button>
                    </div>
                  </div>

                  {/* Extra Decorations */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                      Artisanal Add-ons & Decorations
                    </label>
                    <select
                      value={decorations}
                      onChange={(e) => setDecorations(e.target.value)}
                      className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                    >
                      {DECORATIONS.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                      Special Baking Instructions / Allergy Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Nut allergy, less sugar, ring bell upon delivery..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full bg-white border border-[#D9C8B5] rounded-xl p-3 text-sm text-[#2B1E16] placeholder-[#9E8B7F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: DELIVERY DETAILS */}
              <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#EAE3D9]">
                <h2 className="font-serif text-xl font-bold text-[#2B1E16] mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#2B1E16] text-[#FDFBF7] text-xs flex items-center justify-center font-sans">
                    3
                  </span>
                  <span>Delivery Schedule & Address</span>
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                        Delivery Date (Earliest: Tomorrow) *
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-[#735A4C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="date"
                          min={minDateStr}
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full bg-white border border-[#D9C8B5] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                        />
                      </div>
                      {errors.deliveryDate && (
                        <p className="text-xs text-red-600 mt-1">{errors.deliveryDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                        Preferred Time Window *
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-[#735A4C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <select
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          className="w-full bg-white border border-[#D9C8B5] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                        >
                          {TIME_SLOTS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                      Street Address & Apartment / Landmark *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#735A4C] absolute left-3.5 top-3.5" />
                      <textarea
                        rows={2}
                        placeholder="House / Flat No., Apartment Name, Street Name, Landmark"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="w-full bg-white border border-[#D9C8B5] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2B1E16] placeholder-[#9E8B7F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                      />
                    </div>
                    {errors.deliveryAddress && (
                      <p className="text-xs text-red-600 mt-1">{errors.deliveryAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                      />
                      {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                        Postal Pincode *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 560038"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                      />
                      {errors.pincode && (
                        <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: CUSTOMER CONTACT */}
              <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#EAE3D9]">
                <h2 className="font-serif text-xl font-bold text-[#2B1E16] mb-4 flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#2B1E16] text-[#FDFBF7] text-xs flex items-center justify-center font-sans">
                    4
                  </span>
                  <span>Contact Information</span>
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#735A4C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-[#D9C8B5] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                      />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-[#D9C8B5] rounded-xl px-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                      />
                      {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: STICKY LIVE ORDER SUMMARY (DESKTOP) / BOTTOM (MOBILE) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl border border-[#EAE3D9] shadow-md space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-[#EAE3D9]">
                  <ShoppingBag className="w-5 h-5 text-[#C85A32]" />
                  <h3 className="font-serif text-xl font-bold text-[#2B1E16]">
                    Live Order Summary
                  </h3>
                </div>

                {selectedProduct && (
                  <div className="flex items-center gap-3.5">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-16 h-16 object-cover rounded-xl border border-[#EAE3D9]"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#2B1E16]">
                        {selectedProduct.name}
                      </h4>
                      <p className="text-xs text-[#735A4C]">
                        {size} · {flavor}
                      </p>
                      {eggless && (
                        <span className="text-[11px] text-emerald-800 font-semibold">
                          Eggless Recipe
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-[#EAE3D9] text-sm text-[#4A3528]">
                  <div className="flex justify-between">
                    <span>
                      Base Treat ({quantity} × ₹{previewBase})
                    </span>
                    <span className="font-semibold text-[#2B1E16]">₹{previewSubtotal}</span>
                  </div>

                  {previewCustomization > 0 && (
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        <span>Customizations & Addons</span>
                      </span>
                      <span className="font-semibold text-[#2B1E16]">
                        +₹{previewCustomization}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Careful Doorstep Delivery</span>
                    <span className="font-semibold text-[#2B1E16]">₹{previewDelivery}</span>
                  </div>

                  <div className="pt-4 border-t border-[#EAE3D9] flex justify-between items-baseline">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#735A4C] block">
                        Calculated Total
                      </span>
                      <span className="text-[11px] text-[#8A7566]">
                        (Verified securely by backend API)
                      </span>
                    </div>
                    <span className="font-serif text-3xl font-bold text-[#C85A32]">
                      ₹{previewTotal}
                    </span>
                  </div>
                </div>

                {/* Note about backend calculation */}
                <div className="p-3 bg-[#F2ECE1] rounded-xl flex items-start gap-2.5 text-xs text-[#5A4537]">
                  <Info className="w-4 h-4 text-[#735A4C] mt-0.5 flex-shrink-0" />
                  <span>
                    Your order total is calculated and validated directly by our server before final
                    confirmation.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#C85A32] hover:bg-[#B34B24] disabled:bg-stone-400 text-white py-4 px-6 rounded-xl font-medium text-base shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending Order to Kitchen...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-200" />
                      <span>Place My Order</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
