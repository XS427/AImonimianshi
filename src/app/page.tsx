"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Monitor,
  Factory,
  Landmark,
  ShoppingCart,
  Briefcase,
  User,
  Bot,
  Send,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Code,
  Box,
  Settings,
  LineChart,
  Wrench,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  BarChart3,
  PenTool,
  GraduationCap,
  Search,
  Zap,
  ArrowRight,
  Users,
  BookOpen,
  Mic2,
  Globe
} from "lucide-react";

// 行业配置
const industries = [
  {
    id: "tech",
    name: "互联网/科技行业",
    shortName: "互联网/科技",
    icon: Monitor,
    description: "技术驱动型企业，覆盖产品研发、运营推广、市场销售全链路岗位",
    gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
    lightGradient: "from-violet-100 to-fuchsia-100",
    iconBg: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
    stats: "31个热门职位",
    highlight: "技术 · 产品 · 运营 · 设计",
    categories: [
      { id: "tech_dev", name: "技术类", icon: Code, positions: ["后端开发工程师（Java/Go/Python）", "前端开发工程师", "移动端开发（iOS/Android）", "测试开发工程师", "运维工程师", "大数据开发", "算法工程师（推荐/搜索/视觉/NLP）", "嵌入式软件工程师", "架构师", "技术专家"] },
      { id: "tech_product", name: "产品与项目类", icon: Box, positions: ["产品经理（C端/B端/后台/数据）", "产品运营", "项目总监/项目经理", "需求分析师"] },
      { id: "tech_ops", name: "运营类", icon: LineChart, positions: ["用户运营", "内容运营", "新媒体运营", "社群运营", "电商运营", "私域运营", "数据分析师", "增长运营"] },
      { id: "tech_design", name: "设计类", icon: PenTool, positions: ["UI设计师", "UX交互设计师", "视觉设计师", "创意设计专家"] },
      { id: "tech_sales", name: "市场与销售类", icon: TrendingUp, positions: ["市场总监", "品牌经理", "渠道经理", "商务拓展（BD）", "销售经理（KA/区域）", "客户成功经理"] },
      { id: "tech_func", name: "职能类", icon: Settings, positions: ["财务", "法务", "风控", "内控", "行政", "采购", "公关"] }
    ]
  },
  {
    id: "manufacturing",
    name: "制造业/实体工业",
    shortName: "制造业",
    icon: Factory,
    description: "实体经济支柱，涵盖研发生产、质量管理、供应链运营核心岗位",
    gradient: "from-emerald-600 via-teal-500 to-cyan-500",
    lightGradient: "from-emerald-100 to-cyan-100",
    iconBg: "bg-gradient-to-br from-emerald-500 to-cyan-500",
    stats: "29个热门职位",
    highlight: "研发 · 生产 · 质量 · 供应链",
    categories: [
      { id: "mfg_rnd", name: "研发技术类", icon: Code, positions: ["机械设计工程师", "电气工程师", "自动化工程师", "硬件工程师", "嵌入式开发", "工艺工程师（PE）", "质量工程师（QE/QC）", "测试工程师", "材料工程师", "结构工程师"] },
      { id: "mfg_prod", name: "生产运营类", icon: Wrench, positions: ["生产主管/经理", "生产计划（PMC）", "精益生产工程师", "设备工程师", "厂长/车间主任", "工业工程师（IE）", "供应链经理", "采购工程师", "仓储主管"] },
      { id: "mfg_quality", name: "质量与安全类", icon: ShieldCheck, positions: ["体系工程师（ISO）", "质量经理", "供应商质量工程师（SQE）", "安全工程师（EHS）", "环境健康安全经理"] },
      { id: "mfg_sales", name: "销售与市场类", icon: TrendingUp, positions: ["销售工程师", "区域销售经理", "大客户经理", "外贸经理", "售前技术支持", "市场推广（B2B）"] },
      { id: "mfg_func", name: "职能支持类", icon: Settings, positions: ["财务", "人事", "行政", "IT运维", "关务/报关"] }
    ]
  },
  {
    id: "finance",
    name: "金融行业",
    shortName: "金融",
    icon: Landmark,
    description: "银行证券保险基金，聚焦前台业务、中台风控、后台技术核心人才",
    gradient: "from-amber-500 via-orange-500 to-yellow-500",
    lightGradient: "from-amber-100 to-yellow-100",
    iconBg: "bg-gradient-to-br from-amber-500 to-yellow-500",
    stats: "26个热门职位",
    highlight: "前台 · 风控 · 金融科技 · 合规",
    categories: [
      { id: "fin_front", name: "前台业务类", icon: DollarSign, positions: ["客户经理（对公/零售）", "理财经理", "投资顾问", "证券经纪人", "投行项目经理", "研究员（行业/宏观）", "量化研究员", "交易员", "保险代理人/经纪人"] },
      { id: "fin_middle", name: "中台风控与产品类", icon: ShieldCheck, positions: ["风险控制经理（信用/市场/操作风险）", "合规经理", "反洗钱岗", "产品经理（金融产品）", "授信审批", "贷后管理", "精算师（保险）"] },
      { id: "fin_back", name: "后台技术与运营类", icon: Code, positions: ["软件开发工程师（金融科技）", "数据开发", "运维工程师", "系统架构师", "运营操作岗（清算/结算）", "柜员", "客服"] },
      { id: "fin_func", name: "职能类", icon: Settings, positions: ["财务", "审计", "法律合规", "人力资源", "行政", "品牌公关"] }
    ]
  },
  {
    id: "retail",
    name: "消费品/零售/连锁",
    shortName: "消费品零售",
    icon: ShoppingCart,
    description: "快消零售连锁品牌，覆盖门店运营、电商渠道、供应链全业态岗位",
    gradient: "from-rose-500 via-pink-500 to-red-500",
    lightGradient: "from-rose-100 to-red-100",
    iconBg: "bg-gradient-to-br from-rose-500 to-red-500",
    stats: "21个热门职位",
    highlight: "品牌 · 电商 · 门店 · 供应链",
    categories: [
      { id: "retail_hq", name: "总部职能类", icon: BarChart3, positions: ["品牌经理", "市场推广", "产品经理（快消品）", "电商运营（天猫/京东/抖音）", "内容运营", "直播运营", "私域运营", "数据分析", "财务", "法务", "IT"] },
      { id: "retail_sales", name: "销售与零售运营类", icon: TrendingUp, positions: ["区域经理", "城市经理", "门店店长/店经理", "零售督导", "渠道经理", "KA经理（重点客户）", "销售代表", "导购/店员"] },
      { id: "retail_supply", name: "供应链与商品类", icon: Box, positions: ["采购经理（品类/生鲜/非食）", "供应链计划", "物流经理", "仓储主管", "商品陈列师"] },
      { id: "retail_support", name: "支持类", icon: Users, positions: ["培训专员/培训师（门店培训）", "视觉陈列", "客服经理"] }
    ]
  },
  {
    id: "consulting",
    name: "咨询/专业服务",
    shortName: "咨询专业服务",
    icon: Briefcase,
    description: "四大、律所、管理咨询、猎头，聚焦专业服务与知识型岗位",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    lightGradient: "from-sky-100 to-indigo-100",
    iconBg: "bg-gradient-to-br from-sky-500 to-indigo-500",
    stats: "16个热门职位",
    highlight: "咨询 · 审计 · 法律 · 研究",
    categories: [
      { id: "cons_pro", name: "专业服务类", icon: GraduationCap, positions: ["咨询顾问（战略/管理/IT/人力/财务等）", "高级顾问/经理", "分析师", "审计员/审计经理", "税务专员/经理", "律师/律师助理", "法务顾问"] },
      { id: "cons_bd", name: "业务拓展类", icon: TrendingUp, positions: ["客户经理", "商务拓展（BD）", "大客户总监", "投标专员"] },
      { id: "cons_research", name: "研究与支持类", icon: Search, positions: ["行业研究员", "数据分析师", "知识管理专员", "市场调研员"] },
      { id: "cons_func", name: "内部职能类", icon: Settings, positions: ["财务", "IT支持", "人力资源（内部HR）", "行政", "市场部（内容/活动）"] }
    ]
  },
  {
    id: "education",
    name: "教育/培训行业",
    shortName: "教育培训",
    icon: BookOpen,
    description: "K12、高等教育、职业培训、在线教育，涵盖教学教研、课程研发、教务管理核心岗位",
    gradient: "from-teal-500 via-cyan-500 to-sky-500",
    lightGradient: "from-teal-100 to-sky-100",
    iconBg: "bg-gradient-to-br from-teal-500 to-sky-500",
    stats: "28个热门职位",
    highlight: "教学 · 教研 · 课程 · 运营",
    categories: [
      { id: "edu_teaching", name: "教学类", icon: GraduationCap, positions: ["学科教师（语数英理化生政史地）", "幼教老师/幼儿园教师", "小学/初中/高中教师", "国际学校教师（IB/AP/A-Level）", "特教老师（特殊教育）", "艺术类教师（音乐/美术/舞蹈）", "体育教师", "心理咨询师/心理老师"] },
      { id: "edu_research", name: "教研与课程类", icon: BookOpen, positions: ["教研员/教学研究员", "课程设计师", "教材编辑", "教学产品经理", "STEAM教育研发", "在线课程策划", "题库研发专员", "教育内容主编"] },
      { id: "edu_training", name: "培训与企业大学类", icon: Mic2, positions: ["企业培训师", "培训经理/总监", "企业大学运营", "学习发展专员（L&D）", "培训课程开发", "内训师", "培训运营专员", "领导力培训顾问"] },
      { id: "edu_online", name: "在线教育与运营类", icon: Globe, positions: ["在线教育运营", "直播课运营/助教", "社群运营（教育）", "用户增长（教育产品）", "私域运营（教育）", "学习顾问/班主任", "课程顾问/销售", "教育产品运营"] },
      { id: "edu_admin", name: "教务与管理类", icon: Users, positions: ["教务主管/经理", "校区校长/园长", "招生主管/经理", "学生事务主管", "学术总监/教学总监", "年级组长/学科组长", "升学指导老师", "留学顾问"] },
      { id: "edu_func", name: "职能支持类", icon: Settings, positions: ["教育行业HR", "教育行业财务", "市场营销（教育）", "品牌推广（教育机构）", "IT运维（教育科技）", "行政后勤"] }
    ]
  }
];

