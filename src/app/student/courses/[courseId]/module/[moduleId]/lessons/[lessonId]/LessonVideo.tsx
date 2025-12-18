import { getUserFromStorage } from '@/lib/helpers/userStore'
import { LessonPayload } from '@/types'
import { useRef, useEffect, useState } from 'react'
import shaka from 'shaka-player'

interface LessonVideoProps {
	lesson?: LessonPayload | null
}

export default function LessonVideo({ lesson }: LessonVideoProps) {
	const videoRef = useRef<HTMLVideoElement | null>(null)

	const [lastTime, setLastTime] = useState(0)
	const [isRecording, setIsRecording] = useState(false)

	const watermarkText = getUserFromStorage()?.full_name

	/* ===============================
	   1️⃣ SCREEN RECORD ANIQLASH
	   =============================== */
	useEffect(() => {
		const threshold = 160

		const detectDevTools = () => {
			const devToolsOpen = window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold

			setIsRecording(devToolsOpen)
		}

		const interval = setInterval(detectDevTools, 1000)

		return () => clearInterval(interval)
	}, [])

	/* ===============================
	   2️⃣ SHAKA + DRM
	   =============================== */
	useEffect(() => {
		shaka.polyfill.installAll()

		if (!shaka.Player.isBrowserSupported()) return
		if (!videoRef.current || !lesson?.video_url) return

		const player = new shaka.Player(videoRef.current)

		player.configure({
			drm: {
				servers: {
					'com.widevine.alpha': 'https://your-license-server.com',
				},
				advanced: {
					'com.widevine.alpha': {
						videoRobustness: 'HW_SECURE_ALL',
						audioRobustness: 'HW_SECURE_ALL',
					},
				},
			},
		})

		player.load(lesson.video_url).catch(console.error)

		return () => {
			player.destroy()
		}
	}, [lesson])

	/* ===============================
	   3️⃣ ANTI SKIP
	   =============================== */
	const handleTimeUpdate = () => {
		const video = videoRef.current
		if (!video) return

		if (video.currentTime > lastTime + 0.3) {
			video.currentTime = lastTime
			return
		}

		if (video.playbackRate !== 1) {
			video.playbackRate = 1
		}

		setLastTime(video.currentTime)
	}

	const handleSeeking = () => {
		const video = videoRef.current
		if (!video) return
		if (video.currentTime > lastTime) {
			video.currentTime = lastTime
		}
	}

	/* ===============================
	   4️⃣ WATERMARK HARAKATI (FAFAQAT RECORDING PAYTIDA)
	   =============================== */
	useEffect(() => {
		if (!isRecording) return

		const interval = setInterval(() => {
			document.querySelectorAll('.wm-item').forEach((el) => {
				const e = el as HTMLElement
				e.style.top = `${Math.random() * 100}%`
				e.style.left = `${Math.random() * 100}%`
				e.style.transform = `rotate(${Math.random() * 360}deg)`
			})
		}, 1200)

		return () => clearInterval(interval)
	}, [isRecording])

	return (
		<div className="relative w-full h-full bg-black overflow-hidden select-none">
			{/* 🎥 VIDEO */}
			<video ref={videoRef} poster={lesson?.cover_url} controls className={`w-full h-full object-cover transition-all duration-300 ${isRecording ? 'blur-md brightness-50' : ''}`} controlsList="nodownload noplaybackrate nopictureinpicture" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} onTimeUpdate={handleTimeUpdate} onSeeking={handleSeeking} />

			{/* 🔥 WATERMARK — FAQAT RECORDING BO‘LGANDA */}
			{isRecording && (
				<div className="absolute inset-0 z-20 pointer-events-none select-none">
					{Array.from({ length: 40 }).map((_, i) => (
						<span
							key={i}
							className="wm-item absolute text-white text-4xl font-extrabold opacity-40 whitespace-nowrap"
							style={{
								top: `${Math.random() * 100}%`,
								left: `${Math.random() * 100}%`,
							}}
						>
							{watermarkText}
						</span>
					))}
				</div>
			)}
		</div>
	)
}
