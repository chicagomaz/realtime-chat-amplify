'use client';

interface PresenceBadgeProps {
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  lastSeen?: string;
}

export default function PresenceBadge({ 
  isOnline, 
  size = 'md', 
  showText = false,
  lastSeen 
}: PresenceBadgeProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const formatLastSeen = () => {
    if (!lastSeen) return 'Last seen recently';
    
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (showText) {
    return (
      <div className="flex items-center space-x-2">
        <div
          className={`${sizeClasses[size]} rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />
        <span className="text-sm text-gray-600">
          {isOnline ? 'Online' : formatLastSeen()}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full border-2 border-white ${
        isOnline ? 'bg-green-500' : 'bg-gray-400'
      }`}
      title={isOnline ? 'Online' : formatLastSeen()}
    />
  );
}