"use client";

import { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Download } from "lucide-react";
import { getUserFromStorage } from "@/lib/helpers/userStore";
import API from "@/lib/axios";

export default function CertificationPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [hasCertificate, setHasCertificate] = useState<boolean | null>(null);

  useEffect(() => {
    const generateCertificate = async () => {
      try {
        const userStorage = getUserFromStorage();
        if (!userStorage) return;

        const studentId = userStorage?.user_id;
        const courseId = userStorage?.type_id;

        if (!studentId || !courseId) return;

        // 🔥 API
        const response = await API.get(
          `/api/certificate/${courseId}/${studentId}`,
          {
            validateStatus: () => true,
          },
        );

        // ❌ Sertifikat yo‘q
        if (response.status === 404) {
          setHasCertificate(false);
          return;
        }

        if (response.status !== 200) return;

        const data = response.data?.result;

        if (!data || !data.is_completed) {
          setHasCertificate(false);
          return;
        }

        setHasCertificate(true);

        // =========================
        // 🔥 SAFE DATA (MUHIM)
        // =========================
        const fullName = String(data?.student?.full_name || "Unknown");
        const score = Number(data?.best_score ?? 0);
        const courseTitle = String(data?.cource?.title || "");
        const createdAt = String(data?.created_at || "");

        // =========================
        // 🔥 TEMPLATE PDF
        // =========================
        const existingPdfBytes = await fetch("/certificate.pdf").then((res) =>
          res.arrayBuffer(),
        );

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const page = pdfDoc.getPages()[0];

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontBold2 = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const { width, height } = page.getSize();

        // =========================
        // 🔹 NAME (CENTER)
        // =========================
        const nameFontSize = 32;

        const safeName = fullName.toUpperCase();

        const nameWidth = fontBold.widthOfTextAtSize(safeName, nameFontSize);
        const nameWidth2 = fontBold2.widthOfTextAtSize(safeName, nameFontSize);

        page.drawText(safeName, {
          x: (width - nameWidth) / 2,
          y: height / 2 + 40,
          size: nameFontSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        });

        page.drawText(safeName, {
          x: (width - nameWidth2) / 2,
          y: height / 2 + 40,
          size: nameFontSize,
          font: fontBold2,
          color: rgb(0, 0, 0),
        });

        const part1 = `${courseTitle} `;
        const part2 = `${score} ball`;
        const part3 = ` bilan muvaffaqiyatli yakunladi`;

        const fontSize = 18;

        // 🔥 TO‘G‘RI WIDTH HISOB
        const width1 = fontBold.widthOfTextAtSize(part1, fontSize); // ✅ bold
        const width2 = fontBold.widthOfTextAtSize(part2, fontSize); // ✅ bold
        const width3 = font.widthOfTextAtSize(part3, fontSize); // normal

        const totalWidth = width1 + width2 + width3;

        const startX = (width - totalWidth) / 2;
        const y = height / 2 - 20;

        // 🔹 part1 (BOLD ✅)
        page.drawText(part1, {
          x: startX,
          y,
          size: fontSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        });

        // 🔹 part2 (QIZIL + BOLD 🔥)
        page.drawText(part2, {
          x: startX + width1,
          y,
          size: fontSize,
          font: fontBold,
          color: rgb(1, 0, 0),
        });

        // 🔹 part3 (NORMAL)
        page.drawText(part3, {
          x: startX + width1 + width2,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        // =========================
        // 🔹 DATE
        // =========================
        page.drawText(createdAt, {
          x: 50,
          y: 50,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });

        // =========================
        // 🔥 SAVE PDF
        // =========================
        const pdfBytes = await pdfDoc.save();

        // 🔥 convert
        const buffer = pdfBytes.buffer.slice(
          pdfBytes.byteOffset,
          pdfBytes.byteOffset + pdfBytes.byteLength,
        );

        const blob = new Blob([buffer as ArrayBuffer], {
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

  // ❌ Sertifikat yo‘q
  if (hasCertificate === false) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        ❌ Sertifikat mavjud emas
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden relative">
      {pdfUrl && (
        <iframe
          src={`${pdfUrl}#toolbar=0&view=FitBH`}
          className=" border-0 bg-white absolute top-0 left-0 w-full h-full"
        />
      )}

      {pdfUrl && (
        <a
          href={pdfUrl}
          download="certificate.pdf"
          className="size-14 fixed bg-black text-white rounded-full flex items-center justify-center bottom-6 right-6 z-50 shadow-lg"
        >
          <Download className="size-6" />
        </a>
      )}
    </div>
  );
}
