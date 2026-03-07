import { Link, Navigate } from "react-router-dom";
import {
  Zap,
  Target,
  Calendar,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: Sparkles,
    title: "Lộ trình AI thông minh",
    description:
      "Nhận chương trình tập luyện được thiết kế riêng dựa trên mục tiêu, kinh nghiệm và thời gian biểu của bạn.",
  },
  {
    icon: Target,
    title: "Tối ưu mục tiêu",
    description:
      "Dù bạn muốn tăng cơ, giảm mỡ hay cải thiện sức bền — AI của chúng tôi sẽ tối ưu hóa cho mục đích đó.",
  },
  {
    icon: Calendar,
    title: "Lịch trình linh hoạt",
    description:
      "Kế hoạch phù hợp với lối sống của bạn. Tập 2 ngày hay 6 ngày — chúng tôi đều đáp ứng được.",
  },
  {
    icon: Clock,
    title: "Tiết kiệm thời gian",
    description:
      "Mỗi buổi tập được thiết kế để mang lại kết quả tối đa trong khoảng thời gian bạn có.",
  },
];

export default function Home() {
  const { user, isLoading } = useAuth();

  if (!isLoading && user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-accent)/0.1,transparent_50%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-accent)]/10 rounded-full blur-[120px] -z-10" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] mb-8 animate-fade-in shadow-sm">
            <Zap className="w-4 h-4 text-[var(--color-accent)] fill-[var(--color-accent)]" />
            <span className="text-sm font-medium text-[var(--color-foreground)]">
              Giải pháp tập luyện bằng Trí tuệ nhân tạo
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Xây dựng <br />
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[#4ade80] bg-clip-text text-transparent">
              Lịch tập Gym
            </span>{" "}
            trong tích tắc
          </h1>

          <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto mb-12 leading-relaxed">
            Ngừng việc tập luyện cảm tính. Nhận ngay chương trình tập luyện cá
            nhân hóa được xây dựng bởi AI, tối ưu riêng cho thể trạng và mục
            tiêu của bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg gap-2 shadow-lg shadow-[var(--color-accent)]/20 hover:scale-105 transition-transform"
              >
                Bắt đầu miễn phí
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-lg border-[var(--color-border)] hover:bg-[var(--color-border)]/50"
              >
                Đăng nhập
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-[var(--color-muted)]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)]" />
              <span>Không cần thẻ tín dụng</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)]" />
              <span>Phân tích AI chuyên sâu</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[var(--color-card)]/30 border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Tại sao chọn GymAI?
            </h2>
            <div className="w-20 h-1.5 bg-[var(--color-accent)] mx-auto rounded-full mb-6" />
            <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto">
              Chúng tôi kết hợp kiến thức thể hình chuyên sâu với công nghệ AI
              để tạo ra những chương trình thực sự mang lại kết quả cho riêng
              bạn.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                variant="bordered"
                className="group relative p-8 hover:border-[var(--color-accent)]/50 transition-all duration-300 bg-[var(--color-card)] hover:-translate-y-2 shadow-sm hover:shadow-xl hover:shadow-[var(--color-accent)]/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent)] group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-[var(--color-accent)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Sẵn sàng để thay đổi vóc dáng?
          </h2>
          <Link to="/onboarding">
            <Button
              size="lg"
              variant="ghost"
              className="text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 text-xl font-semibold"
            >
              Tạo lộ trình của bạn ngay hôm nay →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
