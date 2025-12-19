'use client'
import { useState } from 'react'
import { useStudents } from '@/hooks/useStudents'

export default function Login() {
	const [user, setUser] = useState<{ username: string; password: string }>({
		username: '',
		password: '',
	})
	const { loginSubmit } = useStudents()

	return (
		<div className="bg-[var(--bgLight)] font-display text-slate-800">
			<div className="flex flex-col min-h-screen">
				<header className="w-full border-b border-slate-200">
					<nav className="container mx-auto px-6 py-4 flex justify-between items-center">
						<div className="flex items-center gap-3">
							<h1 className="text-xl font-bold text-slate-900 myZoneOnlineText">My Zone Online</h1>
						</div>
					</nav>
				</header>
				<main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
					<div className="w-full max-w-md space-y-8 bg-white rounded-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
						<div>
							<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">Xush kelibsiz</h2>
							<p className="mt-2 text-center text-sm text-slate-600">Dashboardingizga davom etish uchun tizimga kiring.</p>
						</div>

						<form onSubmit={(e) => loginSubmit(e, user.username, user.password)} className="mt-8 space-y-6">
							<div className="rounded-lg space-y-4">
								<div>
									<input onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))} autoComplete="email" className="form-input relative block w-full px-3 py-3 border border-slate-300 bg-[var(--bgLight)] placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm" id="username" name="username" placeholder="Foydalanuvchi nomingizni kiriting" required type="text" />
								</div>

								<div>
									<input onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))} autoComplete="current-password" className="form-input relative block w-full px-3 py-3 border border-slate-300 bg-[var(--bgLight)] placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm" id="password" name="password" placeholder="Parolingizni kiriting" required type="password" />
								</div>
							</div>
							<div>
								<button className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-myZoneOnline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]" type="submit">
									Kirish
								</button>
							</div>
						</form>
					</div>
				</main>
			</div>
		</div>
	)
}
