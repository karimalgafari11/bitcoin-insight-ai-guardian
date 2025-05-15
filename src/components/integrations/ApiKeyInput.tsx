
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ApiKeyInputProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  placeholder?: string;
  secretField?: boolean;
  secretValue?: string;
  onSecretChange?: (value: string) => void;
  testConnection?: () => void;
  isConnected?: boolean;
}

const ApiKeyInput = ({
  id,
  label,
  icon,
  value,
  onChange,
  onSave,
  placeholder = "Enter your API key",
  secretField = false,
  secretValue = "",
  onSecretChange,
  testConnection,
  isConnected,
}: ApiKeyInputProps) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="text-sm font-medium flex items-center">
          {icon}
          {label}
        </label>
        <Lock className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type="password"
        />
        
        {secretField && onSecretChange && (
          <Input
            id={`${id}-secret`}
            value={secretValue}
            onChange={(e) => onSecretChange(e.target.value)}
            placeholder={`Enter your ${label} Secret key`}
            type="password"
          />
        )}
        
        <div className="flex gap-2">
          <Button
            onClick={onSave}
            className="flex-1"
          >
            {t("حفظ", "Save")}
          </Button>
          
          {testConnection && (
            <Button
              variant="outline"
              onClick={testConnection}
              className="flex-1"
            >
              {t("اختبار الاتصال", "Test Connection")}
            </Button>
          )}
        </div>
      </div>
      
      {isConnected && (
        <p className="text-xs text-green-500 mt-1">
          {t("تم الاتصال بنجاح", "Connected successfully")}
        </p>
      )}
    </div>
  );
};

export default ApiKeyInput;
