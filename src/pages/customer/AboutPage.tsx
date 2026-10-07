import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Award, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Editorial Story Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="font-script text-3xl text-[#C85A32]">our story</span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2B1E16] leading-tight">
              A little bakery with a lot of heart.
            </h1>
            <p className="text-base sm:text-lg text-[#5A4537] leading-relaxed font-light">
              Sweet Crumbs began in a sunlit kitchen with a simple philosophy: treats should taste as
              honest, wholesome, and joy-filled as the memories they celebrate.
            </p>
            <div className="space-y-4 text-sm sm:text-base text-[#4A3528] leading-relaxed font-light">
              <p>
                Founded by Chef Baker Claire, our boutique home bakery focuses exclusively on handcrafted
                desserts, custom celebratory cakes, and small-batch confections. Unlike industrial commercial
                bakeries, we never mass-produce sponges in advance or freeze pre-iced tiers.
              </p>
              <p>
                Every bowl of batter is mixed from scratch with pure European cultured butter, single-origin
                Belgian chocolate, organic flours, and Madagascar Bourbon vanilla beans.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#EAE3D9] aspect-[4/5] bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85"
                alt="Sweet Crumbs Baker atelier"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="font-script text-2xl text-[#E07A5F]">Meet Chef Claire</span>
                <p className="text-xs text-stone-200 mt-1">
                  “Every celebration cake is a canvas for joy and memory.”
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients & Values Grid */}
        <section className="bg-[#FAF7F0] p-8 sm:p-12 rounded-3xl border border-[#EAE3D9]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-script text-2xl text-[#C85A32]">what makes us different</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1E16] mt-1">
              Our Ingredients & Craft
            </h2>
            <p className="text-sm text-[#5A4537] mt-2">
              We never cut corners on what goes into your family's celebrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#EAE3D9] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2B1E16]">Pure Cultured Butter</h3>
              <p className="text-xs sm:text-sm text-[#5A4537] leading-relaxed">
                Zero margarine or palm-oil shortening. We use 82% fat cultured European butter for that
                unmatched melt-in-the-mouth crumb.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#EAE3D9] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#557A60]/10 text-[#557A60] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2B1E16]">Single-Origin Cocoa</h3>
              <p className="text-xs sm:text-sm text-[#5A4537] leading-relaxed">
                Imported Belgian couverture chocolate and Dutch-processed dark cocoa powder give our
                truffles and fudge brownies their deep, fudgy intensity.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-[#EAE3D9] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4A373]/20 text-[#735A4C] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2B1E16]">Real Bourbon Vanilla</h3>
              <p className="text-xs sm:text-sm text-[#5A4537] leading-relaxed">
                Whole Madagascar Bourbon vanilla beans scraped by hand, infusing pure aromatic warmth
                without synthetic vanilla essences.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h2 className="font-serif text-3xl font-bold text-[#2B1E16]">
            Ready to taste the difference?
          </h2>
          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-[#C85A32] hover:bg-[#B34B24] text-white px-7 py-3.5 rounded-xl font-medium text-sm shadow-sm transition-all"
            >
              <span>Explore The Fresh Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
