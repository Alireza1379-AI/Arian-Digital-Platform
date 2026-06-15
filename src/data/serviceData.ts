export interface Service {
  id: string;
  name: string;
  category: 'payment' | 'creative' | 'office' | 'giftcard' | 'student' | 'print';
  pricingType: 'page' | 'sample' | 'dollar' | 'fixed' | 'meter';
  basePrice: number; // in Tomans
  description: string;
  placeholder?: string;
  minQty?: number;
}

export const ATRIAN_SERVICES: Service[] = [
  // --- نرخنامه تخصصی خدمات طراحی نرم افزار و گرافیک و پشتیبانی برخط ---
  {
    id: 'online-payment-general',
    name: 'پرداخت هزینه‌های آنلاین',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 200000,
    description: 'کارمزد ثابت پرداخت‌های اینترنتی مستقیم بابت خریدهای عمومی وب‌سایت‌های خارجی.',
    minQty: 1
  },
  {
    id: 'typing-special',
    name: 'تایپ ساده فوری (الفاظ عمومی)',
    category: 'office',
    pricingType: 'page',
    basePrice: 180000,
    description: 'تایپ ساده فوری حداقل هر برگ ۱۸ سطر با فونت ۱۶ مصوب صنف.',
    placeholder: 'تعداد برگه‌های مورد نیاز',
    minQty: 1
  },
  {
    id: 'operator-email',
    name: 'ایجاد ایمیل توسط اپراتور واحد صنف',
    category: 'office',
    pricingType: 'fixed',
    basePrice: 200000,
    description: 'پیکربندی ایمیل‌های تجاری یا عمومی به همراه تنظیم امنیتی دو مرحله‌ای توسط اپراتور.',
    minQty: 1
  },
  {
    id: 'powerpoint-page',
    name: 'ایجاد هر صفحه در پاورپوینت',
    category: 'office',
    pricingType: 'page',
    basePrice: 100000,
    description: 'طراحی، زیباسازی و صفحه‌آرایی اسلایدهای پاورپوینت به ازای هر صفحه اسلاید.',
    placeholder: 'تعداد اسلایدهای مورد نیاز',
    minQty: 1
  },
  {
    id: 'logo-1-etude',
    name: 'طراحی نشانه (لوگو) - ۱ اتود',
    category: 'creative',
    pricingType: 'sample',
    basePrice: 2500000,
    description: 'خلق نشانه بصری و هویت برند با ۱ اتود اولیه کاملاً اختصاصی و لایه‌باز.',
    minQty: 1
  },
  {
    id: 'logo-redesign-fixed',
    name: 'بازسازی یا ویرایش لوگو',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 1500000,
    description: 'به‌روزرسانی، وکتورایز کردن و تصحیح گرافیکی نشانه‌های تجاری قدیمی.',
    minQty: 1
  },
  {
    id: 'brochure-flayer',
    name: 'بروشور تک‌برگ، تراکت یا فلایر',
    category: 'creative',
    pricingType: 'sample',
    basePrice: 1600000,
    description: 'طراحی بروشورهای تبلیغاتی تک‌برگی، تراکت یا فلایرهای اطلاع‌رسانی لایه‌باز.',
    minQty: 1
  },
  {
    id: 'brochure-pages-8',
    name: 'طراحی صفحات داخلی بروشور (تا ۸ صفحه)',
    category: 'creative',
    pricingType: 'page',
    basePrice: 2000000,
    description: 'طراحی لایه‌باز صفحات داخلی بروشورهای تبلیغاتی تا سقف ۸ صفحه.',
    placeholder: 'تعداد صفحات بروشور',
    minQty: 1
  },
  {
    id: 'catalog-pages-16',
    name: 'طراحی صفحات داخلی کاتالوگ (تا ۱۶ صفحه)',
    category: 'creative',
    pricingType: 'page',
    basePrice: 1400000,
    description: 'طراحی و صفحه‌آرایی کاتالوگ‌های جامع شرکتی تا سقف ۱۶ صفحه.',
    placeholder: 'تعداد صفحات کاتالوگ',
    minQty: 1
  },
  {
    id: 'social-posts-5',
    name: 'طراحی پست و استوری تک‌فریم شبکه‌های اجتماعی',
    category: 'creative',
    pricingType: 'sample',
    basePrice: 1100000,
    description: 'طراحی کاورها و پست‌های تک‌فریم شبکه‌های اجتماعی تا ۵ نمونه متمایز.',
    placeholder: 'تعداد پست/استوری',
    minQty: 1
  },
  {
    id: 'infographic-a4',
    name: 'ساخت اینفوگرافیک (ابعاد A4)',
    category: 'creative',
    pricingType: 'sample',
    basePrice: 750000,
    description: 'طراحی گرافیکی اینفوگرافیک با ساختار بصری ساده جهت انتقال آسان آمار پروژه.',
    minQty: 1
  },
  {
    id: 'ui-figma-ai',
    name: 'طراحی رابط کاربری اپلیکیشن UI (Figma + AI)',
    category: 'creative',
    pricingType: 'page',
    basePrice: 8000000,
    description: 'طراحی اسکرین‌های رابط کاربری در نرم‌افزار فیگما با استفاده ممیزی هوش مصنوعی.',
    placeholder: 'تعداد اسکرین‌های طراحی',
    minQty: 1
  },
  {
    id: 'banner-simple',
    name: 'طراحی بنر ساده (متن + لوگو)',
    category: 'creative',
    pricingType: 'sample',
    basePrice: 1000000,
    description: 'طراحی بنرهای اینترنتی یا چاپی ساده شامل متن و لوگوی مشتری به ازای هر طرح.',
    minQty: 1
  },
  {
    id: 'banner-professional',
    name: 'طراحی بنر حرفه‌ای (با گرافیک برجسته)',
    category: 'creative',
    pricingType: 'sample',
    basePrice: 1800000,
    description: 'طراحی بنرهای مدرن با تصاویر تلفیقی و سناریوی جذاب به ازای هر طرح.',
    minQty: 1
  },
  {
    id: 'sticker-design',
    name: 'طراحی استیکر (لوگو + آیکون)',
    category: 'creative',
    pricingType: 'sample',
    basePrice: 1000000,
    description: 'طراحی استیکرهای تجاری اختصاصی شامل آیکوگرافی و المان‌های برند سازی.',
    minQty: 1
  },

  // --- گیفت کارت ها و لایسنس ها ---
  {
    id: 'giftcard-apple-10',
    name: 'خرید گیفت کارت اپل (Apple ID) - هر ۱۰ دلار ارزش',
    category: 'giftcard',
    pricingType: 'dollar',
    basePrice: 120000,
    description: 'شارژ ایمن اپ ال آیدی جهت خرید پکیج‌ها و تسویه حساب داخل برنامه‌ای.',
    placeholder: 'واحد‌های ۱۰ دلاری مورد نظر',
    minQty: 1
  },
  {
    id: 'giftcard-amazon-10',
    name: 'خرید گیفت کارت آمازون - هر ۱۰ دلار ارزش',
    category: 'giftcard',
    pricingType: 'dollar',
    basePrice: 120000,
    description: 'شارژ حساب خریدهای بین‌المللی کیندل و اشتراک وب‌آمازون.',
    placeholder: 'واحد‌های ۱۰ دلاری مورد نظر',
    minQty: 1
  },
  {
    id: 'giftcard-playstation-10',
    name: 'خرید گیفت کارت پلی‌استیشن - هر ۱۰ دلار ارزش',
    category: 'giftcard',
    pricingType: 'dollar',
    basePrice: 150000,
    description: 'گیفت کارت شبکه پلی‌استیشن ۴ و ۵ جهت خرید بازی‌های اورجینال.',
    placeholder: 'واحد‌های ۱۰ دلاری مورد نظر',
    minQty: 1
  },
  {
    id: 'giftcard-xbox-10',
    name: 'اجرت خرید گیفت کارت ایکس‌باکس - هر ۱۰ دلار ارزش',
    category: 'giftcard',
    pricingType: 'dollar',
    basePrice: 150000,
    description: 'خرید بازی و اشتراک لایو گیم پس شرکت مایکروسافت.',
    placeholder: 'واحد‌های ۱۰ دلاری مورد نظر',
    minQty: 1
  },
  {
    id: 'giftcard-steam-10',
    name: 'اجرت خرید گیفت کارت استیم - هر ۱۰ دلار ارزش',
    category: 'giftcard',
    pricingType: 'dollar',
    basePrice: 130000,
    description: 'شارژ مستقیم والت استیم جهت خریدهای اورجینال بازی‌های کامپیوتری.',
    placeholder: 'واحد‌های ۱۰ دلاری مورد نظر',
    minQty: 1
  },
  {
    id: 'giftcard-google-10',
    name: 'اجرت خرید گیفت کارت گوگل پلی - هر ۱۰ دلار ارزش',
    category: 'giftcard',
    pricingType: 'dollar',
    basePrice: 120000,
    description: 'شارژ حساب کاربری گوگل‌پلی جهت بازی‌ها و نرم‌افزارهای اندرویدی.',
    placeholder: 'واحد‌های ۱۰ دلاری مورد نظر',
    minQty: 1
  },
  {
    id: 'giftcard-netflix-10',
    name: 'اجرت خرید گیفت کارت نتفلیکس - هر ۱۰ دلار ارزش',
    category: 'giftcard',
    pricingType: 'dollar',
    basePrice: 130000,
    description: 'خرید کدهای تمدید ماهانه برای نمایش آنلاین فیلم و سریال نتفلیکس.',
    placeholder: 'واحد‌های ۱۰ دلاری مورد نظر',
    minQty: 1
  },

  // --- پرداخت‌های بین‌المللی تخصصی ---
  {
    id: 'payment-foreign-percent',
    name: 'اجرت پرداخت عمومی در سایت‌های خارجی',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 500000,
    description: 'تسویه سبدهای خرید، اشتراک‌ها و سرویس‌دهنده‌های غیراختصاصی در درگاه بین‌الملل.',
    minQty: 1
  },
  {
    id: 'payment-ielts-toefl',
    name: 'اجرت پرداخت هزینه آزمون آیلتس / تافل / PTE',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 1000000,
    description: 'رزرو قطعی و پرداخت مستقیم هزینه‌های ثبت‌نام رسمی آزمون‌های زبان خارج کشور.',
    minQty: 1
  },
  {
    id: 'sub-adobe-creative',
    name: 'اجرت خرید اشتراک Adobe Creative Cloud (یک ماهه)',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 650000,
    description: 'فعال‌سازی ایمن لایسنس مجموعه نرم‌افزاری ادوبی روی ایمیل شخصی مشتری.',
    minQty: 1
  },
  {
    id: 'sub-linkedin-premium',
    name: 'اجرت خرید اشتراک LinkedIn Premium (تریال اولیه)',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 600000,
    description: 'فعال‌سازی تریال اولیه پریمیوم شبکه لینکدین جهت بهبود وضعیت استخدام.',
    minQty: 1
  },
  {
    id: 'payment-bills-intl',
    name: 'اجرت پرداخت قبوض بین‌المللی (iCloud, Amazon Prime)',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 500000,
    description: 'تسویه معتبر قبوض ماهانه هاست، اکانت کلود یا بسته‌های پرایم.',
    minQty: 1
  },
  {
    id: 'crypto-buy-fee',
    name: 'اجرت خرید ارز دیجیتال (تتر، بیتکوین و...)',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 350000,
    description: 'تسویه ریالی و واریز امن انواع رمزارز به کیف‌پول معرفی شده توسط مشتری.',
    minQty: 1
  },
  {
    id: 'crypto-sell-fee',
    name: 'اجرت فروش ارز دیجیتال و تبدیل به ریال',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 350000,
    description: 'دریافت رمزارز از مشتری و تسویه پایا/ساتنا به حساب‌های بانکی داخلی.',
    minQty: 1
  },
  {
    id: 'crypto-wallet-recovery',
    name: 'اجرت بازیابی کیف پول (Recovery Seed)',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 5000000,
    description: 'عیب‌یابی، رمزگشایی و ریکاوری کلیدهای خصوصی مفقود شده با رعایت مسائل حریم‌خصوصی.',
    minQty: 1
  },
  {
    id: 'sub-claude-pro',
    name: 'اجرت خرید/ارتقا اکانت Claude Pro / Team (Anthropic)',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 800000,
    description: 'شارژ حساب پریمیوم دستیار هوش مصنوعی کلود شرکت آنتروپیک.',
    minQty: 1
  },
  {
    id: 'sub-chatgpt-plus',
    name: 'اجرت خرید/ارتقا اکانت ChatGPT Plus / Pro',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 800000,
    description: 'فعال‌سازی مستقیم یا خرید اکانت اختصاصی چت‌جی‌پی‌تی پلاس هوش مصنوعی OpenAI.',
    minQty: 1
  },
  {
    id: 'sub-cursor-copilot',
    name: 'خرید اکانت Cursor Pro / GitHub Copilot',
    category: 'payment',
    pricingType: 'fixed',
    basePrice: 700000,
    description: 'خرید یا تمدید لایسنس ادیتورهای برنامه‌نویسی هوشمند کسر و گیت‌هاب کوپایلت.',
    minQty: 1
  },

  // --- طراحی و پیاده‌سازی بازی و نرم‌افزار (بخش متمرکز گرافیک و کد صنف) ---
  {
    id: 'game-platformer-simple',
    name: 'طراحی بازی پلتفرمر ساده (Mario) - ۵ تا ۱۰ مرحله',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 18000000,
    description: 'پیاده‌سازی بازی رترو دوبعدی با استفاده از موتور یونیتی/گودوت با طراحی مراحل مقدماتی.',
    minQty: 1
  },
  {
    id: 'game-platformer-medium',
    name: 'بازی پلتفرمر متوسط با سیستم ارتقا و آیتم - ۲۰+ مرحله',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 38000000,
    description: 'طراحی بازی پلتفرمر همراه با مکانیک پیشرفته خرید سلاح، ذخیره‌سازی ابری و منوهای کامل.',
    minQty: 1
  },
  {
    id: 'game-puzzle',
    name: 'بازی پازل/پازلی-داستانی (مانند Candy Crush)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 15000000,
    description: 'طراحی بازی تطبیق المان‌ها مجهز به جلوه‌های صوتی خلاقانه و مراحل مهیج.',
    minQty: 1
  },
  {
    id: 'game-rpg-2d',
    name: 'بازی RPG دوبعدی با داستان و دیالوگ - ۵+ ساعت گیم‌پلی',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 80000000,
    description: 'توسعه بازی نقش‌آفرینی دوبعدی با درخت گفت‌وگوی تفصیلی، مدیریت موجودی و نقشه بزرگ.',
    minQty: 1
  },
  {
    id: 'game-hyper-casual',
    name: 'بازی Hyper Casual (بازی‌های ساده موبایلی)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 12000000,
    description: 'توسعه سریع بازی روانشناختی و به شدت اعتیادآور موبایل به همراه ادغام تبلیغات درون‌برنامه.',
    minQty: 1
  },
  {
    id: 'game-fps-shooter',
    name: 'بازی شوتر اول‌شخص (FPS) - ۵ مرحله تک‌نفره',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 50000000,
    description: 'طراحی شوتر سه‌بعدی با هوش مصنوعی مهاجم، شبیه‌سازی فیزیک سلاح و مسیرهای سخت.',
    minQty: 1
  },
  {
    id: 'game-tps-cover',
    name: 'بازی شوتر سوم‌شخص (TPS) با سیستم پوشش',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 85000000,
    description: 'طراحی شوتر سوم‌شخص با انیمیشن‌های سنگرگیری، شبیه‌سازی پرتابه‌ها و زاویه دید پویا.',
    minQty: 1
  },
  {
    id: 'game-racing-10',
    name: 'بازی مسابقه‌ای (Racing) با ۱۰ ماشین و ۵ پیست',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 65000000,
    description: 'اسپورت سه‌بعدی خودروها، شبیه‌ساز دریفت، جدول لیدربورد و سیستم هندلینگ دقیق چرخ‌ها.',
    minQty: 1
  },
  {
    id: 'game-horror-3',
    name: 'بازی ترسناک (Horror) - ۳ تا ۵ مرحله',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 55000000,
    description: 'طراحی ترس اتمسفریک سه‌بعدی، معماهای صوتی، پازل‌های محیطی و تعقیب هیولا.',
    minQty: 1
  },
  {
    id: 'game-open-world-1',
    name: 'بازی جهان باز کوچک (Open World) - ۱ کیلومتر مربع',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 160000000,
    description: 'پیاده‌سازی بازی جهان‌آزاد با مینی‌مپ، حیات فلو خودروها و شهروندان و ماموریت‌های فرعی.',
    minQty: 1
  },
  {
    id: 'game-rts-strategic',
    name: 'بازی استراتژیک بلادرنگ (RTS)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 100000000,
    description: 'مدیریت و کنترل همزمان سربازان، تولید منابع، ساخت پایگاه‌ها و جنگ‌های تاکتیکی با نقشه مه‌آلود.',
    minQty: 1
  },
  {
    id: 'game-simulation-farm',
    name: 'بازی شبیه‌سازی (Simulation) - کشاورزی/شهرسازی',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 120000000,
    description: 'سیستم‌های اقتصادی پیچیده، شبیه‌ساز رشد گیاهان یا فرآیند ارتقاء ساختمان شهروندان.',
    minQty: 1
  },
  {
    id: 'game-casual-unity',
    name: 'بازی کژوال موبایل (iOS/Android) - Unity/Godot',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 18000000,
    description: 'منتشر شده جهت موبایل همراه با خروجی بهینه اندروید و آی‌او‌اس در گودوت.',
    minQty: 1
  },
  {
    id: 'game-battle-royale',
    name: 'بازی بتل رویال موبایل (مانند PUBG Mobile)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 300000000,
    description: 'پروژه کلان آنلاین، متصل به سرور ابری مالتی‌پلیر، سیستم چتر نجات، لوت و رینگی شدن زون.',
    minQty: 1
  },
  {
    id: 'game-mmo-mobile',
    name: 'بازی MMO موبایل (چند نفره آنلاین گسترده)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 370000000,
    description: 'پلتفرم لایسنس سرور با تعامل چت همزمان، اصالت هویت کاربران و مدیریت دیتاسنتر لابی.',
    minQty: 1
  },
  {
    id: 'game-html5-web',
    name: 'بازی تحت وب HTML5 (بازی ساده مرورگری)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 20000000,
    description: 'ایده‌آل برای وب‌سایت‌های قرعه‌کشی و کمپین‌های مارکتینگ تجاری.',
    minQty: 1
  },
  {
    id: 'game-io-multi',
    name: 'بازی .io (مانند Agar.io) - چند نفره بلادرنگ',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 40000000,
    description: 'وب‌سوکت فریمورک پرسرعت جهت حرکت روان چندین بازیکن روی صفحه زنده.',
    minQty: 1
  },
  {
    id: 'game-multiplayer-16',
    name: 'بازی چندنفره آنلاین (MP) - تا ۱۶ بازیکن',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 100000000,
    description: 'سیستم سرور-کلاینت موازی برای کنترل برخوردها، پینگ و رنکینگ بازیکنان.',
    minQty: 1
  },
  {
    id: 'game-iap-payment',
    name: 'سیستم پرداخت درون‌برنامه‌ای (IAP) برای بازی',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 15000000,
    description: 'اتصال سبد خرید بازی موبایل به کافه بازار، مایکت یا گوگل‌پلی.',
    minQty: 1
  },

  // --- توسعه وب‌سایت و پلتفرم‌های نرم‌افزاری ---
  {
    id: 'web-corporate-wordpress',
    name: 'وب‌سایت شرکتی/شخصی (۵ تا ۱۰ صفحه) - WordPress/HTML',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 12000000,
    description: 'طراحی سایت رسمی با هویت اختصاصی، بهینه‌سازی شده در صفحات و مجهز به فرم تماس.',
    minQty: 1
  },
  {
    id: 'web-shop-advanced',
    name: 'وب‌سایت فروشگاهی پیشرفته (Laravel/Node.js) - چندفروشندگی',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 75000000,
    description: 'فروشگاه چند فروشگاهی مدرن، مجهز به درگاه‌ها، پنل حساب کاربری، انبارداری و چت.',
    minQty: 1
  },
  {
    id: 'web-social-small',
    name: 'شبکه اجتماعی کوچک (مانند Twitter clone)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 130000000,
    description: 'سیستم پست‌گذاری، هشتگ‌ها، دنبال کردن، اعلانات آنی و ادیتور متون مدرن.',
    minQty: 1
  },
  {
    id: 'web-booking-system',
    name: 'سیستم رزرو آنلاین (هتل/رستوران/پزشک)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 50000000,
    description: 'ثبت نوبت هوشمند بر اساس تقویم شمسی جلالی بدون تداخل با پیامک تایید خودکار.',
    minQty: 1
  },
  {
    id: 'app-shop-payment',
    name: 'اپلیکیشن فروشگاهی با درگاه پرداخت مستقیم',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 45000000,
    description: 'اپلیکیشن نیتیو اندروید و آی‌او‌اس با قابلیت فیلترینگ و سبد خرید جامع.',
    minQty: 1
  },
  {
    id: 'app-food-delivery',
    name: 'اپلیکیشن تحویل غذا (مانند اسنپ‌فود)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 150000000,
    description: 'همراه با پنل رستوران‌ها، پنل رانندگان پیک‌ها و خروجی شهروندان با لوکیشن زنده.',
    minQty: 1
  },
  {
    id: 'app-taxi-online',
    name: 'اپلیکیشن تاکسی اینترنتی (مانند اسنپ/تپسی)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 275000000,
    description: 'مشتمل بر دو اپلیکیشن مجزا (راننده و مسافر) مجهز به تخمین بها بر مبنای نقشه خیابانی.',
    minQty: 1
  },
  {
    id: 'app-social-media-main',
    name: 'اپلیکیشن شبکه اجتماعی (چت، استوری، فید)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 170000000,
    description: 'ارسال تصاویر، چت‌های خصوصی، لایک و فید الگوریتمی پویا.',
    minQty: 1
  },
  {
    id: 'app-fitness-gps',
    name: 'اپلیکیشن فیتنس/سلامت با ردیابی GPS',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 70000000,
    description: 'ترسیم مسیر دویدن مسواک‌های سلامتی کلاینت با سنسور شتاب‌سنج موبایل.',
    minQty: 1
  },
  {
    id: 'app-banking-secure',
    name: 'اپلیکیشن بانکی/کیف پول با مجوز مالی',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 200000000,
    description: 'پلتفرم تراکنش بانکی با فاکتورهای احراز هویت سفت و سخت و پین‌کد دومنظوره.',
    minQty: 1
  },
  {
    id: 'software-accounting-win',
    name: 'نرم‌افزار حسابداری ساده (Windows)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 45000000,
    description: 'ثبت دفاتر کل، صدور فاکتور رسمی چاپی، انبارداری کوچک و گزارش‌گیری فصلی.',
    minQty: 1
  },
  {
    id: 'software-inventory-barcode',
    name: 'نرم‌افزار انبارداری با بارکدخوان',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 55000000,
    description: 'اتصال به اسکنرهای سخت‌افزاری و به‌روزرسانی موجودی انبار به محض اسکن بارکد کالا.',
    minQty: 1
  },
  {
    id: 'software-video-editor',
    name: 'نرم‌افزار ویرایش تصویر/ویدئو (ابزار تخصصی)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 150000000,
    description: 'ابزار دسکتاپ بر مبنای کارت گرافیک جهت اعمال ترانزیشن‌ها و فیلترهای بصری.',
    minQty: 1
  },
  {
    id: 'api-rest-endpoints',
    name: 'طراحی REST API (۱۰ تا ۲۰ endpoint)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 15000000,
    description: 'طراحی ساختار دیتابیس نویسی بهینه با خروجی جی‌سان غنی مستند شده با Swagger.',
    minQty: 1
  },
  {
    id: 'api-graphql-database',
    name: 'طراحی GraphQL API با دیتابیس',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 30000000,
    description: 'امکان واکشی انتخابی المان‌ها جهت بهینه‌سازی ترافیک اپ موبایل.',
    minQty: 1
  },
  {
    id: 'security-auth-jwt',
    name: 'سیستم احراز هویت (Authentication) - JWT/OAuth',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 18000000,
    description: 'توکن‌نویسی ایمن، فعال‌سازی احراز هویت پیامکی و تایید هویت با حساب گوگل.',
    minQty: 1
  },
  {
    id: 'system-payment-gateway',
    name: 'سیستم پرداخت آنلاین (اتصال به درگاه بانکی)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 20000000,
    description: 'پیاده‌سازی درگاه پایا، شاپرک و زرین‌پال به همراه تایید و بازگشت خودکار تراکنش‌ها.',
    minQty: 1
  },
  {
    id: 'system-notification-push',
    name: 'سیستم نوتیفیکیشن (Push, Email, SMS)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 12000000,
    description: 'سیستم خودکار پیام اولویت‌بندی شده به ترتیب اهمیت از وب‌سرویس‌های معتبر.',
    minQty: 1
  },
  {
    id: 'system-search-elasticsearch',
    name: 'سیستم جستجوی پیشرفته (Elasticsearch)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 55000000,
    description: 'ایندکس‌گذاری داده‌های پرتراکم به همراه جستجوی فازی و عیب‌یابی سریع املایی.',
    minQty: 1
  },
  {
    id: 'system-websocket-realtime',
    name: 'سیستم Real-time (WebSocket/Socket.io)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 35000000,
    description: 'پیکربندی چت‌روم زنده، نقشه ترافیکی پویا و داشبورد اداری لحظه‌ای.',
    minQty: 1
  },
  {
    id: 'ai-chatbot-rule',
    name: 'چت‌بات ساده (قاعده‌محور)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 15000000,
    description: 'پاسخگویی درخت تصمیم‌گیری کلاینت بر مبنای کلمات کلیدی پرتکرار.',
    minQty: 1
  },
  {
    id: 'ai-chatbot-gpt',
    name: 'چت‌بات هوشمند (GPT/LLM integration)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 45000000,
    description: 'اتصال هوش‌های نسل جدید به دیتابیس کاتالوگ سازمان جهت پشتیبانی ۲۴ ساعته.',
    minQty: 1
  },
  {
    id: 'ai-image-classification',
    name: 'سیستم تشخیص تصویر (Image Classification)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 75000000,
    description: 'دسته‌بندی، ممیزی عکس‌ها و بازشناسی چهره به کمک فناوری تنسورفلو.',
    minQty: 1
  },
  {
    id: 'ai-nlp-sentiment',
    name: 'پردازش زبان طبیعی (NLP) - تحلیل احساسات',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 120000000,
    description: 'تحلیل پیشرفته نظرات کاربران و استخراج سیگنال‌ها و حس‌های منفی و مثبت از ادبیات مکتوب.',
    minQty: 1
  },
  {
    id: 'crm-simple-system',
    name: 'سیستم CRM ساده (مدیریت مشتریان)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 65000000,
    description: 'ثبت اطلاعات مشتریان، وضعیت پیشرفت فروش‌ها و تعریف قرارهای ملاقات تجاری.',
    minQty: 1
  },
  {
    id: 'crm-advanced-auto',
    name: 'سیستم CRM پیشرفته با اتوماسیون فروش',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 150000000,
    description: 'مکاتبه خودکار هوشمند، سیستم پیگیری بلیت‌ها و تحلیل راندمان کارمندان بصورت آماری.',
    minQty: 1
  },
  {
    id: 'erp-small-finance',
    name: 'سیستم ERP کوچک (مالی + انبار + فروش)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 210000000,
    description: 'یکپارچه‌سازی فرآیندهای مالی حسابداری، دفتری و لجستیک تولید ویژه کارگاه‌های صنعتی.',
    minQty: 1
  },
  {
    id: 'erp-complete-all',
    name: 'سیستم ERP کامل (تمامی ماژول‌ها)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 550000000,
    description: 'بسته جامع سازمانی متمرکز بر شبکه‌های داخلی توزیع و زنجیره ارزش.',
    minQty: 1
  },
  {
    id: 'hrm-people-management',
    name: 'سیستم مدیریت منابع انسانی (HRM)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 105000000,
    description: 'پرونده‌های الکترونیکی پرسنل، درخواست‌های مرخصی ساخت‌یافته و محاسبه حقوق دستمزد.',
    minQty: 1
  },
  {
    id: 'attendance-biometric',
    name: 'سیستم حضور و غیاب با دستگاه بیومتری',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 55000000,
    description: 'اتصال وب‌کامپوننت به سنسورهای تشخیص اثرانگشت یا اسکنر عنبیه چشم کارمندان.',
    minQty: 1
  },
  {
    id: 'project-jira-enterprise',
    name: 'سیستم مدیریت پروژه سازمانی (مانند Jira)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 175000000,
    description: 'برد چابک اسکرام/کانبان، ترکینگ زمان فعالیت‌ها و چرخه‌های کاری چندسازمانی.',
    minQty: 1
  },
  {
    id: 'automation-python-bash',
    name: 'اسکریپت اتوماسیون (Python/Bash) - تسک ساده',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 5000000,
    description: 'بهینه‌سازی عملیات تکراری، مرتب‌سازی لاگ‌ها و بک‌آپ‌های خودکار زمان‌بندی شده دیتابیس.',
    minQty: 1
  },
  {
    id: 'web-scraper-data',
    name: 'Web Scraper (استخراج داده از سایت)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 10000000,
    description: 'عنکبوت‌ها و اسکرپرهای اختصاصی پایتون جهت جمع‌آوری اطلاعات و فایل‌ها.',
    minQty: 1
  },
  {
    id: 'bot-telegram-discord',
    name: 'بات تلگرام / دیسکورد / واتساپ',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 15000000,
    description: 'ربات هوشمند پاسخگوی خودکار گروه‌ها با منوی پویا و اتصال به پایگاه داده داخلی.',
    minQty: 1
  },
  {
    id: 'bug-debugging-complex',
    name: 'رفع باگ و دیباگ تخصصی پروژه',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 5000000,
    description: 'به عهده گرفتن فرآیند دیباگ عاجل کلاینت بر اساس پیچیدگی کدهای ناقص قبلی (از ۵ تا ۲۵ میلیون تومان).',
    minQty: 1
  },
  {
    id: 'performance-optimization',
    name: 'بهینه‌سازی عملکرد (Performance Optimization)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 40000000,
    description: 'افزایش سرعت بارگذاری کاتالوگ، بهینه‌سازی کوئری‌های تنبل SQL و کش سرور.',
    minQty: 1
  },
  {
    id: 'software-testing-qa',
    name: 'تست نرم‌افزار و QA (تست کامل پروژه)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 18000000,
    description: 'تست‌های امنیت، پرفورمنس، تست نفوذ مقدماتی و تضمین کیفیت همخوانی ددلاین‌ها.',
    minQty: 1
  },
  {
    id: 'technical-documentation',
    name: 'مستندسازی فنی (Documentation)',
    category: 'creative',
    pricingType: 'fixed',
    basePrice: 10000000,
    description: 'نگارش داکیومنت کامل کدا، تشریح توابع API و راهنمای کامل استقرار محصول.',
    minQty: 1
  },

  // --- تعرفه خدمات دانشجویی (کارشناسی - ارشد - دکترا) ---
  // We represent the Bachelor price as baseline, and describe/note others
  {
    id: 'student-advisor',
    name: 'مشاوره انتخاب موضوع پایان‌نامه (کارشناسی)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 1500000,
    description: 'مشاوره انتخاب موضوع با بررسی خلاقیت، بررسی نوآوری و قابلیت ثبت و چاپ ژورنال. (ارشد: ۲,۸۰۰,۰۰۰ دکترا: ۵,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-literature',
    name: 'بررسی پیشینه پژوهش (Literature Review) - تا ۳۰ منبع',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2800000,
    description: 'تهیه و تحلیل پیشینه‌های پژوهش داخلی و خارجی تا ۳۰ منبع. (ارشد: ۴,۰۰۰,۰۰۰ دکترا: ۶,۵۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-concept',
    name: 'تدوین طرح تحقیقاتی اولیه (Research Concept Note)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2800000,
    description: 'طرح مفهومی چارچوب اولیه متغیرهای تحقیق. (ارشد: ۴,۸۰۰,۰۰۰ دکترا: ۹,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-proposal',
    name: 'نگارش پروپوزال علمی کارگشا',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 5000000,
    description: 'همیاری در نگارش پروپوزال و فرمت‌بندی شیوه دانشگاه. (ارشد: ۸,۰۰۰,۰۰۰ دکترا: ۱۵,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-revision',
    name: 'رفع ایرادات داوران پروپوزال (Revision)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2500000,
    description: 'تصحیح موشکافانه بر اساس بازخورد داوران نصر و دانشگاه. (ارشد: ۳,۵۰۰,۰۰۰ دکترا: ۶,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-methodology',
    name: 'طراحی متدولوژی پژوهش (Methodology Design)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2900000,
    description: 'طراحی روش‌شناسی تحقیق، استخراج فرمول‌ها و متغیرها. (ارشد: ۵,۸۰۰,۰۰۰ دکترا: ۱۲,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-chapter-by-chapter',
    name: 'مشاوره نگارش فصل‌به‌فصل پایان‌نامه (هر فصل)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3800000,
    description: 'مشاوره متمرکز بر نگارش علمی بندها و پیوند فصول بجز تحلیل آماری دکترا. (ارشد: ۸,۰۰۰,۰۰۰ دکترا: ۱۵,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-chapter4-findings',
    name: 'همیاری در نگارش فصل ۴ (یافته‌های تحقیق)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 5000000,
    description: 'ترسیم جداول، چارت‌ها و بررسی فرضیه‌ها. (ارشد: ۹,۵۰۰,۰۰۰ دکترا: ۲۰,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-chapter5-conclusion',
    name: 'همیاری در نگارش فصل ۵ (نتیجه‌گیری و پیشنهاد)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2800000,
    description: 'ارائه پیشنهادات کاربردی و مقایسه با پیشینیان پژوهش. (ارشد: ۵,۸۰۰,۰۰۰ دکترا: ۱۲,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-literary-edit',
    name: 'ویرایش ادبی و فنی پایان‌نامه (هر ۱۰۰ صفحه)',
    category: 'student',
    pricingType: 'page',
    basePrice: 3000000,
    description: 'ویرایش ساختاری، علائم نگارشی و زیباسازی متون فارسی برای هر سه طبقه دانش‌پژوهی.',
    minQty: 1
  },
  {
    id: 'student-isi-farsi',
    name: 'ویرایش تخصصی مقاله ISI/ISC (زبان فارسی)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 4000000,
    description: 'بهبود نگارش برای مجلات علمی ترویجی و پژوهشی سراسر کشور.',
    minQty: 1
  },
  {
    id: 'student-proofreading-english',
    name: 'ویرایش تخصصی مقاله انگلیسی (Proofreading)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 6000000,
    description: 'اصلاح گرامر، اصطلاحات علمی پراجکت‌ها توسط ویراستاران انگلیسی‌زبان بومی.',
    minQty: 1
  },
  {
    id: 'student-formatting-univ',
    name: 'فرمت‌بندی پایان‌نامه طبق شیوه دانشگاه',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3000000,
    description: 'تنظیم فونت‌ها، پاورقی، فاصله‌گذاری سربرگ‌ها و فهرست‌نویسی خودکار شیوه دانشگاه.',
    minQty: 1
  },
  {
    id: 'student-referencing-50',
    name: 'رفرنس‌دهی استاندارد (APA, IEEE) هر ۵۰ منبع',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 1200000,
    description: 'امکان منبع‌نویسی خودکار در سامانه‌های Mendeley یا EndNote به ازای ۵۰ منبع.',
    minQty: 1
  },
  {
    id: 'student-similarity-reduction',
    name: 'همانندجویی و کاهش درصد شباهت (ایرانداک)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2000000,
    description: 'بازنویسی بخش‌های کپی شده جهت برون‌رفت از فیلترهای اصالت ایرانداک و همانندجو.',
    minQty: 1
  },
  {
    id: 'student-summary-presentation',
    name: 'خلاصه سازی تخصصی مقاله (ارائه کلاسی)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2000000,
    description: 'آماده‌سازی یک فایل کوتاه از خلاصه‌نویسی مقالات جهت دفاع در سمینار کلاسی.',
    minQty: 1
  },
  {
    id: 'student-abstract',
    name: 'نگارش چکیده فارسی و انگلیسی (Abstract)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2000000,
    description: 'چکیده‌نویسی حرفه‌ای ترغیب‌کننده داوران ژورنال مشتمل بر کلمات کلیدی منتخب.',
    minQty: 1
  },
  {
    id: 'student-projects-code-basic',
    name: 'پروژه برنامه‌نویسی پایه (C++, Python, Java)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3500000,
    description: 'کدهای استاندارد با رعایت اصول ساختمان داده. (ارشد: ۴,۵۰۰,۰۰۰ دکترا: ۵,۵۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-projects-db',
    name: 'پروژه پایگاه داده (SQL, Oracle)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 7000000,
    description: 'اتصال تیبل‌ها، نوشتن تریگرها و ویوها. (ارشد: ۷,۵۰۰,۰۰۰ دکترا: ۸,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-ai-basic',
    name: 'پروژه هوش مصنوعی مقدماتی',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 8000000,
    description: 'پیاده‌سازی الگوریتم‌های درخت تصمیم یا کلونی مورچگان. (ارشد: ۹,۰۰۰,۰۰۰ دکترا: ۹,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-nn-ml',
    name: 'پروژه شبکه‌های عصبی و یادگیری ماشین',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 13000000,
    description: 'رگرسیون‌های چندگانه، پردازش‌های داده پرت. (ارشد: ۱۴,۰۰۰,۰۰۰ دکترا: ۱۵,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-ns2-ns3',
    name: 'شبیه‌سازی در NS2/NS3 (شبکه‌های بی‌سیم)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 15000000,
    description: 'مدل‌سازی توپولوژی شبکه و تخمین تاخیر و پکت لاس. (ارشد: ۱۷,۰۰۰,۰۰۰ دکترا: ۱۹,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-python-ml-dl',
    name: 'پیاده‌سازی در Python (تحلیل داده / ML / DL)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 12000000,
    description: 'کدهای خوانای پایتون برای پروژه‌های یادگیری عمیق. (ارشد: ۱۳,۵۰۰,۰۰۰ دکترا: ۱۵,۵۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-pytorch-tensorflow',
    name: 'پیاده‌سازی در PyTorch / TensorFlow',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 24000000,
    description: 'مدل‌سازی با فریمورک‌های پیشرو روز دنیا. (ارشد: ۲۶,۰۰۰,۰۰۰ دکترا: ۲۹,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-omnet-mininet',
    name: 'شبیه‌سازی در OMNeT++ / Mininet',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 24000000,
    description: 'شبیه‌ساز شبکه‌های نرم‌افزارمحور SDN. (ارشد: ۲۶,۰۰۰,۰۰۰ دکترا: ۲۹,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-comment-readme',
    name: 'مستندسازی کد (Comment + README)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2800000,
    description: 'افزودن کامنت‌های ساختاری و فایل راهنمای گام‌به‌گام. (ارشد: ۳,۸۰۰,۰۰۰ دکترا: ۴,۸۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-online-course-1h',
    name: 'آموزش آنلاین اجرای کد (جلسه ۱ ساعته)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 500000,
    description: 'توضیحات زنده پله به پله خطوط برنامه مشتری بابت جلسه دفاع. (ارشد: ۱,۵۰۰,۰۰۰ دکترا: ۳,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-debugging-code',
    name: 'دیباگ و رفع خطای کد دانشجویی',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2500000,
    description: 'حل خطاهای سینتکس و ارورهای ران‌تایم پروژه‌ها. (ارشد: ۳,۸۰۰,۰۰۰ دکترا: ۴,۸۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-questionnaire-design',
    name: 'طراحی پرسشنامه تخصصی',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 1500000,
    description: 'طراحی گویه‌ها بر مبنای مقیاس لیکرت به همراه روایی و پایایی. (ارشد: ۲,۸۰۰,۰۰۰ دکترا: ۴,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-spss-analysis',
    name: 'تحلیل آماری در SPSS (آمار توصیفی + استنباطی)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3800000,
    description: 'آزمون‌های همبستگی، تحلیل واریانس و خروجی غنی نرم‌افزاری. (ارشد: ۵,۰۰۰,۰۰۰ دکترا: ۶,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-r-python-data',
    name: 'تحلیل در R / Python (تحلیل داده پیشرفته)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 10000000,
    description: 'تحلیل پیشرفته خوشه‌بندی و بصری‌سازی با جی‌جی‌پلوت. (ارشد: ۱۳,۰۰۰,۰۰۰ دکترا: ۱۵,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-output-interpretation',
    name: 'تفسیر خروجی‌های آماری (نگارش فصل ۴)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2800000,
    description: 'تحلیل توصیفی و نگارش علمی بندهای فصل ۴ پایان‌نامه. (ارشد: ۴,۰۰۰,۰۰۰ دکترا: ۵,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-article-extract-farsi',
    name: 'استخراج مقاله از پایان‌نامه (فارسی)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 7000000,
    description: 'تنظیم ساختار مقاله علمی پژوهشی منطبق با استانداردهای داخلی. (ارشد: ۱۰,۰۰۰,۰۰۰ دکترا: ۱۲,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-article-extract-isi',
    name: 'استخراج مقاله از پایان‌نامه (ISI/ISC انگلیسی)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 11000000,
    description: 'فرمت‌بندی انگلیسی زبان مجلات اشپرینگر یا الزویر. (ارشد: ۱۳,۵۰۰,۰۰۰ دکترا: ۱۶,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-journal-advisor',
    name: 'مشاوره انتخاب ژورنال مناسب دانشگاهی',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 500000,
    description: 'شناسایی مجلات معتبر بلک‌لیست نشده صنف وزارت علوم. (ارشد: ۸۰۰,۰۰۰ دکترا: ۱,۴۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-response-reviewers',
    name: 'پاسخ به داوران (Response to Reviewers) هر مقاله',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3000000,
    description: 'نگارش علمی نامه‌های دفاع و رفع پاسخ‌های مکتوب داوران. (ارشد: ۴,۸۰۰,۰۰۰ دکترا: ۶,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-rewrite-after-revision',
    name: 'بازنویسی مقاله پس از ریوایز (هر مقاله)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 2000000,
    description: 'اعمال مجدد ریوایز در بدنه اصلی کلمات کلاینت مقاله. (ارشد: ۳,۸۰۰,۰۰۰ دکترا: ۵,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-conference-paper',
    name: 'نگارش مقاله کنفرانسی (هر مقاله)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3000000,
    description: 'نگارش مقالات پوستری یا ارائه کوتاه برای کنفرانس‌های معتبر. (ارشد: ۵,۰۰۰,۰۰۰ دکترا: ۷,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-translate-farsi-english',
    name: 'ترجمه تخصصی فارسی به انگلیسی (هر ۱۰۰۰ کلمه)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 1000000,
    description: 'ترجمه تخصصی علمی جملات با رعایت همبستگی کلمات. (ارشد: ۱,۵۰۰,۰۰۰ دکترا: ۲,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-translate-english-farsi',
    name: 'ترجمه تخصصی انگلیسی به فارسی (هر ۱۰۰۰ کلمه)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 1000000,
    description: 'ترجمه تخصصی از ژورنال‌های لاتین به متن فارسی سوان. (ارشد: ۱,۵۰۰,۰۰۰ دکترا: ۲,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-super-translate',
    name: 'ترجمه فوق‌تخصصی (پزشکی، مهندسی پیشرفته، حقوقی) هر ۱۰۰۰ کلمه',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 1500000,
    description: 'ترجمه فوق‌تخصصی کلمات تخصصی با کیفیت بالا. (ارشد: ۲,۵۰۰,۰۰۰ دکترا: ۳,۵۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-presentation-ppt',
    name: 'طراحی پاورپوینت دفاع (۲۰ تا ۳۰ اسلاید)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3800000,
    description: 'طراحی گرافیکی اسلایدهای دفاع به همراه سناریوی سخنرانی. (ارشد: ۴,۵۰۰,۰۰۰ دکترا: ۶,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-poster-farsi',
    name: 'طراحی پوستر علمی - فارسی کنفرانسی',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3800000,
    description: 'طراحی تک اسلاید پوستری منطبق با تمپلیت کنفرانس. (ارشد: ۴,۵۰۰,۰۰۰ دکترا: ۶,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-poster-english',
    name: 'طراحی پوستر علمی - انگلیسی بین‌المللی',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3800050,
    description: 'طراحی زبده تک برگه‌های پوستری همایش‌های خارجی. (ارشد: ۴,۵۰۰,۰۰۰ دکترا: ۶,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-research-infographic',
    name: 'طراحی اینفوگرافیک پژوهشی',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3800000,
    description: 'بصری‌سازی فرضیه‌ها و روش‌های آزمایش در ساختار جذاب. (ارشد: ۴,۸۰۰,۰۰۰ دکترا: ۶,۵۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-special-figures',
    name: 'طراحی شکل‌های تخصصی (معماری سیستم، فلوچارت) هر برگ',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 600000,
    description: 'طراحی المان‌های گرافیکی بُرداری تر و تمیز برای مقاله. (ارشد: ۸۵۰,۰۰۰ دکترا: ۱,۱۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-professional-charts',
    name: 'رسم نمودارهای حرفه‌ای (Origin / Excel / Python)',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 450000,
    description: 'ترسیم پلات‌های با کیفیت بالا و سه بعدی بابت چاپ. (ارشد: ۷۵۰,۰۰۰ دکترا: ۱,۰۰۰,۰۰۰ تومان).',
    minQty: 1
  },
  {
    id: 'student-software-training-3th',
    name: 'آموزش نرم‌افزار تخصصی (MATLAB, Python) هر ۳ جلسه',
    category: 'student',
    pricingType: 'fixed',
    basePrice: 3000000,
    description: 'جلسات آنلاین فشرده ویژه تقویت دفاعیه پایان‌نامه از صفر برای همه مقاطع.',
    minQty: 1
  },

  // --- نرخنامه خدمات چاپ و پرینت دیجیتال و صحافی و زیراکس ---
  {
    id: 'print-b-w-a4',
    name: 'پرینت سیاه و سفید (A4 یک‌رو)',
    category: 'print',
    pricingType: 'page',
    basePrice: 12000,
    description: 'چاپ دیجیتالی سریع با تونر عالی روی کاغذ تحریر ۸۰ گرمی تمیز.',
    placeholder: 'تعداد برگ پرینت',
    minQty: 5
  },
  {
    id: 'print-b-w-a4-double',
    name: 'پرینت سیاه و سفید (A4 دورو)',
    category: 'print',
    pricingType: 'page',
    basePrice: 15000,
    description: 'چاپ پشت‌ورون با هم‌ترازی فوق‌العاده بالا ویژه مکتوبات بلند.',
    placeholder: 'تعداد برگ پرینت',
    minQty: 5
  },
  {
    id: 'print-b-w-a3',
    name: 'پرینت سیاه و سفید (A3 یک‌رو)',
    category: 'print',
    pricingType: 'page',
    basePrice: 30000,
    description: 'چاپ طولی بزرگ روی کاغذهای قطع بزرگ A3 مناسب جداول.',
    placeholder: 'تعداد برگ پرینت',
    minQty: 1
  },
  {
    id: 'print-color-a4',
    name: 'پرینت رنگی (A4 یک‌رو)',
    category: 'print',
    pricingType: 'page',
    basePrice: 25000,
    description: 'چاپ پر رنگ و شفاف دیجیتال با کیفیت رنگی خیره‌کننده صنف.',
    placeholder: 'تعداد برگ پرینت',
    minQty: 1
  },
  {
    id: 'print-color-a4-double',
    name: 'پرینت رنگی (A4 دورو)',
    category: 'print',
    pricingType: 'page',
    basePrice: 30000,
    description: 'چاپ رنگی پشت و رو مناسب بروشورهای اداری، چارت‌ها و ارائه‌ها.',
    placeholder: 'تعداد برگ پرینت',
    minQty: 1
  },
  {
    id: 'print-color-a3',
    name: 'پرینت رنگی (A3 یک‌رو)',
    category: 'print',
    pricingType: 'page',
    basePrice: 60000,
    description: 'پرینت بزرگ قطع A3 رنگی با وضوح تصویر عالی.',
    placeholder: 'تعداد برگ پرینت',
    minQty: 1
  },
  {
    id: 'copy-b-w-a4',
    name: 'کپی سیاه و سفید (A4)',
    category: 'print',
    pricingType: 'page',
    basePrice: 10000,
    description: 'تکثیر سریع اسناد کاغذی با کیفیت بالا.',
    placeholder: 'تعداد کپی',
    minQty: 10
  },
  {
    id: 'copy-color-a4',
    name: 'کپی رنگی (A4)',
    category: 'print',
    pricingType: 'page',
    basePrice: 25000,
    description: 'تکثیر رنگی پرینتی مکتوبات تحویل فوری.',
    placeholder: 'تعداد کپی',
    minQty: 5
  },
  {
    id: 'scan-normal',
    name: 'اسکن اسناد (کیفیت معمولی)',
    category: 'print',
    pricingType: 'page',
    basePrice: 30000,
    description: 'دیجیتالی کردن برگه اسناد معمولی جهت آرشیو در فرمت pdf یا jpg.',
    placeholder: 'تعداد صفحه اسکن',
    minQty: 1
  },
  {
    id: 'scan-600-dpi',
    name: 'اسکن با کیفیت بالا (۶۰۰ DPI)',
    category: 'print',
    pricingType: 'page',
    basePrice: 40000,
    description: 'اسکن فوق رزولوشن عکس‌ها یا نشانه‌های تجاری با تفکیک رنگ عمیق.',
    placeholder: 'تعداد صفحه اسکن',
    minQty: 1
  },
  {
    id: 'scan-and-email',
    name: 'اسکن با کیفیت بالا و ارسال مستقیم ایمیل',
    category: 'print',
    pricingType: 'page',
    basePrice: 100000,
    description: 'انجام چرخه اسکن به همراه ارسال بلافاصله فاکتور به مقصد درگاه‌های خارجی.',
    placeholder: 'تعداد صفحه',
    minQty: 1
  },
  {
    id: 'binding-plastic-100',
    name: 'صحافی فنری پلاستیکی (تا ۱۰۰ برگ)',
    category: 'print',
    pricingType: 'fixed',
    basePrice: 75000,
    description: 'سجاف‌بندی مجهز به فنر پلاستیکی به همراه طلق مات جلو و پشت.',
    minQty: 1
  },
  {
    id: 'binding-metal-150',
    name: 'صحافی فنری فلزی (تا ۱۵۰ برگ)',
    category: 'print',
    pricingType: 'fixed',
    basePrice: 150000,
    description: 'پانچ منسجم و محکم سیمی فلزی مقاوم بابت دوره‌های مکرر ورق زدن.',
    minQty: 1
  },
  {
    id: 'binding-glue-hot',
    name: 'صحافی چسب گرم (شومیز)',
    category: 'print',
    pricingType: 'fixed',
    basePrice: 350000,
    description: 'صحافی عطف چسبی کتابی بدون عیب برای ارتقای برند مکتوبات.',
    minQty: 1
  },
  {
    id: 'binding-hard-galingor',
    name: 'صحافی سخت (گالینگور طلاکوب پایان‌نامه)',
    category: 'print',
    pricingType: 'fixed',
    basePrice: 550000,
    description: 'تجلید جلد سخت گالینگور با طلاکوبی نام دانشگاه روی عطف و رویه کارهای دفاع پایان‌نامه.',
    minQty: 1
  },
  {
    id: 'laminate-a4',
    name: 'لمینت مات/براق (A4)',
    category: 'print',
    pricingType: 'fixed',
    basePrice: 100000,
    description: 'طلق‌پوش و ضد آب کردن گواهی‌ها، مدارک و مکتوبات شناسایی قطع A4.',
    minQty: 1
  },
  {
    id: 'laminate-a3',
    name: 'لمینت مات/براق (A3)',
    category: 'print',
    pricingType: 'fixed',
    basePrice: 150000,
    description: 'طلق‌کشی حرارتی بزرگ قطع A3 برای پوسترها و نقشه‌های مهم در برابر تخریب.',
    minQty: 1
  },
  {
    id: 'sticker-a4-glossy',
    name: 'پرینت روی کاغذ پشت چسب‌دار A4 براق',
    category: 'print',
    pricingType: 'page',
    basePrice: 85000,
    description: 'چاپ لیبل با چسبندگی قوی روی کاغذ براق شفاف و زنده.',
    placeholder: 'تعداد برگ لیبل',
    minQty: 1
  },
  {
    id: 'sticker-a4-matte',
    name: 'پرینت روی کاغذ پشت چسب‌دار A4 مات',
    category: 'print',
    pricingType: 'page',
    basePrice: 85000,
    description: 'لیبل چسبی مات ایده‌آل برای برچسب‌زنی کالاهای کلاسیک اداری.',
    placeholder: 'تعداد برگ',
    minQty: 1
  },
  {
    id: 'plot-bw-80g',
    name: 'پلات کاغذ معمولی (۸۰ گرم - سیاه و سفید)',
    category: 'print',
    pricingType: 'meter',
    basePrice: 130000,
    description: 'رویه چاپ عریض نقشه‌های ساختمانی سیاه و سفید به ازای هر متر مربع.',
    placeholder: 'ابعاد حدودی به متر مربع',
    minQty: 1
  },
  {
    id: 'plot-color-80g',
    name: 'پلات کاغذ معمولی (۸۰ گرم - رنگی)',
    category: 'print',
    pricingType: 'meter',
    basePrice: 180000,
    description: 'چاپ نقشه‌های GIS و الگوهای معماری رنگی عریض به ازای هر متر مربع.',
    placeholder: 'ابعاد حدودی به متر مربع',
    minQty: 1
  },
  {
    id: 'plot-glossy-120g',
    name: 'پلات کاغذ گلاسه (۱۲۰ گرم - براق) هر متر مربع',
    category: 'print',
    pricingType: 'meter',
    basePrice: 350000,
    description: 'چاپ باکیفیت و جلای زیبای پوسترهای همایشی کلان از موتور پلات عریض.',
    placeholder: 'ابعاد حدودی به متر مربع',
    minQty: 1
  },
  {
    id: 'plot-coated-heavy',
    name: 'پلات کاغذ ضخیم (کوتد) هر متر مربع',
    category: 'print',
    pricingType: 'meter',
    basePrice: 210000,
    description: 'کاغذ ضخیم مات با جذب رنگ بسیار بالا برای پوسترهای نمایشگاهی.',
    placeholder: 'ابعاد حدودی به متر مربع',
    minQty: 1
  },
  {
    id: 'plot-map-bw',
    name: 'پلات نقشه مهندسی (A0, A1 - سیاه و سفید)',
    category: 'print',
    pricingType: 'page',
    basePrice: 200000,
    description: 'پلات سریع سیاه و سفید خطرزارهای اتوکد و نقشه‌های مهندسی.',
    placeholder: 'تعداد برگ نقشه',
    minQty: 1
  },
  {
    id: 'plot-map-color',
    name: 'پلات نقشه مهندسی (A0, A1 - رنگی)',
    category: 'print',
    pricingType: 'page',
    basePrice: 350000,
    description: 'پلات رنگی دقیق جزئیات تاسیساتی و ساختار طرح‌های مهندسی.',
    placeholder: 'تعداد برگ نقشه',
    minQty: 1
  },
  {
    id: 'banner-440g-normal',
    name: 'بنر معمولی (۴۴۰ گرم) - حالت فوری',
    category: 'print',
    pricingType: 'meter',
    basePrice: 500000,
    description: 'چاپ فوری بنرهای تسلیت، مناسبتی و اطلاع‌رسانی به ازای هر متر مربع.',
    placeholder: 'مساحت کل به متر مربع',
    minQty: 1
  },
  {
    id: 'banner-440g-high',
    name: 'بنر معمولی (۴۴۰ گرم - کیفیت چاپ بالا)',
    category: 'print',
    pricingType: 'meter',
    basePrice: 600000,
    description: 'بنر با تراکم رنگ فوق‌العاده روی متریال مرغوب خارجی جهت استفاده نمایشگاهی طولانی.',
    placeholder: 'مساحت کل به متر مربع',
    minQty: 1
  },
  {
    id: 'print-glossy-a4-200g',
    name: 'پرینت گلاسه A4 رنگی یا سیاه‌سفید ۲۰۰ گرم',
    category: 'print',
    pricingType: 'page',
    basePrice: 85000,
    description: 'چاپ با دوام برگه آلبوم‌ها و پوسترهای کوچک روی گلاسه ضخیم ۲۰۰ گرمی.',
    placeholder: 'تعداد برگ',
    minQty: 1
  },
  {
    id: 'print-glossy-a4-300g',
    name: 'پرینت گلاسه A4 رنگی یا سیاه‌سفید ۳۰۰ گرم',
    category: 'print',
    pricingType: 'page',
    basePrice: 90000,
    description: 'چاپ بر روی گلاسه با ضخامت مثال‌زدنی ۳۰۰ گرم مایل مقوایی.',
    placeholder: 'تعداد برگ',
    minQty: 1
  },
  {
    id: 'print-glossy-a3-200g',
    name: 'پرینت گلاسه A3 رنگی یا سیاه‌سفید ۲۰۰ گرم',
    category: 'print',
    pricingType: 'page',
    basePrice: 140000,
    description: 'چاپ گلاسه ضخیم متوسط قطع بزرگ A3 رنگی زنده.',
    placeholder: 'تعداد برگ',
    minQty: 1
  },
  {
    id: 'print-glossy-a3-300g',
    name: 'پرینت گلاسه A3 رنگی یا سیاه‌سفید ۳۰۰ گرم',
    category: 'print',
    pricingType: 'page',
    basePrice: 185000,
    description: 'بالاترین کیفیت و ایستایی پوستر کاغذ گلاسه مقوایی ۳۰۰ گرمی قطع A3.',
    placeholder: 'تعداد برگ',
    minQty: 1
  }
];

