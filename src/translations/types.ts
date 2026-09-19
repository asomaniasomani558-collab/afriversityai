export type LanguageCode = "en" | "fr" | "sw" | "ar" | "yo" | "tw" | "am" | "ha" | "zu" | "pt";
export type Language = LanguageCode;

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  region: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    region: "Pan-African & Global",
    flag: "🌍",
    dir: "ltr",
  },
  {
    code: "sw",
    name: "Swahili",
    nativeName: "Kiswahili",
    region: "Afrika Mashariki (East Africa)",
    flag: "🇹🇿",
    dir: "ltr",
  },
  {
    code: "yo",
    name: "Yoruba",
    nativeName: "Yorùbá",
    region: "Ìwọ̀ Oòrùn Áfíríkà (West Africa)",
    flag: "🇳🇬",
    dir: "ltr",
  },
  {
    code: "tw",
    name: "Twi",
    nativeName: "Twi (Akan)",
    region: "Atɔe Fam Abibiman (Ghana/West Africa)",
    flag: "🇬🇭",
    dir: "ltr",
  },
  {
    code: "ha",
    name: "Hausa",
    nativeName: "Harshen Hausa",
    region: "Yammacin Afirka (Nigeria/Niger)",
    flag: "🇳🇬",
    dir: "ltr",
  },
  {
    code: "am",
    name: "Amharic",
    nativeName: "አማርኛ",
    region: "ምስራቅ አፍሪካ (Ethiopia/Horn of Africa)",
    flag: "🇪🇹",
    dir: "ltr",
  },
  {
    code: "zu",
    name: "Zulu",
    nativeName: "isiZulu",
    region: "Iningizimu Afrika (Southern Africa)",
    flag: "🇿🇦",
    dir: "ltr",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    region: "Afrique Francophone",
    flag: "🇨🇲",
    dir: "ltr",
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    region: "PALOP (Angola/Moçambique)",
    flag: "🇦🇴",
    dir: "ltr",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    region: "شمال وشرق إفريقيا (North & East Africa)",
    flag: "🇪🇬",
    dir: "rtl",
  },
];

export interface TranslationDictionary {
  // Navigation & Header
  allPathways: string;
  pathwaysHub: string;
  pathwaysSubtitle: string;
  searchPlaceholder: string;
  notifications: string;
  markAllRead: string;
  newNotifications: string;
  myProfile: string;
  heritageTier: string;
  themeToggle: string;
  languageSelect: string;
  sitemapDirectory: string;
  hubsCount: string;
  allGateways: string;

  // Tabs
  tabLobby: string;
  tabDashboard: string;
  tabCourses: string;
  tabScholarships: string;
  tabStudyGroups: string;
  tabUniversities: string;
  tabStemSandbox: string;
  tabResearchRadar: string;
  tabProjects: string;
  tabAiAssistant: string;
  tabCalendar: string;
  tabMessages: string;
  tabBookmarks: string;
  tabProfile: string;
  tabCommunity: string;

  // Community View
  communityTitle: string;
  communityBadge: string;
  communityDesc: string;
  aiMatchFinder: string;
  friendRequests: string;
  privacySettings: string;
  discoverScholars: string;
  myConnections: string;
  directMessages: string;
  communitiesAndClubs: string;
  stemMentors: string;
  studyCircles: string;
  searchScholarsPlaceholder: string;
  connectScholar: string;
  connected: string;
  pendingRequest: string;
  messageScholar: string;

  // Pathways Drawer & Filtering
  filterAll: string;
  filterAcademic: string;
  filterStem: string;
  filterCommunity: string;
  searchPathways: string;
  openPathway: string;
  activeStatus: string;
  allGatewaysOnline: string;
  close: string;
  pressEscToClose: string;
  routeLabel: string;
  noMatchingPathways: string;
  resetSearch: string;

