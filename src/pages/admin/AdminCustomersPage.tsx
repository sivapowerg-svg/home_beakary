import React, { useEffect, useState } from 'react';
import { api } from '../../services/api.ts';
import { Customer } from '../../types/bakery.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { Users, Mail, Phone, MapPin, Loader2, Search, Calendar } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        const data = await api.getCustomers();
        setCustomers(data);
      } catch (err: any) {
        showToast(err.message || 'Failed to load customers', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, [showToast]);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-script text-2xl text-[#C85A32]">patron directory</span>
          <h1 className="font-serif text-3xl font-bold text-[#2B1E16] mt-0.5">
            Bakery Customers
          </h1>
          <p className="text-xs sm:text-sm text-[#5A4537] mt-1 font-light">
            Directory of customers who ordered handcrafted celebrations from Sweet Crumbs.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#735A4C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAF7F0] border border-[#D9C8B5] rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-[#2B1E16] placeholder-[#9E8B7F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
          />
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-[#C85A32] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#735A4C]">Loading customer directory...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF7F0] rounded-2xl border border-[#EAE3D9] p-8">
          <p className="font-serif text-lg font-bold text-[#2B1E16]">No customers found</p>
          <p className="text-xs text-[#735A4C] mt-1">
            New customers are added automatically when orders are placed.
          </p>
        </div>
      ) : (
        <div className="bg-[#FAF7F0] rounded-2xl border border-[#EAE3D9] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F2ECE1] text-[#735A4C] text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-semibold">Customer Name</th>
                  <th className="py-3.5 px-5 font-semibold">Contact Email</th>
                  <th className="py-3.5 px-5 font-semibold">Phone Number</th>
                  <th className="py-3.5 px-5 font-semibold">Location</th>
                  <th className="py-3.5 px-5 font-semibold text-center">Number of Orders</th>
                  <th className="py-3.5 px-5 font-semibold">Latest Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D9]">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#FDFBF7] transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-serif font-bold text-sm text-[#2B1E16]">{cust.name}</p>
                      <p className="text-[11px] text-[#735A4C]">Registered: {cust.createdAt.split('T')[0]}</p>
                    </td>
                    <td className="py-4 px-5 text-[#5A4537]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#735A4C]" />
                        <span>{cust.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-[#5A4537] font-mono">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#735A4C]" />
                        <span>{cust.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-[#5A4537]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#735A4C]" />
                        <span>
                          {cust.city} ({cust.pincode})
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center font-bold font-serif text-base text-[#2B1E16]">
                      {cust.orderCount || 0}
                    </td>
                    <td className="py-4 px-5 text-[#5A4537]">
                      {cust.latestOrderNumber ? (
                        <div>
                          <span className="font-mono font-bold text-xs bg-[#EAE3D9] px-2 py-0.5 rounded text-[#2B1E16]">
                            {cust.latestOrderNumber}
                          </span>
                          {cust.latestOrderDate && (
                            <span className="text-[11px] text-[#735A4C] block mt-0.5">
                              {cust.latestOrderDate.split('T')[0]}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-400 text-xs">No orders yet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
