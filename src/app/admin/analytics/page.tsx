"use client";

import React from "react";
import {
  TrendingUp,
  Minus,
  CalendarDays,
  ChevronDown,
  Code2,
  Paintbrush,
  Database,
  GraduationCap,
  Award,
  Upload,
} from "lucide-react";

/**
 * EduAI Admin — Dashboard Main Content
 * Stat cards, growth chart, top courses table, and live activity feed.
 * Tailwind CSS + lucide-react icons. Brand palette: #a20000 / #d00000.
 */

const statCards = [
  {
    label: "Total Revenue",
    value: "$842,500",
    delta: "+12.4%",
    trend: "up" as const,
    path: "M0,25 Q10,20 20,22 T40,15 T60,18 T80,5 T100,2",
    filled: true,
  },
  {
    label: "Active Students",
    value: "14,290",
    delta: "+8.1%",
    trend: "up" as const,
    path: "M0,28 Q15,25 25,20 T45,18 T65,10 T85,12 T100,4",
  },
  {
    label: "Completion Rate",
    value: "68.4%",
    delta: "+0.2%",
    trend: "flat" as const,
    path: "M0,15 Q20,16 30,14 T50,15 T70,13 T90,14 T100,12",
  },
  {
    label: "Teacher Activity",
    value: "92.1%",
    delta: "+4.5%",
    trend: "up" as const,
    path: "M0,20 Q10,22 25,18 T40,20 T60,10 T80,8 T100,5",
  },
];

const topCourses = [
  {
    name: "Advanced React Patterns",
    category: "Engineering",
    icon: Code2,
    revenue: "$124,500",
    enrollment: 94,
  },
  {
    name: "UI/UX Masterclass",
    category: "Design",
    icon: Paintbrush,
    revenue: "$98,200",
    enrollment: 88,
  },
  {
    name: "Machine Learning A-Z",
    category: "Data Science",
    icon: Database,
    revenue: "$85,100",
    enrollment: 76,
  },
];

const activity = [
  {
    icon: GraduationCap,
    title: "New Premium Enrollment",
    subtitle: "Sarah J. enrolled in Advanced React",
    time: "2 mins ago",
    highlighted: true,
  },
  {
    icon: Award,
    title: "Certificate Issued",
    subtitle: "David L. completed UX Masterclass",
    time: "15 mins ago",
  },
  {
    icon: Upload,
    title: "Course Updated",
    subtitle: "Prof. Smith added new modules",
    time: "1 hour ago",
  },
];

