'use client';

interface TypingIndicatorProps {
  users: string[];
}

export default function TypingIndicator({ users }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0]} is typing`;
    } else if (users.length === 2) {
      return `${users[0]} and ${users[1]} are typing`;
    } else {
      return `${users[0]} and ${users.length - 1} others are typing`;
    }
  };

  return (
    <div className="flex items-center space-x-2 animate-fade-in">
      <div className="flex items-center space-x-1 px-4 py-2 bg-gray-100 rounded-lg">
        <span className="text-sm text-gray-600">{getTypingText()}</span>
        <div className="typing-dots flex space-x-1 ml-2">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}