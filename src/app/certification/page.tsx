'use client'

import { useEffect, useState } from 'react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { Download } from 'lucide-react'

export default function CertificationPage() {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)

    useEffect(() => {
        const generateCertificate = async () => {
            try {
                const existingPdfBytes = await fetch('/certificate.pdf').then(res =>
                    res.arrayBuffer()
                )

                const pdfDoc = await PDFDocument.load(existingPdfBytes)
                const page = pdfDoc.getPages()[0]

                const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
                const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

                const { width, height } = page.getSize()

                // 🔹 Keyinchalik API’dan keladi
                const fullName = 'Mirabzal Ozodov'
                const score = 30

                const fontSize = 32
                const textWidth = fontBold.widthOfTextAtSize(
                    fullName.toUpperCase(),
                    fontSize
                )

                // Ism markazga
                page.drawText(fullName.toUpperCase(), {
                    x: (width - textWidth) / 2,
                    y: height / 2 + 40,
                    size: fontSize,
                    font: fontBold,
                    color: rgb(0, 0, 0),
                })

                // Score
                page.drawText(`${score} / 50`, {
                    x: width / 4 - 50,
                    y: height / 4 - 78,
                    size: 20,
                    font,
                    color: rgb(0, 0, 0),
                })

                const pdfBytes = await pdfDoc.save()

                const blob = new Blob([pdfBytes], { type: 'application/pdf' })
                const url = URL.createObjectURL(blob)

                setPdfUrl(url)
            } catch (error) {
                console.error(error)
            }
        }

        generateCertificate()
    }, [])

    return (
        <div className='h-screen w-full'>
            {/* PDF Preview full screen */}
            {pdfUrl && (
                <iframe src={`${pdfUrl}#toolbar=0`} className='w-full h-full border-0' />
            )}

            {/* Fixed Download Button */}
            {pdfUrl && (
                <a
                    href={pdfUrl}
                    download="Mirabzal_Ozodov_certificate.pdf"
                    className='size-15 fixed bg-black text-white rounded-full text-bold flex items-center justify-center bottom-15 right-15 z-100 shadow'
                >
                    <Download className='size-7' />
                </a>
            )}
        </div>
    )
}
