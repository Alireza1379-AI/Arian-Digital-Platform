import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Layers, 
  Cpu, 
  Phone, 
  Check, 
  ShoppingBag, 
  Award, 
  Sparkles, 
  Star, 
  Download, 
  Laptop, 
  Smartphone, 
  CheckCircle2, 
  Zap, 
  ArrowLeft, 
  Lock, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  FileText,
  MousePointerClick,
  Monitor,
  Heart,
  HelpCircle,
  Clock,
  Coins,
  Search,
  Tag,
  PlusCircle,
  Compass,
  TrendingUp,
  MessageSquare,
  Gift,
  AlertCircle,
  Calendar,
  Wallet,
  LogOut,
  UserCheck,
  Plus,
  Flame,
  ArrowRightLeft
} from 'lucide-react';
import { ATRIAN_SERVICES, Service } from '../data/serviceData';
import { motion, AnimatePresence } from 'motion/react';
import FloatingChatSupport from './FloatingChatSupport';

// ==========================================
// MOCK DATA FOR CUSTOMER HUB INNOVATIONS
// ==========================================

const MOCK_TRACKABLE_ORDERS = {
  "AD-9418": {
    id: "AD-9418",
    service: "طراحی کاتالوگ ۱۶ صفحه آذرخش",
    customer: "آقای زارع",
    status: "in_progress",
    statusText: "در حال طراحی اتود اولیه",
    date: "۱۴۰۵/۰۳/۲۴",
    progress: 60,
    price: "۳,۵۰۰,۰۰۰ تومان",
    steps: [
      { label: "ثبت فاکتور سیستمی", done: true, desc: "سفارش در سیستم ثبت و تسویه شد." },
      { label: "پذیرش توسط مجری", done: true, desc: "مهندس طراح کارسپاری را تایید کرد." },
      { label: "طراحی و آماده‌سازی فایل اولیه", done: true, today: true, desc: "در حال ترسیم کانتینر لوکس گرافیکی صنف." },
      { label: "بازنگری و تحویل نهایی", done: false, desc: "پس از تایید کرایتریای مشتری گرانقدر." }
    ]
  },
  "AD-1234": {
    id: "AD-1234",
    service: "لوگوی رسمی هلدینگ رادان",
    customer: "خانم مهندس پناهی",
    status: "completed",
    statusText: "تحویل نهایی شده",
    date: "۱۴۰۵/۰۳/۲۰",
    progress: 100,
    price: "۷,۲۰۰,۰۰۰ تومان",
    steps: [
      { label: "ثبت فاکتور سیستمی", done: true, desc: "تسویه کامل درگاه بانک ملت با موفقیت." },
      { label: "پذیرش توسط مجری", done: true, desc: "پروژه به مجری ارشد گرافیک ارجاع شد." },
      { label: "طراحی و آماده‌سازی فایل اولیه", done: true, desc: "اتود نهایی فوتومونتاژ با امضای دیجیتال تایید شد." },
      { label: "بازنگری و تحویل نهایی", done: true, desc: "فایل وکتور لایه باز تحویل مشتری گردید." }
    ]
  },
  "AD-5555": {
    id: "AD-5555",
    service: "خرید ارز مسافرتی لیر ترکیه",
    customer: "آقای جوادی فر",
    status: "pending",
    statusText: "در انتظار صرافی مرکزی صنف",
    date: "۱۴۰۵/۰۳/۲۵",
    progress: 25,
    price: "۵۷,۰۰۰ تومان به ازای هر لیر",
    steps: [
      { label: "ثبت فاکتور سیستمی", done: true, desc: "فاکتور به صورت خودکار ایجاد گردید." },
      { label: "پذیرش توسط مجری", done: false, desc: "در نوبت تخصیص ارز صرافی صنف آرین." },
      { label: "طراحی و آماده‌سازی فایل اولیه", done: false, desc: "ثبت حواله آنلاین بانک کارگزار بین‌المللی." },
      { label: "بازنگری و تحویل نهایی", done: false, desc: "ارسال تصویر رسید حواله به تلگرام مشتری." }
    ]
  }
};

const PRICE_TREND_DATA = {
  creative: [
    { name: 'فروردین', index: 320, orders: 45 },
    { name: 'اردیبهشت', index: 340, orders: 58 },
    { name: 'خرداد', index: 390, orders: 72 },
    { name: 'تیر', index: 375, orders: 69 },
    { name: 'مرداد', index: 420, orders: 85 },
    { name: 'شهریور', index: 480, orders: 110 }
  ],
  office: [
    { name: 'فروردین', index: 120, orders: 95 },
    { name: 'اردیبهشت', index: 115, orders: 112 },
    { name: 'خرداد', index: 130, orders: 140 },
    { name: 'تیر', index: 140, orders: 125 },
    { name: 'مرداد', index: 145, orders: 155 },
    { name: 'شهریور', index: 160, orders: 180 }
  ],
  payment: [
    { name: 'فروردین', index: 56000, orders: 210 },
    { name: 'اردیبهشت', index: 57500, orders: 245 },
    { name: 'خرداد', index: 59000, orders: 300 },
    { name: 'تیر', index: 58200, orders: 280 },
    { name: 'مرداد', index: 61000, orders: 340 },
    { name: 'شهریور', index: 62500, orders: 420 }
  ]
};

const MOCK_FAQS = [
  {
    id: 1,
    category: 'payment',
    question: 'سیستم حفاظت تراکنش ضدتکرار (Idempotency Key) چیست و چگونه کار می‌کند؟',
    answer: 'هر تراکنش در درگاه آرین دیجیتال مجهز به یک کلید امضای یکتا (UUID) است. در صورتی که اینترنت شما در حین پرداخت قطع شود و یا به اشتباه دکمه بازگشت را دوبار فشار دهید، پروتکل امنیتی صنف ممانعت کرده و مانع تراکنش تکراری و کسر مجدد وجه از حساب بانکی شما می‌شود.'
  },
  {
    id: 2,
    category: 'guarantee',
    question: 'آیا برای سفارشات گرافیک و تایپ داک گارانتی اصلاح و بازنگری وجود دارد؟',
    answer: 'بله کاملاً! وجه پرداخت‌شده توسط مشتری تا زمان آپلود خروجی و اعلام رضایت نهایی در حساب امن پلتفرم (Escrow) محفوظ می‌ماند. مجریان مجاز به استفاده از وجه نیستند مگر آنکه بریف سفارش با تعهدات درج‌شده کاملاً همخوانی داشته و مورد امضای دیجیتال شما قرار گیرد.'
  },
  {
    id: 3,
    category: 'pwa',
    question: 'سیستم PWA مستقل چه مزیتی در زمان قطع شبکه اینترنت محلی دارد؟',
    answer: 'فناوری Progressive Web App با استفاده از شبیه‌سازی لایه Service Worker استاتیک، کلیه فاکتورهای پیشین، تعرفه بهای صنف، فلوها و مکالمات چت متنی شما را به صورت دائم آفلاین کش می‌کند. همچنین با اتصال مجدد، تمام تعاملات ذخیره‌شده را در دیتابیس همگام‌سازی می‌نماید.'
  },
  {
    id: 4,
    category: 'payment',
    question: 'چقدر طول می‌کشد تا گیفت‌کارت یا حواله‌های ارزی تحویل شود؟',
    answer: 'تمامی گیفت‌کارت‌های بازی‌های برتر (تایپ استیم، ایکس‌باکس و اشتراک‌ها) به صورت آنی پس از پرداخت فاکتور صادر می‌شوند. حواله‌های ارزی و دلاری نیز حداکثر ظرف ۲ ساعت اداری پس از تصفیه نهایی درگاه صادر و رسید تلگرامی به مشتری تحویل خواهد شد.'
  }
];

const INITIAL_TESTIMONIALS = [
  {
    id: 1,
    name: "حمید ذوالفقاری",
    role: "کارشناس بازرگانی پتروشیمی رایا",
    rating: 5,
    tag: "لوگو و هویت بصری",
    comment: "فرایند سفارش کاتالوگ و لوگوی تجاری شرکت ما فوق‌العاده سریع بود. من کل فاکتور را اینجا تخمین زدم و دقیقاً طبق همان مبلغ تصفیه کردم. تسویه درگاه بدون باگ و با امنیت اتمی انجام شد.",
    date: "۲ روز پیش"
  },
  {
    id: 2,
    name: "مریم حسینی",
    role: "مترجم و سرپرست دپارتمان زبان آریا",
    rating: 5,
    tag: "تایپ و آفیس تخصصی",
    comment: "تایپ فرمولار و متون ریاضی چندزبانه من که در سایت‌های دیگر رد می‌شد، توسط مجری برتر آرین دیجیتال ظرف یک روز با فرمت عالی فرستاده شد. سیستم چت با مجری هم خیلی کاربرپسند است.",
    date: "۱ هفته پیش"
  },
  {
    id: 3,
    name: "امید یزدانی",
    role: "توسعه‌دهنده مستقل بازی",
    rating: 4.8,
    tag: "ارز بین‌المللی و گیفت کارت",
    comment: "خرید گیفت‌کارت ریجن ترکیه استیم در کمتر از ۵ دقیقه با پکیج تخفیف انجام شد. پشتیبانی و پیگیری وضعیت سفارش بدون نیاز به لاگین‌های طولانی یک نوآوری واقعی است.",
    date: "۳ روز پیش"
  }
];

