'use client'

import { useRef } from 'react'
import { toPng } from 'html-to-image'

interface CertificateProps {
    fullName: string
    score: number
}

export default function Certificate({ fullName, score }: CertificateProps) {
    const ref = useRef<HTMLDivElement>(null)

    const downloadPNG = async () => {
        if (!ref.current) return

        const dataUrl = await toPng(ref.current, {
            width: 1123,
            height: 794,
            pixelRatio: 2,
        })

        const link = document.createElement('a')
        link.download = `${fullName}-certificate.png`
        link.href = dataUrl
        link.click()
    }

    return (
        <div className="space-y-6">
            {/* CERTIFICATE */}
            <div
                ref={ref}
                className="relative bg-white overflow-hidden"
                style={{ width: 1123, height: 794 }}
            >
                {/* BORDER */}
                <div className="absolute inset-6 border-4 border-black" />

                {/* TITLE */}
                <h1 className="absolute top-16 w-full text-center text-5xl font-extrabold tracking-widest">
                    SERTIFIKAT
                </h1>

                <p className="absolute top-32 w-full text-center text-lg tracking-widest">
                    “MY ZONE” MCHJ
                </p>

                {/* NAME */}
                <div className="absolute top-[260px] w-full text-center">
                    <p className="text-6xl font-[cursive] italic text-[#7A1E1E]">
                        {fullName}
                    </p>
                </div>

                {/* DESCRIPTION */}
                <p className="absolute top-[360px] w-full text-center text-xl">
                    2021 yil 12 yanvardan 2021 yil 2 aprelgacha
                </p>

                <p className="absolute top-[410px] w-full text-center text-2xl">
                    Buxgalteriya va 1C amaliyoti kursini{' '}
                    <span className="font-bold text-red-600">{score} ball</span> bilan
                    muvaffaqiyatli yakunladi.
                </p>

                {/* SIGNATURES */}
                <div className="absolute bottom-32 left-24 text-center">
                    <p className="font-semibold">D.S. Alimardonov</p>
                    <p className="text-sm">Direktor</p>
                </div>

                <div className="absolute bottom-32 right-24 text-center">
                    <p className="font-semibold">D.S. Alimardonov</p>
                    <p className="text-sm">Kurs rahbari</p>
                </div>

                {/* REG NUMBER */}
                <p className="absolute bottom-20 left-24 text-sm">
                    Reg №: 50
                </p>
            </div>

            {/* BUTTON */}
            <button
                onClick={downloadPNG}
                className="px-6 py-3 bg-black text-white rounded-lg"
            >
                PNG yuklab olish
            </button>
        </div>
    )
}
