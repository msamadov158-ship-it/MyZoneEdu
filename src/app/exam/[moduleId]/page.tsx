"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, XCircle } from "lucide-react";

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

  // =========================
  // 🔥 TIMER LOGIC
  // =========================
  useEffect(() => {
    const TIMER_KEY = `exam_timer_${moduleId}`;
    const EXAM_DURATION = 60 * 2; // 1 soat

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

  // =========================
  // 🔥 SELECT ANSWER
  // =========================
  const handleSelectAnswer = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  // =========================
  // 🔥 SUBMIT
  // =========================
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
    <div className="min-h-screen relative">
      <header className="bg-white shadow-sm border-b border-gray-200 rounded-2xl sticky top-0 z-10">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Dars Testi</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold">
                ⏱ {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">
                Savollar: {questions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full mt-4">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Kurslaringiz yuklanmoqda...</p>
            </div>
          </motion.div>
        ) : questions && questions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Testlar topilmadi
            </h3>
            <p className="text-gray-600">
              Qidiruvni o‘zgartiring yoki yangi testladni ko‘rib chiqing
            </p>
          </motion.div>
        ) : (
          <div className="rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-6 space-y-8">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border-b border-gray-200 last:border-0 pb-6 last:pb-0"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {index + 1}. {question.question_text}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["A", "B", "C", "D"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() =>
                          handleSelectAnswer(Number(question.id), opt)
                        }
                        className={`p-4 rounded-xl border transition-all duration-300 text-left ${answers[Number(question.id)] === opt ? "border-blue-500 bg-blue-50 text-blue-900" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"}`}
                      >
                        <span className="font-medium mr-2">{opt}.</span>
                        {
                          question[
                            `option_${opt.toLowerCase()}` as keyof Question
                          ]
                        }
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex justify-end">
                {questions && questions.length > 0 && (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-3 rounded-xl bg-myZoneOnline text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Testni yuborish
                      </>
                    )}
                  </button>
                )}
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
