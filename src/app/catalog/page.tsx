"use client";

import { Search, Star } from "lucide-react";
import { Course } from "@/types";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";




// backendan shular kelishi kerak
const courses: Course[] = [
  {
    id: 1,
    category: "UI/UX",
    title: "Figma komponentlarining ilg‘or arxitekturasi",
    description: "Dizayn tizimlari va murakkab avtomatik joylashtirish (autolayout) tuzilmalarini mukammal o‘zlashtiring.",
    rating: "4.9",
    reviews: 128,
    price: 149,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnb5Owm9BpGaDH7kMkKQtStD7BbXm63cslpKO4kYhgnLTqpwX02whx6j816PUFAm-_8elZBJn7k0ZdI6sU2lasLf50aNde6i4JSqzXMJJBg641HpRH8cof9KWGYJH3Ts0ZFW5eVJTccQ3yEmtSGrv3yH_BuaprTAEqfLRWIbdqGLkFGalYHMhY0Pj7WQJkWYbR8shDP33RibOW6Zo-OZZEppJd8iIjxLij2v5njgEyv1XxiYaYaPD0SgNxg6MH1MuJSMLsPJyCFJw_",
  },
  {
    id: 2,
    category: "Development",
    title: "Full-Stack React & Node.js Masterclass",
    description: "Build scalable production applications from scratch.",
    rating: "4.8",
    reviews: 452,
    price: 199,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIZ00ZcEUpPhhi1C8xPyDVlIeZJMc7qMn163yGdSB2zcbjTlHei4Lz_RvmNrJo5uNz8ua07wMXA56MXkjS85oCkQjeimADSCMg5yBIfvo9c8pmOpFK71jrujMTrT6Nc-7gcK_UapAn6Slab84qC5UqdGSnSQwoQNhEX6BoUmNjSNMrW4AZltd1jSPaBIgTaDDlYmLIi8zHT0yzKDSB1oT7grcRbdGITypYFPr-chCm5FIJyS1l1CFjqWkV8FsMGRIXoVMIabqu28xo",
  },
  {
    id: 3,
    category: "AI",
    title: "Amaliy mashinali o‘qitish asoslari",
    description: "Zamonaviy ML algoritmlarining amaliy tatbiqlari.",
    rating: "5.0",
    reviews: 89,
    price: 249,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCseHYreq5Zx2oAoPXw7-cm8grefJvBkKz6OqHQnZ9ey5igG9P9wbcZGKnqDiIF0SgsmTjRUvHzFMd-TUw65Ukcvcv4J1yT47NBujuWwzLQa4P38E7RAPzZ9H6ALQasGIy_JlY6zua4XkRdyFrC5YvvGrudwfXuE0JL866WxGYILs9dlDJ5LJeN8OE8VDoCMfY4qO_F2rJfzTAqJlj7Ygcmf96yUzUbqLCas-Q4kB3GPZumkPbLXyFKFNddhNRRKW8hqVQfVfkXRsUV",
  },
  {
    id: 4,
    category: "UI/UX",
    title: "Figma komponentlarining ilg‘or arxitekturasi",
    description: "Dizayn tizimlari va murakkab avtomatik joylashtirish (autolayout) tuzilmalarini mukammal o‘zlashtiring.",
    rating: "4.9",
    reviews: 128,
    price: 149,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnb5Owm9BpGaDH7kMkKQtStD7BbXm63cslpKO4kYhgnLTqpwX02whx6j816PUFAm-_8elZBJn7k0ZdI6sU2lasLf50aNde6i4JSqzXMJJBg641HpRH8cof9KWGYJH3Ts0ZFW5eVJTccQ3yEmtSGrv3yH_BuaprTAEqfLRWIbdqGLkFGalYHMhY0Pj7WQJkWYbR8shDP33RibOW6Zo-OZZEppJd8iIjxLij2v5njgEyv1XxiYaYaPD0SgNxg6MH1MuJSMLsPJyCFJw_",
  },
  {
    id: 5,
    category: "Development",
    title: "Full-Stack React & Node.js Masterclass",
    description: "Build scalable production applications from scratch.",
    rating: "4.8",
    reviews: 452,
    price: 199,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIZ00ZcEUpPhhi1C8xPyDVlIeZJMc7qMn163yGdSB2zcbjTlHei4Lz_RvmNrJo5uNz8ua07wMXA56MXkjS85oCkQjeimADSCMg5yBIfvo9c8pmOpFK71jrujMTrT6Nc-7gcK_UapAn6Slab84qC5UqdGSnSQwoQNhEX6BoUmNjSNMrW4AZltd1jSPaBIgTaDDlYmLIi8zHT0yzKDSB1oT7grcRbdGITypYFPr-chCm5FIJyS1l1CFjqWkV8FsMGRIXoVMIabqu28xo",
  },
  {
    id: 6,
    category: "AI",
    title: "Amaliy mashinali o‘qitish asoslari",
    description: "Zamonaviy ML algoritmlarining amaliy tatbiqlari.",
    rating: "5.0",
    reviews: 89,
    price: 249,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCseHYreq5Zx2oAoPXw7-cm8grefJvBkKz6OqHQnZ9ey5igG9P9wbcZGKnqDiIF0SgsmTjRUvHzFMd-TUw65Ukcvcv4J1yT47NBujuWwzLQa4P38E7RAPzZ9H6ALQasGIy_JlY6zua4XkRdyFrC5YvvGrudwfXuE0JL866WxGYILs9dlDJ5LJeN8OE8VDoCMfY4qO_F2rJfzTAqJlj7Ygcmf96yUzUbqLCas-Q4kB3GPZumkPbLXyFKFNddhNRRKW8hqVQfVfkXRsUV",
  },
];

