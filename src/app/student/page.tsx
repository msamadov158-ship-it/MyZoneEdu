'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTypes } from '@/hooks/useTypes'
import { useCourses } from '@/hooks/useCourses'
import { useCourseSave } from '@/hooks/useCourseSave'
import { motion, AnimatePresence } from 'framer-motion'
import { getUserFromStorage } from '@/lib/helpers/userStore'
import { BookOpen, Bookmark,Clock,PlayCircle,ClipboardList,AlertTriangle,Video,Calendar,MessageSquare,ListTodo, Award, MoreHorizontal, Trophy } from 'lucide-react'

export default function StudentDashboard() {
	const router = useRouter()
	const userId = getUserFromStorage()?.user_id
	const userName = getUserFromStorage()?.full_name

	const { types } = useTypes()
	const { savedCourses } = useCourseSave(userId as string)
	const typeId = getUserFromStorage()?.type_id
	const { courses, loading, fetchCourses } = useCourses()

	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
	const [selectedCategory, setSelectedCategory] = useState(typeId)
  const [time, setTime] = useState(new Date())
  
  const weekDays = [
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
    "Yakshanba",
  ];
  const todayIndex = (new Date().getDay() + 6) % 7;

	useEffect(() => {
    const interval  = setInterval(() =>{
      setTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
    
	}, []);

	useEffect(() => {
		fetchCourses()

	}, [fetchCourses])

	const { isSaved, loading: saveLoading, toggleSave } = useCourseSave(userId as string)

	const filteredCourses = selectedCategory === 'saved' ? savedCourses : courses?.filter((course) => course.type_id === selectedCategory && course.type_id === typeId)

	if (loading) {
		return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-64  bg-white rounded-2xl shadow-lg">
			<div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Kurslaringiz yuklanmoqda...</p>
			</div>
		</motion.div>
		);
	}

	if (!filteredCourses || filteredCourses.length === 0) {
		return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white rounded-2xl shadow-lg">
			<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
			<h3 className="text-lg font-semibold text-gray-900 mb-2">Kurslar topilmadi</h3>
			<p className="text-gray-600">Qidiruvni o'zgartiring yoki yangi kurslarni ko'rib chiqing</p>
		</motion.div>
		);
	}

	return (
    <main className="flex-1 w-full pt-16 md:pt-0 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0.1, translateX: '-300px' }} animate={{ opacity: 1, translateX: 0 }}>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Qaytib kelganingizdan xursandmiz
          </p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900">
            O‘rganishga tayyor,{" "}
            <span className="bg-linear-to-b from-[#D00000] via-[#CD0000] to-[#C30000] bg-clip-text text-transparent">
              {`${userName} ?`}
            </span>
          </h2>
        </motion.div>
        <motion.div initial={{ opacity: 0.5, translateX: '200px' }} animate={{ opacity: 1, translateX: 0 }} className="flex items-center space-x-2">
          <span className="text-xs px-4 py-2 bg-white border border-[#ECECEC] rounded-full text-gray-500 shadow-sm">
            Vaqt: {`${time.getHours()}:${time.getMinutes().toString().padStart(2, "0")}`}
          </span>
        </motion.div>
      </div>

	  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat Cards (Col 1 & 2) */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-2xl border-gray-50 p-6 flex flex-col justify-between shadow-xs  transition-all duration-300  hover:-translate-y-0.5 hover:shadow-xl hover:bg-white relative overflow-hidden cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#fff0ee] flex items-center justify-center text-[#a20000]">
                <ListTodo size={20} />
              </div>
              <span className="text-xs text-gray-400">Jarayonda</span>
            </div>
            <div>
              <p className="text-4xl text-gray-900 mb-1">4</p>
              <p className="text-base text-gray-600">Faol kurslar</p>
            </div>
          </div>
 
          {/* Stat Card 2 */}
          <div className="bg-white rounded-2xl border-gray-50 p-6 flex flex-col justify-between shadow-xs  transition-all duration-300  hover:-translate-y-0.5 hover:shadow-xl hover:bg-white relative overflow-hidden cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#fff0ee] flex items-center justify-center text-[#a20000]">
                <Clock size={20} />
              </div>
              <span className="text-xs text-gray-400">Umumiy vaqt</span>
            </div>
            <div>
              <p className="text-4xl text-gray-900 mb-1">
                124<span className="text-2xl text-gray-400 ml-1">soat</span>
              </p>
              <p className="text-base text-gray-600">Sarflangan soatlar</p>
            </div>
          </div>
 
          {/* Stat Card 3 */}
          <div onClick={() => router.push('/certification')} title="Sertifikatlarni ko'rish" className="bg-white rounded-2xl border-gray-50 p-6 flex flex-col justify-between shadow-xs  transition-all duration-300  hover:-translate-y-0.5 hover:shadow-xl hover:bg-white relative overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-[#a20000] opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-[#fff0ee] flex items-center justify-center text-[#a20000]">
                <Trophy size={20} />
              </div>
              <span className="text-xs text-gray-400">Yutuqlar</span>
            </div>
            <div className="relative z-10">
              <p className="text-4xl text-gray-900 mb-1">12</p>
              <p className="text-base text-gray-600">Olingan sertifikatlar</p>
            </div>
          </div>
        </div>
	

	{/* right side learning activity */}
	<div className=" grid grid-cols-3 gap-2 mb-auto pt-4 border-t border-[#ECECEC]">
  {weekDays.map((day, i) => {
    const isToday = i === todayIndex;
    return (
      <div
        key={day}
        className={`  rounded-lg flex flex-col items-center justify-center p-1.5 py-5 hover:scale-105 cursor-pointer transition duration-300 ${
          isToday
            ? "bg-linear-to-b from-[#D00000] via-[#CD0000] to-[#C30000]"
            : "bg-[#e8bdb6]"
        }`}
      >
        <span
          className={`text-xs font-medium ${
            isToday ? "text-white" : "text-gray-600"
          }`}
        >
          {day}
        </span>
      </div>
    );
  })}
</div>
	</div>	
      

      {/* dars joyi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            O‘rganishni davom ettiring
          </h3>

          <AnimatePresence>
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-[18px] border border-[#ECECEC] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-4"
              >
             
                <div className="sm:w-2/5 h-48 sm:h-auto relative bg-slate-300 cursor-pointer  " onClick={() => router.push(`/student/courses/${course.id}`)}>
					<Image	src={course.image_url}	alt={course.title}	fill	className="object-cover  transition-all duration-300 hover:scale-105 "	loading={'eager'}
					/>
					<div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border border-[#ECECEC] flex items-center space-x-1">
						<span className="w-2 h-2 rounded-full bg-[#a20000] animate-pulse" />
						<span className="text-xs font-semibold text-gray-900">
							Last Active
						</span>
					</div>
				</div>
                <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-[#a20000] bg-[#fff0ee] px-2 py-1 rounded-md">
                        {course.level}
                      </span>
                      <Bookmark size={18} className="text-gray-400" />
                    </div>
                    <h4 className="text-2xl text-gray-900 mb-2 leading-tight">
                      {course.title}
                    </h4>
                    <p className="text-base text-gray-600 line-clamp-2 mb-4">
                      {course.description}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-[#ECECEC]">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-600">Progress</span>
					  {/* need something */}
                      {/* <span className="text-gray-900 font-semibold">{course.progress}%</span> */}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden border border-[#ECECEC]/50">
                      <div
                        className="bg-linear-to-b from-[#D00000] via-[#CD0000] to-[#C30000] h-2 rounded-full"
                        // style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 flex items-center">
                        <PlayCircle size={16} className="mr-1" />
                        {/* Next: {course.nextLesson} */}
                      </p>
                      <button onClick={(e) => { e.stopPropagation()
						              router.push(`student/courses/${course.id}`)}} className="bg-linear-to-b from-[#D00000] via-[#CD0000] to-[#C30000] hover:scale-105  duration-300 cursor-pointer text-white font-semibold text-base px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                        	Resume
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Upcoming Tasks */}
        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-900">
              Upcoming Tasks
            </h3>
            <a className="text-xs text-[#a20000] hover:underline" href="#">
              View All
            </a>
          </div>
          <div className="space-y-2">
            {/* Task 1 */}
            <div className="bg-white rounded-[14px] border border-[#ECECEC] p-4 flex items-start space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-[#fff0ee] flex items-center justify-center shrink-0 text-[#a20000] border border-[#fedbd5] group-hover:bg-[#a20000] group-hover:text-white transition-colors">
                <ClipboardList size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-base font-semibold text-gray-900 truncate">
                  Module 4 Quiz: Concurrency
                </h5>
                <p className="text-xs text-gray-400 mb-1">
                  Advanced Web Architecture
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center space-x-1 text-red-700 text-[10px] uppercase font-bold tracking-wider bg-red-100/60 px-1 py-0.5 rounded-sm ">
                    <AlertTriangle size={12} />
                    <span>Due Today</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Task 2 */}
            <div className="bg-white rounded-[14px] border border-[#ECECEC] p-4 flex items-start space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform cursor-pointer group ">
              <div className="w-10 h-10 rounded-full bg-[#fff0ee] flex items-center justify-center shrink-0 text-[#a20000] border border-[#fedbd5] group-hover:bg-[#a20000] group-hover:text-white transition-colors">
                <Video size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-base font-semibold text-gray-900 truncate">
                  Live Session: System Design
                </h5>
                <p className="text-xs text-gray-400 mb-1">
                  Software Engineering Immersive
                </p>
                <div className="flex items-center text-gray-600 text-xs">
                  <Calendar size={14} className="mr-1" />
                  Tomorrow, 10:00 AM
                </div>
              </div>
            </div>

            {/* Task 3 */}
            <div className="bg-white rounded-[14px] border border-[#ECECEC] p-4 flex items-start space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#fff0ee] flex items-center justify-center shrink-0 text-[#a20000] border border-[#fedbd5] group-hover:bg-[#a20000] group-hover:text-white transition-colors">
                <MessageSquare size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-base font-semibold text-gray-900 truncate">
                  Peer Review Required
                </h5>
                <p className="text-xs text-gray-400 mb-1">
                  UI/UX Principles
                </p>
                <div className="flex items-center text-gray-600 text-xs">
                  <Clock size={14} className="mr-1" />
                  In 3 days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );

	// return (
	// 	<div className="max-w-7xl mx-auto space-y-8">

	// 		<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 ">
	// 			<div>
	// 				<h1 className="text-4xl font-bold text-gray-900 mb-2">Mening o‘quv panelim</h1>
	// 				<p className="text-gray-600 text-lg">O‘rganishni davom ettiring va yangi kurslarni kashf eting</p>
	// 			</div>

	// 			<div className="flex items-center gap-4">
	// 				<div className="flex bg-white rounded-xl p-1 shadow-lg border border-gray-200">
	// 					<button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-myZoneOnline text-white shadow-md' : 'text-gray-600 hover:text-blue-600'}`}>
	// 						<Grid className="w-5 h-5" />
	// 					</button>
	// 					<button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-myZoneOnline text-white shadow-md' : 'text-gray-600 hover:text-blue-600'}`}>
	// 						<List className="w-5 h-5" />
	// 					</button>
	// 				</div>
	// 			</div>
	// 		</motion.div>

	// 		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between ">
	// 			<div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
	// 				<div className="relative flex-1 max-w-md">
	// 					<Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
	// 					<input type="text" placeholder="Kurslarni qidirish..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm" />
	// 				</div>

	// 				<div className="flex items-center gap-2 overflow-x-auto">
	// 					{/* <button onClick={() => setSelectedCategory('saved')} className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 ${selectedCategory === 'saved' ? 'bg-myZoneOnline text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
	// 						Saqlanganlar
	// 					</button> */}

	// 					{types.filter((type) => type.id === typeId).map((t) => (
	// 						<button key={t.id} onClick={() => setSelectedCategory(t.id)} className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 ${selectedCategory === t.id ? 'bg-myZoneOnline text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
	// 							{t.title}
	// 						</button>
	// 					))}
	// 				</div>
	// 			</div>
	// 		</motion.div>

	// 		{/* Yuklanish holati */}
	// 		{loading ? (
	// 			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
	// 				<div className="text-center">
	// 					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
	// 					<p className="text-gray-600">Kurslaringiz yuklanmoqda...</p>
	// 				</div>
	// 			</motion.div>
	// 		) : filteredCourses && filteredCourses.length === 0 ? (
	// 			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white rounded-2xl shadow-lg">
	// 				<BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
	// 				<h3 className="text-lg font-semibold text-gray-900 mb-2">Kurslar topilmadi</h3>
	// 				<p className="text-gray-600">Qidiruvni o‘zgartiring yoki yangi kurslarni ko‘rib chiqing</p>
	// 			</motion.div>
	// 		) : (
	// 			<motion.div variants={containerVariants} animate="visible" className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
	// 				<AnimatePresence>
	// 					{filteredCourses?.map((course, idx) => {
	// 						const currentStatus = isSaved(course.id)

	// 						return (
	// 							<motion.div key={idx} variants={itemVariants} layout whileHover={{ y: -5, scale: 1.02 }} className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}>
	// 								<div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 shrink-0' : 'h-48'}`}>

	// 									{/* sends student/courses/course_id */}
	// 									<div onClick={() => router.push(`/student/courses/${course.id}`)} className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${course.image_url})` }} />

	// 									<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

	// 									<div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
	// 										<button onClick={() => toggleSave(course.id)} className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
	// 											{saveLoading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : currentStatus ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Bookmark className="w-5 h-5" />}
	// 										</button>

	// 										<button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
	// 											<Share2 className="w-4 h-4" />
	// 										</button>
	// 									</div>
	// 								</div>

	// 								<div className="p-6 flex-1">
	// 									<span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">{course.level || 'Umumiy'}</span>

	// 									<h3 onClick={() => router.push(`/student/courses/${course.id}`)} className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
	// 										{course.title}
	// 									</h3>

	// 									<p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description || 'Tavsif mavjud emas'}</p>

	// 									<div className="flex justify-end pt-4 border-t border-gray-100">
	// 										<motion.button
	// 											whileHover={{ scale: 1.05 }}
	// 											whileTap={{ scale: 0.95 }}
	// 											className="px-4 py-2 bg-myZoneOnline text-white rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium"
	// 											onClick={(e) => {
	// 												e.stopPropagation()
	// 												router.push(`student/courses/${course.id}`)
	// 											}}
	// 										>
	// 											<Play className="w-4 h-4" />
	// 											Davom etish
	// 										</motion.button>
	// 									</div>
	// 								</div>
	// 							</motion.div>
	// 						)
	// 					})}
	// 				</AnimatePresence>
	// 			</motion.div>
	// 		)}
	// 	</div>
	// )

