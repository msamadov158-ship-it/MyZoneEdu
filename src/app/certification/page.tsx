"use client";

import { useEffect, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { Download, ShieldCheck, Trophy, Clock, ListTodo, Loader2 } from "lucide-react";
import { getUserFromStorage } from "@/lib/helpers/userStore";
import API from "@/lib/axios";
import QRCode from 'react-qr-code'


export default function CertificationPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [hasCertificate, setHasCertificate] = useState<boolean | null>(null);
  const [certMeta, setCertMeta] = useState<{
    fullName: string;
    courseTitle: string;
    regNumber: string;
    formattedDate: string;
  } | null>(null);


//   agar bitta sertificat kesa u birinchiga chiziladi agar undan kop kesa eskilari pastga chiziladi

  useEffect(() => {
    const generateCertificate = async () => {
      try {
        const userStorage = getUserFromStorage();
        if (!userStorage) return;

        const studentId = userStorage?.user_id;
        const courseId = userStorage?.type_id;

        if (!studentId || !courseId) return;

        const response = await API.get(
          `/api/certificate/${courseId}/${studentId}`,
          {
            validateStatus: () => true,
          },
        );

        if (response.status === 404) {
          setHasCertificate(false);
          return;
        }

        if (response.status !== 200) return;
        console.log(response.data);
        
        const data = response.data?.result;

        if (!data || !data.is_completed) {
          setHasCertificate(false);
          return;
        }

        setHasCertificate(true);

        const fullName = String(data?.student?.full_name || "Unknown");
        const score = Number(data?.best_score ?? 0);
        const courseTitle = String(data?.cource?.title || "");
        const completedAt = String(data?.completed_at || "");
        const regNumber = String(data?.reg_number || "0000");

        const formattedDate = new Date(completedAt).toLocaleDateString("uz-UZ");

        setCertMeta({ fullName, courseTitle, regNumber, formattedDate });

        // =========================
        // 🔥 TEMPLATE LOAD
        // =========================
        const existingPdfBytes = await fetch("/certificate.pdf").then((res) =>
          res.arrayBuffer(),
        );

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit);

        // 🔥 FONTLAR
        const fontBytes = await fetch("/fonts/Roboto-Regular.ttf").then((res) =>
          res.arrayBuffer(),
        );
        const boldBytes = await fetch("/fonts/Roboto-Bold.ttf").then((res) =>
          res.arrayBuffer(),
        );

        const font = await pdfDoc.embedFont(fontBytes);
        const fontBold = await pdfDoc.embedFont(boldBytes);

        const page = pdfDoc.getPages()[0];
        const { width, height } = page.getSize();

        // =========================
        // 🔹 NAME
        // =========================
        const nameFontSize = 32;
        const safeName = fullName.toUpperCase();

        const nameWidth = fontBold.widthOfTextAtSize(safeName, nameFontSize);

        page.drawText(safeName, {
          x: (width - nameWidth) / 2,
          y: height / 2 + 40,
          size: nameFontSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        });

        // =========================
        // 🔹 TEXT LINE
        // =========================
        const part1 = `${courseTitle} `;
        const part2 = `${score} ball`;
        const part3 = ` bilan muvaffaqiyatli yakunladi`;

        const fontSize = 18;

        const width1 = fontBold.widthOfTextAtSize(part1, fontSize);
        const width2 = fontBold.widthOfTextAtSize(part2, fontSize);
        const width3 = font.widthOfTextAtSize(part3, fontSize);

        const totalWidth = width1 + width2 + width3;

        const startX = (width - totalWidth) / 2;
        const y = height / 2 - 20;

        page.drawText(part1, {
          x: startX,
          y,
          size: fontSize,
          font: fontBold,
        });

        page.drawText(part2, {
          x: startX + width1,
          y,
          size: fontSize,
          font: fontBold,
          color: rgb(1, 0, 0),
        });

        page.drawText(part3, {
          x: startX + width1 + width2,
          y,
          size: fontSize,
          font,
        });

        // =========================
        // 🔹 REG + DATE
        // =========================
        const regText = `${regNumber}`;
        const regFontSize = 18;

        page.drawText(regText, {
          x: 160,
          y: 70,
          size: regFontSize,
          font,
          color: rgb(0, 0, 0),
        });

        const dateText = `Sana: ${formattedDate}`;
        const dateFontSize = 16;
        const dateWidth = font.widthOfTextAtSize(dateText, dateFontSize);

        page.drawText(dateText, {
          x: (width - dateWidth) / 2,
          y: 70,
          size: dateFontSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        });

        // =========================
        // 🔥 SAVE
        // =========================
        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes as unknown as BlobPart], {
          type: "application/pdf",
        });

        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (error) {
        console.error("Certificate error:", error);
      }
    };

    generateCertificate();
  }, []);

  if (hasCertificate === false) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-[#291714]">
        ❌ Sertifikat mavjud emas
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fff8f6] p-4 md:p-8 overflow-auto">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111]">
            Sertifikat
          </h2>
          <p className="text-[#666666]">
            Sertifikatingizni ko'ring, yuklab oling va ulashing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stat Cards (Col 1 & 2) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat Card 1 */}
            <div className="bg-white rounded-2xl border-gray-50 p-6 flex flex-col justify-between shadow-xs  transition-all duration-300  hover:-translate-y-0.5 hover:shadow-xl hover:bg-white relative overflow-hidden cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-[#fff0ee] flex items-center justify-center text-[#a20000]">
                  <ListTodo size={20} />
                </div>
                <span className="text-xs text-gray-400">Jarayonda</span>
              </div>
              <div>
                <p className="text-4xl text-gray-900 mb-1">4</p>
                <p className="text-base text-gray-600">Faol kurslar</p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-2xl border-gray-50 p-6 flex flex-col justify-between shadow-xs  transition-all duration-300  hover:-translate-y-0.5 hover:shadow-xl hover:bg-white relative overflow-hidden cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-[#fff0ee] flex items-center justify-center text-[#a20000]">
                  <Clock size={20} />
                </div>
                <span className="text-xs text-gray-400">Umumiy vaqt</span>
              </div>
              <div>
                <p className="text-4xl text-gray-900 mb-1">
                  124<span className="text-2xl text-gray-400 ml-1">soat</span>
                </p>
                <p className="text-base text-gray-600">Sarflangan soatlar</p>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div
             
              title="Sertifikatlarni ko'rish"
              className="bg-white rounded-2xl border-gray-50 p-6 flex flex-col justify-between shadow-xs  transition-all duration-300  hover:-translate-y-0.5 hover:shadow-xl hover:bg-white relative overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-[#a20000] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#fff0ee] flex items-center justify-center text-[#a20000]">
                  <Trophy size={20} />
                </div>
                <span className="text-xs text-gray-400">Yutuqlar</span>
              </div>
              <div className="relative z-10">
                <p className="text-4xl text-gray-900 mb-1">12</p>
                <p className="text-base text-gray-600">Olingan sertifikatlar</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">

          {/* Sertificat joyi */}
          <div className="lg:col-span-2 bg-white border border-[#ECECEC] rounded-xl p-4 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#111111]">
                Sertifikat ko'rinishi
              </h3>
              <span className="px-3 py-1 bg-[#fff0ee] text-[#a20000] rounded-full text-xs font-medium border border-[#ffdad4]">
                Tasdiqlangan
              </span>
            </div>

            <div  onClick={() => window.open(`${pdfUrl}`, '_blank') } className="relative w-full aspect-[1.4/1] border border-[#ECECEC] rounded-lg overflow-hidden bg-white shadow-sm cursor-pointer">
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{
                  background:
                    "linear-gradient(180deg, #D00000 0%, #D50000 30%, #CD0000 60%, #C30000 100%)",
                }}
              />

                {/* sertificat rasm */}
               
                {pdfUrl ? (
                  <iframe
                    src={`${pdfUrl}#toolbar=0&view=FitBH`}
                    className="border-0 bg-white w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white">
                    <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                  </div>
                )}
                
              
            </div>

            {certMeta && (
              <div className="mt-4 text-sm text-[#666666]">
                <span className="font-medium text-[#111111]">
                  {certMeta.fullName}
                </span>{" "}
                — {certMeta.courseTitle} · {certMeta.formattedDate}
              </div>
            )}
          </div>

          {/* Actions ung taraf */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white border border-[#ECECEC] rounded-xl p-6 flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-[#111111] mb-1">
                Amallar
              </h3>

              <div className="flex flex-col gap-3">

                <a
                  href={pdfUrl ?? undefined}
                  download="certificat2.pdf" 
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium border transition-all ${
                    pdfUrl
                      ? "border-[#e8bdb6] text-[#a20000] hover:bg-[#fff0ee]"
                      : "border-[#ECECEC] text-[#999999] pointer-events-none"
                  }`}
                >
                  <Download className="w-5 h-5" />
                    PDF sifatida yuklab olish
                </a>
              </div>

              <hr className="border-[#ECECEC]" />

              {/* Verification */}
              <div className="flex flex-col items-center text-center gap-2 pt-1">
                <h4 className="text-xs text-[#666666] uppercase tracking-wide font-medium">
                  Sertifikatni tekshirish
                </h4>
                <QRCode
                 value={pdfUrl}
                  size={200}
                  className="w-24 h-24 border border-[#ECECEC] p-2 rounded-lg my-2 object-cover"
                />
                <p className="text-xs text-[#666666] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#a20000]" />
                    Haqiqiyligini tekshirish uchun skanerlang
                </p>
                {certMeta && (
                  <div className="bg-[#F5F5F5] w-full py-2 rounded border border-[#ECECEC] mt-1">
                    <span className="font-mono text-sm text-[#111111] tracking-wider">
                      ID: {certMeta.regNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

         <div className="w-full md:2/3 bg-white border  border-gray-200 rounded-xl p-6 flex flex-col gap-y-3  ">

                    <div className="w-full flex justify-start items-center">
                        <h1 className="text-2xl font-semibold">Barcha Sertifikatlar</h1>
                    </div>

                    <div className="flex flex-col gap-3 ">
                            <div onClick={() => window.open(`${pdfUrl}` , '_blank')} className="relative w-full cursor-pointer aspect-[1.4/1] border border-[#ECECEC] rounded-lg overflow-hidden bg-white shadow-sm">
                            <div
                                className="absolute top-0 left-0 right-0 h-2"
                                style={{
                                background:
                                    "linear-gradient(180deg, #D00000 0%, #D50000 30%, #CD0000 60%, #C30000 100%)",
                                }}
                            />
                            {pdfUrl ? (
                                <iframe
                                src={`${pdfUrl}#toolbar=0&view=FitBH`}
                                className="border-0 bg-white w-full h-full pointer-events-none"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#999999]">
                                Yuklanmoqda...
                                </div>
                            )}
                            </div>

                            {certMeta && (
                            <div className="mt-4 text-sm text-[#666666]">
                                <span className="font-medium text-[#111111]">
                                {certMeta.fullName}
                                </span>{" "}
                                — {certMeta.courseTitle} · {certMeta.formattedDate}
                            </div>
                            )}
                        
                    </div>

         </div>       

      </div>
    </div>
  );
}
