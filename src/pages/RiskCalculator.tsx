
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CirclePercent, DollarSign, ShieldAlert, Calculator } from "lucide-react";

import AppSidebar from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/utils/cryptoUtils";

// تعريف شكل البيانات للنموذج
const riskCalculatorSchema = z.object({
  accountSize: z.coerce.number().min(1, { message: "يجب أن يكون رأس المال أكبر من الصفر" }),
  riskPercentage: z.coerce.number().min(0.1, { message: "الحد الأدنى للمخاطرة 0.1%" }).max(10, { message: "الحد الأقصى للمخاطرة 10%" }),
  entryPrice: z.coerce.number().min(0.0001, { message: "يجب أن يكون سعر الدخول أكبر من الصفر" }),
  stopLossPrice: z.coerce.number().min(0.0001, { message: "يجب أن يكون سعر وقف الخسارة أكبر من الصفر" }),
  direction: z.enum(["long", "short"], { required_error: "يرجى اختيار نوع الصفقة" }),
  leverage: z.coerce.number().min(1, { message: "الحد الأدنى للرافعة المالية هو 1x" }).max(125, { message: "الحد الأقصى للرافعة المالية هو 125x" }).default(1),
});

type RiskCalculatorFormValues = z.infer<typeof riskCalculatorSchema>;

