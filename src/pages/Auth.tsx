
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// تعريف مخططات التحقق
const loginSchema = z.object({
  email: z.string().email(
    { message: "يرجى إدخال بريد إلكتروني صحيح" }
  ),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل" }),
});

const registerSchema = z.object({
  username: z.string().min(3, { message: "اسم المستخدم يجب أن يتكون من 3 أحرف على الأقل" }),
  email: z.string().email({ message: "يرجى إدخال بريد إلكتروني صحيح" }),
  password: z.string().min(6, { message: "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل" }),
  confirmPassword: z.string().min(6, { message: "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Auth = () => {
  const { t } = useLanguage();
  const [authError, setAuthError] = useState<string | null>(null);
  
  // نماذج React Hook Form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const { signIn, signUp } = useAuth();

  const handleLogin = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      await signIn(values.email, values.password);
    } catch (error: any) {
      console.error("Login error:", error);
      setAuthError(error.message);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setAuthError(null);
    try {
      await signUp(values.email, values.password, values.username);
    } catch (error: any) {
      console.error("Registration error:", error);
      setAuthError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">BitSight</h1>
          <LanguageSwitcher />
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">{t("تسجيل الدخول", "Login")}</TabsTrigger>
            <TabsTrigger value="register">{t("إنشاء حساب", "Register")}</TabsTrigger>
          </TabsList>
          
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {authError}
              </AlertDescription>
            </Alert>
          )}
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t("تسجيل الدخول", "Login")}</CardTitle>
                <CardDescription>
                  {t("قم بتسجيل الدخول للوصول إلى لوحة التحكم الخاصة بك", "Sign in to access your dashboard")}
                </CardDescription>
              </CardHeader>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("البريد الإلكتروني", "Email")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="name@example.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("كلمة المرور", "Password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginForm.formState.isSubmitting}
                    >
                      {loginForm.formState.isSubmitting
                        ? t("جاري تسجيل الدخول...", "Logging in...")
                        : t("تسجيل الدخول", "Login")
                      }
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>{t("إنشاء حساب", "Register")}</CardTitle>
                <CardDescription>
                  {t("أنشئ حسابك للوصول إلى تحليلات العملات الرقمية", "Create your account to access crypto analytics")}
                </CardDescription>
              </CardHeader>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("اسم المستخدم", "Username")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("البريد الإلكتروني", "Email")}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="name@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("كلمة المرور", "Password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("تأكيد كلمة المرور", "Confirm Password")}</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator className="my-2" />
                    
                    <p className="text-sm text-muted-foreground">
                      {t(
                        "بإنشاء حساب، فإنك توافق على شروط الخدمة وسياسة الخصوصية الخاصة بنا",
                        "By creating an account, you agree to our Terms of Service and Privacy Policy"
                      )}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={registerForm.formState.isSubmitting}
                    >
                      {registerForm.formState.isSubmitting
                        ? t("جاري إنشاء الحساب...", "Creating account...")
                        : t("إنشاء حساب", "Register")
                      }
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