  // Common Actions
  enrollNow: string;
  applyNow: string;
  joinGroup: string;
  leaveGroup: string;
  viewDetails: string;
  launchLab: string;
  saved: string;
  save: string;
  copy: string;
  copied: string;
  explore: string;
  learnMore: string;
  back: string;
  share: string;
  online: string;
  members: string;
  submit: string;
  cancel: string;
  filter: string;
  all: string;
  viewAll: string;
  active: string;
  completed: string;
  inProgress: string;
  wishlist: string;
  download: string;

  // Dashboard Page
  welcomeBack: string;
  enrolledAt: string;
  keepUpMomentum: string;
  allCoursesBtn: string;
  aiMentorBtn: string;
  quoteOfTheDay: string;
  quoteText: string;
  quoteAuthor: string;
  continueLearning: string;
  minsLeft: string;
  resumeLesson: string;
  academicTelemetry: string;
  enrolledCoursesMetric: string;
  weeklyStudyHoursMetric: string;
  averageGpaMetric: string;
  researchPointsMetric: string;
  hardwarePrototypesMetric: string;
  todaysTimetable: string;
  lectureRoom: string;
  labSession: string;
  stemLabsQuickLaunch: string;
  recentActivity: string;
  completedLesson: string;
  joinedCircle: string;
  submittedLab: string;
  postedProof: string;

  // Courses Page
  coursesTitle: string;
  coursesSubtitle: string;
  searchCoursesPlaceholder: string;
  catComputerScience: string;
  catEngineering: string;
  catMathematics: string;
  catSciences: string;
  catBusiness: string;
  catDesign: string;
  instructorLabel: string;
  syllabusTitle: string;
  startCourse: string;
  enrolledStudentsCount: string;
  lessonsCount: string;
  moduleLabel: string;

  // STEM Sandbox Page
  stemSandboxTitle: string;
  stemSandboxSubtitle: string;
  toolCircuits: string;
  toolPythonOde: string;
  toolCrystalLattice: string;
  circuitControls: string;
  waveformType: string;
  sineWave: string;
  squareWave: string;
  dcWave: string;
  voltageLabel: string;
  frequencyLabel: string;
  resistanceLabel: string;
  inductanceLabel: string;
  capacitanceLabel: string;
  liveMeasurements: string;
  peakCurrent: string;
  phaseAngle: string;
  resonanceFreq: string;
  runSimulation: string;
  pauseSimulation: string;
  resetCircuit: string;
  pythonEngine: string;
  runPythonCode: string;
  pythonOutputLabel: string;
  latticeTitle: string;
  perovskiteStructure: string;
  diamondStructure: string;
  fccStructure: string;
  bccStructure: string;
  autoRotate: string;

  // Research Radar Page
  researchRadarTitle: string;
  researchRadarSubtitle: string;
  grantsFoundCount: string;
  searchGrantsPlaceholder: string;
  catRenewableEnergy: string;
  catAiNlp: string;
  catAgritech: string;
  catBiotech: string;
  catClimate: string;
  deadlineLabel: string;
  daysRemainingLabel: string;
  funderLabel: string;
  grantAmountLabel: string;
  eligibilityCriteria: string;
  applyForGrant: string;
  equipmentSharingTitle: string;
  equipmentSharingSubtitle: string;
  facultyMentorsTitle: string;

  // Scholarships Page
  scholarshipsTitle: string;
  scholarshipsSubtitle: string;
  openApplicationsCount: string;
  searchScholarshipsPlaceholder: string;
  coverageFull: string;
  coveragePartial: string;
  targetLevel: string;
  undergradLevel: string;
  mastersLevel: string;
  phdLevel: string;

  // Study Groups Page
  studyGroupsTitle: string;
  studyGroupsSubtitle: string;
  activeCirclesCount: string;
  createGroupBtn: string;
  searchGroupsPlaceholder: string;
  activeTopicLabel: string;
  launchWhiteboard: string;
  launchVoiceRoom: string;

