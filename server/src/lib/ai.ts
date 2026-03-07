import OpenAI from "openai";
import dotenv from "dotenv";
import { TrainingPlan, UserProfile } from "../types";
dotenv.config();

export async function generateTrainingPlan(
  profile: UserProfile | Record<string, any>,
): Promise<Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt">> {
  const normalizedProfile: UserProfile = {
    goal: profile.goal || "lose_weight",
    experience: profile.experience || "intermediate",
    days_per_week: profile.days_per_week || 4,
    session_length: profile.session_length || 60,
    equipment: profile.equipment || "full_gym",
    injuries: profile.injuries || null,
    preferred_split: profile.preferred_split || "upper_lower",
  };
  const apiKey = process.env.OPEN_ROUTER_KEY;
  if (!apiKey) {
    throw new Error("API key is not set");
  }
  const openai = new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.BASE_URL || "http://localhost:3001",
      "X-Title": "GymAI Plan Generator",
    },
  });

  // build prompt
  const prompt = buildPrompt(normalizedProfile);
  try {
    const completion = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [
        {
          role: "system",
          content:
            "Bạn là một huấn luyện viên thể hình và chuyên gia thiết kế chương trình tập luyện. Bạn phải chỉ trả về JSON hợp lệ. Không được bao gồm markdown, giải thích, hoặc bất kỳ văn bản bổ sung nào.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });
    const content = completion.choices[0].message.content;

    if (!content) {
      console.error(
        "[AI] No content in response:",
        JSON.stringify(completion, null, 2),
      );
      throw new Error("No content in AI response");
    }

    const planData = JSON.parse(content);

    return formatPlanResponse(planData, normalizedProfile);
  } catch (error) {
    console.error(" AI Error generating training plan", error);
  }
}
function formatPlanResponse(
  aiResponse: any,
  profile: UserProfile,
): Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> {
  const weeklySchedule = Array.isArray(aiResponse?.weeklySchedule)
    ? aiResponse.weeklySchedule
    : [];

  const plan: Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> = {
    overview: {
      goal:
        aiResponse?.overview?.goal ||
        `Chương trình tập luyện cho mục tiêu ${profile.goal}`,

      frequency:
        aiResponse?.overview?.frequency ||
        `${profile.days_per_week} buổi mỗi tuần`,

      split:
        aiResponse?.overview?.split || profile.preferred_split || "Full Body",

      notes:
        aiResponse?.overview?.notes ||
        "Hãy tập luyện đều đặn và đảm bảo kỹ thuật đúng để đạt kết quả tốt nhất.",
    },

    weeklySchedule: weeklySchedule.map((day: any, index: number) => ({
      day: day?.day || `Buổi ${index + 1}`,

      focus: day?.focus || "Tập toàn thân",

      exercises: Array.isArray(day?.exercises)
        ? day.exercises.map((ex: any) => ({
            name: ex?.name || "Bài tập",

            sets: ex?.sets ?? 3,

            reps: ex?.reps || "8-12",

            rest: ex?.rest || "60-90 giây",

            rpe: ex?.rpe ?? 7,

            notes: ex?.notes || undefined,

            alternatives: Array.isArray(ex?.alternatives)
              ? ex.alternatives
              : [],
          }))
        : [],
    })),

    progression:
      aiResponse?.progression ||
      "Tăng mức tạ từ 2-5% khi bạn hoàn thành tất cả các hiệp với kỹ thuật tốt. Theo dõi tiến độ tập luyện mỗi tuần.",
  };

  return plan;
}
function buildPrompt(profile: UserProfile): string {
  const goalMap: Record<string, string> = {
    lose_weight:
      "Giảm cân bằng cách giảm mỡ cơ thể, tăng cường đốt cháy calo thông qua các bài tập cardio và strength training với cường độ phù hợp.",

    gain_muscle:
      "Tăng cơ bằng cách tập trung vào các bài tập hypertrophy, sử dụng tạ và các bài compound để kích thích phát triển khối lượng cơ bắp.",

    maintain_weight:
      "Duy trì cân nặng hiện tại bằng cách kết hợp các bài tập strength training và cardio nhẹ để giữ sức khỏe và thể lực ổn định.",

    improve_endurance:
      "Cải thiện sức bền bằng cách tăng khả năng chịu đựng của cơ thể thông qua các bài tập cardio, circuit training và các bài tập lặp lại nhiều lần.",

    increase_strength:
      "Tăng sức mạnh bằng cách tập trung vào các bài tập compound nặng như squat, deadlift và bench press với số reps thấp và thời gian nghỉ dài hơn.",

    body_recomposition:
      "Giảm mỡ đồng thời tăng cơ bằng cách kết hợp tập tạ để phát triển cơ bắp và các bài cardio để giảm mỡ cơ thể.",
  };
  const experienceMap: Record<string, string> = {
    beginner:
      "Người mới bắt đầu tập luyện, ít hoặc chưa có kinh nghiệm tập gym. Cần tập trung vào việc học kỹ thuật đúng của các bài tập cơ bản, sử dụng mức tạ nhẹ đến trung bình và ưu tiên các bài tập compound đơn giản để xây dựng nền tảng sức mạnh và thể lực.",

    intermediate:
      "Người có kinh nghiệm tập luyện ở mức trung cấp, đã quen với các bài tập cơ bản và có thể tập với cường độ cao hơn. Chương trình nên bao gồm nhiều bài tập đa dạng hơn, kết hợp compound và isolation exercises để tiếp tục phát triển sức mạnh và cơ bắp.",

    advanced:
      "Người tập luyện ở mức nâng cao, có nhiều kinh nghiệm trong gym và đã thành thạo kỹ thuật của hầu hết các bài tập. Chương trình tập luyện có thể bao gồm các bài tập phức tạp, khối lượng tập lớn hơn, cường độ cao và các phương pháp nâng cao như progressive overload hoặc periodization.",
  };
  const equipmentMap: Record<string, string> = {
    bodyweight:
      "Chỉ sử dụng trọng lượng cơ thể, không có thiết bị hỗ trợ. Các bài tập nên tập trung vào bodyweight exercises như push-up, squat, lunge, plank, burpee, pull-up nếu có xà. Chương trình nên thiết kế để tận dụng tối đa trọng lượng cơ thể nhằm phát triển sức mạnh, sức bền và khả năng kiểm soát cơ thể.",

    dumbbell:
      "Có tạ đơn (dumbbell). Người tập có thể thực hiện nhiều bài tập đa dạng cho toàn bộ cơ thể như dumbbell press, dumbbell row, goblet squat, shoulder press, bicep curl, tricep extension. Chương trình nên kết hợp các bài compound và isolation để phát triển cơ bắp hiệu quả.",

    barbell:
      "Có tạ đòn (barbell). Người tập có thể thực hiện các bài compound chính như barbell squat, deadlift, bench press, overhead press và barbell row. Chương trình nên tập trung vào các bài compound để phát triển sức mạnh và khối lượng cơ bắp.",

    machine:
      "Có máy tập tại phòng gym. Người tập có thể sử dụng các máy hỗ trợ như chest press machine, leg press, lat pulldown, cable machine và nhiều loại máy khác để tập từng nhóm cơ cụ thể. Phù hợp cho việc kiểm soát kỹ thuật và giảm nguy cơ chấn thương.",

    full_gym:
      "Có đầy đủ thiết bị phòng gym bao gồm tạ đơn, tạ đòn, máy tập và các thiết bị hỗ trợ khác. Người tập có thể thực hiện đầy đủ các bài tập compound và isolation để tối ưu hóa việc phát triển sức mạnh, cơ bắp và thể lực.",
  };
  const splitMap: Record<string, string> = {
    full_body:
      "Full Body (Toàn thân): Mỗi buổi tập sẽ tập toàn bộ các nhóm cơ chính như ngực, lưng, vai, tay và chân trong cùng một buổi. Phù hợp cho người mới bắt đầu hoặc người có ít ngày tập trong tuần. Mục tiêu là kích thích toàn bộ cơ thể thường xuyên để cải thiện sức mạnh và thể lực tổng thể.",

    upper_lower:
      "Upper / Lower (Thân trên - Thân dưới): Lịch tập được chia thành hai loại buổi tập chính. Một buổi tập trung vào các nhóm cơ thân trên như ngực, lưng, vai, tay. Buổi còn lại tập trung vào thân dưới như đùi, mông và bắp chân. Kiểu split này giúp tăng khối lượng tập cho từng nhóm cơ và có thời gian phục hồi hợp lý.",

    push_pull_legs:
      "Push Pull Legs (Đẩy - Kéo - Chân): Chia buổi tập theo nhóm chuyển động. Ngày Push tập các cơ dùng động tác đẩy như ngực, vai trước và tay sau. Ngày Pull tập các cơ dùng động tác kéo như lưng và tay trước. Ngày Legs tập toàn bộ nhóm cơ chân và mông. Đây là kiểu split phổ biến giúp phát triển cơ bắp và sức mạnh hiệu quả.",

    bro_split:
      "Bro Split (Mỗi buổi 1 nhóm cơ): Mỗi buổi tập sẽ tập trung vào một nhóm cơ cụ thể như ngực, lưng, vai, tay hoặc chân. Kiểu này thường được người tập gym lâu năm sử dụng để tập với khối lượng lớn cho từng nhóm cơ và tối đa hóa sự phát triển cơ bắp.",

    custom:
      "AI tự quyết định kiểu split phù hợp nhất dựa trên số ngày tập mỗi tuần, mục tiêu tập luyện, kinh nghiệm và thiết bị có sẵn của người dùng.",
  };
  return `Hãy tạo một kế hoạch tập luyện cá nhân hóa ${profile.days_per_week} buổi mỗi tuần cho người dùng có hồ sơ sau:

Mục tiêu: ${goalMap[profile.goal] || profile.goal}
Trình độ tập luyện: ${experienceMap[profile.experience] || profile.experience}
Thời lượng mỗi buổi: ${profile.session_length} phút
Thiết bị tập luyện: ${equipmentMap[profile.equipment] || profile.equipment}
Kiểu chia lịch tập mong muốn: ${splitMap[profile.preferred_split] || profile.preferred_split}
${profile.injuries ? `Chấn thương/Hạn chế: ${profile.injuries}` : ""}

Hãy tạo một kế hoạch tập luyện hoàn chỉnh dưới dạng JSON với cấu trúc CHÍNH XÁC như sau:

{
  "overview": {
    "goal": "mô tả ngắn gọn mục tiêu tập luyện",
    "frequency": "X buổi mỗi tuần",
    "split": "tên kiểu chia lịch tập",
    "notes": "những ghi chú quan trọng về chương trình tập (2-3 câu)"
  },
  "weeklySchedule": [
    {
      "day": "Thứ hai",
      "focus": "nhóm cơ hoặc mục tiêu buổi tập",
      "exercises": [
        {
          "name": "Tên bài tập",
          "sets": 4,
          "reps": "6-8",
          "rest": "2-3 phút",
          "rpe": 8,
          "notes": "gợi ý kỹ thuật hoặc lưu ý khi tập (không bắt buộc)",
          "alternatives": ["Bài thay thế 1", "Bài thay thế 2"]
        }
      ]
    }
  ],
  "progression": "chiến lược tăng tiến chi tiết (2-3 câu giải thích cách tăng độ khó theo thời gian)"
}

Yêu cầu:
- Tạo chính xác ${profile.days_per_week} buổi tập
- Mỗi buổi tập phải phù hợp với thời lượng ${profile.session_length} phút
- Mỗi buổi bao gồm 4-6 bài tập
- RPE (mức độ gắng sức cảm nhận) nên nằm trong khoảng 6-9
- Người mới và trung cấp nên ưu tiên các bài compound, người nâng cao có thể có nhiều bài isolation hơn
- Phải phù hợp với kiểu split đã chọn: ${profile.preferred_split}
- ${profile.injuries ? `Tránh các bài tập có thể làm trầm trọng thêm chấn thương: ${profile.injuries}` : ""}
- Cung cấp các bài tập thay thế khi phù hợp
- Chương trình phải có tính tăng tiến và phù hợp với trình độ ${experienceMap[profile.experience] || profile.experience}

Chỉ trả về object JSON (không markdown, không thêm bất kỳ văn bản nào khác).
`;
}
