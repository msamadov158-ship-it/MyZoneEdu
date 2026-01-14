'use client'

import { useEffect, useState } from 'react'
import { StudentEdit } from '@/types'
import { studentService } from '@/services/userService'
import { getUserFromStorage } from '@/lib/helpers/userStore'

type Watermark = {
	id: number
	top: number
	left: number
}

const WATERMARK_COUNT = 5
const MIN_DISTANCE = 15 // foizlarda (bir-biriga yaqinlashmasligi uchun)

export default function LessonVideo({ lesson }: any) {
	const userId = getUserFromStorage()?.user_id as string
	const [user, setUser] = useState<StudentEdit | null>(null)
	const [visible, setVisible] = useState(true)
	const [marks, setMarks] = useState<Watermark[]>([])
	const [opacity, setOpacity] = useState(0)


	useEffect(() => {
		const load = async () => {
			const res = await studentService.getById(userId)
			setUser(res)
		}
		load()
	}, [userId])

	// 🔢 Masofa tekshiruvi
	const isFarEnough = (x: number, y: number, list: Watermark[]) => {
		return list.every(
			(m) =>
				Math.abs(m.top - x) > MIN_DISTANCE ||
				Math.abs(m.left - y) > MIN_DISTANCE
		)
	}

	// 🎲 Random watermark generator
	const generateMarks = () => {
		const result: Watermark[] = []

		while (result.length < WATERMARK_COUNT) {
			const top = Math.random() * 80 + 5
			const left = Math.random() * 80 + 5

			if (isFarEnough(top, left, result)) {
				result.push({
					id: Date.now() + Math.random(),
					top,
					left,
				})
			}
		}

		setMarks(result)
	}

	useEffect(() => {
		if (!user?.phone_number) return

		generateMarks()
		setVisible(true)
		setOpacity(0)

		const loop = setInterval(() => {
			// 1️⃣ Fade In
			setVisible(true)
			generateMarks()
			requestAnimationFrame(() => {
				setOpacity(0.6)
			})

			// 2️⃣ 1.5s ko‘rinib turadi
			setTimeout(() => {
				// 3️⃣ Fade Out
				setOpacity(0)
			}, 3000)

		}, 5000)

		return () => clearInterval(loop)
	}, [user])

	if (!user?.phone_number) {
		return (
			<div className="relative w-full aspect-video bg-black rounded-xl">
				<video
					src={lesson?.video_url}
					poster={lesson.cover_url}
					controls
					className="w-full h-full object-contain"
				/>
			</div>
		)
	}

	return (
		<div className="relative w-full aspect-video bg-black overflow-hidden rounded-xl">
			<video
				src={lesson?.video_url}
				poster={lesson.cover_url}
				controls
				playsInline
				controlsList="nodownload noplaybackrate"
				disablePictureInPicture
				onContextMenu={(e) => e.preventDefault()}
				className="w-full h-full object-contain"
			/>

			{visible &&
				marks.map((m) => (
					<div
						key={m.id}
						className="absolute z-20 pointer-events-none select-none"
						style={{
							top: `${m.top}%`,
							left: `${m.left}%`,
							transform: 'translate(-50%, -50%) rotate(-25deg)',
							opacity,
							transition: 'opacity 1.5s ease-in-out',
						}}
					>
						<span className="text-white text-2xl font-bold whitespace-nowrap">
							{user.phone_number}
						</span>
					</div>
				))}

		</div>
	)
}