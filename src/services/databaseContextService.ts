import { fetchUserNotes, ScholarNote, SecureUserData } from "../lib/firebase";
import {
  initialCourses,
  initialScholarships,
  initialUniversities,
  initialStudyGroups,
  initialEvents,
  initialProjects,
} from "../data/mockData";
import { UserActivityRecord } from "../types";

export interface DatabaseContextPayload {
  userProfile: {
    uid: string;
    name: string;
    email: string;
    university: string;
    role: string;
    location: string;
    bio: string;
    heritageScore: number;
    heritageTier: string;
    securityLevel: string;
    stats: {
      courses: number;
      groups: number;
      projects: number;
      badges: number;
    };
    enrolledCourses: Array<{
      id: string;
      title: string;
      code: string;
      progress: number;
      instructor: string;
    }>;
    savedScholarships: Array<{
      id: string;
      title: string;
      provider: string;
      amount: string;
      deadline: string;
    }>;
    joinedGroups: Array<{
      id: string;
      name: string;
      category: string;
    }>;
  } | null;
  userNotes: Array<{
    id: string;
    title: string;
    content: string;
    discipline: string;
    updatedAt: string;
  }>;
  userActivities: Array<{
    id: string;
    action: string;
    actionType: string;
    targetTitle: string;
    timeAgo?: string;
    createdAt?: string;
  }>;
  catalogue: {
    universitiesSummary: Array<{
      name: string;
      country: string;
      city: string;
      ranking: string;
      popularPrograms: string[];
    }>;
    scholarshipsSummary: Array<{
      title: string;
      provider: string;
      amount: string;
      deadline: string;
      eligibility: string;
    }>;
    coursesSummary: Array<{
      code: string;
      title: string;
      category: string;
      instructor: string;
      lessons: number;
    }>;
    communitiesSummary: Array<{
      name: string;
      category: string;
      members: number;
    }>;
    competitionsSummary: Array<{
      title: string;
      category: string;
      deadline: string;
      reward: string;
    }>;
    eventsSummary: Array<{
      title: string;
      date: string;
      location: string;
      type: string;
    }>;
    researchGrantsSummary: Array<{
      title: string;
      institution: string;
      amount: string;
      deadline: string;
      category: string;
      region: string;
    }>;
  };
}

/**
 * Compiles a rich snapshot of the user's Firestore database records
 * and the platform database catalogue for real-time AI access.
 */
