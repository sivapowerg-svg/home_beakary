import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { api } from '../../services/api.ts';
import { ChefHat, Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('sweetcrumbs2026');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.adminLogin({ username, password });
      login(res.token, res.user);
      showToast('Welcome back, Chef Claire! 🍰', 'success');
      navigate('/admin');
    } catch (err: any) {
      showToast(err.message || 'Invalid login credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 bg-[#2B1E16] text-[#FDFBF7] rounded-2xl flex items-center justify-center mx-auto shadow-md mb-4">
          <ChefHat className="w-8 h-8 text-[#E07A5F]" />
        </div>
        <span className="font-serif text-2xl font-bold tracking-tight text-[#2B1E16]">
          SWEET CRUMBS
        </span>
        <h2 className="mt-2 font-serif text-3xl font-bold text-[#2B1E16]">
          Baker Administration Portal
        </h2>
        <p className="mt-2 text-sm text-[#735A4C]">
          Sign in to manage kitchen orders, customize status, and oversee bakery bakes.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FAF7F0] py-8 px-6 sm:px-10 rounded-3xl border border-[#EAE3D9] shadow-sm">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                Baker Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#735A4C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-[#D9C8B5] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-[#735A4C] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#735A4C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-[#D9C8B5] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#2B1E16] focus:outline-none focus:ring-2 focus:ring-[#C85A32]/40"
                />
              </div>
            </div>

            {/* Quick Demo Credentials Pill */}
            <div className="p-3 bg-[#F2ECE1] rounded-xl text-xs text-[#5A4537] space-y-1">
              <p className="font-semibold text-[#2B1E16] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Demo Credentials:</span>
              </p>
              <p>Username: <code className="bg-white px-1.5 py-0.5 rounded font-mono">admin</code></p>
              <p>Password: <code className="bg-white px-1.5 py-0.5 rounded font-mono">sweetcrumbs2026</code></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#2B1E16] hover:bg-[#C85A32] text-white py-3.5 px-4 rounded-xl font-medium text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Bakery Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs font-semibold text-[#735A4C] hover:text-[#2B1E16] transition-colors"
            >
              ← Back to Customer Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
