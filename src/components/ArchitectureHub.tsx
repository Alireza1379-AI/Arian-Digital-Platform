import React, { useState } from 'react';
import { 
  Database, 
  Terminal, 
  FolderTree, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Play, 
  Info, 
  Check, 
  Cpu, 
  Globe
} from 'lucide-react';
import { 
  BLUEPRINT_TABLES, 
  BLUEPRINT_API_ENDPOINTS, 
  FRONTEND_FOLDER_STRUCTURE, 
  BACKEND_FOLDER_STRUCTURE, 
  PLATFORM_DOCS, 
  FolderNode, 
  DatabaseTable, 
  ApiEndpoint 
} from '../data/blueprintData';

export default function ArchitectureHub() {
  const [activeTab, setActiveTab] = useState<'db' | 'api' | 'folders' | 'docs'>('db');
  
  // DB State
  const [selectedTable, setSelectedTable] = useState<DatabaseTable>(BLUEPRINT_TABLES[0]);
  
  // API State
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(BLUEPRINT_API_ENDPOINTS[3]);
  const [customRequestBody, setCustomRequestBody] = useState<string>(selectedEndpoint.requestBody || '');
  const [apiResponse, setApiResponse] = useState<any>(JSON.parse(selectedEndpoint.responseBody));
  const [isApiResponseLoading, setIsApiResponseLoading] = useState(false);
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [copiedText, setCopiedText] = useState(false);

  // Folder Tree State
  const [activeFolderTree, setActiveFolderTree] = useState<'frontend' | 'backend'>('frontend');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'frontend': true,
    'frontend/app': true,
    'backend': true,
    'backend/src': true,
    'backend/src/modules': true
  });

  // Docs State
  const [activeDocId, setActiveDocId] = useState<string>('reqs');

  const toggleNode = (path: string) => {
    setExpandedNodes(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const selectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setCustomRequestBody(ep.requestBody || '');
    setApiResponse(JSON.parse(ep.responseBody));
    setApiLogs([]);
  };

  const handleRunApi = () => {
    setIsApiResponseLoading(true);
    setApiLogs([
      `[${new Date().toLocaleTimeString()}] اتصال با موفقیت به گیت‌وی آرین برقرار شد...`,
      `[${new Date().toLocaleTimeString()}] احراز هویت با متد Bearer JWT تایید گردید.`,
      selectedEndpoint.requestHeader ? `[${new Date().toLocaleTimeString()}] هدر امنیتی: Authorization: Bearer JWT_TOKEN_ACTIVE` : `[${new Date().toLocaleTimeString()}] هدرهای پایه مقداردهی شدند.`,
      `[${new Date().toLocaleTimeString()}] در حال ارسال درخواست به متد ${selectedEndpoint.method} مسیر ${selectedEndpoint.path}...`,
    ]);

    setTimeout(() => {
      setIsApiResponseLoading(false);
      setApiLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] پاسخ ۲۰۰ موفقیت‌آمیز از پایگاه داده واکشی شد.`,
        `[${new Date().toLocaleTimeString()}] زمان پاسخ‌دهی کلاینت: ۲۸ میلی‌ثانیه`
      ]);
      try {
        if (customRequestBody) {
          // If customer body can be parsed, simulate modification
          const parsed = JSON.parse(customRequestBody);
          if (selectedEndpoint.path === '/orders') {
            const simulatedAmount = (parsed.quantity || 1) * 1200000;
            const simulatedResponse = JSON.parse(selectedEndpoint.responseBody);
            simulatedResponse.total_amount = simulatedAmount;
            setApiResponse(simulatedResponse);
          } else {
            setApiResponse(JSON.parse(selectedEndpoint.responseBody));
          }
        } else {
          setApiResponse(JSON.parse(selectedEndpoint.responseBody));
        }
      } catch (err) {
        setApiResponse({ error: "خطا در پردازش بدنه درخواست JSON جهت سیمولیشن" });
      }
    }, 1000);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const renderFolderNode = (node: FolderNode, currentPath: string) => {
    const nodePath = `${currentPath}/${node.name}`;
    const isExpanded = expandedNodes[nodePath];
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={nodePath} className="ml-4 font-mono text-xs">
        <div 
          onClick={() => hasChildren && toggleNode(nodePath)}
          className={`flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors cursor-pointer group ${
            hasChildren ? 'hover:bg-[#f3f4f6]/50' : 'hover:bg-slate-100/50'
          }`}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <div className="w-3.5 h-3.5 flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
            </div>
          )}
          
          <span className={`font-medium ${hasChildren ? 'text-amber-700' : 'text-slate-700'}`}>
            {node.name}
            {hasChildren && '/'}
          </span>

          {node.description && (
            <span className="text-gray-400 font-sans text-[11px] opacity-0 group-hover:opacity-100 transition-opacity ml-auto mr-2 rtl:mr-auto rtl:ml-2">
              ← {node.description}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-slate-200/50 ml-3 pl-1 rtl:border-l-0 rtl:border-r rtl:mr-3 rtl:pr-1">
            {node.children!.map(child => renderFolderNode(child, nodePath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-right" dir="rtl">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-3 flex flex-col gap-2">
        <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl mb-2">
          <h3 className="font-sans font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>بخش مستندات فنی و ساختار معمارانه</span>
          </h3>
          <p className="font-sans text-xs text-slate-500 leading-normal">
            بررسی اجزای پیکربندی‌شده مدل‌های پایگاه داده، رت‌سیستم بک‌اند و گیت‌وی به صورت زنده و تعاملی.
          </p>
        </div>

        <button
          id="btn-arch-tab-db"
          onClick={() => setActiveTab('db')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-sans text-xs font-semibold text-right transition-all ${
            activeTab === 'db'
              ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-sm'
              : 'bg-white border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4 ml-1" />
          <span>۱. مدل‌های دیتابیس (ERD Schema)</span>
        </button>

        <button
          id="btn-arch-tab-api"
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-sans text-xs font-semibold text-right transition-all ${
            activeTab === 'api'
              ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-sm'
              : 'bg-white border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4 ml-1" />
          <span>۲. شبیه‌ساز فراخوانی وب‌سرویس (API Playground)</span>
        </button>

        <button
          id="btn-arch-tab-folders"
          onClick={() => setActiveTab('folders')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-sans text-xs font-semibold text-right transition-all ${
            activeTab === 'folders'
              ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-sm'
              : 'bg-white border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FolderTree className="w-4 h-4 ml-1" />
          <span>۳. درخت دایرکتوری پروژه (Structure)</span>
        </button>

        <button
          id="btn-arch-tab-docs"
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border font-sans text-xs font-semibold text-right transition-all ${
            activeTab === 'docs'
              ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-sm'
              : 'bg-white border-slate-200/60 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4 ml-1" />
          <span>۴. منوال جامع سیستم (Whitepaper)</span>
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="lg:col-span-9 bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden p-6">
        
        {/* TAB 1: DATABASE SCHEMA EXPLORER */}
        {activeTab === 'db' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-sans font-bold text-slate-800 text-base mb-1">ساختار پایگاه‌داده آرین دیجیتال (PostgreSQL Schema)</h2>
              <p className="font-sans text-xs text-slate-500">
                این دیتابیس رابطه‌ای به صورت سوم نرمال (3NF) به صورت کاملاً یکپارچه جهت امنیت تراکنش‌های مالی، چت‌ها، و سفارشات طراحی شده است. برای بررسی جزئیات فیلدهای هر جدول روی آن کلیلک کنید.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Tables list mini column */}
              <div className="md:col-span-4 space-y-2 border-l border-slate-100 pl-4 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-4">
                <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">لیست جداول موجود</span>
                <div className="max-h-[360px] overflow-y-auto space-y-1.5 pr-1">
                  {BLUEPRINT_TABLES.map(table => (
                    <button
                      key={table.name}
                      onClick={() => setSelectedTable(table)}
                      className={`w-full text-right font-mono text-[11px] px-3 py-2 rounded-lg border transition-all flex items-center justify-between ${
                        selectedTable.name === table.name
                          ? 'bg-slate-900 border-slate-900 text-white font-semibold'
                          : 'bg-slate-50 border-slate-200/50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{table.name}</span>
                      <span className="text-[10px] font-sans opacity-70">
                        {table.columns.length} ستون
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Schema Details column */}
              <div className="md:col-span-8 space-y-4">
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-amber-600" />
                    <span className="font-mono text-xs font-bold text-slate-900">جدول: {selectedTable.name}</span>
                  </div>
                  <p className="font-sans text-xs text-slate-600 leading-normal">
                    {selectedTable.description}
                  </p>
                </div>

                <div className="overflow-hidden border border-slate-200/60 rounded-xl">
                  <table className="w-full text-right font-sans text-xs">
                    <thead className="bg-[#f8fafc] text-slate-500 font-bold border-b border-slate-200/60">
                      <tr>
                        <th className="px-4 py-2.5">نام ستون (Column)</th>
                        <th className="px-4 py-2.5">نوع داده (Type)</th>
                        <th className="px-4 py-2.5">محدودیت‌ها (Constraints)</th>
                        <th className="px-4 py-2.5">شرح فیلد</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {selectedTable.columns.map(col => (
                        <tr key={col.name} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{col.name}</td>
                          <td className="px-4 py-3 font-mono text-indigo-700">{col.type}</td>
                          <td className="px-4 py-3">
                            {col.constraints ? (
                              <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${
                                col.constraints.includes('PK') 
                                  ? 'bg-rose-50 text-rose-700 font-bold border border-rose-100'
                                  : col.constraints.includes('FK')
                                  ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              }`}>
                                {col.constraints}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-600 leading-normal">{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-2 bg-sky-50 border border-sky-200/50 rounded-xl p-3 text-sky-800">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-sky-600" />
                  <span className="text-[10px] leading-relaxed font-sans">
                    <strong>نکته توسعه‌دهنده:</strong> به دلایل رعایت امنیت بالا، تمامی شناسه‌ها در پایگاه‌داده به شکل <strong>UUIDv4</strong> هستند و کلیدهای حفاظتی ضد فوت وقت به صورت شاخص‌های منحصربه‌فرد ترکیب گردیده‌اند تا جلوی فیشینگ و تکرار تراکنش‌ها را به کلی مسدود نمایند.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: API PLAYGROUND */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-sans font-bold text-slate-800 text-base mb-1">سیستم ثبت فراخوانی و شبیه‌ساز وب‌سرویس (API Sandbox)</h2>
              <p className="font-sans text-xs text-slate-500">
                بررسی لایو ساختار ورودی‌ها و خروجی‌های پلتفرم و امکان تست و پایش رفتار تراکنش‌ها به صورت فاکتور شده.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Endpoint selection */}
              <div className="lg:col-span-4 space-y-2 lg:border-l lg:border-slate-100 lg:pl-4 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-4">
                <span className="text-[11px] font-bold text-slate-400 block mb-2 uppercase tracking-wider">نقاط پایانی REST Web Service</span>
                <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {BLUEPRINT_API_ENDPOINTS.map(ep => (
                    <button
                      key={ep.path}
                      onClick={() => selectEndpoint(ep)}
                      className={`w-full text-right px-3 py-2.5 rounded-lg border transition-all font-sans text-xs flex flex-col gap-1 ${
                        selectedEndpoint.path === ep.path
                          ? 'bg-slate-50 border-amber-500 shadow-sm'
                          : 'bg-white border-slate-200/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1 py-0.5 rounded font-mono text-[9px] font-bold ${
                          ep.method === 'POST' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="font-mono text-[10px] text-slate-600 truncate">{ep.path}</span>
                      </div>
                      <span className="font-medium text-[10px] text-slate-700 truncate">{ep.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Endpoint Runner */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 text-xs leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-1 font-sans text-[11px]">عملکرد متد:</span>
                  <p className="text-slate-600 text-[11px] font-sans">
                    {selectedEndpoint.description}
                  </p>
                </div>

                {/* HTTP Request Parameters Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">هدرها و بدنه درخواست (REST Request)</span>
                    <span className="text-[10px] text-indigo-600 font-mono">Content-Type: application/json</span>
                  </div>

                  {selectedEndpoint.requestHeader && (
                    <div className="bg-amber-500/5 border border-amber-500/20 p-2 rounded-lg text-[10px] font-mono text-amber-900">
                      <strong>Header Required:</strong> Authorization: Bearer JWT_TOKEN_STAMP
                    </div>
                  )}

                  {selectedEndpoint.requestBody ? (
                    <textarea
                      id="api-request-body-input"
                      value={customRequestBody}
                      onChange={(e) => setCustomRequestBody(e.target.value)}
                      dir="ltr"
                      rows={5}
                      className="w-full text-slate-800 font-mono text-[11px] p-3 bg-slate-900 text-slate-200 border border-slate-700 rounded-xl focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  ) : (
                    <div className="py-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-sans">
                      این متد به بدنه درخواست (Request Body) احتیاج ندارد.
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button
                    id="btn-run-api-sandbox"
                    onClick={handleRunApi}
                    disabled={isApiResponseLoading}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-sans text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {isApiResponseLoading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 ml-1" />
                        <span>شلیک فراخوانی برای تست (Send Request)</span>
                      </>
                    )}
                  </button>

                  <button
                    id="btn-copy-api-response"
                    onClick={() => handleCopyCode(JSON.stringify(apiResponse, null, 2))}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-sans text-xs font-bold px-4 rounded-xl flex items-center justify-center transition-colors"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Simulated Server Console Console */}
                {apiLogs.length > 0 && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1 max-h-[120px] overflow-y-auto" dir="ltr text-left">
                    {apiLogs.map((log, i) => (
                      <p key={i} className="font-mono text-[9px] text-zinc-400 text-left">
                        {log}
                      </p>
                    ))}
                  </div>
                )}

                {/* HTTP Response block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">پاسخ دریافتی (REST Response - 200 OK)</span>
                    <span className="text-[10px] text-green-600 font-mono">Status: 200 OK</span>
                  </div>
                  <pre 
                    dir="ltr"
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-mono text-emerald-400 overflow-x-auto text-left max-h-[220px] overflow-y-auto"
                  >
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROJECT STRUCTURE TREE */}
        {activeTab === 'folders' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-sans font-bold text-slate-800 text-base mb-1">ساختار همراستای پروژه (Directory Architecture)</h2>
              <p className="font-sans text-xs text-slate-500">
                درخت پوشه‌های تمیز و استاندارد فولدربندی در سمت فرانت‌اند (Next.js) و بک‌اند (NestJS) برای بهینه‌سازی فرآیندهای توسعه در سطح انترپرایز.
              </p>
            </div>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <button
                id="btn-toggle-struct-frontend"
                onClick={() => setActiveFolderTree('frontend')}
                className={`px-4 py-1.5 rounded-full font-sans text-xs font-bold transition-all ${
                  activeFolderTree === 'frontend'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                شاخه فرانت‌اند (Next.js / React)
              </button>
              <button
                id="btn-toggle-struct-backend"
                onClick={() => setActiveFolderTree('backend')}
                className={`px-4 py-1.5 rounded-full font-sans text-xs font-bold transition-all ${
                  activeFolderTree === 'backend'
                    ? 'bg-[#1e293b] text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                شاخه بک‌اند (NestJS / Node)
              </button>
            </div>

            <div className="bg-[#f8fafc] border border-slate-200/60 rounded-2xl p-5 min-h-[350px]">
              <div className="flex items-center gap-1.5 mb-4 text-[10px] text-gray-400 border-b border-slate-200/60 pb-2 font-mono">
                <Globe className="w-3.5 h-3.5" />
                <span>root_workspace / {activeFolderTree === 'frontend' ? 'frontend/' : 'backend/'}</span>
              </div>
              
              <div className="space-y-1">
                {activeFolderTree === 'frontend' 
                  ? renderFolderNode(FRONTEND_FOLDER_STRUCTURE, 'frontend')
                  : renderFolderNode(BACKEND_FOLDER_STRUCTURE, 'backend')
                }
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5 flex items-center gap-3">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="font-sans text-[11px] text-amber-900 leading-normal">
                هر ردیف از درخت بالا شامل قابلیت هوورینگ است. ماوس خود را بر روی مسیر فایل‌ها یا شاخه‌ها قرار دهید تا کاربرد و عملکرد ویژه آن فایل در معماری یکپارچه پروژه را به زبان فارسی ملاحظه نمایید.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM CONprehensive DOCUMENTATION */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="font-sans font-bold text-slate-800 text-base mb-1">دانشنامه و مستندات فنی جامع آرین دیجیتال (Whitepaper)</h2>
              <p className="font-sans text-xs text-slate-500">
                بررسی ابعاد معماری امنیت، بهینه‌سازی‌های امنیتی دیتابیس، استراتژی گواهی‌های پرداختی و نحوه مقیاس‌پذیری زیرساخت.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Doc Selection sub sidebar */}
              <div className="md:col-span-4 space-y-1.5 border-l border-slate-100 pl-4 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-4">
                {PLATFORM_DOCS.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setActiveDocId(doc.id)}
                    className={`w-full text-right px-3 py-2.5 rounded-lg font-sans text-xs transition-all leading-normal ${
                      activeDocId === doc.id
                        ? 'bg-amber-500/10 text-amber-900 font-bold border-r-2 border-amber-500'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {doc.title}
                  </button>
                ))}
              </div>

              {/* Doc Viewer Content */}
              <div className="md:col-span-8 bg-slate-50/50 border border-slate-200/40 rounded-2xl p-5">
                <div className="prose prose-sm font-sans text-slate-700 max-w-none text-xs leading-relaxed space-y-4">
                  {PLATFORM_DOCS.find(d => d.id === activeDocId)?.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('### ')) {
                      return <h2 key={index} className="text-sm font-bold text-slate-950 border-b border-slate-200 pb-1.5 pt-3">{paragraph.replace('### ', '')}</h2>;
                    }
                    if (paragraph.startsWith('#### ')) {
                      return <h3 key={index} className="text-[11px] font-bold text-slate-900 pt-2 block">{paragraph.replace('#### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <ul key={index} className="list-disc pr-4 space-y-1 my-2">
                          {paragraph.split('\n').map((li, i) => (
                            <li key={i} className="text-[11px] text-slate-600 leading-relaxed">{li.replace('- ', '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (paragraph.match(/^\d+\./)) {
                      return (
                        <div key={index} className="space-y-1 my-2">
                          {paragraph.split('\n').map((li, i) => (
                            <p key={i} className="text-[11px] text-slate-600 leading-relaxed font-sans">{li}</p>
                          ))}
                        </div>
                      );
                    }
                    return <p key={index} className="text-[11px] text-slate-600 leading-relaxed font-sans">{paragraph}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