export async function compileDatabaseContext(
  userData: SecureUserData | null,
  uid?: string
): Promise<DatabaseContextPayload> {
  let userNotes: ScholarNote[] = [];
  if (uid) {
    try {
      userNotes = await fetchUserNotes(uid);
    } catch {
      userNotes = [];
    }
  }

  // Retrieve cached or local user activities
  let userActivities: any[] = [];
  try {
    const raw = localStorage.getItem("afriversty_user_activities");
    if (raw) {
      const parsed: UserActivityRecord[] = JSON.parse(raw);
      userActivities = parsed.slice(0, 10).map((a) => ({
        id: a.id,
        action: a.action,
        actionType: a.actionType,
        targetTitle: a.targetTitle,
        createdAt: a.createdAt,
      }));
    }
  } catch {
    userActivities = [];
  }

  // Map user enrolled courses
  const enrolledCourseIds = userData?.enrolledCourseIds || ["c1", "c2"];
  const enrolledCourses = initialCourses
    .filter((c) => enrolledCourseIds.includes(c.id))
    .map((c) => ({
      id: c.id,
      title: c.title,
      code: c.code,
      progress: c.progress,
      instructor: c.instructor,
    }));

  // Map saved scholarships
  const savedScholarshipIds = userData?.savedScholarshipIds || ["sch-1", "sch-2"];
  const savedScholarships = initialScholarships
    .filter((s) => savedScholarshipIds.includes(s.id))
    .map((s) => ({
      id: s.id,
      title: s.title,
      provider: s.organization,
      amount: s.amount,
      deadline: s.deadline,
    }));

  // Map joined groups
  const joinedGroupIds = userData?.joinedGroupIds || ["sg1", "sg2"];
  const joinedGroups = initialStudyGroups
    .filter((g) => joinedGroupIds.includes(g.id))
    .map((g) => ({
      id: g.id,
      name: g.name,
      category: g.category,
    }));

  const userProfile = userData
    ? {
        uid: userData.uid,
        name: userData.displayName || "Scholar",
        email: userData.email,
        university: userData.university || "University of Ghana (Legon)",
        role: userData.role || "Computer Engineering Student",
        location: userData.location || "Accra, Ghana",
        bio: userData.bio || "Pan-African STEM researcher",
        heritageScore: userData.heritageScore ?? 82,
        heritageTier: userData.heritageTier || "Gold Member",
        securityLevel: userData.securityLevel || "Verified Biometric & Academic Credential",
        stats: userData.stats || { courses: 12, groups: 7, projects: 5, badges: 16 },
        enrolledCourses,
        savedScholarships,
        joinedGroups,
      }
    : null;

  // Catalogue summarization for efficient LLM context loading
  const catalogue = {
    universitiesSummary: initialUniversities.slice(0, 10).map((u) => ({
      name: u.fullName || u.shortName,
      country: u.country,
      city: u.location,
      ranking: u.rankBadge || "Leading African Institution",
      popularPrograms: u.focusAreas || [],
    })),
    scholarshipsSummary: initialScholarships.slice(0, 10).map((s) => ({
      title: s.title,
      provider: s.organization,
      amount: s.amount,
      deadline: s.deadline,
      eligibility: s.level || "Undergraduate / Postgraduate",
    })),
    coursesSummary: initialCourses.slice(0, 10).map((c) => ({
      code: c.code,
      title: c.title,
      category: c.category,
      instructor: c.instructor,
      lessons: c.totalLessons,
    })),
    communitiesSummary: initialStudyGroups.slice(0, 8).map((g) => ({
      name: g.name,
      category: g.category,
      members: g.membersCount,
    })),
    competitionsSummary: initialProjects.slice(0, 6).map((p) => ({
      title: p.title,
      category: p.category,
      deadline: "Upcoming Cohort",
      reward: "Recognition & Grants",
    })),
    eventsSummary: initialEvents.slice(0, 6).map((e) => ({
      title: e.title,
      date: e.fullDate || `${e.dateMonth} ${e.dateDay}`,
      location: e.location,
      type: e.category,
    })),
    researchGrantsSummary: [
      {
        title: "African Academy of Sciences Climate & Renewable Microgrid Grant",
        institution: "African Academy of Sciences (AAS)",
        amount: "$75,000 USD",
        deadline: "October 15, 2026",
        category: "Renewable Energy",
        region: "Pan-Africa",
      },
      {
        title: "IndabaX Deep Learning & NLP Indigenous Language Fellowship",
        institution: "Deep Learning Indaba",
        amount: "$25,000 USD + GPU Compute",
        deadline: "September 30, 2026",
        category: "Artificial Intelligence",
        region: "West Africa",
      },
      {
        title: "AGRA Agri-Robotics & Satellite Soil Remote Sensing Fund",
        institution: "Alliance for a Green Revolution in Africa",
        amount: "$50,000 USD",
        deadline: "November 20, 2026",
        category: "Agritech & Food Security",
        region: "East Africa",
      },
      {
        title: "Institut Pasteur Infectious Disease Genomics & CRISPR Fellowship",
        institution: "Institut Pasteur Dakar & CAPRISA",
        amount: "$60,000 USD / Year",
        deadline: "December 5, 2026",
        category: "Biotech & Health",
        region: "Southern Africa",
      },
    ],
  };

  return {
    userProfile,
    userNotes: userNotes.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      discipline: n.discipline,
      updatedAt: n.updatedAt,
    })),
    userActivities,
    catalogue,
  };
}

