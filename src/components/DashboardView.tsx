import React from "react";
import { ArrowRight, Play, Users, FileText, Calendar, Clock, Award, Sparkles, CheckCircle2, Cpu, Globe2 } from "lucide-react";
import { Course, NavigationTab, UserProfile } from "../types";
import { AfriEmblem } from "./AfriEmblem";
import { useLanguage } from "../context/LanguageContext";
import { MyFilesSection } from "./vault/MyFilesSection";
import { MyNotesSection } from "./vault/MyNotesSection";
import { TeamMembersSection } from "./vault/TeamMembersSection";

interface DashboardViewProps {
  user: UserProfile;
  courses: Course[];
  setActiveTab: (tab: NavigationTab) => void;
  onSelectCourse: (course: Course) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  courses,
  setActiveTab,
  onSelectCourse,
}) => {
  const { t } = useLanguage();
  const inProgressCourses = courses.filter((c) => c.status === "in-progress").slice(0, 3);

  return (
    <div id="dashboard-view-container" className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-[#e5e2e1] flex items-center gap-2">
            <span>{t.welcomeBack}, {user.name.split(" ")[1] || "Kofi"}</span>
            <AfriEmblem size="sm" />
          </h1>
          <p className="text-sm text-[#d0c5af] mt-1 font-sans-body">
            {t.enrolledAt} <span className="text-[#f2ca50] font-medium">{user.university}</span>. {t.keepUpMomentum}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dashboard-browse-courses-btn"
            onClick={() => setActiveTab("my-courses")}
            className="bg-[#20201f] hover:bg-[#2a2a2a] text-[#f2ca50] border border-[#d4af37]/30 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>{t.allCoursesBtn}</span>
            <ArrowRight size={14} />
          </button>
          <button
            id="dashboard-open-ai-mentor-btn"
            onClick={() => setActiveTab("ai-assistant")}
            className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>{t.aiMentorBtn}</span>
          </button>
        </div>
      </div>

      {/* Quote of the Day Banner with African Kente Styling */}
      <div className="relative overflow-hidden rounded-2xl safari-glass border border-[#d4af37]/35 p-6 md:p-8 shadow-xl african-kente-pattern">
        <div className="flex items-start gap-4 max-w-4xl relative z-10">
          <div className="w-10 h-10 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/40 flex items-center justify-center text-[#f2ca50] shrink-0 mt-1 backdrop-blur-md">
            <span className="material-symbols-outlined text-[20px]">format_quote</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#f2ca50] uppercase tracking-widest font-sans-body">
              {t.quoteOfTheDay}
            </span>
            <blockquote className="font-serif-title italic text-lg sm:text-xl text-[#e5e2e1] mt-1 leading-relaxed">
              "{t.quoteText}"
            </blockquote>
            <p className="text-xs text-[#d0c5af] font-semibold mt-2 tracking-wider">
              — {t.quoteAuthor}
            </p>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50]">play_circle</span>
            <h2 className="font-serif-title text-xl font-bold text-[#e5e2e1]">
              {t.continueLearning}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab("my-courses")}
            className="text-xs font-bold text-[#f2ca50] hover:underline flex items-center gap-1"
          >
            <span>{t.viewAll} ({courses.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {inProgressCourses.map((course) => (
            <div
              key={course.id}
              id={`continue-course-card-${course.id}`}
              className="safari-glass safari-glass-hover rounded-2xl p-5 transition-all flex flex-col justify-between shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#d0c5af] mb-3">
                  <span className="bg-[#24201a]/90 text-[#f2ca50] font-semibold px-2.5 py-1 rounded-lg border border-[#d4af37]/30">
                    {course.code}
                  </span>
                  <span className="text-[11px] text-[#99907c] flex items-center gap-1">
                    <Clock size={12} /> {course.timeLeft}
                  </span>
                </div>

                <h3 className="font-serif-title text-base font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors leading-snug line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-[11px] text-[#d0c5af]/80 mt-1">
                  {course.institution} &bull; {course.instructor}
                </p>

                {/* Progress bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#99907c]">{t.inProgress}</span>
                    <span className="font-bold text-[#f2ca50]">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-[#353535]/70 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#d4af37] to-[#f2ca50] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(242,202,80,0.5)]"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#99907c] text-right">
                    {course.completedLessons} / {course.totalLessons} {t.lessonsCount}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#d4af37]/15 flex items-center justify-between">
                <button
                  onClick={() => onSelectCourse(course)}
                  className="w-full bg-[#28231c]/90 group-hover:bg-[#f2ca50] text-[#e5e2e1] group-hover:text-[#3c2f00] text-xs font-bold py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm border border-[#d4af37]/25 group-hover:border-[#f2ca50]"
                >
                  <Play size={14} className="fill-current" />
                  <span>{t.resumeLesson}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access Grid & Academic Highlights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Access Tools */}
        <div className="lg:col-span-2 safari-glass rounded-2xl p-6 shadow-xl">
          <h3 className="font-serif-title text-lg font-bold text-[#e5e2e1] mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#f2ca50]">grid_view</span>
            {t.stemLabsQuickLaunch}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* STEM Sandboxes */}
            <div
              onClick={() => setActiveTab("stem-sandbox")}
              className="bg-[#1e1b16]/80 hover:bg-[#2e261a] p-3.5 rounded-xl border border-[#d4af37]/30 cursor-pointer transition-all hover:border-[#f2ca50] group backdrop-blur-sm shadow-md"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2e2920] flex items-center justify-center text-[#f2ca50] mb-2.5 group-hover:scale-105 transition-transform border border-[#d4af37]/25">
                <Cpu size={18} />
              </div>
              <h4 className="text-xs font-bold text-[#e5e2e1]">{t.tabStemSandbox.split(" ")[0]}</h4>
              <p className="text-[10px] text-[#f2ca50] mt-0.5">RLC & ODE</p>
            </div>

            {/* Research Radar */}
            <div
              onClick={() => setActiveTab("research-radar")}
              className="bg-[#1e1b16]/80 hover:bg-[#2e261a] p-3.5 rounded-xl border border-[#d4af37]/30 cursor-pointer transition-all hover:border-[#f2ca50] group backdrop-blur-sm shadow-md"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2e2920] flex items-center justify-center text-[#f2ca50] mb-2.5 group-hover:scale-105 transition-transform border border-[#d4af37]/25">
                <Globe2 size={18} />
              </div>
              <h4 className="text-xs font-bold text-[#e5e2e1]">{t.tabResearchRadar.split(" ")[0]}</h4>
              <p className="text-[10px] text-[#f2ca50] mt-0.5">$38M Grants</p>
            </div>

            {/* 1: Study Groups */}
            <div
              onClick={() => setActiveTab("study-groups")}
              className="bg-[#1e1b16]/70 hover:bg-[#28231c] p-3.5 rounded-xl border border-[#d4af37]/20 cursor-pointer transition-all hover:border-[#f2ca50]/50 group backdrop-blur-sm shadow-md"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2e2920] flex items-center justify-center text-[#f2ca50] mb-2.5 group-hover:scale-105 transition-transform border border-[#d4af37]/20">
                <Users size={18} />
              </div>
              <h4 className="text-xs font-bold text-[#e5e2e1]">{t.tabStudyGroups.split(" ")[0]}</h4>
              <p className="text-[10px] text-[#99907c] mt-0.5">7 {t.active}</p>
            </div>

            {/* 2: Assignments */}
            <div
              onClick={() => setActiveTab("my-courses")}
              className="bg-[#1e1b16]/70 hover:bg-[#28231c] p-3.5 rounded-xl border border-[#d4af37]/20 cursor-pointer transition-all hover:border-[#f2ca50]/50 group backdrop-blur-sm shadow-md"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2e2920] flex items-center justify-center text-[#f2ca50] mb-2.5 group-hover:scale-105 transition-transform border border-[#d4af37]/20">
                <FileText size={18} />
              </div>
              <h4 className="text-xs font-bold text-[#e5e2e1]">{t.tabCourses.split(" ")[0]}</h4>
              <p className="text-[10px] text-[#99907c] mt-0.5">3 {t.inProgress}</p>
            </div>

            {/* 3: Upcoming Events */}
            <div
              onClick={() => setActiveTab("calendar")}
              className="bg-[#1e1b16]/70 hover:bg-[#28231c] p-3.5 rounded-xl border border-[#d4af37]/20 cursor-pointer transition-all hover:border-[#f2ca50]/50 group backdrop-blur-sm shadow-md"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2e2920] flex items-center justify-center text-[#f2ca50] mb-2.5 group-hover:scale-105 transition-transform border border-[#d4af37]/20">
                <Calendar size={18} />
              </div>
              <h4 className="text-xs font-bold text-[#e5e2e1]">{t.tabCalendar.split(" ")[0]}</h4>
              <p className="text-[10px] text-[#99907c] mt-0.5">2 {t.upcomingEvents.split(" ")[0]}</p>
            </div>

            {/* 4: Scholarships */}
            <div
              onClick={() => setActiveTab("scholarships")}
              className="bg-[#1e1b16]/70 hover:bg-[#28231c] p-3.5 rounded-xl border border-[#d4af37]/20 cursor-pointer transition-all hover:border-[#f2ca50]/50 group backdrop-blur-sm shadow-md"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2e2920] flex items-center justify-center text-[#f2ca50] mb-2.5 group-hover:scale-105 transition-transform border border-[#d4af37]/20">
                <Award size={18} />
              </div>
              <h4 className="text-xs font-bold text-[#e5e2e1]">{t.tabScholarships.split(" ")[0]}</h4>
              <p className="text-[10px] text-[#99907c] mt-0.5">$12M {t.applyNow}</p>
            </div>
          </div>
        </div>

        {/* Heritage Status & Academic Rank */}
        <div className="safari-glass rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold text-[#f2ca50] uppercase tracking-wider">
                {t.lobbyBadge}
              </span>
              <span className="bg-[#d4af37]/20 text-[#f2ca50] text-[10px] font-bold px-2 py-0.5 rounded">
                Top 5%
              </span>
            </div>

            <h4 className="font-serif-title text-lg font-bold text-[#e5e2e1]">
              Level 4: {t.heritageTier}
            </h4>
            <p className="text-xs text-[#d0c5af] mt-1 leading-relaxed">
              {t.academicTelemetry} &bull; {user.role}
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#d0c5af]">
                <CheckCircle2 size={14} className="text-[#f2ca50]" />
                <span>12 {t.enrolledCoursesMetric}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#d0c5af]">
                <CheckCircle2 size={14} className="text-[#f2ca50]" />
                <span>7 {t.studyGroupsTitle}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#d0c5af]">
                <CheckCircle2 size={14} className="text-[#f2ca50]" />
                <span>16 {t.badgeVaultTitle}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("profile")}
            className="w-full mt-6 bg-[#24201a]/90 hover:bg-[#322c24] text-[#f2ca50] border border-[#d4af37]/30 text-xs font-semibold py-2.5 rounded-xl transition-colors backdrop-blur-md"
          >
            {t.tabProfile}
          </button>
        </div>
      </section>

      {/* Enhanced Vault Workspace Sections */}
      <div className="space-y-8 pt-4 border-t border-[#d4af37]/20">
        <MyFilesSection />
        <MyNotesSection />
        <TeamMembersSection />
      </div>
    </div>
  );
};
