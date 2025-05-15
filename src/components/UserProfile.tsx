
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  
  if (!user) {
    return null;
  }

  // Get the first letter of the email to use in the avatar
  const nameInitial = user.email ? user.email[0].toUpperCase() : "U";
  
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{nameInitial}</AvatarFallback>
      </Avatar>
      <div className="hidden md:block">
        <p className="text-sm font-medium leading-none">{user.email}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={signOut} className="ml-2">
        {t("تسجيل الخروج", "Logout")}
      </Button>
    </div>
  );
};

export default UserProfile;
