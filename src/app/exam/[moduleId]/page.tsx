"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import {ArrowLeft,BookOpen, CheckCircle,XCircle,ChevronLeft,ChevronRight,Flag,} from "lucide-react";

import API from "@/lib/axios";
import { Question } from "@/types/index";
import { getUserFromStorage } from "@/lib/helpers/userStore";

interface Answer {
  module_test_id: number;
  result: string;
}

interface TestResponse {
  correct_count: number;
}

const OPTION_KEYS = ["A", "B", "C", "D"] as const;
type OptionKey = (typeof OPTION_KEYS)[number];

export default function LessonTest() {
  const router = useRouter();
  const { moduleId } = useParams<{ moduleId: string }>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [studentId, setStudentId] = useState<number | string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // 🔥 TIMER STATE
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // ---- Pagination state ----
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  // =========================
  // 🔥 TIMER LOGIC
  // =========================
  useEffect(() => {
    const TIMER_KEY = `exam_timer_${moduleId}`;
    const EXAM_DURATION = 60 * 60; // 1 soat

    let startTime = localStorage.getItem(TIMER_KEY);

    if (!startTime) {
      const now = Date.now();
      localStorage.setItem(TIMER_KEY, now.toString());
      startTime = now.toString();
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - Number(startTime)) / 1000);
      const remaining = EXAM_DURATION - elapsed;

      if (remaining <= 0) {
        clearInterval(interval);
        localStorage.removeItem(TIMER_KEY);

        toast.error("⏰ Vaqt tugadi!");
        router.push("/student");
        return;
      }

      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [moduleId, router]);

  // =========================
  // 🔥 FORMAT TIME
  // =========================
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // =========================
  // 🔥 FETCH TEST
  // =========================
  const fetchTest = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/module_test/action/${moduleId}`);
      setQuestions(res.data.result || []);
    } catch {
      toast.error("Testni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    const user = getUserFromStorage();
    if (user?.user_id) setStudentId(user.user_id);
    fetchTest();
  }, [fetchTest]);

 
  const handleSelectAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

 
  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.warning("Barcha savollarga javob bering!");
      return;
    }

    setSubmitting(true);
    try {
      const answerList: Answer[] = questions.map((q) => ({
        module_test_id: Number(q.id),
        result: answers[Number(q.id)] || "",
      }));

      const res = await API.post(`/api/module_test/action/${moduleId}`, {
        answer_list: answerList,
      });

      const data: TestResponse = res.data.result;

      if (studentId && data.correct_count !== undefined) {
        await API.get(
          `/api/module_test/finish/action/${studentId}/${moduleId}/${data.correct_count}`,
        );

        // 🔥 TIMER TOZALASH
        localStorage.removeItem(`exam_timer_${moduleId}`);

        setScore({ correct: data.correct_count, total: questions.length });
        setShowResultModal(true);

        toast.success("Test muvaffaqiyatli yakunlandi!");
      }
    } catch {
      toast.error("Xatolik yuz berdi!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    localStorage.removeItem(`exam_timer_${moduleId}`);
    setShowResultModal(false);
    router.push("/exam");
  };

  // Pagnationn
  const current = questions[currentIndex];
  const isAnswered = current ? answers[Number(current.id)] !== undefined : false;
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIndex === questions.length - 1;

  const goTo = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    
    if (isLast) {
      handleSubmit();
      return;
    }
    goTo(currentIndex + 1);
  };

  const handlePrevious = () => goTo(currentIndex - 1);

  const toggleFlag = () => {
    if (!current) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(Number(current.id))) next.delete(Number(current.id));
      else next.add(Number(current.id));
      return next;
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 h-190 lg:h-dvh flex justify-center items-center">
            <div className="relative w-full lg:w-[calc(100%-200px)] flex items-center justify-center h-64 rounded-2xl overflow-hidden
                             bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgba(162,0,0,0.08)]">
                {/* ambient glow accents */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d00000]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#a20000]/10 rounded-full blur-3xl" />

                <div className="relative text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-[#a20000]/15" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-[#a20000] border-r-[#d00000] border-b-transparent border-l-transparent animate-spin" />
                    </div>
                    <p className="text-gray-600">
                        Test savollari yuklanmoqda...
                    </p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* navbar */}
      <header className="bg-white shadow-sm border-b border-gray-300">
				<div className="max-w-full mx-auto px-4 py-4 flex items-center gap-3">
					<button
						onClick={() => router.back()}
						className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-red-700 shrink-0">
						<ArrowLeft className="w-5 h-5" />
					</button>

					<div className="flex flex-col min-w-0 lg:flex-row lg:items-baseline gap-1 lg:gap-3">
            <h1 className="text-lg lg:text-2xl font-semibold text-red-700 whitespace-nowrap">
              My Zone Online
            </h1>
            <h1 className="text-2xl font-bold text-gray-900">Dars Testi</h1>
					</div>
          <div className="flex items-center gap-4 ml-auto">
              <div className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold">
                ⏱ {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">
                Savollar: {questions.length}
              </div>
            </div>
				</div>
			</header>

      <main className="w-full mt-4 max-w-5xl mx-auto px-4">


      {/* savollar yuq */}
        {questions && questions.length === 0 ? (
          <div className="max-w-7xl mx-auto py-12 h-dvh flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-[calc(100%)] text-center py-16 px-8 rounded-2xl overflow-hidden
                           bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgba(162,0,0,0.08)]"
            >
                {/* ambient glow accents */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d00000]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#a20000]/10 rounded-full blur-3xl" />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
                    className="relative w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center
                               bg-linear-to-br from-[#a20000] to-[#d00000] shadow-lg shadow-[#a20000]/30"
                >
                    <BookOpen className="w-11 h-11 text-white" />
                </motion.div>

                <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    className="relative text-2xl font-bold bg-linear-to-r from-[#a20000] to-[#d00000] bg-clip-text text-transparent mb-3"
                >
                    Hozircha test modullari yo&apos;q
                </motion.h3>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="relative text-gray-500 text-lg"
                >
                    Tez orada yangi modullar qo&apos;shiladi
                </motion.p>
            </motion.div>
        </div>
        ) : (

          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start py-2">

            {/* // savollar busa chizish */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Savol {currentIndex + 1} / {questions.length}
                  </span>
                  <button
                    onClick={toggleFlag}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      flagged.has(Number(current.id))
                        ? "text-blue-700 font-semibold"
                        : "text-gray-500 hover:text-red-700"
                    }`}
                  >
                    <Flag
                      className="w-4 h-4"
                      fill={flagged.has(Number(current.id)) ? "currentColor" : "none"}
                    />
                    {flagged.has(Number(current.id)) ? "Belgilangan" : "Belgilash"}
                  </button>
                </div>

                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current.id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -24 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      {current.question_text}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {OPTION_KEYS.map((opt) => {
                        const selected = answers[Number(current.id)] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleSelectAnswer(Number(current.id), opt)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                              selected
                                ? "border-red-700 bg-red-50 text-red-900"
                                : "border-gray-200 hover:border-red-300 hover:bg-red-50/50"
                            }`}
                          >
                            <span className="font-medium mr-2">{opt}.</span>
                            {current[`option_${opt.toLowerCase()}` as keyof Question]}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center">
                <button
                  disabled={currentIndex === 0}
                  onClick={handlePrevious}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Oldingi
                </button>
                <button
                  onClick={handleNext}
                  disabled={ submitting}
                  className="px-5 py-2.5 rounded-xl bg-red-700 text-white hover:bg-red-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Yuborilmoqda...
                    </>
                  ) : isLast ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Testni yuborish
                    </>
                  ) : (
                    <>
                      Keyingi savol <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Ung taraf */}
            <div className="lg:col-span-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Savollar ro'yxati
              </h3>
              <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-50 border border-red-700" />
                  Javob berilgan
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-white border border-gray-200" />
                  Javobsiz
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-50 border border-blue-600" />
                  Belgilangan
                </div>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => {
                  const isCurrent = i === currentIndex;
                  const isFlagged = flagged.has(Number(q.id));
                  const isAnsweredQ = answers[Number(q.id)] !== undefined;
                  let cls =
                    "w-10 h-10 rounded-lg border-2 flex items-center justify-center font-semibold text-sm transition-colors ";
                  if (isCurrent) {
                    cls += "bg-red-700 text-white border-transparent shadow-sm";
                  } else if (isFlagged) {
                    cls += "border-blue-600 bg-blue-50 text-blue-700";
                  } else if (isAnsweredQ) {
                    cls += "bg-red-50 text-red-700 border-red-700";
                  } else {
                    cls += "border-gray-200 bg-white text-gray-700 hover:bg-gray-50";
                  }
                  return (
                    <button key={q.id} onClick={() => goTo(i)} className={cls}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  disabled={answeredCount < questions.length || submitting}
                  onClick={handleSubmit}
                  className="w-full py-3 border-2 border-red-700 text-red-700 rounded-xl font-semibold hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {answeredCount < questions.length
                    ? `Barcha savollarga javob bering (${answeredCount}/${questions.length})`
                    : "Testni yakunlash"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showResultModal && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black/50  z-50">
            <div className="relative max-w-md w-full flex items-center justify-center h-64 rounded-2xl overflow-hidden
                             bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgba(162,0,0,0.08)]">
                {/* ambient glow accents */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#d00000]/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#a20000]/10 rounded-full blur-3xl" />

                <div className=" flex flex-col justify-center items-center">
                    {score.correct / score.total >= 0.7 ? (
                        <CheckCircle className="w-12 h-12 text-green-500" />
                      ) : (
                        <XCircle className="w-12 h-12 text-red-500" />
                      )}
                    <p className="text-gray-600 my-4">
                        {score.correct}/{score.total}
                    </p>
                    <p className="text-gray-600 text-lg">
                    {score.correct / score.total >= 0.7
                            ? "Ajoyib natija!"
                            : "Keyingi safar yaxshiroq bo'ladi!"}
                    </p>
                    
                      <button
                        onClick={handleCloseModal}
                        className="w-full px-6 py-3 mt-5 rounded-xl bg-red-700 text-white hover:bg-red-500 hover:scale-95 transition-all duration-300 font-medium"
                      >
                        OK
                      </button>
                </div> 
            </div>
        </div>
      )}
    </div>
  );
}