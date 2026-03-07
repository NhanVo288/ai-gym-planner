import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { useState } from "react";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import {
  ArrowRight,
  Dumbbell,
  History,
  Calendar,
  Clock,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { UserProfile } from "../types";
import { useNavigate } from "react-router-dom";

const goalOptions = [
  {
    value: "lose_weight",
    label: "Giảm cân",
  },
  {
    value: "gain_muscle",
    label: "Tăng cơ",
  },
  {
    value: "maintain_weight",
    label: "Giữ cân",
  },
  {
    value: "improve_endurance",
    label: "Tăng sức bền",
  },
  {
    value: "increase_strength",
    label: "Tăng sức mạnh",
  },
  {
    value: "body_recomposition",
    label: "Giảm mỡ tăng cơ",
  },
];
const experienceOptions = [
  {
    value: "beginner",
    label: "Người mới bắt đầu",
  },
  {
    value: "intermediate",
    label: "Trung cấp",
  },
  {
    value: "advanced",
    label: "Nâng cao",
  },
];
const daysOptions = [
  { value: "2", label: "2 buổi / tuần" },
  { value: "3", label: "3 buổi / tuần" },
  { value: "4", label: "4 buổi / tuần" },
  { value: "5", label: "5 buổi / tuần" },
  { value: "6", label: "6 buổi / tuần" },
];
const sessionOptions = [
  { value: "30", label: "30 phút" },
  { value: "45", label: "45 phút" },
  { value: "60", label: "60 phút" },
  { value: "90", label: "90 phút" },
];
const equipmentOptions = [
  {
    value: "bodyweight",
    label: "Chỉ dùng trọng lượng cơ thể",
  },
  {
    value: "dumbbell",
    label: "Có tạ đơn (Dumbbell)",
  },
  {
    value: "barbell",
    label: "Có tạ đòn (Barbell)",
  },
  {
    value: "machine",
    label: "Máy tập tại phòng gym",
  },
  {
    value: "full_gym",
    label: "Đầy đủ thiết bị phòng gym",
  },
];
const splitOptions = [
  {
    value: "full_body",
    label: "Full Body (Toàn thân)",
  },
  {
    value: "upper_lower",
    label: "Upper / Lower (Thân trên - Thân dưới)",
  },
  {
    value: "push_pull_legs",
    label: "Push Pull Legs (Đẩy - Kéo - Chân)",
  },
  {
    value: "bro_split",
    label: "Bro Split (Mỗi buổi 1 nhóm cơ)",
  },
  {
    value: "custom",
    label: "AI quyết định",
  },
];
export default function Onboarding() {
  const { user, saveProfile, generatePlan } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    goal: "gain_muscle",
    experience: "intermediate",
    daysPerWeek: "4",
    sessionLength: "60",
    equipment: "full_gym",
    injuries: "",
    preferredSplit: "upper_lower",
  });
  function updateForm(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }
  async function handleQuestion(e: React.SubmitEvent) {
    e.preventDefault();
    const profile: Omit<UserProfile, "userId" | "updatedAt"> = {
      goal: formData.goal as UserProfile["goal"],
      experience: formData.experience as UserProfile["experience"],
      daysPerWeek: parseInt(formData.daysPerWeek),
      sessionLength: parseInt(formData.sessionLength),
      equipment: formData.equipment as UserProfile["equipment"],
      injuries: formData.injuries || undefined,
      preferredSplit: formData.preferredSplit as UserProfile["preferredSplit"],
    };
    try {
      await saveProfile(profile);
      setIsGenerating(true);
      await generatePlan();
      navigate("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }
  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <SignedIn>
      <div className="min-h-screen pt-20 pb-12 px-4 bg-[var(--color-background)]">
        <div className="max-w-2xl mx-auto">
          {!isGenerating ? (
            <Card
              variant="bordered"
              className="shadow-lg border-[var(--color-border)] bg-card p-6 sm:p-8"
            >
              <div className="mb-8 border-b border-[var(--color-border)] pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[var(--color-accent)]/10 rounded-lg">
                    <Dumbbell className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Thiết lập mục tiêu
                  </h1>
                </div>
                <p className="text-[var(--color-muted)] text-sm sm:text-base">
                  Trả lời vài câu hỏi để AI thiết kế lộ trình tập luyện cá nhân
                  hóa dành riêng cho bạn.
                </p>
              </div>

              <form onSubmit={handleQuestion} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Select
                    id="goal"
                    label={
                      <span className="flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Mục tiêu chính
                      </span>
                    }
                    options={goalOptions}
                    value={formData.goal}
                    onChange={(e) => updateForm("goal", e.target.value)}
                  />
                  <Select
                    id="experience"
                    label={
                      <span className="flex items-center gap-2">
                        <History className="w-4 h-4" /> Kinh nghiệm
                      </span>
                    }
                    options={experienceOptions}
                    value={formData.experience}
                    onChange={(e) => updateForm("experience", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 p-4 bg-[var(--color-muted)]/5 rounded-xl border border-[var(--color-border)]/50">
                  <Select
                    id="daysPerWeek"
                    label={
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Số buổi/tuần
                      </span>
                    }
                    options={daysOptions}
                    value={formData.daysPerWeek}
                    onChange={(e) => updateForm("daysPerWeek", e.target.value)}
                  />
                  <Select
                    id="sessionLength"
                    label={
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Thời lượng
                      </span>
                    }
                    options={sessionOptions}
                    value={formData.sessionLength}
                    onChange={(e) =>
                      updateForm("sessionLength", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-6">
                  <Select
                    id="equipment"
                    label="Thiết bị tập luyện có sẵn"
                    options={equipmentOptions}
                    value={formData.equipment}
                    onChange={(e) => updateForm("equipment", e.target.value)}
                  />
                  <Select
                    id="preferredSplit"
                    label="Kiểu chia lịch tập mong muốn"
                    options={splitOptions}
                    value={formData.preferredSplit}
                    onChange={(e) =>
                      updateForm("preferredSplit", e.target.value)
                    }
                  />
                  <Textarea
                    id="injuries"
                    label={
                      <span className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Chấn thương / Hạn
                        chế (nếu có)
                      </span>
                    }
                    placeholder="Ví dụ: Đau lưng dưới, hạn chế xoay khớp vai..."
                    className="resize-none focus:ring-[var(--color-accent)]"
                    rows={3}
                    value={formData.injuries}
                    onChange={(e) => updateForm("injuries", e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-medium gap-2 shadow-md hover:shadow-xl transition-all active:scale-[0.98]"
                  >
                    Tạo lộ trình ngay <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card
              variant="bordered"
              className="text-center py-20 px-8 border-dashed border-2"
            >
              <div className="relative flex justify-center mb-8">
                <div className="absolute inset-0 bg-[var(--color-accent)] blur-2xl opacity-20 animate-pulse rounded-full" />
                <Loader2 className="w-16 h-16 text-[var(--color-accent)] animate-spin relative z-10" />
              </div>
              <h1 className="text-2xl font-bold mb-3">
                Đang phân tích dữ liệu
              </h1>
              <p className="text-[var(--color-muted)] max-w-xs mx-auto">
                AI đang tính toán các bài tập phù hợp nhất với thể trạng và mục
                tiêu của bạn...
              </p>
            </Card>
          )}
        </div>
      </div>
    </SignedIn>
  );
}
