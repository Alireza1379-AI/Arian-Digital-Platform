import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route - Simulating Pishkhan24 queries
  app.post("/api/pishkhan/inquire", (req, res) => {
    const { type, query } = req.body;

    if (!type || !query) {
      return res.status(400).json({ error: "نوع استعلام و اطلاعات ورودی الزامی است." });
    }

    let result = {};
    const trackingCode = `PK-${Math.floor(100000 + Math.random() * 900000)}`;

    if (type === "car-fines") {
      result = {
        owner: "محمد زارعی (مالک پلاک)",
        plate: query,
        finesCount: 3,
        totalAmount: 185000,
        fines: [
          { id: "F-102", date: "1405/02/10", time: "14:35", location: "بزرگراه همت غرب", description: "سرعت غیرمجاز بیش از ۳۰ کیلومتر دنده عقب", amount: 60000 },
          { id: "F-103", date: "1405/03/15", time: "09:12", location: "محدوده طرح ترافیک ولیعصر", description: "ورود به محدوده کنترل آلودگی هوا بدون مجوز", amount: 100000 },
          { id: "F-104", date: "1405/03/20", time: "18:22", location: "تقاطع خیابان کارگر - خیابان انقلاب", description: "توقف ممنوع زیر تابلو حمل با جرثقیل", amount: 25000 },
        ],
      };
    } else if (type === "national-id") {
      result = {
        nationalId: query,
        isValid: true,
        birthDate: "1369/05/20",
        status: "فعال و بدون محدودیت سیستمی در ثبت احوال کل کشور",
        fullName: "آریا جاویدان‌نسب",
        fatherName: "تیمور",
        gender: "مرد",
      };
    } else if (type === "postal-code") {
      result = {
        postalCode: query,
        state: "تهران",
        city: "تهران",
        address: "خیابان کارگر شمالی، پلاک ۱۱۰، واحد ۳ غربی، دفتر مرکزی شرکت فنی آرین دیجیتال",
        company: "هلدینگ خدمات دیجیتال آرین صنف",
        buildingId: "8914-912",
      };
    } else if (type === "phone-bill") {
      result = {
        phoneNumber: query,
        billCycle: "دوره فروردین و اردیبهشت سال ۱۴۰۵",
        amountToPay: 43500,
        unpaidCycleAmount: 12000,
        paymentDeadline: "1405/04/10",
        paymentBillId: "918340158",
        paymentReceiptId: "20489510",
        ownerName: "شرکت آرین دیجیتال رسمی",
      };
    } else {
      result = {
        query,
        details: "استعلام متفرقه با تایید صنف آرین دیجیتال",
        status: "مورد تایید و بدون اخطار اداری"
      };
    }

    res.json({
      success: true,
      type,
      query,
      result,
      trackingCode,
      fee: 25000, // Fixed service fee for Pishkhan inquiries
      timestamp: new Date().toLocaleDateString("fa-IR"),
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