// 经验等级配置
const experienceLevels = [
  { id: "beginner", name: "应届生/实习", description: "即将毕业或刚入行，关注基础能力与学习潜力", icon: "🎓" },
  { id: "junior", name: "1-3年经验", description: "有一定工作经验，关注技能深化与项目经验", icon: "🚀" },
  { id: "mid", name: "3-5年经验", description: "资深从业者，关注专业深度与独立解决问题能力", icon: "💪" },
  { id: "senior", name: "5-10年经验", description: "专家级别，关注战略思维与团队管理能力", icon: "⭐" },
  { id: "expert", name: "10年以上经验", description: "高管级别，关注领导力与行业洞察", icon: "👑" }
];

// 消息类型
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// API历史消息类型
interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

// 面试阶段
type InterviewStage = "industry" | "category" | "position" | "experience" | "interview" | "ended";

export default function MockInterviewPage() {
  // 面试状态
  const [stage, setStage] = useState<InterviewStage>("industry");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<HistoryMessage[]>([]);
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 选择行业
  const selectIndustry = (industryId: string) => {
    setSelectedIndustry(industryId);
    setSelectedCategory(null);
    setSelectedPosition(null);
    setStage("category");
  };

  // 选择职位类别
  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedPosition(null);
    setStage("position");
  };

  // 选择具体职位
  const selectPosition = (position: string) => {
    setSelectedPosition(position);
    setStage("experience");
  };

  // 开始面试
  const startInterview = async () => {
    if (!selectedIndustry || !selectedPosition || !selectedExperience) return;
    setStage("interview");
    setIsLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          industry: selectedIndustry,
          position: selectedPosition,
          userExperience: selectedExperience
        })
      });

      const data = await response.json();

      if (data.success) {
        setChatHistory(data.history);
        setMessages([{ id: Date.now().toString(), role: "assistant", content: data.message, timestamp: new Date() }]);
      } else {
        setMessages([{ id: Date.now().toString(), role: "assistant", content: `面试开始遇到问题：${data.error}`, timestamp: new Date() }]);
      }
    } catch {
      setMessages([{ id: Date.now().toString(), role: "assistant", content: "网络连接出现问题，请检查网络后重试。", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: inputValue.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "chat", 
          message: userMessage.content, 
          history: chatHistory 
        })
      });

      const data = await response.json();

      if (data.success) {
        setChatHistory(data.history);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.message, timestamp: new Date() }]);
        if (data.ended) setStage("ended");
      } else {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: `发生错误：${data.error}`, timestamp: new Date() }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "网络连接出现问题，请重试。", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 重新开始
  const restartInterview = () => {
    setStage("industry");
    setSelectedIndustry(null);
    setSelectedCategory(null);
    setSelectedPosition(null);
    setSelectedExperience(null);
    setMessages([]);
    setInputValue("");
    setChatHistory([]);
  };

  // 获取信息
  const getIndustryInfo = () => industries.find(i => i.id === selectedIndustry);
  const getCategoryInfo = () => getIndustryInfo()?.categories.find(c => c.id === selectedCategory);
  const getExperienceInfo = () => experienceLevels.find(e => e.id === selectedExperience);

  // ========== 渲染行业选择界面 ==========
  if (stage === "industry") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200/30 dark:bg-cyan-900/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/20 dark:bg-amber-900/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
          {/* 标题区域 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 border border-violet-200/50 dark:border-violet-800/50 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">AI模拟面试助手</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">选择你的目标行业</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              选择你想应聘的行业，系统将为你匹配对应行业的<span className="font-medium text-foreground">资深HR面试官</span>
            </p>
          </div>

          {/* 行业卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
            {industries.map((industry) => {
              const Icon = industry.icon;
              const isHovered = hoveredIndustry === industry.id;

              return (
                <div key={industry.id} className="group relative cursor-pointer" onMouseEnter={() => setHoveredIndustry(industry.id)} onMouseLeave={() => setHoveredIndustry(null)} onClick={() => selectIndustry(industry.id)}>
                  {/* 发光效果 */}
                  <div className={`absolute inset-0 rounded-3xl transition-all duration-500 bg-gradient-to-r ${industry.gradient} opacity-0 blur-xl ${isHovered ? "opacity-30" : ""}`} />

                  {/* 卡片主体 */}
                  <div className={`relative h-full bg-white dark:bg-slate-900/80 rounded-3xl p-6 border-2 transition-all duration-300 ${isHovered ? "border-transparent shadow-2xl scale-[1.02] -translate-y-1" : "border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl"}`}>
                    {/* 顶部渐变条 */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r ${industry.gradient} transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-60"}`} />

                    {/* 图标 */}
                    <div className={`inline-flex p-4 rounded-2xl mb-5 transition-all duration-300 ${industry.iconBg} shadow-lg ${isHovered ? "scale-110 shadow-xl" : ""}`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* 标题 */}
                    <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isHovered ? "bg-gradient-to-r " + industry.gradient + " bg-clip-text text-transparent" : "text-slate-900 dark:text-white"}`}>
                      {industry.shortName}
                    </h3>

                    {/* 统计 */}
                    <p className={`text-sm font-medium bg-gradient-to-r ${industry.gradient} bg-clip-text text-transparent mb-3`}>
                      {industry.stats}
                    </p>

                    {/* 描述 */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {industry.description}
                    </p>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {industry.highlight.split("·").map((tag, i) => (
                        <span key={i} className={`text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${industry.lightGradient} text-slate-600 dark:text-slate-300`}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>

                    {/* 进入按钮 */}
                    <div className={`flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r ${industry.gradient} text-white text-sm font-medium transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-90"}`}>
                      开始选择
                      <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部提示 */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              💡 选择行业后，将进一步选择具体职位类别和岗位
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========== 渲染职位类别选择界面 ==========
  if (stage === "category") {
    const industry = getIndustryInfo();
    if (!industry) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI模拟面试助手
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">选择职位类别</h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <span>当前行业：</span>
              <Badge className={`bg-gradient-to-r ${industry.gradient} text-white border-0`}>
                {industry.name}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {industry.categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <Card key={category.id} className={`cursor-pointer transition-all duration-200 group ${isSelected ? "ring-2 ring-offset-2 ring-offset-background shadow-lg" : "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"}`} onClick={() => selectCategory(category.id)}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2.5 rounded-xl ${industry.iconBg} shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold">{category.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {category.positions.slice(0, 2).join("、")}...
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{category.positions.length}个职位</Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setStage("industry")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              返回选择行业
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ========== 渲染具体职位选择界面 ==========
  if (stage === "position") {
    const industry = getIndustryInfo();
    const category = getCategoryInfo();
    if (!industry || !category) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI模拟面试助手
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">选择具体职位</h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground flex-wrap">
              <Badge className={`bg-gradient-to-r ${industry.gradient} text-white border-0`}>
                {industry.shortName}
              </Badge>
              <span>·</span>
              <span className="font-medium text-primary">{category.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {category.positions.map((position) => {
              const isSelected = selectedPosition === position;

              return (
                <Card key={position} className={`cursor-pointer transition-all duration-200 ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md" : "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"}`} onClick={() => selectPosition(position)}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-medium text-sm">{position}</span>
                    {isSelected && <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${industry.gradient}`} />}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setStage("category")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              返回选择类别
            </Button>
            <Button size="lg" disabled={!selectedPosition} onClick={() => setStage("experience")}>
              下一步
              <ChevronRight className="w-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ========== 渲染经验等级选择界面 ==========
  if (stage === "experience") {
    const industry = getIndustryInfo();
    const category = getCategoryInfo();
    if (!industry || !category || !selectedPosition) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI模拟面试助手
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">选择你的经验等级</h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground flex-wrap">
              <Badge className={`bg-gradient-to-r ${industry.gradient} text-white border-0`}>{industry.shortName}</Badge>
              <span>·</span>
              <span>{category.name}</span>
              <span>·</span>
              <span className="font-medium text-primary">{selectedPosition}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {experienceLevels.map((level) => {
              const isSelected = selectedExperience === level.id;

              return (
                <Card key={level.id} className={`cursor-pointer transition-all duration-200 ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg" : "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"}`} onClick={() => setSelectedExperience(level.id)}>
                  <CardContent className="p-5 text-center">
                    <div className="text-3xl mb-3">{level.icon}</div>
                    <h3 className="font-semibold mb-2">{level.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{level.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setStage("position")}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              返回选择职位
            </Button>
            <Button size="lg" disabled={!selectedExperience} onClick={startInterview} className={`bg-gradient-to-r ${industry.gradient} hover:opacity-90`}>
              <Zap className="w-4 h-4 mr-2" />
              开始模拟面试
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ========== 渲染面试界面 ==========
  const industry = getIndustryInfo();
  const experience = getExperienceInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${industry?.iconBg} shadow-md`}>
                {industry && <industry.icon className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="font-semibold">{selectedPosition}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">{experience?.name}</Badge>
                  <span className="hidden sm:inline">· {industry?.shortName}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={restartInterview}>
              <RotateCcw className="w-4 h-4 mr-2" />
              重新开始
            </Button>
          </div>
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-180px)]" ref={scrollRef}>
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-slate-100 dark:bg-slate-800"}>
                      {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-white dark:bg-slate-800 border shadow-sm"}`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <div className={`text-xs mt-2 ${message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {message.timestamp.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white dark:bg-slate-800 border shadow-sm rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">正在思考...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* 输入区域 */}
      <div className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          {stage === "ended" ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">🎉 面试已结束，祝你求职顺利！</p>
              <Button onClick={restartInterview}>
                <RotateCcw className="w-4 h-4 mr-2" />
                开始新一轮面试
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入你的回答..."
                className="min-h-[44px] max-h-32 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={!inputValue.trim() || isLoading} className="h-11 px-4">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// Build timestamp: 1774769899
// force rebuild 1774770798
