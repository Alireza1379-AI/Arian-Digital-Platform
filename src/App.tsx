import React, { useState, useEffect } from 'react';
import { 
  Building, 
  HelpCircle, 
  Cpu, 
  BookOpen, 
  Globe, 
  ShieldAlert, 
  Settings,
  Flame,
  Award,
  ExternalLink,
  LogOut,
  UserCheck,
  Smartphone,
  Wallet,
  Plus,
  CheckCircle2
} from 'lucide-react';
import MarketplaceSimulator from './components/MarketplaceSimulator';
import ArchitectureHub from './components/ArchitectureHub';
import PortfolioLanding from './components/PortfolioLanding';
import PishkhanSimulator from './components/PishkhanSimulator';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Authentication states with lazy-initialization from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('arian_isAuthenticated') === 'true';
  });
  const [userRole, setUserRole] = useState<'customer' | 'provider' | 'admin'>(() => {
    return (localStorage.getItem('arian_userRole') as 'customer' | 'provider' | 'admin') || 'customer';
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('arian_userName') || '';
  });

  // Dynamic Wallet State
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('arian_wallet_balance');
    return saved ? parseInt(saved, 10) : 2500000; // Starting with 2,500,000 Tomans
  });

  const [isQuickChargeOpen, setIsQuickChargeOpen] = useState(false);
  const [quickChargeAmount, setQuickChargeAmount] = useState('');

  // Sync state changes to localStorage
  const handleLoginSuccess = (role: 'customer' | 'provider' | 'admin', name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsAuthenticated(true);
    localStorage.setItem('arian_isAuthenticated', 'true');
    localStorage.setItem('arian_userRole', role);
    localStorage.setItem('arian_userName', name);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('arian_isAuthenticated');
    localStorage.removeItem('arian_userRole');
    localStorage.removeItem('arian_userName');
  };

  const handleChargeWallet = (amount: number) => {
    setWalletBalance(prev => {
      const updated = prev + amount;
      localStorage.setItem('arian_wallet_balance', updated.toString());
      return updated;
    });
  };

  const handleDeductWallet = (amount: number): boolean => {
    let success = false;
    setWalletBalance(prev => {
      if (prev >= amount) {
        const updated = prev - amount;
        localStorage.setItem('arian_wallet_balance', updated.toString());
        success = true;
        return updated;
      }
      return prev;
    });
    // We execute state read carefully to return true/false
    const fresh = parseInt(localStorage.getItem('arian_wallet_balance') || '0', 10);
    return fresh < walletBalance;
  };

  // Tab section within panel
  const [currentSection, setCurrentSection] = useState<'sandbox' | 'architecture' | 'portfolio' | 'pishkhan' | 'admin'>('portfolio');

  const handleSetSection = (section: 'sandbox' | 'architecture' | 'portfolio' | 'pishkhan' | 'admin') => {
    if (section !== 'portfolio' && !isAuthenticated) {
      if (section === 'admin') {
        handleLoginSuccess('admin', 'مدیریت ارشد (آرین دیجیتال)');
      } else {
        handleLoginSuccess('customer', 'آران جاویدان');
      }
    } else if (section === 'admin' && userRole !== 'admin') {
      // Elevate to admin role instantly
      handleLoginSuccess('admin', 'مدیریت ارشد (آرین دیجیتال)');
    }
    setCurrentSection(section);
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 flex flex-col font-sans" dir="rtl">
      {/* Top Professional Branding Header */}
      <header className="bg-[#0B0F1A]/85 border-b border-slate-800 sticky top-0 z-40 shadow-lg backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/20">
              آد
            </div>
            <div className="text-right">
              <h1 className="text-base font-extrabold text-white font-sans tracking-tight">آرین دیجیتال (Arian Digital)</h1>
              <p className="text-[10px] text-slate-400 font-sans">
                بازارگاه مستقل خدمات فنی گرافیک، تایپ تخصصی و مگامارکت مالی و گیفت‌کارت
              </p>
            </div>
          </div>

          {/* Section Selector Tabs & Controls inside Header - Always Available */}
          <div className="flex flex-wrap items-center gap-3.5">
            {/* Section Selector Tabs */}
            <div className="flex flex-wrap items-center bg-[#161E31] p-1 rounded-xl border border-slate-800">
              <button
                id="main-tab-portfolio"
                onClick={() => handleSetSection('portfolio')}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentSection === 'portfolio' || !isAuthenticated
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>وب‌سایت اصلی (Portfolio)</span>
              </button>
              <button
                id="main-tab-pishkhan"
                onClick={() => handleSetSection('pishkhan')}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentSection === 'pishkhan' && isAuthenticated
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-emerald-400 font-sans">پیشخوان ۲۴ (کافی‌نت)</span>
              </button>
              <button
                id="main-tab-sandbox"
                onClick={() => handleSetSection('sandbox')}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentSection === 'sandbox' && isAuthenticated
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>پورتال شبیه‌ساز (Sandbox)</span>
              </button>
              <button
                id="main-tab-architecture"
                onClick={() => handleSetSection('architecture')}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  currentSection === 'architecture' && isAuthenticated
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>سند فنی معماری (Architecture)</span>
              </button>
              <button
                id="main-tab-admin"
                onClick={() => handleSetSection('admin')}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-black transition-all flex items-center gap-1 cursor-pointer border ${
                  currentSection === 'admin' && isAuthenticated
                    ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-500/30'
                    : 'text-rose-400 hover:text-rose-350 bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/10'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-rose-400 animate-spin-slow" />
                <span>پنل مدیریت کل (Admin Panel)</span>
              </button>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-3.5">
                {/* Dynamic Wallet Balance Badge & Direct Top-up control */}
                <div className="flex items-center gap-2 bg-[#1b253b] hover:bg-[#23304c] border border-slate-700/80 p-1.5 rounded-xl text-xs font-sans transition-all">
                  <Wallet className="w-4 h-4 text-emerald-450 shrink-0" />
                  <span className="text-[10px] text-slate-400">اعتبار:</span>
                  <strong className="text-emerald-400 text-xs font-extrabold">{walletBalance.toLocaleString()}</strong>
                  <span className="text-[9px] text-slate-500 mr-0.5">تومان</span>
                  <button
                    onClick={() => setIsQuickChargeOpen(true)}
                    className="bg-emerald-500/20 hover:bg-emerald-500/45 text-emerald-300 p-0.5 rounded-lg transition-colors cursor-pointer mr-1"
                    title="شارژ سریع کیف پول"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* User badge + Logout Button */}
                <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs font-sans">
                  <span className="text-[10px] text-indigo-300 font-bold px-2 flex items-center gap-1 pr-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{userName}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 p-1.5 rounded-lg transition-colors flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                    title="خروج از پنل و بازگشت به وب‌سایت"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">خروج</span>
                  </button>
                </div>
              </div>
            ) : (
              /* If unauthenticated, show a nice Guest Access badge and instant access trigger button */
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleSetSection('pishkhan')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-550/15 cursor-pointer hover:scale-105"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                  <span>ورود مستقیم به پیشخوان کافی‌نت</span>
                </button>
                <div className="hidden lg:flex items-center gap-2 text-slate-400 text-[10px] bg-[#161E31] px-3 py-2.5 rounded-xl border border-slate-800">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>PWA مستقل فعال است</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {isAuthenticated ? (
          /* Render Active Control Panel & Marketplace Workspaces */
          <div className="space-y-8">
            {currentSection !== 'portfolio' && (
              /* Welcome and System Intro Card */
              <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#161E31] to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute left-0 bottom-0 -ml-16 -mb-16 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-8 space-y-3.5">
                    <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide">
                      برنامه راهبردی و سیمولیتور عملیاتی کلاینت-سرور
                    </span>
                    <p className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-lg self-start inline-block">
                      احراز هویت پیوسته و کش شده‌ی PWA فعال است • کاربر واردشده: {userName}
                    </p>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight leading-snug">
                      مهندسی بازارگاه خدمات دیجیتال و سفارش آنلاین آرین دیجیتال
                    </h2>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans">
                      این پلتفرم بر اساس فرآیند واقعی ثبت سفارش‌های موازی، مانیتور پیشرفت کار، سیستم تراکنش با کدهای حفاظت شده ضد تکرار (Anti-Idempotency Charging) بانک ملت/سامان و مکانیزم تعاملی چت با مجری پیاده‌سازی شده است. از تب‌های بالا برای کشف ساختار دیتابیس PostgreSQL، وب‌سرویس‌های REST بنچمارک ادمین و پروژه‌های بک‌اند NestJS استفاده فرمایید.
                    </p>
                  </div>
                  
                  <div className="md:col-span-4 bg-[#0B0F1A]/80 border border-slate-800 rounded-2xl p-4 space-y-3 shrink-0">
                    <h4 className="font-extrabold text-xs text-amber-400 font-sans flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>راهنمای تعاملی ارزیابی:</span>
                    </h4>
                    <ul className="text-[10px] text-slate-300 space-y-2 leading-relaxed">
                      <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1 shrink-0" />
                        <span>در <strong>پورتال شبیه‌ساز</strong>، می‌توانید خدمات ثبت کرده، در درگاه پرداخت یا مستقیماً از کیف پول شبیه‌سازی پرداخت نموده و چت کنید.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1 shrink-0" />
                        <span>در <strong>بخش مجری/طراح</strong>، کارهای پرداخت‌شده را پذیرش و فایل خروجی آپلود کنید.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1 shrink-0" />
                        <span>در <strong>بلوپرینت فنی</strong>، ساختار جداول پایگاه‌داده و فراخوانی APIها را بررسی نمایید.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Render selected section inside logged-in dashboard */}
            {currentSection === 'sandbox' ? (
              <MarketplaceSimulator 
                initialRole={userRole} 
                loggedInUser={userName} 
                walletBalance={walletBalance} 
                onDeductWallet={handleDeductWallet}
                onChargeWallet={handleChargeWallet}
              />
            ) : currentSection === 'pishkhan' ? (
              <PishkhanSimulator 
                walletBalance={walletBalance}
                onDeductWallet={handleDeductWallet}
                onChargeWallet={handleChargeWallet}
                loggedInUser={userName}
              />
            ) : currentSection === 'portfolio' ? (
              <PortfolioLanding 
                onLoginSuccess={handleLoginSuccess}
                onEnterAsGuest={() => handleLoginSuccess('customer', 'کاربر میهمان')}
                isAuthenticated={isAuthenticated}
                loggedInUser={userName}
                userRole={userRole}
                onLogout={handleLogout}
                walletBalance={walletBalance}
                onChargeWallet={handleChargeWallet}
                onGoToPishkhan={() => {
                  if (!isAuthenticated) {
                    handleLoginSuccess('customer', 'آرین جاویدان');
                  }
                  setCurrentSection('pishkhan');
                }}
              />
            ) : currentSection === 'admin' ? (
              <AdminPanel />
            ) : (
              <ArchitectureHub />
            )}
          </div>
        ) : (
          /* Render Premium Portfolio Landing Page first */
          <PortfolioLanding 
            onLoginSuccess={handleLoginSuccess}
            onEnterAsGuest={() => handleLoginSuccess('customer', 'کاربر میهمان')}
            isAuthenticated={isAuthenticated}
            loggedInUser={userName}
            userRole={userRole}
            onLogout={handleLogout}
            walletBalance={walletBalance}
            onChargeWallet={handleChargeWallet}
            onGoToPishkhan={() => {
              if (!isAuthenticated) {
                handleLoginSuccess('customer', 'آرین جاویدان');
              }
              setCurrentSection('pishkhan');
            }}
          />
        )}

      </main>

      {/* QUICK WALLET DEPOSIT DIALOG MODAL */}
      {isQuickChargeOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" dir="rtl">
          <div className="bg-[#111827] border border-slate-800 text-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                <h4 className="font-extrabold text-xs text-white">شارژ آنلاین اعتبار کیف پول صنف</h4>
              </div>
              <button 
                onClick={() => setIsQuickChargeOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#1b253b] border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-[10px] text-slate-400">موجودی متعبر لحظه‌ای:</span>
              <strong className="text-emerald-450 font-black text-sm">{walletBalance.toLocaleString()} تومان</strong>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-300 block">مشخص کردن مبلغ شارژ به تومان:</label>
              <input
                type="number"
                value={quickChargeAmount}
                onChange={(e) => setQuickChargeAmount(e.target.value)}
                placeholder="مبلغ دلخواه را وارد کنید..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-center text-white text-xs font-mono font-bold focus:outline-none placeholder:text-slate-600"
              />
            </div>

            {/* Quick Presets buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[100000, 500000, 1000000, 2000000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setQuickChargeAmount(amt.toString())}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 font-bold p-2 rounded-xl text-[9.5px] transition-colors cursor-pointer"
                >
                  +{amt.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const val = parseInt(quickChargeAmount, 10);
                  if (val > 0) {
                    handleChargeWallet(val);
                    setIsQuickChargeOpen(false);
                    setQuickChargeAmount('');
                  }
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-600/10"
              >
                ✓ تایید و تسویه شارژ
              </button>
              <button
                type="button"
                onClick={() => setIsQuickChargeOpen(false)}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-400 font-bold text-[11px] py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                انصراف
              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* Footer copyright with Pishkhan24 structured links */}
      <footer className="bg-[#0B0F1A] border-t border-slate-800/60 mt-auto pt-12 pb-6 text-right font-sans" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main 4-column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            {/* Column 1: Popular Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-200 tracking-wider">خدمات محبوب</h4>
              <ul className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">سوابق بیمه</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">یارانه</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">خلافی خودرو</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">عوارض سالیانه خودرو</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">خرید شارژ</li>
              </ul>
            </div>

            {/* Column 2: Suggested Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-200 tracking-wider">خدمات پیشنهادی</h4>
              <ul className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">استعلام وضعیت سهام عدالت</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">استعلام واریز یارانه</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">پرداخت قبض تلفن</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">پرداخت قبض برق</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">خرید بسته اینترنت</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">باگ بانتی پیشخوان۲۴</li>
              </ul>
            </div>

            {/* Column 3: Useful Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-200 tracking-wider">لینک‌های کاربردی</h4>
              <ul className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">درباره ما</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">ارتباط با ما</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">فرصت شغلی</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">سوالات متداول</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">قوانین و مقررات</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">وبلاگ</li>
                <li className="hover:text-emerald-450 transition-colors cursor-pointer">نقشه سایت</li>
              </ul>
            </div>

            {/* Column 4: Contact details with e-Namad / SAMANDEHI badge link */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-200 tracking-wider">ارتباط با پیشخوان۲۴</h4>
              <div className="space-y-2 text-[11px] text-slate-400 leading-relaxed">
                <p>تلفن پشتیبانی: <span className="font-mono text-slate-350">۰۲۱-۶۲۹۹۹۹۲۳</span></p>
                <p>پشتیبانی تلگرامی: <span className="font-mono text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">Pishkhan24_CRM</span></p>
                <p className="text-[10.5px]">
                  آدرس: تهران، خیابان آزادی، خیابان حبیب‌اله، بالاتر از میدان حسینی، پلاک ۵۶، ساختمان ایستگاه نوآوری شریف، طبقه همکف
                </p>
                <div className="pt-2 flex items-center justify-start">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center p-2 hover:border-slate-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-400 animate-pulse">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Copyright Divider and Stamp */}
          <div className="border-t border-slate-800/80 pt-6 flex flex-col items-center justify-center text-center text-[10.5px] text-slate-500 font-sans">
            <p>
              کلیه حقوق برای <span className="text-emerald-400 font-extrabold hover:text-emerald-350 transition-colors cursor-pointer">آیان</span> محفوظ است.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
