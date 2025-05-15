import { CategoryProps } from "@/components/EducationCategory";

export const educationCategories: CategoryProps[] = [
  {
    id: "basics",
    title: "أساسيات البيتكوين",
    titleEn: "Bitcoin Basics",
    description: "تعلم المفاهيم الأساسية للبيتكوين وكيفية عمله",
    descriptionEn: "Learn the fundamental concepts of Bitcoin and how it works",
    iconType: "bookText",
    lessons: [
      {
        id: "what-is-bitcoin",
        title: "ما هو البيتكوين؟",
        titleEn: "What is Bitcoin?",
        description: "مقدمة شاملة للبيتكوين وتكنولوجيا البلوكتشين",
        descriptionEn: "A comprehensive introduction to Bitcoin and blockchain technology",
        content: `
          <p>البيتكوين هو عملة رقمية لا مركزية تم إنشاؤها في عام 2009 من قبل شخص أو مجموعة تحت اسم ساتوشي ناكاموتو. على عكس العملات التقليدية، لا يتم التحكم في البيتكوين من قبل أي حكومة أو مؤسسة مالية.</p>
          <p>النقاط الرئيسية:</p>
          <ul>
            <li>عملة رقمية لا مركزية</li>
            <li>تعمل على تقنية سلسلة الكتل (البلوكتشين)</li>
            <li>محدودة العرض بـ 21 مليون وحدة</li>
            <li>تستخدم التشفير لتأمين المعاملات</li>
          </ul>
          <p>يتم تأمين شبكة البيتكوين من خلال عملية تسمى "التعدين" حيث تستخدم أجهزة الكمبيوتر القوة الحسابية لحل مشكلات رياضية معقدة للتحقق من المعاملات وإضافتها إلى سلسلة الكتل.</p>
        `,
        contentEn: `
          <p>Bitcoin is a decentralized digital currency created in 2009 by an individual or group using the pseudonym Satoshi Nakamoto. Unlike traditional currencies, Bitcoin is not controlled by any government or financial institution.</p>
          <p>Key points:</p>
          <ul>
            <li>Decentralized digital currency</li>
            <li>Operates on blockchain technology</li>
            <li>Limited supply of 21 million units</li>
            <li>Uses cryptography to secure transactions</li>
          </ul>
          <p>The Bitcoin network is secured through a process called "mining" where computers use computational power to solve complex mathematical problems to verify transactions and add them to the blockchain.</p>
        `
      },
      {
        id: "blockchain-explained",
        title: "شرح البلوكتشين",
        titleEn: "Blockchain Explained",
        description: "فهم تكنولوجيا البلوكتشين التي تدعم البيتكوين",
        descriptionEn: "Understanding the blockchain technology that powers Bitcoin",
        content: `
          <p>البلوكتشين هي تقنية دفتر الأستاذ الموزع التي تسمح بتسجيل المعاملات بطريقة آمنة وشفافة ولا مركزية. يتكون البلوكتشين من سلسلة من "الكتل" التي تحتوي على بيانات المعاملات.</p>
          <p>خصائص البلوكتشين:</p>
          <ul>
            <li>لا مركزية: لا توجد سلطة مركزية</li>
            <li>الشفافية: جميع المعاملات مرئية للجميع</li>
            <li>عدم قابلية التغيير: لا يمكن تغيير البيانات بمجرد تسجيلها</li>
            <li>الأمان: مؤمن بالتشفير</li>
          </ul>
          <p>كل كتلة في سلسلة البيتكوين تحتوي على هاش الكتلة السابقة، مما يربط الكتل معًا في سلسلة آمنة. هذا يجعل من المستحيل عمليًا تغيير المعاملات السابقة دون تغيير جميع الكتل اللاحقة.</p>
        `,
        contentEn: `
          <p>Blockchain is a distributed ledger technology that allows transactions to be recorded in a secure, transparent, and decentralized way. A blockchain consists of a chain of "blocks" that contain transaction data.</p>
          <p>Blockchain characteristics:</p>
          <ul>
            <li>Decentralization: No central authority</li>
            <li>Transparency: All transactions are visible to everyone</li>
            <li>Immutability: Data cannot be changed once recorded</li>
            <li>Security: Secured by cryptography</li>
          </ul>
          <p>Each block in the Bitcoin chain contains the hash of the previous block, linking the blocks together in a secure chain. This makes it practically impossible to alter previous transactions without changing all subsequent blocks.</p>
        `
      }
    ]
  },
  {
    id: "technical-analysis",
    title: "التحليل الفني",
    titleEn: "Technical Analysis",
    description: "تعلم كيفية تحليل الرسوم البيانية واكتشاف الأنماط",
    descriptionEn: "Learn how to analyze charts and identify patterns",
    iconType: "lineChart",
    lessons: [
      {
        id: "chart-basics",
        title: "أساسيات الرسوم البيانية",
        titleEn: "Chart Basics",
        description: "فهم أنواع الرسوم البيانية المختلفة وكيفية قراءتها",
        descriptionEn: "Understanding different chart types and how to read them",
        content: `
          <p>الرسوم البيانية هي الأدوات الأساسية المستخدمة في التحليل الفني. هناك عدة أنواع من الرسوم البيانية الشائعة الاستخدام:</p>
          <h4>رسم الخط</h4>
          <p>أبسط نوع من الرسوم البيانية، يوضح سعر الإغلاق فقط على مدى فترة زمنية.</p>
          
          <h4>رسم الشموع اليابانية</h4>
          <p>يعرض أسعار الافتتاح والإغلاق والارتفاع والانخفاض في فترة زمنية معينة. الشموع الخضراء تشير إلى زيادة السعر، بينما الشموع الحمراء تشير إلى انخفاض السعر.</p>
          
          <h4>مقياس الزمن</h4>
          <p>يمكن عرض الرسوم البيانية على إطارات زمنية مختلفة:</p>
          <ul>
            <li>دقيقة واحدة (M1)</li>
            <li>خمس دقائق (M5)</li>
            <li>ساعة واحدة (H1)</li>
            <li>أربع ساعات (H4)</li>
            <li>يومي (D1)</li>
            <li>أسبوعي (W1)</li>
          </ul>
          <p>الإطارات الزمنية القصيرة أكثر ملاءمة للتداول قصير المدى، بينما الإطارات الزمنية الطويلة أفضل للتحليل طويل المدى.</p>
        `,
        contentEn: `
          <p>Charts are the fundamental tools used in technical analysis. There are several common chart types:</p>
          <h4>Line Chart</h4>
          <p>The simplest type of chart, showing only the closing price over a period of time.</p>
          
          <h4>Candlestick Chart</h4>
          <p>Displays the open, close, high, and low prices for a specific time period. Green candles indicate price increases, while red candles indicate price decreases.</p>
          
          <h4>Timeframes</h4>
          <p>Charts can be displayed on different timeframes:</p>
          <ul>
            <li>One minute (M1)</li>
            <li>Five minutes (M5)</li>
            <li>One hour (H1)</li>
            <li>Four hours (H4)</li>
            <li>Daily (D1)</li>
            <li>Weekly (W1)</li>
          </ul>
          <p>Shorter timeframes are more suitable for short-term trading, while longer timeframes are better for long-term analysis.</p>
        `
      },
      {
        id: "indicators",
        title: "المؤشرات الفنية",
        titleEn: "Technical Indicators",
        description: "استخدام المؤشرات الفنية لاتخاذ قرارات تداول أفضل",
        descriptionEn: "Using technical indicators to make better trading decisions",
        content: `
          <p>المؤشرات الفنية هي حسابات رياضية تعتمد على السعر و/أو الحجم لتوفير رؤى إضافية حول اتجاهات السوق المحتملة.</p>
          
          <h4>المتوسطات المتحركة</h4>
          <p>تساعد المتوسطات المتحركة على تحديد الاتجاهات عن طريق تنعيم تقلبات الأسعار. الأنواع الشائعة تشمل:</p>
          <ul>
            <li>المتوسط المتحرك البسيط (SMA)</li>
            <li>المتوسط المتحرك الأسي (EMA)</li>
          </ul>
          
          <h4>مؤشر القوة النسبية (RSI)</h4>
          <p>يقيس سرعة وتغير حركات الأسعار. يتراوح من 0 إلى 100:</p>
          <ul>
            <li>RSI فوق 70: قد يشير إلى ظروف ذروة الشراء</li>
            <li>RSI تحت 30: قد يشير إلى ظروف ذروة البيع</li>
          </ul>
          
          <h4>تقارب وتباعد المتوسطات المتحركة (MACD)</h4>
          <p>يوضح العلاقة بين متوسطين متحركين للسعر. يتكون من:</p>
          <ul>
            <li>خط MACD</li>
            <li>خط الإشارة</li>
            <li>المدرج التكراري (الفرق بين الخطين)</li>
          </ul>
          
          <p>المؤشرات ليست دقيقة 100٪ وينبغي استخدامها جنبًا إلى جنب مع أدوات التحليل الفني الأخرى لتأكيد إشارات التداول.</p>
        `,
        contentEn: `
          <p>Technical indicators are mathematical calculations based on price and/or volume to provide additional insights into potential market trends.</p>
          
          <h4>Moving Averages</h4>
          <p>Moving averages help identify trends by smoothing price fluctuations. Common types include:</p>
          <ul>
            <li>Simple Moving Average (SMA)</li>
            <li>Exponential Moving Average (EMA)</li>
          </ul>
          
          <h4>Relative Strength Index (RSI)</h4>
          <p>Measures the speed and change of price movements. Ranges from 0 to 100:</p>
          <ul>
            <li>RSI above 70: May indicate overbought conditions</li>
            <li>RSI below 30: May indicate oversold conditions</li>
          </ul>
          
          <h4>Moving Average Convergence Divergence (MACD)</h4>
          <p>Shows the relationship between two moving averages of a price. Consists of:</p>
          <ul>
            <li>The MACD line</li>
            <li>The signal line</li>
            <li>The histogram (difference between the lines)</li>
          </ul>
          
          <p>Indicators are not 100% accurate and should be used alongside other technical analysis tools to confirm trading signals.</p>
        `
      }
    ]
  },
  {
    id: "trading-strategies",
    title: "استراتيجيات التداول",
    titleEn: "Trading Strategies",
    description: "استكشاف استراتيجيات تداول البيتكوين المختلفة",
    descriptionEn: "Explore different Bitcoin trading strategies",
    iconType: "graduationCap",
    lessons: [
      {
        id: "trend-following",
        title: "اتباع الاتجاه",
        titleEn: "Trend Following",
        description: "تعلم كيفية تحديد واستغلال اتجاهات السوق",
        descriptionEn: "Learn how to identify and exploit market trends",
        content: `
          <p>استراتيجية اتباع الاتجاه تعتمد على افتراض أن الأسعار ستستمر في التحرك في نفس الاتجاه لفترة من الوقت. الهدف هو شراء الأصول ذات الاتجاه الصاعد وبيع الأصول ذات الاتجاه الهابط.</p>
          
          <h4>كيفية تحديد الاتجاهات</h4>
          <ul>
            <li>الاتجاه الصاعد: سلسلة من القمم والقيعان المتصاعدة</li>
            <li>الاتجاه الهابط: سلسلة من القمم والقيعان المتناقصة</li>
            <li>الاتجاه الجانبي: تحرك السعر ضمن نطاق محدد</li>
          </ul>
          
          <h4>أدوات لتحديد الاتجاه</h4>
          <ul>
            <li>المتوسطات المتحركة</li>
            <li>خطوط الاتجاه</li>
            <li>مؤشر القناة السعرية (ADX)</li>
          </ul>
          
          <h4>نقاط الدخول</h4>
          <p>في الاتجاه الصاعد، يمكن الشراء عند:</p>
          <ul>
            <li>كسر مستويات المقاومة</li>
            <li>الارتداد من خط الاتجاه الصاعد</li>
            <li>الارتداد من المتوسط المتحرك</li>
          </ul>
          
          <p>في الاتجاه الهابط، يمكن البيع عند:</p>
          <ul>
            <li>كسر مستويات الدعم</li>
            <li>الارتداد من خط الاتجاه الهابط</li>
            <li>كسر المتوسط المتحرك للأسفل</li>
          </ul>
          
          <h4>إدارة المخاطر</h4>
          <p>من المهم وضع أوامر وقف الخسارة لحماية رأس المال في حالة انعكاس الاتجاه.</p>
        `,
        contentEn: `
          <p>Trend following strategy is based on the assumption that prices will continue to move in the same direction for a period of time. The goal is to buy assets in an uptrend and sell assets in a downtrend.</p>
          
          <h4>How to Identify Trends</h4>
          <ul>
            <li>Uptrend: A series of higher highs and higher lows</li>
            <li>Downtrend: A series of lower highs and lower lows</li>
            <li>Sideways trend: Price moving within a range</li>
          </ul>
          
          <h4>Tools for Trend Identification</h4>
          <ul>
            <li>Moving averages</li>
            <li>Trendlines</li>
            <li>Average Directional Index (ADX)</li>
          </ul>
          
          <h4>Entry Points</h4>
          <p>In an uptrend, you can buy at:</p>
          <ul>
            <li>Breakouts above resistance levels</li>
            <li>Pullbacks to an uptrend line</li>
            <li>Pullbacks to a moving average</li>
          </ul>
          
          <p>In a downtrend, you can sell at:</p>
          <ul>
            <li>Breakdowns below support levels</li>
            <li>Rallies to a downtrend line</li>
            <li>Breaks below a moving average</li>
          </ul>
          
          <h4>Risk Management</h4>
          <p>It's important to place stop-loss orders to protect capital in case of trend reversal.</p>
        `
      },
      {
        id: "swing-trading",
        title: "التداول المتأرجح",
        titleEn: "Swing Trading",
        description: "استراتيجية للاستفادة من تحركات السوق قصيرة إلى متوسطة المدى",
        descriptionEn: "A strategy to profit from short to medium-term market movements",
        content: `
          <p>التداول المتأرجح هو استراتيجية تهدف إلى الاستفادة من "التأرجحات" في السوق، أي التحركات قصيرة إلى متوسطة المدى في سعر الأصل. عادةً ما يحتفظ المتداولون المتأرجحون بمراكزهم من عدة أيام إلى عدة أسابيع.</p>
          
          <h4>مميزات التداول المتأرجح</h4>
          <ul>
            <li>يتطلب وقتاً أقل للمراقبة مقارنة بالتداول اليومي</li>
            <li>يقلل من تأثير ضوضاء السوق اليومية</li>
            <li>يمكن أن يوفر فرصاً للربح في الأسواق الصاعدة والهابطة والمتذبذبة</li>
          </ul>
          
          <h4>تقنيات التداول المتأرجح</h4>
          <p>غالباً ما يستخدم المتداولون المتأرجحون مزيجاً من التحليل الفني والأساسي:</p>
          <ul>
            <li>نماذج الشموع اليابانية</li>
            <li>نقاط الدعم والمقاومة</li>
            <li>خطوط الاتجاه</li>
            <li>المتوسطات المتحركة</li>
            <li>مستويات فيبوناتشي</li>
          </ul>
          
          <h4>إشارات الدخول والخروج</h4>
          <p>إشارات الدخول المحتملة:</p>
          <ul>
            <li>كسر نمط فني</li>
            <li>الارتداد من مستوى دعم أو مقاومة</li>
            <li>تقاطعات المتوسطات المتحركة</li>
          </ul>
          
          <p>إشارات الخروج المحتملة:</p>
          <ul>
            <li>الوصول إلى هدف الربح المحدد مسبقاً</li>
            <li>ظهور نماذج انعكاسية</li>
            <li>كسر خط الاتجاه</li>
          </ul>
          
          <h4>نصائح للتداول المتأرجح</h4>
          <ul>
            <li>حدد نسبة المخاطرة إلى المكافأة قبل الدخول في الصفقة (مثال: 1:2 أو 1:3)</li>
            <li>استخدم أوامر وقف الخسارة لإدارة المخاطر</li>
            <li>تجنب التداول ضد الاتجاه العام</li>
            <li>كن على دراية بالأحداث الإخبارية التي قد تؤثر على السوق</li>
          </ul>
        `,
        contentEn: `
          <p>Swing trading is a strategy that aims to capture "swings" in the market, which are short to medium-term movements in an asset's price. Swing traders typically hold positions from several days to several weeks.</p>
          
          <h4>Advantages of Swing Trading</h4>
          <ul>
            <li>Requires less time monitoring compared to day trading</li>
            <li>Reduces the impact of daily market noise</li>
            <li>Can provide profit opportunities in bullish, bearish, and ranging markets</li>
          </ul>
          
          <h4>Swing Trading Techniques</h4>
          <p>Swing traders often use a combination of technical and fundamental analysis:</p>
          <ul>
            <li>Candlestick patterns</li>
            <li>Support and resistance levels</li>
            <li>Trendlines</li>
            <li>Moving averages</li>
            <li>Fibonacci levels</li>
          </ul>
          
          <h4>Entry and Exit Signals</h4>
          <p>Potential entry signals:</p>
          <ul>
            <li>Breakout of a technical pattern</li>
            <li>Bounce from support or resistance level</li>
            <li>Moving average crossovers</li>
          </ul>
          
          <p>Potential exit signals:</p>
          <ul>
            <li>Reaching a predetermined profit target</li>
            <li>Appearance of reversal patterns</li>
            <li>Break of a trendline</li>
          </ul>
          
          <h4>Tips for Swing Trading</h4>
          <ul>
            <li>Determine risk-to-reward ratio before entering a trade (e.g., 1:2 or 1:3)</li>
            <li>Use stop-loss orders for risk management</li>
            <li>Avoid trading against the overall trend</li>
            <li>Be aware of news events that may impact the market</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "risk-management",
    title: "إدارة المخاطر",
    titleEn: "Risk Management",
    description: "تعلم كيفية حماية استثماراتك وتقليل الخسائر",
    descriptionEn: "Learn how to protect your investments and minimize losses",
    iconType: "bookOpen",
    lessons: [
      {
        id: "position-sizing",
        title: "تحديد حجم المركز",
        titleEn: "Position Sizing",
        description: "كيفية تحديد الحجم المناسب للصفقات",
        descriptionEn: "How to determine the appropriate trade size",
        content: `
          <p>تحديد حجم المركز هو تقنية أساسية في إدارة المخاطر تساعدك على تحديد مقدار رأس المال الذي ستخاطر به في كل صفقة.</p>
          
          <h4>لماذا يعتبر تحديد حجم المركز مهمًا؟</h4>
          <ul>
            <li>يمنع التداول بحجم كبير جدًا مما قد يؤدي إلى خسائر كبيرة</li>
            <li>يساعد على البقاء في السوق حتى خلال فترات الخسارة المتتالية</li>
            <li>يحافظ على الاتساق في مستوى المخاطرة عبر جميع الصفقات</li>
          </ul>
          
          <h4>طرق تحديد حجم المركز</h4>
          
          <p><strong>1. نسبة مئوية ثابتة من رأس المال</strong></p>
          <p>لا تخاطر بأكثر من نسبة معينة من رأس المال في أي صفقة واحدة. يوصي معظم الخبراء بنسبة 1-2٪ كحد أقصى.</p>
          <p>مثال: إذا كان لديك رأس مال قدره 10,000 دولار، فلا تخاطر بأكثر من 100-200 دولار في أي صفقة واحدة.</p>
          
          <p><strong>2. طريقة الانحراف المعياري للتوقف</strong></p>
          <p>ضبط حجم المركز بناءً على موقع وقف الخسارة:</p>
          <pre>حجم المركز = المبلغ المخاطر به ÷ (سعر الدخول - سعر وقف الخسارة)</pre>
          <p>مثال: إذا كنت تخاطر بـ 100 دولار، وسعر الدخول هو 20,000 دولار، وسعر وقف الخسارة هو 19,000 دولار:</p>
          <pre>حجم المركز = 100 دولار ÷ (20,000 دولار - 19,000 دولار) = 0.1 بيتكوين</pre>
          
          <p><strong>3. نموذج كيلي</strong></p>
          <p>يحدد الحجم الأمثل للمركز بناءً على احتمالية النجاح ونسبة المكافأة إلى المخاطرة:</p>
          <pre>نسبة كيلي = W - [(1-W)/R]</pre>
          <p>حيث W هي احتمالية الربح، و R هي نسبة المكافأة إلى المخاطرة.</p>
          
          <h4>نصائح لتحديد حجم المركز</h4>
          <ul>
            <li>ابدأ بحجم أصغر مما تعتقد أنه مناسب</li>
            <li>زد حجم المركز تدريجياً مع اكتساب الخبرة</li>
            <li>ضع في اعتبارك التقلبات العالية لسوق البيتكوين</li>
            <li>عدل حجم المركز وفقاً لظروف السوق الحالية</li>
          </ul>
        `,
        contentEn: `
          <p>Position sizing is a fundamental risk management technique that helps you determine how much capital to risk on each trade.</p>
          
          <h4>Why is Position Sizing Important?</h4>
          <ul>
            <li>Prevents trading too large, which could lead to significant losses</li>
            <li>Helps you stay in the market even during losing streaks</li>
            <li>Maintains consistency in risk exposure across all trades</li>
          </ul>
          
          <h4>Position Sizing Methods</h4>
          
          <p><strong>1. Fixed Percentage of Capital</strong></p>
          <p>Don't risk more than a certain percentage of your capital on any single trade. Most experts recommend 1-2% maximum.</p>
          <p>Example: If you have $10,000 capital, don't risk more than $100-$200 on any single trade.</p>
          
          <p><strong>2. Fixed-Dollar Stop Method</strong></p>
          <p>Adjust position size based on stop-loss placement:</p>
          <pre>Position Size = Amount Risked ÷ (Entry Price - Stop-Loss Price)</pre>
          <p>Example: If you're risking $100, and entry price is $20,000, with stop-loss at $19,000:</p>
          <pre>Position Size = $100 ÷ ($20,000 - $19,000) = 0.1 BTC</pre>
          
          <p><strong>3. Kelly Criterion</strong></p>
          <p>Determines optimal position size based on win probability and reward-to-risk ratio:</p>
          <pre>Kelly Percentage = W - [(1-W)/R]</pre>
          <p>Where W is the win probability, and R is the reward-to-risk ratio.</p>
          
          <h4>Tips for Position Sizing</h4>
          <ul>
            <li>Start with smaller sizes than you think appropriate</li>
            <li>Gradually increase position size as you gain experience</li>
            <li>Consider the high volatility of the Bitcoin market</li>
            <li>Adjust position sizing according to current market conditions</li>
          </ul>
        `
      },
      {
        id: "stop-loss-strategies",
        title: "استراتيجيات وقف الخسارة",
        titleEn: "Stop-Loss Strategies",
        description: "كيفية استخدام أوامر وقف الخسارة لحماية رأس المال",
        descriptionEn: "How to use stop-loss orders to protect your capital",
        content: `
          <p>أوامر وقف الخسارة هي أدوات أساسية لإدارة المخاطر تساعدك على الخروج من الصفقة تلقائيًا عندما يتحرك السعر ضدك بمقدار محدد.</p>
          
          <h4>أنواع أوامر وقف الخسارة</h4>
          
          <p><strong>1. وقف خسارة ثابت</strong></p>
          <p>وضع وقف الخسارة على مسافة محددة من سعر الدخول.</p>
          <p>مثال: شراء بيتكوين بسعر 20,000 دولار، ووضع وقف خسارة عند 19,000 دولار (خسارة 5٪).</p>
          
          <p><strong>2. وقف الخسارة المتحرك</strong></p>
          <p>تحريك وقف الخسارة مع تحرك السعر في الاتجاه المربح لتأمين الأرباح.</p>
          <p>مثال: بدء وقف الخسارة عند 19,000 دولار، وعندما يرتفع السعر إلى 21,000 دولار، تحريك وقف الخسارة إلى 20,000 دولار.</p>
          
          <p><strong>3. وقف خسارة قائم على المؤشرات</strong></p>
          <p>استخدام المؤشرات الفنية لتحديد مستويات وقف الخسارة.</p>
          <p>أمثلة:</p>
          <ul>
            <li>وقف الخسارة أسفل المتوسط المتحرك لـ 20 يومًا</li>
            <li>وقف الخسارة أسفل أدنى مستوى للسعر في آخر X شمعة</li>
            <li>وقف الخسارة أسفل مستوى فيبوناتشي الرئيسي</li>
          </ul>
          
          <p><strong>4. وقف الخسارة بناءً على التقلبات</strong></p>
          <p>ضبط وقف الخسارة بناءً على تقلبات السوق، باستخدام مضاعفات الانحراف المعياري أو مؤشر متوسط المدى الحقيقي (ATR).</p>
          <p>مثال: وضع وقف الخسارة على بعد 2 × ATR من سعر الدخول.</p>
          
          <h4>نصائح لاستخدام أوامر وقف الخسارة</h4>
          <ul>
            <li>لا تضع وقف الخسارة قريبًا جدًا من سعر الدخول لتجنب الخروج المبكر بسبب تقلبات السوق العادية</li>
            <li>ضع وقف الخسارة عند مستويات منطقية من وجهة نظر التحليل الفني، مثل أسفل مستوى دعم أو خط اتجاه</li>
            <li>تجنب تغيير وقف الخسارة لأسباب عاطفية</li>
            <li>استخدم وقف الخسارة العقلي (دون تنفيذه فعليًا على المنصة) في الأسواق المتقلبة للغاية لتجنب الإغلاق الخاطئ</li>
          </ul>
          
          <h4>متى لا تستخدم وقف الخسارة</h4>
          <ul>
            <li>في استراتيجيات الشراء والاحتفاظ طويلة الأجل</li>
            <li>عندما لا تكون هناك رؤية واضحة عن المكان المنطقي لوضع وقف الخسارة</li>
            <li>عندما تكون تقلبات السوق مرتفعة للغاية وقد تؤدي إلى تفعيل وقف الخسارة بشكل متكرر</li>
          </ul>
        `,
        contentEn: `
          <p>Stop-loss orders are essential risk management tools that help you exit a trade automatically when the price moves against you by a specified amount.</p>
          
          <h4>Types of Stop-Loss Orders</h4>
          
          <p><strong>1. Fixed Stop-Loss</strong></p>
          <p>Setting a stop-loss at a specific distance from your entry price.</p>
          <p>Example: Buying Bitcoin at $20,000 and setting a stop-loss at $19,000 (5% loss).</p>
          
          <p><strong>2. Trailing Stop-Loss</strong></p>
          <p>Moving the stop-loss as the price moves in your favor to lock in profits.</p>
          <p>Example: Starting with a stop-loss at $19,000, and as the price rises to $21,000, moving the stop-loss to $20,000.</p>
          
          <p><strong>3. Indicator-Based Stop-Loss</strong></p>
          <p>Using technical indicators to determine stop-loss levels.</p>
          <p>Examples:</p>
          <ul>
            <li>Stop-loss below the 20-day moving average</li>
            <li>Stop-loss below the lowest price of the last X candles</li>
            <li>Stop-loss below a key Fibonacci level</li>
          </ul>
          
          <p><strong>4. Volatility-Based Stop-Loss</strong></p>
          <p>Adjusting the stop-loss based on market volatility, using multiples of standard deviation or the Average True Range (ATR) indicator.</p>
          <p>Example: Setting a stop-loss 2 × ATR away from the entry price.</p>
          
          <h4>Tips for Using Stop-Loss Orders</h4>
          <ul>
            <li>Don't set the stop-loss too close to the entry price to avoid early exits due to normal market fluctuations</li>
            <li>Place stop-losses at levels that make sense from a technical analysis perspective, such as below a support level or trendline</li>
            <li>Avoid changing your stop-loss for emotional reasons</li>
            <li>Use mental stop-losses (not actually executed on the platform) in extremely volatile markets to avoid false triggers</li>
          </ul>
          
          <h4>When Not to Use Stop-Losses</h4>
          <ul>
            <li>In long-term buy-and-hold strategies</li>
            <li>When there's no clear view of where to logically place the stop-loss</li>
            <li>When market volatility is extremely high and may trigger stop-losses repeatedly</li>
          </ul>
        `
      }
    ]
  },
  {
    id: "crypto-markets",
    title: "أسواق العملات الرقمية",
    titleEn: "Crypto Markets",
    description: "فهم كيفية عمل أسواق العملات الرقمية والبورصات",
    descriptionEn: "Understanding how crypto markets and exchanges work",
    iconType: "presentation",
    lessons: [
      {
        id: "exchanges",
        title: "بورصات العملات الرقمية",
        titleEn: "Cryptocurrency Exchanges",
        description: "مقارنة بين المنصات المختلفة وكيفية اختيار المنصة المناسبة",
        descriptionEn: "Comparing different platforms and how to choose the right one",
        content: `
          <p>بورصات العملات الرقمية هي منصات إلكترونية تسمح للمستخدمين بشراء وبيع وتداول العملات الرقمية مثل البيتكوين. تختلف هذه المنصات من حيث الأمان والرسوم والعملات المدعومة وسهولة الاستخدام.</p>
          
          <h4>أنواع البورصات</h4>
          
          <p><strong>1. البورصات المركزية (CEX)</strong></p>
          <ul>
            <li>تعمل كوسيط بين المشترين والبائعين</li>
            <li>تتطلب التحقق من الهوية (KYC)</li>
            <li>توفر واجهة مستخدم سهلة الاستخدام وخدمة عملاء</li>
            <li>أمثلة: Binance، Coinbase، Kraken</li>
          </ul>
          
          <p><strong>2. البورصات اللامركزية (DEX)</strong></p>
          <ul>
            <li>تعمل على تقنية البلوكتشين بدون وسيط مركزي</li>
            <li>لا تتطلب التحقق من الهوية</li>
            <li>تمنح المستخدمين سيطرة كاملة على أموالهم</li>
            <li>أمثلة: Uniswap، SushiSwap، dYdX</li>
          </ul>
          
          <h4>عوامل اختيار البورصة المناسبة</h4>
          
          <p><strong>الأمان</strong></p>
          <ul>
            <li>تاريخ الاختراقات والانتهاكات الأمنية</li>
            <li>ميزات الأمان (المصادقة الثنائية، المفاتيح البيومترية)</li>
            <li>سياسات التأمين على الأصول</li>
            <li>تخزين الأصول في محافظ باردة</li>
          </ul>
          
          <p><strong>الرسوم</strong></p>
          <ul>
            <li>رسوم التداول</li>
            <li>رسوم الإيداع والسحب</li>
            <li>رسوم تحويل العملات</li>
          </ul>
          
          <p><strong>العملات المدعومة</strong></p>
          <ul>
            <li>عدد ومجموعة العملات الرقمية المتاحة للتداول</li>
            <li>أزواج التداول المتاحة</li>
          </ul>
          
          <p><strong>السيولة</strong></p>
          <ul>
            <li>حجم التداول</li>
            <li>عمق السوق</li>
            <li>انتشار السعر (الفرق بين سعر الشراء والبيع)</li>
          </ul>
          
          <p><strong>سهولة الاستخدام</strong></p>
          <ul>
            <li>واجهة المستخدم</li>
            <li>التطبيقات المحمولة</li>
            <li>خيارات الدعم العملاء</li>
            <li>اللغات المدعومة</li>
          </ul>
          
          <h4>نصائح للمبتدئين</h4>
          <ul>
            <li>ابدأ مع بورصات معروفة وموثوقة</li>
            <li>استخدم المصادقة الثنائية دائمًا</li>
            <li>لا تحتفظ بمبالغ كبيرة على البورصات، استخدم المحافظ الخاصة للتخزين طويل المدى</li>
            <li>تعرف على القوانين الضريبية في بلدك المتعلقة بالعملات الرقمية</li>
          </ul>
        `,
        contentEn: `
          <p>Cryptocurrency exchanges are online platforms that allow users to buy, sell, and trade cryptocurrencies like Bitcoin. These platforms differ in terms of security, fees, supported currencies, and ease of use.</p>
          
          <h4>Types of Exchanges</h4>
          
          <p><strong>1. Centralized Exchanges (CEX)</strong></p>
          <ul>
            <li>Act as intermediaries between buyers and sellers</li>
            <li>Require identity verification (KYC)</li>
            <li>Provide user-friendly interfaces and customer support</li>
            <li>Examples: Binance, Coinbase, Kraken</li>
          </ul>
          
          <p><strong>2. Decentralized Exchanges (DEX)</strong></p>
          <ul>
            <li>Operate on blockchain technology without a central intermediary</li>
            <li>Don't require identity verification</li>
            <li>Give users full control over their funds</li>
            <li>Examples: Uniswap, SushiSwap, dYdX</li>
          </ul>
          
          <h4>Factors for Choosing the Right Exchange</h4>
          
          <p><strong>Security</strong></p>
          <ul>
            <li>History of hacks and security breaches</li>
            <li>Security features (2FA, biometric keys)</li>
            <li>Asset insurance policies</li>
            <li>Cold storage of assets</li>
          </ul>
          
          <p><strong>Fees</strong></p>
          <ul>
            <li>Trading fees</li>
            <li>Deposit and withdrawal fees</li>
            <li>Currency conversion fees</li>
          </ul>
          
          <p><strong>Supported Currencies</strong></p>
          <ul>
            <li>Number and variety of cryptocurrencies available for trading</li>
            <li>Available trading pairs</li>
          </ul>
          
          <p><strong>Liquidity</strong></p>
          <ul>
            <li>Trading volume</li>
            <li>Market depth</li>
            <li>Price spread (difference between buy and sell prices)</li>
          </ul>
          
          <p><strong>Ease of Use</strong></p>
          <ul>
            <li>User interface</li>
            <li>Mobile applications</li>
            <li>Customer support options</li>
            <li>Supported languages</li>
          </ul>
          
          <h4>Tips for Beginners</h4>
          <ul>
            <li>Start with well-known and reputable exchanges</li>
            <li>Always use two-factor authentication</li>
            <li>Don't keep large amounts on exchanges, use personal wallets for long-term storage</li>
            <li>Understand the tax laws in your country related to cryptocurrencies</li>
          </ul>
        `
      },
      {
        id: "market-psychology",
        title: "سيكولوجية السوق",
        titleEn: "Market Psychology",
        description: "فهم العوامل النفسية التي تؤثر على أسواق العملات الرقمية",
        descriptionEn: "Understanding the psychological factors that affect crypto markets",
        content: `
          <p>سيكولوجية السوق تدرس كيف تؤثر المشاعر والسلوكيات الجماعية للمتداولين والمستثمرين على أسعار الأصول الرقمية. فهم هذه العوامل النفسية يمكن أن يساعدك على اتخاذ قرارات تداول أفضل.</p>
          
          <h4>العواطف الرئيسية في السوق</h4>
          
          <p><strong>1. الطمع والخوف</strong></p>
          <p>هما المشاعر الأساسية التي تدفع أسواق العملات الرقمية:</p>
          <ul>
            <li>الطمع: يدفع المستثمرين للشراء عندما ترتفع الأسعار، مما يؤدي إلى فقاعات سعرية</li>
            <li>الخوف: يدفع المستثمرين للبيع عندما تنخفض الأسعار، مما يؤدي إلى انهيارات سوقية</li>
          </ul>
          <p>مؤشر "الخوف والطمع" هو أداة تقيس مشاعر السوق بناءً على عدة عوامل.</p>
          
          <p><strong>2. نفسية القطيع</strong></p>
          <p>ميل الأفراد لمحاكاة سلوك المجموعة الأكبر:</p>
          <ul>
            <li>FOMO (الخوف من تفويت الفرصة): شراء الأصول لأن الجميع يشترون</li>
            <li>FUD (الخوف وعدم اليقين والشك): بيع الأصول بناءً على أخبار سلبية</li>
          </ul>
          
          <h4>التحيزات السلوكية</h4>
          
          <p><strong>1. تحيز التأكيد</strong></p>
          <p>البحث عن المعلومات التي تؤكد معتقداتنا الحالية وتجاهل المعلومات المعاكسة.</p>
          <p>مثال: مستثمر يؤمن بأن سعر البيتكوين سيرتفع، فيبحث فقط عن التحليلات والأخبار الإيجابية.</p>
          
          <p><strong>2. الثقة المفرطة</strong></p>
          <p>المبالغة في تقدير معرفتنا وقدراتنا على التنبؤ بحركة السوق.</p>
          <p>مثال: متداول يعتقد أنه يمكنه توقيت السوق بدقة بناءً على نجاحات سابقة محدودة.</p>
          
          <p><strong>3. تحيز الخسارة</strong></p>
          <p>الشعور بألم الخسارة بشكل أقوى من متعة المكسب المماثل.</p>
          <p>مثال: الاحتفاظ بالعملات الخاسرة على أمل أن ترتفع، بينما يتم بيع العملات الرابحة مبكرًا.</p>
          
          <p><strong>4. تحيز الحداثة</strong></p>
          <p>إعطاء أهمية أكبر للأحداث الأخيرة عند التنبؤ بالمستقبل.</p>
          <p>مثال: توقع استمرار الاتجاه الصاعد للسوق لأنه كان صاعدًا في الأسابيع القليلة الماضية.</p>
          
          <h4>كيفية التغلب على التحيزات النفسية</h4>
          <ul>
            <li>وضع خطة تداول مكتوبة والالتزام بها</li>
            <li>استخدام أوامر وقف الخسارة لتجنب القرارات العاطفية</li>
            <li>البحث عن وجهات نظر معارضة لتحدي معتقداتك</li>
            <li>الاحتفاظ بسجل للصفقات لتحليل الأنماط السلوكية</li>
            <li>أخذ فترات راحة من متابعة السوق</li>
            <li>التركيز على المدى الطويل بدلاً من التقلبات اليومية</li>
          </ul>
          
          <h4>دورات السوق</h4>
          <p>أسواق العملات الرقمية تمر بدورات نفسية:</p>
          <ol>
            <li>التراكم: المستثمرون ذوو الخبرة يشترون</li>
            <li>الوعي العام: ارتفاع الاهتمام والأسعار</li>
            <li>الهوس: ارتفاع الطمع والتغطية الإعلامية</li>
            <li>التصريف: المستثمرون ذوو الخبرة يبيعون</li>
            <li>الذعر: انخفاض حاد في الأسعار والخوف</li>
            <li>الاستسلام: انخفاض الاهتمام والأسعار</li>
          </ol>
        `,
        contentEn: `
          <p>Market psychology studies how the collective emotions and behaviors of traders and investors affect the prices of digital assets. Understanding these psychological factors can help you make better trading decisions.</p>
          
          <h4>Key Market Emotions</h4>
          
          <p><strong>1. Greed and Fear</strong></p>
          <p>These are the fundamental emotions driving crypto markets:</p>
          <ul>
            <li>Greed: Pushes investors to buy when prices are rising, leading to price bubbles</li>
            <li>Fear: Drives investors to sell when prices are falling, leading to market crashes</li>
          </ul>
          <p>The "Fear and Greed Index" is a tool that measures market sentiment based on several factors.</p>
          
          <p><strong>2. Herd Mentality</strong></p>
          <p>The tendency of individuals to mimic the behavior of the larger group:</p>
          <ul>
            <li>FOMO (Fear Of Missing Out): Buying assets because everyone else is buying</li>
            <li>FUD (Fear, Uncertainty, Doubt): Selling assets based on negative news</li>
          </ul>
          
          <h4>Behavioral Biases</h4>
          
          <p><strong>1. Confirmation Bias</strong></p>
          <p>Seeking information that confirms our existing beliefs and ignoring contrary information.</p>
          <p>Example: An investor who believes Bitcoin will rise only looks for positive analyses and news.</p>
          
          <p><strong>2. Overconfidence</strong></p>
          <p>Overestimating our knowledge and ability to predict market movements.</p>
          <p>Example: A trader believing they can time the market perfectly based on limited past successes.</p>
          
          <p><strong>3. Loss Aversion</strong></p>
          <p>Feeling the pain of a loss more strongly than the pleasure of an equivalent gain.</p>
          <p>Example: Holding onto losing coins in hopes they'll recover, while selling winning coins early.</p>
          
          <p><strong>4. Recency Bias</strong></p>
          <p>Giving greater importance to recent events when predicting the future.</p>
          <p>Example: Expecting a bullish market trend to continue because it's been bullish in the past few weeks.</p>
          
          <h4>How to Overcome Psychological Biases</h4>
          <ul>
            <li>Create a written trading plan and stick to it</li>
            <li>Use stop-loss orders to avoid emotional decisions</li>
            <li>Seek opposing viewpoints to challenge your beliefs</li>
            <li>Keep a trading journal to analyze behavioral patterns</li>
            <li>Take breaks from watching the market</li>
            <li>Focus on the long-term instead of daily fluctuations</li>
          </ul>
          
          <h4>Market Cycles</h4>
          <p>Crypto markets go through psychological cycles:</p>
          <ol>
            <li>Accumulation: Smart money buying</li>
            <li>Public awareness: Rising interest and prices</li>
            <li>Mania: High greed and media coverage</li>
            <li>Distribution: Smart money selling</li>
            <li>Panic: Sharp price drops and fear</li>
            <li>Capitulation: Decreased interest and prices</li>
          </ol>
        `
      }
    ]
  },
  {
    id: "video-tutorials",
    title: "دروس فيديو",
    titleEn: "Video Tutorials",
    description: "تعلم من خلال مقاطع الفيديو التعليمية",
    descriptionEn: "Learn through educational video materials",
    iconType: "video",
    lessons: [
      {
        id: "trading-basics-video",
        title: "أساسيات التداول",
        titleEn: "Trading Basics",
        description: "مقدمة شاملة حول أساسيات تداول البيتكوين",
        descriptionEn: "A comprehensive introduction to Bitcoin trading basics",
        content: `
          <p>في هذا القسم، سنقدم مجموعة من الفيديوهات التعليمية لمساعدتك على فهم أساسيات تداول البيتكوين.</p>
          
          <div class="aspect-video w-full rounded-lg overflow-hidden bg-muted mb-4">
            <div class="w-full h-full flex items-center justify-center">
              <span class="text-muted-foreground">محتوى الفيديو غير متاح حاليًا. سيتم إضافته قريبًا.</span>
            </div>
          </div>
          
          <h4>محتوى الفيديو</h4>
          <ul>
            <li>مقدمة عن تداول البيتكوين</li>
            <li>أنواع الأوامر المختلفة (أمر السوق، أمر محدد، أمر وقف الخسارة)</li>
            <li>كيفية قراءة الرسوم البيانية</li>
            <li>مؤشرات التحليل الفني الأساسية</li>
            <li>استراتيجيات التداول للمبتدئين</li>
          </ul>
          
          <h4>موارد إضافية</h4>
          <p>يمكنك استكشاف مصادر الفيديو التالية لمزيد من المعلومات:</p>
          <ul>
            <li>قناة "متداول البيتكوين" على يوتيوب</li>
            <li>دورة "أساسيات التحليل الفني" على أكاديمية التداول</li>
            <li>ندوات عبر الإنترنت من منصات التداول الرئيسية</li>
          </ul>
        `,
        contentEn: `
          <p>In this section, we will provide a collection of educational videos to help you understand the basics of Bitcoin trading.</p>
          
          <div class="aspect-video w-full rounded-lg overflow-hidden bg-muted mb-4">
            <div class="w-full h-full flex items-center justify-center">
              <span class="text-muted-foreground">Video content not available yet. Coming soon.</span>
            </div>
          </div>
          
          <h4>Video Content</h4>
          <ul>
            <li>Introduction to Bitcoin trading</li>
            <li>Different order types (market, limit, stop-loss)</li>
            <li>How to read charts</li>
            <li>Basic technical analysis indicators</li>
            <li>Trading strategies for beginners</li>
          </ul>
          
          <h4>Additional Resources</h4>
          <p>You can explore the following video resources for more information:</p>
          <ul>
            <li>"Bitcoin Trader" channel on YouTube</li>
            <li>"Technical Analysis Fundamentals" course on Trading Academy</li>
            <li>Webinars from major trading platforms</li>
          </ul>
        `
      },
      {
        id: "advanced-strategies-video",
        title: "استراتيجيات متقدمة",
        titleEn: "Advanced Strategies",
        description: "تقنيات تداول متقدمة للمتداولين ذوي الخبرة",
        descriptionEn: "Advanced trading techniques for experienced traders",
        content: `
          <p>هذا القسم مخصص للمتداولين ذوي الخبرة الذين يرغبون في تطوير مهاراتهم التداولية باستخدام استراتيجيات متقدمة.</p>
          
          <div class="aspect-video w-full rounded-lg overflow-hidden bg-muted mb-4">
            <div class="w-full h-full flex items-center justify-center">
              <span class="text-muted-foreground">محتوى الفيديو غير متاح حاليًا. سيتم إضافته قريبًا.</span>
            </div>
          </div>
          
          <h4>محتوى الفيديو</h4>
          <ul>
            <li>تحليل تدفق الأوامر</li>
            <li>استراتيجيات تداول العقود الآجلة للبيتكوين</li>
            <li>تحليل متعدد الإطارات الزمنية</li>
            <li>تقنيات توقيت السوق المتقدمة</li>
            <li>استراتيجيات التداول الخوارزمية</li>
          </ul>
          
          <h4>متطلبات مسبقة</h4>
          <p>قبل مشاهدة هذا المحتوى، نوصي بفهم:</p>
          <ul>
            <li>أساسيات التحليل الفني</li>
            <li>إدارة المخاطر</li>
            <li>سيكولوجية التداول</li>
            <li>أساسيات تداول العقود الآجلة</li>
          </ul>
          
          <p>ملاحظة: تتضمن هذه الاستراتيجيات المتقدمة مخاطر أعلى وهي غير مناسبة للمبتدئين.</p>
        `,
        contentEn: `
          <p>This section is dedicated to experienced traders who want to develop their trading skills using advanced strategies.</p>
          
          <div class="aspect-video w-full rounded-lg overflow-hidden bg-muted mb-4">
            <div class="w-full h-full flex items-center justify-center">
              <span class="text-muted-foreground">Video content not available yet. Coming soon.</span>
            </div>
          </div>
          
          <h4>Video Content</h4>
          <ul>
            <li>Order flow analysis</li>
            <li>Bitcoin futures trading strategies</li>
            <li>Multi-timeframe analysis</li>
            <li>Advanced market timing techniques</li>
            <li>Algorithmic trading strategies</li>
          </ul>
          
          <h4>Prerequisites</h4>
          <p>Before watching this content, we recommend understanding:</p>
          <ul>
            <li>Technical analysis basics</li>
            <li>Risk management</li>
            <li>Trading psychology</li>
            <li>Futures trading fundamentals</li>
          </ul>
          
          <p>Note: These advanced strategies involve higher risk and are not suitable for beginners.</p>
        `
      }
    ]
  }
];
