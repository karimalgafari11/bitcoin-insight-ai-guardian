
import { createContext, useContext, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useAuthState } from "@/hooks/useAuthState";
import { signUp, signIn, signOut, resendEmailConfirmation } from "@/services/authService";
import EmailConfirmationDialog from "@/components/EmailConfirmationDialog";
import AuthLoadingState from "@/components/AuthLoadingState";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendEmailConfirmation: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, user, loading } = useAuthState();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSignUp = async (email: string, password: string, username: string) => {
    try {
      setIsTransitioning(true);
      const result = await signUp(email, password, username);
      setUnconfirmedEmail(result.email);
      setShowConfirmDialog(true);
    } catch (error) {
      // Error is already handled in the service
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsTransitioning(true);
      await signIn(email, password);
    } catch (error: any) {
      if (error.message === "يجب تأكيد البريد الإلكتروني أولاً") {
        setUnconfirmedEmail(email);
        setShowConfirmDialog(true);
      }
      throw error;
    } finally {
      setIsTransitioning(false);
    }
  };

  const handleResendEmailConfirmation = async (email: string) => {
    await resendEmailConfirmation(email);
  };
  
  // عرض حالة التحميل عند تحميل المصادقة أو أثناء الانتقالات
  if (loading || isTransitioning) {
    return <AuthLoadingState />;
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: async () => {
          setIsTransitioning(true);
          try {
            await signOut();
          } finally {
            // حتى لو فشلت عملية الخروج، نريد إنهاء حالة الانتقال
            setTimeout(() => setIsTransitioning(false), 300);
          }
        },
        resendEmailConfirmation: handleResendEmailConfirmation,
      }}
    >
      <EmailConfirmationDialog
        email={unconfirmedEmail}
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onResend={handleResendEmailConfirmation}
      />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
