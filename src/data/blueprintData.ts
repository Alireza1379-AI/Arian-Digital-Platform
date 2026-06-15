export interface DatabaseTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints?: string;
    description: string;
  }[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  requestHeader?: Record<string, string>;
  requestBody?: string;
  responseBody: string;
}

export interface FolderNode {
  name: string;
  type: 'file' | 'folder';
  children?: FolderNode[];
  description?: string;
}

export const BLUEPRINT_TABLES: DatabaseTable[] = [
  {
    name: 'users',
    description: 'نگهداری اطلاعات پایه کاربران اعم از مشتریان، اپراتورها، طراحان و مدیران سیستم.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK, DEFAULT gen_random_uuid()', description: 'شناسه منحصربه‌فرد کاربر' },
      { name: 'phone_number', type: 'VARCHAR(15)', constraints: 'UNIQUE, NOT NULL', description: 'شماره تلفن همراه کاربر برای ورود یکبار مصرف (OTP)' },
      { name: 'full_name', type: 'VARCHAR(100)', constraints: 'NULL', description: 'نام و نام خانوادگی کامل' },
      { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE, NULL', description: 'آدرس ایمیل جهت نوتیفیکیشن‌ها' },
      { name: 'role_id', type: 'UUID', constraints: 'FK -> roles.id, NOT NULL', description: 'نقش تخصیص یافته به کاربر' },
      { name: 'is_active', type: 'BOOLEAN', constraints: 'DEFAULT true', description: 'فعال یا مسدود بودن حساب' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()', description: 'زمان ثبت‌نام حساب کاربری' },
      { name: 'updated_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()', description: 'آخرین زمان به‌روزرسانی اطلاعات' }
    ]
  },
  {
    name: 'roles',
    description: 'تعریف نقش‌های درون پلتفرم نظیر Customer, Operator, Designer, Admin, Support.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'شناسه منحصربه‌فرد نقش' },
      { name: 'name', type: 'VARCHAR(50)', constraints: 'UNIQUE, NOT NULL', description: 'نام سیستم‌عامل نقش (مثلاً operator)' },
      { name: 'display_name', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'نام نمایشی فارسی نقش (مثلاً مجری طرح)' },
      { name: 'description', type: 'TEXT', description: 'توضیحات مربوط به حدود اختیارات نقش' }
    ]
  },
  {
    name: 'permissions',
    description: 'تعیین دسترسی‌های دانه‌ای (Fine-grained) برای عملیات مختلف سیستم.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'شناسه منحصربه‌فرد مجوز' },
      { name: 'code', type: 'VARCHAR(100)', constraints: 'UNIQUE, NOT NULL', description: 'کد مجوز امنیتی (مثلاً order:assign)' },
      { name: 'description', type: 'VARCHAR(255)', description: 'شرح عملکرد عملیاتی برای مدیر' }
    ]
  },
  {
    name: 'role_permissions',
    description: 'جدول واسط برای برقراری رابطه چند به چند میان نقش‌ها و مجوز‌ها.',
    columns: [
      { name: 'role_id', type: 'UUID', constraints: 'PK, FK -> roles.id', description: 'شناسه نقش' },
      { name: 'permission_id', type: 'UUID', constraints: 'PK, FK -> permissions.id', description: 'شناسه مجوز' }
    ]
  },
  {
    name: 'services',
    description: 'تعریف انواع خدمات دیجیتال قابل ارائه در پلتفرم به همراه رابطه با شاخه اصلی.',
    columns: [
      { name: 'id', type: 'VARCHAR(50)', constraints: 'PK', description: 'شناسه منحصربه‌فرد انگلیسی خدمت' },
      { name: 'category_id', type: 'UUID', constraints: 'FK -> service_categories.id', description: 'شناسه دسته‌بندی موضوعی' },
      { name: 'name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'نام خدمت به فارسی' },
      { name: 'pricing_type', type: 'VARCHAR(20)', constraints: 'NOT NULL', description: 'نوع محاسبه قیمت (flat, page, sample, dollar)' },
      { name: 'base_price', type: 'DECIMAL(15, 2)', constraints: 'NOT NULL', description: 'قیمت پایه بر حسب تومان' },
      { name: 'description', type: 'TEXT', description: 'توضیحات و دستورالعمل‌های عمومی خدمت' },
      { name: 'is_active', type: 'BOOLEAN', constraints: 'DEFAULT true', description: 'آیا خدمت در ویترین سایت فعال است؟' }
    ]
  },
  {
    name: 'service_categories',
    description: 'دسته‌بندی‌های کلان پلتفرم نظیر طراحی گرافیک، خدمات پرداخت و ترجمه/تایپ.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'شناسه دسته‌بندی' },
      { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'نام فارسی دسته' },
      { name: 'slug', type: 'VARCHAR(100)', constraints: 'UNIQUE', description: 'نشانی اینترنتی شاخه' }
    ]
  },
  {
    name: 'orders',
    description: 'ثبت اطلاعات عمومی مربوط به سفارشات کاربران در وضعیت‌های گوناگون.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK, DEFAULT gen_random_uuid()', description: 'شناسه ۳۶ کاراکتری فرآیند سفارش' },
      { name: 'customer_id', type: 'UUID', constraints: 'FK -> users.id, NOT NULL', description: 'شناسه مشتری ثبت‌کننده سفارش' },
      { name: 'provider_id', type: 'UUID', constraints: 'FK -> users.id, NULL', description: 'شناسه اپراتور یا طراح پذیرنده کار' },
      { name: 'status', type: 'VARCHAR(30)', constraints: 'DEFAULT Draft', description: 'وضعیت کنونی بر اساس ماشین حالت سیستم' },
      { name: 'total_amount', type: 'DECIMAL(15, 2)', constraints: 'NOT NULL', description: 'کل هزینه نهایی سفارش به تومان' },
      { name: 'instructions', type: 'TEXT', description: 'توضیحات و جزئیات ارسالی توسط مشتری' },
      { name: 'payment_idempotency_key', type: 'VARCHAR(100)', constraints: 'UNIQUE, NULL', description: 'کلید یکتا برای جلوگیری از پرداخت تکراری' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()', description: 'زمان ثبت سفارش' },
      { name: 'updated_at', type: 'TIMESTAMP', constraints: 'DEFAULT NOW()', description: 'زمان آخرین تغییر وضعیت سفارش' }
    ]
  },
  {
    name: 'order_items',
    description: 'فهرست ردیف‌های تشکیل‌دهنده سفارش و محاسبات کمیت خدمات.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'شناسه ردیف کالا/سفارش' },
      { name: 'order_id', type: 'UUID', constraints: 'FK -> orders.id, NOT NULL', description: 'سفارش مرجع' },
      { name: 'service_id', type: 'VARCHAR(50)', constraints: 'FK -> services.id, NOT NULL', description: 'کد خدمت درخواستی' },
      { name: 'quantity', type: 'INTEGER', constraints: 'DEFAULT 1', description: 'تعداد واحدها (تعداد صفحه، اتود، مبلغ دلار گیفت کارت)' },
      { name: 'unit_price', type: 'DECIMAL(15, 2)', description: 'قیمت هر واحد از خدمت به تومان' },
      { name: 'subtotal', type: 'DECIMAL(15, 2)', description: 'مجموع سطر (تعداد در نرخ واحد)' }
    ]
  },
  {
    name: 'payments',
    description: 'مدیریت و کنترل فاکتورهای متصل به درگاه اینترنتی شاپرک.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'شناسه تراکنش مالی داخلی پلتفرم' },
      { name: 'order_id', type: 'UUID', constraints: 'FK -> orders.id', description: 'شناسه فاکتور مرجع' },
      { name: 'gateway_name', type: 'VARCHAR(50)', description: 'نام درگاه پرداخت (مثلاً Saman, Sadad, Zarinpal)' },
      { name: 'amount', type: 'DECIMAL(15, 2)', description: 'کل هزینه پرداخت شونده به تومان' },
      { name: 'idempotency_key', type: 'VARCHAR(150)', constraints: 'UNIQUE', description: 'سپر حفاظتی تراکنش درگاه ضد فوت وقت مالی' },
      { name: 'status', type: 'VARCHAR(20)', description: 'وضعیت پرداخت (PENDING, SUCCESS, FAILED, VERIFIED)' },
      { name: 'reference_id', type: 'VARCHAR(100)', constraints: 'UNIQUE', description: 'شماره مرجع برگشتی تراکنش از شاپرک' },
      { name: 'card_hash', type: 'VARCHAR(64)', description: 'هش شماره کارت پرداخت‌کننده جهت ردگیری حساب' }
    ]
  },
  {
    name: 'attachments',
    description: 'نگهداری اطلاعات فراداده و لینک‌های دسترسی فایل‌های آپلود شده در فضای ابری S3.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'شناسه منحصربه‌فرد فایل' },
      { name: 'order_id', type: 'UUID', constraints: 'FK -> orders.id, NULL', description: 'آیا متصل به سفارش خاصی است؟' },
      { name: 'user_id', type: 'UUID', constraints: 'FK -> users.id', description: 'شناسه بارگذارنده فایل' },
      { name: 'file_name', type: 'VARCHAR(255)', description: 'نام واقعی فایل بارگذاری‌شده' },
      { name: 'file_url', type: 'VARCHAR(1024)', description: 'نشانی موقت یا دائم فایل در ابر S3' },
      { name: 'file_size', type: 'INTEGER', description: 'حجم فایل بر حسب بایت' },
      { name: 'mime_type', type: 'VARCHAR(100)', description: 'نوع قالب داده فایل (image/png, application/pdf)' }
    ]
  },
  {
    name: 'messages',
    description: 'جدول ثبت گفتگوهای دوطرفه بلادرنگ میان مشتری و مجری درون بسترسازی سفارش.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'شناسه پیام کوتاه' },
      { name: 'order_id', type: 'UUID', constraints: 'FK -> orders.id, NOT NULL', description: 'کانال گفتگوی سفارش' },
      { name: 'sender_id', type: 'UUID', constraints: 'FK -> users.id, NOT NULL', description: 'فرستنده پیام' },
      { name: 'message_text', type: 'TEXT', description: 'محتوای متنی پیام ارسال‌شده' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'زمان ارسال' }
    ]
  },
  {
    name: 'reviews',
    description: 'ثبت و امتیازدهی نهایی کاربران به خدمات دریافتی از طراح یا اپراتور.',
    columns: [
      { name: 'id', type: 'UUID', constraints: 'PK', description: 'شناسه منحصربه‌فرد نظر' },
      { name: 'order_id', type: 'UUID', constraints: 'FK -> orders.id, UNIQUE', description: 'کد سفارش مرجع امتیازدهی (یک نظر به ازای هر سفارش)' },
      { name: 'customer_id', type: 'UUID', constraints: 'FK -> users.id', description: 'شناسه مشتری ارزیاب' },
      { name: 'provider_id', type: 'UUID', constraints: 'FK -> users.id', description: 'شناسه مجری ارزیابی شده' },
      { name: 'stars', type: 'SMALLINT', constraints: 'CHECK(stars BETWEEN 1 AND 5)', description: 'تعداد ستاره‌های کارایی (۱ تا ۵)' },
      { name: 'comment', type: 'TEXT', description: 'متن بازخورد کاربر' },
      { name: 'created_at', type: 'TIMESTAMP', description: 'ثبت تاریخ بازخورد' }
    ]
  }
];