export default function DashboardMain() {
  return (
    <main className="flex-1 overflow-y-auto p-8 bg-[#F5F5F5]">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-semibold text-[#111111]">
            Platform Overview
          </h2>
          <p className="text-sm text-[#666666] mt-1">
            Real-time metrics and historical performance data.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#ECECEC] rounded-lg text-[#111111] text-xs font-medium hover:bg-[#F5F5F5] transition-colors"
        >
          <CalendarDays size={18} />
          Last 30 Days
          <ChevronDown size={18} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-[#ECECEC] rounded-xl p-4 flex flex-col transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-[11px] text-[#666666] tracking-wider uppercase font-medium">
                {card.label}
              </span>
              <div
                className={
                  card.trend === "up"
                    ? "flex items-center gap-1 px-2 py-1 rounded-full bg-[#ffe2dd] text-[#a20000] text-[11px] font-medium"
                    : "flex items-center gap-1 px-2 py-1 rounded-full bg-[#F5F5F5] text-[#666666] text-[11px] font-medium"
                }
              >
                {card.trend === "up" ? (
                  <TrendingUp size={14} />
                ) : (
                  <Minus size={14} />
                )}
                {card.delta}
              </div>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-semibold text-[#111111]">
                {card.value}
              </span>
            </div>
            <div className="mt-auto h-12 w-full">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 30"
                vectorEffect="non-scaling-stroke"
                preserveAspectRatio="none"
              >
                <path
                  d={card.path}
                  fill="none"
                  stroke={card.trend === "flat" ? "#5e5e5e" : "#a20000"}
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                {card.filled && (
                  <>
                    <path
                      d={`${card.path} L100,30 L0,30 Z`}
                      fill="url(#spark-grad)"
                      opacity="0.2"
                    />
                    <defs>
                      <linearGradient
                        id="spark-grad"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#a20000" />
                        <stop
                          offset="100%"
                          stopColor="#ffffff"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                  </>
                )}
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Main Interactive Chart Area */}
      <div className="bg-white border border-[#ECECEC] rounded-xl p-6 mb-8 transition-all duration-200 hover:shadow-sm hover:scale-101">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#111111]">
            Platform Growth
          </h3>
          <div className="flex bg-[#F5F5F5] p-1 rounded-lg border border-[#ECECEC]">
            <button
              type="button"
              className="px-4 py-1 rounded text-[#666666] text-xs hover:text-[#111111] transition-colors"
            >
              1W
            </button>
            <button
              type="button"
              className="px-4 py-1 rounded bg-white shadow-sm text-[#111111] text-xs font-semibold"
            >
              1M
            </button>
            <button
              type="button"
              className="px-4 py-1 rounded text-[#666666] text-xs hover:text-[#111111] transition-colors"
            >
              1Y
            </button>
          </div>
        </div>

        <div className="w-full h-80 relative mt-4">
          {/* Y Axis Labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[#999999] text-xs pb-8">
            <span>100k</span>
            <span>75k</span>
            <span>50k</span>
            <span>25k</span>
            <span>0</span>
          </div>

          {/* Chart Canvas */}
          <div className="absolute left-10 right-0 top-0 bottom-8 border-b border-l border-[#ECECEC]">
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="w-full border-t border-[#ECECEC]/50 h-0" />
              <div className="w-full border-t border-[#ECECEC]/50 h-0" />
              <div className="w-full border-t border-[#ECECEC]/50 h-0" />
              <div className="w-full border-t border-[#ECECEC]/50 h-0" />
            </div>

            <svg
              className="w-full h-full absolute inset-0"
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="main-chart-grad"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#D00000" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,280 C100,270 200,220 300,200 C400,180 500,210 600,150 C700,90 800,120 900,50 C950,15 980,10 1000,0 L1000,300 L0,300 Z"
                fill="url(#main-chart-grad)"
              />
              <path
                className="drop-shadow-sm"
                d="M0,280 C100,270 200,220 300,200 C400,180 500,210 600,150 C700,90 800,120 900,50 C950,15 980,10 1000,0"
                fill="none"
                stroke="#D00000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
              />
              <circle
                className="cursor-pointer transition-all"
                cx="900"
                cy="50"
                fill="#FFFFFF"
                r="6"
                stroke="#D00000"
                strokeWidth="3"
              />
              <line
                opacity="0.5"
                stroke="#a20000"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="900"
                x2="900"
                y1="50"
                y2="300"
              />
            </svg>

            {/* Tooltip Mockup */}
            <div className="absolute bg-white border border-[#ECECEC] shadow-lg rounded-lg p-2 top-[20px] left-[840px] pointer-events-none">
              <p className="text-xs text-[#666666]">Nov 24</p>
              <p className="text-sm font-semibold text-[#111111]">82,450</p>
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[#999999] text-xs pt-2">
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>
      </div>

      {/* Bottom Split Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Performing Courses */}
        <div className="col-span-2 bg-white border border-[#ECECEC] rounded-xl p-6 transition-all duration-200 hover:shadow-sm hover:scale-101 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-[#111111]">
              Top Performing Courses
            </h3>
            <button
              type="button"
              className="text-[#a20000] text-xs hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ECECEC]">
                  <th className="py-2 text-xs text-[#666666] font-medium w-1/2">
                    Course Name
                  </th>
                  <th className="py-2 text-xs text-[#666666] font-medium w-1/4">
                    Revenue
                  </th>
                  <th className="py-2 text-xs text-[#666666] font-medium w-1/4 text-right">
                    Enrollment Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((course, i) => (
                  <tr
                    key={course.name}
                    className={
                      i < topCourses.length - 1
                        ? "border-b border-[#ECECEC]/50 hover:bg-[#F5F5F5]/50 transition-colors"
                        : "hover:bg-[#F5F5F5]/50 transition-colors"
                    }
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-[#ffe2dd] flex items-center justify-center text-[#a20000]">
                          <course.icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm text-[#111111] font-medium">
                            {course.name}
                          </p>
                          <p className="text-xs text-[#666666]">
                            {course.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-[#111111]">
                      {course.revenue}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm text-[#111111]">
                          {course.enrollment}%
                        </span>
                        <div className="w-16 h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-b from-[#D00000] via-[#D50000] to-[#C30000] rounded-full"
                            style={{ width: `${course.enrollment}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity */}
        <div className="col-span-1 bg-white border border-[#ECECEC] rounded-xl p-6 transition-all duration-200 hover:shadow-sm hover:scale-101 flex flex-col">
          <h3 className="text-xl font-semibold text-[#111111] mb-4">
            Live Activity
          </h3>
          <div className="relative pl-2 flex-1">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[#ECECEC]" />
            {activity.map((item, i) => (
              <div
                key={item.title}
                className={
                  i < activity.length - 1
                    ? "relative flex gap-4 mb-6"
                    : "relative flex gap-4"
                }
              >
                <div
                  className={
                    item.highlighted
                      ? "w-8 h-8 rounded-full bg-[#ffe2dd] border-2 border-white flex-shrink-0 flex items-center justify-center text-[#a20000] z-10"
                      : "w-8 h-8 rounded-full bg-[#F5F5F5] border-2 border-white flex-shrink-0 flex items-center justify-center text-[#666666] z-10"
                  }
                >
                  <item.icon size={14} />
                </div>
                <div className="pt-1">
                  <p className="text-sm text-[#111111] leading-tight">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#666666] mt-1">{item.subtitle}</p>
                  <span className="text-xs text-[#999999] block mt-1">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