// 	return (
//     <main className="flex-1 w-full pt-16 md:pt-0 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <motion.div initial={{opacity:0.1, translateX:'-300px'}} animate={{opacity:1, translateX:0}} >
//           <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
//             Welcome Back
//           </p>
//           <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900">
//             Ready to learn,{" "}
//             <span className="bg-linear-to-b from-[#D00000] via-[#CD0000] to-[#C30000] bg-clip-text text-transparent">
//               {/* {`${userName} ?`} */}
//             </span>
//           </h2>
//         </motion.div>
//         <motion.div initial={{opacity:0.5, translateX:'200px'}} animate={{opacity:1, translateX:0}} className="flex items-center space-x-2">
//           <span className="text-xs px-4 py-2 bg-white border border-[#ECECEC] rounded-full text-gray-500 shadow-sm">
//             Today: 2h 15m
//           </span>
//         </motion.div>
//       </div>
 
// 		if (loading) {
//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg">
//       <div className="text-center">
//         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//         <p className="text-gray-600">Kurslaringiz yuklanmoqda...</p>
//       </div>
//     </motion.div>
//   );
// }

// if (!filteredCourses || filteredCourses.length === 0) {
//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white rounded-2xl shadow-lg">
//       <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//       <h3 className="text-lg font-semibold text-gray-900 mb-2">Kurslar topilmadi</h3>
//       <p className="text-gray-600">Qidiruvni o'zgartiring yoki yangi kurslarni ko'rib chiqing</p>
//     </motion.div>
//   );
// }