const RiskCalculator = () => {
  const { t } = useLanguage();
  const [riskPercentageValue, setRiskPercentageValue] = useState(1);

  // إعداد نموذج React Hook Form
  const form = useForm<RiskCalculatorFormValues>({
    resolver: zodResolver(riskCalculatorSchema),
    defaultValues: {
      accountSize: 1000,
      riskPercentage: 1,
      entryPrice: 50000,
      stopLossPrice: 49500,
      direction: "long",
      leverage: 1,
    },
  });

  // استخراج قيم النموذج
  const formValues = form.watch();

  // حساب نتائج المخاطر
  const riskCalculations = useMemo(() => {
    const { accountSize, riskPercentage, entryPrice, stopLossPrice, direction, leverage } = formValues;
    
    // التحقق من وجود قيم صحيحة
    if (!accountSize || !entryPrice || !stopLossPrice || !riskPercentage) {
      return {
        riskAmount: 0,
        positionSize: 0,
        positionSizeCoins: 0,
        stopLossPoints: 0,
        leveragedPositionSize: 0,
      };
    }
    
    // حساب مبلغ المخاطرة بالدولار
    const riskAmount = (accountSize * riskPercentage) / 100;
    
    // حساب فرق النقاط بين سعر الدخول ووقف الخسارة
    let stopLossPoints = 0;
    if (direction === "long") {
      stopLossPoints = entryPrice - stopLossPrice;
    } else { // short
      stopLossPoints = stopLossPrice - entryPrice;
    }
    
    // تحقق من أن النقاط إيجابية وليست صفر لتجنب القسمة على صفر
    if (stopLossPoints <= 0) {
      return {
        riskAmount,
        positionSize: 0,
        positionSizeCoins: 0,
        stopLossPoints: 0,
        leveragedPositionSize: 0,
      };
    }
    
    // حساب حجم المركز
    const positionSize = riskAmount / (stopLossPoints / entryPrice);
    
    // حساب حجم المركز بالعملات
    const positionSizeCoins = positionSize / entryPrice;
    
    // حساب حجم المركز مع الرافعة المالية
    const leveragedPositionSize = positionSize * leverage;
    
    return {
      riskAmount,
      positionSize,
      positionSizeCoins,
      stopLossPoints,
      leveragedPositionSize,
    };
  }, [formValues]);

  // معالجة تقديم النموذج
  const onSubmit = (data: RiskCalculatorFormValues) => {
    const { riskAmount, positionSize } = riskCalculations;
    
    toast({
      title: "تم حساب المخاطر",
      description: `حجم المركز: ${formatCurrency(positionSize)}، المخاطرة: ${formatCurrency(riskAmount)}`,
    });
  };

  const handleSliderChange = (value: number[]) => {
    setRiskPercentageValue(value[0]);
    form.setValue("riskPercentage", value[0]);
  };

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">حاسبة المخاطر</h1>
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* بطاقة إدخال البيانات */}
            <Card className="border-zinc-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  <span>حاسبة إدارة المخاطر</span>
                </CardTitle>
                <CardDescription>
                  قم بإدخال بيانات الصفقة لحساب حجم المركز المناسب وإدارة المخاطر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* رأس المال */}
                      <FormField
                        control={form.control}
                        name="accountSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              رأس المال
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">$</span>
                                <Input type="number" step="0.01" min="1" className="pr-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* نسبة المخاطرة */}
                      <FormField
                        control={form.control}
                        name="riskPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <CirclePercent className="h-4 w-4" />
                              نسبة المخاطرة
                            </FormLabel>
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center justify-between">
                                <Slider
                                  value={[riskPercentageValue]}
                                  min={0.1}
                                  max={10}
                                  step={0.1}
                                  onValueChange={handleSliderChange}
                                />
                                <span className="text-sm font-medium w-14 text-center">
                                  {riskPercentageValue}%
                                </span>
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* نوع الصفقة */}
                      <FormField
                        control={form.control}
                        name="direction"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>نوع الصفقة</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-6"
                              >
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <RadioGroupItem value="long" id="long" />
                                  <label htmlFor="long" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-2">
                                    Long (شراء)
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <RadioGroupItem value="short" id="short" />
                                  <label htmlFor="short" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-2">
                                    Short (بيع)
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* الرافعة المالية */}
                      <FormField
                        control={form.control}
                        name="leverage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الرافعة المالية</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input type="number" step="1" min="1" max="125" {...field} />
                                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">x</span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* سعر الدخول */}
                      <FormField
                        control={form.control}
                        name="entryPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>سعر الدخول</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">$</span>
                                <Input type="number" step="0.0001" min="0.0001" className="pr-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* سعر وقف الخسارة */}
                      <FormField
                        control={form.control}
                        name="stopLossPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <ShieldAlert className="h-4 w-4" />
                              سعر وقف الخسارة
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">$</span>
                                <Input type="number" step="0.0001" min="0.0001" className="pr-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      حساب المخاطر
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* بطاقة نتائج الحساب */}
            <Card className="border-zinc-800">
              <CardHeader>
                <CardTitle>نتائج الحساب</CardTitle>
                <CardDescription>
                  نتائج حساب المخاطر وحجم المركز المناسب
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <TooltipProvider>
                    <div className="grid grid-cols-1 gap-4">
                      {/* مبلغ المخاطرة */}
                      <div className="flex justify-between items-center border-b pb-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">مبلغ المخاطرة:</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>المبلغ الذي ستخسره إذا ضرب وقف الخسارة</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="font-bold">{formatCurrency(riskCalculations.riskAmount)}</span>
                      </div>
                      
                      {/* حجم المركز */}
                      <div className="flex justify-between items-center border-b pb-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">حجم المركز:</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>القيمة الإجمالية للمركز بالدولار</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="font-bold">{formatCurrency(riskCalculations.positionSize)}</span>
                      </div>
                      
                      {/* حجم المركز بالعملات */}
                      <div className="flex justify-between items-center border-b pb-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <span className="font-medium">حجم المركز بالعملات:</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>عدد العملات التي يجب شراؤها/بيعها</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="font-bold">{riskCalculations.positionSizeCoins.toFixed(8)}</span>
                      </div>
                      
                      {/* المركز مع الرافعة المالية */}
                      <div className="flex justify-between items-center border-b pb-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <span className="font-medium">المركز مع الرافعة:</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>حجم المركز بعد تطبيق الرافعة المالية</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="font-bold">{formatCurrency(riskCalculations.leveragedPositionSize)}</span>
                      </div>
                      
                      {/* نقاط وقف الخسارة */}
                      <div className="flex justify-between items-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <ShieldAlert className="h-4 w-4" />
                              <span className="font-medium">نقاط وقف الخسارة:</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>الفرق بين سعر الدخول ووقف الخسارة</p>
                          </TooltipContent>
                        </Tooltip>
                        <span className="font-bold">{riskCalculations.stopLossPoints.toFixed(2)}</span>
                      </div>
                    </div>
                  </TooltipProvider>
                  
                  {/* قسم الملاحظات والإرشادات */}
                  <div className="mt-6 bg-muted p-3 rounded-lg text-sm">
                    <h3 className="font-semibold mb-2">ملاحظات الإدارة المالية:</h3>
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                      <li>لا تخاطر بأكثر من 1-2% من رأس مالك في الصفقة الواحدة</li>
                      <li>كن حذرًا عند استخدام الرافعة المالية العالية</li>
                      <li>تأكد من وضع وقف خسارة دائمًا لحماية رأس مالك</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;
