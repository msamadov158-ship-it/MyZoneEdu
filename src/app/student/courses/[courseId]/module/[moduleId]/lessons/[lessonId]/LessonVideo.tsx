'use client'

import { useEffect, useState } from 'react'
import { StudentEdit } from '@/types'
import { studentService } from '@/services/userService'
import { getUserFromStorage } from '@/lib/helpers/userStore'

export default function LessonVideo({ lesson }: any) {
	const userId = getUserFromStorage()?.user_id as string
	const [user, setUser] = useState<StudentEdit | null>(null)

	useEffect(() => {
		const load = async () => {
			const res = await studentService.getById(userId)
			setUser(res)
		}
		load()
	}, [userId])

	if (!user?.phone_number) {
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

			<div className="absolute inset-0 z-10 pointer-events-none select-none">

				<div className="absolute top-6 w-full overflow-hidden">
					<div className="watermark-left opacity-50">
						<span>{user.phone_number}</span>
						<span>{user.phone_number}</span>
						<span>{user.phone_number}</span>
					</div>
				</div>

				<div className="absolute top-1/2 -translate-y-1/2 w-full overflow-hidden">
					<div className="watermark-right opacity-50">
						<span>{user.phone_number}</span>
						<span>{user.phone_number}</span>
						<span>{user.phone_number}</span>
					</div>
				</div>

				<div className="absolute bottom-6 w-full overflow-hidden">
					<div className="watermark-left opacity-50">
						<span>{user.phone_number}</span>
						<span>{user.phone_number}</span>
						<span>{user.phone_number}</span>
					</div>
				</div>

			</div>
		</div>
	)
}
