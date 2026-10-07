import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, MapPin, Phone, Mail, ChefHat } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2B1E16] text-[#FDFBF7] pt-16 pb-12 border-t border-[#3E2C22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#4A3528]">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FDFBF7]">
                SWEET CRUMBS
              </span>
              <p className="text-xs uppercase tracking-widest text-[#D4A373] mt-0.5">
                Little moments. Freshly baked.
              </p>
            </Link>
            <p className="text-sm text-[#D9C8B5] leading-relaxed">
              Handcrafted cakes, artisan brownies, and bespoke desserts baked fresh in small batches
              for your most memorable celebrations.
            </p>
            <div className="pt-1">
              <span className="font-script text-2xl text-[#E07A5F]">Baked with love & pure butter</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-[#FDFBF7] tracking-wide">
              Explore Menu
            </h4>
            <ul className="space-y-2 text-sm text-[#D9C8B5]">
              <li>
                <Link to="/menu" className="hover:text-[#E07A5F] transition-colors">
                  Artisanal Cakes
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#E07A5F] transition-colors">
                  Molten Brownies & Bars
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#E07A5F] transition-colors">
                  Celebration Cupcakes
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#E07A5F] transition-colors">
                  European Butter Cookies
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-[#E07A5F] transition-colors">
                  Bespoke Custom Tier Cakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Bakery Hours & Pickup */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-[#FDFBF7] tracking-wide">
              Kitchen Hours
            </h4>
            <ul className="space-y-2.5 text-sm text-[#D9C8B5]">
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4A373] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-[#FDFBF7]">Baking & Delivery</p>
                  <p className="text-xs text-[#B8A28E]">Tuesday – Sunday: 9:00 AM – 8:00 PM</p>
                  <p className="text-xs text-[#B8A28E]">Monday: Oven rest & prep</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4A373] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[#B8A28E]">Boutique Studio: 14 Indiranagar 12th Main, Bengaluru</p>
              </li>
            </ul>
          </div>

          {/* Order Help & Admin */}
          <div className="space-y-3">
            <h4 className="font-serif text-lg font-semibold text-[#FDFBF7] tracking-wide">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm text-[#D9C8B5]">
              <li>
                <Link to="/track" className="hover:text-[#E07A5F] transition-colors font-medium text-[#FDFBF7]">
                  Track Live Order Status
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#E07A5F] transition-colors">
                  Our Ingredients & Story
                </Link>
              </li>
              <li className="flex items-center gap-2 pt-2 text-xs text-[#B8A28E]">
                <Phone className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-[#B8A28E]">
                <Mail className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>orders@sweetcrumbs.com</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D4A373] hover:text-[#FDFBF7] transition-colors"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Baker Administration & Orders</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A8927E] gap-4">
          <p>© {new Date().getFullYear()} Sweet Crumbs Home Bakery. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Freshly baked with love</span>
            <Heart className="w-3 h-3 text-[#E07A5F] fill-current" />
            <span>for sweet celebrations</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
