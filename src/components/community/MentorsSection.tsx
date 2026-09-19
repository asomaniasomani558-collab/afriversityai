import React, { useState } from "react";
import { MentorProfile } from "../../types/community";
import { initialMentors } from "../../data/communityDemoData";
import {
  Award,
  Star,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Sparkles,
  Briefcase,
  ShieldCheck,
  Send,
  X,
  UserCheck,
} from "lucide-react";

export const MentorsSection: React.FC = () => {
  const [mentors] = useState<MentorProfile[]>(initialMentors);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [sessionGoal, setSessionGoal] = useState("");
  const [selectedDate, setSelectedDate] = useState("2025-06-15");

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionGoal.trim()) return;
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setSelectedMentor(null);
      setSessionGoal("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1b1522] via-[#14120e] to-[#1c150c] border border-[#d4af37]/30 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#d4af37] to-[#9333ea] text-[#0c0a09]">
                <Award size={20} className="text-[#0c0a09]" />
              </div>
              <h3 className="text-xl font-bold font-serif-title text-[#f5f5f4]">
                Verified Pan-African Mentorship Network
              </h3>
            </div>
            <p className="text-xs text-[#d0c5af] mt-1.5 max-w-xl">
              Connect directly with Rhodes Scholars, Google DeepMind researchers, African Olympiad coaches, and top engineering leaders across the continent.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/30 text-xs font-bold text-[#f2ca50]">
            <ShieldCheck size={14} />
            <span>100% Free for African Students</span>
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="group bg-[#14120e] hover:bg-[#1a1612] border border-[#d4af37]/25 hover:border-[#f2ca50]/60 rounded-2xl p-5 shadow-xl transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Mentor Avatar & Ratings */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-[#d4af37] to-[#9333ea] overflow-hidden shadow-lg shrink-0">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#f5f5f4] group-hover:text-[#f2ca50] transition-colors flex items-center gap-1.5">
                      <span>{mentor.name}</span>
                      <span>{mentor.countryFlag}</span>
                    </h4>
                    <div className="text-xs text-[#f59e0b] font-medium">
                      {mentor.role || mentor.title}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#241f19] border border-[#3c3427] text-xs font-bold text-[#f2ca50]">
                  <Star size={12} className="fill-[#f2ca50]" />
                  <span>{mentor.rating}</span>
                </div>
              </div>

              {/* Organization & Location */}
              <div className="text-xs text-[#a8a29e] flex items-center gap-2 mt-1">
                <Briefcase size={13} className="text-[#d4af37]" />
                <span className="text-[#d6d3d1] font-semibold">{mentor.organization}</span>
              </div>

              <p className="text-xs text-[#a8a29e] mt-3 line-clamp-3 leading-relaxed">
                {mentor.bio}
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {mentor.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="px-2 py-0.5 rounded-md bg-[#241f19] border border-[#3c3427] text-[10px] text-[#d6d3d1] font-medium"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            {/* Sessions count and Booking button */}
            <div className="mt-4 pt-3 border-t border-[#262017] flex items-center justify-between">
              <span className="text-[11px] text-[#8c827a]">
                {mentor.sessionsCompleted} sessions guided
              </span>

              <button
                onClick={() => setSelectedMentor(mentor)}
                className="px-3.5 py-1.5 rounded-xl bg-[#f2ca50] hover:bg-[#d97706] text-[#0c0a09] font-bold text-xs flex items-center gap-1.5 shadow transition-transform active:scale-95 cursor-pointer"
              >
                <Calendar size={13} />
                <span>Book 1-on-1</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#14120e] border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#2d271f]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMentor.avatar}
                  alt={selectedMentor.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#d4af37]"
                />
                <div>
                  <h4 className="text-base font-bold text-[#f5f5f4]">
                    Book Session with {selectedMentor.name}
                  </h4>
                  <div className="text-xs text-[#a8a29e]">{selectedMentor.role || selectedMentor.title}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedMentor(null)}
                className="text-[#8c827a] hover:text-[#f5f5f4]"
              >
                <X size={18} />
              </button>
            </div>

            {requestSent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle size={36} className="text-emerald-400 mx-auto" />
                <h5 className="text-base font-bold text-[#f5f5f4]">
                  Mentorship Request Submitted!
                </h5>
                <p className="text-xs text-[#a8a29e]">
                  {selectedMentor.name} will review your request and send calendar coordinates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#a8a29e] font-bold uppercase mb-1">
                    Preferred Session Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-xl p-2.5 focus:border-[#f2ca50] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#a8a29e] font-bold uppercase mb-1">
                    What specific academic goal or paper do you want to discuss?
                  </label>
                  <textarea
                    value={sessionGoal}
                    onChange={(e) => setSessionGoal(e.target.value)}
                    placeholder="E.g. Reviewing my Statement of Purpose for the Mastercard Foundation Scholarship, or discussing our African NLP tokenizer architecture..."
                    rows={4}
                    className="w-full bg-[#1e1a14] border border-[#3c3427] text-[#f5f5f4] rounded-xl p-2.5 focus:border-[#f2ca50] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="px-4 py-2 rounded-xl text-[#a8a29e] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!sessionGoal.trim()}
                    className="px-5 py-2 rounded-xl bg-[#f2ca50] text-[#0c0a09] font-bold hover:bg-[#d97706] disabled:opacity-40"
                  >
                    Send Mentorship Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
