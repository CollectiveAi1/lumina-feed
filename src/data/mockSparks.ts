import spark1 from "@/assets/spark-1.jpg";
import spark2 from "@/assets/spark-2.jpg";
import spark3 from "@/assets/spark-3.jpg";
import spark4 from "@/assets/spark-4.jpg";
import spark5 from "@/assets/spark-5.jpg";
import spark6 from "@/assets/spark-6.jpg";

export interface Spark {
  id: string;
  title: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
}

export const mockSparks: Spark[] = [
  {
    id: "1",
    title: "How Your Brain Rewires Itself While You Sleep",
    author: "Dr. Elena Marsh",
    category: "Neuroscience",
    readTime: "4 min",
    image: spark1,
  },
  {
    id: "2",
    title: "The Lost Art of Deep Reading in a Distracted World",
    author: "James Collin",
    category: "Culture",
    readTime: "6 min",
    image: spark2,
  },
  {
    id: "3",
    title: "Why Geometry Is the Language of the Universe",
    author: "Prof. Anika Rao",
    category: "Mathematics",
    readTime: "5 min",
    image: spark3,
  },
  {
    id: "4",
    title: "What the James Webb Telescope Reveals About Time",
    author: "Samir Patel",
    category: "Astronomy",
    readTime: "7 min",
    image: spark4,
  },
  {
    id: "5",
    title: "The Invisible World Living on Your Skin",
    author: "Dr. Li Wei",
    category: "Biology",
    readTime: "3 min",
    image: spark5,
  },
  {
    id: "6",
    title: "Ancient Maps and the Stories They Were Afraid to Tell",
    author: "Rosa Vázquez",
    category: "History",
    readTime: "8 min",
    image: spark6,
  },
];