// return (
//   <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//     {/* Continue Learning */}
//     <div className="lg:col-span-2">
//       <h3 className="text-2xl font-semibold text-gray-900 mb-4">
//         Continue Learning
//       </h3>

//       <AnimatePresence>
//         {filteredCourses.map((course) => (
//           <motion.div
//             key={course.id}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             className="bg-white rounded-[18px] border border-[#ECECEC] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] mb-4"
//           >
//             {/* Thumbnail placeholder — swap this div for your <Image /> */}
//             <div className="sm:w-2/5 h-48 sm:h-auto relative bg-slate-300">
//               <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border border-[#ECECEC] flex items-center space-x-1">
//                 <span className="w-2 h-2 rounded-full bg-[#a20000] animate-pulse" />
//                 <span className="text-xs font-semibold text-gray-900">
//                   Last Active
//                 </span>
//               </div>
//             </div>
//             <div className="p-6 sm:w-3/5 flex flex-col justify-between">
//               <div>
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="text-xs text-[#a20000] bg-[#fff0ee] px-2 py-1 rounded-md">
//                     {course.category}
//                   </span>
//                   <Bookmark size={18} className="text-gray-400" />
//                 </div>
//                 <h4 className="text-2xl text-gray-900 mb-2 leading-tight">
//                   {course.title}
//                 </h4>
//                 <p className="text-base text-gray-600 line-clamp-2 mb-4">
//                   {course.description}
//                 </p>
//               </div>
//               <div className="mt-auto pt-4 border-t border-[#ECECEC]">
//                 <div className="flex justify-between text-xs mb-2">
//                   <span className="text-gray-600">Progress</span>
//                   <span className="text-gray-900 font-semibold">{course.progress}%</span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden border border-[#ECECEC]/50">
//                   <div
//                     className="bg-gradient-to-b from-[#D00000] via-[#CD0000] to-[#C30000] h-2 rounded-full"
//                     style={{ width: `${course.progress}%` }}
//                   />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs text-gray-400 flex items-center">
//                     <PlayCircle size={16} className="mr-1" />
//                     	Next: {course.nextLesson}
//                   </p>
//                   <button className="bg-gradient-to-b from-[#D00000] via-[#CD0000] to-[#C30000] text-white font-semibold text-base px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
//                     Resume
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </div>