// bular categoriyalar shu buyicha filter bulishi kerak
const categories = [
  { label: "All Courses", value: "All Courses" },
  { label: "UI/UX Design", value: "UI/UX" },
  { label: "Development", value: "Development" },
  { label: "Artificial Intelligence", value: "AI" },
  { label: "Business", value: "Business" },
];

export default function CourseCatalog() {

    const [search ,setSearch] = useState('')
    const [selectedCategory, setSelectedCatgory] = useState('All courses')
    const router = useRouter()

    const fitlerCourses = selectedCategory === 'All Courses'
        ? courses 
        :courses.filter((i) => i.category=== selectedCategory)



  return (
    <main className="flex-1 min-h-screen bg-[#F5F5F5]">
      {/* Hero & Filters */}
      <header className="bg-white border-b border-[#ECECEC] px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111111] mb-4">
            Katalog bilan tanishing
          </h1>
          <p className="text-[#666666] text-lg mb-8 max-w-2xl">
            Texnologiya, biznes va dizayn sohalaridagi ko‘nikmalaringizni rivojlantirish uchun soha mutaxassislari tomonidan ishlab chiqilgan yuqori sifatli kurslarni kashf eting.
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="flex items-center bg-white rounded-xl px-4 py-3 w-full md:w-96 border border-[#ECECEC] focus-within:border-[#a20000] transition-colors shadow-sm">
              <Search className="text-[#999999] mr-2" size={20} />
              <input
                className="bg-transparent border-none outline-none text-base w-full placeholder-[#999999]"
                placeholder="Nimani o‘rganishni xohlaysiz?"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 ">
             {categories.map((category) => {
          const isActive = selectedCategory === category.value;
          return (
            <button
                    key={category.value}
                    onClick={() => setSelectedCatgory(category.value)}
                    className={
                        isActive
                        ? "px-6 py-2 rounded-full border border-[#ECECEC] text-white font-medium text-sm shadow-sm cursor-pointer transition duration-300"
                        : "px-6 py-2 rounded-full border border-[#ECECEC] bg-white text-[#111111] hover:bg-[#F5F5F5] font-medium text-sm cursor-pointer hover:scale-105 transition duration-300"
                    }
                    style={
                        isActive
                        ? {
                            background:
                                "linear-gradient(180deg, #D00000 0%, #D50000 30%, #CD0000 60%, #C30000 100%)",
                            }
                        : undefined
                    }
                    >
                    {category.label}
                    </button>
                );
                })}
            </div>
          </div>
        </div>
      </header>

      {/* Course Grid */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses
          
          .filter((course) => (course.title.trim().toLowerCase().includes(search.trim().toLocaleLowerCase())))
          .map((course, index) => (
           <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6, cursor:'pointer' }}
                key={course.id}
                // course id si bilan push
                onClick={() => router.push(`/api/catalog/${course.id}`)}

                className="bg-white border border-[#ECECEC] rounded-[18px] overflow-hidden group hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col h-full"
                >
                <div className="h-48 bg-[#F5F5F5] relative overflow-hidden">
                    <img
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={course.imageUrl}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-[#ECECEC]">
                    <span className="text-xs font-medium text-[#111111] uppercase tracking-widest">
                        {course.category}
                    </span>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-[#111111] mb-2 line-clamp-2">
                    {course.title}
                    </h3>
                    <p className="text-[#666666] text-sm mb-4">{course.description}</p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#ECECEC]">
                    <div className="flex items-center gap-2">
                        <Star className="text-[#a20000] fill-[#a20000]" size={16} />
                        <span className="font-medium text-sm">{course.rating}</span>
                        <span className="text-[#999999] text-xs">({course.reviews})</span>
                    </div>
                    <div className="font-bold text-lg text-[#111111]">${course.price}</div>
                    </div>
                </div>
                </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}