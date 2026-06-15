import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle2, 
  Send, 
  Star, 
  ShieldAlert, 
  RefreshCw, 
  TrendingUp, 
  Users, 
  DollarSign, 
  FileUp, 
  User, 
  MessageSquare, 
  FileDown, 
  Edit, 
  ChevronLeft,
  Settings,
  Sliders,
  Bell,
  Trash2,
  Lock,
  Download,
  Map,
  MapPin,
  Truck,
  Navigation,
  Printer
} from 'lucide-react';
import { ATRIAN_SERVICES, Service, OrderStatus, ORDER_STATUS_LABELS } from '../data/serviceData';

// Mock system state stored in memory or local storage
interface MockOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  totalAmount: number;
  downpaymentAmount?: number;
  instructions: string;
  status: OrderStatus;
  customerName: string;
  providerName: string;
  attachments: { name: string; size: string; type: string }[];
  deliverables?: { text: string; fileName: string };
  messages: { sender: 'customer' | 'provider' | 'system'; text: string; timestamp: string }[];
  rating?: number;
  reviewComment?: string;
  createdAt: string;
  idempotencyKey: string;
}

interface MarketplaceSimulatorProps {
  initialRole?: 'customer' | 'provider' | 'admin';
  loggedInUser?: string;
  walletBalance?: number;
  onDeductWallet?: (amount: number) => boolean;
  onChargeWallet?: (amount: number) => void;
}

const TEHRAN_PREBUILT_LOCATIONS = [
  { id: 'enghelab', name: 'دفتر مرکزی آرین (میدان انقلاب)', x: 195, y: 120 },
  { id: 'vanak', name: 'میدان ونک', x: 205, y: 80 },
  { id: 'tajrish', name: 'میدان تجریش', x: 215, y: 30 },
  { id: 'saadatabad', name: 'سعادت‌آباد (میدان کاج)', x: 125, y: 50 },
  { id: 'tehranpars', name: 'فلکه اول تهرانپارس', x: 310, y: 140 },
  { id: 'azadi', name: 'میدان آزادی', x: 100, y: 160 },
  { id: 'passdaran', name: 'سه راه پاسداران', x: 260, y: 70 }
];

