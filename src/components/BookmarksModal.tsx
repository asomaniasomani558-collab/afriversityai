import React from "react";
import { Bookmark, Award, BookOpen, ExternalLink, ArrowRight, Trash2 } from "lucide-react";
import { Scholarship, Course, NavigationTab } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface BookmarksModalProps {
  scholarships: Scholarship[];
  courses: Course[];
  setActiveTab: (tab: NavigationTab) => void;
  onSelectCourse: (course: Course) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  scholarships,
  courses,
  setActiveTab,
  onSelectCourse,
}) => {
  const { t } = useLanguage();
  const savedScholarships = scholarships.slice(0, 2);
  const savedCourses = courses.slice(0, 2);

  return (
    <div id="bookmarks-view" className="space-y-8">
      <div>
        <h1 className="font-serif-title text-3xl font-bold text-[#e5e2e1]">
          {t.savedBookmarks}
        </h1>
        <p className="text-xs text-[#d0c5af] mt-1">
          Quickly access your pinned scholarships, syllabus modules, and academic research papers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pinned Scholarships */}
        <div className="bg-[#1b1b1b] rounded-3xl border border-[#4d4635]/30 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#4d4635]/25 pb-3">
            <Award size={18} className="text-[#f2ca50]" />
            <h2 className="font-serif-title text-lg font-bold text-[#e5e2e1]">
              {t.savedScholarships}
            </h2>
          </div>

          <div className="space-y-3">
            {savedScholarships.map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveTab("scholarships")}
                className="p-4 rounded-2xl bg-[#20201f] border border-[#4d4635]/20 hover:border-[#f2ca50]/50 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-[#e5e2e1] group-hover:text-[#f2ca50]">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-[#f2ca50] mt-0.5">{s.amount}</p>
                </div>
                <ArrowRight size={14} className="text-[#99907c] group-hover:text-[#f2ca50]" />
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Courses */}
        <div className="bg-[#1b1b1b] rounded-3xl border border-[#4d4635]/30 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#4d4635]/25 pb-3">
            <BookOpen size={18} className="text-[#f2ca50]" />
            <h2 className="font-serif-title text-lg font-bold text-[#e5e2e1]">
              {t.curriculumBookmarks}
            </h2>
          </div>

          <div className="space-y-3">
            {savedCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCourse(c)}
                className="p-4 rounded-2xl bg-[#20201f] border border-[#4d4635]/20 hover:border-[#f2ca50]/50 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] text-[#f2ca50] font-semibold">{c.code}</span>
                  <h4 className="text-xs font-bold text-[#e5e2e1] group-hover:text-[#f2ca50]">
                    {c.title}
                  </h4>
                  <p className="text-[10px] text-[#99907c]">{c.progress}% completed</p>
                </div>
                <ArrowRight size={14} className="text-[#99907c] group-hover:text-[#f2ca50]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