export const BLUEPRINT_API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/auth/otp/send',
    title: 'ارسال پیامک کد یکبار مصرف (OTP)',
    description: 'بررسی ثبت‌نام کاربر یا ایجاد حساب کاربری موقت و شلیک پیامک حاوی کد تایید ۴ تا ۶ رقمی برای تایید تلفن همراه.',
    requestBody: JSON.stringify({ phone_number: '09123456789' }, null, 2),
    responseBody: JSON.stringify({ success: true, message: 'کد تایید با موفقیت ارسال شد.', expires_in: 120 }, null, 2)
  },
  {
    method: 'POST',
    path: '/auth/otp/verify',
    title: 'تایید کد یکبار مصرف و صدور توکن',
    description: 'احراز هویت نهایی شماره موبایل فرستنده به وسیله کد تایید ارسال شده و صدور توکن اهلیتی JWT برای مرورگر یا کلاینت موبایل.',
    requestBody: JSON.stringify({ phone_number: '09123456789', otp_code: '58421' }, null, 2),
    responseBody: JSON.stringify({
      user: {
        id: '2cf74744-8cb3-4886-9ac5-bfb62438883b',
        phone_number: '09123456789',
        full_name: 'آرین جاویدان',
        role: 'Customer',
        is_active: true
      },
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyY2Y3NDc0NC04Y2IzLTQ4ODYtOWFjNS1iZmI2MjQzODg4M2IiLCJwaG9uZSI6IjA5MTIzNDU2Nzg5Iiwicm9sZSI6IkN1c3RvbWVyIn0...',
      expires_in: 86400
    }, null, 2)
  },
  {
    method: 'GET',
    path: '/services',
    title: 'دریافت لیست خدمات و فرمول‌های قیمت',
    description: 'دریافت برخط لیست خدمات دیجیتال فعال پلتفرم به تفکیک دسته‌بندی‌ها به تفکیک نرخ ارز، نرخ هر اسلاید و کارمزدها.',
    responseBody: JSON.stringify([
      {
        id: 'typing',
        name: 'خدمات تایپ تخصصی',
        category: { id: 'uuid-1', name: 'خدمات دفتری', slug: 'office' },
        pricing_type: 'page',
        base_price: 15000,
        description: 'تایپ سریع متون همراه با فرمول‌نویسی دقیق.'
      },
      {
        id: 'giftcard-apple',
        name: 'گیفت کارت اپل',
        category: { id: 'uuid-2', name: 'گیفت کارت', slug: 'giftcard' },
        pricing_type: 'dollar',
        base_price: 66000,
        description: 'اعتبار حساب اپل آیدی برای خریدهای دیجیتال.'
      }
    ], null, 2)
  },
  {
    method: 'POST',
    path: '/orders',
    title: 'ایجاد فاکتور سفارش جدید',
    description: 'مشتری سفارش طراحی، نگارش یا گیفت‌کارت خود را با پیوست جزئیات، تعداد صفحات و فایل‌ها ارسال می‌کند تا پلتفرم فاکتور با کد حالت Draft صادر کند.',
    requestHeader: { Authorization: 'Bearer {JWT_TOKEN}' },
    requestBody: JSON.stringify({
      service_id: 'ui-design',
      quantity: 5,
      instructions: 'من یک وب‌سایت املاک با ۵ اسکرین اصلی در فیگما نیاز دارم. سبک طراحی مینیمال و تیره باشد.',
      attachments: ['d31313dd-f179-4a0b-8041-3b76a086f6f2']
    }, null, 2),
    responseBody: JSON.stringify({
      order_id: '71629831-7b79-4d6a-8b1e-7f61c33ea987',
      status: 'PendingPayment',
      total_amount: 6000000, // 5 screens * 1,200,000 Toman
      payment_link: 'https://arian.digital/payment/71629831-7b79-4d6a-8b1e-7f61c33ea987',
      created_at: '2026-06-15T00:10:00Z'
    }, null, 2)
  },
  {
    method: 'POST',
    path: '/payments/gateway/checkout',
    title: 'اتصال به درگاه و ایجاد تراکنش ایمن',
    description: 'صدور توکن تراکنش شاپرک به همراه کلید ثبتی یکتا (Idempotency Key) جهت ممانعت از بروز تراکنش معلق یا کسر مضاعف مالی از حساب کاربر.',
    requestHeader: { Authorization: 'Bearer {JWT_TOKEN}' },
    requestBody: JSON.stringify({
      order_id: '71629831-7b79-4d6a-8b1e-7f61c33ea987',
      idempotency_key: 'idempotent-order-71629831-50e5'
    }, null, 2),
    responseBody: JSON.stringify({
      transaction_id: 'txn_981273917',
      amount_toman: 6000000,
      idempotency_key: 'idempotent-order-71629831-50e5',
      gateway_url: 'https://shaparak.ir/pay/gate_saman/token_9123891729'
    }, null, 2)
  },
  {
    method: 'GET',
    path: '/orders/customer/my-list',
    title: 'تاریخچه سفارشات کاربر جاری',
    description: 'دریافت فهرست تمام خریدهای جاری و سابق مشتری به همراه نوار وضعیت کار به شکل در انتظار تسویه، واگذاری به مجری و غیره.',
    requestHeader: { Authorization: 'Bearer {JWT_TOKEN}' },
    responseBody: JSON.stringify([
      {
        id: '71629831-7b79-4d6a-8b1e-7f61c33ea987',
        service_name: 'طراحی رابط کاربری اپلیکیشن (Figma + AI)',
        status: 'InProgress',
        provider_name: 'امیرحسین راد (طراح)',
        total_amount: 6000000,
        updated_at: '2026-06-15T01:12:00Z'
      }
    ], null, 2)
  }
];

