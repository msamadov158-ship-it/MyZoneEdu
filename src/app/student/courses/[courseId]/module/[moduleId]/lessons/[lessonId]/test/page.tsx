"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "@/lib/axios";
import { Question } from "@/types/index";
import { getUserFromStorage } from "@/lib/helpers/userStore";

import { useCourses } from "@/hooks/useCourses";
import { CourseEdit } from "@/types";
import { useLessons } from "@/hooks/useLessons";

interface Answer {
  lesson_test_id: number;
  result: string;
}

interface TestResponse {
  correct_count: number;
}

const OPTION_KEYS = ["A", "B", "C", "D"] as const;
// type OptionKey = (typeof OPTION_KEYS)[number];

export default function LessonTest() {
  const router = useRouter();
  const { courseId, moduleId, lessonId } = useParams<{
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [studentId, setStudentId] = useState<number | string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const [course, setCourse] = useState<CourseEdit | null>(null);
  const {fetchLesson} = useLessons()
  const [lesson, setLessson] = useState('') 

  // ---- Pagination state ----
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  const { fetchCourse } = useCourses();

  useEffect(() => {
    const loadCourse = async () => {
      const res = await fetchCourse(courseId);
      if (res) setCourse(res);
      console.log(res);
    };
    loadCourse();
  }, [courseId, fetchCourse]);

  useEffect(() => {
		const load = async () => {
			setLoading(true)
			try {
				const res = await fetchLesson(lessonId)
				setLessson(res)
				console.log(res);
				
			} catch (err) {
				console.error('Error loading lesson:', err)
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [lessonId, fetchLesson])

  useEffect(() => {
    const user = getUserFromStorage();
    if (user?.user_id) {
      setStudentId(user.user_id);
    }
    fetchTest();
  }, []);

  const fetchTest = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/lesson_test/action/${lessonId}`);
      setQuestions(res.data.result || []);
      // console.log(res);
    } catch (err) {
      toast.error("Testni yuklashda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

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
        lesson_test_id: Number(q.id),
        result: answers[Number(q.id)] || "",
      }));

      const res = await API.post(`/api/lesson_test/action/${lessonId}`, {
        answer_list: answerList,
      });
      const data: TestResponse = res.data.result;

      if (studentId && data.correct_count !== undefined) {
        await API.get(
          `/api/lesson_test/finish/action/${studentId}/${lessonId}/${data.correct_count}`,
        );
        setScore({ correct: data.correct_count, total: questions.length });
        setShowResultModal(true);
        toast.success("Test muvaffaqiyatli yakunlandi!");
      } else {
        throw new Error("Student ID or correct count missing");
      }
    } catch (err) {
      toast.error("Javoblarni yuborishda xatolik!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
    router.push(
      `/student/courses/${courseId}/module/${moduleId}/lessons/${lessonId}`,
    );
  };

  // ---- Pagination helpers ----
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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Test yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
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
					<p className="text-gray-400 text-sm lg:text-base truncate m-0">
						Module {moduleId}: {course.title} / {lesson.title} dars testi
					</p>
					</div>
				</div>
			</header>

	{/* question / answer - paginated */}
      <main className="max-w-5xl mx-auto py-8 pt-8 lg:pt-20 px-4">
        {!current ? (
          <div className="text-center text-gray-500 py-16">
            Bu dars uchun savollar topilmadi.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Question Canvas */}
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

					{/* Savol javob */}
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
                    <div className="grid grid-cols-1  gap-3 ">
                      {OPTION_KEYS.map((opt) => {
                        const selected = answers[Number(current.id)] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleSelectAnswer(Number(current.id), opt)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left cursor-pointer ${
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
                  className="px-5 py-2.5 border cursor-pointers border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Oldingi
                </button>
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="px-5 py-2.5  cursor-pointer rounded-xl bg-red-700 text-white hover:bg-red-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Yuborilmoqda...
                    </>
                  ) : isLast ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Testni yakunlash
                    </>
                  ) : (
                    <>
                      Keyingi savol <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* ung taraf */}
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
                    "w-10 h-10 rounded-lg border flex items-center justify-center font-semibold text-sm transition-colors ";
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
                {score.correct / score.total >= 0.7 ? (
                  <CheckCircle className="w-12 h-12 text-green-500" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-500" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                {score.correct}/{score.total}
              </h2>
              <p className="text-gray-600 text-lg">
                {score.correct / score.total >= 0.7
                  ? "Ajoyib natija!"
                  : "Keyingi safar yaxshiroq bo'ladi!"}
              </p>
              <div className="pt-4">
                <button
                  onClick={handleCloseModal}
                  className="w-full px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}