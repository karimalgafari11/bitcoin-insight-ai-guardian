
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const AccountSettings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card className="border-zinc-800 mb-6">
      <CardHeader>
        <CardTitle>{t("إعدادات الحساب", "Account Settings")}</CardTitle>
        <CardDescription>
          {t("إدارة معلومات حسابك", "Manage your account information")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user ? (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">{t("المعلومات الأساسية", "Basic Information")}</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("البريد الإلكتروني", "Email")}</Label>
                  <Input id="email" value={user.email} readOnly disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-id">{t("معرف المستخدم", "User ID")}</Label>
                  <Input id="user-id" value={user.id} readOnly disabled className="bg-muted text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">{t("الأمان", "Security")}</h3>
              <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>{t("تغيير كلمة المرور", "Change Password")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t("قم بتحديث كلمة المرور الخاصة بك بانتظام للحفاظ على أمان حسابك", 
                      "Update your password regularly to keep your account secure")}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  {t("تغيير", "Change")}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <p>{t("يرجى تسجيل الدخول لعرض إعدادات الحساب.", "Please sign in to view account settings.")}</p>
            <Button className="mt-2" onClick={() => navigate('/auth')}>
              {t("تسجيل الدخول", "Sign In")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
