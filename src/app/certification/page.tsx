'use client';

import { useEffect, useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { Download } from 'lucide-react';
import { getUserFromStorage } from '@/lib/helpers/userStore';
import API from '@/lib/axios';

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

                const response = await API.get(`/api/certificate/${courseId}/${studentId}`, {
                    validateStatus: () => true,
                });

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

                const fullName = String(data?.student?.full_name || 'Unknown');
                const score = Number(data?.best_score ?? 0);
                const courseTitle = String(data?.cource?.title || '');
                const completedAt = String(data?.completed_at || '');
                const regNumber = String(data?.reg_number || '0000');

                // sana formatlash (chiroyli qilish)
                const formattedDate = new Date(completedAt).toLocaleDateString('uz-UZ');

                // =========================
                // 🔥 TEMPLATE LOAD
                // =========================
                const existingPdfBytes = await fetch('/certificate.pdf').then((res) => res.arrayBuffer());

                const pdfDoc = await PDFDocument.load(existingPdfBytes);
                pdfDoc.registerFontkit(fontkit);

                // 🔥 FONTLAR
                const fontBytes = await fetch('/fonts/Roboto-Regular.ttf').then((res) => res.arrayBuffer());
                const boldBytes = await fetch('/fonts/Roboto-Bold.ttf').then((res) => res.arrayBuffer());

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
                // 🔹 REG + DATE (MUHIM QISM)
                // =========================

                const regText = `${regNumber}`;

                const regFontSize = 18;

                page.drawText(regText, {
                    x: 160, // markazga
                    y: 70, // pastki joy
                    size: regFontSize,
                    font,
                    color: rgb(0, 0, 0),
                });

                const dateText = `Sana: ${formattedDate}`;

                const dateFontSize = 16;

                const dateWidth = font.widthOfTextAtSize(dateText, dateFontSize);

                page.drawText(dateText, {
                    x: (width - dateWidth) / 2, // markazga
                    y: 70, // pastki joy
                    size: dateFontSize,
                    font: fontBold,
                    color: rgb(0, 0, 0),
                });

                // =========================
                // 🔥 SAVE
                // =========================
                const pdfBytes = await pdfDoc.save();

                const blob = new Blob([pdfBytes as unknown as BlobPart], {
                    type: 'application/pdf',
                });

                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } catch (error) {
                console.error('Certificate error:', error);
            }
        };

        generateCertificate();
    }, []);

    if (hasCertificate === false) {
        return <div className="h-screen flex items-center justify-center text-xl">❌ Sertifikat mavjud emas</div>;
    }

    return (
        <div className="w-full h-full relative">

            {pdfUrl && (
                <a href={pdfUrl} download="certificate.pdf" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg mb-4 w-fit">
                    <Download className="w-5 h-5" />
                    Sertifikatni yuklab olish
                </a>
            )}

            {/* PDF VIEW */}
            {pdfUrl && <iframe src={`${pdfUrl}#toolbar=0&view=FitBH`} className="border-0 bg-white w-full h-full" />}
        </div>
    );
}
