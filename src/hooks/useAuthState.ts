
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    let mounted = true;
    
    // أولاً، قم بإعداد مستمع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        if (!mounted) return;
        
        // تجنب التحديثات غير الضرورية عن طريق التحقق من تغير الجلسة فعلياً
        const isSessionChanged = JSON.stringify(currentSession) !== JSON.stringify(session);
        
        if (isSessionChanged) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (event === 'SIGNED_IN') {
            toast({
              title: "تم تسجيل الدخول بنجاح",
              description: "مرحباً بك في منصة التداول الخاصة بك",
            });
            setTimeout(() => navigate('/'), 300);
          } else if (event === 'SIGNED_OUT') {
            toast({
              title: "تم تسجيل الخروج",
              description: "نتمنى أن نراك قريباً",
            });
            setTimeout(() => navigate('/auth'), 300);
          }
        }
      }
    );

    // ثم، جلب بيانات الجلسة الأولية
    const fetchInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error fetching session:", error);
          throw error;
        }
        
        if (mounted) {
          if (data && data.session) {
            console.log("Initial session found");
            setSession(data.session);
            setUser(data.session.user);
          } else {
            console.log("No initial session");
            setSession(null);
            setUser(null);
          }
          
          // تأخير قليل لتجنب الوميض أثناء التحميل
          setTimeout(() => {
            if (mounted) setLoading(false);
          }, 300);
        }
      } catch (err) {
        console.error("Session fetch error:", err);
        if (mounted) setLoading(false);
      }
    };
    
    fetchInitialSession();

    // تنظيف عند إلغاء تحميل المكون
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, loading };
}