export default function MarketplaceSimulator({ 
  initialRole, 
  loggedInUser,
  walletBalance = 0,
  onDeductWallet,
  onChargeWallet
}: MarketplaceSimulatorProps = {}) {
  const [role, setRole] = useState<'customer' | 'provider' | 'admin'>(initialRole || 'customer');
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>(ATRIAN_SERVICES);
  const [currentOrderFilter, setCurrentOrderFilter] = useState<OrderStatus | 'All'>('All');
  
  // Create Order States (Customer)
  const [selectedServiceId, setSelectedServiceId] = useState<string>(ATRIAN_SERVICES[0].id);
  const [quantity, setQuantity] = useState<number>(1);
  const [instructions, setInstructions] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  // Active selected order for detail view and chat
  const [activeSelectedOrderId, setActiveSelectedOrderId] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState<string>('');
  
  // Payment Gateway states
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [gatewayCardNumber, setGatewayCardNumber] = useState('6219-8610-');
  const [gatewayCVV2, setGatewayCVV2] = useState('');
  const [gatewayOTP, setGatewayOTP] = useState('');
  const [isOTPSending, setIsOTPSending] = useState(false);
  const [gatewayMessage, setGatewayMessage] = useState('');
  
  // Provider action states
  const [deliverableText, setDeliverableText] = useState('');
  const [deliverableFile, setDeliverableFile] = useState('خروجی_طراحی_آرین.zip');
  
  // Rating states (Customer)
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>('');

  // Formal Invoice Viewer States
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<MockOrder | null>(null);
  
  // Admin adjustment states
  const [selectedAdminServiceId, setSelectedAdminServiceId] = useState<string>(ATRIAN_SERVICES[0].id);
  const [adminServicePrice, setAdminServicePrice] = useState<number>(ATRIAN_SERVICES[0].basePrice);

  // Innovation States: Snapp / Tap30 Courier delivery with Map matching
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapCourierType, setMapCourierType] = useState<'snapp' | 'tap30'>('snapp');
  const [selectedTehranPos, setSelectedTehranPos] = useState({ x: 205, y: 80, name: 'میدان ونک' });
  const [mapDetailAddress, setMapDetailAddress] = useState('طبقه ۲، واحد ۴ شمالی');
  const [mapRecipientName, setMapRecipientName] = useState('جناب مهندس آریا زارع');
  const [mapRecipientPhone, setMapRecipientPhone] = useState('09121234567');
  const [deliveryTrackerSteps, setDeliveryTrackerSteps] = useState<Record<string, number>>({});

  const submitCourierDelivery = () => {
    if (!activeSelectedOrderId) return;
    
    // Calculate distance and fee based on pixels
    const dx = selectedTehranPos.x - 195;
    const dy = selectedTehranPos.y - 120;
    const distanceKm = Number((Math.sqrt(dx * dx + dy * dy) * 0.05).toFixed(1)) || 1.2;
    const durationMin = Math.round(distanceKm * 3.5 + 6);
    const baseFee = mapCourierType === 'snapp' ? 30000 : 35000;
    const kmFee = mapCourierType === 'snapp' ? 5000 : 6000;
    const priceTooman = Math.round(baseFee + distanceKm * kmFee);

    const deliveryPayload = {
      courier: mapCourierType,
      address: `${selectedTehranPos.name}، ${mapDetailAddress}`,
      recipientName: mapRecipientName,
      recipientPhone: mapRecipientPhone,
      fee: priceTooman,
      distance: distanceKm,
      duration: durationMin,
      id: `DLV-${Math.floor(10000 + Math.random() * 90000)}`
    };

    const textMsg = `[DELIVERY_MAP]::${JSON.stringify(deliveryPayload)}`;

    setOrders(prev => prev.map(ord => {
      if (ord.id === activeSelectedOrderId) {
        addAuditLog(`درخواست اعزام پیک ${mapCourierType === 'snapp' ? 'اسنپ باکس' : 'تپ‌سی'} به مقصد ${selectedTehranPos.name} ثبت و به پرونده تحویل پیوست شد.`, 'event');
        return {
          ...ord,
          messages: [
            ...ord.messages,
            {
              sender: 'customer',
              text: textMsg,
              timestamp: new Date().toLocaleTimeString('fa-IR').slice(0, 5)
            }
          ]
        };
      }
      return ord;
    }));

    setIsMapModalOpen(false);
  };

  // System Notifications
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: 'info' | 'success' | 'alert' }[]>([
    { id: '1', text: 'به پلتفرم آزمایشی آرین دیجیتال خوش آمدید. نقش شبیه‌سازی خود را تغییر داده و عملیات را تست کنید.', type: 'info' }
  ]);

  // System Audit Logs
  const [auditLogs, setAuditLogs] = useState<{ timestamp: string; text: string; type: string }[]>([
    { timestamp: new Date().toLocaleTimeString(), text: 'سیستم آرین دیجیتال با موفقیت بوت گردید.', type: 'init' },
    { timestamp: new Date().toLocaleTimeString(), text: 'ماشین فرمول محاسبه هزینه خدمات به تومان همگام‌سازی شد.', type: 'calc' },
  ]);

  // Load initial simulated orders
  useEffect(() => {
    const savedOrdersStr = localStorage.getItem('arian_orders');
    if (savedOrdersStr) {
      try {
        const saved = JSON.parse(savedOrdersStr);
        if (saved && saved.length > 0) {
          setOrders(saved);
          setActiveSelectedOrderId(saved[0].id);
          return;
        }
      } catch (e) {
        // Fallback
      }
    }

    const defaultOrders: MockOrder[] = [
      {
        id: 'AD-9418',
        serviceId: 'typing',
        serviceName: 'خدمات تایپ تخصصی',
        quantity: 12,
        totalAmount: 180000,
        instructions: 'لطفاً با قلم بی‌نازنین فونت ۱۴ تایپ شود. جدول‌های داخل عکس ترجیحاً بازسازی شوند.',
        status: OrderStatus.InProgress,
        customerName: 'آرین جاویدان',
        providerName: 'رضا حسینی (طراح ارشد)',
        attachments: [{ name: 'متن_دستنویس_۱.jpeg', size: '2.4 MB', type: 'image/jpeg' }],
        messages: [
          { sender: 'system', text: 'سفارش ثبت و پرداختی آن تایید شد.', timestamp: '10:05' },
          { sender: 'system', text: 'اپراتور رضا حسینی این سفارش را پذیرش کرد.', timestamp: '10:10' },
          { sender: 'provider', text: 'سلام جناب جاویدان، دست‌نویس‌ها کاملاً خوانا هستند. تا فردا خروجی را خدمتتان دلیور می‌کنم.', timestamp: '10:12' }
        ],
        createdAt: '2026-06-15 10:00',
        idempotencyKey: 'idem-ord-typing-9418'
      },
      {
        id: 'AD-1052',
        serviceId: 'logo-design',
        serviceName: 'طراحی لوگو اختصاصی (برندینگ)',
        quantity: 1,
        totalAmount: 2800000,
        instructions: 'یک اتود لوگو مفهومی برای یک صرافی آنلاین ارزهای دیجیتال می‌خواهم. لوگو مونوگرام تلفیقی از حرف A و المان چرخ‌دنده باشد.',
        status: OrderStatus.Delivered,
        customerName: 'فروشگاه آذرخش',
        providerName: 'سمیرا کیانی (طراح خلاق)',
        attachments: [{ name: 'بریف_توضیحات.pdf', size: '890 KB', type: 'application/pdf' }],
        deliverables: {
          text: 'فایل‌های نهایی طراحی لوگو در چهار تم رنگی تیره، روشن و نسخه وکتور SVG بارگذاری شد. لطفا تایید بفرمایید.',
          fileName: 'آذرخش_لوگو_وکتور.zip'
        },
        messages: [
          { sender: 'system', text: 'سفارش ایجاد و به درگاه متصل شد.', timestamp: '08:15' },
          { sender: 'system', text: 'تراکنش ۶۲۱۹-****-****-۵۸۱۱ تایید مالی گردید.', timestamp: '08:16' },
          { sender: 'provider', text: 'سلام، طرح‌های اتود انجام شد و فایل منسجم خدمت شما ارسال شد.', timestamp: '14:20' }
        ],
        createdAt: '2026-06-15 08:12',
        idempotencyKey: 'idem-ord-logo-1052'
      },
      {
        id: 'AD-2195',
        serviceId: 'giftcard-amazon',
        serviceName: 'گیفت کارت آمازون (Amazon)',
        quantity: 50, // 50$
        totalAmount: 315000, // 5 * 63000
        instructions: 'تحویل فوری در پنل کاربری',
        status: OrderStatus.PendingPayment,
        customerName: 'آرین جاویدان',
        providerName: 'سیستم خودکار (اپراتور)',
        attachments: [],
        messages: [
          { sender: 'system', text: 'سفارش به حالت پیش‌نویس موقت درآمد و لینک امن پرداخت صادر شد.', timestamp: '22:10' }
        ],
        createdAt: '2026-06-15 22:10',
        idempotencyKey: 'idem-ord-amazon-2195'
      }
    ];
    setOrders(defaultOrders);
    localStorage.setItem('arian_orders', JSON.stringify(defaultOrders));
    if (defaultOrders.length > 0) {
      setActiveSelectedOrderId(defaultOrders[0].id);
    }
  }, []);

  // Sync back to localStorage whenever orders update dynamically (checking actual difference to prevent loops)
  useEffect(() => {
    if (orders && orders.length > 0) {
      const savedStr = localStorage.getItem('arian_orders');
      const currentStr = JSON.stringify(orders);
      if (savedStr !== currentStr) {
        localStorage.setItem('arian_orders', currentStr);
        // Dispatch event for other listeners in same document
        window.dispatchEvent(new Event('storage'));
      }
    }
  }, [orders]);

  // Sync from other components/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'arian_orders' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
          }
        } catch (err) {
          // Fallback
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Fallback interval to capture state changes within same tab
    const interval = setInterval(() => {
      const savedStr = localStorage.getItem('arian_orders');
      if (savedStr) {
        try {
          const parsed = JSON.parse(savedStr);
          const currentStr = JSON.stringify(orders);
          if (savedStr !== currentStr && Array.isArray(parsed) && parsed.length > 0) {
            setOrders(parsed);
          }
        } catch (err) {}
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [orders]);

  const addAuditLog = (text: string, type: 'info' | 'success' | 'alert' | 'event' = 'info') => {
    setAuditLogs(prev => [
      { timestamp: new Date().toLocaleTimeString(), text, type },
      ...prev
    ]);
  };

  const addNotification = (text: string, type: 'info' | 'success' | 'alert' = 'info') => {
    setNotifications(prev => [
      { id: Date.now().toString() + '-' + Math.random().toString(36).substring(2, 11), text, type },
      ...prev
    ]);
  };

  // Find currently selected service and base calculations
  const currentSelectedService = servicesList.find(s => s.id === selectedServiceId) || servicesList[0];
  
  // Calculate pricing based on service multiplier formula
  const getCalculatedPrice = () => {
    if (currentSelectedService.pricingType === 'dollar') {
      // priced per dollar. So qty is the total dollars.
      return currentSelectedService.basePrice * quantity;
    }
    return currentSelectedService.basePrice * quantity;
  };

  // Change of admin service selection updating inputs
  const selectAdminService = (id: string) => {
    setSelectedAdminServiceId(id);
    const s = servicesList.find(item => item.id === id);
    if (s) {
      setAdminServicePrice(s.basePrice);
    }
  };

  // Live admin value adjustments
  const handleUpdateAdminPrice = () => {
    setServicesList(prev => prev.map(s => {
      if (s.id === selectedAdminServiceId) {
        addAuditLog(`تغییر تعرفه خدمت [${s.name}] به نرخ واحد ${adminServicePrice.toLocaleString()} تومان.`, 'success');
        addNotification(`تعرفه صنف دیجیتال برای خدمت [${s.name}] توسط مدیریت بروز شد.`, 'info');
        return { ...s, basePrice: adminServicePrice };
      }
      return s;
    }));
  };

  // Simulated drag and drop uploads
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newAttachment = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type
      };
      setUploadedFiles(prev => [...prev, newAttachment]);
      addAuditLog(`فایل نمونه [${file.name}] با موفقیت در فضای S3 باگگذاری گردید.`, 'success');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAttachment = {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type
      };
      setUploadedFiles(prev => [...prev, newAttachment]);
      addAuditLog(`فایل نمونه [${file.name}] از فایل اکسپلورر بارگذاری و در فضای ابری ثبت شد.`, 'success');
    }
  };

  // Submitting a new service order (as Customer)
  const handleRegisterOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = `AD-${Math.floor(1000 + Math.random() * 9000)}`;
    const idempotencyKey = `idem-order-${orderId}-${Date.now().toString().slice(-4)}`;
    const finalAmount = getCalculatedPrice();

    const newOrder: MockOrder = {
      id: orderId,
      serviceId: currentSelectedService.id,
      serviceName: currentSelectedService.name,
      quantity,
      totalAmount: finalAmount,
      downpaymentAmount: Math.round(finalAmount * 0.3),
      instructions: instructions || 'توضیحات در ثبت نیامده است.',
      status: OrderStatus.PendingPayment,
      customerName: 'آریا جاویدان (کاربر شبیه‌ساز)',
      providerName: currentSelectedService.category === 'giftcard' ? 'سیستم شارژ خودکار' : 'در انتظار انتخاب مجری',
      attachments: uploadedFiles.length > 0 ? uploadedFiles : [{ name: 'دستورالعمل_طراحی.pdf', size: '1.2 MB', type: 'application/pdf' }],
      messages: [
        { sender: 'system', text: `سفارش فاکتورسازی شد. کلید حفاظت تراکنش ضد فوت وقت صادر گردید: ${idempotencyKey}`, timestamp: 'اکنون' }
      ],
      createdAt: new Date().toLocaleDateString('fa-IR') + ' ' + new Date().toLocaleTimeString('fa-IR').slice(0, 5),
      idempotencyKey
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveSelectedOrderId(orderId);
    setInstructions('');
    setUploadedFiles([]);
    
    addAuditLog(`ایجاد فاکتور پیش‌نویس سفارش ${orderId} به مبلغ ${finalAmount.toLocaleString()} تومان با موفقیت ثبت شد.`, 'event');
    addNotification(`فاکتور سفارش ${orderId} صادر شد. اکنون از طریق لیست سفارشات و درگاه تصفیه کلیلک کنید.`, 'success');
  };

  // Triggering the Payment portal
  const triggerPaymentPortal = (order: MockOrder) => {
    setPayingOrderId(order.id);
    setIsGatewayOpen(true);
    setGatewayMessage('');
    setGatewayCVV2('');
    setGatewayOTP('');
  };

  const handleSendMockOTP = () => {
    setIsOTPSending(true);
    setTimeout(() => {
      setIsOTPSending(false);
      setGatewayOTP(Math.floor(10000 + Math.random() * 90000).toString());
      setGatewayMessage('کد تایید پیامکی (OTP) برای شماره مشتری صادر گردید.');
      addAuditLog('کد رمز یکبار مصرف درگاه بانک ملت ارسال گردید.', 'info');
    }, 1000);
  };

  // Submitting actual simulated payment
  const executePaymentSubmit = () => {
    if (!payingOrderId) return;
    
    // Simulate payment webhook receipt
    setOrders(prev => prev.map(ord => {
      if (ord.id === payingOrderId) {
        addAuditLog(`سیستم مالی: وب‌سرویس درگاه تأیید بانکی را با کلید تراکنش ${ord.idempotencyKey} نهایی کرد.`, 'success');
        addNotification(`پرداخت فاکتور ${ord.id} با موفقیت تسویه شد. سفارش به حالت آماده انجام درآمد.`, 'success');
        
        const isGiftcard = ord.serviceName.includes('گیفت کارت');
        const nextStatus = isGiftcard ? OrderStatus.Completed : OrderStatus.Paid;

        return {
          ...ord,
          status: nextStatus,
          providerName: isGiftcard ? 'تحویل‌دهنده خودکار سامان' : 'مریم رضایی (متخصص گرافیک)',
          deliverables: isGiftcard ? {
            text: `کدهای گیفت کارت به ازای مقدار تراکنش: \nAMZN-GFT-${Math.floor(100000 + Math.random() * 900000)}-VALID`,
            fileName: 'کدهای_گیفت_کارت_اورجینال.txt'
          } : undefined,
          messages: [
            ...ord.messages,
            { sender: 'system', text: `کیف پول پرداخت تایید شد. شماره تسویه درگاه: Saman-Rrn-${Math.floor(1000000 + Math.random() * 9000000)}`, timestamp: 'اکنون' },
            isGiftcard 
              ? { sender: 'system', text: 'سفارش به دلیل خودکار بودن گیفت‌کارت بلافاصله تکمیل و کدهای دیجیتال بارگذاری شدند.', timestamp: 'اکنون' }
              : { sender: 'system', text: 'سفارش به تیم طراحان واگذار شد. طراح مریم رضایی کار را پذیرفت.', timestamp: 'اکنون' }
          ]
        };
      }
      return ord;
    }));

    setIsGatewayOpen(false);
    setPayingOrderId(null);
  };

  // Shared helper to trigger print/PDF generation
  const triggerPrintInvoice = (invoice: MockOrder) => {
    const calculatedBase = Math.round(invoice.totalAmount / 1.1);
    const calculatedVat = invoice.totalAmount - calculatedBase;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('لطفاً اجازه باز شدن پنجره پاپ‌آپ (Pop-up) را در مرورگر خود بدهید تا پیش‌نمایش پرینت بارگذاری شود.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>فاکتور رسمی آرین دیجیتال - ${invoice.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;450;700;900&display=swap');
          body {
            font-family: 'Vazirmatn', sans-serif;
            margin: 0;
            padding: 40px;
            background-color: #fcfcfc;
            color: #111827;
          }
          .print-badge-notice {
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 10px;
            border-radius: 6px;
            font-size: 11px;
            color: #1e40af;
            text-align: center;
            margin-bottom: 20px;
            font-weight: bold;
          }
          .invoice-box {
            max-width: 900px;
            margin: auto;
            border: 2px solid #2563eb;
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            position: relative;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }
          .title-pishkhan {
            font-size: 20px;
            font-weight: 900;
            color: #1e3a8a;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .metadata-table {
            width: 100%;
            margin-top: 15px;
            border-collapse: collapse;
          }
          .metadata-table td {
            padding: 6px 10px;
            font-size: 11px;
            border: 1px solid #e5e7eb;
            background: #f9fafb;
          }
          .parties-section {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
          }
          .party-card {
            border: 1.5px solid #d1d5db;
            border-radius: 8px;
            padding: 12px;
            background: #fff;
          }
          .party-card h4 {
            margin: 0 0 8px 0;
            color: #2563eb;
            font-size: 13px;
            font-weight: 700;
            border-bottom: 1px dashed #d1d5db;
            padding-bottom: 5px;
          }
          .party-card p {
            margin: 4px 0;
            font-size: 11px;
            line-height: 1.6;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
            font-size: 11.5px;
          }
          .items-table th {
            background-color: #2563eb;
            color: white;
            padding: 8px 10px;
            text-align: right;
            border: 1px solid #2563eb;
          }
          .items-table td {
            border: 1px solid #d1d5db;
            padding: 10px;
          }
          .items-table tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .financials {
            width: 45%;
            margin-right: auto;
            margin-top: 15px;
            border-collapse: collapse;
            font-size: 11px;
          }
          .financials td {
            padding: 6px 10px;
            border: 1px solid #d1d5db;
          }
          .stamp-box {
            position: relative;
            height: 160px;
            margin-top: 25px;
            border-top: 1px dashed #e5e7eb;
            padding-top: 15px;
            display: flex;
            justify-content: space-between;
          }
          .sig-buyer {
            font-size: 11px;
            font-weight: bold;
            margin-top: 30px;
          }
          .stamp {
            width: 140px;
            height: 140px;
            border: 3px double #2563eb;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: #2563eb;
            transform: rotate(-7deg);
            background: rgba(37,99,235,0.02);
            font-weight: bold;
            font-size: 8px;
            line-height: 1.3;
          }
          .stamp-inner {
            border: 1px dashed #2563eb;
            width: 124px;
            height: 124px;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .stamp-title {
            font-weight: 950;
            font-size: 9px;
            color: #1d4ed8;
          }
          @media print {
            body { padding: 0; background: none; }
            .print-badge-notice { display: none; }
            .invoice-box { border: 1px solid #000; box-shadow: none; }
          }
        </style>
      </head>
      <body onload="window.print();">
        <div class="print-badge-notice">
          سند فاکتور رسمی تایید شده صنف با کد ترخیص الکترونیک صادر گردید. از دکمه‌های مرورگر یا کلید ترکیبی Ctrl+P برای پرینت مستقیم فیزیکی یا ذخیره‌سازی PDF بهره بگیرید. (جهت دریافت فایل PDF گزینه Destination را بر روی Save as PDF تنظیم کنید)
        </div>
        <div class="invoice-box">
          <div class="title-pishkhan">
            <span>شرکت مهندسی آرین دیجیتال (مسئولیت محدود)</span>
            <span style="font-size: 13px; color: #6b7280;">صورت‌حساب رسمی فروش کالا و خدمات صنف رایانه</span>
          </div>
          
          <table class="metadata-table">
            <tr>
              <td><strong>شماره فاکتور:</strong> INV-${invoice.id}</td>
              <td><strong>کد پیگیری پیشخوان:</strong> ${invoice.idempotencyKey || 'AD-981240'}</td>
              <td><strong>تاریخ صدور:</strong> ${invoice.createdAt.slice(0, 10)}</td>
            </tr>
            <tr>
              <td><strong>شماره ثبت صنف:</strong> ۵۸۱۹۴</td>
              <td><strong>شناسه ملی شرکت:</strong> ۱۰۳۲۰۰۴۹۱۸۳</td>
              <td><strong>روش پرداخت:</strong> کیف پول داینامیک کلاینت</td>
            </tr>
          </table>

          <div class="parties-section">
            <div class="party-card">
              <h4>مشخصات فروشنده (آرین دیجیتال)</h4>
              <p><strong>نام شخص حقوقی:</strong> شرکت خدمات فناوری اطلاعات آرین دیجیتال</p>
              <p><strong>شناسه ملی:</strong> ۱۰۳۲۰۰۴۹۱۸۳ | <strong>شماره ثبت:</strong> ۵۸۱۹۴</p>
              <p><strong>آدرس کاربری:</strong> تهران، میدان انقلاب، خیابان کارگر شمالی، ساختمان رستاخیز، واحد ۳ غربی</p>
              <p><strong>شماره تلفن:</strong> ۰۲۱-۶۶۵۴۳۲۱۰</p>
            </div>
            
            <div class="party-card">
              <h4>مشخصات خریدار</h4>
              <p><strong>نام کارشناس / مشتری:</strong> ${invoice.customerName || 'مشتری صنف'}</p>
              <p><strong>نوع سفارش:</strong> استقرار درگاه الکترونیک هوایی صنف</p>
              <p><strong>نشانی تحویل:</strong> ثبت سیستمی بر روی کش امن کلاینت</p>
              <p><strong>موبایل خریدار:</strong> ۰۹۱۲۳۴۵۶۷۸۹</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 8%">ردیف</th>
                <th style="width: 45%">شرح خدمات یا کالا</th>
                <th style="width: 12%">تعداد / واحد</th>
                <th style="width: 15%">قیمت واحد (ریال)</th>
                <th style="width: 20%">قیمت کل (تومان)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;">۱</td>
                <td>
                  <strong>${invoice.serviceName}</strong><br>
                  <span style="font-size: 9.5px; color: #4b5563;">جزئیات: ${invoice.instructions}</span>
                </td>
                <td style="text-align: center;">${invoice.quantity} واحد</td>
                <td style="text-align: left; font-family: monospace;">${(Math.round(calculatedBase / invoice.quantity) * 10).toLocaleString()}</td>
                <td style="text-align: left; font-weight: bold;">${invoice.totalAmount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <table class="financials">
            <tr>
              <td><strong>جمع کل خالص (تومان):</strong></td>
              <td style="text-align: left; font-weight: bold;">${calculatedBase.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>مالیات بر ارزش افزوده (۱۰٪):</strong></td>
              <td style="text-align: left; color: #4b5563;">${calculatedVat.toLocaleString()}</td>
            </tr>
            <tr style="background:#f1f5f9; font-weight: bold;">
              <td><strong>مبلغ کل نهایی (به تومان):</strong></td>
              <td style="text-align: left; color: #1e40af; font-size:12px;">${invoice.totalAmount.toLocaleString()}</td>
            </tr>
            <tr style="background:#ecfdf5; font-weight: bold; color: #15803d;">
              <td><strong>مبلغ پیش‌پرداخت بیعانه (۳۰٪ - وصول‌شده):</strong></td>
              <td style="text-align: left; font-size:11.5px;">${(invoice.downpaymentAmount || Math.round(invoice.totalAmount * 0.3)).toLocaleString()} تومان</td>
            </tr>
          </table>

          <div style="font-size: 10px; margin-top: 15px; color: #374151; font-weight: bold;">
            بستر امن تسویه حساب و بازارگاه آرین دیجیتال.
          </div>

          <div class="stamp-box">
            <div class="sig-buyer">
              مهر و امضای خریدار
            </div>
            
            <div class="stamp">
              <div class="stamp-inner">
                <span style="font-size: 7px; color: #2563eb; opacity: 0.8;">مهر رسمی تسویه حساب</span>
                <span class="stamp-title">آرین دیجیتال</span>
                <span style="font-size: 7px; color: #1d4ed8;">شناسه ثبت: ۵۸۱۹۴</span>
                <span style="font-size: 5.5px; border-radius: 3px; padding: 2px 4px; font-weight: bold; mt-1; display: inline-block; background: #d1fae5; border: 1px solid #10b981; color: #065f46; transform: scale(0.95); font-family: sans-serif;">وصول شد / PAID</span>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadInvoiceHTML = (invoice: MockOrder) => {
    const calculatedBase = Math.round(invoice.totalAmount / 1.1);
    const calculatedVat = invoice.totalAmount - calculatedBase;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>فاکتور رسمی - ${invoice.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;450;700;900&display=swap');
          body {
            font-family: 'Vazirmatn', sans-serif;
            margin: 0;
            padding: 40px;
            background-color: #fcfcfc;
            color: #111827;
          }
          .invoice-box {
            max-width: 900px;
            margin: auto;
            border: 2px solid #2563eb;
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            position: relative;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }
          .title-pishkhan {
            font-size: 20px;
            font-weight: 900;
            color: #1e3a8a;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .metadata-table {
            width: 100%;
            margin-top: 15px;
            border-collapse: collapse;
          }
          .metadata-table td {
            padding: 5px 10px;
            font-size: 11px;
            border: 1px solid #e5e7eb;
            background: #f9fafb;
          }
          .parties-section {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
          }
          .party-card {
            border: 1.5px solid #d1d5db;
            border-radius: 8px;
            padding: 12px;
            background: #fff;
          }
          .party-card h4 {
            margin: 0 0 8px 0;
            color: #2563eb;
            font-size: 13px;
            font-weight: 700;
            border-bottom: 1px dashed #d1d5db;
            padding-bottom: 5px;
          }
          .party-card p {
            margin: 4px 0;
            font-size: 11px;
            line-height: 1.6;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
            font-size: 11.5px;
          }
          .items-table th {
            background-color: #2563eb;
            color: white;
            padding: 8px 10px;
            text-align: right;
            border: 1px solid #2563eb;
          }
          .items-table td {
            border: 1px solid #d1d5db;
            padding: 10px;
          }
          .items-table tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .financials {
            width: 45%;
            margin-right: auto;
            margin-top: 15px;
            border-collapse: collapse;
            font-size: 11px;
          }
          .financials td {
            padding: 6px 10px;
            border: 1px solid #d1d5db;
          }
          .stamp-box {
            position: relative;
            height: 160px;
            margin-top: 25px;
            border-top: 1px dashed #e5e7eb;
            padding-top: 15px;
            display: flex;
            justify-content: space-between;
          }
          .sig-buyer {
            font-size: 11px;
            font-weight: bold;
            margin-top: 30px;
          }
          .stamp {
            width: 140px;
            height: 140px;
            border: 3px double #2563eb;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: #2563eb;
            transform: rotate(-7deg);
            background: rgba(37,99,235,0.02);
            font-weight: bold;
            font-size: 8px;
            line-height: 1.3;
          }
          .stamp-inner {
            border: 1px dashed #2563eb;
            width: 124px;
            height: 124px;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .stamp-title {
            font-weight: 950;
            font-size: 9px;
            color: #1d4ed8;
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="title-pishkhan">
            <span>شرکت مهندسی آرین دیجیتال (مسئولیت محدود)</span>
            <span style="font-size: 13px; color: #6b7280;">صورت‌حساب رسمی فروش کالا و خدمات صنف رایانه</span>
          </div>
          
          <table class="metadata-table">
            <tr>
              <td><strong>شماره فاکتور:</strong> INV-${invoice.id}</td>
              <td><strong>کد پیگیری پیشخوان:</strong> ${invoice.idempotencyKey || 'AD-981240'}</td>
              <td><strong>تاریخ صدور:</strong> ${invoice.createdAt.slice(0, 10)}</td>
            </tr>
            <tr>
              <td><strong>شماره ثبت صنف:</strong> ۵۸۱۹۴</td>
              <td><strong>شناسه ملی شرکت:</strong> ۱۰۳۲۰۰۴۹۱۸۳</td>
              <td><strong>روش پرداخت:</strong> کیف پول داینامیک کلاینت</td>
            </tr>
          </table>

          <div class="parties-section">
            <div class="party-card">
              <h4>مشخصات فروشنده (آرین دیجیتال)</h4>
              <p><strong>نام شخص حقوقی:</strong> شرکت خدمات فناوری اطلاعات آرین دیجیتال</p>
              <p><strong>شناسه ملی:</strong> ۱۰۳۲۰۰۴۹۱۸۳ | <strong>شماره ثبت:</strong> ۵۸۱۹۴</p>
              <p><strong>آدرس کاربری:</strong> تهران، میدان انقلاب، خیابان کارگر شمالی، ساختمان رستاخیز، واحد ۳ غربی</p>
              <p><strong>شماره تلفن:</strong> ۰۲۱-۶۶۵۴۳۲۱۰</p>
            </div>
            
            <div class="party-card">
              <h4>مشخصات خریدار</h4>
              <p><strong>نام کارشناس / مشتری:</strong> ${invoice.customerName || 'مشتری صنف'}</p>
              <p><strong>نوع سفارش:</strong> استقرار درگاه الکترونیک هوایی صنف</p>
              <p><strong>نشانی تحویل:</strong> ثبت سیستمی بر روی کش امن کلاینت</p>
              <p><strong>موبایل خریدار:</strong> ۰۹۱۲۳۴۵۶۷۸۹</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 8%">ردیف</th>
                <th style="width: 45%">شرح خدمات یا کالا</th>
                <th style="width: 12%">تعداد / واحد</th>
                <th style="width: 15%">قیمت واحد (ریال)</th>
                <th style="width: 20%">قیمت کل (تومان)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="text-align: center;">۱</td>
                <td>
                  <strong>${invoice.serviceName}</strong><br>
                  <span style="font-size: 9.5px; color: #4b5563;">جزئیات: ${invoice.instructions}</span>
                </td>
                <td style="text-align: center;">${invoice.quantity} واحد</td>
                <td style="text-align: left; font-family: monospace;">${(Math.round(calculatedBase / invoice.quantity) * 10).toLocaleString()}</td>
                <td style="text-align: left; font-weight: bold;">${invoice.totalAmount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <table class="financials">
            <tr>
              <td><strong>جمع کل خالص (تومان):</strong></td>
              <td style="text-align: left; font-weight: bold;">${calculatedBase.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>مالیات بر ارزش افزوده (۱۰٪):</strong></td>
              <td style="text-align: left; color: #4b5563;">${calculatedVat.toLocaleString()}</td>
            </tr>
            <tr style="background:#f1f5f9; font-weight: bold;">
              <td><strong>مبلغ کل نهایی (به تومان):</strong></td>
              <td style="text-align: left; color: #1e40af; font-size:12px;">${invoice.totalAmount.toLocaleString()}</td>
            </tr>
            <tr style="background:#ecfdf5; font-weight: bold; color: #15803d;">
              <td><strong>مبلغ پیش‌پرداخت بیعانه (۳۰٪ - وصول‌شده):</strong></td>
              <td style="text-align: left; font-size:11.5px;">${(invoice.downpaymentAmount || Math.round(invoice.totalAmount * 0.3)).toLocaleString()} تومان</td>
            </tr>
          </table>

          <div style="font-size: 10px; margin-top: 15px; color: #374151; font-weight: bold;">
            بستر امن تسویه حساب و بازارگاه آرین دیجیتال.
          </div>

          <div class="stamp-box">
            <div class="sig-buyer">
              مهر و امضای خریدار
            </div>
            
            <div class="stamp">
              <div class="stamp-inner">
                <span style="font-size: 7px; color: #2563eb; opacity: 0.8;">مهر رسمی تسویه حساب</span>
                <span class="stamp-title">آرین دیجیتال</span>
                <span style="font-size: 7px; color: #1d4ed8;">شناسه ثبت: ۵۸۱۹۴</span>
                <span style="font-size: 5.5px; border-radius: 3px; padding: 2px 4px; font-weight: bold; mt-1; display: inline-block; background: #d1fae5; border: 1px solid #10b981; color: #065f46; transform: scale(0.95); font-family: sans-serif;">وصول شد / PAID</span>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_AryanDigital_Official_${invoice.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Provider: claims the work and moves status to InProgress
  const providerStartWork = (orderId: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        addAuditLog(`مجری انجام کار: پذیرش و تغییر حالت سفارش ${orderId} به در دست انجام.`, 'event');
        return {
          ...ord,
          status: OrderStatus.InProgress,
          messages: [
            ...ord.messages,
            { sender: 'system', text: 'مراحل کار توسط مجری آغاز گردید و وضعیت به در دست انجام تغییر کرد.', timestamp: 'اکنون' }
          ]
        };
      }
      return ord;
    }));
  };

  // Provider: delivers final work files
  const providerDeliverWork = (orderId: string) => {
    if (!deliverableText) {
      alert('لطفاً آدرس لینک یا متن توضیحات کار تحویلی را وارد کنید.');
      return;
    }

    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        addAuditLog(`تحویل فاز پایانی سفارش ${orderId} توسط مجری.`, 'success');
        addNotification(`مجری سفارش ${orderId} خروجی نهایی کار را پیوست کرد. نظر خود را ثبت کنید.`, 'success');
        return {
          ...ord,
          status: OrderStatus.Delivered,
          deliverables: {
            text: deliverableText,
            fileName: deliverableFile || 'خروجی_طراحی_آرین.zip'
          },
          messages: [
            ...ord.messages,
            { sender: 'system', text: 'مجری فایل نهایی کار را بارگذاری نمود و سفارش را در صف تایید قرار دارد.', timestamp: 'اکنون' },
            { sender: 'provider', text: `فایل تحویل گردید: ${deliverableText}`, timestamp: 'اکنون' }
          ]
        };
      }
      return ord;
    }));

    setDeliverableText('');
  };

  // Customer: Accepts work and rates the Operator
  const handleCompleteAndRate = (orderId: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        addAuditLog(`کاربر سفارش ${orderId} را تایید قطعی کرد. امتیاز ثبت‌شده: ${selectedStars} ستاره.`, 'success');
        return {
          ...ord,
          status: OrderStatus.Completed,
          rating: selectedStars,
          reviewComment: ratingComment || 'با تشکر از همکاری شایسته شما.',
          messages: [
            ...ord.messages,
            { sender: 'system', text: `کاربر تایید تحویل کار را اعلام نمود. پرونده این پروژه بسته و بایگانی شد. نمره: ${selectedStars} ستاره.`, timestamp: 'اکنون' }
          ]
        };
      }
      return ord;
    }));

    setRatingComment('');
  };

  // Send messaging in active orders chat
  const handleSendMessage = () => {
    if (!newMessageText.trim() || !activeSelectedOrderId) return;

    setOrders(prev => prev.map(ord => {
      if (ord.id === activeSelectedOrderId) {
        const newMessage = {
          sender: role === 'customer' ? 'customer' : 'provider' as any,
          text: newMessageText,
          timestamp: new Date().toLocaleTimeString('fa-IR').slice(0, 5)
        };
        addAuditLog(`ارسال پیام چت در فاکتور ${activeSelectedOrderId} توسط ${role === 'customer' ? 'مشتری' : 'مجری'}.`, 'info');
        return {
          ...ord,
          messages: [...ord.messages, newMessage]
        };
      }
      return ord;
    }));

    setNewMessageText('');
  };

  // Get active order from memory
  const activeOrder = orders.find(o => o.id === activeSelectedOrderId) || null;

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    if (currentOrderFilter === 'All') return true;
    return o.status === currentOrderFilter;
  });

  return (
    <div className="space-y-8" dir="rtl">
      {/* Top Controls bar & Role Switcher */}
      <div className="bg-[#161E31] text-slate-200 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm text-lg animate-pulse">آ</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans font-bold text-sm text-indigo-400">میز پلتفرم آزمایشی آرین دیجیتال (Arian Simulator Desktop)</h3>
              {loggedInUser && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full font-sans">
                  کاربر: {loggedInUser}
                </span>
              )}
            </div>
            <p className="font-sans text-[10px] text-slate-400">یکپارچه‌سازی فرآیند سفارش، برآورد هزینه، تصفیه درگاه و ثبت امتیاز</p>
          </div>
        </div>

        {/* Console Switcher Tab */}
        <div className="flex bg-[#0B0F1A] p-1 rounded-xl border border-slate-800 font-sans text-xs font-semibold">
          <button
            id="role-switch-customer"
            onClick={() => setRole('customer')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              role === 'customer' ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>میز مشتری</span>
          </button>
          
          <button
            id="role-switch-provider"
            onClick={() => setRole('provider')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              role === 'provider' ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>میز مجری (طراح/تایپیست)</span>
          </button>

          <button
            id="role-switch-admin"
            onClick={() => setRole('admin')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              role === 'admin' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>پنل ادمین و مالی</span>
          </button>
        </div>
      </div>

      {/* Grid Content based on Selected View Role */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RIGHT AREA: CONSOLES OF SPECIFIC ROLES (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. CUSTOMER ROLE VIEW */}
          {role === 'customer' && (
            <div className="space-y-6">
              
              {/* Service selection card */}
              <div className="bg-[#161E31] border border-slate-800 p-6 rounded-2xl shadow-lg space-y-5">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-white text-sm flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-indigo-400" />
                      <span>ثبت سفارش خدمات آنلاین (جدید)</span>
                    </h3>
                    <p className="font-sans text-[11px] text-slate-400">نوع خدمت خود را مشخص مانیتور تعرفه ریالی کرده و فایل ضمیمه بفرستید</p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-serif text-[10px] font-bold border border-emerald-500/20">
                    قیمت‌ها به تومان
                  </span>
                </div>

                <form onSubmit={handleRegisterOrder} className="space-y-4 font-sans text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    
                    {/* Service Dropdown Selector */}
                    <div className="md:col-span-7 space-y-1.5">
                      <label className="font-bold text-slate-300">نوع خدمت انتخابی:</label>
                      <select
                        id="order-service-select"
                        value={selectedServiceId}
                        onChange={(e) => {
                          setSelectedServiceId(e.target.value);
                          setQuantity(1); // reset qty on change
                        }}
                        className="w-full border border-slate-800 rounded-xl p-2.5 bg-slate-900 text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        {servicesList.map(s => (
                          <option key={s.id} value={s.id}>
                            [{s.category === 'giftcard' ? 'گیفت کارت' : 'امور دیجیتال'}] {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Numeric Quantity Inputs */}
                    <div className="md:col-span-5 space-y-1.5">
                      <label className="font-bold text-slate-300">
                        {currentSelectedService.pricingType === 'page' && 'تعداد صفحات:'}
                        {currentSelectedService.pricingType === 'sample' && 'تعداد اتود/نمونه:'}
                        {currentSelectedService.pricingType === 'dollar' && 'مقدار دلار درخواستی:'}
                        {currentSelectedService.pricingType === 'meter' && 'مساحت کل به متر مربع:'}
                        {currentSelectedService.pricingType === 'fixed' && 'تعداد واحد سفارش:'}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          id="order-quantity-input"
                          type="number"
                          min={currentSelectedService.minQty || 1}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(currentSelectedService.minQty || 1, parseInt(e.target.value) || 1))}
                          className="w-full border border-slate-800 rounded-xl p-2.5 text-center text-white bg-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-gray-400 shrink-0 select-none">
                          {currentSelectedService.pricingType === 'page' && 'صفحه'}
                          {currentSelectedService.pricingType === 'sample' && 'اتود'}
                          {currentSelectedService.pricingType === 'dollar' && 'دلار'}
                          {currentSelectedService.pricingType === 'meter' && 'متر مربع'}
                          {currentSelectedService.pricingType === 'fixed' && 'واحد'}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Active calculation info block */}
                  <div className="bg-[#0B0F1A] border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400">فرمول محاسبه قیمت خدمت:</span>
                      <p className="text-slate-300 text-[11px]">
                        نرخ پایه واحد: <strong className="text-white font-bold">{currentSelectedService.basePrice.toLocaleString()}</strong> تومان ({
                          currentSelectedService.pricingType === 'page' ? 'هر صفحه' :
                          currentSelectedService.pricingType === 'sample' ? 'هر نمونه' :
                          currentSelectedService.pricingType === 'dollar' ? 'قیمت بر مبنای ۱۰ دلار' : 
                          currentSelectedService.pricingType === 'meter' ? 'هر متر مربع' : 'نرخ ثابت پروژه'
                        })
                      </p>
                    </div>
                    {currentSelectedService.category === 'giftcard' && (
                      <span className="bg-indigo-650 text-indigo-400 px-2 rounded font-sans text-[10px] py-0.5 border border-indigo-500/20">شارژ خودکار زیر ۵ دقیقه</span>
                    )}
                    <div className="text-left font-sans">
                      <span className="text-[10px] text-slate-400 block">جمع کل برآورد فاکتور:</span>
                      <strong className="text-indigo-400 text-lg font-extrabold">{getCalculatedPrice().toLocaleString()}</strong>
                      <span className="text-slate-450 text-[10px] mr-1">تومان</span>
                    </div>
                  </div>

                  {/* Text Instruction Area */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">توضیحات و دستورالعمل‌های کار برای طراح/اپراتور:</label>
                    <textarea
                      id="order-instructions-textarea"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="رنگ‌بندی مد نظر، ابعاد دلخواه، سبک طراحی یا فایل‌های منبع الگو را قید نمایید..."
                      rows={3}
                      className="w-full border border-slate-800 rounded-xl p-2.5 bg-slate-900 text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Interactive Drag & Drop File Upload Zone */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300">بارگذاری فایل‌های ضمیمه و اسناد اولیه (محدودیت ۱۰۰ مگابایت):</label>
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                        dragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
                      }`}
                    >
                      <input 
                        id="file-selector-input"
                        type="file" 
                        multiple 
                        onChange={handleFileSelect}
                        className="hidden" 
                      />
                      <label htmlFor="file-selector-input" className="cursor-pointer block space-y-2">
                        <FileUp className="w-8 h-8 text-gray-400 mx-auto" />
                        <div className="text-[11px] text-slate-400 font-sans">
                          فایل بریف یا جزئیات خود را به داخل این کادر <span className="text-indigo-400 font-bold">بکشید و رها کنید</span> یا کلیک کنید تا فایل انتخاب شود.
                        </div>
                        <span className="text-[9px] text-gray-500 block">انواع فرمت‌های مجاز: PDF, JPEG, PNG, ZIP, DOCX</span>
                      </label>
                    </div>

                    {/* Show already attached queue */}
                    {uploadedFiles.length > 0 && (
                      <div className="bg-[#0B0F1A] border border-slate-800 rounded-xl p-2.5 space-y-1">
                        <span className="text-[10px] text-slate-400 block font-bold">فایل‌های ضمیمه‌شده آماده ارسال:</span>
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-900 border border-slate-800 rounded p-1.5">
                            <span className="text-slate-300 truncate max-w-[200px]">{file.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 text-[10px] font-mono">{file.size}</span>
                              <button 
                                type="button"
                                onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                                className="text-red-400 hover:text-red-300 pointer-events-auto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    id="btn-submit-order-form"
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/10 text-sm cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 ml-1" />
                    <span>تایید فاکتور و ایجاد سفارش در انتظار تسویه</span>
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* 2. PROVIDER (OPERATOR / DESIGNER) ROLE VIEW */}
          {role === 'provider' && (
            <div className="space-y-6">
              
              <div className="bg-[#161E31] border border-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="font-sans font-bold text-white text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4 text-indigo-400" />
                    <span>میزکار هدایت و تحویل سفارشات طراحان و اپراتورها</span>
                  </h3>
                  <p className="font-sans text-[11px] text-slate-400">سفارشاتی که برای شما تخصیص داده شده را انجام داده و کدهای تحویلی یا فایل‌های زیپ را بفرستید</p>
                </div>

                {activeOrder ? (
                  <div className="space-y-5 text-sans text-xs">
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-450">درحال بررسی سفارش شماره:</span>
                        <strong className="text-white font-bold block">{activeOrder.id} ({activeOrder.serviceName})</strong>
                      </div>
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-indigo-500/10 text-indigo-400 border border-[#6366f1]/20">
                        مشتری: {activeOrder.customerName}
                      </span>
                    </div>

                    {/* Operational Actions conditional based on order status */}
                    <div className="bg-slate-900/40 p-4 rounded-xl border border-dashed border-slate-800 space-y-4">
                      <span className="font-bold text-slate-300 block text-[11px]">عملیات مورد نیاز روی سفارش:</span>
                      
                      {activeOrder.status === OrderStatus.Paid && (
                        <div className="space-y-2">
                          <p className="text-slate-300">این کار تسویه شده است. بلافاصله باید مرحله انجام کار را تایید و کار روی سفارش را آغاز بفرمایید.</p>
                          <button
                            id="btn-provider-claim"
                            onClick={() => providerStartWork(activeOrder.id)}
                            className="bg-indigo-600 hover:bg-indigo-550 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 ml-1" />
                            <span>تایید شروع فرآیند انجام کار پروژه</span>
                          </button>
                        </div>
                      )}

                      {activeOrder.status === OrderStatus.InProgress && (
                        <div className="space-y-3.5">
                          <p className="text-slate-300">پروژه هم‌اکنون در دست انجام است. پس از آماده شدن متریال نهایی، آدرس دانلود فایل تحویلی یا اطلاعات گیفت‌کارت را در کادر زیر وارد کنید.</p>
                          
                          <div className="space-y-1.5">
                            <label className="font-bold text-slate-400 text-[10px]">لینک دانلود خروجی کار (مثلا گوگل درایو یا پیوست S3):</label>
                            <input
                              id="input-provider-deliverable-text"
                              type="text"
                              value={deliverableText}
                              onChange={(e) => setDeliverableText(e.target.value)}
                              placeholder="https://s3.arian.digital/deliverables/AD-9418_final.zip"
                              className="w-full border border-slate-800 rounded-xl p-2 font-mono text-[11px] text-white bg-slate-900 focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-bold text-slate-400 text-[10px]">نام فایل خروجی:</label>
                            <input
                              id="input-provider-deliverable-file"
                              type="text"
                              value={deliverableFile}
                              onChange={(e) => setDeliverableFile(e.target.value)}
                              placeholder="آذرخش_لوگو_وکتور.zip"
                              className="w-full border border-slate-800 rounded-xl p-2 font-mono text-[11px] text-white bg-slate-900 focus:outline-none focus:border-indigo-500"
                            />
                          </div>

                          <button
                            id="btn-provider-submit-deliver"
                            onClick={() => providerDeliverWork(activeOrder.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
                          >
                            <FileDown className="w-4 h-4 ml-1" />
                            <span>ارسال رسمی فایل خروجی و اعلام تحویل کار</span>
                          </button>
                        </div>
                      )}

                      {activeOrder.status === OrderStatus.Delivered && (
                        <p className="text-slate-500">فایل کار با موفقیت ارسال گردید. اکنون در انتظار بررسی، تایید نهایی و امتیازدهی توسط مشتری است.</p>
                      )}

                      {activeOrder.status === OrderStatus.Completed && (
                        <div className="space-y-2">
                          <div className="bg-emerald-50 text-emerald-900 p-3 rounded-lg border border-emerald-100 flex items-center justify-between">
                            <span>این سفارش نهایی شده و وجه آن آزاد شده است.</span>
                            <span className="font-bold text-indigo-700">امتیاز: {activeOrder.rating} ستاره</span>
                          </div>
                          {activeOrder.reviewComment && (
                            <p className="text-slate-500 italic">" {activeOrder.reviewComment} "</p>
                          )}
                        </div>
                      )}

                      {activeOrder.status === OrderStatus.PendingPayment && (
                        <p className="text-slate-400">سفارش ثبت شده اما هنور پرداخت نشده است. پس از پرداخت موفقیت‌آمیز مشتری، فعال خواهد شد.</p>
                      )}

                    </div>
                  </div>
                ) : (
                  <div className="py-12 bg-slate-50 rounded-xl border border-dashed text-center text-slate-400 text-xs font-sans">
                    سفارشی از لیست سفارشات سمت چپ انتخاب کنید تا عملیات مجری را مانیتور کنید.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 3. ADMIN PANEL VIEW */}
          {role === 'admin' && (
            <div className="space-y-6 font-sans text-xs">
              
              {/* Dynamic Analytics dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#161E31] border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-slate-450 text-[10px] block">درآمد کل فاکتورها</span>
                    <strong className="text-white text-lg font-bold">{orders.filter(o => o.status === OrderStatus.Completed || o.status === OrderStatus.Paid || o.status === OrderStatus.InProgress || o.status === OrderStatus.Delivered).reduce((acc, current) => acc + current.totalAmount, 0).toLocaleString()}</strong>
                    <span className="text-slate-400 text-[10px] mr-1">تومان</span>
                  </div>
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#161E31] border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-slate-450 text-[10px] block">کل سفارشات فعال</span>
                    <strong className="text-white text-lg font-bold">
                      {orders.filter(o => o.status !== OrderStatus.Draft && o.status !== OrderStatus.Cancelled && o.status !== OrderStatus.Completed).length}
                    </strong>
                    <span className="text-slate-400 text-[10px] mr-1">سفارش</span>
                  </div>
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 border border-amber-500/20">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-[#161E31] border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-slate-450 text-[10px] block">مجریان و کادر فنی</span>
                    <strong className="text-white text-lg font-bold">۱۳ نفر</strong>
                    <span className="text-slate-400 text-[10px] mr-1">رتبه فعال</span>
                  </div>
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Dynamic Price Editor */}
              <div className="bg-[#161E31] border border-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="font-sans font-bold text-white text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span>تعدیل و تغییر پویای نرخ خدمات (صنف آرین)</span>
                  </h3>
                  <p className="font-sans text-[11px] text-slate-400">تغییر زنده به همراه ضریب استقرار روی فرمول فاکتور به بهای ریالی تومانی</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6 space-y-1">
                    <label className="font-bold text-slate-300">انتخاب خدمت برای ویرایش:</label>
                    <select
                      id="admin-service-edit-select"
                      value={selectedAdminServiceId}
                      onChange={(e) => selectAdminService(e.target.value)}
                      className="w-full border border-slate-800 p-2.5 rounded-xl bg-slate-900 text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {servicesList.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-6 space-y-1">
                    <label className="font-bold text-slate-300">نرخ پایه واحد جدید (تومان):</label>
                    <div className="flex gap-2">
                      <input
                        id="admin-price-edit-input"
                        type="number"
                        value={adminServicePrice}
                        onChange={(e) => setAdminServicePrice(parseInt(e.target.value) || 0)}
                        className="w-full border border-slate-800 p-2.5 rounded-xl font-bold bg-slate-900 text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        id="btn-admin-save-price"
                        onClick={handleUpdateAdminPrice}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 rounded-xl transition-colors shrink-0 cursor-pointer"
                      >
                        ثبت فاکتور قیمت
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-emerald-400 text-[10px] leading-relaxed">
                  طراحی پویای معماری کلاینت-سرور برای پلتفرم آرین به نحوی است که با ثبت تغییرات قیمت، فرمول‌های محاسبه سفارشات جدید در میز کلاینت بلافاصله و با رعایت کامل قواعد اصالت‌سنجی تراکنش مالی در بک‌اند بروزرسانی همزمان خواهند شد.
                </div>
              </div>

            </div>
          )}

          {/* ACTIVE SELECTED ORDER DETAIL AND LIFECYCLE (Visible to Customers/Providers on click selection) */}
          {role !== 'admin' && activeOrder && (
            <div className="bg-[#161E31] border border-slate-800 p-6 rounded-2xl shadow-lg space-y-6 text-xs font-sans text-white">
              
              {/* Order Meta row */}
              <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-3 gap-2">
                <div>
                  <span className="text-slate-400 text-[9px] block">جزئیات سفارش فاکتور:</span>
                  <strong className="text-white text-sm font-extrabold">{activeOrder.serviceName} ({activeOrder.id})</strong>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-3 py-1 rounded-full border text-[10px] font-bold ${ORDER_STATUS_LABELS[activeOrder.status].color}`}>
                    {ORDER_STATUS_LABELS[activeOrder.status].fa}
                  </span>
                  {activeOrder.status === OrderStatus.PendingPayment && role === 'customer' && (
                    <button
                      id={`btn-pay-order-${activeOrder.id}`}
                      onClick={() => triggerPaymentPortal(activeOrder)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5 ml-0.5" />
                      <span>پرداخت فاکتور</span>
                    </button>
                  )}

                  {/* Official printable invoice download with signature stamp */}
                  <button
                    onClick={() => {
                      setSelectedInvoiceOrder(activeOrder);
                      setIsInvoiceModalOpen(true);
                    }}
                    className="bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 text-indigo-300 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-[11px] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>فاکتور رسمی مهر شده</span>
                  </button>
                </div>
              </div>

              {/* Order Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] bg-slate-900 border border-slate-800 p-4 rounded-xl leading-relaxed text-slate-350">
                <div className="space-y-1.5">
                  <p className="text-slate-300">
                    <span className="text-slate-450 ml-1">تعداد واحد کار:</span>
                    <strong className="text-white font-bold">{activeOrder.quantity}</strong>
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-450 ml-1">هزینه محاسبه‌شده:</span>
                    <strong className="text-amber-400 font-extrabold">{activeOrder.totalAmount.toLocaleString()}</strong> تومان
                  </p>
                  <p className="text-slate-300">
                    <span className="text-emerald-400 font-bold ml-1">۳۰٪ بیعانه قانونی:</span>
                    <strong className="text-emerald-400 font-extrabold">{(activeOrder.downpaymentAmount || Math.round(activeOrder.totalAmount * 0.3)).toLocaleString()}</strong> تومان (مصوبه ۱۴۰۵)
                  </p>
                  <p className="text-slate-300">
                    <span className="text-slate-450 ml-1">مجری طرح:</span>
                    <strong className="text-white font-bold">{activeOrder.providerName}</strong>
                  </p>
                </div>
                
                <div className="space-y-1.5 md:border-r md:pr-4 md:border-slate-800 border-t pt-3 md:pt-0 rtl:border-r-0 rtl:border-l rtl:pl-4">
                  <p className="text-slate-200 font-medium block">توضیحات و بریف پیوست:</p>
                  <p className="text-slate-400 italic max-h-[80px] overflow-y-auto leading-normal">
                    " {activeOrder.instructions} "
                  </p>
                </div>
              </div>

              {/* Payment Success & PDF Invoice download option container */}
              {activeOrder.status !== OrderStatus.PendingPayment && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-right">
                  <div className="space-y-1">
                    <span className="font-bold block text-sm">✓ تراکنش موفق و تایید ۳۰٪ بیعانه قانونی</span>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed">
                      پیش‌پرداخت بیعانه سفارش به مبلغ <strong className="text-white font-mono text-xs">{(activeOrder.downpaymentAmount || Math.round(activeOrder.totalAmount * 0.3)).toLocaleString()}</strong> تومان با دریافت کد ایمن همپایی از درگاه تسویه صادر گردید. نسخه دیجیتال و فیزیکی فاکتور رسمی از دکمه زیر به صورت PDF و چاپ آماده دریافت است.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <button
                      onClick={() => triggerPrintInvoice(activeOrder)}
                      className="bg-[#10b981] hover:bg-emerald-500 text-slate-950 font-sans text-[11px] font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-950" />
                      <span>خروجی PDF / پرینت فاکتور</span>
                    </button>
                    <button
                      onClick={() => downloadInvoiceHTML(activeOrder)}
                      className="bg-[#121c2c] hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-sans text-[11px] font-black px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>دانلود فاکتور (HTML)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STAGES MONITOR (Visual State Tracker) */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 tracking-wider">نوار وضعیت لایف‌سایکل سفارش (Automation Route):</span>
                <div className="flex items-center justify-between overflow-x-auto py-3 px-1 bg-slate-950 border border-slate-800 rounded-xl">
                  {[
                    { st: OrderStatus.PendingPayment, label: 'در انتظار پرداخت' },
                    { st: OrderStatus.Paid, label: 'پرداخت اصیل' },
                    { st: OrderStatus.InProgress, label: 'در دست کار' },
                    { st: OrderStatus.Delivered, label: 'تحویل کار' },
                    { st: OrderStatus.Completed, label: 'کامل شده' }
                  ].map((step, idx, arr) => {
                    const statuses = arr.map(a => a.st);
                    const currentIdx = statuses.indexOf(activeOrder.status);
                    const thisIdx = statuses.indexOf(step.st);
                    
                    const isPassed = thisIdx <= currentIdx || activeOrder.status === OrderStatus.Completed;
                    const isCurrent = activeOrder.status === step.st;

                    return (
                      <React.Fragment key={step.st}>
                        <div className="flex flex-col items-center min-w-[70px] shrink-0">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm ${
                            isCurrent ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' :
                            isPassed ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {isPassed ? '✓' : idx + 1}
                          </div>
                          <span className={`text-[9px] mt-1.5 font-sans font-bold ${
                            isCurrent ? 'text-amber-400' :
                            isPassed ? 'text-emerald-500' : 'text-slate-500'
                          }`}>{step.label}</span>
                        </div>
                        {idx < arr.length - 1 && (
                          <div className={`h-[1.5px] flex-1 min-w-[15px] ${
                            thisIdx < currentIdx ? 'bg-emerald-500/80' : 'bg-slate-800'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* RATING ZONE (If delivered, client rates) */}
              {activeOrder.status === OrderStatus.Delivered && role === 'customer' && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 space-y-3.5 animate-pulse text-emerald-100">
                  <div>
                    <h4 className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>تایید رسمی خروجی و اعلام کارایی سفارش</span>
                    </h4>
                    <p className="text-[10px] text-emerald-300">طراح فایل را به صورت رسمی فرستاده است. با ثبت امتیاز، تایید قطعی کار را صادر کنید.</p>
                  </div>

                  {activeOrder.deliverables && (
                    <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <FileDown className="w-4 h-4 text-emerald-400" />
                        <span>پیوست خروجی: {activeOrder.deliverables.fileName}</span>
                      </div>
                      <a 
                        href="#download" 
                        onClick={(e) => { e.preventDefault(); alert(`شبیه‌سازی دانلود خروجی: ${activeOrder.deliverables?.text}`); }}
                        className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-0.5 text-[10px]"
                      >
                        <Download className="w-3.5 h-3.5 ml-0.5" />
                        <span>دانلود دلیوربل</span>
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className="font-bold">امتیاز به طراح:</span>
                      {[1, 2, 3, 4, 5].map(stars => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setSelectedStars(stars)}
                          className="focus:outline-none"
                        >
                          <Star className={`w-5 h-5 transition-transform hover:scale-110 cursor-pointer ${
                            selectedStars >= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`} />
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 flex gap-2 w-full">
                      <input
                        id="rating-comment-input"
                        type="text"
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        placeholder="متن کوتاه تشویق یا اصلاح کار طراح..."
                        className="w-full border border-slate-800 rounded-xl p-2 bg-slate-950 text-white text-[11px] focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        id="btn-complete-quality-rate"
                        onClick={() => handleCompleteAndRate(activeOrder.id)}
                        className="bg-[#24966d] hover:bg-emerald-500 text-white font-bold px-4 rounded-xl shrink-0 whitespace-nowrap cursor-pointer transition-colors"
                      >
                        دریافت و تکمیل نهایی
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE ORDER CHAT PANEL */}
              <div className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 space-y-4">
                <span className="font-bold text-slate-300 flex items-center gap-2 text-[10px]">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>گفتگوی بلادرنگ با مجری/مشتری (Order Workspace)</span>
                </span>

                {/* Messages List mapping */}
                <div className="space-y-4 max-h-[160px] overflow-y-auto pr-1">
                  {activeOrder.messages.map((msg, i) => {
                    const isSystem = msg.sender === 'system';
                    const isMe = (role === 'customer' && msg.sender === 'customer') || (role === 'provider' && msg.sender === 'provider');
                    
                    if (isSystem) {
                      return (
                        <div key={i} className="text-center py-1">
                          <span className="bg-slate-850 border border-slate-800 text-slate-400 text-[9px] px-2.5 py-0.5 rounded-full font-sans">
                            {msg.text}
                          </span>
                        </div>
                      );
                    }

                    if (msg.text.startsWith('[DELIVERY_MAP]::')) {
                      let delivery: any;
                      try {
                        delivery = JSON.parse(msg.text.split('[DELIVERY_MAP]::')[1]);
                      } catch (e) {
                        return <div key={i} className="text-xs text-red-400 text-center">خطا در پارس اطلاعات ترابری</div>;
                      }

                      // Get current state step for this specific delivery ID, defaults to 0 (searching)
                      const stepIdx = deliveryTrackerSteps[delivery.id] !== undefined ? deliveryTrackerSteps[delivery.id] : 0;
                      const hasCourierPassed = (step: number) => stepIdx >= step;

                      // Simulated delivery status titles
                      const statuses = [
                        { text: 'در حال پذیرش سفیر...', desc: 'سیستم ترابری در حال ارتباط با سرورهای پیک صنف است.' },
                        { text: 'سفیر سفارشی پذیرفت 🛵', desc: 'کاپیتان رضا کریمی (موتور سیکلت هوندا ۱۲۵) بریف کار فیزیکی را متعهد شد.' },
                        { text: 'پیک در حال تحویل مرسوله فیزیکی', desc: 'بسته فیزیکی کلاینت از هاب صنف مرکزی خارج گشت.' },
                        { text: 'تحویل با موفقیت قطعی شد ✅', desc: 'سفیر با تایید دریافت کلاینت، کارگزاری را به انجام رساند.' }
                      ];

                      const advanceStep = () => {
                        if (stepIdx < 3) {
                          setDeliveryTrackerSteps(prev => ({
                            ...prev,
                            [delivery.id]: stepIdx + 1
                          }));
                          addAuditLog(`تغییر فاز ترانسپورت پیک #${delivery.id} به گام ${stepIdx + 2}`, 'success');
                        }
                      };

                      return (
                        <div key={i} className="bg-[#121c2c] border border-slate-800 p-4 rounded-3xl space-y-3.5 my-3 text-right relative overflow-hidden shadow-xl animate-in fade-in duration-200">
                          {/* Courier logo */}
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] text-white ${
                                delivery.courier === 'snapp' ? 'bg-emerald-500' : 'bg-orange-500'
                              }`}>
                                {delivery.courier === 'snapp' ? 'S' : 'T'}
                              </div>
                              <span className="text-white font-extrabold text-[11px] font-sans">
                                {delivery.courier === 'snapp' ? 'هماهنگی پیک موتوری اسنپ باکس' : 'هماهنگی ترابری سواری تپ‌سی پیک'}
                              </span>
                            </div>
                            <span className="text-[9px] text-[#818CF8] bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg font-mono font-bold">
                              {delivery.id}
                            </span>
                          </div>

                          {/* Address Info and Estimates */}
                          <div className="grid grid-cols-2 gap-3 text-[10px] bg-slate-900 border border-slate-850 p-2 rounded-2xl">
                            <div>
                              <span className="text-slate-400 block pb-0.5">آدرس ثبت‌شده:</span>
                              <strong className="text-slate-200 font-bold block truncate" title={delivery.address}>{delivery.address}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block pb-0.5">مسافت و مدت:</span>
                              <strong className="text-amber-400 font-bold block">{delivery.distance} کیلومتر (~{delivery.duration} دقیقه)</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block pb-0.5">تعرفه پیک صنف:</span>
                              <strong className="text-emerald-400 font-extrabold block">{delivery.fee.toLocaleString()} تومان</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 block pb-0.5">تحویل‌گیرنده:</span>
                              <strong className="text-slate-200 font-bold block">{delivery.recipientName}</strong>
                            </div>
                          </div>

                          {/* Dotted path route simulator (mini preview map) */}
                          <div className="bg-[#0b0f1a] border border-slate-850 p-2.5 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center h-16">
                            <div className="absolute inset-x-0 h-[1.5px] bg-dashed border-t border-dashed border-slate-800" />
                            <div className="flex items-center justify-between w-full relative z-10 px-8">
                              {/* Office Origin */}
                              <div className="flex flex-col items-center">
                                <div className="w-3.5 h-3.5 bg-indigo-600 rounded-full flex items-center justify-center ring-4 ring-indigo-900/40">
                                  <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                                <span className="text-[8px] text-slate-500 block">مرکز آرین</span>
                              </div>

                              {/* Path with courier logo moving */}
                              <div className="flex-1 relative flex items-center justify-center">
                                <motion.div 
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] shadow-md border ${
                                    delivery.courier === 'snapp' ? 'bg-emerald-500 border-emerald-400' : 'bg-orange-500 border-orange-400'
                                  }`}
                                  animate={{ 
                                    x: stepIdx === 0 ? 40 : stepIdx === 1 ? 15 : stepIdx === 2 ? -15 : -40 
                                  }}
                                  transition={{ type: 'spring', damping: 15 }}
                                >
                                  🛵
                                </motion.div>
                              </div>

                              {/* Destination */}
                              <div className="flex flex-col items-center">
                                <div className="w-3.5 h-3.5 bg-rose-500 rounded-full flex items-center justify-center ring-4 ring-rose-950/40">
                                  <div className="w-1 h-1 bg-white rounded-full" />
                                </div>
                                <span className="text-[8px] text-slate-500 block truncate max-w-[65px]">{delivery.address.split('،')[1] || 'لوکیشن مقصد'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Tracker Stepper */}
                          <div className="space-y-1.5 font-sans">
                            <div className="flex items-center justify-between text-[9px]">
                              <span className="text-slate-400">وضعیت گام:</span>
                              <strong className={`${delivery.courier === 'snapp' ? 'text-emerald-400' : 'text-orange-400'}`}>{statuses[stepIdx].text}</strong>
                            </div>
                            <div className="grid grid-cols-4 gap-1.5">
                              {statuses.map((st, sId) => (
                                <div key={sId} className="space-y-1">
                                  <div className={`h-1.5 rounded-full ${hasCourierPassed(sId) ? (delivery.courier === 'snapp' ? 'bg-emerald-500' : 'bg-orange-500') : 'bg-slate-800'}`} />
                                  <span className={`text-[8px] block text-center font-sans ${stepIdx === sId ? 'text-white font-bold' : 'text-slate-500'}`}>
                                    {sId === 0 ? 'مسیریابی' : sId === 1 ? 'سفیر' : sId === 2 ? 'تحویل‌بار' : 'تحویل کلاینت'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Driver intercom mock dialog */}
                          <div className="bg-[#121c2c] border border-slate-800 p-2 rounded-xl text-[9px] text-slate-300 leading-relaxed font-sans block">
                            {stepIdx === 0 && '💬 سیستم: درخواست پیک برای وب‌سرویس فیزیکی صادر شد...'}
                            {stepIdx === 1 && '💬 رضا کریمی (پیک): سلام، سفارش فیزیکی شما پذیرش شد. تا ۵ دقیقه دیگز مبدا هستم.'}
                            {stepIdx === 2 && '💬 رضا کریمی (پیک): بار فیزیکی کاتالوگ/دفترچه را تحویل گرفتم. در مسیر به سمت آدرس شما هستم.'}
                            {stepIdx === 3 && '💬 سیستم: تحویل نهایی فیزیکی مرسوله تایید شد. از حسن تراکنش شما سپاسگزاریم.'}
                          </div>

                          {/* Advance step simulator trigger */}
                          {stepIdx < 3 && (
                            <button
                              id={`btn-advance-delivery-${delivery.id}`}
                              type="button"
                              onClick={advanceStep}
                              className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white font-bold text-[9px] py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <span>🚀 پیشروی پیک راننده (تست لایو نقشه)</span>
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div key={i} className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}>
                        <div className={`p-2.5 rounded-xl max-w-[80%] inline-block text-right ${
                          isMe 
                            ? 'bg-amber-500 text-slate-950 rounded-tr-none font-medium shadow-md' 
                            : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                        }`}>
                          <p className="text-[11px] leading-normal">{msg.text}</p>
                          <span className="text-[8px] text-slate-400 block text-left mt-1">{msg.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick actions row for physical coordination */}
                <div className="flex flex-wrap gap-2.5 items-center justify-between border-t border-slate-800/80 pt-2.5">
                  <span className="text-[10px] text-slate-400 font-sans">امکانات هماهنگی و ارسال مرسوله فیزیکی:</span>
                  <button
                    id="btn-open-map-selector"
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-[10px] font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Map className="w-3.5 h-3.5 text-indigo-400" />
                    <span>📍 ارسال موقعیت با پیک اسنپ / تپ‌سی (نقشه)</span>
                  </button>
                </div>

                {/* Chat Inputs */}
                <div className="flex gap-2.5">
                  <input
                    id="chat-message-input"
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="پیام خود را تایپ کنید و بفرستید..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full border border-slate-800 rounded-xl p-2.5 bg-slate-950 text-white focus:outline-none focus:border-indigo-500 text-[11px]"
                  />
                  <button
                    id="btn-send-chat-msg"
                    onClick={handleSendMessage}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 transform rotate-180" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* LEFT AREA: ORDERS DIRECTORY AND AUDIT LOGS (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* My Orders directories (Search and Filter) */}
          <div className="bg-[#161E31] border border-slate-800 p-4 rounded-2xl shadow-lg space-y-3.5">
            <span className="font-bold text-white block text-xs font-sans">فهرست سفارشات فعال پلتفرم</span>
            
            {/* Filter tags panel */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-thin text-[9px] font-bold font-sans">
              {[
                { st: 'All', fa: 'همه' },
                { st: OrderStatus.PendingPayment, fa: 'منتظر مالی' },
                { st: OrderStatus.InProgress, fa: 'دردست‌کار' },
                { st: OrderStatus.Delivered, fa: 'تحویلی' },
                { st: OrderStatus.Completed, fa: 'کامل‌شده' }
              ].map(tag => (
                <button
                  key={tag.st}
                  onClick={() => setCurrentOrderFilter(tag.st as any)}
                  className={`px-2 py-1 rounded-full whitespace-nowrap transition-colors border cursor-pointer ${
                    currentOrderFilter === tag.st
                      ? 'bg-indigo-600 border-indigo-650 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  {tag.fa}
                </button>
              ))}
            </div>

            {/* Orders actual mapping elements */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(ord => (
                  <button
                    key={ord.id}
                    onClick={() => setActiveSelectedOrderId(ord.id)}
                    className={`w-full text-right p-3 rounded-xl border transition-all text-xs flex flex-col gap-2 cursor-pointer ${
                      activeSelectedOrderId === ord.id 
                        ? 'bg-slate-900/85 border-indigo-500 shadow-lg ring-1 ring-indigo-550/30' 
                        : 'bg-slate-900/25 border-slate-800 w-full hover:bg-[#1a253c]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <strong className="text-white font-bold font-sans">{ord.id}</strong>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${ORDER_STATUS_LABELS[ord.status].color}`}>
                        {ORDER_STATUS_LABELS[ord.status].fa}
                      </span>
                    </div>

                    <p className="text-slate-350 font-medium truncate w-full text-[11px] font-sans text-right">{ord.serviceName}</p>

                    <div className="flex items-center justify-between w-full text-[10px] text-slate-450 font-mono pt-1 border-t border-slate-800/60">
                      <span>{ord.totalAmount.toLocaleString()} تومان</span>
                      <span className="font-sans">مشتری: {ord.customerName.slice(0, 7)}...</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-xl text-slate-500 text-[10px] font-sans">
                  هیچ فاکتوری با شرایط فیلتر واکشی نشد.
                </div>
              )}
            </div>
          </div>

          {/* Live System Logging Desk */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[10px] font-mono shadow-sm">
            <span className="text-amber-500 font-bold block pb-2 border-b border-slate-800 mb-2 font-sans flex items-center justify-between">
              <span>مونیتورینگ ممیزی و تراکنش‌های امنیتی</span>
              <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-sans uppercase">Live Logs</span>
            </span>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto ltr text-left pr-1" dir="ltr">
              {auditLogs.map((log, i) => (
                <div key={i} className="text-left font-mono text-[9px] leading-relaxed text-zinc-400">
                  <span className="text-zinc-600 font-bold">[{log.timestamp}]</span>{' '}
                  <span className={`${
                    log.type === 'event' ? 'text-amber-400 font-bold' :
                    log.type === 'calc' ? 'text-sky-400' :
                    log.type === 'success' ? 'text-emerald-400' : 'text-zinc-300'
                  }`}>{log.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Platform notifications center widget */}
          <div className="bg-[#161E31] border border-slate-800 p-4 rounded-xl shadow-lg text-xs font-sans text-white">
            <span className="font-bold text-slate-200 block pb-1.5 border-b border-slate-800 mb-2 flex items-center gap-1">
              <Bell className="w-3.5 h-3.5 text-indigo-400" />
              <span>اعلانات فوری سیستم (Notifications Router)</span>
            </span>
            <div className="space-y-2 max-h-[100px] overflow-y-auto">
              {notifications.map(notif => (
                <p key={notif.id} className="text-slate-400 text-[10px] leading-normal border-l-2 border-indigo-500 pl-2 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-2">
                  {notif.text}
                </p>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SHAPARAK SAMAN BANK PAYMENT MODAL SIMULATOR */}
      {isGatewayOpen && payingOrderId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 transition-opacity" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Saman Gateway Header */}
            <div className="bg-[#121c2c] border-b border-slate-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center font-bold text-white text-base">س</div>
                <div>
                  <h4 className="font-extrabold text-xs text-white">درگاه الکترونیک بانک سامان (سامان‌کیش)</h4>
                  <span className="text-[9px] text-[#2c7cb0] block uppercase font-mono tracking-wider">Saman Electronic Payment Gateway</span>
                </div>
              </div>
              <span className="text-[10px] bg-red-500/15 text-red-400 px-2.5 py-0.5 rounded font-sans uppercase">اتصال امن SSL</span>
            </div>

            {/* Gateway form body */}
            <div className="p-6 space-y-4 font-sans text-xs">
              
              {/* Idempotent Key visualization */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 text-[10px] space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>امضای رمزگذاری‌شده ضد پرداخت تکراری (Idempotency Key):</span>
                </div>
                <p className="font-mono text-slate-400 uppercase text-[9px]">
                  {orders.find(o => o.id === payingOrderId)?.idempotencyKey || 'No Idempotency Key'}
                </p>
                <span className="text-[8px] text-gray-500 block">
                  * تضمین ایمن بانک: با قطع مکرر شتاب، این کلید تضمین می‌کند هزینه مضاعف از کارت شما کسر نگردد.
                </span>
              </div>

              {/* Billing Info */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-normal">
                <div>
                  <span className="text-zinc-500 text-[10px] block font-bold">پذیرنده وب صنف:</span>
                  <strong className="text-slate-200 font-bold">شرکت آرین دیجیتال</strong>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block font-bold">مبلغ قابل کسر تصفیه:</span>
                  <strong className="text-amber-400 text-sm font-extrabold">
                    {orders.find(o => o.id === payingOrderId)?.totalAmount.toLocaleString() || 0}
                  </strong>
                  <span className="text-[9px] text-zinc-400 mr-0.5">تومان</span>
                </div>
              </div>

              {/* Dynamic Wallet Fast Checkout option */}
              <div className="bg-[#12231c] border border-emerald-500/20 rounded-xl p-3.5 space-y-2 text-right">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[10px] text-emerald-450 flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>روش نوین: پرداخت از کیف پول داینامیک</span>
                  </span>
                  <span className="text-[8.5px] bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold">کش سیستم</span>
                </div>
                <p className="text-[10px] text-zinc-300 leading-relaxed font-sans">
                  موجودی کیف پول شما: <strong className="text-emerald-400 text-xs font-mono">{walletBalance.toLocaleString()} تومان</strong> می‌باشد.
                </p>
                
                {walletBalance >= (orders.find(o => o.id === payingOrderId)?.totalAmount || 0) ? (
                  <button
                    type="button"
                    onClick={() => {
                      const amount = orders.find(o => o.id === payingOrderId)?.totalAmount || 0;
                      if (onDeductWallet && onDeductWallet(amount)) {
                        executePaymentSubmit();
                      }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-550 text-white font-sans text-[10.5px] font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/15 cursor-pointer"
                  >
                    <span>تایید فرآیند و کسر آنی از کیف پول داینامیک</span>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-[9px] text-rose-400 leading-relaxed font-sans">
                      ⚠️ برای تصفیه با موجودی، نیاز به شارژ کیف پول خود به مقدار {((orders.find(o => o.id === payingOrderId)?.totalAmount || 0) - walletBalance).toLocaleString()} تومان دیگر دارید.
                    </p>
                    {onChargeWallet && (
                      <button
                        type="button"
                        onClick={() => {
                          const needed = (orders.find(o => o.id === payingOrderId)?.totalAmount || 0) - walletBalance;
                          onChargeWallet(needed);
                        }}
                        className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-indigo-300 font-bold py-2 rounded-xl text-[10px] transition-all cursor-pointer"
                      >
                        شارژ خودکار کسر بودجه (+{((orders.find(o => o.id === payingOrderId)?.totalAmount || 0) - walletBalance).toLocaleString()} ت)
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Input Form Elements */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-400 block text-[10px]">شماره کارت بانکی عضو شتاب (۱۶ رقمی):</label>
                  <input
                    id="gateway-card-number-input"
                    type="text"
                    value={gatewayCardNumber}
                    onChange={(e) => setGatewayCardNumber(e.target.value)}
                    placeholder="xxxx-xxxx-xxxx-xxxx"
                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-2.5 text-center font-mono focus:outline-none focus:border-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 block text-[10px]">رمز دوم پویا یا ثابت:</label>
                    <div className="flex gap-1.5">
                      <input
                        id="gateway-otp-input"
                        type="password"
                        value={gatewayOTP}
                        onChange={(e) => setGatewayOTP(e.target.value)}
                        placeholder="*****"
                        className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-2.5 text-center font-mono focus:outline-none focus:border-slate-600"
                      />
                      <button
                        id="btn-gateway-request-otp"
                        type="button"
                        onClick={handleSendMockOTP}
                        disabled={isOTPSending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-2 rounded-xl text-[9px] whitespace-nowrap"
                      >
                        {isOTPSending ? 'ارسال...' : 'دریافت رمز پویا'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 block text-[10px]">کد امنیتی CVV2:</label>
                    <input
                      id="gateway-cvv2-input"
                      type="password"
                      value={gatewayCVV2}
                      onChange={(e) => setGatewayCVV2(e.target.value)}
                      placeholder="***"
                      maxLength={4}
                      className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-2.5 text-center font-mono focus:outline-none focus:border-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Status messages in gateway */}
              {gatewayMessage && (
                <p className="text-[#3b82f6] text-[10px] text-center font-bold">
                  {gatewayMessage}
                </p>
              )}

            </div>

            {/* Gateway actions control */}
            <div className="bg-[#121c2c] p-4 flex gap-2.5 border-t border-slate-800">
              <button
                id="btn-gateway-submit-pay"
                onClick={executePaymentSubmit}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold py-2.5 rounded-xl transition-colors"
              >
                تایید پرداخت موفقیت‌آمیز فاکتور
              </button>
              
              <button
                id="btn-gateway-cancel"
                onClick={() => {
                  setIsGatewayOpen(false);
                  setPayingOrderId(null);
                  addAuditLog('تراکنش پرداخت توسط کلاینت در درگاه لغو شد.', 'alert');
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-sans text-xs font-bold px-4 rounded-xl transition-colors"
                type="button"
              >
                انصراف
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DYNAMIC COURIER MAP SELECTOR MODAL (SNAPP / TAP30 SIMULATOR) */}
      {isMapModalOpen && activeSelectedOrderId && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 text-slate-200 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-none animate-in scale-in duration-350">
            
            {/* Map selection Left canvas panel */}
            <div className="flex-1 bg-[#090D16] p-5 flex flex-col justify-between border-l border-slate-800/80">
              <div className="space-y-1">
                <h4 className="text-white font-extrabold text-sm flex items-center gap-2">
                  <Map className="w-4 h-4 text-indigo-400" />
                  <span>نقشه ماهواره‌ای و کریدور مواصلاتی تهران</span>
                </h4>
                <p className="text-[10px] text-slate-400 font-sans">
                  برای تعیین دقیق موقعیت دریافت محصول فیزیکی، روی نقطه دلخواه نقشه تهران ضربه بزنید:
                </p>
              </div>

              {/* Simulated Map Canvas */}
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = Math.round(e.clientX - rect.left);
                  const clickY = Math.round(e.clientY - rect.top);
                  const x = Math.min(390, Math.max(10, clickX));
                  const y = Math.min(240, Math.max(10, clickY));

                  let closestLoc = 'موقعیت سفارشی روی نقشه';
                  let minDist = 999999;
                  TEHRAN_PREBUILT_LOCATIONS.forEach(loc => {
                    const d = Math.sqrt((loc.x - x)*(loc.x - x) + (loc.y - y)*(loc.y - y));
                    if (d < minDist) {
                      minDist = d;
                      if (d < 35) {
                        closestLoc = loc.name;
                      }
                    }
                  });
                  setSelectedTehranPos({ x, y, name: closestLoc });
                }}
                className="w-full h-[240px] bg-[#0d1220] border border-slate-800 rounded-2xl my-4 relative overflow-hidden cursor-crosshair select-none group"
              >
                {/* Cyber grid lines */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#818cf8_1px,transparent_1px),linear-gradient(to_bottom,#818cf8_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                {/* Major ring divisions */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-slate-800/40 rounded-full text-[8.5px] text-slate-700 p-2 text-center select-none pointer-events-none">طرح ترافیک مبدا</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-slate-800/20 rounded-full pointer-events-none" />

                {/* Simulated Street vectors */}
                <div className="absolute top-[80px] inset-x-0 h-[2px] bg-slate-800/40 rotate-1 transform-gpu pointer-events-none" />
                <div className="absolute top-[120px] inset-x-0 h-[2px] bg-indigo-500/20 rotate-[-1deg] transform-gpu pointer-events-none" />
                <div className="absolute left-[195px] inset-y-0 w-[2px] bg-slate-800/40 rotate-3 transform-gpu pointer-events-none" />

                {/* Center Arian Office Marker */}
                <div className="absolute rounded-full w-8 h-8 bg-indigo-600/15 border-2 border-indigo-500 flex items-center justify-center pointer-events-none shadow" style={{ left: '195px', top: '120px', transform: 'translate(-50%, -50%)' }}>
                  <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-ping" />
                  <div className="w-1.5 h-1.5 bg-indigo-200 rounded-full absolute" />
                </div>
                <span className="absolute text-[8px] bg-slate-950/80 text-indigo-300 font-bold px-1.5 py-0.5 rounded border border-indigo-500/20 shadow pointer-events-none" style={{ left: '195px', top: '140px', transform: 'translateX(-50%)' }}>
                  Arian Office (مبدا)
                </span>

                {/* Prebuilt Locations markers for guidelines */}
                {TEHRAN_PREBUILT_LOCATIONS.map(loc => (
                  <button
                    key={loc.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTehranPos({ x: loc.x, y: loc.y, name: loc.name });
                    }}
                    type="button"
                    className="absolute bg-slate-900 hover:bg-indigo-900 border border-slate-800 hover:border-indigo-500 px-2 py-0.5 rounded text-[8px] text-slate-350 font-bold transition-colors cursor-pointer z-20 shadow"
                    style={{ left: `${loc.x}px`, top: `${loc.y}px`, transform: 'translate(-50%, -50%)' }}
                  >
                    📍 {loc.name.split(' ')[0]}
                  </button>
                ))}

                {/* Dotted path connecting Arian Origin and User Pin */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line 
                    x1={195} 
                    y1={120} 
                    x2={selectedTehranPos.x} 
                    y2={selectedTehranPos.y} 
                    stroke={mapCourierType === 'snapp' ? '#10B981' : '#F97316'} 
                    strokeWidth="1.5" 
                    strokeDasharray="4,4"
                  />
                </svg>

                {/* Active user pinpoint */}
                <div 
                  className={`absolute w-10 h-10 flex flex-col items-center justify-center transition-all duration-150 pointer-events-none drop-shadow-lg z-30`}
                  style={{ left: `${selectedTehranPos.x}px`, top: `${selectedTehranPos.y}px`, transform: 'translate(-50%, -100%)' }}
                >
                  <MapPin className={`w-6 h-6 ${mapCourierType === 'snapp' ? 'text-emerald-500 animate-bounce' : 'text-orange-500 animate-bounce'}`} style={{ fill: 'currentColor', fillOpacity: 0.2 }} />
                  <span className="bg-slate-950 text-white border border-slate-800 text-[8px] font-bold px-1.5 py-0.05 rounded-md whitespace-nowrap shadow mt-1">
                    مقصد تحویل شما
                  </span>
                </div>

                {/* Map watermark / hint */}
                <span className="absolute bottom-2 left-2 text-[8px] text-slate-650 font-mono">Tehran Vector Map v2.6 • Click to Pin Location</span>
              </div>

              {/* Summary calculations */}
              <div className="bg-[#121c2c]/40 border border-slate-850 p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
                <div>
                  <span className="text-slate-450 block text-[9px]">تخمیم مسافت هوایی مبدا تا مقصد:</span>
                  <strong className="text-white text-xs font-extrabold">
                    {Number((Math.sqrt((selectedTehranPos.x - 195)**2 + (selectedTehranPos.y - 120)**2) * 0.05).toFixed(1))} کیلومتر
                  </strong>
                </div>
                <div>
                  <span className="text-slate-450 block text-[9px]">کرایه نهایی پیک صنف:</span>
                  <strong className="text-emerald-400 text-xs font-extrabold">
                    {Math.round(
                      (mapCourierType === 'snapp' ? 30000 : 35000) + 
                      (Math.sqrt((selectedTehranPos.x - 195)**2 + (selectedTehranPos.y - 120)**2) * 0.05) * (mapCourierType === 'snapp' ? 5000 : 6000)
                    ).toLocaleString()} تومان
                  </strong>
                </div>
                <div>
                  <span className="text-slate-450 block text-[9px]">تخمین زمان رسیدن سفیر:</span>
                  <strong className="text-amber-400 text-xs font-bold">
                    {Math.round((Math.sqrt((selectedTehranPos.x - 195)**2 + (selectedTehranPos.y - 120)**2) * 0.05) * 3.5 + 6)} دقیقه
                  </strong>
                </div>
              </div>
            </div>

            {/* Inputs & options Right panel */}
            <div className="w-full md:w-80 bg-[#161f30] border-t md:border-t-0 p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <strong className="text-white font-black text-xs font-sans">کریدور ارسال فیزیکی صنف</strong>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">API Synced</span>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  {/* Select Courier Operator */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">اپراتور حمل و نقل:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMapCourierType('snapp')}
                        className={`py-2 px-3 rounded-xl border font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          mapCourierType === 'snapp' 
                            ? 'bg-emerald-600/15 border-emerald-500 text-emerald-400 font-extrabold' 
                            : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                        <span>اسنپ باکس (سبز)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMapCourierType('tap30')}
                        className={`py-2 px-3 rounded-xl border font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          mapCourierType === 'tap30' 
                            ? 'bg-orange-600/15 border-orange-500 text-orange-400 font-extrabold' 
                            : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                        <span>تپ‌سی پیک (نارنجی)</span>
                      </button>
                    </div>
                  </div>

                  {/* Preset Quick Selectors */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">موقعیت‌های پیش‌فرض محلات تهران:</label>
                    <select
                      value={TEHRAN_PREBUILT_LOCATIONS.find(loc => loc.name === selectedTehranPos.name)?.id || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        const match = TEHRAN_PREBUILT_LOCATIONS.find(l => l.id === val);
                        if (match) {
                          setSelectedTehranPos({ x: match.x, y: match.y, name: match.name });
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-2 text-[11px] text-white focus:outline-none"
                    >
                      <option value="" disabled>-- انتخاب محله برای پرش سریع روی نقشه --</option>
                      {TEHRAN_PREBUILT_LOCATIONS.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Street & Postal info */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">نام خیابان اصلی و پلاک مقصد:</label>
                    <input
                      type="text"
                      value={selectedTehranPos.name}
                      onChange={(e) => setSelectedTehranPos(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-2 text-[10.5px] text-white focus:outline-none font-sans font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold block">واحد، جزئیات طبقه و پلاک مکمل:</label>
                    <input
                      type="text"
                      value={mapDetailAddress}
                      onChange={(e) => setMapDetailAddress(e.target.value)}
                      placeholder="مثال: پلاک ۴، طبقه ۳، واحد همکف"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-2 text-[10px] text-white focus:outline-none font-sans"
                    />
                  </div>

                  {/* Recipient meta */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold block">نام گیرنده مرسوله:</label>
                      <input
                        type="text"
                        value={mapRecipientName}
                        onChange={(e) => setMapRecipientName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-2 text-[10px] text-white focus:outline-none font-sans"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-bold block">موبایل تحویل‌گیرنده:</label>
                      <input
                        type="text"
                        value={mapRecipientPhone}
                        onChange={(e) => setMapRecipientPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-2 font-mono text-[10px] text-white focus:outline-none text-center"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Action controller footer and dispatcher trigger */}
              <div className="space-y-2 pt-4">
                <button
                  id="btn-submit-courier-map"
                  type="button"
                  onClick={submitCourierDelivery}
                  className={`w-full font-sans text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all cursor-pointer text-center text-white ${
                    mapCourierType === 'snapp' 
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/10' 
                      : 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/10'
                  }`}
                >
                  ✓ ارسال لوکیشن و هماهنگ‌سازی پیک
                </button>
                
                <button
                  id="btn-cancel-courier-map"
                  type="button"
                  onClick={() => setIsMapModalOpen(false)}
                  className="w-full bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white font-sans text-[10px] font-bold py-2 border border-slate-850 rounded-xl transition-colors cursor-pointer text-center"
                >
                  انصراف و بستن نقشه
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DETAILED OFFICIAL INVOICE VIEW MODAL inside Sandbox / Customer Workspace */}
      <AnimatePresence>
        {isInvoiceModalOpen && selectedInvoiceOrder && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-right">
            <div className="bg-white text-slate-900 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
              
              {/* Modal header row */}
              <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-850 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-black text-xs font-sans tracking-tight">سند فاکتور رسمی تاییدیه الکترونیک صنف (آرین دیجیتال)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl text-[10.5px] cursor-pointer"
                >
                  بستن پیش‌نمایش
                </button>
              </div>

              {/* Printable Area content */}
              <div className="p-8 overflow-y-auto space-y-6 text-right font-sans" id="sandbox-invoice-print-container">
                
                {/* Formal Corporate Letterhead */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-indigo-600 pb-4 gap-4">
                  <div className="space-y-1 font-sans">
                    <h1 className="text-lg font-black text-indigo-900 font-sans leading-relaxed">شرکت فنی مهندسی آرین دیجیتال (مسئولیت محدود)</h1>
                    <p className="text-[10.5px] text-zinc-500 font-bold leading-normal">بستر متمرکز ارائه و تسویه رسمی خدمات اینترنتی، گرافیک و انفورماتیک کشور</p>
                  </div>
                  <div className="bg-zinc-100 p-3 rounded-2xl text-[10.5px] leading-relaxed text-zinc-700 font-sans shrink-0 border border-zinc-200">
                    <div><strong>شـماره فاکتور:</strong> <span className="font-mono">{selectedInvoiceOrder.id}</span></div>
                    <div><strong>شـناسه رهگیری:</strong> <span className="font-mono text-cyan-700">{selectedInvoiceOrder.idempotencyKey || 'AD-99124'}</span></div>
                    <div><strong>تاریخ صـدور:</strong> <span className="font-mono">{selectedInvoiceOrder.createdAt.slice(0, 10)}</span></div>
                  </div>
                </div>

                {/* Company Metadata Row */}
                <div className="grid grid-cols-4 gap-3 text-[9.5px] bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl leading-normal text-zinc-650 font-sans">
                  <div><strong>کد ثبتی صنف:</strong> ۵۸۱۹۴</div>
                  <div><strong>شناسه ثبتی شرکت:</strong> ۱۰۳۲۰۰۴۹۱۸۳</div>
                  <div><strong>مستند وضعیت:</strong> تسویه نهایی</div>
                  <div><strong>شناسه مرجع:</strong> PWA-1405-AR</div>
                </div>

                {/* Seller & Customer columns card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] leading-relaxed">
                  <div className="border border-zinc-200 p-3.5 rounded-2xl bg-white space-y-1">
                    <span className="text-indigo-700 font-extrabold block border-b border-zinc-200 pb-1 mb-1.5 text-[10.5px]">مشخصات فروشنده (صاحب صنف):</span>
                    <p><strong>نام شخص حقوقی:</strong> شرکت آرین دیجیتال رسمی</p>
                    <p><strong>نشانی رسمی:</strong> تهران، میدان انقلاب، خیابان کارگر شمالی، پلاک ۱۱۰، واحد ۳ غربی</p>
                    <p><strong>تلفن ارتباطی:</strong> ۰۲۱-۶۶۵۴۳۲۱۰</p>
                  </div>
                  <div className="border border-zinc-200 p-3.5 rounded-2xl bg-white space-y-1">
                    <span className="text-zinc-600 font-extrabold block border-b border-zinc-200 pb-1 mb-1.5 text-[10.5px]">مشخصات خریدار (کاربر سیستم):</span>
                    <p><strong>نام حقیقی/حقوقی:</strong> {selectedInvoiceOrder.customerName || loggedInUser}</p>
                    <p><strong>تلفن همراه فعال:</strong> ۰۹۱۲۳۴۵۶۷۸۹ (شبیه‌ساز تایید شده)</p>
                    <p><strong>نشانی ارسال:</strong> ثبت در بستر کش محلی کلاینت مدرن</p>
                  </div>
                </div>

                {/* Service Itemization Table */}
                <div className="border border-zinc-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-[10.5px]">
                    <thead className="bg-[#f4f4f5] border-b border-zinc-200 text-zinc-700">
                      <tr>
                        <th className="p-3 text-center w-10 border-l border-zinc-200">ردیف</th>
                        <th className="p-3 text-right">عنوان خدمت یا استعلام بهای نهایی</th>
                        <th className="p-3 text-center w-24">تعداد/واحد</th>
                        <th className="p-3 text-left w-28">قیمت واحد (تومان)</th>
                        <th className="p-3 text-left w-28">جمع نهایی (تومان)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-zinc-800">
                      <tr>
                        <td className="p-3 text-center border-l border-zinc-200 font-mono">۱</td>
                        <td className="p-3">
                          <strong className="text-zinc-900 block font-sans">{selectedInvoiceOrder.serviceName}</strong>
                          <span className="text-[9.5px] text-indigo-900 block mt-0.5 leading-relaxed">{selectedInvoiceOrder.instructions}</span>
                        </td>
                        <td className="p-3 text-center font-sans">{selectedInvoiceOrder.quantity} واحد</td>
                        <td className="p-3 text-left font-mono">{Math.round(selectedInvoiceOrder.totalAmount / selectedInvoiceOrder.quantity).toLocaleString()}</td>
                        <td className="p-3 text-left font-black">{selectedInvoiceOrder.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Financial calculations and spell-in-words */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="text-[9.5px] text-zinc-500 font-sans leading-relaxed max-w-sm">
                    ⚠️ این برگه یک فاکتور تایید شده نهایی و معتبر در صفا‌آرایی بستر آرین دیجیتال است. هزینه‌ها بر اساس مقررات کلاینت شامل ارزش افزوده محاسبه گردیده و عاری از هرگونه بدهی اضافی ثبت شده است.
                  </div>
                  
                  {/* Ledger Breakdown */}
                  <div className="w-64 border border-zinc-200 rounded-2xl p-3.5 bg-zinc-50 text-[10px] space-y-2 leading-relaxed">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-bold">بهای خالص:</span>
                      <span className="font-mono">{Math.round(selectedInvoiceOrder.totalAmount / 1.1).toLocaleString()} تومان</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                      <span className="text-zinc-500 font-bold">مالیات بر ارزش افزوده (۱۰٪):</span>
                      <span className="font-mono text-zinc-650">{Math.round(selectedInvoiceOrder.totalAmount - (selectedInvoiceOrder.totalAmount / 1.1)).toLocaleString()} تومان</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-black text-indigo-900 border-b border-zinc-200 pb-1.5 pt-0.5">
                      <span>جمع کل نهایی تسویه:</span>
                      <span className="font-sans font-extrabold">{selectedInvoiceOrder.totalAmount.toLocaleString()} تومان</span>
                    </div>
                    <div className="flex justify-between text-[11.5px] font-black text-emerald-800 pt-1">
                      <span>مبلغ بیعانه پیش‌پرداخت (۳۰٪):</span>
                      <span className="font-sans font-black">{(selectedInvoiceOrder.downpaymentAmount || Math.round(selectedInvoiceOrder.totalAmount * 0.3)).toLocaleString()} تومان</span>
                    </div>
                    <div className="text-[8.5px] text-zinc-500 text-justify mt-1.5 pt-1.5 border-t border-dashed border-zinc-200">
                      بر اساس مصوبه آخرین نسخه نرخنامه سال ۱۴۰۵ خدمات اتحادیه صنف رایانه تهران و نصر، شروع به کار پروژه منوط به واریز ۳۰٪ رقم کل به عنوان پیش‌پرداخت (بیعانه) می‌باشد.
                    </div>
                  </div>
                </div>

                {/* Ink Signature Stamp Area */}
                <div className="relative pt-6 border-t border-zinc-150 h-32 flex items-center justify-between font-sans">
                  <div className="text-[10px] text-zinc-600 font-bold mr-6">
                    مهر و امضای مشتری گرامی
                    <div className="text-zinc-400 mt-10 font-normal">تایید الکترونیک موازی</div>
                  </div>

                  {/* Certified Blue Circle Ink stamp */}
                  <div className="relative w-28 h-28 border-[3px] border-double border-blue-600 rounded-full flex items-center justify-center text-center text-blue-600 select-none font-sans font-bold -rotate-6 select-none shrink-0 scale-95 ml-6">
                    <div className="border border-dashed border-blue-500 w-[96px] h-[96px] rounded-full flex flex-col justify-center items-center p-1 relative overflow-hidden bg-blue-500/[0.02]">
                      <span className="text-[6.5px] uppercase tracking-tighter opacity-80 leading-none">امور تسویه رسمی</span>
                      <span className="text-[9.5px] font-black tracking-tight leading-none my-0.5 text-blue-700">آرین دیجیتال</span>
                      <span className="text-[6.5px] tracking-tight opacity-90 text-blue-800">شناسه ثبت: ۵۸۱۹۴</span>
                      <span className={`text-[6px] border rounded-xs py-0.5 px-1 uppercase tracking-widest font-mono text-center font-bold mt-1 scale-90 ${
                        selectedInvoiceOrder.status === OrderStatus.Completed || selectedInvoiceOrder.status === OrderStatus.Paid || selectedInvoiceOrder.status === OrderStatus.Delivered || selectedInvoiceOrder.status === OrderStatus.InProgress ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
                      }`}>
                        {selectedInvoiceOrder.status === OrderStatus.Completed || selectedInvoiceOrder.status === OrderStatus.Paid || selectedInvoiceOrder.status === OrderStatus.Delivered || selectedInvoiceOrder.status === OrderStatus.InProgress ? 'PAID / وصول شد' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action buttons row */}
              <div className="bg-slate-50 border-t border-zinc-200 p-4 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedInvoiceOrder) {
                      downloadInvoiceHTML(selectedInvoiceOrder);
                    }
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-550 text-white font-sans text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود مستقیم فاکتور رسمی (HTML)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedInvoiceOrder) {
                      triggerPrintInvoice(selectedInvoiceOrder);
                    }
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-sans text-xs font-bold px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>چاپ فاکتور (خروجی PDF)</span>
                </button>
              </div>

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
