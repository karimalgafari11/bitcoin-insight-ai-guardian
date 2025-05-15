
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

  const handleSignUp = async (email: string, password: string, username: string) => {
    try {
      const result = await signUp(email, password, username);
      setUnconfirmedEmail(result.email);
      setShowConfirmDialog(true);
    } catch (error) {
      // Error is already handled in the service
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn(email, password);
    } catch (error: any) {
      if (error.message === "يجب تأكيد البريد الإلكتروني أولاً") {
        setUnconfirmedEmail(email);
        setShowConfirmDialog(true);
      }
      throw error;
    }
  };

  const handleResendEmailConfirmation = async (email: string) => {
    await resendEmailConfirmation(email);
  };
  
  if (loading) {
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
        // Fix here: The signOut function from the service returns Promise<{ success: boolean }>,
        // but the type definition expects Promise<void>. We need to adapt this to match.
        signOut: async () => {
          await signOut();
          // By not returning anything, this function now returns Promise<void> as expected
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
