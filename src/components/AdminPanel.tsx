import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  Settings, 
  Users, 
  Smartphone, 
  Laptop, 
  TrendingUp, 
  Upload, 
  Plus, 
  Trash2, 
  HelpCircle, 
  ChevronLeft, 
  Download, 
  AlertCircle, 
  Filter, 
  Check, 
  X, 
  Share2, 
  FileText, 
  RefreshCw, 
  Calendar,
  Activity,
  Award,
  DollarSign
} from 'lucide-react';
import { OrderStatus, ORDER_STATUS_LABELS } from '../data/serviceData';

// Types matched to our system
interface Attachment {
  name: string;
  size: string;
  type: string;
}

interface Message {
  sender: 'system' | 'customer' | 'provider' | 'admin';
  text: string;
  timestamp: string;
  fileUrl?: string;
  fileName?: string;
}

interface MockOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  totalAmount: number;
  instructions: string;
  status: OrderStatus;
  customerName: string;
  providerName: string;
  attachments: Attachment[];
  deliverables?: { text: string; fileName: string; fileUrl?: string };
  messages: Message[];
  createdAt?: string;
}

// Simulated active online customers
interface ActiveCustomer {
  id: string;
  name: string;
  phone: string;
  status: 'online' | 'offline';
  device: 'mobile' | 'desktop';
  currentAction: string;
  avatarColor: string;
}

