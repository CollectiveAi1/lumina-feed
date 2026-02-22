import spark1 from "@/assets/spark-1.jpg";
import spark2 from "@/assets/spark-2.jpg";
import spark3 from "@/assets/spark-3.jpg";
import spark4 from "@/assets/spark-4.jpg";
import spark5 from "@/assets/spark-5.jpg";
import spark6 from "@/assets/spark-6.jpg";

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  role: "learner" | "creator" | "admin";
  credentials?: string;
  institution?: string;
  isVerified: boolean;
  followerCount: number;
  sparkCount: number;
  totalBrains: number;
}

export interface ContentBlock {
  type: "paragraph" | "quote" | "heading" | "image";
  text?: string;
  source?: string;
  url?: string;
  alt?: string;
}

export interface Spark {
  id: string;
  title: string;
  slug: string;
  author: Author;
  category: string;
  readTime: string;
  readTimeMinutes: number;
  image: string;
  excerpt: string;
  content: ContentBlock[];
  brainCount: number;
  publishedAt: string;
  status: "draft" | "published" | "archived";
}

export interface Stack {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  owner: Author;
  collaborators: Author[];
  sparkCount: number;
  sparks: Spark[];
  isCollaborative: boolean;
  isPublic: boolean;
  createdAt: string;
}

export interface UserProfile extends Author {
  currentStreak: number;
  bestStreak: number;
  consecutiveWeeks: number;
  lastActiveDate: string;
  focusModeEnabled: boolean;
  focusSessionMinutes: number;
  brainedSparks: string[];
}

export interface Note {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  spark?: Spark;
}