export const FRONTEND_FOLDER_STRUCTURE: FolderNode = {
  name: 'frontend',
  type: 'folder',
  description: 'کلاینت وب مدرن بر بستر Next.js و فریمورک React با معماری ماژولار و ساختار پوشه‌بندی استاندارد.',
  children: [
    {
      name: 'app',
      type: 'folder',
      description: 'پوشه پیشرو در Next.js App Router که مسیردهی صفحات بر این مبنا رقم می‌خورد.',
      children: [
        { name: 'layout.tsx', type: 'file', description: 'پیکربندی ساختار پوسته عمومی سیستم، فونت‌ها، تراز RTL و تم سازمانی.' },
        { name: 'page.tsx', type: 'file', description: 'صفحه لندینگ اصلی و ویترین عمومی آرین دیجیتال.' },
        { name: 'auth-login', type: 'folder', description: 'فرم احراز هویت پیامکی با ورود دوفاکتوره موقت.' },
        { name: 'dashboard', type: 'folder', description: 'داشبوردهای یکپارچه مبتنی بر سطح دسترسی چندگانه کاربر.' },
        { name: 'services', type: 'folder', description: 'صفحات کاتالوگ و جزییات تعرفه‌بندی خدمات چند‌گانه.' },
        { name: 'order-create', type: 'folder', description: 'فرم هوشمند تخمین قیمت و ثبت سفارش به همراه پیوست‌ها.' },
        { name: 'messages', type: 'folder', description: 'صندوق چت بلادرنگ بین مشتری و طراح در فضای امن.' }
      ]
    },
    {
      name: 'components',
      type: 'folder',
      description: 'کامپوننت‌های عمومی و اشتراکی مجدد استفاده‌پذیر بر بستر TailwindCSS.',
      children: [
        { name: 'ui', type: 'folder', description: 'کامپوننت‌های بنیادی کوچک نظیر کارت‌ها، دکمه‌ها، فیلدها و مودال‌های برگرفته از Radix UI و ShadCN.' },
        { name: 'file-uploader.tsx', type: 'file', description: 'بخش آپلود امن فایل با درگ‌اند‌دراپ و اعتباردهی به پسوندها.' },
        { name: 'loading-spinner.tsx', type: 'file', description: 'انیمیشن‌های بارگذاری روان با استفاده از لایبرری Motion.' }
      ]
    },
    {
      name: 'store',
      type: 'folder',
      description: 'بخش مدیریت حافظه پلتفرم به صورت توزیع‌شده با کتابخانه پیشرفته Zustand.',
      children: [
        { name: 'authStore.ts', type: 'file', description: 'بررسی لایو هویت نشست کاربر، واکشی نقش‌ها و ذخیره توکن JWT.' },
        { name: 'cartStore.ts', type: 'file', description: 'مدیریت و نگهداشت سبد سفارش‌های محاسباتی تا ثبت فاکتور.' }
      ]
    },
    {
      name: 'hooks',
      type: 'folder',
      description: 'هوک‌های خصوصی تسهیل دسترسی به قابلیت‌های سیستم.',
      children: [
        { name: 'useSocket.ts', type: 'file', description: 'اتصال خودکار به وب‌سوکت بک‌اند برای دریافت چت‌ها و آلارم‌های لایو.' }
      ]
    }
  ]
};

