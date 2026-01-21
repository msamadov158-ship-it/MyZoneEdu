'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Lock } from 'lucide-react'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { studentService } from '@/services/userService'
import { StudentEdit } from '@/types'

type Watermark = {
	id: number
	top: number
	left: number
	rotate: number
	visible: boolean
}

export default function LessonVideo({ lesson }: any) {
	const userId = getUserFromStorage()?.user_id as string

	const videoRef = useRef<HTMLVideoElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const lastTimeRef = useRef(0)

	const [user, setUser] = useState<StudentEdit | null>(null)
	const [isBlocked, setIsBlocked] = useState(false)
	const [reason, setReason] = useState('')
	const [mark, setMark] = useState<Watermark | null>(null)

	// ================= USER LOAD =================
	useEffect(() => {
		; (async () => {
			if (!userId) return
			const res = await studentService.getById(userId)
			setUser(res)
		})()
	}, [userId])

	// ================= BLOCK =================
	const handleBlock = useCallback((msg: string) => {
		if (videoRef.current) {
			lastTimeRef.current = videoRef.current.currentTime
			videoRef.current.pause()
		}
		setIsBlocked(true)
		setReason(msg)
	}, [])

	// ================= UNBLOCK + AUTO RESUME =================
	const handleUnblock = useCallback(async () => {
		setIsBlocked(false)
		setReason('')

		const video = videoRef.current
		const container = containerRef.current
		if (!video) return

		// Fullscreen qayta tekshirish
		if (!document.fullscreenElement && container) {
			try {
				await container.requestFullscreen()
			} catch { }
		}

		// Oldingi joyiga qaytarish
		video.currentTime = lastTimeRef.current

		// Avtomatik davom ettirish
		try {
			await video.play()
		} catch {
			// autoplay restriction bo‘lishi mumkin
		}
	}, [])

	// ================= FORCE FULLSCREEN =================
	const handlePlay = async () => {
		if (!document.fullscreenElement && containerRef.current) {
			try {
				await containerRef.current.requestFullscreen()
			} catch { }
		}
	}

	// ================= SECURITY DETECTION =================
	useEffect(() => {
		const checkSecurity = () => {
			if (document.hidden) {
				handleBlock('Xavfsizlik: Tab faol emas')
			}

			if (!document.hasFocus()) {
				handleBlock('Xavfsizlik: Ekran yozish aniqlandi')
			}
		}

		const handleBlur = () => {
			handleBlock('Xavfsizlik: Video oynasi faol emas')
		}

		const handleFocus = () => {
			// ❗ hech qachon unblock qilmaydi
		}

		document.addEventListener('visibilitychange', checkSecurity)
		window.addEventListener('blur', handleBlur)
		window.addEventListener('focus', handleFocus)

		return () => {
			document.removeEventListener('visibilitychange', checkSecurity)
			window.removeEventListener('blur', handleBlur)
			window.removeEventListener('focus', handleFocus)
		}
	}, [handleBlock])

	// ================= SCREENSHOT / DEVTOOLS BLOCK =================
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (
				e.key === 'PrintScreen' ||
				(e.ctrlKey && e.shiftKey) ||
				(e.metaKey && e.shiftKey)
			) {
				e.preventDefault()
				handleBlock('Screenshot yoki recording taqiqlangan')
			}
		}

		window.addEventListener('keydown', onKeyDown)
		return () => window.removeEventListener('keydown', onKeyDown)
	}, [handleBlock])

	// ================= DYNAMIC WATERMARK =================
	useEffect(() => {
		if (!user?.phone_number) return

		let showTimeout: ReturnType<typeof setTimeout>
		let hideTimeout: ReturnType<typeof setTimeout>
		let cycle: ReturnType<typeof setInterval>

		const cycleWatermark = () => {
			// 1️⃣ Avval YO‘Q holatda yangi joy beramiz
			setMark({
				id: Date.now(),
				top: Math.random() * 70 + 15,
				left: Math.random() * 70 + 15,
				rotate: Math.random() * 30 - 15,
				visible: false,
			})

			// 2️⃣ Sekin chiqadi
			showTimeout = setTimeout(() => {
				setMark((prev) => (prev ? { ...prev, visible: true } : prev))
			}, 120)

			// 3️⃣ Sekin yo‘qoladi
			hideTimeout = setTimeout(() => {
				setMark((prev) => (prev ? { ...prev, visible: false } : prev))
			}, 2800)
		}

		cycleWatermark()
		cycle = setInterval(cycleWatermark, 4000)

		return () => {
			clearInterval(cycle)
			clearTimeout(showTimeout)
			clearTimeout(hideTimeout)
		}
	}, [user])

	// ================= PUBLIC VIEW =================
	if (!user?.phone_number) {
		return (
			<div className="w-full aspect-video bg-gray-300 animate-pulse rounded-xl" />
		)
	}

	// ================= PROTECTED VIDEO =================
	return (
		<div
			ref={containerRef}
			onContextMenu={(e) => e.preventDefault()}
			className="relative w-full aspect-video bg-black rounded-xl overflow-hidden select-none"
			style={{
				filter: isBlocked ? 'blur(20px)' : 'none',
				WebkitUserSelect: 'none',
			} as any}
		>
			<video
				ref={videoRef}
				src={lesson?.video_url}
				poster={lesson?.cover_url}
				controls
				controlsList="nodownload noplaybackrate"
				disablePictureInPicture
				disableRemotePlayback
				onPlay={handlePlay}
				className="w-full h-full object-contain"
			/>

			{mark && (
				<div
					className="absolute pointer-events-none z-10 transition-opacity duration-[1200ms] ease-in-out"
					style={{
						top: `${mark.top}%`,
						left: `${mark.left}%`,
						transform: `translate(-50%, -50%) rotate(${mark.rotate}deg)`,
						opacity: mark.visible ? 0.35 : 0,
					}}
				>
					<div className="text-white font-bold text-sm md:text-[36px] drop-shadow-lg">
						{user.phone_number}
					</div>
				</div>
			)}

			{/* BLOCK OVERLAY */}
			{isBlocked && (
				<div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
					<div className="text-center max-w-sm">
						<div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<Lock className="w-10 h-10 text-red-500" />
						</div>
						<h2 className="text-white text-2xl font-bold mb-2">
							Video bloklandi
						</h2>
						<p className="text-gray-400 mb-6">{reason}</p>
						<button
							onClick={handleUnblock}
							className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
						>
							Davom etish
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
