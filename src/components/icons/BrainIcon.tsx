import { motion } from "framer-motion";

interface BrainIconProps {
  filled?: boolean;
  className?: string;
  size?: number;
}

const BrainIcon = ({ filled = false, className = "", size = 24 }: BrainIconProps) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      animate={filled ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      {/* Left hemisphere */}
      <path d="M12 2C9.5 2 7.5 3.5 7 5.5C5.5 5.5 4 7 4 9C3.5 9.5 3 10.5 3 12C3 13.5 3.5 14.5 4.5 15.5C4 16.5 4.5 18 5.5 19C6.5 20 8 20.5 9.5 20C10.5 21 11 21.5 12 22" />
      {/* Right hemisphere */}
      <path d="M12 2C14.5 2 16.5 3.5 17 5.5C18.5 5.5 20 7 20 9C20.5 9.5 21 10.5 21 12C21 13.5 20.5 14.5 19.5 15.5C20 16.5 19.5 18 18.5 19C17.5 20 16 20.5 14.5 20C13.5 21 13 21.5 12 22" />
      {/* Central fissure */}
      <path d="M12 2V22" />
      {/* Left folds */}
      <path d="M5 10C7 10 8.5 11 9 12" />
      <path d="M5.5 15C7 14.5 8 14 9 14.5" />
      {/* Right folds */}
      <path d="M19 10C17 10 15.5 11 15 12" />
      <path d="M18.5 15C17 14.5 16 14 15 14.5" />
    </motion.svg>
  );
};

export default BrainIcon;
