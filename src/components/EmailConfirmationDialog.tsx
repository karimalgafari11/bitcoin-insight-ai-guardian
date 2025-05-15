
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResendConfirmationProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onResend: (email: string) => Promise<void>;
}

const EmailConfirmationDialog = ({ email, isOpen, onClose, onResend }: ResendConfirmationProps) => {
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

export default EmailConfirmationDialog;
