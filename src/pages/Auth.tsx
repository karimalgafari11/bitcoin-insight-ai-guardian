
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function Auth() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // If using Supabase authentication:
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: t("تم تسجيل الدخول بنجاح", "Signed in successfully"),
        description: t("مرحبًا بك مرة أخرى", "Welcome back"),
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error signing in:", error);
      
      // For demo purposes, allow any login
      signIn({ id: "demo-user", email });
      
      toast({
        title: t("تم تسجيل الدخول في وضع العرض التوضيحي", "Signed in with demo mode"),
        description: t("يمكنك استكشاف التطبيق باستخدام بيانات تجريبية", "You can explore the app using demo data"),
      });
      
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // If using Supabase authentication:
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/auth/callback"
        }
      });
      
      if (error) throw error;
      
      toast({
        title: t("تم إنشاء الحساب بنجاح", "Account created successfully"),
        description: t("يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك", "Please check your email to verify your account"),
      });
    } catch (error: any) {
      console.error("Error signing up:", error);
      
      // For demo purposes, create a demo account
      signIn({ id: "demo-user", email });
      
      toast({
        title: t("تم إنشاء حساب تجريبي", "Demo account created"),
        description: t("يمكنك استكشاف التطبيق باستخدام بيانات تجريبية", "You can explore the app using demo data"),
      });
      
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // If user is already signed in
  if (user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t("أنت مسجل الدخول بالفعل", "You are already signed in")}</CardTitle>
            <CardDescription>
              {t("أنت مسجل الدخول بالفعل كـ", "You are already signed in as")} {user.email || "user"}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between">
            <Button onClick={() => navigate("/dashboard")}>
              {t("العودة إلى لوحة التحكم", "Go to Dashboard")}
            </Button>
            <Button variant="outline" onClick={signOut}>
              {t("تسجيل الخروج", "Sign Out")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="mb-8">
        <img src="/placeholder.svg" alt="Logo" className="h-12 w-12 mx-auto" />
        <h1 className="text-2xl font-bold text-center mt-2">TradePro</h1>
      </div>
      
      <Card className="w-full max-w-md">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t("تسجيل الدخول", "Sign In")}</TabsTrigger>
            <TabsTrigger value="signup">{t("إنشاء حساب", "Sign Up")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardHeader>
                <CardTitle>{t("تسجيل الدخول", "Sign In")}</CardTitle>
                <CardDescription>
                  {t("أدخل بريدك الإلكتروني وكلمة المرور لتسجيل الدخول إلى حسابك.", "Enter your email and password to sign in to your account.")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("البريد الإلكتروني", "Email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t("كلمة المرور", "Password")}</Label>
                    <a href="#" className="text-xs text-primary hover:underline">
                      {t("نسيت كلمة المرور؟", "Forgot password?")}
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("جاري تسجيل الدخول...", "Signing in...")}
                    </>
                  ) : (
                    t("تسجيل الدخول", "Sign In")
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardHeader>
                <CardTitle>{t("إنشاء حساب", "Sign Up")}</CardTitle>
                <CardDescription>
                  {t("أدخل بريدك الإلكتروني وكلمة المرور لإنشاء حساب جديد.", "Enter your email and password to create a new account.")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t("البريد الإلكتروني", "Email")}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="example@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t("كلمة المرور", "Password")}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("جاري إنشاء الحساب...", "Creating account...")}
                    </>
                  ) : (
                    t("إنشاء حساب", "Sign Up")
                  )}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
      
      <p className="mt-4 text-sm text-muted-foreground">
        {t("بتسجيل الدخول، أنت توافق على", "By signing in, you agree to our")} 
        <a href="#" className="text-primary hover:underline">
          {t("شروط الخدمة", "Terms of Service")}
        </a>{" "}
        {t("و", "and")}{" "}
        <a href="#" className="text-primary hover:underline">
          {t("سياسة الخصوصية", "Privacy Policy")}
        </a>
      </p>
    </div>
  );
}
