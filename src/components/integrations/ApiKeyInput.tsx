
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, LoaderCircle } from "lucide-react";
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
  isLoading?: boolean;
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
  isLoading = false,
}: ApiKeyInputProps) => {
  const { t } = useLanguage();

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    onSave();
  };
  
  const handleTest = (e: React.MouseEvent) => {
    e.preventDefault();
    if (testConnection) {
      testConnection();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave();
      e.preventDefault();
    }
  };

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
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type="password"
          onKeyDown={handleKeyDown}
        />
        
        {secretField && onSecretChange && (
          <Input
            id={`${id}-secret`}
            value={secretValue || ""}
            onChange={(e) => onSecretChange(e.target.value)}
            placeholder={`Enter your ${label} Secret key`}
            type="password"
            onKeyDown={handleKeyDown}
          />
        )}
        
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            className="flex-1"
          >
            {t("حفظ", "Save")}
          </Button>
          
          {testConnection && (
            <Button
              variant="outline"
              onClick={handleTest}
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  {t("جاري الاختبار...", "Testing...")}
                </>
              ) : (
                t("اختبار الاتصال", "Test Connection")
              )}
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
