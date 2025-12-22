'use client'

import { useEffect, useState } from 'react'
import { StudentEdit } from '@/types'
import { studentService } from '@/services/userService'
import { getUserFromStorage } from '@/lib/helpers/userStore'
// import { useScreenProtection } from '@/hooks/useScreenProtection'
// import { detectPlatform } from '@/lib/helpers/detectPlatform'

export default function LessonVideo({ lesson }: any) {
	const userId = getUserFromStorage()?.user_id as string
	// const videoRef = useRef<HTMLVideoElement>(null)
	// const platform = detectPlatform()
	// const blocked = useScreenProtection(videoRef)
	const [user, setUser] = useState<StudentEdit | null>(null)

	// useEffect(() => {
	// 	if (blocked && videoRef.current) {
	// 		videoRef.current.pause()
	// 	}
	// }, [blocked])

	useEffect(() => {
		const load = async () => {
			const res = await studentService.getById(userId)
			setUser(res)
		}
		load()
	}, [userId])

	return (
		<div className="relative w-full aspect-video bg-black overflow-hidden rounded-xl">
			{/* ref={videoRef}  ${blocked ? 'blur-xl brightness-50' : ''} */}
			<video src={lesson?.video_url} poster={lesson.cover_url} controls playsInline webkit-playsinline="true" controlsList="nodownload noplaybackrate" disablePictureInPicture onContextMenu={(e) => e.preventDefault()} className={`w-full h-full object-contain`} />

			{/* WATERMARK */}
			{user?.phone_number && (
				<div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-70">
					<p className="rotate-[-25deg] text-white text-4xl font-bold select-none">{user.phone_number}</p>
				</div>
			)}

			{/* BLOCK MESSAGE */}
			{/* {blocked && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 text-white text-xl font-bold">🚫 Video himoyalangan</div>} */}
		</div>
	)
}