//     <div className="lg:col-span-1">
//       {/* Upcoming Tasks block — unchanged */}
//       ...
//     </div>
//   </div>
// );

			

			

			





//  {/* mine */}
//       {/* 3ta carta */}


      
 
//       {/* dars joyi */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* Continue Learning */}
//         <div className="lg:col-span-2">
//           <h3 className="text-2xl font-semibold text-gray-900 mb-4">
//             Continue Learning
//           </h3>

// 		  {/* dars joyi */}
// 		  <div className="bg-white rounded-[18px] border border-[#ECECEC] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
//             {/* Thumbnail placeholder — swap this div for your <Image /> */}
//             <div className="sm:w-2/5 h-48 sm:h-auto relative bg-slate-300">
//               <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border border-[#ECECEC] flex items-center space-x-1">
//                 <span className="w-2 h-2 rounded-full bg-[#a20000] animate-pulse" />
//                 <span className="text-xs font-semibold text-gray-900">
//                   Last Active
//                 </span>
//               </div>
//             </div>
//             <div className="p-6 sm:w-3/5 flex flex-col justify-between">
//               <div>
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="text-xs text-[#a20000] bg-[#fff0ee] px-2 py-1 rounded-md">
//                     Advanced Web Architecture
//                   </span>
//                   <Bookmark size={18} className="text-gray-400" />
//                 </div>
//                 <h4 className="text-2xl text-gray-900 mb-2 leading-tight">
//                   Building Scalable Microservices with Go and gRPC
//                 </h4>
//                 <p className="text-base text-gray-600 line-clamp-2 mb-4">
//                   Dive deep into distributed systems. Learn to architect,
//                   deploy, and monitor high-performance microservices in a
//                   cloud-native environment.
//                 </p>
//               </div>
//               <div className="mt-auto pt-4 border-t border-[#ECECEC]">
//                 <div className="flex justify-between text-xs mb-2">
//                   <span className="text-gray-600">Progress</span>
//                   <span className="text-gray-900 font-semibold">68%</span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden border border-[#ECECEC]/50">
//                   <div
//                     className="bg-gradient-to-b from-[#D00000] via-[#CD0000] to-[#C30000] h-2 rounded-full"
//                     style={{ width: "68%" }}
//                   />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs text-gray-400 flex items-center">
//                     <PlayCircle size={16} className="mr-1" />
//                     Next: Designing Resilient API Gateways
//                   </p>
//                   <button className="bg-gradient-to-b from-[#D00000] via-[#CD0000] to-[#C30000] text-white font-semibold text-base px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
//                     Resume
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
        
          
//         </div>
 
