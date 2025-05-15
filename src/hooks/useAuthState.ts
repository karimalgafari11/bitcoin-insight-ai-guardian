
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
    let isInitialLoad = true;
    
    // استجلاب الجلسة الأولية أولاً
    const fetchInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data && data.session) {
        console.log("Initial session found");
        setSession(data.session);
        setUser(data.session.user);
      } else {
        console.log("No initial session");
        setSession(null);
        setUser(null);
      }
      // تأخير قليل قبل إنهاء التحميل لتجنب الوميض
      setTimeout(() => {
        setLoading(false);
        isInitialLoad = false;
      }, 300);
    };
    
    fetchInitialSession();
    
    // إنشاء مستمع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        // تجاهل التغييرات إذا كانت نفس الجلسة الحالية لتجنب التحديث غير الضروري
        const isSessionChanged = JSON.stringify(currentSession) !== JSON.stringify(session);
        
        if (isSessionChanged) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // لا نقوم بتوجيه المستخدم أثناء التحميل الأولي
          if (!isInitialLoad) {
            if (event === 'SIGNED_IN' && !session) {
              setTimeout(() => navigate('/'), 100);
            } else if (event === 'SIGNED_OUT' && session) {
              setTimeout(() => navigate('/auth'), 100);
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { session, user, loading };
}
