import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Download, 
  AlertCircle, 
  Calendar, 
  Phone, 
  Smartphone, 
  RefreshCw, 
  Wallet, 
  Coins,
  ArrowRight,
  ShieldCheck,
  Printer,
  ChevronLeft,
  Building,
  UserCheck,
  Plus
} from 'lucide-react';
import { OrderStatus } from '../data/serviceData';
import PishkhanConnector from './PishkhanConnector';

interface PishkhanSimulatorProps {
  walletBalance: number;
  onDeductWallet: (amount: number) => boolean;
  onChargeWallet: (amount: number) => void;
  loggedInUser?: string;
}

interface InquireOrder {
  id: string; // PQ-XXXX
  type: 'car-fines' | 'national-id' | 'postal-code' | 'phone-bill';
  typeName: string;
  query: string;
  amount: number;
  status: OrderStatus;
  trackingCode?: string;
  result?: any;
  createdAt: string;
  customerName: string;
}

export default function PishkhanSimulator({
  walletBalance,
  onDeductWallet,
  onChargeWallet,
  loggedInUser = 'آرین جاویدان'
}: PishkhanSimulatorProps) {
  // Query Form states
  const [activeTab, setActiveTab] = useState<'car-fines' | 'national-id' | 'postal-code' | 'phone-bill'>('car-fines');
  
  // Specific Form fields
  // Plate inputs: [Plate 2 digits] [Character Alphabet] [Plate 3 digits] [Iran Region code]
  const [platePart1, setPlatePart1] = useState('36');
  const [plateChar, setPlateChar] = useState('ب');
  const [platePart2, setPlatePart2] = useState('891');
  const [plateIran, setPlateIran] = useState('12');
  
  const [nationalId, setNationalId] = useState('0012345678');
  const [postalCode, setPostalCode] = useState('1417853102');
  const [phoneNumber, setPhoneNumber] = useState('02166543210');
  
  // Active inquiry loading and responses
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentInquiryResult, setCurrentInquiryResult] = useState<any | null>(null);
  
  // Local/shared query transaction list
  const [inquiryOrders, setInquiryOrders] = useState<InquireOrder[]>([]);
  
  // Active Invoice modal states
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  // Load orders history from shared general orders
  useEffect(() => {
    syncFromLocalStorage();
    // Set up rapid monitor interval for external sandbox payment syncs
    const handleStorageChange = () => syncFromLocalStorage();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const syncFromLocalStorage = () => {
    const savedOrdersStr = localStorage.getItem('arian_orders');
    if (savedOrdersStr) {
      try {
        const saved = JSON.parse(savedOrdersStr);
        // Filter those ordered under pishkhan service codes (serviceId: 'pishkhan-car-fines' / etc)
        const pkOrders = saved.filter((o: any) => o.serviceId && o.serviceId.startsWith('pishkhan-'))
          .map((o: any) => ({
            id: o.id,
            type: o.serviceId.replace('pishkhan-', ''),
            typeName: o.serviceName,
            query: o.instructions.replace('جزییات استعلام: ', ''),
            amount: o.totalAmount,
            status: o.status,
            trackingCode: o.idempotencyKey || `PK-${o.id.replace('AD-', '')}`,
            result: o.deliverables ? JSON.parse(o.deliverables.text) : null,
            createdAt: o.createdAt,
            customerName: o.customerName
          }));
        setInquiryOrders(pkOrders);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Convert Plate states to string representation
  const getCarPlateString = () => {
    return `${platePart1} ${plateChar} ${platePart2} - ایران ${plateIran}`;
  };

  // Handle active fetch from the backend Express API `/api/pishkhan/inquire`
  const executeInquiryQuery = async (paymentMethod: 'wallet' | 'gateway') => {
    setErrorMessage('');
    setIsLoading(true);

    let queryVal = '';
    let categoryName = '';
    
    if (activeTab === 'car-fines') {
      queryVal = getCarPlateString();
      categoryName = 'استعلام خلافی خودرو صنف';
    } else if (activeTab === 'national-id') {
      if (nationalId.length !== 10) {
        setErrorMessage('کد ملی وارد شده باید دقیقاً ۱۰ رقم باشد.');
        setIsLoading(false);
        return;
      }
      queryVal = nationalId;
      categoryName = 'تایید اصالت کد ملی ثبت احوال';
    } else if (activeTab === 'postal-code') {
      if (postalCode.length !== 10) {
        setErrorMessage('کد پستی وارد شده باید دقیقاً ۱۰ رقم باشد.');
        setIsLoading(false);
        return;
      }
      queryVal = postalCode;
      categoryName = 'رهگیری جغرافیایی کد پستی صنف';
    } else {
      if (phoneNumber.length < 8) {
        setErrorMessage('تلفن ثابت وارد شده غیر معتبر است.');
        setIsLoading(false);
        return;
      }
      queryVal = phoneNumber;
      categoryName = 'استعلام قبض میان‌دوره تلفن ثابت';
    }

    const fee = 25000; // Tomans (fixed co-op inquiry fee)

    // Handle instant wallet depletion if chosen
    if (paymentMethod === 'wallet') {
      if (walletBalance < fee) {
        setErrorMessage('موجودی کیف پول شما کافی نیست. لطفا اقدام به افزایش اعتبار یا پرداخت درگاه کنید.');
        setIsLoading(false);
        return;
      }
    }

    try {
      // Hit real backend express route!
      const serverRes = await fetch('/api/pishkhan/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, query: queryVal })
      });

      if (!serverRes.ok) {
        throw new Error('خطا در پاسخ‌دهی سرور صنف آرین دیجیتال.');
      }

      const resData = await serverRes.json();
      
      if (resData.success) {
        // Complete the transaction with double entry write back to primary 'arian_orders'
        const existingStr = localStorage.getItem('arian_orders') || '[]';
        let existingOrders = [];
        try {
          existingOrders = JSON.parse(existingStr);
        } catch (e) {
          existingOrders = [];
        }

        const newId = `AD-${Math.floor(10000 + Math.random() * 90000)}`;
        const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

        const newMarketOrderObj = {
          id: newId,
          serviceId: `pishkhan-${activeTab}`,
          serviceName: categoryName,
          quantity: 1,
          totalAmount: fee,
          instructions: `جزییات استعلام: ${queryVal}`,
          status: paymentMethod === 'wallet' ? OrderStatus.Paid : OrderStatus.PendingPayment,
          customerName: loggedInUser,
          providerName: 'سیستم هوشمند پیشخوان ۲۴',
          attachments: [],
          deliverables: paymentMethod === 'wallet' ? {
            text: JSON.stringify(resData.result),
            fileName: 'inquiry_result_certified_arian.json'
          } : undefined,
          messages: [
            { sender: 'system', text: `سفارش استعلام پیشخوان ۲۴ ثبت شد. مبلغ سفارش: ${fee.toLocaleString()} تومان.`, timestamp: 'اکنون' }
          ],
          createdAt: nowStr,
          idempotencyKey: resData.trackingCode
        };

        if (paymentMethod === 'wallet') {
          onDeductWallet(fee);
          newMarketOrderObj.messages.push({
            sender: 'system',
            text: 'تسویه اعتبار از کیف پول انجام شد و استعلام نهایی بارگذاری گردید.',
            timestamp: 'اکنون'
          });
          setCurrentInquiryResult(resData.result);
        }

        existingOrders.unshift(newMarketOrderObj);
        localStorage.setItem('arian_orders', JSON.stringify(existingOrders));

        // Display success or alert
        syncFromLocalStorage();
        
        if (paymentMethod === 'wallet') {
          const matchingInquire = {
            id: newId,
            type: activeTab,
            typeName: categoryName,
            query: queryVal,
            amount: fee,
            status: OrderStatus.Paid,
            trackingCode: resData.trackingCode,
            result: resData.result,
            createdAt: nowStr,
            customerName: loggedInUser
          };
          setSelectedInvoice(matchingInquire);
          setIsInvoiceOpen(true);
        } else {
          setErrorMessage(`استعلام در انتظار پرداخت ایجاد شد با شناسه: ${newId}. لطفا جهت تکمیل استعلام، نسبت به تسویه فاکتور با شماره بالا در درگاه اقدام کنید.`);
        }
      } else {
        setErrorMessage('تاییدیه استعلام توسط وب سرویس صادر نشد. مجددا تست کنید.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطای غیرمنتظره در پردازش اطلاعات محلی.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render Official PDF Invoice Downloader as complete client-safe HTML download
  const handleDownloadOfficialInvoice = (invoice: InquireOrder) => {
    const calculatedBase = Math.round(invoice.amount / 1.1);
    const calculatedVat = invoice.amount - calculatedBase;

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
          }
          .stamp {
            position: absolute;
            left: 50px;
            top: 20px;
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
          .sig-buyer {
            float: right;
            margin-right: 60px;
            font-size: 11px;
            font-weight: bold;
            margin-top: 30px;
          }
          .print-notice {
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 10px;
            border-radius: 6px;
            font-size: 10.5px;
            color: #1e40af;
            text-align: center;
            margin-bottom: 20px;
          }
          @media print {
            body { padding: 0; background: none; }
            .print-button, .print-notice { display: none; }
            .invoice-box { border: 1px solid #000; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="print-notice">
          سند فاکتور رسمی تایید شده صنف با کد ترخیص الکترونیک صادر گردید. از دکمه‌های مرورگر یا کلید ترکیبی Ctrl+P برای پرینت مستقیم فیزیکی یا ذخیره‌سازی PDF بهره بگیرید.
        </div>
        <div class="invoice-box">
          <div class="title-pishkhan">
            <span>شرکت مهندسی آرین دیجیتال (مسئولیت محدود)</span>
            <span style="font-size: 13px; color: #6b7280;">صورت‌حساب رسمی فروش کالا و خدمات صنف رایانه</span>
          </div>
          
          <table class="metadata-table">
            <tr>
              <td><strong>شماره فاکتور:</strong> INV-${invoice.id}</td>
              <td><strong>کد پیگیری پیشخوان:</strong> ${invoice.trackingCode || 'PK-981240'}</td>
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
              <p><strong>نام کارشناس / مشتری:</strong> ${invoice.customerName}</p>
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
                  <strong>${invoice.typeName}</strong><br>
                  <span style="font-size: 9.5px; color: #4b5563;">جزییات ورودی استعلام: ${invoice.query}</span>
                </td>
                <td style="text-align: center;">۱ خدمت</td>
                <td style="text-align: left; font-family: monospace;">${(calculatedBase * 10).toLocaleString()}</td>
                <td style="text-align: left; font-weight: bold;">${invoice.amount.toLocaleString()}</td>
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
              <td style="text-align: left; color: #1e40af; font-size:12px;">${invoice.amount.toLocaleString()}</td>
            </tr>
          </table>

          <div style="font-size: 10px; margin-top: 15px; color: #374151; font-weight: bold;">
            حروف: بیست و پنج هزار تومان تمام صادر شده از بستر امن Pishkhan24 کلاینت.
          </div>

          <div class="stamp-box">
            <div class="sig-buyer">
              مهر و امضای خریدار
              <div style="font-size: 9px; color: #9ca3af; margin-top: 25px; font-weight: normal;">(نام مشتری نمونه)</div>
            </div>
            
            <div class="stamp">
              <div class="stamp-inner">
                <span style="font-size: 7px; color: #2563eb; opacity: 0.8;">مهر رسمی تسویه حساب</span>
                <span class="stamp-title">آرین دیجیتال</span>
                <span style="font-size: 7px; color: #1d4ed8;">شناسه ثبت: ۵۸۱۹۴</span>
                <span style="font-size: 6px; color: #dc2626; font-family: monospace; transform: rotate(15deg); margin-top: 3px;">PAID / تسویه شد</span>
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

  return (
    <div className="space-y-6 text-right">
      
      {/* Promo & Sync Hero card */}
      <div className="bg-gradient-to-l from-indigo-950 via-[#131d35] to-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute left-0 bottom-0 top-0 w-48 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500 text-white text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">فول استک زنده</span>
              <span className="text-[10px] text-indigo-400 font-bold">اتصال مستقیم به https://pishkhan24.com/</span>
            </div>
            <h2 className="text-xl font-black text-white">درگاه استعلام و پیوند هوشمند پیشخوان ۲۴ آرین دیجیتال</h2>
            <p className="text-slate-400 text-[11.5px] leading-relaxed max-w-2xl">
              این پورتال جداگانه به صورت زنده استعلامات ضروری شهروندی شامل خلافی خودرو، ثبت احوال کد ملی، اطلاعات جغرافیایی کد پستی و قبوض را شبیه‌سازی می‌کند. هزینه‌ها به صورت خودکار از کیف پول برداشته شده و فاکتور تجاری آنی با مهر با اصالت صنف صادر می‌شود.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2.5 shrink-0 text-center min-w-[190px]">
            <span className="text-[10px] text-slate-400 block font-bold">باقیمانده موجودی کیف صنف:</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-xl font-black text-emerald-400 font-mono">{walletBalance.toLocaleString()}</span>
              <span className="text-[9px] text-slate-400">تومان</span>
            </div>
            <button
              id="pk-btn-add-funds"
              onClick={() => onChargeWallet(150000)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>شارژ سریع صنف (+۱۵۰,۰۰۰ت)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left pane: Inquiry form and tab controls (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3 flex flex-wrap gap-2">
            {[
              { id: 'car-fines', label: 'خلافی خودرو', desc: 'استعلام پلاک خودرو' },
              { id: 'national-id', label: 'ثبت احوال کد ملی', desc: 'شناسنامه و هویت' },
              { id: 'postal-code', label: 'رهگیری کد پستی', desc: 'تاییدیه آدرس دقیق جغرافیایی' },
              { id: 'phone-bill', label: 'قبوض خدماتی تلفن', desc: 'محاسبه بدهی دیجیتال' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setCurrentInquiryResult(null);
                  setErrorMessage('');
                }}
                className={`flex-1 py-3 px-2 rounded-2xl border transition-all text-center cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-650 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                    : 'bg-[#151c2c] border-slate-800/80 text-zinc-400 hover:text-white'
                }`}
              >
                <span className="block text-[11px] font-black">{tab.label}</span>
                <span className="text-[8.5px] opacity-70 block mt-0.5">{tab.desc}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* CAR FINES CONTROLS */}
            {activeTab === 'car-fines' && (
              <div className="space-y-4">
                <p className="text-[11px] text-zinc-400">پلاک ملی خودروی هدف را با ابزار گرافیکی پایین بر کدهای پلاک تنظیم کنید:</p>
                <div className="flex justify-center py-4 bg-[#141d2f] rounded-2xl border border-slate-800/80">
                  {/* Plate Graphic Box */}
                  <div className="w-[300px] h-[72px] bg-white border-2 border-black rounded-lg flex overflow-hidden font-sans text-black relative select-none">
                    {/* Left blue region */}
                    <div className="w-10 bg-blue-700 text-white flex flex-col justify-between p-1.5 text-[8.5px] text-center select-none shrink-0 font-sans">
                      <div className="w-4 h-3 bg-white/20 mx-auto rounded-sm relative">
                        <div className="absolute top-0.5 left-0.5 right-0.5 h-1 bg-blue-800" />
                        <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1 bg-red-600" />
                      </div>
                      <span className="font-extrabold tracking-widest text-[9px]">I.R. IRAN</span>
                    </div>

                    {/* Left Plate digits (2 digits) */}
                    <div className="flex-1 flex items-center justify-center border-r border-[#666]">
                      <input
                        type="text"
                        maxLength={2}
                        value={platePart1}
                        onChange={(e) => setPlatePart1(e.target.value)}
                        className="w-12 text-3xl font-black text-center bg-transparent border-none outline-none focus:ring-0 p-0"
                      />
                    </div>

                    {/* Middle Persian Character choice dropdown */}
                    <div className="w-14 border-r border-[#666] flex items-center justify-center">
                      <select
                        value={plateChar}
                        onChange={(e) => setPlateChar(e.target.value)}
                        className="font-bold text-2xl text-center bg-transparent border-none outline-none cursor-pointer p-0"
                      >
                        {['الف', 'ب', 'ج', 'د', 'س', 'ص', 'ط', 'م', 'ن', 'و', 'ه', 'ی'].map(c => (
                          <option key={c} value={c} className="bg-white text-black">{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Right plate digits (3 digits) */}
                    <div className="flex-[1.5] flex items-center justify-center border-r border-[#666]">
                      <input
                        type="text"
                        maxLength={3}
                        value={platePart2}
                        onChange={(e) => setPlatePart2(e.target.value)}
                        className="w-16 text-3xl font-black text-center bg-transparent border-none outline-none focus:ring-0 p-0"
                      />
                    </div>

                    {/* Iran Region box */}
                    <div className="w-14 flex flex-col justify-center items-center bg-yellow-50 select-none shrink-0">
                      <span className="text-[8px] text-slate-500 font-bold">ایران</span>
                      <input
                        type="text"
                        maxLength={2}
                        value={plateIran}
                        onChange={(e) => setPlateIran(e.target.value)}
                        className="w-10 text-xl font-black text-center bg-transparent border-none outline-none focus:ring-0 p-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NATIONAL ID CONTROLS */}
            {activeTab === 'national-id' && (
              <div className="space-y-3">
                <label className="block text-[10.5px] text-slate-400 font-bold">کد ملی ۱۰ رقمی متقاضی:</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-sm font-mono text-center tracking-widest placeholder:text-slate-600 block focus:outline-none focus:border-indigo-500"
                    placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
                  />
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            {/* POSTAL CODE CONTROLS */}
            {activeTab === 'postal-code' && (
              <div className="space-y-3">
                <label className="block text-[10.5px] text-slate-400 font-bold">کد پستی ۱۰ رقمی مقصد:</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-sm font-mono text-center tracking-widest placeholder:text-slate-600 block focus:outline-none focus:border-indigo-500"
                    placeholder="مثال: ۱۴۱۷۸۵۳۱۰۲"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            {/* PHONE BILL CONTROLS */}
            {activeTab === 'phone-bill' && (
              <div className="space-y-3">
                <label className="block text-[10.5px] text-slate-400 font-bold">شماره تلفن ثابت هدف (به همراه کد استان):</label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={11}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-sm font-mono text-center tracking-widest placeholder:text-slate-600 block focus:outline-none focus:border-indigo-500"
                    placeholder="مثال: ۰۲۱۶۶۵۴۳۲۱۰"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="text-amber-400 text-[10.5px] bg-amber-500/5 border border-amber-500/15 p-3 rounded-xl leading-relaxed text-right font-sans">
                ⚠️ {errorMessage}
              </div>
            )}

            <div className="bg-[#151c2c] border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-440 block font-bold">هزینه نهایی هر خدمات استعلام صنف:</span>
                <strong className="text-amber-450 text-xs font-black">۲۵,۰۰۰ تومان</strong>
              </div>
              <span className="text-[8.5px] bg-indigo-500/20 border border-indigo-500/35 text-indigo-300 py-0.5 px-2.5 rounded-full font-bold">تسویه آنی کیف پول کلاینت</span>
            </div>

            {/* Query Triggers */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => executeInquiryQuery('wallet')}
                disabled={isLoading}
                className="bg-indigo-650 hover:bg-indigo-550 text-white font-sans text-[11px] font-bold py-3 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full ml-1" />
                ) : (
                  <Coins className="w-4 h-4" />
                )}
                <span>استعلام با کسر از کیف پول</span>
              </button>

              <button
                type="button"
                onClick={() => executeInquiryQuery('gateway')}
                disabled={isLoading}
                className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-teal-300 font-sans text-[11px] font-bold py-3 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>ثبت فاکتور (پرداخت درگاه)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right pane: Inquiry records & direct access to invoices (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827] border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-sans font-black text-sm text-white">تراکنش‌های استعلام پیشخوان ۲۴</h3>
            <span className="text-[9px] bg-slate-950 text-indigo-400 py-1 px-2.5 rounded-lg border border-slate-850 font-bold">
              تعداد: {inquiryOrders.length}
            </span>
          </div>

          {inquiryOrders.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 border border-dashed border-slate-800/80 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-slate-500" />
              <p className="text-[10.5px] text-slate-400 leading-normal font-sans">هیچ سابقه استعلام یا تراکنشی یافت نشد.</p>
              <button
                type="button"
                className="text-[9px] text-indigo-400 font-bold underline"
                onClick={() => {
                  setPlatePart1('22');
                  setPlateIran('77');
                }}
              >
                بارگذاری برای تست سریع
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {inquiryOrders.map(item => (
                <div
                  key={item.id}
                  className="bg-[#141b2b] border border-slate-800/80 p-3 rounded-2xl space-y-2 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-white font-bold">{item.typeName}</span>
                    <span className="text-zinc-500 font-sans tracking-tight">{item.id}</span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] text-[#888]">مقدار ورودی: {item.query}</span>
                    <strong className="text-amber-400 text-[11px] font-sans">{item.amount.toLocaleString()} تومان</strong>
                  </div>

                  <div className="flex justify-between items-center text-[9px] border-t border-slate-800/60 pt-2">
                    <span className={`px-2 py-0.5 rounded border ${
                      item.status === OrderStatus.Paid ? 'bg-emerald-500/15 border-emerald-550/20 text-emerald-400' : 'bg-amber-500/15 border-amber-550/20 text-amber-400'
                    }`}>
                      {item.status === OrderStatus.Paid ? 'تسویه شده' : 'در انتظار درگاه'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInvoice(item);
                        setIsInvoiceOpen(true);
                      }}
                      className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>فاکتور رسمی مهر شده</span>
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PishkhanConnector onSyncTriggered={syncFromLocalStorage} />

      {/* DETAILED OFFICIAL INVOICE VIEW MODAL with ink stamp */}
      <AnimatePresence>
        {isInvoiceOpen && selectedInvoice && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white text-slate-900 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              
              {/* Modal header row */}
              <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-zinc-800 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-black text-xs font-sans tracking-tight">سند فاکتور رسمی تاییدیه الکترونیک صنف</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInvoiceOpen(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl text-[10.5px] cursor-pointer"
                >
                  بستن پیش‌نمایش
                </button>
              </div>

              {/* Printable Area content */}
              <div className="p-8 overflow-y-auto space-y-6 text-right" id="pishkhan-invoice-print-container">
                
                {/* Formal Corporate Letterhead */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-indigo-600 pb-4 gap-4">
                  <div className="space-y-1">
                    <h1 className="text-lg font-black text-indigo-900 font-sans">شرکت مهندسی آرین دیجیتال (مسئولیت محدود)</h1>
                    <p className="text-[10px] text-zinc-500 font-bold">بستر متمرکز ارائه و تسویه رسمی خدمات اینترنتی، گرافیک و انفورماتیک کشور</p>
                  </div>
                  <div className="bg-zinc-100 p-3 rounded-2xl text-[10.5px] leading-relaxed text-zinc-700 font-sans shrink-0 border border-zinc-200">
                    <div><strong>شـماره فاکتور:</strong> <span className="font-mono">{selectedInvoice.id}</span></div>
                    <div><strong>شـناسه رهگیری:</strong> <span className="font-mono text-cyan-700">{selectedInvoice.trackingCode || 'PK-90184'}</span></div>
                    <div><strong>تاریخ صـدور:</strong> <span className="font-mono">{selectedInvoice.createdAt.slice(0, 10)}</span></div>
                  </div>
                </div>

                {/* Company Metadata Row */}
                <div className="grid grid-cols-4 gap-3 text-[9.5px] bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl leading-normal text-zinc-650">
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
                    <p><strong>نام حقیقی/حقوقی:</strong> {selectedInvoice.customerName}</p>
                    <p><strong>تلفن همراه فعال:</strong> ۰۹۱۲۳۴۵۶۷۸۹ (شبیه‌ساز تایید شده)</p>
                    <p><strong>نشانی ارسال:</strong> ثبت در بستر کش محلی کلاینت مدرن</p>
                  </div>
                </div>

                {/* Service Itemization Table */}
                <div className="border border-zinc-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-[10.5px]">
                    <thead className="bg-[#f4f4f5] border-b border-zinc-200 text-zinc-700">
                      <tr>
                        <th className="p-3 text-center w-10">ردیف</th>
                        <th className="p-3 text-right">عنوان خدمت یا استعلام بهای نهایی</th>
                        <th className="p-3 text-center w-24">تعداد/واحد</th>
                        <th className="p-3 text-left w-28">قیمت واحد (تومان)</th>
                        <th className="p-3 text-left w-28">جمع نهایی (تومان)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-zinc-800">
                      <tr>
                        <td className="p-3 text-center">۱</td>
                        <td className="p-3">
                          <strong className="text-zinc-900 block">{selectedInvoice.typeName}</strong>
                          <span className="text-[9px] text-indigo-650 block mt-0.5">نوع استعلام: {selectedInvoice.type} | کد پیگیری: {selectedInvoice.query}</span>
                        </td>
                        <td className="p-3 text-center">۱ خدمت</td>
                        <td className="p-3 text-left font-mono">{Math.round(selectedInvoice.amount / 1.1).toLocaleString()}</td>
                        <td className="p-3 text-left font-black">{selectedInvoice.amount.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Financial calculations and spell-in-words */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="text-[9px] text-zinc-500 font-sans leading-relaxed max-w-sm">
                    ⚠️ این برگه یک فاکتور تایید شده نهایی و معتبر در صفا‌آرایی بستر آرین دیجیتال است. هزینه‌ها بر اساس مقررات کلاینت شامل ارزش افزوده محاسبه گردیده و عاری از هرگونه بدهی اضافی ثبت شده است.
                  </div>
                  
                  {/* Ledger Breakdown */}
                  <div className="w-64 border border-zinc-200 rounded-2xl p-3.5 bg-zinc-50 text-[10px] space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-bold">بهای خالص:</span>
                      <span className="font-mono">{Math.round(selectedInvoice.amount / 1.1).toLocaleString()} تومان</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-1.5">
                      <span className="text-zinc-500 font-bold">مالیات بر ارزش افزوده (۱۰٪):</span>
                      <span className="font-mono text-zinc-600">{Math.round(selectedInvoice.amount - (selectedInvoice.amount / 1.1)).toLocaleString()} تومان</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-black text-indigo-900 pt-0.5">
                      <span>جمع کل نهایی تسویه:</span>
                      <span className="font-sans font-extrabold">{selectedInvoice.amount.toLocaleString()} تومان</span>
                    </div>
                  </div>
                </div>

                {/* Ink Signature Stamp Area */}
                <div className="relative pt-6 border-t border-zinc-150 h-32 flex items-center justify-between">
                  <div className="text-[10px] text-zinc-600 font-bold mr-6">
                    مهر و امضای مشتری گرامی
                    <div className="text-zinc-400 mt-10 font-normal">امضا شده دیجیتال</div>
                  </div>

                  {/* Certified Blue Circle Ink stamp */}
                  <div className="relative w-28 h-28 border-[3.5px] border-double border-blue-600 rounded-full flex items-center justify-center text-center text-blue-600 select-none font-sans font-bold -rotate-6 select-none shrink-0 scale-95 ml-6">
                    <div className="border border-dashed border-blue-500 w-[96px] h-[96px] rounded-full flex flex-col justify-center items-center p-1 relative overflow-hidden bg-blue-500/[0.02]">
                      <span className="text-[6.5px] uppercase tracking-tighter opacity-80">سامانه متمرکز تسویه</span>
                      <span className="text-[9.5px] font-black tracking-tight leading-none my-0.5 text-blue-700">آرین دیجیتال</span>
                      <span className="text-[6px] tracking-tight opacity-90 text-blue-800">کد رسمی صنف: ۵۸۱۹۴</span>
                      <span className="text-[5.5px] bg-red-500/10 border border-red-500/20 text-red-500 rounded-xs py-0.5 px-1 uppercase tracking-widest font-mono text-center font-bold mt-1 scale-90">PAID / وصول شد</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action buttons row */}
              <div className="bg-slate-50 border-t border-zinc-200 p-4 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownloadOfficialInvoice(selectedInvoice)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-550 text-white font-sans text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود مستقیم فاکتور رسمی (HTML مدرن-PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const printContents = document.getElementById('pishkhan-invoice-print-container')?.innerHTML;
                    const originalContents = document.body.innerHTML;
                    if (printContents) {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>چاپ فاکتور رسمی آرین دیجیتال</title>
                              <style>
                                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700;900&display=swap');
                                body { font-family: 'Vazirmatn', sans-serif; padding: 40px; background: white; color: black; direction: rtl; }
                                .invoice-box { border: 2px solid #2563eb; padding: 30px; border-radius: 12px; }
                                .title-pishkhan { font-size: 20px; font-weight: 900; color: #1e3a8a; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; display: flex; justify-content: space-between; }
                                .metadata-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                                .metadata-table td { padding: 5px; border: 1px solid #e5e7eb; font-size: 11px; }
                                .parties-section { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-top: 20px; }
                                .party-card { border: 1.5px solid #d1d5db; border-radius: 8px; padding: 12px; }
                                .party-card h4 { margin: 0 0 8px 0; color: #2563eb; }
                                .items-table { width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 11px; }
                                .items-table th { background: #2563eb; color: white; padding: 8px; text-align: right; }
                                .items-table td { border: 1px solid #d1d5db; padding: 8px; }
                                .financials { width: 40%; margin-right: auto; margin-top: 15px; font-size: 11px; }
                                .financials td { padding: 5px; border: 1px solid #d1d5db; }
                                .stamp-box { display: flex; justify-content: space-between; margin-top: 30px; }
                                .stamp { width: 110px; height: 110px; border: 3px double #2563eb; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #2563eb; font-size: 8px; transform: rotate(-7deg); }
                                .stamp-inner { border: 1px dashed #2563eb; width: 100px; height: 100px; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; }
                              </style>
                            </head>
                            <body onload="window.print();window.close();">
                              <div class="invoice-box">
                                ${printContents}
                              </div>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }
                    }
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-sans text-xs font-bold px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>چاپ فاکتور</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
