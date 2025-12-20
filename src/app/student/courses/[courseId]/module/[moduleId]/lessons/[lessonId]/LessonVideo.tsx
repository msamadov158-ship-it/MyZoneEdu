'use client'

import { useRef, useEffect, useState } from 'react'
import { useScreenProtection } from './useScreenProtection'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { studentService } from '@/services/userService'
import { Student, StudentEdit } from '@/types'

export default function LessonVideo({ lesson }: any) {
	const userId = getUserFromStorage()?.user_id as string
	const videoRef = useRef<HTMLVideoElement>(null)
	const blocked = useScreenProtection()
	const [user, setUser] = useState<StudentEdit | null>(null)

	useEffect(() => {
		if (blocked && videoRef.current) {
			videoRef.current.pause()
		}
	}, [blocked])

	useEffect(() => {
		const load = async () => {
			const res = await studentService.getById(userId)
			setUser(res)
		}
		load()
	}, [userId])

	return (
		<div className="relative w-full aspect-video bg-black overflow-hidden">
			<video ref={videoRef} src={lesson?.video_url} controls controlsList="nodownload noplaybackrate" disablePictureInPicture className={`w-full h-full object-contain ${blocked ? 'blur-xl brightness-50' : ''}`} onContextMenu={(e) => e.preventDefault()} />

			<div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-70">
				<p className="rotate-[-25deg] text-white text-4xl font-bold">{user && user.phone_number}</p>
			</div>

			{blocked && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 text-white text-xl font-bold">🚫 Video himoyalangan</div>}
		</div>
	)
}
