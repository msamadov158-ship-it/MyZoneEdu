import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
	title: {
		default: 'My Zone Online — Bugalteriya va 1C Kurslari',
		template: '%s | My Zone Online'
	},
	description:
		'My Zone Online — bu bugalteriya va 1C (1C: Бухгалтерия) bo‘yicha professional onlayn ta’lim platformasi. Amaliy darslar, real keyslar, tajribali mutaxassislar va sertifikat bilan kasbingizni rivojlantiring.',
	keywords: [
		'bugalteriya kurslari',
		'1C kurslari',
		'1C бухгалтерия',
		'onlayn bugalteriya',
		'1C o‘rganish',
		'hisobchi kurslari',
		'myzone online'
	],
	authors: [{ name: 'My Zone Online Team' }],
	creator: 'My Zone Online',
	publisher: 'My Zone Online',
	robots: {
		index: true,
		follow: true
	},
	openGraph: {
		title: 'My Zone Online — Bugalteriya va 1C Kurslari',
		description: 'Bugalteriya va 1C bo‘yicha zamonaviy onlayn kurslar. Amaliy bilim, real loyiha va sertifikat.',
		type: 'website',
		locale: 'uz_UZ',
		siteName: 'MyZone Online'
	},
	twitter: {
		card: 'summary_large_image',
		title: 'My Zone Online — Bugalteriya va 1C Kurslari',
		description: 'Bugalteriya va 1C bo‘yicha professional onlayn kurslar. Noldan mutaxassisgacha.'
	}
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="uz" className="dark">
			<body>{children}</body>
		</html>
	)
}
