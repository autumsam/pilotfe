
import React from 'react';

interface WelcomeHeaderProps {
  username?: string;
  role?: "admin" | "user";
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ username, role = "user" }) => {
  const displayName = username || (role === "admin" ? "Admin" : "User");
  const currentTime = new Date();
  const hour = currentTime.getHours();
  
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17) {
    greeting = "Good evening";
  }

  return (
    <div className="px-2">
      <h1 className="text-2xl sm:text-3xl font-bold">
        {greeting}, {displayName}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mt-1">
        {role === "admin" 
          ? "Welcome to your admin dashboard" 
          : "Welcome to your content dashboard"}
      </p>
    </div>
  );
};

export default WelcomeHeader;