//         {/* Upcoming Tasks */}
//         <div className="lg:col-span-1">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-2xl font-semibold text-gray-900">
//               Upcoming Tasks
//             </h3>
//             <a className="text-xs text-[#a20000] hover:underline" href="#">
//               View All
//             </a>
//           </div>
//           <div className="space-y-2">
//             {/* Task 1 */}
//             <div className="bg-white rounded-[14px] border border-[#ECECEC] p-4 flex items-start space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform cursor-pointer group">
//               <div className="w-10 h-10 rounded-full bg-[#fff0ee] flex items-center justify-center flex-shrink-0 text-[#a20000] border border-[#fedbd5] group-hover:bg-[#a20000] group-hover:text-white transition-colors">
//                 <ClipboardList size={20} />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h5 className="text-base font-semibold text-gray-900 truncate">
//                   Module 4 Quiz: Concurrency
//                 </h5>
//                 <p className="text-xs text-gray-400 mb-1">
//                   Advanced Web Architecture
//                 </p>
//                 <div className="flex items-center space-x-2 mt-1">
//                   <span className="inline-flex items-center space-x-1 text-red-700 text-[10px] uppercase font-bold tracking-wider bg-red-100/60 px-1 py-0.5 rounded-sm">
//                     <AlertTriangle size={12} />
//                     <span>Due Today</span>
//                   </span>
//                 </div>
//               </div>
//             </div>
 
