import React, { useState } from "react";
import { Search, Play, CheckCircle2, Star, Sparkles, X, ChevronRight } from "lucide-react";
import { Course } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface CoursesViewProps {
  courses: Course[];
  selectedCourse: Course | null;
  onSelectCourse: (course: Course | null) => void;
  onUpdateCourseProgress: (courseId: string, moduleId: string) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  selectedCourse,
  onSelectCourse,
  onUpdateCourseProgress,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"in-progress" | "completed" | "wishlist" | "all">("in-progress");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const categories = [
    { key: "All", label: t.all },
    { key: "Computer Science", label: t.catComputerScience },
    { key: "Engineering", label: t.catEngineering },
    { key: "Mathematics", label: t.catMathematics },
    { key: "Design", label: t.catDesign },
    { key: "Business", label: t.catBusiness },
  ];

  const tabLabels: Record<string, string> = {
    "in-progress": t.inProgress,
    completed: t.completed,
    wishlist: t.wishlist,
    all: t.all,
  };

  const filteredCourses = courses.filter((course) => {
    const matchesTab =
      activeTab === "all" ? true : course.status === activeTab;
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  return (
    <div id="courses-view-container" className="space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-[#e5e2e1]">
            {t.coursesTitle}
          </h1>
          <p className="text-xs text-[#d0c5af] mt-1">
            {t.coursesSubtitle}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex safari-glass p-1 rounded-xl">
          {(["in-progress", "completed", "wishlist", "all"] as const).map((tab) => (
            <button
              key={tab}
              id={`course-tab-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-[#f2ca50] text-[#3c2f00] shadow-md font-bold"
                  : "text-[#d0c5af] hover:text-[#e5e2e1]"
              }`}
            >
              {tabLabels[tab] || tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between safari-glass p-4 rounded-2xl shadow-lg">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99907c]" />
          <input
            type="text"
            placeholder={t.searchCoursesPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#201c17]/80 border border-[#d4af37]/30 rounded-xl py-2 pl-10 pr-4 text-xs text-[#e5e2e1] placeholder:text-[#99907c] focus:outline-none focus:border-[#f2ca50]"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? "bg-[#d4af37]/30 text-[#f2ca50] border border-[#f2ca50]/50 shadow-sm"
                  : "bg-[#201c17]/60 text-[#d0c5af]/80 border border-[#d4af37]/20 hover:border-[#f2ca50]/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            id={`course-card-${course.id}`}
            className="safari-glass safari-glass-hover rounded-2xl p-5 transition-all flex flex-col justify-between shadow-xl group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#24201a]/90 text-[#f2ca50] text-xs font-semibold px-2.5 py-1 rounded-md border border-[#d4af37]/30">
                  {course.code}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#f2ca50] font-bold">
                  <Star size={12} className="fill-current" />
                  {course.rating}
                </span>
              </div>

              <h3 className="font-serif-title text-lg font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors leading-snug">
                {course.title}
              </h3>
              <p className="text-xs text-[#d0c5af] mt-1">
                {course.institution} &bull; {course.instructor}
              </p>

              <p className="text-xs text-[#99907c] mt-3 line-clamp-2 leading-relaxed font-sans-body">
                {course.description}
              </p>

              {/* Progress info */}
              <div className="mt-5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#99907c]">{course.completedLessons}/{course.totalLessons} {t.lessonsCount}</span>
                  <span className="font-bold text-[#f2ca50]">{course.progress}%</span>
                </div>
                <div className="w-full bg-[#353535]/70 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#d4af37] to-[#f2ca50] h-full rounded-full transition-all duration-300 shadow-[0_0_6px_rgba(242,202,80,0.4)]"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#d4af37]/15 flex items-center justify-between gap-3">
              <button
                onClick={() => onSelectCourse(course)}
                className="flex-1 bg-[#28231c]/90 group-hover:bg-[#f2ca50] text-[#e5e2e1] group-hover:text-[#3c2f00] text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-[#d4af37]/25 group-hover:border-[#f2ca50]"
              >
                <Play size={13} className="fill-current" />
                <span>{course.progress > 0 ? t.resumeLesson : t.startCourse}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail & Interactive Syllabus Player Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div
            id="course-detail-modal"
            className="safari-glass border border-[#d4af37]/40 w-full max-w-4xl rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              onClick={() => onSelectCourse(null)}
              className="absolute top-6 right-6 text-[#99907c] hover:text-[#e5e2e1] p-1.5 rounded-full bg-[#20201f]"
            >
              <X size={20} />
            </button>

            {/* Course Header */}
            <div className="border-b border-[#4d4635]/30 pb-6 mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#f2ca50] mb-2">
                <span className="bg-[#20201f] px-2.5 py-1 rounded border border-[#4d4635]/40">{selectedCourse.code}</span>
                <span>&bull;</span>
                <span>{selectedCourse.category}</span>
                <span>&bull;</span>
                <span>{selectedCourse.institution}</span>
              </div>

              <h2 className="font-serif-title text-2xl md:text-3xl font-bold text-[#e5e2e1]">
                {selectedCourse.title}
              </h2>
              <p className="text-xs text-[#d0c5af] mt-2 max-w-2xl leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>

            {/* Interactive Player Simulation */}
            <div className="bg-[#131313] rounded-2xl border border-[#4d4635]/40 p-6 mb-6 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ca50]/15 text-[#f2ca50] text-xs font-bold">
                    <Sparkles size={14} />
                    <span>{t.tabStemSandbox}</span>
                  </div>
                  <h3 className="font-serif-title text-lg font-bold text-[#e5e2e1]">
                    {selectedCourse.modules[activeLessonIndex]?.title || "Current Lecture"}
                  </h3>
                  <p className="text-xs text-[#99907c]">
                    Duration: {selectedCourse.modules[activeLessonIndex]?.duration || "45m"} &bull; {t.instructorLabel}: {selectedCourse.instructor}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const mod = selectedCourse.modules[activeLessonIndex];
                      if (mod) onUpdateCourseProgress(selectedCourse.id, mod.id);
                    }}
                    className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all"
                  >
                    <CheckCircle2 size={16} />
                    <span>{t.completed}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modules List */}
            <div>
              <h3 className="font-serif-title text-lg font-bold text-[#e5e2e1] mb-4">
                {t.syllabusTitle}
              </h3>
              <div className="space-y-3">
                {selectedCourse.modules.map((mod, index) => (
                  <div
                    key={mod.id}
                    onClick={() => setActiveLessonIndex(index)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      activeLessonIndex === index
                        ? "bg-[#20201f] border-[#f2ca50]"
                        : "bg-[#131313]/60 border-[#4d4635]/25 hover:border-[#4d4635]/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          mod.completed
                            ? "bg-[#d4af37] text-[#131313]"
                            : "bg-[#2a2a2a] text-[#d0c5af]"
                        }`}
                      >
                        {mod.completed ? <CheckCircle2 size={16} /> : index + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#e5e2e1]">{mod.title}</h4>
                        <span className="text-[10px] text-[#99907c]">{t.moduleLabel} {index + 1} &bull; {mod.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#f2ca50] font-semibold">
                      <span>{mod.completed ? t.completed : t.resumeLesson}</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