interface PortfolioLandingProps {
  onLoginSuccess: (selectedRole: 'customer' | 'provider' | 'admin', username: string) => void;
  onEnterAsGuest: () => void;
  isAuthenticated?: boolean;
  loggedInUser?: string;
  userRole?: 'customer' | 'provider' | 'admin' | null;
  onLogout?: () => void;
  walletBalance?: number;
  onChargeWallet?: (amount: number) => void;
  onGoToPishkhan?: () => void;
}

export default function PortfolioLanding({ 
  onLoginSuccess, 
  onEnterAsGuest,
  isAuthenticated = false,
  loggedInUser = '',
  userRole = 'customer',
  onLogout,
  walletBalance = 0,
  onChargeWallet,
  onGoToPishkhan
}: PortfolioLandingProps) {
  // Category tabs for Services Showcase
  const [activeCategory, setActiveCategory] = useState<'all' | 'payment' | 'creative' | 'office' | 'giftcard' | 'student' | 'print'>('all');
  
  // Interactive pricing calculator state
  const [selectedService, setSelectedService] = useState<Service>(ATRIAN_SERVICES[1]); // Default to Typing
  const [calcQuantity, setCalcQuantity] = useState<number>(10);
  const [calcDiscount, setCalcDiscount] = useState<number>(0);
  
  // Custom Coupon Promo State
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  const [couponSuccess, setCouponSuccess] = useState<string>('');

  // Order Tracker State
  const [trackIdInput, setTrackIdInput] = useState<string>('');
  const [trackerResult, setTrackerResult] = useState<any>(null);
  const [trackerError, setTrackerError] = useState<string>('');

  // Interactive Custom SVG Chart State
  const [selectedChartTab, setSelectedChartTab] = useState<'creative' | 'office' | 'payment'>('creative');
  const [hoveredChartIndex, setHoveredChartIndex] = useState<number | null>(null);

  // Testimonials / Feedback Wall State
  const [testimonials, setTestimonials] = useState<any[]>(INITIAL_TESTIMONIALS);
  const [newReviewName, setNewReviewName] = useState<string>('');
  const [newReviewText, setNewReviewText] = useState<string>('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewTag, setNewReviewTag] = useState<string>('طراحی خلاق');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  // Searchable Interactive FAQs State
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<'all' | 'payment' | 'guarantee' | 'pwa'>('all');
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  // Login flow state
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'provider' | 'admin'>('customer');
  const [loginStep, setLoginStep] = useState<'form' | 'otp' | 'success'>('form');
  const [errorText, setErrorText] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [portfolioChargeAmount, setPortfolioChargeAmount] = useState<string>('');
  
  // PWA simulator state
  const [pwaInstalled, setPwaInstalled] = useState<boolean>(false);
  const [pwaSimulatingInstall, setPwaSimulatingInstall] = useState<boolean>(false);
  const [offlineSimulation, setOfflineSimulation] = useState<boolean>(false);
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(true);

  // Filtered services
  const filteredServices = ATRIAN_SERVICES.filter(service => {
    if (activeCategory === 'all') return true;
    return service.category === activeCategory;
  });

  // Keep OTP countdown running if active
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle applied promo coupon validation
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) return;
    
    if (cleanCode === 'ARIAN2026') {
      setAppliedCoupon({ code: 'ARIAN2026', percent: 15 });
      setCouponSuccess('کد تخفیف طلایی ۱۵٪ صنف آرین با موفقیت اعمال شد!');
      setCouponError('');
    } else if (cleanCode === 'PWA10') {
      setAppliedCoupon({ code: 'PWA10', percent: 10 });
      setCouponSuccess('کد حمایت ملّی ۱۰٪ وب‌اپلیکیشن مستقل فعال شد!');
      setCouponError('');
    } else if (cleanCode === 'WINTER') {
      setAppliedCoupon({ code: 'WINTER', percent: 20 });
      setCouponSuccess('کد جشنواره سرد زمستانه ۲۰٪ تایید شد!');
      setCouponError('');
    } else if (cleanCode === 'STARTUP') {
      setAppliedCoupon({ code: 'STARTUP', percent: 25 });
      setCouponSuccess('تخفیف شگفت‌انگیز ۲۵٪ حامیان استارتاپی افزوده شد!');
      setCouponError('');
    } else {
      setCouponError('کد تخفیف وارد شده نامعتبر است. کدهای نمونه: ARIAN2026 یا PWA10 یا STARTUP');
      setCouponSuccess('');
    }
  };

  // Handle direct order tracker search
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = trackIdInput.trim().toUpperCase();
    if (!cleanId) return;
    
    // Check match
    const matched = MOCK_TRACKABLE_ORDERS[cleanId as keyof typeof MOCK_TRACKABLE_ORDERS];
    if (matched) {
      setTrackerResult(matched);
      setTrackerError('');
    } else {
      setTrackerError('کد پیگیری در پروتکل متمرکز یافت نشد! نمونه شناسه: AD-9418 یا AD-1234 یا AD-5555 را وارد کنید.');
      setTrackerResult(null);
    }
  };

  // Handler to load pre-built combo package direct to calculator
  const handleSelectPackage = (serviceId: string, qty: number, promoCode?: string) => {
    const srv = ATRIAN_SERVICES.find(s => s.id === serviceId);
    if (srv) {
      setSelectedService(srv);
      setCalcQuantity(qty);
      if (promoCode) {
        setCouponInput(promoCode);
        setAppliedCoupon({
          code: promoCode,
          percent: promoCode === 'STARTUP' ? 25 : promoCode === 'ARIAN2026' ? 15 : 10
        });
        setCouponSuccess(`پکیج فعال شد و کد تخفیف گارانتی ${promoCode} به محاسبات راه یافت.`);
        setCouponError('');
      } else {
        setAppliedCoupon(null);
        setCouponInput('');
        setCouponSuccess('پکیج ترکیبی با موفقیت در فاکتور بارگذاری گردید.');
      }
      
      // Smooth scroll to calculator anchor
      const calcElem = document.getElementById('atrian-calculator-anchor');
      if (calcElem) {
        calcElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Handle adding custom client reviews/testimonials to local state
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) {
      alert('لطفاً فیلدهای الزامی نام و متن بازخورد را کامل کنید.');
      return;
    }
    
    const newFeedback = {
      id: testimonials.length + 1,
      name: newReviewName,
      role: "کاربر ارزیاب پلتفرم آرین",
      rating: newReviewRating,
      tag: newReviewTag,
      comment: newReviewText,
      date: "هم‌اکنون درگاه"
    };

    setTestimonials([newFeedback, ...testimonials]);
    setNewReviewName('');
    setNewReviewText('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  // Handle calculator math supporting compound/additive promotional rate
  const calculatedTotal = selectedService ? selectedService.basePrice * calcQuantity : 0;
  const isBulkDiscount = calcQuantity >= 20;
  const discountRate = isBulkDiscount ? 0.1 : 0; // 10% discount on large quantities
  const couponDiscountRate = appliedCoupon ? appliedCoupon.percent / 100 : 0;
  const totalDiscountRate = Math.min(0.55, discountRate + couponDiscountRate); // Maximum coupon is 55%
  const finalCalculatedPrice = calculatedTotal * (1 - totalDiscountRate);

  // Trigger login phone OTP
  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.match(/^09\d{9}$/)) {
      setErrorText('لطفاً شماره موبایل معتبر ۱۱ رقمی با فرمت ۴۵۶۷...۰۹ وارد کنید.');
      return;
    }
    setErrorText('');
    setIsSubmitting(true);
    
    // Simulate API network Latency
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginStep('otp');
      setCountdown(59);
    }, 1000);
  };

  // Confirm simulated OTP entering
  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '1234' && otpCode !== '5555') {
      setErrorText('کد احراز هویت نادرست است. از کد نمونه ۵۵۵۵ استفاده کنید.');
      return;
    }
    setErrorText('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setLoginStep('success');
      setTimeout(() => {
        let name = 'مشتری آرین';
        if (selectedRole === 'provider') name = 'مهندس مجری (آبتین)';
        if (selectedRole === 'admin') name = 'ادمین کل صنف آرین';
        
        onLoginSuccess(selectedRole, name);
      }, 1500);
    }, 1200);
  };

  // Simulate Instant Login
  const handleQuickLogin = (role: 'customer' | 'provider' | 'admin') => {
    setIsSubmitting(true);
    setSelectedRole(role);
    setLoginStep('success');
    setTimeout(() => {
      let name = 'مشتری آرین';
      if (role === 'provider') name = 'مهندس مجری (آبتین)';
      if (role === 'admin') name = 'ادمین کل صنف آرین';
      setIsSubmitting(false);
      onLoginSuccess(role, name);
    }, 1500);
  };

  // Simulate PWA installation
  const triggerPwaInstallation = () => {
    setPwaSimulatingInstall(true);
    setTimeout(() => {
      setPwaSimulatingInstall(false);
      setPwaInstalled(true);
      setShowPwaBanner(false);
    }, 2000);
  };

  // Custom SVG Chart points calculation
  const chartData = PRICE_TREND_DATA[selectedChartTab];
  const chartMaxVal = Math.max(...chartData.map(d => d.index));
  const chartMinVal = Math.min(...chartData.map(d => d.index)) * 0.95;
  const valRange = chartMaxVal - chartMinVal || 1;
  const width = 600;
  const height = 180;
  const paddingLeft = 70;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const points = chartData.map((d, i) => {
    const x = paddingLeft + (i / (chartData.length - 1)) * (width - paddingLeft - paddingRight);
    const y = paddingTop + (1 - (d.index - chartMinVal) / valRange) * (height - paddingTop - paddingBottom);
    return { x, y, name: d.name, val: d.index, orders: d.orders };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') 
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : '';

  // Mock Showcase items for Creative Graphic / Layout portfolios
  const PORTFOLIO_SAMPLES = [
    {
      id: 1,
      title: 'بستۀ هویت بصری هلدینگ بین‌المللی رادان',
      category: 'لوگو و برندینگ',
      rating: 5,
      likes: 124,
      imageSeed: 'corporatebranding',
      desc: 'طراحی مونوگرام و کتابچه هویت بصری کامل برای شرکت مالی با سبک مدرن و رنگ طلایی-سرمه‌ای.',
      tool: 'Adobe Illustrator & corel'
    },
    {
      id: 2,
      title: 'رابط کاربری سوپراپلیکیشن موبایل آران‌کالا',
      category: 'تجربه کاربری UI/UX',
      rating: 4.9,
      likes: 98,
      imageSeed: 'mobilestoreui',
      desc: 'نگاشت بیش از ۲۴ اسکرین تعاملی فروشگاهی، سیستم پرداخت اقساطی، حساب کاربری و سبد خرید پویا.',
      tool: 'Figma + AI Generation'
    },
    {
      id: 3,
      title: 'کاتالوگ جامع محصولات صادراتی آذرخش پلیمر',
      category: 'کاتالوگ و تبلیغات',
      rating: 5,
      likes: 86,
      imageSeed: 'industrycatalog',
      desc: 'طراحی کتابچه تبلیغاتی ۱۶ صفحه‌ای با بالاترین استانداردهای رنگ تری دی چاپ افست.',
      tool: 'Adobe InDesign & Photoshop'
    },
    {
      id: 4,
      title: 'پوستر تبلیغاتی کمپین تابستانه پلتفرم سیب‌گیم',
      category: 'پست و استوری شبکه‌های اجتماعی',
      rating: 4.8,
      likes: 145,
      imageSeed: 'gamingposter',
      desc: 'مجموعه استوری‌های تعاملی و قالب پست اینستاگرام منطبق با برندبوک و کانیتینر نوری نئون.',
      tool: 'Photoshop CC'
    }
  ];

  return (
    <div className="space-y-12">
      
      {/* Dynamic Native PWA Installer Simulation Bar */}
      {showPwaBanner && !pwaInstalled && (
        <div className="bg-[#1E1B4B] border-b border-indigo-500/30 text-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 rtl:text-right">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <Smartphone className="w-5 h-5 text-indigo-400" />
              <span className="font-sans font-medium text-[11px] md:text-xs">
                نسخه سوپر پی‌دبلیوامارکت‌پلیس (<span className="text-amber-400 font-bold">PWA installable</span>) آرین دیجیتال آماده نصب روی دستگاه شماست. با نصب وب‌اپلیکیشن مستقل، بدون نیاز به فیلترشکن، سریع‌تر لود شوید!
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={triggerPwaInstallation}
                disabled={pwaSimulatingInstall}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-3 rounded-lg text-[10px] flex items-center gap-1 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                {pwaSimulatingInstall ? (
                  <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full ml-1" />
                ) : (
                  <Download className="w-3 h-3 ml-0.5" />
                )}
                <span>{pwaSimulatingInstall ? 'در حال نصب روی سیستم...' : 'آموزش و نصب سریع وب‌اپ'}</span>
              </button>
              <button 
                onClick={() => setShowPwaBanner(false)}
                className="text-slate-400 hover:text-white px-2 py-1"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. HERO BRANDING & CORE HIGHLIGHTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#111827] border border-slate-800 p-6 md:p-10 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 -mr-24 -mt-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 -ml-24 -mb-24 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Hero Left Content */}
        <div className="lg:col-span-7 space-y-6 text-right relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-550/20 px-3 py-1.5 rounded-full text-[10px] text-indigo-400 font-bold font-sans">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>آرین دیجیتال؛ مرجع منتخب خدمات فاکتورمحور و طراحی خلاق</span>
          </div>

          <h2 className="text-2xl md:text-3.5xl font-black text-white leading-tight font-sans">
            طراحی خلاق، امور بین‌الملل و <br/>
            <span className="bg-gradient-to-l from-indigo-400 via-purple-400 to-amber-300 bg-clip-text text-transparent">
              تایپ تخصصی بدون مرز فیزیکی
            </span>
          </h2>
          
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans font-light">
            ما بستری یکپارچه و هوشمند پدید آورده‌ایم تا نیازهای اداری و هنری شما — از ارزهای مسافرتی، خرید شارژ، ثبت کاتالوگ و لوگو، تا پروژه‌های چندزبانۀ کلاسی — را در کمال سرعت و با گارانتی پرداخت ضدتکرار (Idempotency Safe) مستقیم با معتمدترین مجریان فنی متصل کند.
          </p>

          {/* Interactive Feature Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="bg-[#161E31] border border-slate-800 p-3 rounded-xl flex flex-col justify-between text-right">
              <Clock className="w-5 h-5 text-amber-400 mb-2" />
              <div>
                <span className="text-[11px] font-bold text-white block">کارسپاری ۲۴ ساعته</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">ثبت در ترافیک زنده صنف</span>
              </div>
            </div>
            
            <div className="bg-[#161E31] border border-slate-800 p-3 rounded-xl flex flex-col justify-between text-right">
              <ShieldCheck className="w-5 h-5 text-indigo-400 mb-2" />
              <div>
                <span className="text-[11px] font-bold text-white block">امنیت تراکنش بانکی</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">تضمین پرداخت مطمئن</span>
              </div>
            </div>

            <div className="bg-[#161E31] border border-slate-800 p-3 rounded-xl flex flex-col justify-between text-right">
              <Cpu className="w-5 h-5 text-emerald-400 mb-2" />
              <div>
                <span className="text-[11px] font-bold text-white block">وب‌اپ مستقل PWA</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">دسترسی دائم کاملاً آفلاین</span>
              </div>
            </div>

            <div className="bg-[#161E31] border border-slate-800 p-3 rounded-xl flex flex-col justify-between text-right">
              <Award className="w-5 h-5 text-pink-400 mb-2" />
              <div>
                <span className="text-[11px] font-bold text-white block">تحویل تضمینی ایده</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">تسویه پس از اخذ رضایت</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3.5 pt-4">
            <a 
              href="#login-section-card" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] md:text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-indigo-550/15 cursor-pointer hover:translate-x-[-2px]"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>ورود فوری و شروع کارسپاری</span>
            </a>
            
            <a 
              href="#services-showcase" 
              className="bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 font-bold text-[11px] md:text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>مشاهده پورتفولیو و کاتالوگ خدمات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </a>

            {onGoToPishkhan && (
              <button 
                onClick={onGoToPishkhan}
                className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 font-bold text-[11px] md:text-xs py-3 px-6 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>ورود به پیشخوان ۲۴</span>
                <ArrowLeft className="w-3.5 h-3.5 animate-pulse" />
              </button>
            )}
          </div>
        </div>

        {/* Hero Right Content - Stunning Live Login/Enter Panel Box */}
        <div id="login-section-card" className="lg:col-span-5 bg-[#161E31] border border-slate-800 rounded-3xl p-6 shadow-2xl relative block">
          
          <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <h3 className="font-sans font-bold text-xs text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>دروازه احراز هویت یکپارچه آرین دیجیتال</span>
            </h3>
            <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 py-0.5 px-2 rounded-full font-sans">OTP SMS</span>
          </div>

          <AnimatePresence mode="wait">
            
            {isAuthenticated ? (
              <motion.div 
                key="logged-in-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4 text-right cursor-default"
              >
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
                  <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-550/20 rounded-xl flex items-center justify-center font-bold text-indigo-400 shrink-0">
                    <UserCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-slate-400 block font-bold">حساب فعال در صنف آرین:</span>
                    <strong className="text-white text-xs font-black truncate block">{loggedInUser}</strong>
                  </div>
                  <span className={`text-[8.5px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${
                    userRole === 'admin' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    userRole === 'provider' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {userRole === 'admin' ? 'مدیریت کل' :
                     userRole === 'provider' ? 'مجری مجاز' : 'مشتری صنف'}
                  </span>
                </div>

                {/* Dynamic Wallet Balance sub-card */}
                <div className="bg-[#1b253b] border border-slate-750/80 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                  <div className="absolute left-0 bottom-0 top-0 w-24 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1.5 font-bold">
                      <Wallet className="w-4 h-4 text-emerald-450" />
                      <span>کیف پول داینامیک شما:</span>
                    </span>
                    <span className="text-[8px] bg-emerald-550/10 border border-emerald-555/25 text-emerald-400 py-0.5 px-2 rounded-full font-sans tracking-tight">آماده تسویه آنی</span>
                  </div>

                  <div className="flex items-baseline justify-center gap-1 text-center py-1">
                    <span className="text-2xl font-black text-emerald-400 font-sans tracking-tight">
                      {walletBalance.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400">تومان</span>
                  </div>

                  {/* Inline wallet recharge input */}
                  <div className="border-t border-slate-800/85 pt-3 space-y-2">
                    <label className="block text-[9.5px] text-slate-400 font-bold">افزایش سریع اعتبار صنف (شارژ امن):</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="مبلغ شارژ به تومان..."
                        value={portfolioChargeAmount}
                        onChange={(e) => setPortfolioChargeAmount(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-2.5 py-2 text-white text-xs font-mono font-bold focus:outline-none placeholder:text-slate-600 text-center"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const amt = parseInt(portfolioChargeAmount, 10);
                          if (amt > 0 && onChargeWallet) {
                            onChargeWallet(amt);
                            setPortfolioChargeAmount('');
                          }
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-[10.5px] flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0"
                        title="افزایش اعتبار کیف پول"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>شارژ</span>
                      </button>
                    </div>

                    {/* Pre-sets */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {[150000, 500000, 2000000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setPortfolioChargeAmount(val.toString())}
                          className="bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-400 p-1 rounded-lg text-[8.5px] transition-colors cursor-pointer text-center"
                        >
                          +{val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Redirect or Logout options */}
                <div className="space-y-2.5 pt-1.5 border-t border-slate-800/60">
                  <div className="bg-indigo-600/10 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-300 text-[9.5px] leading-relaxed">
                    🌟 اطلاعات پروفایل و اعتبار شما با موفقیت در فضای ابری صنف کش گردیده است. شما می‌توانید در سایر پنجره‌ها به ثبت خدمات بپردازید.
                  </div>
                  
                  {onLogout && (
                    <button
                      type="button"
                      onClick={onLogout}
                      className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold py-2 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>خروج از حساب فعال (پاک کردن کش)</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <>
                {/* Step 1: Mobile Input Form */}
                {loginStep === 'form' && (
                  <motion.form 
                    key="login-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleRequestOTP} 
                    className="space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-400 font-bold">شماره تلفن همراه شما (جهت ورود با کد تایید):</label>
                      <div className="relative">
                        <input
                          id="mobile-input-field"
                          type="text"
                          maxLength={11}
                          placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-white text-xs font-mono text-center tracking-widest placeholder:text-slate-600 block pl-10"
                        />
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                      </div>
                    </div>

                    <div className="bg-[#0B0F1A] border border-slate-800 rounded-xl p-2.5">
                      <span className="block text-[10px] text-amber-400 font-bold mb-1.5 flex items-center gap-1.5">
                        <MousePointerClick className="w-3.5 h-3.5" />
                        <span>انتخاب نقش ورود در پلتفرم (شبیه‌ساز کاربری):</span>
                      </span>
                      
                      <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold font-sans">
                        <button
                          type="button"
                          onClick={() => setSelectedRole('customer')}
                          className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                            selectedRole === 'customer'
                              ? 'bg-indigo-600 border-indigo-550 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          مشتری طرح
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setSelectedRole('provider')}
                          className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                            selectedRole === 'provider'
                              ? 'bg-indigo-600 border-indigo-550 text-white shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          مجری / طراح
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedRole('admin')}
                          className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                            selectedRole === 'admin'
                              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          ادمین کل
                        </button>
                      </div>
                    </div>

                    {errorText && (
                      <div className="text-rose-400 text-[10px] bg-rose-500/5 border border-rose-500/10 p-2 rounded-lg leading-relaxed text-right">
                        ⚠️ {errorText}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/15 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full ml-1" />
                      ) : null}
                      <span>ارسال کد احراز هویت یکبار مصرف (SMS)</span>
                    </button>

                    <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2">
                      <span className="text-[9px] text-slate-400 block text-center">ورود و ارزیابی سریع بدون نیاز به ارسال پیامک:</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('customer')}
                          className="bg-slate-900 hover:bg-slate-850 p-2 text-slate-300 rounded-lg text-[9px] border border-slate-800 font-sans cursor-pointer text-center"
                        >
                          مشتری نمونه
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('provider')}
                          className="bg-slate-900 hover:bg-slate-850 p-2 text-slate-300 rounded-lg text-[9px] border border-slate-800 font-sans cursor-pointer text-center"
                        >
                          مجری نمونه
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickLogin('admin')}
                          className="bg-slate-900 hover:bg-slate-850 p-2 text-rose-300 rounded-lg text-[9px] border border-slate-800 font-sans cursor-pointer text-center"
                        >
                          ادمین نمونه
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}

                {/* Step 2: OTP Entry Form */}
                {loginStep === 'otp' && (
                  <motion.form 
                    key="otp-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleVerifyOTP}
                    className="space-y-4 text-right"
                  >
                    <div className="bg-indigo-600/10 border border-indigo-500/20 p-2.5 rounded-xl text-indigo-300 text-[10px] leading-relaxed">
                      کد احراز هویت برای شماره <strong className="text-white font-mono">{mobileNumber}</strong> ارسال گردید. برای تست شبیه‌سازی، لطفاً کد <span className="text-yellow-400 font-bold font-mono">۵۵۵۵</span> یا <span className="text-yellow-400 font-bold font-mono">۱۲۳۴</span> را وارد کنید.
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-400 font-bold">کد تایید ۴ رقمی پیامکی:</label>
                      <input
                        id="otp-input-field"
                        type="text"
                        maxLength={4}
                        placeholder="• • • •"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl p-3 text-white text-base font-mono text-center tracking-[0.5em] placeholder:text-slate-700"
                      />
                    </div>

                    {errorText && (
                      <div className="text-rose-400 text-[10px] bg-rose-500/5 border border-rose-500/10 p-2 rounded-lg leading-relaxed">
                        ⚠️ {errorText}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      {countdown > 0 ? (
                        <span>ارسال مجدد کد تا {countdown} ثانیه دگر</span>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => setCountdown(59)}
                          className="text-indigo-400 hover:underline"
                        >
                          ارسال مجدد کد تایید
                        </button>
                      )}
                      <button 
                        type="button" 
                        onClick={() => setLoginStep('form')}
                        className="text-slate-400 hover:text-white"
                      >
                        تغییر شماره موبایل
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/15 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-1" />
                      ) : null}
                      <span>تایید کد و ورود هوشمند به پورتال</span>
                    </button>
                  </motion.form>
                )}

                {/* Step 3: Success Animation View */}
                {loginStep === 'success' && (
                  <motion.div 
                    key="success-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                  >
                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 animate-bounce">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-sm text-white">ورود با موفقیت انجام شد!</h4>
                      <p className="text-[10px] text-slate-400 mt-1">در حال آماده‌سازی و بارگذاری پورتال اختصاصی {selectedRole === 'customer' ? 'مشتری' : selectedRole === 'provider' ? 'طرح و مجری علمی' : 'مدیر صنف آرین'}...</p>
                    </div>
                    <div className="w-40 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-450 animate-[pulse_1.5s_infinite] w-full" />
                    </div>
                  </motion.div>
                )}
              </>
            )}

          </AnimatePresence>

        </div>
      </div>

      {/* [INNOVATION 1] INSTANT DIRECT ORDER STATUS TRACKER WIDGET */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-right font-sans relative overflow-hidden">
        <div className="absolute right-0 bottom-0 -mr-16 -mb-16 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg text-[9px] text-indigo-400 font-bold">
              <Compass className="w-3.5 h-3.5 animate-spin" />
              <span>پایگاه داده متمرکز صنف آرین دیجیتال</span>
            </div>
            <h3 className="text-white font-black text-sm">درگاه رهگیری آنی وضعیت فاکتور</h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              بدون نیاز به ثبت‌نام یا ورود به حساب، با وارد کردن شناسه فاکتور مکتوب خود (مانند <strong className="text-indigo-400 font-mono">AD-9418</strong> یا <strong className="text-indigo-400 font-mono">AD-1234</strong>) از آخرین وضعیت گردش کار خود مطلع شوید.
            </p>

            <form onSubmit={handleTrackOrder} className="pt-2 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="مثال: AD-9418"
                  value={trackIdInput}
                  onChange={(e) => setTrackIdInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-600 font-mono text-center tracking-wider focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[11px] px-5 py-2.5 rounded-xl cursor-pointer transition-colors whitespace-nowrap"
              >
                جستجو
              </button>
            </form>

            {trackerError && (
              <p className="text-[10px] text-rose-400 mt-1 leading-relaxed">⚠️ {trackerError}</p>
            )}
          </div>

          <div className="lg:col-span-8 bg-[#161E31]/65 border border-slate-800 p-5 rounded-2xl min-h-[160px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {trackerResult ? (
                <motion.div
                  key="tracker-match"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">خدمت سفارش داده شده:</span>
                      <strong className="text-xs text-white">{trackerResult.service}</strong>
                    </div>
                    <div className="text-left font-mono">
                      <span className="text-[10px] text-slate-400 block text-right">مبلغ فاکتور:</span>
                      <span className="text-amber-400 font-bold text-xs">{trackerResult.price}</span>
                    </div>
                    <div>
                      <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-1 px-3 rounded-full font-bold">
                        {trackerResult.statusText} ({trackerResult.progress}٪)
                      </span>
                    </div>
                  </div>

                  {/* Stepper Display */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {trackerResult.steps.map((st: any, sIdx: number) => (
                      <div 
                        key={sIdx} 
                        className={`border rounded-xl p-3 text-right flex flex-col justify-between space-y-1.5 transition-all ${
                          st.done 
                            ? 'bg-indigo-950/20 border-indigo-500/20 text-slate-200' 
                            : 'bg-slate-900/40 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                            st.done 
                              ? 'bg-indigo-600 text-white shadow-sm' 
                              : 'bg-slate-800 text-slate-650'
                          }`}>
                            {sIdx + 1}
                          </span>
                          
                          {st.today && (
                            <span className="text-[8px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                              امروز
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold block">{st.label}</span>
                          <p className="text-[9px] text-slate-450 leading-relaxed mt-1 font-light">{st.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="tracker-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 space-y-2.5 text-slate-400"
                >
                  <Search className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
                  <div>
                    <span className="text-xs text-slate-200 font-bold block">منتظر جستجوی شناسه فاکتور</span>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-md mx-auto">
                      برای ارزیابی، شماره فاکتور معتبر <strong className="text-indigo-400 font-mono">AD-9418</strong> یا <strong className="text-indigo-400 font-mono">AD-1234</strong> را در فیلد فوق ثبت کرده و دکمه جستجو را فشار دهید.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* [INNOVATION 2] INTERACTIVE CUSTOM SVG TREND GRAPH */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl text-right font-sans relative overflow-hidden">
        <div className="absolute left-0 top-0 -ml-16 -mt-16 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-4 mb-6 gap-4">
          <div className="space-y-1.5">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2.5 py-1 rounded-lg">
              گزارش عملکرد و شفافیت مالی (شاخص صنف ۱۴۰۵)
            </span>
            <h3 className="text-white font-black text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>نمودار تعاملی نوسانات تعرفه و حجم معاملات</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              شاخص نوسانات قیمتی خدمات و تراکم سفارشات دریافتی در ۶ ماهه سال جاری صنف آرین دیجیتال
            </p>
          </div>

          {/* Chart Tab selectors */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { type: 'creative', label: 'طراحی خلاق' },
              { type: 'office', label: 'تایپ و اداری' },
              { type: 'payment', label: 'نرخ دلار لیر ملّی' }
            ].map(tab => (
              <button
                key={tab.type}
                onClick={() => {
                  setSelectedChartTab(tab.type as any);
                  setHoveredChartIndex(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedChartTab === tab.type
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Premium Custom SVG Plot Graphic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 bg-slate-900/40 border border-slate-850 p-4 rounded-2xl flex items-center justify-center">
            
            <div className="relative w-full max-w-2xl overflow-x-auto select-none">
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-auto text-slate-600 block"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 1, 2, 3].map((g, gi) => {
                  const yLine = paddingTop + (gi / 3) * (height - paddingTop - paddingBottom);
                  return (
                    <line
                      key={gi}
                      x1={paddingLeft}
                      y1={yLine}
                      x2={width - paddingRight}
                      y2={yLine}
                      stroke="#1e293b"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* X Axis label lines */}
                {points.map((p, pIdx) => (
                  <line
                    key={pIdx}
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={height - paddingBottom}
                    stroke="#1e293b"
                    strokeDasharray="2 4"
                    strokeWidth="0.8"
                  />
                ))}

                {/* Glow Area Path under the line */}
                <path d={areaD} fill="url(#chartGradient)" />

                {/* High Contrast Line Path */}
                <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Circle points on line */}
                {points.map((p, pIdx) => (
                  <circle
                    key={pIdx}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredChartIndex === pIdx ? "6" : "4"}
                    className="transition-all duration-150 cursor-pointer"
                    fill={hoveredChartIndex === pIdx ? "#34d399" : "#818cf8"}
                    stroke="#111827"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredChartIndex(pIdx)}
                  />
                ))}

                {/* Left Y Axis Labels */}
                <text x={paddingLeft - 10} y={paddingTop + 5} textAnchor="end" className="fill-slate-500 font-mono text-[9px] font-bold">
                  {selectedChartTab === 'payment' ? '۶۵,۰۰۰' : selectedChartTab === 'creative' ? '۵۰۰k' : '۲۰۰'}
                </text>
                <text x={paddingLeft - 10} y={(paddingTop + height - paddingBottom) / 2 + 3} textAnchor="end" className="fill-slate-500 font-mono text-[9px] font-bold">
                  {selectedChartTab === 'payment' ? '۵۹,۰۰۰' : selectedChartTab === 'creative' ? '۴۰۰k' : '۱۴۰'}
                </text>
                <text x={paddingLeft - 10} y={height - paddingBottom + 3} textAnchor="end" className="fill-slate-500 font-mono text-[9px] font-bold">
                  {selectedChartTab === 'payment' ? '۵۶,۰۰۰' : selectedChartTab === 'creative' ? '۳۰۰k' : '۱۰۰'}
                </text>

                {/* Bottom X Axis Line & Labels */}
                <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#334155" strokeWidth="1" />
                {points.map((p, pIdx) => (
                  <text
                    key={pIdx}
                    x={p.x}
                    y={height - 10}
                    textAnchor="middle"
                    className="fill-slate-450 text-[9px] font-bold font-sans"
                  >
                    {p.name}
                  </text>
                ))}
              </svg>
            </div>

          </div>

          {/* Interactive display Panel corresponding to graph hovered dot */}
          <div className="lg:col-span-4 bg-[#161E31] border border-slate-800 p-5 rounded-2xl text-right space-y-3">
            <div>
              <span className="text-[10px] text-slate-400 block">انتخاب تفکیک فعال:</span>
              <p className="text-[11px] font-bold text-white">
                {selectedChartTab === 'creative' ? 'امور گرافیک صنف (هزار تومان)' :
                 selectedChartTab === 'office' ? 'کارهای اداری/تایپ (تعداد صفحه)' : 'قیمت بازار مرجع ارز ملی (تومان)'}
              </p>
            </div>
            
            <div className="bg-[#0b0f1a] p-3 rounded-xl border border-slate-850">
              {hoveredChartIndex !== null ? (
                <div className="space-y-1.5">
                  <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-0.5 px-2 rounded-full font-bold">
                    گزارش ماه {chartData[hoveredChartIndex].name}
                  </span>
                  
                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <span className="text-slate-400">میانگین شاخص به بها:</span>
                    <strong className="text-amber-400 font-mono text-xs">{chartData[hoveredChartIndex].index.toLocaleString()}</strong>
                  </div>

                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-400">تعداد پرونده‌های تسویه شده:</span>
                    <strong className="text-white font-mono text-xs">{chartData[hoveredChartIndex].orders} فاکتور</strong>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 space-y-1">
                  <span className="text-slate-400 text-[10px] block">ماوس را گره‌های روی نمودار ببرید:</span>
                  <span className="text-[9px] text-slate-550 leading-relaxed block">
                    برای بررسی نقطه‌ای و حجم معاملات هر ماه، ماوس را روی نقاط دایره‌ای قرار دهید.
                  </span>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 leading-relaxed pt-1.5 flex items-start gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
              <span>پروتکل بهای واحد به صورت کاملا توافقی و با نظارت صنف در راستای ثبات بازار کنترل می‌شود.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SERVICES CATALOG & INTERACTIVE CALCULATOR SECTION */}
      <div id="services-showcase" className="space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="text-right space-y-1.5">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <span>کاتالوگ جامع خدمات و بهای واحد صنف آرین دیجیتال</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              تعرفه‌های پایه بر اساس آخرین مصوبات صنف آرین تنظیم و هرگونه فرآیند محاسبه به صورت آنی و تضمینی انجام می‌پذیرد.
            </p>
          </div>

          {/* Service filter selector */}
          <div className="flex items-center gap-1 bg-[#161E31] p-1 rounded-xl border border-slate-800 overflow-x-auto">
            {[
              { type: 'all', label: 'همه خدمات' },
              { type: 'payment', label: 'پرداخت بین‌المللی و ارز' },
              { type: 'creative', label: 'توسعه نرم‌افزار، بازی و گرافیک' },
              { type: 'office', label: 'خدمات اداری و عمومی' },
              { type: 'student', label: 'مجموعه تخصصی دانشجویی' },
              { type: 'print', label: 'خدمات چاپ، زیراکس و صحافی' },
              { type: 'giftcard', label: 'گیفت کارت و اشتراک' }
            ].map(tab => (
              <button
                key={tab.type}
                onClick={() => setActiveCategory(tab.type as any)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === tab.type
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* [INNOVATION 4] COMBO PACKAGES & PROVEN COOPERATIVE SPECIALS */}
        <div className="bg-[#111827]/80 border border-indigo-950/45 rounded-2xl p-5 md:p-6 text-right space-y-4">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3 flex-wrap gap-2">
            <div>
              <span className="text-[10px] bg-indigo-500/15 text-indigo-400 font-extrabold px-2 py-0.5 rounded-full font-sans">
                تشنه بهر و صرفه‌جویی؟
              </span>
              <h4 className="text-white font-extrabold text-sm mt-1.5 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>پکیج‌های طلایی ترکیبی و از پیش‌پیکربندی شده صنف</span>
              </h4>
            </div>
            <div>
              <span className="text-xs text-slate-400">تسهیل روند فاکتور با تخفیف‌های ویژه استارتاپی و دانشجویی</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            
            {/* Package 1 */}
            <div className="bg-[#161E31]/45 border border-slate-800 hover:border-indigo-650 rounded-xl p-4 flex flex-col justify-between transition-all hover:scale-[1.01] relative overflow-hidden">
              <span className="absolute top-0 left-0 bg-indigo-500 text-white text-[8px] font-black px-2.5 py-1 rounded-br-lg uppercase font-sans tracking-wide">
                25% Launch OFF
              </span>
              <div className="space-y-2 mt-2">
                <span className="text-[10px] text-indigo-400 font-bold block">امور گرافیکی ملّی</span>
                <strong className="text-white text-xs block truncate">شبیه‌ساز برندینگ طلایی استارتاپ</strong>
                <p className="text-[9px] text-slate-400 leading-relaxed font-light">
                  ثبت ۱ سفارش لوگوی تجاری لایه‌باز همراه با بریف اختصاصی، ضمانت بازنگری و کوپن ۲۵ درصدی استارتاپ.
                </p>
                <div className="bg-slate-950/50 rounded-lg p-2 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-450">تعرفه مصوب:</span>
                  <span className="text-amber-400 font-bold">۱ واحد لوگو + ۲۵٪ تخفیف</span>
                </div>
              </div>
              <button
                onClick={() => handleSelectPackage('logo-design', 1, 'STARTUP')}
                className="w-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-[9px] py-2 px-3 rounded-lg border border-indigo-500/20 mt-4 transition-colors cursor-pointer"
              >
                اعمال مستقیم روی برگه فاکتور
              </button>
            </div>

            {/* Package 2 */}
            <div className="bg-[#161E31]/45 border border-slate-800 hover:border-emerald-650 rounded-xl p-4 flex flex-col justify-between transition-all hover:scale-[1.01] relative overflow-hidden">
              <span className="absolute top-0 left-0 bg-emerald-500 text-white text-[8px] font-black px-2.5 py-1 rounded-br-lg font-sans tracking-wide">
                15% Scholar
              </span>
              <div className="space-y-2 mt-2">
                <span className="text-[10px] text-emerald-400 font-bold block">تایپ و آفیس دانشگاهی</span>
                <strong className="text-white text-xs block truncate">پکیج کتاب / رساله دکتری ۵۰ صفجه</strong>
                <p className="text-[9px] text-slate-400 leading-relaxed font-light">
                  تنظیم و ویراستاری رساله دکتری و مقاله ISI با فرمولار ریاضی پیشرفته، نمایه مراجع و کوپن ۱۵ درصد آرین.
                </p>
                <div className="bg-slate-950/50 rounded-lg p-2 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-450">تعرفه مصوب:</span>
                  <span className="text-amber-400 font-bold">۵۰ صفحه + ۱۵٪ تخفیف</span>
                </div>
              </div>
              <button
                onClick={() => handleSelectPackage('typing', 50, 'ARIAN2026')}
                className="w-full bg-emerald-600/20 hover:bg-emerald-650 text-emerald-300 hover:text-white font-bold text-[9px] py-2 px-3 rounded-lg border border-emerald-500/20 mt-4 transition-colors cursor-pointer"
              >
                اعمال مستقیم روی برگه فاکتور
              </button>
            </div>

            {/* Package 3 */}
            <div className="bg-[#161E31]/45 border border-slate-800 hover:border-amber-650 rounded-xl p-4 flex flex-col justify-between transition-all hover:scale-[1.01] relative overflow-hidden">
              <span className="absolute top-0 left-0 bg-amber-500 text-slate-950 text-[8px] font-black px-2.5 py-1 rounded-br-lg uppercase font-sans tracking-wide">
                10% PWA Support
              </span>
              <div className="space-y-2 mt-2">
                <span className="text-[10px] text-amber-400 font-bold block">حواله ارزی لیر ترکیه</span>
                <strong className="text-white text-xs block truncate">پکیج ارز همراه مسافرتی (۱۵۰۰ لیر)</strong>
                <p className="text-[9px] text-slate-400 leading-relaxed font-light">
                  خرید لیر با تسویه آنی درگاه ملی، تضمین ضدتکرار، مجهز به گارانتی استقلال PWA صنف و تخفیف ۱۰ درصدی.
                </p>
                <div className="bg-slate-950/50 rounded-lg p-2 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-450">مبنای حواله:</span>
                  <span className="text-amber-400 font-bold">۱,۵۰۰ لیر + ۱۰٪ تخفیف</span>
                </div>
              </div>
              <button
                onClick={() => handleSelectPackage('online-payment', 1500, 'PWA10')}
                className="w-full bg-amber-600/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-[9px] py-2 px-3 rounded-lg border border-amber-500/20 mt-4 transition-colors cursor-pointer"
              >
                اعمال مستقیم روی برگه فاکتور
              </button>
            </div>

          </div>
        </div>

        {/* Dynamic Services grid with design-focused custom items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(srv => {
            const isSelected = selectedService.id === srv.id;
            return (
              <div 
                key={srv.id}
                onClick={() => {
                  setSelectedService(srv);
                  if (srv.minQty) {
                    setCalcQuantity(srv.minQty);
                  } else {
                    setCalcQuantity(5);
                  }
                }}
                className={`bg-[#161E31] border rounded-2xl p-5 hover:translate-y-[-2px] hover:border-slate-700 transition-all cursor-pointer text-right flex flex-col justify-between space-y-4 ${
                  isSelected ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span className={`text-[8px] font-sans px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                      srv.category === 'payment' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                      srv.category === 'creative' ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' :
                      srv.category === 'office' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      srv.category === 'student' ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' :
                      srv.category === 'print' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                      'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {srv.category === 'payment' ? 'ارزی بین‌المللی' :
                       srv.category === 'creative' ? 'کدنویسی و خلاق' :
                       srv.category === 'office' ? 'آفیس تخصصی' :
                       srv.category === 'student' ? 'علمی دانشگاهی' :
                       srv.category === 'print' ? 'چاپ دیجیتال' : 'کارت هدیه'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: {srv.id}</span>
                  </div>

                  <h4 className="font-sans font-bold text-white text-xs leading-normal">{srv.name}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{srv.description}</p>
                </div>

                <div className="border-t border-slate-850 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-500 block">نرخ پایه واحد:</span>
                    <span className="text-white font-black text-xs font-mono">{srv.basePrice.toLocaleString()} </span>
                    <span className="text-[9px] text-slate-400">تومان ({
                      srv.pricingType === 'page' ? 'صفحه' :
                      srv.pricingType === 'sample' ? 'نمونه' :
                      srv.pricingType === 'dollar' ? '۱۰ دلار' : 
                      srv.pricingType === 'meter' ? 'متر مربع' : 'پروژه'
                    })</span>
                  </div>
                  
                  <span className="text-[10px] text-indigo-400 font-bold font-sans flex items-center gap-1">
                    <span>محاسبه مجزا</span>
                    <ArrowLeft className="w-3 h-3 text-indigo-400" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Multiplier Live Cost Calculator Box */}
        <div id="atrian-calculator-anchor" className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-right leading-relaxed font-sans scroll-mt-20">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl" />
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Calc Controls left */}
            <div className="md:col-span-8 space-y-4">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2.5 py-1 rounded-lg">
                شبیه‌ساز و تخمین‌گر آنی فاکتور خرید
              </span>
              <h4 className="text-white font-extrabold text-sm">تخمین‌گر نرخ استقرار طرح: <span className="text-indigo-400">{selectedService.name}</span></h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 font-bold">تعداد واحد مورد نیاز (حداقل {selectedService.minQty || 1}):</label>
                  <div className="flex items-center gap-2">
                    <input
                      id="calculator-qty-input"
                      type="number"
                      min={selectedService.minQty || 1}
                      value={calcQuantity}
                      onChange={(e) => setCalcQuantity(Math.max(selectedService.minQty || 1, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 font-bold text-center text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {selectedService.pricingType === 'page' ? 'صفحه تخصصی' :
                       selectedService.pricingType === 'sample' ? 'اتود گرافیکی' :
                       selectedService.pricingType === 'dollar' ? '۱۰ دلار' : 
                       selectedService.pricingType === 'meter' ? 'متر مربع' : 'واحد کار'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-[10px] text-slate-400 font-bold font-sans">کمپین تخفیف انبوه:</span>
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-2 text-[10px] text-slate-300">
                    {isBulkDiscount ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>شامل ۱۰٪ تخفیف حجم سفارش بالا (بالای ۲۰ واحد کار)</span>
                      </span>
                    ) : (
                      <span className="text-slate-500">سفارشات با حجم بالای ۲۰ واحد مشمول تخفیف ۱۰ درصدی خواهند شد.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* [INNOVATION 3] Interactive Promo Coupons Form */}
              <div className="bg-[#161E31]/70 border border-slate-800 p-4 rounded-xl space-y-2 mt-4 text-right">
                <span className="block text-[10px] text-indigo-400 font-extrabold flex items-center gap-1.5 font-sans">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>کد تخفیف کمپین هوشمند دارید؟</span>
                </span>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="نمونه: ARIAN2026 یا PWA10 یا STARTUP"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-2 text-[11px] font-mono text-center tracking-wider text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-[10px] px-4 py-2 rounded-lg cursor-pointer transition-colors whitespace-nowrap"
                  >
                    اعمال کد
                  </button>
                </form>
                {couponError && (
                  <p className="text-[10px] text-rose-400 font-sans mt-1">⚠️ {couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-[10px] text-emerald-400 font-sans mt-1">✓ {couponSuccess}</p>
                )}
              </div>

            </div>

            {/* Total display right */}
            <div className="md:col-span-4 bg-[#161E31] border border-slate-850 p-5 rounded-2xl space-y-3.5 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">برآورد کل مبلغ فاکتور:</span>
                {(isBulkDiscount || appliedCoupon) && (
                  <span className="text-[10px] text-slate-500 block line-through font-mono">{(calculatedTotal).toLocaleString()} تومان</span>
                )}
                <strong className="text-amber-400 text-xl font-black font-mono">{Math.round(finalCalculatedPrice).toLocaleString()}</strong>
                <span className="text-[10px] text-slate-300 font-sans mr-1">تومان</span>

                {appliedCoupon && (
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 px-2 rounded-full inline-block mt-2 font-bold font-sans">
                    کوپن فعال: {appliedCoupon.code} ({appliedCoupon.percent}٪ تخفیف)
                  </span>
                )}
              </div>

              {/* Official Downpayment & Union Rules Note */}
              <div className="bg-slate-950/40 rounded-xl p-3 text-right space-y-1.5 mt-2 text-[10px] text-slate-400 font-sans border border-slate-900 leading-relaxed">
                <p className="text-emerald-400 font-bold flex items-center gap-1 justify-between">
                  <span>پیش‌پرداخت بیعانه (۳۰٪):</span>
                  <span><strong className="text-white font-mono text-xs">{Math.round(finalCalculatedPrice * 0.3).toLocaleString()}</strong> تومان</span>
                </p>
                <p className="pt-1 text-[9px] border-t border-slate-900 text-slate-450 text-justify">
                  با توجه به نرخنامه سال ۱۴۰۵ مصوبه خدمات اتحادیه صنف رایانه تهران و نصر، کارفرما ۳۰٪ مبلغ فاکتور را به عنوان بیعانه پرداخت خواهد کرد و پروسه خدمات (بسته به ابعاد از ۱ روز تا ۱ سال) آغاز می‌شود. در صورت نیاز به جلسه حضوری تفاهم نهایی ترتیب داده خواهد شد.
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-3">
                <a 
                  href="#login-section-card" 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ثبت سفارش بر اساس این فاکتور</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. SHOWCASE / PORTFOLIO GRAPHIC SAMPLES */}
      <div className="space-y-6">
        <div className="text-right space-y-1.5">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>نشان افکار طراحان صنف (نمونه کارهای اجرایی اخیر)</span>
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            گوشه‌ای از آثار خلاقانۀ برنده شده در منصب برندینگ و کاتالوگ‌های فیزیکی که به تایید مشتریان نهایی رسیده است.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PORTFOLIO_SAMPLES.map(sample => (
            <div key={sample.id} className="bg-[#161E31] border border-slate-800 rounded-3xl overflow-hidden shadow-lg hover:border-slate-700 transition-all grid grid-cols-1 md:grid-cols-12">
              
              {/* Card visual showcase rendering a nice vector/color-block mockup */}
              <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 flex flex-col justify-between relative min-h-[160px] md:min-h-0">
                <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
                  <div className="w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
                </div>
                
                <span className="bg-slate-950/80 text-[8px] text-slate-300 font-bold px-2 py-0.5 rounded-full border border-slate-800 self-start">
                  {sample.category}
                </span>

                <div className="space-y-1 text-right">
                  <div className="text-xs font-mono font-bold text-amber-400">ART_SPEC_REG</div>
                  <div className="text-[10px] text-slate-400 font-mono">#AD-{sample.id}9418</div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono border-t border-slate-800/80 pt-2 text-slate-300">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{sample.rating}</span>
                  </span>
                  <span>کاربرپسند</span>
                </div>
              </div>

              {/* Card Details text right */}
              <div className="md:col-span-7 p-5 flex flex-col justify-between text-right space-y-4">
                <div className="space-y-2">
                  <h4 className="font-bold text-white text-xs leading-snug">{sample.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{sample.desc}</p>
                </div>

                <div className="border-t border-slate-850/80 pt-3 flex items-center justify-between">
                  <span className="text-[9px] text-slate-500 block">ابزار بکار رفته: <strong className="text-slate-300 font-normal">{sample.tool}</strong></span>
                  <button
                    onClick={() => alert(`شبیه‌سازی دانلود جزئیات بریف طرح #${sample.id}`)}
                    className="text-indigo-400 hover:text-indigo-300 text-[10px] font-bold font-sans flex items-center gap-0.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 ml-0.5" />
                    <span>کپی پروپوزال</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 4. IMMERSIVE PWA APPS & OFFLINE COOPERATIVE STATUS CODETRACKER */}
      <div className="bg-[#111827] border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl font-sans text-right">
        <div className="absolute left-0 top-0 -ml-16 -mt-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3.5">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2.5 py-1 rounded-lg">
              پایداری و تکنولوژی بومی وب‌سرور آرین (PWA Mode)
            </span>
            <h4 className="text-white font-extrabold text-sm leading-normal">پوشش دائم اینترنت محلی با تکنولوژی کش دایرکتوری در لایه مرورگر</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              پلتفرم آرین دیجیتال با فعال‌سازی کامل Service Worker در پروتکل امن HTTPS و بهره‌گیری از هدر کشینگ، در بستر تلفن همراه، تبلت و لپ‌تاپ به یک برنامه بومی نرم‌افزاری بهینه تبدیل شده است. حتی با قطع کامل اینترنت می‌توانید فاکتورها را مانیتور کنید.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>شبیه‌سازی کامل کش استاتیک</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ثبت سفارش آفلاین در دیتابیس محلی (IndexedDB)</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>همگام‌سازی بلافاصله پس از آنلاین شدن مجدد</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#161E31] border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-between gap-4 text-center">
            
            {/* Live Interactive Offline simulator toggle state */}
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 bg-slate-900/40 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                {offlineSimulation ? (
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>شبیه‌ساز وضعیت مخابراتی آفلاین:</span>
              </span>
              
              <button
                type="button"
                onClick={() => setOfflineSimulation(!offlineSimulation)}
                className={`py-1 px-3 rounded-md text-[9px] font-bold transition-all cursor-pointer ${
                  offlineSimulation 
                    ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' 
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {offlineSimulation ? 'آفلاین (فعال)' : 'متصل به وب (عادی)'}
              </button>
            </div>

            {/* Offline simulate display card */}
            <AnimatePresence mode="wait">
              {offlineSimulation ? (
                <motion.div 
                  key="offline-ui"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl space-y-1.5 w-full text-right leading-relaxed"
                >
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>آرین دیجیتال در وضعیت قطع دسترسی (Offline)</span>
                  </span>
                  <p className="text-[9px] text-amber-300">
                    مرورگر شما در حال حاضر از طریق کش هارد دیسک وب‌سایت را بالا نگاه داشته است. سفارشات پیش‌نویس در دستگاه ذخیره و فوراً پس از اتصال همگام خواهند شد!
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="online-ui"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-xl space-y-1.5 w-full text-right leading-relaxed"
                >
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>وضعیت شبکه: متصل به پایانه مرکزی آرین دیجیتال</span>
                  </span>
                  <p className="text-[9px] text-emerald-300/80">
                    تبادلات کلاینت-سرور کاملاً پایدار، زمان تاخیر اتصال به درگاه ۸ میلی‌ثانیه و پایگاه داده PostgreSQL صنف فعال است.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => {
                triggerPwaInstallation();
                alert('شبیه‌سازی نصب: وب‌اپلیکیشن آرین دیجیتال به عنوان اپ مستقل مستقل روی گجت شما اضافه شد!');
              }}
              className="w-full bg-[#1e293b] hover:bg-slate-800 text-slate-200 border border-slate-800 p-2.5 rounded-xl text-[10px] font-bold font-sans flex items-center justify-center gap-2 cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-indigo-400 animate-[bounce_2s_infinite]" />
              <span>نصب سراسری PWA روی دستکتاپ / اندروید</span>
            </button>
          </div>
        </div>
      </div>

      {/* [INNOVATION 5] INTERACTIVE CLIENT FEEDBACK WALL & RATING UPLOADER */}
      <div className="bg-[#111827] border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl font-sans text-right space-y-6">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-850 pb-4">
          <div className="space-y-1.5 font-sans">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2.5 py-1 rounded-lg">
              دیوار اعتماد و بازخورد مشتریان صنف
            </span>
            <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>دیوار مستقل افکار و میزان رضایتمندی کاربران</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              دیدگاه‌های ثبت‌شده همکاران و کارآفرینان در استفاده از بسترهای موازی و ارز بین‌الملل آرین
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-sans">بروزرسانی زنده فیدبک‌ها از پهنای باند گمرک</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Submit New Review Form Block */}
          <div className="lg:col-span-5 bg-[#161E31]/75 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h5 className="text-white font-bold text-xs flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-indigo-400" />
              <span>افزودن برگه فیدبک شما</span>
            </h5>
            <p className="text-[10px] text-slate-400 leading-relaxed font-light">
              با اشتراک‌گذاری تجربه واقعی خرید خود، به بهبود تخصیص کیفی خدمات کارگزاران و صنف آرین یاری رسانید.
            </p>

            <form onSubmit={handleAddReview} className="space-y-3 text-right">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  placeholder="مثال: دکتر آریا رادان"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg p-2 text-[11px] text-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">توضیح کوتاه یا متن بازخورد:</label>
                <textarea
                  placeholder="تجربه کار با پرتال هوشمند و سرعت محاسبه واحدها..."
                  rows={3}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg p-2 text-[11px] text-white focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-bold">امتیاز خرید (از ۵):</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(parseFloat(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg p-2 text-[10px] text-white font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value={5}>⭐️⭐️⭐️⭐️⭐️ ۵ ستاره کامل</option>
                    <option value={4}>⭐️⭐️⭐️⭐️ ۴ ستاره مطلوب</option>
                    <option value={3}>⭐️⭐️⭐️ ۳ ستاره متوسط</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-bold">دسته‌بندی مربوطه:</label>
                  <select
                    value={newReviewTag}
                    onChange={(e) => setNewReviewTag(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg p-2 text-[10px] text-white font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="طراحی خلاق و لوگو">طراحی خلاق و لوگو</option>
                    <option value="تایپ و آفیس تخصصی">تایپ و آفیس تخصصی</option>
                    <option value="بخش حوالجات و پرداخت">بخش حوالجات و پرداخت</option>
                    <option value="گیفت کارت‌های بازی">گیفت کارت‌های بازی</option>
                  </select>
                </div>
              </div>

              {reviewSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded-lg">
                  ✓ بازخورد ارزشمند شما با موفقیت در صف کنترل صنف آرین قرار گرفت و فوراً روی دیوار نمایش داده شد!
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] py-2 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                ثبت بازخورد ارزشمند روی دیوار صنف
              </button>
            </form>
          </div>

          {/* Testimonials List Grid Block */}
          <div className="lg:col-span-7 space-y-4 max-h-[360px] overflow-y-auto pr-1">
            <AnimatePresence>
              {testimonials.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#161E31]/40 border border-slate-850 p-4 rounded-2xl space-y-2 text-right relative hover:border-slate-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-white text-xs block font-bold">{test.name}</strong>
                      <span className="text-[9px] text-indigo-400 font-medium block mt-0.5">{test.role}</span>
                    </div>
                    
                    <div className="text-left font-sans">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, sIdx) => (
                          <Star 
                            key={sIdx} 
                            style={{ fill: sIdx < Math.floor(test.rating) ? '#fbbf24' : 'none' }}
                            className="w-3 h-3" 
                          />
                        ))}
                      </div>
                      <span className="text-[8px] text-slate-500 block mt-1">{test.date}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-300 leading-relaxed font-light mt-1.5">{test.comment}</p>
                  
                  <div className="pt-2 flex justify-end">
                    <span className="text-[8px] bg-slate-900 border border-slate-800 text-slate-400 py-0.5 px-2 rounded-lg font-bold font-sans">
                      {test.tag}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* [INNOVATION 6] PREMIUM DYNAMIC FAQ ACCORDION SECTION */}
      <div className="bg-[#111827] border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl font-sans text-right space-y-6">
        <div className="absolute left-0 bottom-0 -ml-16 -mb-16 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-850 pb-4 gap-4">
          <div className="space-y-1.5 font-sans">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold px-2.5 py-1 rounded-lg">
              پاسخ به سوالات متداول کاربران صنف آرین
            </span>
            <h4 className="text-white font-extrabold text-sm flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>پایگاه اطلاعاتی و پرسش‌های متداول پویا</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              اگر پاسخ سوال خود را نیافتید با جستجوی سریع کلمات کلیدی، پاسخ کارگزاران صنف را بررسی نمایید.
            </p>
          </div>

          {/* Search box within FAQ */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="جستجوی سریع موضوع سوال..."
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl p-2 pr-8 text-[11px] text-white focus:outline-none font-sans"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3" />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'همه سوالات' },
            { id: 'payment', label: 'حفاظت تراکنش و امنیت' },
            { id: 'guarantee', label: 'تعهد کاری و گارانتی' },
            { id: 'pwa', label: 'مزایای وب‌اپلیکیشن مستقل (PWA)' }
          ].map(faqCat => (
            <button
              key={faqCat.id}
              onClick={() => setSelectedFaqCategory(faqCat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold font-sans transition-all cursor-pointer ${
                selectedFaqCategory === faqCat.id
                  ? 'bg-indigo-600 border border-indigo-550 text-white'
                  : 'bg-slate-900 border border-slate-850 text-slate-450 hover:text-white'
              }`}
            >
              {faqCat.label}
            </button>
          ))}
        </div>

        {/* Filtered Accordion List */}
        <div className="space-y-2">
          {MOCK_FAQS
            .filter(faq => {
              const matchesCategory = selectedFaqCategory === 'all' || faq.category === selectedFaqCategory;
              const matchesSearch = faq.question.includes(faqSearchQuery) || faq.answer.includes(faqSearchQuery);
              return matchesCategory && matchesSearch;
            })
            .map(faq => {
              const isOpen = openFaqId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`border rounded-xl transition-all overflow-hidden ${
                    isOpen 
                      ? 'bg-[#161E31]/70 border-indigo-500/25 shadow-md' 
                      : 'bg-[#161E31]/30 border-slate-850 hover:border-slate-750'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-right p-4 flex items-center justify-between gap-3 text-white font-bold text-xs select-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <span className={`text-indigo-400 font-mono text-[10px] transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                      ◀
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t border-slate-850/80 text-[10.5px] text-slate-300 leading-relaxed font-light">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
        </div>
      </div>

      {/* Floating Chat Support assistant popup */}
      <FloatingChatSupport />

    </div>
  );
}