export const BACKEND_FOLDER_STRUCTURE: FolderNode = {
  name: 'backend',
  type: 'folder',
  description: 'سورس‌کد بک‌اند جامع پلتفرم بر پایه فریمورک قدرتمند ساختاریافته NestJS و وب‌سرورهای پرسرعت Node.js.',
  children: [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'modules',
          type: 'folder',
          description: 'ماژول‌های تفکیک‌شده وظایف سیستم عهده‌دار منطق بیزینس (Business Logic).',
          children: [
            { name: 'auth', type: 'folder', description: 'مدیریت کوئری‌های OTP، ذخیره کدهای موقت ردگیری و ایجاد توکن‌های امنیتی JWT.' },
            { name: 'orders', type: 'folder', description: 'کنترل حالت‌های ماشین سفارش (Draft to Completed)، مانیتور زمان اتمام کار و ارجاعات مجری.' },
            { name: 'payments', type: 'folder', description: 'اتصال به وب‌سرویس پورتال بانکی، احراز فرستنده، متد اصالت‌سنجی تراکنش و کلیدهای حفاظتی یکتای تراکنش.' },
            { name: 'chat', type: 'folder', description: 'راه‌اندازی گیت‌وی وب‌سوکت برای چت‌های زنده با استفاده از Socket.io.' },
            { name: 'users', type: 'folder', description: 'عملیات تعریف نقش‌ها، رنکینگ کیفی طراحان و پرونده مشتریان.' }
          ]
        },
        {
          name: 'common',
          type: 'folder',
          description: 'تنظیمات همگانی، گاردها، اینترسپتورها و پایپ‌های اعتبارسنجی.',
          children: [
            { name: 'guards', type: 'folder', description: 'رول گاردهای دسترسی نظیر RolesGuard جهت تمایز مشتری از ادمین و اپراتور.' },
            { name: 'interceptors', type: 'folder', description: 'کدهای مدیریت فراداده مانند لاگرهای فرآیند مالی و ارزیابی خطا.' }
          ]
        },
        { name: 'app.module.ts', type: 'file', description: 'ماژول والد اصلی که نقطه اتصال تمام ماژول‌های فرعی و کتابخانه TypeORM/Drizzle است.' },
        { name: 'main.ts', type: 'file', description: 'نقطه آغاز به کار وب‌سرور، استقرار پورت ۳۰۰۰ و تنظیمات گلوبال بک‌اند.' }
      ]
    },
    { name: 'Dockerfile', type: 'file', description: 'محتوای کانتینرسازی سیستم جهت سهولت استقرار یکپارچه در ابر.' },
    { name: 'docker-compose.yml', type: 'file', description: 'تنظیمات داکر جهت بالا آوردن سریع PostgreSQL، دیتابیس Redis و سرور اصلی.' }
  ]
};

