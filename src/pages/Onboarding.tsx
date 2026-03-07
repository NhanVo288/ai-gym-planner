import { RedirectToSignIn, SignedIn } from "@neondatabase/neon-js/auth/react";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Select } from "../components/ui/Select";
import { useState } from "react";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { ArrowRight, Loader2 } from "lucide-react";
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
  const [error, setError] = useState("");
  const navigate = useNavigate()
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
      await generatePlan()
      navigate("/profile")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save profile",
      );
    } finally {
      setIsGenerating(false);
    }
  }
  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <SignedIn>
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-xl mx-auto">
          {!isGenerating ? (
            <Card variant="bordered">
              <h1 className="text-2xl font-bold mb-2">
                Hãy cho chúng tôi biết về bạn
              </h1>
              <p className="text-[var(--color-muted)] mb-6">
                Giúp chúng tôi tạo ra giáo án tập luyện phù hợp nhất cho bạn
              </p>
              <form onSubmit={handleQuestion} className="space-y-5">
                <Select
                  id="goal"
                  label="Mục tiêu chính của bạn là gì?"
                  options={goalOptions}
                  value={formData.goal}
                  onChange={(e) => updateForm("goal", e.target.value)}
                />
                <Select
                  id="experience"
                  label="Kinh nghiệm luyện tập"
                  options={experienceOptions}
                  value={formData.experience}
                  onChange={(e) => updateForm("experience", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    id="daysPerWeek"
                    label="Số ngày tập mỗi tuần"
                    options={daysOptions}
                    value={formData.daysPerWeek}
                    onChange={(e) => updateForm("daysPerWeek", e.target.value)}
                  />
                  <Select
                    id="sessionLength"
                    label="Thời lượng buổi tập"
                    options={sessionOptions}
                    value={formData.sessionLength}
                    onChange={(e) =>
                      updateForm("sessionLength", e.target.value)
                    }
                  />
                </div>
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
                  onChange={(e) => updateForm("preferredSplit", e.target.value)}
                />

                <Textarea
                  id="injuries"
                  label="Bạn có chấn thương hoặc hạn chế vận động nào không? (không bắt buộc)"
                  placeholder="Ví dụ: đau lưng dưới, chấn thương vai..."
                  rows={3}
                  value={formData.injuries}
                  onChange={(e) => updateForm("injuries", e.target.value)}
                />
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1 gap-2">
                    Tạo lịch tập <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card variant="bordered" className="text-center py-16">
              <Loader2 className="w-12 h-12 text-[var(--color-accent)] mx-auto mb-6 animate-spin"/>
              <h1>Đang tạo lịch tập</h1>
              <p>AI đang xây dựng lịch tập...</p>
            </Card>
          )}
        </div>
      </div>
    </SignedIn>
  );
}
