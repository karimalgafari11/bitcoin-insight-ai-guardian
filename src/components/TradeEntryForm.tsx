
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TradeFormData } from "@/types/trade";

// تعريف مخطط التحقق باستخدام Zod
const tradeFormSchema = z.object({
  symbol: z.string().min(1, { message: "الرجاء إدخال الزوج" }),
  entry_date: z.string().min(1, { message: "الرجاء إدخال تاريخ الدخول" }),
  exit_date: z.string().optional(),
  entry_price: z.coerce.number().positive({ message: "الرجاء إدخال سعر دخول صحيح" }),
  exit_price: z.coerce.number().positive({ message: "الرجاء إدخال سعر خروج صحيح" }).optional(),
  stop_loss: z.coerce.number().positive({ message: "الرجاء إدخال قيمة وقف خسارة صحيحة" }).optional(),
  take_profit: z.coerce.number().positive({ message: "الرجاء إدخال قيمة هدف ربح صحيحة" }).optional(),
  size: z.coerce.number().positive({ message: "الرجاء إدخال حجم صفقة صحيح" }),
  direction: z.enum(["long", "short"], { required_error: "الرجاء تحديد اتجاه الصفقة" }),
  status: z.enum(["open", "closed", "canceled"], { required_error: "الرجاء تحديد حالة الصفقة" }),
  strategy: z.string().optional(),
  setup_type: z.string().optional(),
  timeframe: z.string().optional(),
  notes: z.string().optional(),
});

interface TradeEntryFormProps {
  initialData?: TradeFormData;
  onSuccess?: () => void;
  isEditing?: boolean;
  tradeId?: string;
}

export const TradeEntryForm = ({
  initialData,
  onSuccess,
  isEditing = false,
  tradeId,
}: TradeEntryFormProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // تهيئة نموذج React Hook Form مع Zod للتحقق
  const form = useForm<z.infer<typeof tradeFormSchema>>({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: initialData || {
      symbol: "BTC/USDT",
      entry_date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      entry_price: undefined,
      size: undefined,
      direction: "long",
      status: "open",
    },
  });

  // معالجة تقديم النموذج
  const onSubmit = async (data: z.infer<typeof tradeFormSchema>) => {
    try {
      setIsSubmitting(true);

      // تحويل التواريخ من سلاسل نصية إلى كائنات Date
      const formattedData = {
        ...data
      };

      if (isEditing && tradeId) {
        // تحديث صفقة موجودة
        const { error } = await supabase
          .from("trading_entries")
          .update(formattedData)
          .eq("id", tradeId);

        if (error) throw error;
        toast({
          title: t("تم تحديث الصفقة بنجاح", "Trade updated successfully"),
        });
      } else {
        // إضافة صفقة جديدة
        const { error } = await supabase
          .from("trading_entries")
          .insert([formattedData]);

        if (error) throw error;
        toast({
          title: t("تمت إضافة الصفقة بنجاح", "Trade added successfully"),
        });
      }

      // استدعاء دالة النجاح إذا تم تمريرها
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/trading-journal");
      }
    } catch (error: any) {
      console.error("Error submitting trade:", error);
      toast({
        title: t("حدث خطأ", "Error occurred"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeframes = [
    "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* زوج العملة */}
          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("زوج العملة", "Symbol")}</FormLabel>
                <FormControl>
                  <Input placeholder="BTC/USDT" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* الإطار الزمني */}
          <FormField
            control={form.control}
            name="timeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("الإطار الزمني", "Timeframe")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("اختر الإطار الزمني", "Select timeframe")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timeframes.map((tf) => (
                      <SelectItem key={tf} value={tf}>
                        {tf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* تاريخ الدخول */}
          <FormField
            control={form.control}
            name="entry_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("تاريخ الدخول", "Entry Date")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-right font-normal"
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span className="text-muted-foreground">{t("اختر التاريخ", "Select date")}</span>
                        )}
                        <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd'T'HH:mm") : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* تاريخ الخروج (اختياري) */}
          <FormField
            control={form.control}
            name="exit_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("تاريخ الخروج (اختياري)", "Exit Date (Optional)")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full pl-3 text-right font-normal"
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span className="text-muted-foreground">{t("اختر التاريخ", "Select date")}</span>
                        )}
                        <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd'T'HH:mm") : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* سعر الدخول */}
          <FormField
            control={form.control}
            name="entry_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("سعر الدخول", "Entry Price")}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* سعر الخروج (اختياري) */}
          <FormField
            control={form.control}
            name="exit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("سعر الخروج (اختياري)", "Exit Price (Optional)")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* وقف الخسارة (اختياري) */}
          <FormField
            control={form.control}
            name="stop_loss"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("وقف الخسارة (اختياري)", "Stop Loss (Optional)")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* هدف الربح (اختياري) */}
          <FormField
            control={form.control}
            name="take_profit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("هدف الربح (اختياري)", "Take Profit (Optional)")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* حجم الصفقة */}
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("حجم الصفقة", "Position Size")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* اتجاه الصفقة */}
          <FormField
            control={form.control}
            name="direction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("اتجاه الصفقة", "Direction")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("اختر اتجاه الصفقة", "Select direction")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="long">{t("شراء", "Long")}</SelectItem>
                    <SelectItem value="short">{t("بيع", "Short")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* حالة الصفقة */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("حالة الصفقة", "Status")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("اختر حالة الصفقة", "Select status")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="open">{t("مفتوحة", "Open")}</SelectItem>
                    <SelectItem value="closed">{t("مغلقة", "Closed")}</SelectItem>
                    <SelectItem value="canceled">{t("ملغاة", "Canceled")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* الاستراتيجية (اختياري) */}
          <FormField
            control={form.control}
            name="strategy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("الاستراتيجية (اختياري)", "Strategy (Optional)")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("استراتيجية التداول", "Trading strategy")} {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* نوع الإعداد (اختياري) */}
          <FormField
            control={form.control}
            name="setup_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("نوع الإعداد (اختياري)", "Setup Type (Optional)")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("نوع الإعداد", "Setup type")} {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* ملاحظات (اختياري) */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("ملاحظات (اختياري)", "Notes (Optional)")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("أضف ملاحظاتك حول الصفقة هنا", "Add your trade notes here")}
                  className="min-h-[120px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? t("جارٍ الحفظ...", "Saving...") : isEditing ? t("تحديث الصفقة", "Update Trade") : t("إضافة الصفقة", "Add Trade")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/trading-journal")}
          >
            {t("إلغاء", "Cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
