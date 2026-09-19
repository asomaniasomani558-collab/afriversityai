import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Check,
  Plus,
  Sparkles,
  Video,
  Share2,
  ExternalLink,
  Trophy,
  Award,
  BookOpen,
  CalendarCheck2,
  AlertCircle,
} from "lucide-react";
import { EventItem } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface EventsViewProps {
  events: EventItem[];
  onToggleRegister: (eventId: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ events, onToggleRegister }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = [
    { id: "All", label: "All Competitions & Calendar" },
    { id: "Hackathon", label: "Continental Hackathons", icon: Trophy },
    { id: "Symposium", label: "Research Symposiums", icon: Award },
    { id: "Milestone", label: "Semester Milestones", icon: CalendarCheck2 },
    { id: "Deadline", label: "Assignment Deadlines", icon: AlertCircle },
  ];

  const filteredEvents = events.filter((e) => {
    if (filterCategory !== "All" && e.category !== filterCategory) return false;
    return true;
  });

  return (
    <div id="events-view-container" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ca50]/15 border border-[#f2ca50]/30 text-[#f2ca50] text-[11px] font-bold mb-2">
            <Trophy size={13} />
            <span>Continental Innovation & Milestones</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#e5e2e1]">
            Competition: Occasions & Master Academic Calendar
          </h1>
          <p className="text-xs text-[#d0c5af] mt-1.5 max-w-2xl leading-relaxed">
            Track semester milestones, assignment deadlines, continental hackathons, and research symposiums across Africa's top academic institutions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex bg-[#1b1b1b] p-1 rounded-xl border border-[#4d4635]/30 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "upcoming"
                ? "bg-[#f2ca50] text-[#3c2f00] shadow-sm"
                : "text-[#d0c5af] hover:text-[#e5e2e1]"
            }`}
          >
            {t.upcomingEvents} ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "past"
                ? "bg-[#f2ca50] text-[#3c2f00] shadow-sm"
                : "text-[#d0c5af] hover:text-[#e5e2e1]"
            }`}
          >
            {t.pastEvents}
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = filterCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? "bg-[#f2ca50] text-[#0c0a09] shadow-md font-bold"
                  : "bg-[#181613] hover:bg-[#231f19] text-[#c5bcab] border border-[#332c22]"
              }`}
            >
              {Icon && <Icon size={14} />}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hero Occasion Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#2a2010] via-[#1b1b1b] to-[#20201f] border border-[#d4af37]/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 african-kente-pattern">
        <div className="space-y-3 max-w-xl relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#f2ca50] bg-[#f2ca50]/15 px-3 py-1 rounded-full border border-[#f2ca50]/30">
              Continental Flagship Hackathon 2026
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800/40">
              $50,000 Seed Pool
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#e5e2e1] leading-tight">
            Be part of a generation that builds Africa.
          </h2>
          <p className="text-xs text-[#d0c5af] leading-relaxed">
            Join 1,000+ student engineers across 30 nations for a 48-hour sprint solving food security, payment mesh networks, and renewable microgrids.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 shrink-0">
          {/* External Google Registration Link */}
          <a
            href="https://www.google.com/search?q=pan-african+student+hackathon+2026+registration"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Register on Google / Devpost</span>
            <ExternalLink size={15} />
          </a>

          <button
            onClick={() => onToggleRegister("e2")}
            className="bg-[#241f19] hover:bg-[#2f271c] border border-[#4d4635]/40 text-[#f2ca50] font-bold text-xs px-5 py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={15} />
            <span>Add to Calendar</span>
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => {
          const registrationLink =
            event.registrationUrl ||
            `https://www.google.com/search?q=${encodeURIComponent(
              event.title + " registration website on google"
            )}`;

          const getCategoryBadgeClass = (category: string) => {
            switch (category) {
              case "Hackathon":
                return "text-[#f2ca50] bg-[#2a2213] border-[#d4af37]/40";
              case "Symposium":
                return "text-[#c084fc] bg-[#261536] border-[#a855f7]/40";
              case "Milestone":
                return "text-[#34d399] bg-[#102a20] border-[#10b981]/40";
              case "Deadline":
                return "text-[#f87171] bg-[#2d1417] border-[#ef4444]/40";
              default:
                return "text-[#d0c5af] bg-[#20201f] border-[#4d4635]/30";
            }
          };

          return (
            <div
              key={event.id}
              id={`event-item-${event.id}`}
              className="bg-[#181613] rounded-2xl border border-[#332c22] p-5 md:p-6 hover:border-[#f2ca50]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl group hover:shadow-[#f2ca50]/5"
            >
              {/* Left: Date Badge + Details */}
              <div className="flex items-start gap-4 flex-1">
                {/* Date Box */}
                <div className="w-16 h-16 rounded-2xl bg-[#201d18] border border-[#4d4635]/40 flex flex-col items-center justify-center shrink-0 shadow-md group-hover:border-[#f2ca50] transition-colors">
                  <span className="font-serif-title text-2xl font-bold text-[#f2ca50] leading-none">
                    {event.dateDay}
                  </span>
                  <span className="text-[11px] font-bold text-[#d0c5af] uppercase tracking-wider mt-0.5">
                    {event.dateMonth}
                  </span>
                </div>

                {/* Text Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                        event.category
                      )}`}
                    >
                      {event.tag || event.category}
                    </span>

                    {event.prizePool && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-full">
                        {event.prizePool}
                      </span>
                    )}

                    {event.deadline && (
                      <span className="text-[10px] text-[#a8a29e] flex items-center gap-1">
                        <Clock size={11} className="text-[#f2ca50]" /> Closes: {event.deadline}
                      </span>
                    )}

                    {event.isVirtual && (
                      <span className="text-[10px] text-[#e0a77f] flex items-center gap-1">
                        <Video size={12} /> {t.virtualEvent}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-title text-base sm:text-lg font-bold text-[#e5e2e1] group-hover:text-[#f2ca50] transition-colors leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[#d0c5af] leading-relaxed max-w-2xl">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#99907c] pt-2">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-[#f2ca50]" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#f2ca50]" />
                      {event.location}
                    </span>
                    {event.speaker && (
                      <span className="text-[#d0c5af] font-medium">
                        &bull; {event.speaker}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions (Google Registration Link & In-App Register) */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#332c22]">
                {/* Attendees count */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {event.attendeeAvatars.slice(0, 3).map((av, idx) => (
                      <img
                        key={idx}
                        src={av}
                        alt="Attendee"
                        className="w-7 h-7 rounded-full object-cover border-2 border-[#181613]"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#99907c]">
                    +{event.attendeesCount} {t.registered}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* MANDATORY: Direct link connecting to its website on Google for registration */}
                  <a
                    href={registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open official registration website on Google"
                    className="bg-[#f2ca50] hover:bg-[#ffe088] text-[#3c2f00] text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Register on Google</span>
                    <ExternalLink size={13} />
                  </a>

                  {/* In-app attendance toggle */}
                  <button
                    onClick={() => onToggleRegister(event.id)}
                    className={`text-xs font-semibold px-3 py-2.5 rounded-xl transition-all flex items-center gap-1 border ${
                      event.isRegistered
                        ? "bg-[#221e18] text-[#f2ca50] border-[#d4af37]/40 hover:bg-[#2b251e]"
                        : "bg-[#181613] text-[#d6d3d1] border-[#383126] hover:text-[#f2ca50]"
                    }`}
                  >
                    {event.isRegistered ? <Check size={14} /> : <Plus size={14} />}
                    <span>{event.isRegistered ? "Added" : "Reminder"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
