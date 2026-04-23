interface IconProps {
  name: string;
  className?: string;
}

export const Icon = ({ name, className = '' }: IconProps) => (
  <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
    {name}
  </span>
);