  // Universities Page
  universitiesTitle: string;
  universitiesSubtitle: string;
  institutionsCount: string;
  searchUniversitiesPlaceholder: string;
  studentsCount: string;
  rankingLabel: string;
  establishedLabel: string;
  exchangeProgram: string;

  // AI Assistant Page
  aiMentorTitle: string;
  aiMentorSubtitle: string;
  aiWelcomeMessage: string;
  askAnythingPrompt: string;
  promptPhysics: string;
  promptChemistry: string;
  promptCalculus: string;
  promptMicrogrids: string;
  sendMessageBtn: string;
  soundEnabled: string;

  // Projects Page
  projectsTitle: string;
  projectsSubtitle: string;
  featuredPrototypes: string;
  openSourceRepos: string;
  submitProjectBtn: string;
  starsCount: string;
  forksCount: string;

  // Lobby Page
  lobbyBadge: string;
  lobbyHeroTitle1: string;
  lobbyHeroTitle2: string;
  lobbyHeroDesc: string;
  exploreCoursesAction: string;
  joinCommunityAction: string;
  launchAiMentorAction: string;
  pillarsTitle: string;
  manifestoTitle: string;
  honorCodeTitle: string;

  // Profile & Settings Page
  profileTitle: string;
  profileSubtitle: string;
  academicBio: string;
  institutionalSso: string;
  ssoConnected: string;
  badgeVaultTitle: string;
  lowDataModeTitle: string;
  lowDataModeDesc: string;
  appearanceTitle: string;
  academicStatsTitle: string;

  // Events & Calendar Page
  calendarTitle: string;
  calendarSubtitle: string;
  upcomingEvents: string;
  hackathonsTitle: string;
  deadlinesTitle: string;
  rsvpAction: string;
  eventRegistered: string;

  // Messages & Bookmarks Modals
  messagesTitle: string;
  messagesSubtitle: string;
  typeMessagePlaceholder: string;
  sendBtn: string;
  bookmarksTitle: string;
  bookmarksSubtitle: string;
  noBookmarksYet: string;

  // Additional Common & View-specific keys
  partnerUniversities: string;
  africanNations: string;
  allPathwayHub: string;
  tabMyCourses: string;
  editProfile: string;
  courses: string;
  studyGroups: string;
  projects: string;
  badges: string;
  saveChanges: string;
  launchProject: string;
  searchProjectsPlaceholder: string;
  publishProject: string;
  catArtificialIntelligence: string;
  catBiotechHealth: string;
  panAfricanVanguard: string;
  tabGrants: string;
  tabMentors: string;
  tabLatex: string;
  highImpact: string;
  keyCriteria: string;
  fundingCap: string;
  daysLeft: string;
  applicationDraftSaved: string;
  applyAndPrepDraft: string;
  researchFocusAreas: string;
  openResearchPositions: string;
  invitationSent: string;
  requestCoAdvising: string;
  latexSourceEditor: string;
  exportTex: string;
  renderedPreprint: string;
  autoCompiled: string;
  fullTuition: string;
  postgraduate: string;
  researchGrants: string;
  heritageExcellenceFund: string;
  activeScholarships: string;
  totalFundingValue: string;
  fellowshipBenefits: string;
  submitApplication: string;
  createGroup: string;
  myGroups: string;
  popular: string;
  newGroups: string;
  joined: string;
  students: string;
  exploreCampus: string;
  savedBookmarks: string;
  savedScholarships: string;
  curriculumBookmarks: string;
  eventsTitle: string;
  eventsSubtitle: string;
  pastEvents: string;
  virtualEvent: string;
  registered: string;
  registerNow: string;
  heroTitlePart1: string;
  heroTitlePart2: string;
  heroSubtitle: string;
  exploreCourses: string;
  joinStudyGroups: string;
  launchAiMentor: string;
  panAfricanHeritage: string;
  activeStudents: string;
  curatedCourses: string;
}
