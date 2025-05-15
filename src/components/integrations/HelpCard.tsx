
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HelpCard = () => {
  const { t } = useLanguage();

  return (
    <Card className="bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">
          {t("هل تحتاج إلى مساعدة مع التكاملات؟", "Need help with integrations?")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          {t(
            "استكشف دليل التكاملات الخاص بنا أو اتصل بفريق الدعم للحصول على مساعدة في إعداد تكاملات المنصة الخاصة بك.",
            "Explore our integration guide or contact our support team for help setting up your platform integrations."
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            {t("دليل التكاملات", "Integration Guide")}
          </Button>
          <Button variant="secondary">
            {t("اتصل بالدعم", "Contact Support")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpCard;
