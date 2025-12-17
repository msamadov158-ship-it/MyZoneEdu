import { LessonPayload } from '@/types'
import { useRef, useState } from 'react'

interface LessonVideoProps {
	lesson?: LessonPayload | null
}

export default function LessonVideo({ lesson }: LessonVideoProps) {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const [lastTime, setLastTime] = useState<number>(0)

	const handleLoaded = (): void => {
		const video = videoRef.current
		if (!video) return

		video.playbackRate = 1
	}

	const handleTimeUpdate = (): void => {
		const video = videoRef.current
		if (!video) return

		// oldinga o'tkazishni bloklash
		if (video.currentTime > lastTime + 0.3) {
			video.currentTime = lastTime
			return
		}

		setLastTime(video.currentTime)

		// speedni majburiy 1x qilish
		if (video.playbackRate !== 1) {
			video.playbackRate = 1
		}
	}

	return <video ref={videoRef} src={lesson?.video_url} poster={lesson?.cover_url} controls controlsList="nodownload noplaybackrate nopictureinpicture" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-cover" onLoadedMetadata={handleLoaded} onTimeUpdate={handleTimeUpdate} />
}
