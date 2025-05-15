
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendEmailConfirmation: (email: string) => Promise<void>;
}

interface ResendConfirmationProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onResend: (email: string) => Promise<void>;
}

const ResendConfirmationDialog = ({ email, isOpen, onClose, onResend }: ResendConfirmationProps) => {
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResend(email);
    } finally {
      setIsResending(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>البريد الإلكتروني غير مؤكد</DialogTitle>
          <DialogDescription className="py-4">
            يرجى تأكيد بريدك الإلكتروني ({email}) للمتابعة. تحقق من بريدك الإلكتروني بما في ذلك مجلد البريد العشوائي.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button onClick={handleResend} disabled={isResending}>
            {isResending ? "جاري إعادة الإرسال..." : "إعادة إرسال التأكيد"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          // User has signed in, navigate to dashboard
          navigate('/');
        } else if (event === 'SIGNED_OUT') {
          // User has signed out, navigate to auth page
          navigate('/auth');
        }
      }
    );

    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) {
        throw error;
      }

      setUnconfirmedEmail(email);
      setShowConfirmDialog(true);

      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: "تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى تأكيد بريدك الإلكتروني للمتابعة.",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // التعامل مع خطأ البريد الإلكتروني غير المؤكد
        if (error.message === "Email not confirmed" || error.code === "email_not_confirmed") {
          setUnconfirmedEmail(email);
          setShowConfirmDialog(true);
          throw new Error("يجب تأكيد البريد الإلكتروني أولاً");
        }
        throw error;
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحبًا بك مرة أخرى في BitSight!",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast({
        title: "تم تسجيل الخروج",
        description: "نراك قريبًا!",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resendEmailConfirmation = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "تم إرسال رابط التأكيد",
        description: "تم إرسال رابط التأكيد مرة أخرى إلى بريدك الإلكتروني.",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في إرسال رابط التأكيد",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resendEmailConfirmation,
      }}
    >
      <ResendConfirmationDialog
        email={unconfirmedEmail}
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onResend={resendEmailConfirmation}
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