//             {/* Task 2 */}
//             <div className="bg-white rounded-[14px] border border-[#ECECEC] p-4 flex items-start space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform cursor-pointer group">
//               <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500 border border-[#ECECEC] group-hover:bg-[#fff0ee] transition-colors">
//                 <Video size={20} />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h5 className="text-base font-semibold text-gray-900 truncate">
//                   Live Session: System Design
//                 </h5>
//                 <p className="text-xs text-gray-400 mb-1">
//                   Software Engineering Immersive
//                 </p>
//                 <div className="flex items-center text-gray-600 text-xs">
//                   <Calendar size={14} className="mr-1" />
//                   Tomorrow, 10:00 AM
//                 </div>
//               </div>
//             </div>
 
//             {/* Task 3 */}
//             <div className="bg-white rounded-[14px] border border-[#ECECEC] p-4 flex items-start space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-transform cursor-pointer group">
//               <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500 border border-[#ECECEC] group-hover:bg-[#fff0ee] transition-colors">
//                 <MessageSquare size={20} />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h5 className="text-base font-semibold text-gray-900 truncate">
//                   Peer Review Required
//                 </h5>
//                 <p className="text-xs text-gray-400 mb-1">
//                   UI/UX Principles
//                 </p>
//                 <div className="flex items-center text-gray-600 text-xs">
//                   <Clock size={14} className="mr-1" />
//                   In 3 days
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
}