export interface StreakDay {
  date: string;
  sparksRead: number;
  sessionMinutes: number;
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// Mock Authors
// ---------------------------------------------------------------------------

export const mockAuthors: Author[] = [
  {
    id: "author-1",
    username: "elenamarsh",
    displayName: "Dr. Elena Marsh",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
    bio: "Neuroscientist exploring the intersection of sleep, memory, and neural plasticity. Published over 40 peer-reviewed papers on synaptic consolidation.",
    role: "creator",
    credentials: "Ph.D. Cognitive Neuroscience",
    institution: "MIT Department of Brain and Cognitive Sciences",
    isVerified: true,
    followerCount: 12840,
    sparkCount: 34,
    totalBrains: 89200,
  },
  {
    id: "author-2",
    username: "jamescollin",
    displayName: "James Collin",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    bio: "Cultural critic and essayist writing about the future of reading, attention, and digital literacy in the modern age.",
    role: "creator",
    credentials: "M.A. Comparative Literature",
    institution: "Columbia University",
    isVerified: true,
    followerCount: 8730,
    sparkCount: 22,
    totalBrains: 54100,
  },
  {
    id: "author-3",
    username: "anikarao",
    displayName: "Prof. Anika Rao",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=anika",
    bio: "Mathematician and educator passionate about revealing the hidden geometric patterns that underpin our universe.",
    role: "creator",
    credentials: "Ph.D. Pure Mathematics",
    institution: "Stanford University",
    isVerified: true,
    followerCount: 15200,
    sparkCount: 41,
    totalBrains: 102300,
  },
  {
    id: "author-4",
    username: "samirpatel",
    displayName: "Samir Patel",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=samir",
    bio: "Astrophysicist and science communicator specializing in cosmology and deep-space observation technology.",
    role: "creator",
    credentials: "Ph.D. Astrophysics",
    institution: "Caltech Jet Propulsion Laboratory",
    isVerified: true,
    followerCount: 21500,
    sparkCount: 28,
    totalBrains: 143700,
  },
  {
    id: "author-5",
    username: "liwei",
    displayName: "Dr. Li Wei",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=liwei",
    bio: "Microbiologist studying the human microbiome with a focus on skin-resident microbial communities and their role in immune regulation.",
    role: "creator",
    credentials: "M.D., Ph.D. Microbiology",
    institution: "Johns Hopkins School of Medicine",
    isVerified: true,
    followerCount: 9450,
    sparkCount: 19,
    totalBrains: 61800,
  },
  {
    id: "author-6",
    username: "rosavazquez",
    displayName: "Prof. Rosa Vázquez",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=rosa",
    bio: "Historian and cartography scholar uncovering suppressed narratives in historical maps and geographic records.",
    role: "creator",
    credentials: "Ph.D. Historical Geography",
    institution: "University of Oxford",
    isVerified: true,
    followerCount: 11200,
    sparkCount: 37,
    totalBrains: 78600,
  },
];

// ---------------------------------------------------------------------------
// Helper to look up an author by index
// ---------------------------------------------------------------------------

const author = (index: number): Author => mockAuthors[index];

// ---------------------------------------------------------------------------
// Mock Sparks (12 total)
// ---------------------------------------------------------------------------

export const mockSparks: Spark[] = [
  // 1 — Neuroscience
  {
    id: "spark-1",
    title: "How Your Brain Rewires Itself While You Sleep",
    slug: "brain-rewires-while-you-sleep",
    author: author(0),
    category: "Neuroscience",
    readTime: "4 min",
    readTimeMinutes: 4,
    image: spark1,
    excerpt:
      "Every night, your sleeping brain replays the day's experiences at high speed, strengthening useful connections and pruning the rest.",
    content: [
      {
        type: "paragraph",
        text: "When you drift off to sleep, your brain enters one of its most productive phases. Far from shutting down, it launches a complex series of processes that consolidate memories, clear metabolic waste, and restructure neural pathways.",
      },
      {
        type: "heading",
        text: "The Role of Slow-Wave Sleep",
      },
      {
        type: "paragraph",
        text: "During deep slow-wave sleep, the hippocampus replays experiences from the day at compressed timescales. These replays help transfer information to the neocortex for long-term storage, a process neuroscientists call systems consolidation.",
      },
      {
        type: "quote",
        text: "Sleep is the price we pay for plasticity.",
        source: "Giulio Tononi, University of Wisconsin",
      },
      {
        type: "paragraph",
        text: "Without adequate sleep, the synaptic homeostasis process is disrupted: synapses remain saturated and the brain loses its ability to encode new information efficiently the following day.",
      },
    ],
    brainCount: 2847,
    publishedAt: "2025-12-15T08:00:00Z",
    status: "published",
  },
  // 2 — Culture
  {
    id: "spark-2",
    title: "The Lost Art of Deep Reading in a Distracted World",
    slug: "lost-art-deep-reading",
    author: author(1),
    category: "Culture",
    readTime: "6 min",
    readTimeMinutes: 6,
    image: spark2,
    excerpt:
      "In an era of infinite scrolling, the capacity for sustained, immersive reading is becoming a rare cognitive skill worth cultivating.",
    content: [
      {
        type: "paragraph",
        text: "Deep reading is more than decoding words on a page. It is a state of cognitive immersion that activates empathy circuits, strengthens analytical thinking, and builds the kind of sustained attention that modern life erodes.",
      },
      {
        type: "heading",
        text: "How Screens Changed Our Reading Brains",
      },
      {
        type: "paragraph",
        text: "Neuroscientist Maryanne Wolf has documented how the shift to screen-based reading encourages skimming and F-shaped scanning patterns. Over time, these shortcuts weaken the neural circuits responsible for deep comprehension.",
      },
      {
        type: "quote",
        text: "We are not only what we read. We are how we read.",
        source: "Maryanne Wolf",
      },
      {
        type: "paragraph",
        text: "Reclaiming the ability to read deeply requires deliberate practice: setting aside distraction-free time, choosing long-form texts, and resisting the urge to switch tasks mid-sentence.",
      },
    ],
    brainCount: 1953,
    publishedAt: "2025-12-10T10:30:00Z",
    status: "published",
  },
  // 3 — Mathematics
  {
    id: "spark-3",
    title: "Why Geometry Is the Language of the Universe",
    slug: "geometry-language-universe",
    author: author(2),
    category: "Mathematics",
    readTime: "5 min",
    readTimeMinutes: 5,
    image: spark3,
    excerpt:
      "From the spirals of galaxies to the hexagons in honeycombs, geometric patterns emerge as the universe's native vocabulary.",
    content: [
      {
        type: "paragraph",
        text: "Geometry is not merely an invention of human mathematics. It is woven into the fabric of nature. The same logarithmic spiral that describes a nautilus shell also traces the arms of the Milky Way.",
      },
      {
        type: "heading",
        text: "Symmetry and Conservation Laws",
      },
      {
        type: "paragraph",
        text: "Emmy Noether showed that every symmetry in physics corresponds to a conservation law. Translational symmetry gives us conservation of momentum; rotational symmetry yields conservation of angular momentum. Geometry, in this view, is the engine of physical law.",
      },
      {
        type: "quote",
        text: "The book of nature is written in the language of mathematics.",
        source: "Galileo Galilei",
      },
      {
        type: "paragraph",
        text: "Modern theoretical physics leans even more heavily on geometry. General relativity describes gravity as the curvature of spacetime, and string theory proposes that extra spatial dimensions, curled into intricate geometric shapes called Calabi-Yau manifolds, determine the fundamental forces of nature.",
      },
    ],
    brainCount: 3201,
    publishedAt: "2025-11-28T14:00:00Z",
    status: "published",
  },
  // 4 — Astronomy
  {
    id: "spark-4",
    title: "What the James Webb Telescope Reveals About Time",
    slug: "james-webb-reveals-time",
    author: author(3),
    category: "Astronomy",
    readTime: "7 min",
    readTimeMinutes: 7,
    image: spark4,
    excerpt:
      "By peering deeper into space than ever before, JWST is showing us galaxies as they existed just a few hundred million years after the Big Bang.",
    content: [
      {
        type: "paragraph",
        text: "The James Webb Space Telescope is not merely an instrument of observation. It is a time machine. Every photon it captures has been traveling for billions of years, carrying with it a snapshot of the cosmos in its infancy.",
      },
      {
        type: "heading",
        text: "Galaxies That Shouldn't Exist",
      },
      {
        type: "paragraph",
        text: "Among JWST's most startling discoveries are massive, well-structured galaxies that formed far earlier than existing models predicted. Their existence challenges standard cosmological timelines and suggests that galaxy formation was more efficient in the early universe than previously thought.",
      },
      {
        type: "quote",
        text: "We are seeing the universe write its own autobiography, and the opening chapters are far more dramatic than anyone imagined.",
        source: "Garth Illingworth, UC Santa Cruz",
      },
      {
        type: "paragraph",
        text: "These findings are pushing astrophysicists to revisit fundamental assumptions about dark matter, star formation rates, and the timeline of cosmic reionization.",
      },
    ],
    brainCount: 4512,
    publishedAt: "2025-12-02T09:15:00Z",
    status: "published",
  },
  // 5 — Biology
  {
    id: "spark-5",
    title: "The Invisible World Living on Your Skin",
    slug: "invisible-world-on-skin",
    author: author(4),
    category: "Biology",
    readTime: "3 min",
    readTimeMinutes: 3,
    image: spark5,
    excerpt:
      "Your skin hosts a thriving ecosystem of trillions of microorganisms that actively defend you against pathogens and shape your immune response.",
    content: [
      {
        type: "paragraph",
        text: "Every square centimeter of your skin is home to roughly a million microorganisms. Together, they form the skin microbiome, a complex ecosystem that rivals the diversity of a tropical rainforest.",
      },
      {
        type: "heading",
        text: "Defenders at the Gate",
      },
      {
        type: "paragraph",
        text: "Commensal bacteria on the skin produce antimicrobial peptides that inhibit pathogenic colonization. Species like Staphylococcus epidermidis train the immune system to distinguish friend from foe, reducing inappropriate inflammatory responses.",
      },
      {
        type: "paragraph",
        text: "Disruptions to this microbial community, through harsh cleansers, antibiotics, or environmental stressors, can open the door to conditions like eczema, acne, and chronic wound infections.",
      },
    ],
    brainCount: 1678,
    publishedAt: "2025-12-18T11:00:00Z",
    status: "published",
  },
  // 6 — History
  {
    id: "spark-6",
    title: "Ancient Maps and the Stories They Were Afraid to Tell",
    slug: "ancient-maps-hidden-stories",
    author: author(5),
    category: "History",
    readTime: "8 min",
    readTimeMinutes: 8,
    image: spark6,
    excerpt:
      "Medieval and Renaissance cartographers encoded political fears, religious anxieties, and colonial ambitions into the blank spaces of their maps.",
    content: [
      {
        type: "paragraph",
        text: "A map is never a neutral document. Every border drawn, every territory labeled, and every blank space left unmarked carries the ideology of its maker. Historical cartography reveals as much about power as it does about geography.",
      },
      {
        type: "heading",
        text: "Here Be Dragons",
      },
      {
        type: "paragraph",
        text: "The famous phrase 'Here be dragons' appeared on only a handful of historical maps, but the practice of filling unknown regions with monsters and mythological creatures was widespread. These illustrations served as warnings, advertisements, and expressions of cultural anxiety about the unknown.",
      },
      {
        type: "quote",
        text: "Maps are the art of the possible, framed by the politics of the moment.",
        source: "J.B. Harley",
      },
      {
        type: "paragraph",
        text: "By reading these maps as cultural artifacts rather than geographic tools, historians have uncovered suppressed trade routes, erased civilizations, and deliberate distortions designed to protect colonial interests.",
      },
    ],
    brainCount: 2234,
    publishedAt: "2025-11-20T16:45:00Z",
    status: "published",
  },
  // 7 — Philosophy
  {
    id: "spark-7",
    title: "The Ship of Theseus and the Science of Identity",
    slug: "ship-of-theseus-identity",
    author: author(2),
    category: "Philosophy",
    readTime: "5 min",
    readTimeMinutes: 5,
    image: spark1,
    excerpt:
      "If every plank of a ship is replaced over time, is it still the same ship? Modern neuroscience is giving this ancient paradox a surprising new answer.",
    content: [
      {
        type: "paragraph",
        text: "The Ship of Theseus is one of the oldest thought experiments in Western philosophy, first recorded by Plutarch. If a ship's wooden parts are gradually replaced until none of the originals remain, is the result the same ship or a different one?",
      },
      {
        type: "heading",
        text: "Your Body Is a Ship of Theseus",
      },
      {
        type: "paragraph",
        text: "The human body replaces nearly all of its cells over a span of seven to ten years. Your skeleton, your skin, your blood, even most of your organs, are composed of entirely different atoms than those you carried a decade ago. And yet, your sense of self persists.",
      },
      {
        type: "quote",
        text: "Identity is not a thing but a pattern, a pattern that persists even as its substrate changes.",
        source: "Daniel Dennett",
      },
      {
        type: "paragraph",
        text: "Neuroscience suggests that identity resides not in matter but in the continuity of information: the patterns of synaptic connections, the accumulated memories, the persistent computational architecture of the brain. We are, in a very real sense, the pattern, not the material.",
      },
    ],
    brainCount: 3890,
    publishedAt: "2025-12-05T07:30:00Z",
    status: "published",
  },
  // 8 — Technology
  {
    id: "spark-8",
    title: "Why Quantum Computers Won't Replace Classical Ones",
    slug: "quantum-computers-wont-replace-classical",
    author: author(3),
    category: "Technology",
    readTime: "6 min",
    readTimeMinutes: 6,
    image: spark2,
    excerpt:
      "Quantum computing is powerful but specialized. Understanding where it excels and where it falls short is key to realistic expectations.",
    content: [
      {
        type: "paragraph",
        text: "The popular narrative positions quantum computers as the inevitable successors to classical machines, destined to make today's supercomputers obsolete. The reality is far more nuanced.",
      },
      {
        type: "heading",
        text: "The Specialization Principle",
      },
      {
        type: "paragraph",
        text: "Quantum computers derive their power from superposition and entanglement, properties that provide exponential speedups for specific problem classes: integer factorization, unstructured search, and quantum simulation. For everyday computing tasks like word processing, web browsing, and most software development, classical architectures remain more efficient.",
      },
      {
        type: "quote",
        text: "Quantum computing is not about speed. It is about accessing a fundamentally different space of computation.",
        source: "Scott Aaronson, UT Austin",
      },
      {
        type: "paragraph",
        text: "The future is likely hybrid: classical processors handling general workloads while quantum co-processors tackle the narrow class of problems where they offer a genuine advantage. Understanding this division is essential for making informed decisions about research investment and technology strategy.",
      },
    ],
    brainCount: 2156,
    publishedAt: "2025-12-12T13:00:00Z",
    status: "published",
  },
  // 9 — Psychology (Neuroscience-adjacent)
  {
    id: "spark-9",
    title: "The Science Behind Why Nostalgia Feels Bittersweet",
    slug: "science-nostalgia-bittersweet",
    author: author(0),
    category: "Neuroscience",
    readTime: "4 min",
    readTimeMinutes: 4,
    image: spark3,
    excerpt:
      "Nostalgia activates reward and pain circuits simultaneously, producing a uniquely human emotional blend that may have evolved to strengthen social bonds.",
    content: [
      {
        type: "paragraph",
        text: "For most of psychology's history, nostalgia was classified as a disorder, a form of homesickness that weakened soldiers and displaced workers. Modern research has reversed that view entirely.",
      },
      {
        type: "heading",
        text: "Dual-Circuit Activation",
      },
      {
        type: "paragraph",
        text: "Functional MRI studies show that nostalgic memories simultaneously activate the brain's reward circuitry, centered on the ventral striatum, and regions associated with sadness, particularly the anterior insula. This dual activation produces the characteristic bittersweet quality.",
      },
      {
        type: "paragraph",
        text: "Researchers now believe nostalgia serves an adaptive purpose: it reinforces social connectedness, buffers against loneliness, and provides a sense of meaning and continuity across time. People who experience nostalgia regularly report higher self-esteem and greater resilience to existential anxiety.",
      },
    ],
    brainCount: 1845,
    publishedAt: "2025-12-20T09:00:00Z",
    status: "published",
  },
  // 10 — Biology
  {
    id: "spark-10",
    title: "How Trees Communicate Through Underground Networks",
    slug: "trees-communicate-underground",
    author: author(4),
    category: "Biology",
    readTime: "5 min",
    readTimeMinutes: 5,
    image: spark4,
    excerpt:
      "Beneath the forest floor, mycorrhizal fungi form vast networks that allow trees to share nutrients, send chemical warnings, and even recognize kin.",
    content: [
      {
        type: "paragraph",
        text: "Walk through a forest and you are walking over one of nature's most sophisticated communication systems. Below the soil, mycorrhizal fungi form thread-like networks, sometimes called the Wood Wide Web, connecting the root systems of trees across vast distances.",
      },
      {
        type: "heading",
        text: "Resource Sharing and Kin Recognition",
      },
      {
        type: "paragraph",
        text: "Through these fungal networks, mother trees can channel carbon and nutrients to their seedlings, giving them a survival advantage in the shaded understory. Isotope-tracing experiments have shown that trees can distinguish their own offspring from unrelated seedlings, preferentially sharing resources with kin.",
      },
      {
        type: "quote",
        text: "A forest is not a collection of individual trees. It is a superorganism.",
        source: "Suzanne Simard, University of British Columbia",
      },
      {
        type: "paragraph",
        text: "When a tree is attacked by insects, it can release chemical signals through the mycorrhizal network, prompting neighboring trees to upregulate their own defense compounds before the threat arrives. This cooperative behavior challenges the long-held view that forests are purely competitive environments.",
      },
    ],
    brainCount: 5120,
    publishedAt: "2025-11-15T12:30:00Z",
    status: "published",
  },
  // 11 — History
  {
    id: "spark-11",
    title: "The Forgotten Women Who Programmed the First Computers",
    slug: "forgotten-women-first-computers",
    author: author(5),
    category: "History",
    readTime: "7 min",
    readTimeMinutes: 7,
    image: spark5,
    excerpt:
      "In the 1940s, six women programmed the ENIAC, one of the first general-purpose computers, yet their contributions were erased from the historical record for decades.",
    content: [
      {
        type: "paragraph",
        text: "When the U.S. Army unveiled ENIAC in 1946, the press photographs showed the machine and its male engineers. Absent from the narrative were the six women, Kay McNulty, Betty Jennings, Betty Snyder, Marlyn Meltzer, Fran Bilas, and Ruth Lichterman, who had programmed it.",
      },
      {
        type: "heading",
        text: "Programming Without a Manual",
      },
      {
        type: "paragraph",
        text: "The ENIAC had no programming language, no operating system, and no manual. The women studied the machine's logical diagrams and physical wiring to understand how it processed information. They developed subroutines, debugged hardware faults, and created the foundational techniques that would evolve into modern software engineering.",
      },
      {
        type: "paragraph",
        text: "Their contributions were classified during the war and overlooked afterward. It was not until historian Kathy Kleiman began researching the ENIAC in the 1980s that their stories began to be recovered and recognized.",
      },
    ],
    brainCount: 3674,
    publishedAt: "2025-12-08T15:00:00Z",
    status: "published",
  },
  // 12 — Mathematics
  {
    id: "spark-12",
    title: "Infinity Is Not What You Think It Is",
    slug: "infinity-not-what-you-think",
    author: author(2),
    category: "Mathematics",
    readTime: "6 min",
    readTimeMinutes: 6,
    image: spark6,
    excerpt:
      "Georg Cantor proved that some infinities are larger than others, a result so controversial it drove him to despair but ultimately reshaped the foundations of mathematics.",
    content: [
      {
        type: "paragraph",
        text: "Most people think of infinity as a single, monolithic concept: the biggest thing there is. But in 1874, mathematician Georg Cantor shattered that intuition by proving that the infinity of real numbers is strictly larger than the infinity of natural numbers.",
      },
      {
        type: "heading",
        text: "Cantor's Diagonal Argument",
      },
      {
        type: "paragraph",
        text: "Cantor's proof is elegant in its simplicity. Suppose you could list all real numbers between 0 and 1. Cantor showed that you can always construct a new number not on the list by changing the nth digit of the nth number. This diagonal argument demonstrates that the real numbers are uncountably infinite, a larger type of infinity than the countable infinity of the integers.",
      },
      {
        type: "quote",
        text: "The essence of mathematics lies in its freedom.",
        source: "Georg Cantor",
      },
      {
        type: "paragraph",
        text: "Cantor's work was fiercely opposed by contemporaries like Leopold Kronecker, who called him a corrupter of youth. The psychological toll was immense, and Cantor spent his final years in a sanatorium. Today, his transfinite set theory is considered one of the greatest intellectual achievements in the history of mathematics.",
      },
    ],
    brainCount: 4287,
    publishedAt: "2025-11-25T10:00:00Z",
    status: "published",
  },
  // 13 — Art
  {
    id: "spark-13",
    title: "Why Rothko's Color Fields Make People Cry",
    slug: "rothko-color-fields-make-people-cry",
    author: author(1),
    category: "Art",
    readTime: "5 min",
    readTimeMinutes: 5,
    image: spark3,
    excerpt:
      "Mark Rothko's luminous rectangles bypass language and narrative, triggering deep emotional responses that viewers struggle to explain.",
    content: [
      {
        type: "paragraph",
        text: "Stand close to a Rothko painting in a quiet gallery and something unexpected happens. The enormous, softly vibrating fields of color seem to envelop you. Visitors report tears, awe, even a sense of transcendence — reactions that feel disproportionate to what is, on the surface, just colored paint on canvas.",
      },
      {
        type: "heading",
        text: "Emotion Without Representation",
      },
      {
        type: "paragraph",
        text: "Rothko deliberately stripped away recognizable imagery to create what he called 'basic human emotions — tragedy, ecstasy, doom.' By eliminating narrative, he forced viewers into a direct confrontation with color, scale, and light. Neuroscientific research suggests that large-scale color fields activate the brain's emotional circuits without the mediation of the visual processing pathways used for object recognition.",
      },
      {
        type: "quote",
        text: "I'm not an abstractionist. I'm not interested in the relationship of color or form. I'm interested only in expressing basic human emotions.",
        source: "Mark Rothko",
      },
      {
        type: "paragraph",
        text: "Rothko insisted his paintings be hung in intimate, dimly lit spaces and viewed from up close. He understood intuitively what perception scientists would later confirm: at the right scale and distance, a visual field can overwhelm peripheral vision and create an immersive experience that the brain processes more like an environment than an object.",
      },
    ],
    brainCount: 3412,
    publishedAt: "2025-12-22T11:00:00Z",
    status: "published",
  },
];

// ---------------------------------------------------------------------------
// Mock Stacks
// ---------------------------------------------------------------------------

export const mockStacks: Stack[] = [
  {
    id: "stack-1",
    title: "Mind & Brain Essentials",
    description:
      "A curated collection exploring how the brain shapes thought, memory, and identity.",
    coverImage: spark1,
    owner: author(0),
    collaborators: [author(2)],
    sparkCount: 3,
    sparks: [mockSparks[0], mockSparks[8], mockSparks[6]],
    isCollaborative: true,
    isPublic: true,
    createdAt: "2025-11-01T08:00:00Z",
  },
  {
    id: "stack-2",
    title: "Cosmic Perspectives",
    description:
      "From deep-space observations to the mathematics of the cosmos, this stack charts humanity's quest to understand the universe.",
    coverImage: spark4,
    owner: author(3),
    collaborators: [author(2)],
    sparkCount: 3,
    sparks: [mockSparks[3], mockSparks[2], mockSparks[11]],
    isCollaborative: true,
    isPublic: true,
    createdAt: "2025-11-10T14:00:00Z",
  },
  {
    id: "stack-3",
    title: "Hidden Histories",
    description:
      "Uncovering the stories that mainstream narratives left out, from forgotten pioneers to suppressed maps.",
    coverImage: spark6,
    owner: author(5),
    collaborators: [author(1)],
    sparkCount: 4,
    sparks: [mockSparks[5], mockSparks[10], mockSparks[1], mockSparks[7]],
    isCollaborative: false,
    isPublic: true,
    createdAt: "2025-11-18T09:30:00Z",
  },
];

// ---------------------------------------------------------------------------
// Mock Current User Profile
// ---------------------------------------------------------------------------

export const mockCurrentUser: UserProfile = {
  id: "user-current",
  username: "curious_learner",
  displayName: "Alex Rivera",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  bio: "Lifelong learner obsessed with neuroscience, philosophy, and the stories hidden in old maps.",
  role: "learner",
  isVerified: false,
  followerCount: 42,
  sparkCount: 0,
  totalBrains: 0,
  currentStreak: 5,
  bestStreak: 14,
  consecutiveWeeks: 3,
  lastActiveDate: "2026-02-16",
  focusModeEnabled: true,
  focusSessionMinutes: 25,
  brainedSparks: [
    "spark-1",
    "spark-3",
    "spark-4",
    "spark-7",
    "spark-10",
    "spark-12",
  ],
};

// ---------------------------------------------------------------------------
// Mock Notes
// ---------------------------------------------------------------------------

export const mockNotes: Note[] = [
  {
    id: "note-1",
    userId: "user-current",
    postId: "spark-1",
    content:
      "Slow-wave sleep and memory consolidation — need to look into synaptic homeostasis hypothesis more. Is this why pulling all-nighters before exams backfires?",
    createdAt: "2025-12-15T22:30:00Z",
    updatedAt: "2025-12-15T22:30:00Z",
    spark: mockSparks[0],
  },
  {
    id: "note-2",
    userId: "user-current",
    postId: "spark-3",
    content:
      "Noether's theorem is beautiful: every symmetry corresponds to a conservation law. Connects to the Galileo quote about mathematics being nature's language.",
    createdAt: "2025-12-01T10:15:00Z",
    updatedAt: "2025-12-02T08:00:00Z",
    spark: mockSparks[2],
  },
  {
    id: "note-3",
    userId: "user-current",
    postId: "spark-10",
    content:
      "The Wood Wide Web concept is fascinating. Suzanne Simard's work on mother trees sharing carbon with seedlings — trees recognizing kin!",
    createdAt: "2025-11-16T14:00:00Z",
    updatedAt: "2025-11-16T14:00:00Z",
    spark: mockSparks[9],
  },
  {
    id: "note-4",
    userId: "user-current",
    postId: "spark-7",
    content:
      "Dennett's idea that identity is a pattern rather than a substance resolves the Ship of Theseus nicely. We are the software, not the hardware.",
    createdAt: "2025-12-06T19:45:00Z",
    updatedAt: "2025-12-07T08:20:00Z",
    spark: mockSparks[6],
  },
];

// ---------------------------------------------------------------------------
// Mock Streak Log (last 28 days from 2026-02-16)
// ---------------------------------------------------------------------------

export const mockStreakLog: StreakDay[] = [
  { date: "2026-01-20", sparksRead: 0, sessionMinutes: 0, isActive: false },
  { date: "2026-01-21", sparksRead: 2, sessionMinutes: 18, isActive: true },
  { date: "2026-01-22", sparksRead: 1, sessionMinutes: 12, isActive: true },
  { date: "2026-01-23", sparksRead: 0, sessionMinutes: 0, isActive: false },
  { date: "2026-01-24", sparksRead: 0, sessionMinutes: 0, isActive: false },
  { date: "2026-01-25", sparksRead: 3, sessionMinutes: 25, isActive: true },
  { date: "2026-01-26", sparksRead: 1, sessionMinutes: 8, isActive: true },
  { date: "2026-01-27", sparksRead: 2, sessionMinutes: 20, isActive: true },
  { date: "2026-01-28", sparksRead: 0, sessionMinutes: 0, isActive: false },
  { date: "2026-01-29", sparksRead: 1, sessionMinutes: 10, isActive: true },
  { date: "2026-01-30", sparksRead: 0, sessionMinutes: 0, isActive: false },
  { date: "2026-01-31", sparksRead: 2, sessionMinutes: 15, isActive: true },
  { date: "2026-02-01", sparksRead: 1, sessionMinutes: 12, isActive: true },
  { date: "2026-02-02", sparksRead: 3, sessionMinutes: 30, isActive: true },
  { date: "2026-02-03", sparksRead: 0, sessionMinutes: 0, isActive: false },
  { date: "2026-02-04", sparksRead: 1, sessionMinutes: 9, isActive: true },
  { date: "2026-02-05", sparksRead: 2, sessionMinutes: 22, isActive: true },
  { date: "2026-02-06", sparksRead: 0, sessionMinutes: 0, isActive: false },
  { date: "2026-02-07", sparksRead: 1, sessionMinutes: 14, isActive: true },
  { date: "2026-02-08", sparksRead: 2, sessionMinutes: 18, isActive: true },
  { date: "2026-02-09", sparksRead: 1, sessionMinutes: 10, isActive: true },
  { date: "2026-02-10", sparksRead: 0, sessionMinutes: 0, isActive: false },
  { date: "2026-02-11", sparksRead: 0, sessionMinutes: 0, isActive: false },
  { date: "2026-02-12", sparksRead: 2, sessionMinutes: 20, isActive: true },
  { date: "2026-02-13", sparksRead: 1, sessionMinutes: 11, isActive: true },
  { date: "2026-02-14", sparksRead: 3, sessionMinutes: 28, isActive: true },
  { date: "2026-02-15", sparksRead: 1, sessionMinutes: 15, isActive: true },
  { date: "2026-02-16", sparksRead: 2, sessionMinutes: 19, isActive: true },
];