/**
 * Formats the database snapshot into a clear, structured Markdown section
 * for real-time prompt injection into the AI.
 */
export function formatDatabaseContextForPrompt(db: DatabaseContextPayload): string {
  const parts: string[] = [];

  if (db.userProfile) {
    const p = db.userProfile;
    parts.push(
      `[AUTHENTICATED USER DATABASE RECORD]:
- Scholar Name: ${p.name}
- Email: ${p.email}
- University Affiliation: ${p.university}
- Academic Role / Major: ${p.role}
- Location: ${p.location}
- Heritage Score: ${p.heritageScore} pts (${p.heritageTier})
- Verification: ${p.securityLevel}
- Enrolled Courses in Database (${p.enrolledCourses.length}):
${p.enrolledCourses.map((c) => `  * ${c.code}: ${c.title} (Progress: ${c.progress}%, Instructor: ${c.instructor})`).join("\n") || "  (None yet)"}
- Saved Scholarships in Database (${p.savedScholarships.length}):
${p.savedScholarships.map((s) => `  * ${s.title} (${s.provider}, ${s.amount}, Deadline: ${s.deadline})`).join("\n") || "  (None yet)"}
- Joined Study Circles in Database (${p.joinedGroups.length}):
${p.joinedGroups.map((g) => `  * ${g.name} (${g.category})`).join("\n") || "  (None yet)"}`
    );
  } else {
    parts.push(`[GUEST SCHOLAR PROFILE]: Unauthenticated browsing session.`);
  }

  if (db.userNotes && db.userNotes.length > 0) {
    parts.push(
      `[USER SAVED SCHOLAR NOTES IN FIRESTORE DATABASE (${db.userNotes.length})]:
${db.userNotes.map((n) => `- "${n.title}" [Discipline: ${n.discipline}]: ${n.content}`).join("\n")}`
    );
  }

  if (db.userActivities && db.userActivities.length > 0) {
    parts.push(
      `[RECENT USER DATABASE ACTIVITIES]:
${db.userActivities.slice(0, 5).map((a) => `- ${a.action} -> ${a.targetTitle}`).join("\n")}`
    );
  }

  // Catalogue
  const c = db.catalogue;
  parts.push(
    `[AFRIVERSTY PLATFORM DATABASE CATALOGUE]:
- Top African Universities in DB:
${c.universitiesSummary.map((u) => `  * ${u.name} (${u.city}, ${u.country}) - Ranking: ${u.ranking} | Programs: ${u.popularPrograms.join(", ")}`).join("\n")}

- Featured Scholarships in DB:
${c.scholarshipsSummary.map((s) => `  * ${s.title} - Provider: ${s.provider} | Funding: ${s.amount} | Deadline: ${s.deadline} | Eligibility: ${s.eligibility}`).join("\n")}

- Featured Academic Courses in DB:
${c.coursesSummary.map((cs) => `  * ${cs.code}: ${cs.title} (${cs.category}, ${cs.lessons} lessons, Instructor: ${cs.instructor})`).join("\n")}

- Study Groups & Circles in DB:
${c.communitiesSummary.map((cm) => `  * ${cm.name} (${cm.category}, ${cm.members} members)`).join("\n")}

- Competitions & Hackathons in DB:
${c.competitionsSummary.map((cp) => `  * ${cp.title} (${cp.category} - Reward: ${cp.reward})`).join("\n")}

- Events & Conferences in DB:
${c.eventsSummary.map((ev) => `  * ${ev.title} (${ev.date} at ${ev.location}, Type: ${ev.type})`).join("\n")}

- Research Radar & Grants in DB:
${c.researchGrantsSummary.map((rg) => `  * ${rg.title} (${rg.institution}, ${rg.amount}, Deadline: ${rg.deadline}, Region: ${rg.region})`).join("\n")}`
  );

  return parts.join("\n\n");
}
