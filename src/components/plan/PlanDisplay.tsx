import {  Info, Timer, Zap,  } from "lucide-react";
import type { DaySchedule, Exercise } from "../../types";
import { Card } from "../ui/Card";


function ExerciseTableRow({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <tr className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/5 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-start gap-3">
          <span className="text-xs font-mono text-[var(--color-muted)] mt-1">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <p className="font-semibold text-[var(--color-foreground)]">{exercise.name}</p>
            {exercise.notes && (
              <p className="text-xs text-[var(--color-muted)] mt-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                {exercise.notes}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-center">
        <div className="inline-flex items-center gap-1 bg-[var(--color-muted)]/10 px-3 py-1 rounded-full text-sm">
          <span className="text-[var(--color-accent)] font-bold">{exercise.sets}</span>
          <span className="text-[var(--color-muted)] text-xs">x</span>
          <span className="font-medium">{exercise.reps}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-center font-medium text-[var(--color-muted)]">
        {exercise.rest}
      </td>
      <td className="py-4 px-6 text-center">
        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold
          ${exercise.rpe >= 8 ? "bg-red-500/10 text-red-500" : 
            exercise.rpe >= 7 ? "bg-orange-500/10 text-orange-500" : 
            "bg-emerald-500/10 text-emerald-500"}`}
        >
          RPE {exercise.rpe}
        </span>
      </td>
    </tr>
  );
}


function ExerciseCardMobile({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <div className="p-4 border-b border-[var(--color-border)] last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
           <span className="text-xs font-bold text-[var(--color-accent)] mt-1">{index + 1}</span>
           <p className="font-bold text-[var(--color-foreground)]">{exercise.name}</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-md font-black text-white
          ${exercise.rpe >= 8 ? "bg-red-500" : exercise.rpe >= 7 ? "bg-orange-500" : "bg-emerald-500"}`}
        >
          RPE {exercise.rpe}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 ml-6">
        <div className="flex items-center gap-2 text-sm bg-[var(--color-muted)]/5 p-2 rounded-lg justify-center">
          <Zap className="w-3.5 h-3.5 text-yellow-500" />
          <span><b>{exercise.sets}</b> x {exercise.reps}</span>
        </div>
        <div className="flex items-center gap-2 text-sm bg-[var(--color-muted)]/5 p-2 rounded-lg justify-center text-[var(--color-muted)]">
          <Timer className="w-3.5 h-3.5" />
          <span>{exercise.rest}</span>
        </div>
      </div>

      {exercise.notes && (
        <p className="mt-2 ml-6 text-[11px] text-[var(--color-muted)] italic flex gap-1">
          <Info className="w-3 h-3 shrink-0 mt-0.5 text-[var(--color-accent)]" /> {exercise.notes}
        </p>
      )}
    </div>
  );
}

function DayCard({ schedule }: { schedule: DaySchedule }) {
  return (
    <Card variant="bordered" className="overflow-hidden mb-8 shadow-sm">
      <div className="p-4 sm:p-6 bg-[var(--color-muted)]/5 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-xl uppercase italic tracking-tight">{schedule.day}</h3>
            <p className="text-sm font-bold text-[var(--color-accent)] uppercase tracking-widest">{schedule.focus}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[var(--color-muted)] uppercase font-bold block">Volume</span>
            <span className="text-sm font-medium">{schedule.exercises.length} Bài tập</span>
          </div>
        </div>
      </div>

      
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[var(--color-muted)]/5 text-[var(--color-muted)] text-[10px] uppercase font-black">
              <th className="text-left py-3 px-6">Bài tập</th>
              <th className="py-3 px-4 text-center">Hiệp x Lần</th>
              <th className="py-3 px-4 text-center">Nghỉ</th>
              <th className="py-3 px-6 text-center">Cường độ</th>
            </tr>
          </thead>
          <tbody>
            {schedule.exercises.map((ex, i) => (
              <ExerciseTableRow key={i} exercise={ex} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="md:hidden divide-y divide-[var(--color-border)]">
        {schedule.exercises.map((ex, i) => (
          <ExerciseCardMobile key={i} exercise={ex} index={i} />
        ))}
      </div>
    </Card>
  );
}

export function PlanDisplay({ weeklySchedule }: { weeklySchedule: DaySchedule[] }) {
  return (
    <div className="max-w-4xl mx-auto py-4">
      {weeklySchedule.map((schedule, key) => (
        <DayCard key={key} schedule={schedule} />
      ))}
    </div>
  );
}