export const PLATFORM_DOCS = [
  {
    id: 'reqs',
    title: '۱. الزامات محصول (Product Requirements)',
    content: `### الزامات کارکردی آرین دیجیتال (Functional Requirements)

آرین دیجیتال یک بازارگاه دو سویه (Two-Sided Marketplace) برای خدمات دیجیتال و امور آنلاین است. هدف از طراحی پلتفرم، اتوماسیون کامل سفارش‌ها، قیمت‌گذاری پویا بر حسب واحد کار، مانیتورینگ لایو وضعیت سفارش و سیستم پرداخت ضد فوت وقت (Idempotent Charging) است.

#### نیازمندی‌های مشتریان (Customers):
- **ورود سریع بدون کلمه عبور**: ورود امن بر مبنای رمز یکبار مصرف پیامکی (OTP).
- **ماشین حساب برآورد هزینه پویا**: برآورد زنده هزینه بر اساس واحد خدمت (تعداد صفحه، تعداد اسلاید، اتود لوگو یا مقدار دلار درخواستی).
- **سیستم بارگذاری فایل**: کشیدن و رها کردن پیوست‌های مربوط به سفارش تا حجم ۱۰۰ مگابایت.
- **ماشین ردیابی لایو سفارش (State Monitor)**: امکان مشاهده مراحل پیشرفت از پیش‌نویس تا لغو، پرداخت یا فاز داوری.
- **چت زنده با مجری**: گفتگوی نوشتاری مستقیم با طراح تخصیص‌یافته به کار.
- **سیستم پرداخت آنلاین**: امکان پرداخت بی‌واسطه فاکتور از طریق تلفن همراه یا وب.
- **بازخورد ستاره‌ای و تشریحی**: ثبت نمره کیفیت به کار اپراتور/طراح.

#### نیازمندی‌های مجریان (Operators & Designers):
- **بخش فیدبک و مانیتور کار آنلاین**: دیدن سفارش‌های ثبت شده عمومی و امکان پذیرش سریع کار به شیوه اسنپ.
- **سیستم چت امن**: تبادل جزئیات کارآمد با مشتری.
- **آپلود دلیوربل (Deliverables Upload)**: ارائه خروجی نهایی متون، گیفت‌کارت یا متریال گرافیکی.
- **کیف پول اختصاصی**: مانیتور درآمدهای کسب شده، درخواست تسویه‌حساب مالی با فاکتور شبا.

#### نیازمندی‌های مدیریت و ادمین (Admin Panel):
- **داشبورد تحلیلی یکپارچه**: نمایش درآمدهای پلتفرم، تعداد فاکتورهای معوق، نرخ تایید سفارش، و برترین طراحان ماه.
- **مدیریت خدمات و قیمت‌ها**: امکان تغییر پویا در ضریب پایه قیمت به تومان (مثل ضریب تبدیل دلار گیفت‌کارت در نوسان‌های بازار ارز).`
  },
  {
    id: 'ux',
    title: '۲. معماری تجربه کاربری (UX Architecture)',
    content: `### فلسفه طراحی رابط کاربری (UI/UX Principles)

طراحی آرین دیجیتال کاملاً منطبق بر سبک تفکر سوپر-اپلیکیشن‌های ارائه‌دهنده سرویس (عین اسنپ و تپسی) اما بهینه‌سازی شده برای فرآیندهای فایل-محور و خلاقانه است.

#### المان‌های کلیدی معماری تجربه:
- **رویکرد واکنش‌گرا و وب‌اپلیکیشن پیشرو (RTL First & Mobile PWA)**: از آنجا که بیش از ۶۵ درصد از ورودی بازار خدمات آنلاین با تلفن‌های هوشمند همراه است، کلیه صفحات بر بستر فلوهای متراکم، کلان‌پدهای لمسی بزرگ (Touch Targets بزرگتر از ۴۴ پیکسل) پیاده‌سازی شده‌اند.
- **رعایت الگوهای ایرانی الاصل**: کلیدها، جداول، فاکتورها، تایم‌لاین‌های وضعیت سفارش و پیغام‌ها به زبان شیرین فارسی، ردیف‌سازی هماهنگ از راست به چپ (RTL)، همراه با فونت‌های شکیلی همچون واژیر یا ایران‌سنس تنظیم شده‌اند تا اصالت کلام حفظ گردد.
- **ناوبری بارهای جانبی و داک‌منوهای پایین صفحه**: قرارگیری اطلاعات مهم در تیررس چشم و کاهش فاصله‌های طولانی کلیک.
- **فرآیند ثبت سفارش تک‌حسابگر (Single Page Order Flow)**: کاربر با انتخاب دسته خدمت، بلافاصله در همان کارت بدون جابجایی صفحه، لایو محاسبات ریالی را بر اساس ورودی خود می‌بیند و با یک تایید به درگاه اصالت مالی متصل می‌شود.`
  },
  {
    id: 'db',
    title: '۳. امنیت و بهینه‌سازی دیتابیس (Database Ops)',
    content: `### تکنیک‌های پیشرفته دیتابیس PostgreSQL برای پروژه آرین دیجیتال

دیتابیس مغز فعال پلتفرم است. تراکنش‌های مالی، پیام‌های چت زنده، لاگین به حساب‌ها و اسناد کاربری در این لایه نگهداری می‌شوند.

#### ۱. ایندکس‌گذاری بهینه (Indexing Strategy):
- یک ایندکس ترکیبی رو تبلت کاربران برای شماره موبایل برقرار است: \`CREATE UNIQUE INDEX idx_users_phone ON users(phone_number)\`
- ایندکس رو فیلد کلید پرداخت ضد فوت وقت (Idempotency Key): \`CREATE UNIQUE INDEX idx_payments_idem ON payments(idempotency_key)\` جهت تضمین تراکنش بی‌واسطه.
- ایندکس بیزینس بر روی وضعیت سفارشات فعال برای دسترسی سریع اپراتورها: \`CREATE INDEX idx_orders_status ON orders(status) WHERE status IN ('Draft', 'Paid', 'Assigned', 'InProgress')\` جهت بهبود سرعت فید سفارشات معوق.

#### ۲. یکپارچگی ارجاعات و امنیت جامع (integrity & Constraints):
- اعمال چک کانسترینت بر روی فیدهای نمره‌دهی: \`CONSTRAINT check_stars CHECK (stars BETWEEN 1 AND 5)\`.
- ست کردن تریگر بروز‌رسانی خودکار زمان سیستم: \`ON UPDATE CURRENT_TIMESTAMP\` بر روی تمام جداول مانیتوری پلتفرم.
- تعریف وابستگی‌های منطقی: استفاده از \`ON DELETE RESTRICT\` روی نقش‌های هویتی تا هیچ کاربری بدون لغو سفارشات فعال، حذف نگردد.`
  },
  {
    id: 'idempotent',
    title: '۴. تراکنش‌های ضد تکرار (Idempotency Security)',
    content: `### سیستم ممانعت از پرداخت مضاعف و کسر تکراری از حساب مشتری

در پلتفرم‌های پرتردد، قطع شدن ناگهانی شبکه در طول فرآیند ورود به درگاه یا زدن دکمه تکرارشونده ثبت، ممکن است منجر به کسر چند فاز ریالی از مشتری شود. آرین دیجیتال این مشکل را به روش مهندسی نرم‌افزار حل کرده است.

#### متدولوژی پیشگرانه:
۱. هنگامی که مشتری فاکتوری از سفارش را تایید نهایی می‌کند، یک کلید ردگیری به صورت UUID منحصر به فرد (Idempotency Key) بر مبنای ترکیبی از شناسه سفارش و زمان سرور تولید شده و به فاکتور تخصیص می‌یابد.
۲. وب‌خدمت پرداخت (\`POST /payments/gateway/checkout\`) این کلید را ملزم به ارائه در هدر فاکتور می‌بیند.
۳. درگاه ابتدا در جدول پایگاه‌داده \`payments\` جستجو می‌کند؛ اگر تراکنشی با این کلید در شرایط پردازش وجود داشته باشد، همان توکن پرداخت قبلی را برمی‌گرداند و فاکتور تکراری خلق نمی‌کند.
۴. فرآیند بازخورد درگاه (Shaparak Callback Loop) به وسیله قفل توزیع‌شده ردیس (Redlock) ایمن شده است تا زمان پاسخ موازی چندگانه از طرف بانک را در کسری از ثانیه مدیریت کرده و از اجرای دو بار متد تایید نهایی سفارش ممانعت نماید.`
  },
  {
    id: 'scale',
    title: '۵. استراتژی مقیاس‌پذیری و بار ابری (Cloud Scaling)',
    content: `### تکنیک‌های بقا و پایداری در بارهای ترافیکی شدید (Scale-up Operations)

برای آمادگی سیستم در مواجهه با بیش از ۱۰۰ هزار سفارش همزمان روزانه، تفکیک وظایف پلتفرم الزامی است.

#### ۱. معماری میکروسرویس یا ماژولار توزیع‌شده:
- منطق وب‌سوکت چت زنده از وب‌اپلیکیشن منطق فاکتورسازی جدا شده و به سرورهای سبک Node.js چت اختصاصی سپرده می‌شود.
- استفاده از پایگاه داده حافظه‌ای **Redis** به عنوان بروکر حافظه چت و همچنین کش کردن تعرفه خدمات پرتقاضای آنلاین.

#### ۲. ذخیره‌سازی ابری چندکانالی اسناد (S3 Object Storage):
- تمامی پیش‌نویس‌ها، فایل‌های فتوگرافی، اسناد تایپ تخصصی و لوگوها به جای ذخیره روی دیسک سرورها، به فضاهای ذخیره‌سازی ابری S3 فرستاده می‌شوند.
- دسترسی مشتریان به فایل‌های حساس از طریق لینک‌های امضاشده موقت (S3 Presigned URLs) با انقضای چنددقیقه‌ای برقرار می‌شود تا امنیت اطلاعات مجریان حفظ گردد.

#### ۳. صف پردازش پس‌زمینه (Background Workers & Messaging Queues):
- پردازش امور گرافیکی حجیم، فشرده‌سازی فایل‌های ارسالی، فرآیند صدور صورتحساب شبا، و هشدارهای پیامکی انبوه به صف کارهایی نظیر **BullMQ** ارسال شده و در زمان‌های غیر حساس یا کلاسترهای ثانویه هندل می‌شوند.`
  }
];
