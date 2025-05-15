
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "./ui/skeleton";

interface UserProfileData {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
    );
  }

  // Get user initials for avatar
  const nameInitial = profileData?.username 
    ? profileData.username[0].toUpperCase()
    : user.email 
      ? user.email[0].toUpperCase() 
      : "U";
  
  // Get display name (username, full name, or email)
  const displayName = profileData?.username || profileData?.full_name || user.email;
  
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        {profileData?.avatar_url && (
          <AvatarImage src={profileData.avatar_url} alt={displayName || ""} />
        )}
        <AvatarFallback>{nameInitial}</AvatarFallback>
      </Avatar>
      <div className="hidden md:block">
        <p className="text-sm font-medium leading-none">{displayName}</p>
        {profileData?.username && user.email && profileData.username !== user.email && (
          <p className="text-xs text-muted-foreground">{user.email}</p>
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={signOut} className="ml-2">
        {t("تسجيل الخروج", "Logout")}
      </Button>
    </div>
  );
};

export default UserProfile;
