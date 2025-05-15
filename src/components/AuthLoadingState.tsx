
import React from 'react';

const AuthLoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="rounded-full bg-primary h-12 w-12 opacity-75"></div>
          <div className="rounded-full bg-primary h-12 w-12 opacity-50"></div>
          <div className="rounded-full bg-primary h-12 w-12 opacity-25"></div>
        </div>
        <p className="text-muted-foreground">جاري تحميل BitSight...</p>
      </div>
    </div>
  );
};

export default AuthLoadingState;
