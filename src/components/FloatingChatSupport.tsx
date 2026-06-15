import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Gift, 
  Truck, 
  Search, 
  Calculator, 
  Copy, 
  Check, 
  Bell, 
  Clock, 
  Lock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  isOrderPromo?: boolean;
  orderData?: {
    id: string;
    service: string;
    statusText: string;
    progress: number;
    price: string;
  };
}

export default function FloatingChatSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [unreadCount, setUnreadCount] = useState(1);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: 'سلام همکار گرامی! به پرتال پشتیبانی صنف آرین دیجیتال خوش آمدید. من دستیار هوشمند و برآورد آنلاین صنف هستم. 💬\n\nامروز چطور می‌توانم شما را راهنمایی کنم؟',
        time: new Date().toLocaleTimeString('fa-IR').slice(0, 5)
      }
    ]);
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleQuickAction = (actionKey: string) => {
    let userText = '';
    let botReplyText = '';
    let orderData = undefined;
    let isPromo = false;

    if (actionKey === 'promo') {
      userText = 'دریافت کدهای تخفیف فعال صنف 🎁';
      botReplyText = 'فوق‌العاده است! امروز دو کد تخفیف انحصاری به مناسبت ارتقای خدمات ترابری برای شما داریم:\n\n🎟️ کدهای تخفیف فعال:\n• **ARIAN2026** (۲۰٪ تخفیف روی خدمات تایپ و متون)\n• **STARTUP** (۱۵٪ تخفیف ویژه روی طراحی لوگو و امور گرافیک)\n\nکافیست هنگام ثبت فاکتور در شبیه‌ساز، این کدها را وارد کنید تا مستقیماً اعمال شوند.';
      isPromo = true;
    } else if (actionKey === 'courier_info') {
      userText = 'سوال درباره حمل فیزیکی محصولات (اسنپ/تپ‌سی) 📦';
      botReplyText = 'برای تمام خدماتی که خروجی فیزیکی دارند (مانند کتابچه‌های تایپ شده، کاتالوگ‌های لوکس چاپ شده، هارد رسانه و کارت هدیه‌ها)، ما با یک کلیک اتصال امن به سرویس‌های هوشمند **اسنپ باکس (Snapp Box)** و **تپ‌سی پیک (Tap30)** را فراهم کرده‌ایم.\n\n📍 با ورود به پرتال شبیه‌ساز و در کادر جزئیات سفارش فرآیند، دکمه انتخاب موقعیت جغرافیایی روی نقشه ماهواره‌ای فعال است. با زدن لوکیشن، کرایه دقیق محاسبه شده و سفیر برای شما اعزام می‌شود!';
    } else if (actionKey === 'pricing') {
      userText = 'تعرفه‌های پایه خدمات برتر صنف 💵';
      botReplyText = 'نرخ‌های روز مصوب صنف آرین دیجیتال به شرح زیر است:\n\n✍️ • **خدمات تایپ تخصصی**: ۱۵,۰۰۰ تومان به ازای هر صفحه استاندارد\n🎨 • **طراحی لوگو اختصاصی**: ۲,۸۰۰,۰۰۰ تومان برای اتود مفهومی لایه‌باز\n💳 • **گیفت کارت آمازون**: نرخ مستقیم ۶,۳۰۰ تومان بهای هر دلار شارژ\n🌍 • **بخش حوالجات ارزی**: بر اساس نرخ لحظه‌ای گمرک با حداقل کارمزد جهانی.\n\nتمامی تعرفه‌ها توسط پنل مدیریت صنف به طور زنده تعدیل می‌گردند.';
    } else if (actionKey === 'track') {
      userText = 'رهگیری سفارش فعال 🔍';
      botReplyText = 'لطفاً یکی از شماره سفارش‌های زیر را بنویسید یا برای تست مستقیم روی دکمه‌های زیر ضربه بزنید تا پیشرفت لحظه‌ای کار را واکشی کنم:\n\n• **AD-9418** (سفارش طراحی کاتالوگ)\n• **AD-1234** (طراحی لوگو هلدینگ رادان)\n• **AD-5555** (حواله لیر ترکیه)';
    }

    if (!userText) return;

    // Add user msg
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString('fa-IR').slice(0, 5)
    };

    setMessages(prev => [...prev, userMsg]);

    // Bot response after delay
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        sender: 'bot',
        text: botReplyText,
        time: new Date().toLocaleTimeString('fa-IR').slice(0, 5),
        isOrderPromo: isPromo
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString('fa-IR').slice(0, 5)
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate smart bot response based on content
    setTimeout(() => {
      let replyText = 'پیام شما دریافت شد. من یک مدل دستیار آزمایشی هستم. برای استعلام سریع می‌توانید کلماتی مانند "تخفیف"، "قیمت" یا "پیک" را تایپ کنید، یا یکی از کدهای سفارش "AD-9418" یا "AD-1234" را وارد کنید تا وضعیت را به صورت زنده نمایش دهم!';
      let orderDataTemp = undefined;

      const normText = userText.toLowerCase().replace(/\s+/g, '');
      
      if (normText.includes('9418') || normText.includes('ad9418')) {
        replyText = '✓ اطلاعات سفارش شماره **AD-9418** با موفقیت واکشی شد:';
        orderDataTemp = {
          id: 'AD-9418',
          service: 'طراحی تخصصی کاتالوگ ۱۶ صفحه آذرخش',
          statusText: 'در حال طراحی اتود اولیه (۶۰٪)',
          progress: 60,
          price: '۳,۵۰۰,۰۰۰ تومان'
        };
      } else if (normText.includes('1234') || normText.includes('ad1234')) {
        replyText = '✓ اطلاعات سفارش شماره **AD-1234** با موفقیت واکشی شد:';
        orderDataTemp = {
          id: 'AD-1234',
          service: 'طراحی لوگوی خلاق هلدینگ رادان',
          statusText: 'تحویل تایید شده نهایی (۱۰۰٪)',
          progress: 100,
          price: '۷,۲۰۰,۰۰۰ تومان'
        };
      } else if (normText.includes('5555') || normText.includes('ad5555')) {
        replyText = '✓ اطلاعات سفارش شماره **AD-5555** با موفقیت واکشی شد:';
        orderDataTemp = {
          id: 'AD-5555',
          service: 'حواله ارزی لیر مسافرتی ترکیه',
          statusText: 'در انتظار تصفیه تاییدات کارگزار (۲۵٪)',
          progress: 25,
          price: '۵۷,۰۰۰ تومان هر واحد'
        };
      } else if (normText.includes('تخفیف') || normText.includes('promo') || normText.includes('کپون')) {
        replyText = 'کدهای تخفیف با موفقیت بازیابی شدند:\n\n🎁 **ARIAN2026** (۲۰٪ تخفیف روی متون و تایپ)\n🎁 **STARTUP** (۱۵٪ تخفیف فاکتورسازی لوگو)';
      } else if (normText.includes('پیک') || normText.includes('اسنپ') || normText.includes('تپسی') || normText.includes('ارسال')) {
        replyText = 'بله! سامانه حمل فیزیکی آرین دیجیتال با سرویس‌های **اسنپ‌باکس** و **تپ‌سی پیک** همگام شده است. هنگام کار با شبیه‌ساز فاکتور، با انتخاب ثبت لوکیشن از نقشه ماهواره‌ای، سفارش فیزیکی شما مستقیماً با پیک فرستاده و لحظه‌ای رهگیری خواهد شد. 🛵';
      } else if (normText.includes('قیمت') || normText.includes('تعرفه') || normText.includes('هزینه')) {
        replyText = 'نرخ‌های روز مصوب صنف آرین دیجیتال:\n\n• تایپ تخصصی: ۱۵,۰۰۰ تومان\n• طراحی لوگو: ۲,۸۰۰,۰۰۰ تومان\n• دلار گیفت کارت: ۶,۳۰۰ تومان\n\nبرای محاسبه فاقد خطا، لطفا از ماشین‌حساب فرمولار سایت استفاده بفرمایید.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString('fa-IR').slice(0, 5),
        orderData: orderDataTemp
      };

      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpenToggle}
          className="relative bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full p-4 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ring-4 ring-indigo-500/20 group cursor-pointer"
          style={{ width: '60px', height: '60px' }}
        >
          {isOpen ? (
            <X className="w-6 h-6 animate-in spin-in-90 duration-200" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 animate-pulse" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-amber-500 text-slate-950 font-sans font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-[#0B0F1A]">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat Pop-Up Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed bottom-24 right-6 w-[350px] md:w-[380px] bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans text-right text-slate-100"
            style={{ height: '520px' }}
            dir="rtl"
          >
            {/* Widget Header */}
            <div className="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] border-b border-indigo-950/40 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-xs border border-indigo-400/30">
                    آر
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-indigo-900" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-1.5 leading-none">
                    <span>پشتیبانی صنف آرین دیجیتال</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </h4>
                  <span className="text-[9px] text-[#818CF8] block mt-1 font-medium">دستیار هوشمند و رهگیری آنلاین</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/40 scrollbar-thin">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className="space-y-1 max-w-[85%]">
                      {/* Message bubble */}
                      <div className={`p-3 rounded-2xl text-[11px] leading-relaxed relative ${
                        isBot 
                          ? 'bg-slate-800/80 text-slate-200 rounded-tr-none border border-slate-750' 
                          : 'bg-indigo-600 text-white rounded-tl-none font-medium'
                      }`}>
                        <div className="whitespace-pre-line">{msg.text}</div>
                        <span className={`text-[8px] block text-left mt-1.5 ${isBot ? 'text-slate-500' : 'text-slate-300'}`}>
                          {msg.time}
                        </span>
                      </div>

                      {/* Attached Promo codes visual container */}
                      {isBot && msg.isOrderPromo && (
                        <div className="bg-[#1e1b4b]/60 border border-indigo-500/20 p-2.5 rounded-2xl flex flex-col gap-2 shadow-inner">
                          <div className="flex items-center justify-between text-[10px] bg-slate-900/60 p-2 rounded-xl">
                            <span className="font-mono font-bold text-amber-400">ARIAN2026</span>
                            <button
                              onClick={() => copyToClipboard('ARIAN2026')}
                              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedCode === 'ARIAN2026' ? (
                                <span className="text-emerald-400 font-bold">کپی شد! ✅</span>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>کپی طرح</span>
                                </>
                              )}
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between text-[10px] bg-slate-900/60 p-2 rounded-xl">
                            <span className="font-mono font-bold text-amber-400">STARTUP</span>
                            <button
                              onClick={() => copyToClipboard('STARTUP')}
                              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedCode === 'STARTUP' ? (
                                <span className="text-emerald-400 font-bold">کپی شد! ✅</span>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>کپی طرح</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Render live trackable order widget inside chatbot */}
                      {isBot && msg.orderData && (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl space-y-2 text-[10px] shadow-lg animate-in fade-in-50 duration-200">
                          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                            <strong className="text-indigo-400">{msg.orderData.id}</strong>
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                              {msg.orderData.price}
                            </span>
                          </div>
                          
                          <p className="text-white font-bold text-[10.5px]">{msg.orderData.service}</p>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[8px] text-slate-400">
                              <span>وضعیت: {msg.orderData.statusText}</span>
                              <span>{msg.orderData.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${msg.orderData.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Fast Quick Actions selection board */}
            {messages.length < 8 && (
              <div className="p-3 bg-slate-900/80 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleQuickAction('track')}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-850 p-2 rounded-xl text-slate-300 font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>رهگیری سفارش فعال 🔍</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAction('promo')}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-850 p-2 rounded-xl text-slate-300 font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>دریافت کدهای تخفیف 🎁</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAction('courier_info')}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-850 p-2 rounded-xl text-slate-300 font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>تحویل اسنپ/تپ‌سی 📦</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAction('pricing')}
                  className="bg-slate-950 border border-slate-800 hover:bg-slate-850 p-2 rounded-xl text-slate-300 font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>تعرفه‌های صنف 💵</span>
                </button>
              </div>
            )}

            {/* Chat Input form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800/80 bg-slate-950 flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="اینجا کلمه‌ای تایپ یا شناسه سفارش وارد کنید..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 transform rotate-180" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
