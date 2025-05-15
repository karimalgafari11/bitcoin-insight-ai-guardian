
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Twitter, Instagram, Facebook } from "lucide-react";

interface SocialMediaTabProps {
  socialConnections: Record<string, boolean>;
  setSocialConnections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const SocialMediaTab = ({ socialConnections, setSocialConnections }: SocialMediaTabProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleConnectSocial = (platform: keyof typeof socialConnections) => {
    setSocialConnections((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));

    if (!socialConnections[platform]) {
      toast({
        title: t("تم الاتصال", "Connected"),
        description: t(
          `تم الاتصال بحسابك على ${platform}`,
          `Successfully connected to your ${platform} account`
        ),
      });
    } else {
      toast({
        title: t("تم قطع الاتصال", "Disconnected"),
        description: t(
          `تم قطع الاتصال بحسابك على ${platform}`,
          `Disconnected from your ${platform} account`
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("وسائل التواصل الاجتماعي", "Social Media")}
        </CardTitle>
        <CardDescription>
          {t(
            "اربط حسابات وسائل التواصل الاجتماعي الخاصة بك لمشاركة تحليلاتك وصفقاتك",
            "Connect your social media accounts to share your analysis and trades"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    <CardTitle className="text-base">Telegram</CardTitle>
                  </div>
                  <Switch
                    checked={socialConnections.telegram}
                    onCheckedChange={() => handleConnectSocial("telegram")}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">
                  {t(
                    "إرسال تنبيهات وإشارات التداول عبر بوت تليجرام",
                    "Send trading alerts and signals via Telegram bot"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base">Twitter</CardTitle>
                  </div>
                  <Switch
                    checked={socialConnections.twitter}
                    onCheckedChange={() => handleConnectSocial("twitter")}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">
                  {t(
                    "مشاركة تحليلاتك وصفقاتك على تويتر",
                    "Share your analysis and trades on Twitter"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-500" />
                    <CardTitle className="text-base">Instagram</CardTitle>
                  </div>
                  <Switch
                    checked={socialConnections.instagram}
                    onCheckedChange={() => handleConnectSocial("instagram")}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">
                  {t(
                    "مشاركة رسوم بيانية ونتائج التداول على انستغرام",
                    "Share charts and trading results on Instagram"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Facebook className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">Facebook</CardTitle>
                  </div>
                  <Switch
                    checked={socialConnections.facebook}
                    onCheckedChange={() => handleConnectSocial("facebook")}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-xs text-muted-foreground">
                  {t(
                    "مشاركة تحليلاتك وصفقاتك على فيسبوك",
                    "Share your analysis and trades on Facebook"
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t px-6 py-4">
        <p className="text-xs text-muted-foreground">
          {t(
            "نحن لا نشارك بياناتك مع أطراف ثالثة دون موافقتك",
            "We do not share your data with third parties without your consent"
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export { SocialMediaTab };
