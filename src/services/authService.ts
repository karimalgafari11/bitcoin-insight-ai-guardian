
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export async function signUp(email: string, password: string, username: string) {
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

    toast({
      title: "تم إنشاء الحساب بنجاح",
      description: "تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى تأكيد بريدك الإلكتروني للمتابعة.",
    });
    
    return { email, success: true };
  } catch (error: any) {
    toast({
      title: "خطأ في إنشاء الحساب",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // التعامل مع خطأ البريد الإلكتروني غير المؤكد
      if (error.message === "Email not confirmed" || error.code === "email_not_confirmed") {
        throw new Error("يجب تأكيد البريد الإلكتروني أولاً");
      }
      throw error;
    }

    toast({
      title: "تم تسجيل الدخول بنجاح",
      description: "مرحبًا بك مرة أخرى في BitSight!",
    });
    
    return { success: true };
  } catch (error: any) {
    toast({
      title: "خطأ في تسجيل الدخول",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريبًا!",
    });
    return { success: true };
  } catch (error: any) {
    toast({
      title: "خطأ في تسجيل الخروج",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
}

export async function resendEmailConfirmation(email: string) {
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
    
    return { success: true };
  } catch (error: any) {
    toast({
      title: "خطأ في إرسال رابط التأكيد",
      description: error.message,
      variant: "destructive",
    });
    throw error;
  }
}
