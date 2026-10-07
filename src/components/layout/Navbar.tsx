import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, ChefHat } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'About', path: '/about' },
    { label: 'Track Order', path: '/track' }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EAE3D9] transition-all">
      {/* Top micro-announcement banner */}
      <div className="bg-[#2B1E16] text-[#FDFBF7] py-1.5 px-4 text-xs font-medium text-center tracking-wide">
        <span className="opacity-90">Fresh batches baked every morning</span>
        <span className="mx-2 text-[#E07A5F]">·</span>
        <span className="opacity-90">Pre-order for celebrations & custom cakes</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <Link to="/" className="group flex flex-col focus:outline-none">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2B1E16] group-hover:text-[#C85A32] transition-colors">
              SWEET CRUMBS
            </span>
            <span className="text-[11px] font-sans tracking-widest uppercase text-[#735A4C] -mt-1 font-medium">
              Little moments. Freshly baked.
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wide font-medium transition-all relative py-1 ${
                    active
                      ? 'text-[#C85A32] font-semibold'
                      : 'text-[#4A3528] hover:text-[#C85A32]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C85A32] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-[#735A4C] hover:text-[#2B1E16] font-medium transition-colors px-2.5 py-1.5 rounded-lg hover:bg-[#F2ECE1]"
              title="Baker Admin Portal"
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span>Baker Portal</span>
            </Link>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#B34B24] text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Order a Sweet Moment</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/menu"
              className="bg-[#C85A32] text-white px-3.5 py-2 rounded-lg text-xs font-medium"
            >
              Order Now
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#2B1E16] hover:bg-[#F2ECE1] rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EAE3D9] bg-[#FDFBF7] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                    active
                      ? 'bg-[#F2ECE1] text-[#C85A32] font-semibold'
                      : 'text-[#2B1E16] hover:bg-[#F5F0E6]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#EAE3D9] flex flex-col gap-2.5">
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#C85A32] text-white py-3 rounded-xl font-medium text-sm shadow-sm"
            >
              Order a Sweet Moment
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center border border-[#D9C8B5] text-[#4A3528] py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2"
            >
              <ChefHat className="w-4 h-4" />
              <span>Baker Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
