
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // إنشاء استمع لحالة المصادقة أولاً
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // استخدام دالة مساعدة للتحديث لمنع التحديثات غير الضرورية
        if (JSON.stringify(currentSession) !== JSON.stringify(session)) {
          console.log("Auth state changed:", event);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
        
        // تجنب التغيير المتكرر للمسار
        if (event === 'SIGNED_IN' && !session) {
          setTimeout(() => navigate('/'), 100);
        } else if (event === 'SIGNED_OUT' && session) {
          setTimeout(() => navigate('/auth'), 100);
        }

        // تأكد من أن حالة التحميل تتغير فقط مرة واحدة
        if (loading) {
          setLoading(false);
        }
      }
    );

    // جلب حالة الجلسة الأولية
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session:", initialSession ? "found" : "none");
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { session, user, loading };
}
