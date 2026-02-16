// ---------------------------------------------------------------------------
// Topic data for the Explore knowledge graph
// ---------------------------------------------------------------------------

export interface Topic {
  id: string;
  name: string;
  sparkCount: number;
  connections: string[]; // IDs of related topics
  description: string;
}

export const mockTopics: Topic[] = [
  {
    id: "topic-neuroscience",
    name: "Neuroscience",
    sparkCount: 24,
    connections: ["topic-psychology", "topic-biology", "topic-philosophy"],
    description:
      "The study of the nervous system, from molecular mechanisms of individual neurons to the emergent properties of consciousness and cognition.",
  },
  {
    id: "topic-astronomy",
    name: "Astronomy",
    sparkCount: 18,
    connections: ["topic-physics", "topic-mathematics", "topic-technology"],
    description:
      "The observation and theoretical understanding of celestial objects, space, and the universe as a whole, from planetary science to cosmology.",
  },
  {
    id: "topic-culture",
    name: "Culture",
    sparkCount: 15,
    connections: ["topic-history", "topic-philosophy", "topic-psychology"],
    description:
      "The shared beliefs, practices, and artifacts that define human societies, including language, art, media, and the evolution of social norms.",
  },
  {
    id: "topic-biology",
    name: "Biology",
    sparkCount: 22,
    connections: [
      "topic-neuroscience",
      "topic-chemistry",
      "topic-psychology",
    ],
    description:
      "The science of life, from molecular genetics and cellular processes to ecosystems and the evolutionary history of species.",
  },
  {
    id: "topic-mathematics",
    name: "Mathematics",
    sparkCount: 20,
    connections: ["topic-physics", "topic-astronomy", "topic-technology"],
    description:
      "The abstract science of number, quantity, and space, serving as the foundational language for all quantitative disciplines.",
  },
  {
    id: "topic-history",
    name: "History",
    sparkCount: 16,
    connections: ["topic-culture", "topic-philosophy", "topic-technology"],
    description:
      "The study of past events, civilizations, and human experiences, revealing the patterns and forces that shaped the present world.",
  },
  {
    id: "topic-philosophy",
    name: "Philosophy",
    sparkCount: 14,
    connections: [
      "topic-neuroscience",
      "topic-psychology",
      "topic-culture",
      "topic-history",
      "topic-mathematics",
    ],
    description:
      "The pursuit of fundamental truths about existence, knowledge, ethics, and the nature of mind through reason and critical inquiry.",
  },
  {
    id: "topic-technology",
    name: "Technology",
    sparkCount: 19,
    connections: [
      "topic-mathematics",
      "topic-physics",
      "topic-history",
      "topic-astronomy",
    ],
    description:
      "The application of scientific knowledge to practical problems, encompassing computing, engineering, communications, and emerging fields like quantum information.",
  },
  {
    id: "topic-psychology",
    name: "Psychology",
    sparkCount: 21,
    connections: [
      "topic-neuroscience",
      "topic-biology",
      "topic-philosophy",
      "topic-culture",
    ],
    description:
      "The scientific study of mind and behavior, exploring perception, emotion, motivation, personality, and the social dynamics that shape human experience.",
  },
  {
    id: "topic-physics",
    name: "Physics",
    sparkCount: 17,
    connections: [
      "topic-mathematics",
      "topic-astronomy",
      "topic-chemistry",
      "topic-technology",
    ],
    description:
      "The fundamental science of matter, energy, and their interactions, from subatomic particles to the large-scale structure of the universe.",
  },
  {
    id: "topic-chemistry",
    name: "Chemistry",
    sparkCount: 13,
    connections: ["topic-biology", "topic-physics"],
    description:
      "The science of substances, their properties, reactions, and transformations, bridging physics at the atomic level and biology at the molecular level.",
  },
];
