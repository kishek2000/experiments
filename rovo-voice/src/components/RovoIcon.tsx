interface RovoIconProps {
  size?: number;
  color?: string;
  withBackground?: boolean;
}

/**
 * Atlassian Rovo logo - two interlocking angular shapes
 */
export function RovoIcon({ size = 24, color = "white", withBackground = false }: RovoIconProps) {
  if (withBackground) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="7" fill="#1868DB"/>
        {/* Upper-left chevron */}
        <path d="M8 8L8 16L15 12L8 8Z" fill={color}/>
        <path d="M15 12L15 20L8 16L15 12Z" fill={color} fillOpacity="0.6"/>
        {/* Lower-right chevron */}
        <path d="M24 24L24 16L17 20L24 24Z" fill={color}/>
        <path d="M17 20L17 12L24 16L17 20Z" fill={color} fillOpacity="0.6"/>
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Upper-left chevron */}
      <path d="M5 5L5 12L11 8.5L5 5Z" fill={color}/>
      <path d="M11 8.5L11 15.5L5 12L11 8.5Z" fill={color} fillOpacity="0.6"/>
      {/* Lower-right chevron */}
      <path d="M19 19L19 12L13 15.5L19 19Z" fill={color}/>
      <path d="M13 15.5L13 8.5L19 12L13 15.5Z" fill={color} fillOpacity="0.6"/>
    </svg>
  );
}

