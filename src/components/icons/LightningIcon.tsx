interface LightningIconProps {
  className?: string;
  size?: number;
  filled?: boolean;
}

const LightningIcon = ({ className = "", size = 24, filled = false }: LightningIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M13 2L4.5 12.5H11.5L11 22L19.5 11.5H12.5L13 2Z" />
    </svg>
  );
};

export default LightningIcon;