export enum OrderStatus {
  Draft = 'Draft', // پیش‌نویس
  PendingPayment = 'PendingPayment', // در انتظار پرداخت
  Paid = 'Paid', // پرداخت شده
  Assigned = 'Assigned', // واگذار شده به اپراتور
  InProgress = 'InProgress', // در دست انجام
  WaitingForUser = 'WaitingForUser', // در انتظار بازخورد کاربر
  Delivered = 'Delivered', // تحویل داده شده
  Completed = 'Completed', // تکمیل شده
  Cancelled = 'Cancelled', // لغو شده
  Refunded = 'Refunded', // عودت وجه شده
  Disputed = 'Disputed', // ثبت اختلاف شده
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, { fa: string; color: string; desc: string }> = {
  [OrderStatus.Draft]: { fa: 'پیش‌نویس', color: 'bg-gray-100 text-gray-700 border-gray-300', desc: 'سفارش ثبت شده اما هنوز برای پرداخت نهایی نگردیده است.' },
  [OrderStatus.PendingPayment]: { fa: 'در انتظار پرداخت', color: 'bg-amber-100 text-amber-800 border-amber-300', desc: 'لینک پرداخت صادر شده و در انتظار تسویه توسط کاربر است.' },
  [OrderStatus.Paid]: { fa: 'پرداخت شده', color: 'bg-blue-100 text-blue-800 border-blue-300', desc: 'پرداخت موفقیت‌آمیز بوده و آماده ارجاع به اپراتور یا طراح است.' },
  [OrderStatus.Assigned]: { fa: 'واگذار شده به مجری', color: 'bg-purple-100 text-purple-800 border-purple-300', desc: 'سفارش به یک مجری کاربلد (اپراتور یا طراح) تخصیص یافته است.' },
  [OrderStatus.InProgress]: { fa: 'در حال انجام', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', desc: 'مجری بر روی سفارش کار می‌کند و به زودی فایل‌ها را ارسال می‌کند.' },
  [OrderStatus.WaitingForUser]: { fa: 'در انتظار پاسخ کاربر', color: 'bg-orange-100 text-orange-800 border-orange-300', desc: 'پیش‌نویس اولیه ارسال شده و سیستم در انتظار نظر یا تایید شماست.' },
  [OrderStatus.Delivered]: { fa: 'تحویل داده شده', color: 'bg-teal-100 text-teal-800 border-teal-300', desc: 'فایل نهایی کار بارگذاری شده است. لطفاً ثبت نظر و تایید نهایی کنید.' },
  [OrderStatus.Completed]: { fa: 'کامل شده', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', desc: 'کار تحویل قطعی گردیده، مبلغ به حساب مجری آزاد و نظر ثبت شده است.' },
  [OrderStatus.Cancelled]: { fa: 'لغو شده', color: 'bg-rose-100 text-rose-800 border-rose-300', desc: 'سفارش قبل از تخصیص به مجری توسط مشتری یا سیستم لغو گردیده است.' },
  [OrderStatus.Refunded]: { fa: 'عودت وجه شده', color: 'bg-red-100 text-red-800 border-red-300', desc: 'هزینه سفارش به کیف پول مشتری مسترد و تراکنش معکوس بازگردانده شده است.' },
  [OrderStatus.Disputed]: { fa: 'ثبت اختلاف', color: 'bg-pink-100 text-pink-800 border-pink-300', desc: 'میان مشتری و مجری اختلاف پیش آمده و داور پشتیبانی در حال بررسی است.' },
};