export default function AdminPanel() {
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [activeSelectedOrderId, setActiveSelectedOrderId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'kanban' | 'list' | 'presence'>('kanban');
  const [kanbanGrouping, setKanbanGrouping] = useState<'service' | 'status'>('status');
  
  // Ticket / Chat replying states
  const [replyText, setReplyText] = useState<string>('');
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadFileData, setUploadFileData] = useState<string>(''); // Base64 data simulated
  
  // Social forwarding state variables
  const [isForwardModalOpen, setIsForwardModalOpen] = useState<boolean>(false);
  const [forwardPlatform, setForwardPlatform] = useState<'telegram' | 'whatsapp' | 'bale' | 'rubika'>('telegram');
  const [forwardText, setForwardText] = useState<string>('');
  const [forwardSuccessMessage, setForwardSuccessMessage] = useState<string>('');
  
  // Filtering and Searching
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState<string>('');

  // Local notifications for admin events
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string }[]>([]);

  // Simulation of live online users
  const [activeCustomers, setActiveCustomers] = useState<ActiveCustomer[]>([
    { id: 'usr-1', name: 'آرین جاویدان', phone: '۰۹۱۲۳۴۵۶۷۸۹', status: 'online', device: 'desktop', currentAction: 'درحال کار با پیشخوان کافی‌نت', avatarColor: 'bg-indigo-500' },
    { id: 'usr-2', name: 'زهرا کریمی', phone: '۰۹۱۸۴۴۵۵۶۶۷', status: 'online', device: 'mobile', currentAction: 'درحال ورود به درگاه پرداخت فاکتور', avatarColor: 'bg-emerald-500' },
    { id: 'usr-3', name: 'محمدرضا نجفی', phone: '۰۹۳۰۵۵۶۶۷۷۸', status: 'offline', device: 'desktop', currentAction: '۵ دقیقه پیش آنلاین بود', avatarColor: 'bg-amber-500' },
    { id: 'usr-4', name: 'مریم محسنی', phone: '۰۹۱۲۹۹۸۸۷۷۶', status: 'online', device: 'mobile', currentAction: 'درحال ثبت سفارش طراحی لوگو جدید', avatarColor: 'bg-pink-500' },
    { id: 'usr-5', name: 'کاربر میهمان', phone: 'میهمان سایت', status: 'offline', device: 'mobile', currentAction: '۳۰ دقیقه پیش خارج شد', avatarColor: 'bg-slate-500' },
  ]);

  // Load and subscribe/listen to orders changes
  const loadOrders = () => {
    const saved = localStorage.getItem('arian_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
          
          // Set initial active selected ID if not set or not موجود inside new orders list
          if (parsed.length > 0) {
            const exists = parsed.some(o => o.id === activeSelectedOrderId);
            if (!exists) {
              setActiveSelectedOrderId(parsed[0].id);
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse orders in AdminPanel", e);
      }
    }
  };

  useEffect(() => {
    loadOrders();

    // Listening to state changes from other windows/tabs (Real-time sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'arian_orders') {
        loadOrders();
        addLocalNotification("سفارشات پلتفرم در پاسخ به عملیات کاربر همگام‌سازی واقعی شد.");
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Set up a small tick interval to sync states locally in case of same tab toggles
    const interval = setInterval(() => {
      loadOrders();
    }, 1500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [activeSelectedOrderId]);

  // Random customer action change simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCustomers(prev => {
        return prev.map(cust => {
          if (cust.name === 'کاربر میهمان') return cust;
          
          // Randomly change action 30% of the time
          if (Math.random() < 0.3) {
            const actions = [
              'درحال تماشای وب‌سایت اصلی (Portfolio)',
              'درحال نگارش فایل و بررسی هزینه‌ها در کلاینت',
              'درحال استعلام کدپستی در پیشخوان',
              'درحال چت تعاملی با ربات پشتیبان معلق',
              'درحال تأیید صحت فاکتور صادر شده',
              'درحال بررسی سوابق فاکتورهای رسمی قدیمی'
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const randomStatus: 'online' | 'offline' = Math.random() > 0.15 ? 'online' : 'offline';
            return {
              ...cust,
              status: randomStatus,
              currentAction: randomStatus === 'online' ? randomAction : 'آفلاین - دقایقی پیش'
            };
          }
          return cust;
        });
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const addLocalNotification = (text: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setNotifications(prev => [
      { id: Date.now().toString(), text, time: timeStr },
      ...prev.slice(0, 10)
    ]);
  };

  const syncOrdersToStorage = (updatedOrders: MockOrder[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('arian_orders', JSON.stringify(updatedOrders));
    
    // Dispatch instant custom storage event to make sure all components in-tab get notified
    window.dispatchEvent(new Event('storage'));
  };

  // Helper to find selected order
  const activeOrder = orders.find(o => o.id === activeSelectedOrderId) || (orders.length > 0 ? orders[0] : null);

  // Status transitions
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const freshOrders = orders.map(o => {
      if (o.id === orderId) {
        const nowStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        const systemMsg: Message = {
          sender: 'system',
          text: `وضعیت سفارش توسط ادمین پورتال به [${ORDER_STATUS_LABELS[newStatus].fa}] تغییر یافت.`,
          timestamp: nowStr
        };
        return {
          ...o,
          status: newStatus,
          messages: [...o.messages, systemMsg]
        };
      }
      return o;
    });
    syncOrdersToStorage(freshOrders);
    addLocalNotification(`سفارش شماره ${orderId} به وضعیت ${ORDER_STATUS_LABELS[newStatus].fa} ارتقا یافت.`);
  };

  // Admin writes chat message or uploads order output
  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    if (!replyText.trim() && !uploadFileName) return;

    const nowStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const updatedOrders = orders.map(o => {
      if (o.id === activeOrder.id) {
        const newMessages = [...o.messages];
        
        // Chat message
        if (replyText.trim()) {
          newMessages.push({
            sender: 'admin',
            text: replyText.trim(),
            timestamp: nowStr
          });
        }

        // File upload simulation
        let deliverables = o.deliverables;
        if (uploadFileName) {
          deliverables = {
            text: 'فایل ارسالی نهایی توسط مدیریت کل پلتفرم آرین دیجیتال',
            fileName: uploadFileName,
            fileUrl: uploadFileData || undefined
          };
          
          newMessages.push({
            sender: 'system',
            text: `مدیریت فایل جدیدی تحت عنوان [${uploadFileName}] برای شما آپلود لود نمود.`,
            timestamp: nowStr,
            fileName: uploadFileName,
            fileUrl: uploadFileData || undefined
          });
        }

        // Auto move status to InProgress or Delivered on admin write/file-upload
        let nextStatus = o.status;
        if (uploadFileName) {
          nextStatus = OrderStatus.Delivered;
        } else if (o.status === OrderStatus.Paid || o.status === OrderStatus.Assigned) {
          nextStatus = OrderStatus.InProgress;
        }

        return {
          ...o,
          messages: newMessages,
          deliverables,
          status: nextStatus
        };
      }
      return o;
    });

    syncOrdersToStorage(updatedOrders);
    setReplyText('');
    setUploadFileName('');
    setUploadFileData('');
    addLocalNotification(`پیام ادمین و به‌روزرسانی برای سفارش ${activeOrder.id} ثبت گردید.`);
  };

  // Simulate file drag-drop or file upload
  const handleAdminFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadFileData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger Open Forward Panel
  const openForwardPanel = (platform: 'telegram' | 'whatsapp' | 'bale' | 'rubika') => {
    if (!activeOrder) return;
    setForwardPlatform(platform);
    
    // Dynamic text creation based on chosen platform and order state
    const templateText = `📌 *سفارش آرین دیجیتال (${activeOrder.id})*
👤 مشتری: ${activeOrder.customerName}
📁 خدمت: ${activeOrder.serviceName}
💵 مبلغ نهایی: ${activeOrder.totalAmount.toLocaleString()} تومان
🚀 وضعیت کلی: ${ORDER_STATUS_LABELS[activeOrder.status].fa}
📝 دستورالعمل: ${activeOrder.instructions}

🗂️ فایل‌های ضمیمه شده: ${activeOrder.attachments.map(a => a.name).join(', ') || 'ندارد'}
💬 آخرین تاریخ رسانه: ${activeOrder.messages[activeOrder.messages.length - 1]?.text || 'بدون پیام'}

---
صادر کننده: هلدینگ صنف خدمات دیجیتال هوشمند آرین دیجیتال`;
    
    setForwardText(templateText);
    setForwardSuccessMessage('');
    setIsForwardModalOpen(true);
  };

  // Execute social forwarding simulated task
  const handleExecuteForwardSubmit = () => {
    setForwardSuccessMessage('در حال اتصال به سرور و فرستادن اطلاعات از طریق وب‌هوک ایمن...');
    
    setTimeout(() => {
      const platformLabels = {
        telegram: 'تلگرام (Telegram)',
        whatsapp: 'واتساپ (WhatsApp)',
        bale: 'بله صنف الکترونیک (Bale)',
        rubika: 'روبیکا همراه (Rubika)'
      };
      
      setForwardSuccessMessage(`✔ با موفقیت به شماره و شناسه مشتری در شبکه اجتماعی ${platformLabels[forwardPlatform]} برخط متصل و ارسال گردید!`);
      
      // Update order chat to notify user
      if (activeOrder) {
        const nowStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        const updatedOrders = orders.map(o => {
          if (o.id === activeOrder.id) {
            return {
              ...o,
              messages: [
                ...o.messages,
                {
                  sender: 'system',
                  text: `رسانه سفارش لایف‌سایکل و جزییات آن به شماره تماس شما در شبکه پیام‌رسان ${platformLabels[forwardPlatform]} ارسال برون‌مرزی گردید.`,
                  timestamp: nowStr
                }
              ]
            };
          }
          return o;
        });
        syncOrdersToStorage(updatedOrders);
      }
    }, 1500);
  };

  const getCategorizedColumns = () => {
    if (kanbanGrouping === 'service') {
      // Grouping by service categories
      return [
        { id: 'typing', title: 'خدمات تایپ و ترجمه', iconColor: 'text-indigo-400' },
        { id: 'graphic', title: 'طراحی گرافیک و پوستر', iconColor: 'text-pink-400' },
        { id: 'pishkhan', title: 'پیشخوان ۲۴ (کافی‌نت)', iconColor: 'text-blue-400' },
        { id: 'financial', title: 'خدمات مالی و گیفت‌کارت', iconColor: 'text-emerald-400' },
        { id: 'other', title: 'سایر پروژه‌ها و متفرقه', iconColor: 'text-amber-400 font-bold' }
      ];
    } else {
      // Grouping by stages
      return [
        { id: 'Pending', statuses: [OrderStatus.PendingPayment, OrderStatus.Draft], title: 'در انتظار پرداخت / پیش‌نویس', textColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
        { id: 'New', statuses: [OrderStatus.Paid], title: 'پرداخت شده / جدید', textColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
        { id: 'Processing', statuses: [OrderStatus.Assigned, OrderStatus.InProgress], title: 'در دست انجام', textColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
        { id: 'Revision', statuses: [OrderStatus.WaitingForUser, OrderStatus.Delivered], title: 'تحویل موقت / بازخورد', textColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
        { id: 'Completed', statuses: [OrderStatus.Completed], title: 'تکمیل شده نهایی', textColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
      ];
    }
  };

  const getFilteredOrders = () => {
    return orders.filter(o => {
      const matchSearch = 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.instructions.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchCustomer = selectedCustomerFilter ? o.customerName === selectedCustomerFilter : true;
      
      return matchSearch && matchCustomer;
    });
  };

  const getOrdersInCol = (colId: string) => {
    const list = getFilteredOrders();
    if (kanbanGrouping === 'service') {
      return list.filter(o => {
        if (colId === 'typing') return o.serviceId.includes('typing') || o.serviceId.includes('trans');
        if (colId === 'graphic') return o.serviceId.includes('graphic') || o.serviceId.includes('card') || o.serviceId === 'logo';
        if (colId === 'pishkhan') return o.serviceId.includes('pishkhan');
        if (colId === 'financial') return o.serviceId.includes('gift') || o.serviceId.includes('currency') || o.serviceId.includes('psn');
        return !o.serviceId.includes('typing') && !o.serviceId.includes('trans') && 
               !o.serviceId.includes('graphic') && !o.serviceId.includes('card') && o.serviceId !== 'logo' &&
               !o.serviceId.includes('pishkhan') && !o.serviceId.includes('gift') && !o.serviceId.includes('currency') && !o.serviceId.includes('psn');
      });
    } else {
      const colObj = getCategorizedColumns().find(c => c.id === colId);
      const statuses = colObj ? (colObj as any).statuses : [];
      return list.filter(o => statuses.includes(o.status));
    }
  };

  const totalEarnings = orders
    .filter(o => [OrderStatus.Completed, OrderStatus.Paid, OrderStatus.InProgress, OrderStatus.Delivered].includes(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrdersCount = orders.filter(o => o.status !== OrderStatus.Completed && o.status !== OrderStatus.Draft && o.status !== OrderStatus.Cancelled).length;

  return (
    <div className="bg-[#0B0F1A] text-slate-200 p-1 md:p-2 rounded-3xl space-y-6 font-sans border border-slate-800" dir="rtl">
      
      {/* 1. TOP OVERVIEW DASHBOARD ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Earnings */}
        <div className="bg-[#161E31]/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] block">درآمد ناخالص مالی صنف</span>
            <strong className="text-white text-lg font-black tracking-tight">{totalEarnings.toLocaleString()}</strong>
            <span className="text-slate-400 text-[10px] mr-1">تومان</span>
          </div>
          <div className="w-11 h-11 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-[#161E31]/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] block">سفارشات نیازمند فرآیند</span>
            <strong className="text-white text-lg font-black tracking-tight">{activeOrdersCount}</strong>
            <span className="text-slate-400 text-[10px] mr-1">سفارش فعال</span>
          </div>
          <div className="w-11 h-11 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Customers Online count */}
        <div className="bg-[#161E31]/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] block">کاربران همزمان در سایت</span>
            <strong className="text-emerald-450 text-lg font-black tracking-tight">
              {activeCustomers.filter(c => c.status === 'online').length} نفر
            </strong>
            <span className="text-slate-500 text-[9px] block">۳ نفر در دسکتاپ، ۱ نفر موبایل</span>
          </div>
          <div className="w-11 h-11 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Real-time System Sync Status */}
        <div className="bg-[#161E31]/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] block">وضعیت هماهنگی برخط (Sync)</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
              <strong className="text-emerald-300 text-xs font-bold font-mono">Realtime Live</strong>
            </div>
            <p className="text-[9.5px] text-slate-500">قابلیت کارگزاری همزمان در چند تب</p>
          </div>
          <div className="w-11 h-11 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
          </div>
        </div>

      </div>

      {/* 2. ADMIN INNER CONTROLS ROW */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-[#111827] border border-slate-850 p-4 rounded-2xl gap-4">
        
        {/* Search Input bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی سفارش، مشتری، شماره سفارش..."
            className="w-full bg-[#0B0F1A] border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 pr-9 text-xs text-white focus:outline-none placeholder:text-slate-600 font-sans"
          />
        </div>

        {/* Secondary filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
          
          {/* Customer filter */}
          <div className="flex items-center gap-1 bg-[#161E31] px-2 py-1.5 rounded-xl border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCustomerFilter}
              onChange={(e) => setSelectedCustomerFilter(e.target.value)}
              className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="">همه مشتریان</option>
              <option value="آرین جاویدان">آرین جاویدان</option>
              <option value="زهرا کریمی">زهرا کریمی</option>
              <option value="کاربر میهمان">کاربر میهمان</option>
            </select>
          </div>

          {/* Kanban / List Toggle */}
          <div className="bg-[#161E31] p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>برد ترلو (Kanban)</span>
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>لیست سفارش تراکنشی</span>
            </button>
            <button
              onClick={() => setActiveTab('presence')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'presence' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>مانیتور برخط کاربران</span>
            </button>
          </div>

          {activeTab === 'kanban' && (
            <div className="bg-slate-900 border border-slate-800 p-1 rounded-xl flex items-center text-[10px] text-slate-400 font-bold">
              <span className="px-2">دسته‌بندی ترلو:</span>
              <button
                onClick={() => setKanbanGrouping('status')}
                className={`px-2 py-0.5 rounded-md ${kanbanGrouping === 'status' ? 'bg-slate-800 text-white font-extrabold' : ''}`}
              >
                پیشرفت کلاینت
              </button>
              <button
                onClick={() => setKanbanGrouping('service')}
                className={`px-2 py-0.5 rounded-md ${kanbanGrouping === 'service' ? 'bg-slate-800 text-white font-extrabold' : ''}`}
              >
                شاخه خدماتی
              </button>
            </div>
          )}

        </div>

      </div>

      {/* 3. CORE ADAPTIVE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* MAIN PANEL CONTENT - Left side (8 Columns in tab layouts) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* TAB A: Trello-style Kanban board */}
          {activeTab === 'kanban' && (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-[900px] items-stretch">
                {getCategorizedColumns().map(column => {
                  const ordersInCol = getOrdersInCol(column.id);
                  return (
                    <div 
                      key={column.id} 
                      className="bg-[#111827] border border-slate-850 rounded-2xl w-72 flex flex-col p-4 shrink-0 shadow-lg min-h-[500px]"
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full bg-indigo-500 animate-pulse`} />
                          <h4 className="font-bold text-xs text-white leading-relaxed">{column.title}</h4>
                        </div>
                        <span className="bg-[#161E31] px-2 py-0.5 rounded-md text-[10px] text-indigo-400 font-black">
                          {ordersInCol.length}
                        </span>
                      </div>

                      {/* Card lists */}
                      <div className="space-y-3.5 overflow-y-auto max-h-[600px] pr-1 scrollbar-thin">
                        {ordersInCol.length === 0 ? (
                          <div className="text-center py-12 border-2 border-dashed border-slate-850 rounded-xl text-slate-600 text-[11px]">
                            بدون سفارش در این بخش
                          </div>
                        ) : (
                          ordersInCol.map(ord => {
                            const isSelected = ord.id === activeSelectedOrderId;
                            return (
                              <div
                                key={ord.id}
                                id={`kanban-card-${ord.id}`}
                                onClick={() => setActiveSelectedOrderId(ord.id)}
                                className={`bg-[#161E31]/90 hover:bg-[#1b253b] border p-3 rounded-xl transition-all cursor-pointer hover:scale-[1.02] space-y-3.5 shadow-md relative ${
                                  isSelected 
                                    ? 'border-indigo-500 ring-1 ring-indigo-500/25 bg-[#1b253b] shadow-indigo-650/10' 
                                    : 'border-slate-800'
                                }`}
                              >
                                {/* Card top metadata */}
                                <div className="flex items-center justify-between">
                                  <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[9px] text-slate-400 font-mono">
                                    {ord.id}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full border text-[8.5px] font-bold ${ORDER_STATUS_LABELS[ord.status].color}`}>
                                    {ORDER_STATUS_LABELS[ord.status].fa}
                                  </span>
                                </div>

                                {/* Order title & client info */}
                                <div className="space-y-1">
                                  <h5 className="font-extrabold text-xs text-slate-100">{ord.serviceName}</h5>
                                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                                    <span>مشتری: <strong>{ord.customerName}</strong></span>
                                    <span className="font-mono text-emerald-400 font-bold">{ord.totalAmount.toLocaleString()} ت</span>
                                  </div>
                                </div>

                                {/* Attachment indicator */}
                                {ord.attachments && ord.attachments.length > 0 && (
                                  <div className="flex items-center gap-1.5 text-[9.5px] text-indigo-400 bg-indigo-500/5 px-2 py-1 rounded-lg border border-indigo-500/10">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>{ord.attachments.length} فایل پیوست مشتری</span>
                                  </div>
                                )}

                                {/* Deliverable file indicator */}
                                {ord.deliverables && (
                                  <div className="flex items-center gap-1.5 text-[9.5px] text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>فایل خروجی آپلود شده</span>
                                  </div>
                                )}

                                {/* Action bar */}
                                <div className="flex items-center justify-between pt-1 border-t border-slate-850 text-[10px] text-slate-500">
                                  <span className="flex items-center gap-1 font-mono">
                                    <Clock className="w-3 h-3" />
                                    <span>{ord.createdAt || 'امروز'}</span>
                                  </span>
                                  <span className="text-indigo-400 font-bold flex items-center gap-1">
                                    <span>مدیریت تیکت</span>
                                    <ChevronLeft className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB B: Standard transactional list view */}
          {activeTab === 'list' && (
            <div className="bg-[#111827] border border-slate-850 rounded-2xl p-4 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-450">
                      <th className="py-3 px-2">شناسه</th>
                      <th className="py-3 px-2">نوع خدمت کارگزاری</th>
                      <th className="py-3 px-2">کارفرما (مشتری)</th>
                      <th className="py-3 px-2">ثبت شده در</th>
                      <th className="py-3 px-2">مبلغ فاکتور</th>
                      <th className="py-3 px-2">وضعیت استقرار</th>
                      <th className="py-3 px-2">اقدامات مدیریتی</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {getFilteredOrders().length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-slate-500">هیچ سفارشی یافت نشد.</td>
                      </tr>
                    ) : (
                      getFilteredOrders().map(ord => {
                        const isSelected = ord.id === activeSelectedOrderId;
                        return (
                          <tr 
                            key={ord.id}
                            id={`list-row-${ord.id}`}
                            onClick={() => setActiveSelectedOrderId(ord.id)}
                            className={`border-b border-slate-850/50 hover:bg-[#161E31]/75 cursor-pointer transition-all ${
                              isSelected ? 'bg-indigo-600/10 border-indigo-500/25 text-white' : 'text-slate-300'
                            }`}
                          >
                            <td className="py-3.5 px-2 font-mono font-bold text-slate-400">{ord.id}</td>
                            <td className="py-3.5 px-2 font-extrabold">{ord.serviceName}</td>
                            <td className="py-3.5 px-2 font-bold">{ord.customerName}</td>
                            <td className="py-3.5 px-2 text-slate-400 font-mono">{ord.createdAt || 'ثبت دستی'}</td>
                            <td className="py-3.5 px-2 font-mono font-black text-emerald-400">{ord.totalAmount.toLocaleString()} ت</td>
                            <td className="py-3.5 px-2">
                              <span className={`px-2.5 py-1 rounded-full border text-[9px] font-bold ${ORDER_STATUS_LABELS[ord.status].color}`}>
                                {ORDER_STATUS_LABELS[ord.status].fa}
                              </span>
                            </td>
                            <td className="py-3.5 px-2">
                              <button 
                                onClick={() => setActiveSelectedOrderId(ord.id)}
                                className="bg-slate-900 hover:bg-slate-800 text-indigo-400 font-bold px-3 py-1 rounded-lg border border-slate-800 flex items-center gap-1 transition-colors"
                              >
                                <span>بازرسی تیکت</span>
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB C: Customer Presence Monitor */}
          {activeTab === 'presence' && (
            <div className="bg-[#111827] border border-slate-850 rounded-2xl p-6 shadow-xl space-y-6">
              
              <div className="border-b border-slate-850 pb-3">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-450" />
                  <span>سامانه هوشمند پایش فرکانس و حضور کاربران (Customer Presence Hub)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mr-7">بررسی فعالیت، دستگاه مورد استفاده و پیگیری همزمان فرآیند پرداخت بر خط صنف</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCustomers.map(cust => (
                  <div 
                    key={cust.id} 
                    className="bg-[#161E31] border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-md relative overflow-hidden"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full ${cust.avatarColor} text-white flex items-center justify-center font-black relative`}>
                        {cust.name.slice(0, 2)}
                        
                        {/* Live Green pulse dot for online users */}
                        {cust.status === 'online' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#161E31] rounded-full animate-pulse" />
                        )}
                        {cust.status === 'offline' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-500 border-2 border-[#161E31] rounded-full" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-extrabold text-xs text-white">{cust.name}</h5>
                          {cust.device === 'desktop' ? (
                            <Laptop className="w-3.5 h-3.5 text-slate-500" title="دسکتاپ" />
                          ) : (
                            <Smartphone className="w-3.5 h-3.5 text-slate-500" title="موبایل کلاینت" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">{cust.phone}</p>
                      </div>
                    </div>

                    <div className="text-left space-y-1">
                      <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold ${
                        cust.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-slate-750'
                      }`}>
                        {cust.status === 'online' ? 'آنلاین فعال' : 'آفلاین'}
                      </span>
                      <p className="text-[9.5px] text-indigo-300 font-bold max-w-[140px] truncate" title={cust.currentAction}>
                        {cust.currentAction}
                      </p>
                    </div>

                    {/* Quick filter by cust link */}
                    <button
                      onClick={() => {
                        setSelectedCustomerFilter(cust.name === 'کاربر میهمان' ? 'کاربر میهمان' : 'آرین جاویدان');
                        setActiveTab('kanban');
                        addLocalNotification(`برد ترلو به روی فعالیت ${cust.name} متمرکز شد.`);
                      }}
                      className="absolute inset-x-0 bottom-0 py-1 bg-indigo-600/10 hover:bg-indigo-600/25 border-t border-slate-800/50 text-[10px] text-indigo-400 font-bold transition-all text-center cursor-pointer"
                    >
                      فیلتر سفارشات این شخص
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[10.5px] text-slate-400 leading-relaxed bg-[#0B0F1A] p-3.5 rounded-xl border border-slate-800/80">
                💡 <strong>هماهنگی سیستمی:</strong> در صورتی که مشتری کارنامه استعلامی خلافی بگیرد یا فاکتوری را پرداخت کند، لاگ تعاملی درگاه ملت مستقیماً تغییرات را به هسته ادمین مخابره کرده و کارهای او به ستون <strong>"پرداخت شده/جدید"</strong> انتقال می‌یابند.
              </div>

            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR PANEL - 4 Columns: Detailed Order Inspections & Tickets */}
        <div className="lg:col-span-4 space-y-6">
          
          {activeOrder ? (
            <div className="bg-[#111827] border border-slate-850 rounded-2xl p-5 shadow-xl space-y-5">
              
              {/* Box Header */}
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500">جزئیات سفارش بازرسی:</span>
                  <h4 className="font-black text-xs text-indigo-400 font-mono">{activeOrder.id}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-full border text-[9px] font-bold ${ORDER_STATUS_LABELS[activeOrder.status].color}`}>
                  {ORDER_STATUS_LABELS[activeOrder.status].fa}
                </span>
              </div>

              {/* Order Info Profile */}
              <div className="space-y-2 text-[11px] bg-[#161E31] p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">شاخه خدمت:</span>
                  <span className="text-white font-extrabold">{activeOrder.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">نام کارفرما:</span>
                  <span className="text-white font-bold">{activeOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">مایملک فاکتور:</span>
                  <span className="text-emerald-400 font-black">{activeOrder.totalAmount.toLocaleString()} تومان</span>
                </div>
                {activeOrder.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">تاریخ ارجاع:</span>
                    <span className="text-slate-350 font-mono">{activeOrder.createdAt}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-850 text-slate-300">
                  <span className="block text-[10px] text-slate-450 font-bold mb-1">توضیحات و دستورالعمل مشتری:</span>
                  <p className="leading-relaxed bg-[#0B0F1A] p-2 rounded-lg border border-slate-800 break-words text-[10.5px]">
                    {activeOrder.instructions || 'بدون توضیحات ویژه'}
                  </p>
                </div>
              </div>

              {/* Customer uploaded files in Order */}
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>فایل‌های ارسالی مشتری (ضمائم):</span>
                </h5>
                {activeOrder.attachments && activeOrder.attachments.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeOrder.attachments.map((file, fIdx) => (
                      <div 
                        key={fIdx} 
                        className="bg-slate-900 hover:bg-slate-850 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[10px] text-slate-300"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-slate-450 shrink-0" />
                          <span className="truncate" title={file.name}>{file.name}</span>
                          <span className="text-[9px] text-slate-500">({file.size})</span>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`فایل [${file.name}] به موتور سندباکس شبیه‌ساز دانلود هدایت شد.`);
                          }}
                          className="bg-[#161E31] p-1 text-indigo-400 hover:text-white rounded-lg border border-slate-800 transition-colors shrink-0 cursor-pointer"
                          title="دانلود سند ضمیمه‌شده"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 bg-slate-900/60 rounded-xl border border-slate-800/70 text-slate-500 text-[10px]">
                    بدون فایل ضمیمه (استعلام کافی‌نت)
                  </div>
                )}
              </div>

              {/* Order Life-Cycle Automation Panel */}
              <div className="bg-[#161E31]/90 rounded-2xl p-4 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-extrabold text-[11.5px] text-amber-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>گردش کار مکانیزه (Automation Status)</span>
                  </h5>
                  <span className="bg-[#0B0F1A] px-2 py-0.5 rounded text-[8.5px] text-slate-500">موتور تسویه ۲۴</span>
                </div>

                {/* Progress Tracker bar */}
                <div className="grid grid-cols-5 gap-1 pt-1.5">
                  {[
                    { st: OrderStatus.Draft, label: 'ثبت' },
                    { st: OrderStatus.Paid, label: 'پرداخت' },
                    { st: OrderStatus.InProgress, label: 'توسعه' },
                    { st: OrderStatus.Delivered, label: 'تحویل' },
                    { st: OrderStatus.Completed, label: 'تکمیل' }
                  ].map((step, idx) => {
                    const statusesSequence = [
                      [OrderStatus.Draft, OrderStatus.PendingPayment],
                      [OrderStatus.Paid],
                      [OrderStatus.Assigned, OrderStatus.InProgress, OrderStatus.WaitingForUser],
                      [OrderStatus.Delivered],
                      [OrderStatus.Completed]
                    ];
                    
                    const isPassed = statusesSequence.slice(0, idx + 1).some(stList => stList.includes(activeOrder.status));
                    const isCurrent = statusesSequence[idx].includes(activeOrder.status);
                    
                    return (
                      <div key={idx} className="text-center space-y-1">
                        <div className={`h-1.5 rounded-full ${
                          isCurrent ? 'bg-indigo-500 animate-pulse' : isPassed ? 'bg-emerald-500' : 'bg-slate-800'
                        }`} />
                        <span className={`text-[8.5px] block font-bold ${
                          isCurrent ? 'text-indigo-400' : isPassed ? 'text-emerald-400' : 'text-slate-500'
                        }`}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Automation trigger actions based on current status */}
                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <span className="block text-[9.5px] text-slate-400 font-bold">اقدامات نوار وضعیت و اتوماسیون:</span>
                  <div className="grid grid-cols-2 gap-2">
                    
                    {/* Switch status directly to PAID */}
                    {activeOrder.status === OrderStatus.PendingPayment && (
                      <button
                        onClick={() => handleUpdateOrderStatus(activeOrder.id, OrderStatus.Paid)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2 rounded-xl text-[10px] transition-all cursor-pointer text-center"
                      >
                        ✔ تایید پرداخت دستی
                      </button>
                    )}

                    {/* Wait assign / to In progress */}
                    {(activeOrder.status === OrderStatus.Paid || activeOrder.status === OrderStatus.Assigned) && (
                      <button
                        onClick={() => handleUpdateOrderStatus(activeOrder.id, OrderStatus.InProgress)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-2 rounded-xl text-[10px] transition-all cursor-pointer text-center"
                      >
                        ⚡ واگذاری و شروع کار
                      </button>
                    )}

                    {/* Waiting feedback / Ask user revision */}
                    {activeOrder.status === OrderStatus.InProgress && (
                      <button
                        onClick={() => handleUpdateOrderStatus(activeOrder.id, OrderStatus.WaitingForUser)}
                        className="bg-amber-600/20 hover:bg-amber-600/35 border border-amber-500/20 text-amber-300 font-bold p-2 rounded-xl text-[10px] transition-all cursor-pointer text-center"
                      >
                        ❓ درخواست بازخورد مشتری
                      </button>
                    )}

                    {/* Deliver final output */}
                    {[OrderStatus.InProgress, OrderStatus.WaitingForUser].includes(activeOrder.status) && (
                      <button
                        onClick={() => handleUpdateOrderStatus(activeOrder.id, OrderStatus.Delivered)}
                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold p-2 rounded-xl text-[10px] transition-all cursor-pointer text-center col-span-2"
                      >
                        📬 تحویل موقت خروجی کار
                      </button>
                    )}

                    {/* Finish and complete */}
                    {activeOrder.status === OrderStatus.Delivered && (
                      <button
                        onClick={() => handleUpdateOrderStatus(activeOrder.id, OrderStatus.Completed)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2 rounded-xl text-[10px] transition-all cursor-pointer text-center col-span-2"
                      >
                        🚀 تایید پرداخت نهایی و آزادباش وجه
                      </button>
                    )}

                    {/* Decline Order */}
                    {activeOrder.status !== OrderStatus.Draft && activeOrder.status !== OrderStatus.Completed && activeOrder.status !== OrderStatus.Cancelled && (
                      <button
                        onClick={() => handleUpdateOrderStatus(activeOrder.id, OrderStatus.Cancelled)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/10 text-rose-450 p-2 rounded-xl text-[10px] transition-all cursor-pointer text-center col-span-2"
                      >
                        ✕ لغو یا رد تراکنش سفارش
                      </button>
                    )}

                  </div>
                </div>

              </div>

              {/* Send Social Messaging forwarding button container */}
              <div className="bg-[#161E31]/90 rounded-2xl p-4 border border-slate-800 space-y-3">
                <h5 className="font-bold text-[11.5px] text-white flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-indigo-400" />
                  <span>برون‌سپاری و فوروارد به پیام‌رسان‌ها:</span>
                </h5>
                <p className="text-[10px] text-slate-400">به محض نهایی شدن یا تغییر وضعیت، می‌توانید به شماره مشتری فوروارد کنید:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openForwardPanel('telegram')}
                    className="bg-[#24A1DE]/10 hover:bg-[#24A1DE]/25 border border-[#24A1DE]/20 text-[#24A1DE] font-bold p-2 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>فوروارد تلگرام</span>
                  </button>
                  <button
                    onClick={() => openForwardPanel('whatsapp')}
                    className="bg-[#25D366]/10 hover:bg-[#25D366]/25 border border-[#25D366]/20 text-[#25D366] font-bold p-2 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>پیام در واتساپ</span>
                  </button>
                  <button
                    onClick={() => openForwardPanel('bale')}
                    className="bg-emerald-600/10 hover:bg-emerald-600/25 border border-emerald-500/20 text-emerald-300 font-bold p-2 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>ارسال بله (بومی)</span>
                  </button>
                  <button
                    onClick={() => openForwardPanel('rubika')}
                    className="bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/20 text-amber-300 font-bold p-2 rounded-xl text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>ارسال روبیکا</span>
                  </button>
                </div>
              </div>

              {/* Chat Thread / Ticket responses history */}
              <div className="space-y-3.5">
                <h5 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>تیکت گفتگو تعاملی و سوابق فعالیت:</span>
                </h5>

                {/* Messages pane */}
                <div className="bg-[#0B0F1A] border border-slate-850 rounded-2xl p-3.5 max-h-[260px] overflow-y-auto space-y-3 text-[10px] scrollbar-thin">
                  {activeOrder.messages && activeOrder.messages.length > 0 ? (
                    activeOrder.messages.map((msg, mIdx) => {
                      const isSystem = msg.sender === 'system';
                      const isAdmin = msg.sender === 'admin';
                      const isCustomer = msg.sender === 'customer';
                      const isProvider = msg.sender === 'provider';
                      
                      return (
                        <div 
                          key={mIdx}
                          className={`p-2.5 rounded-xl border leading-relaxed space-y-1 ${
                            isSystem 
                              ? 'bg-slate-900 text-slate-400 border-slate-800 text-center font-bold' 
                              : isAdmin 
                                ? 'bg-indigo-650/15 text-indigo-200 border-indigo-500/10 mr-4 text-right' 
                                : isCustomer
                                  ? 'bg-slate-850/80 text-emerald-200 border-emerald-500/10 ml-4 text-left'
                                  : 'bg-emerald-600/10 text-emerald-300 border-emerald-500/10 ml-4 text-left'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[8px] text-slate-500 font-sans">
                            <span className="font-bold">
                              {isSystem ? '💡 سیستم خودکار' : isAdmin ? '🛡️ مدیریت (ادمین)' : isCustomer ? '👤 مشتری' : '🎨 مجری طرح'}
                            </span>
                            <span className="font-mono">{msg.timestamp}</span>
                          </div>
                          <p className="text-[10.5px] mt-1 break-words leading-relaxed">{msg.text}</p>
                          {msg.fileName && (
                            <div className="pt-1.5 flex items-center gap-1 text-[9px] text-indigo-400">
                              <FileText className="w-3 h-3" />
                              <span>فایل تخصیص یافته: {msg.fileName}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-slate-600">بدون پیام گفتگو</div>
                  )}
                </div>

                {/* Quick Reply Form */}
                <form onSubmit={handleSendAdminReply} className="space-y-3 pt-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="پاسخ به تیکت یا نظر کارشناسی مجری فاقد خطا..."
                    rows={2}
                    className="w-full bg-[#0B0F1A] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white focus:outline-none placeholder:text-slate-600"
                  />

                  {/* Attachment in Reply */}
                  <div className="flex items-center justify-between gap-2.5">
                    <label className="flex items-center gap-1.5 text-[9.5px] text-slate-400 hover:text-white cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 px-3 py-2 rounded-xl transition-all">
                      <Upload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{uploadFileName ? `فایل: ${uploadFileName.slice(0, 15)}...` : 'ضمیمه کردن فایل خروجی کار'}</span>
                      <input
                        type="file"
                        onChange={handleAdminFileUpload}
                        className="hidden"
                      />
                    </label>

                    {uploadFileName && (
                      <button
                        type="button"
                        onClick={() => {
                          setUploadFileName('');
                          setUploadFileData('');
                        }}
                        className="text-rose-450 hover:text-rose-450 font-bold p-1 rounded-lg"
                        title="حذف ضمیمه"
                      >
                        ✕
                      </button>
                    )}

                    <button
                      type="submit"
                      id="btn-admin-send-ticket-reply"
                      className="bg-indigo-650 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition-all cursor-pointer mr-auto"
                    >
                      <Send className="w-3.5 h-3.5 ml-1" />
                      <span>ارسال پاسخ</span>
                    </button>
                  </div>
                </form>

              </div>

            </div>
          ) : (
            <div className="bg-[#111827] border border-slate-850 rounded-2xl p-12 text-center text-slate-500 text-xs">
              یک سفارش را از بخش پنل ترلو یا لیست انتخاب کلاینت کرده تا بازرسی و ابزارهای فوروارد تیکت آن فعال شود.
            </div>
          )}

          {/* Quick Admin notifications stream log block */}
          <div className="bg-[#111827] border border-[#1e293b]/70 p-4 rounded-xl space-y-3">
            <h5 className="text-[10.5px] font-bold text-slate-350 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-450" />
              <span>لاگ تغییرات ادمین و تراکنش‌های همزمان:</span>
            </h5>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto text-[9.5px] font-mono leading-relaxed scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="text-slate-600 text-center py-2">بدون لاگ جدید</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className="text-slate-400 bg-slate-950 p-1.5 rounded-lg border border-slate-900/50 flex justify-between gap-2.5">
                    <span className="truncate text-left text-slate-300">{n.text}</span>
                    <span className="text-slate-550 shrink-0">{n.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* 4. MODAL FOR INTEGRATED SOCIAL MEDIA FORWARDING SIMULATOR */}
      {isForwardModalOpen && activeOrder && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-[#111827] border border-slate-800 text-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                <h4 className="font-extrabold text-sm text-white">
                  اتصال پیام‌رسان {forwardPlatform === 'telegram' ? 'تلگرام' : forwardPlatform === 'whatsapp' ? 'واتساپ' : forwardPlatform === 'bale' ? 'بله صنف' : 'روبیکا'}
                </h4>
              </div>
              <button 
                onClick={() => setIsForwardModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick Warning */}
            <div className="bg-indigo-950/40 border border-indigo-550/20 p-3 rounded-xl text-indigo-300 text-[10.5px] leading-relaxed">
              ⚠️ <strong>شبیه‌ساز یکپارچه رسانه:</strong> این ابزار یک متد وب‌هوک API مستقیم به شماره تماس کاربر در پلتفرم‌های اجتماعی صادر می‌کند تا فایل‌های پرداخت‌شده سریع‌تر تحویل شوند.
            </div>

            {/* Editable Content */}
            <div className="space-y-2">
              <label className="text-[10.5px] text-slate-450 block">کپشن و بدنه پیام ارسالی به مشتری:</label>
              <textarea
                value={forwardText}
                onChange={(e) => setForwardText(e.target.value)}
                rows={8}
                className="w-full bg-[#0B0F1A] border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs text-white font-mono focus:outline-none"
              />
            </div>

            {/* Success message result banner */}
            {forwardSuccessMessage && (
              <div className={`p-3 rounded-xl text-xs font-bold ${
                forwardSuccessMessage.includes('✔') 
                  ? 'bg-emerald-500/15 border border-emerald-550/30 text-emerald-300' 
                  : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 animate-pulse'
              }`}>
                {forwardSuccessMessage}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleExecuteForwardSubmit}
                id="btn-admin-execute-social-forward"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-lg"
              >
                ارسال نهایی پیام کلاینت
              </button>
              <button
                type="button"
                onClick={() => setIsForwardModalOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
