import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const tabs = [
  ["bank", "题库", "M4 6h16M4 12h16M4 18h7"],
  ["exam", "考试", "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"],
  ["wrong", "错题本", "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"],
  ["knowledge", "知识点", "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"],
  ["history", "历史", "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"],
  ["help", "帮助", "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01"]
];

const sampleBank = {
  id: "sample-econ-finance",
  exam_title: "经济学与金融学基础模拟考试",
  description: "覆盖宏观经济、金融市场、财务分析与基础会计的示例题库（含填空与简答示例）。",
  time_limit_minutes: 45,
  pass_score_percent: 60,
  questions: [
    { id: "q001", type: "single_choice", content: "在支出法核算 GDP 时，下列哪一项通常不计入当期国内生产总值？", options: [{ label: "A", text: "家庭购买新生产的家用电器" }, { label: "B", text: "企业购买当年生产的新设备" }, { label: "C", text: "居民购买二手住房" }, { label: "D", text: "政府购买公共服务" }], correct_answer: "C", explanation: "GDP 衡量一定时期内一国境内新生产的最终产品和服务价值。二手住房交易只是既有资产所有权转移，房屋本身已经在建成时计入过 GDP。", knowledge_tags: ["GDP核算", "宏观经济"], difficulty: "easy" },
    { id: "q002", type: "single_choice", content: "中央银行通过公开市场操作买入政府债券，最直接的货币政策效果通常是：", options: [{ label: "A", text: "回笼基础货币并推高市场利率" }, { label: "B", text: "投放基础货币并降低短期利率压力" }, { label: "C", text: "提高商业银行法定准备金率" }, { label: "D", text: "直接增加政府财政收入" }], correct_answer: "B", explanation: "央行买入政府债券时向市场支付资金，基础货币增加，短期利率面临下行压力。这是扩张性货币政策工具。", knowledge_tags: ["货币政策", "公开市场操作"], difficulty: "medium" },
    { id: "q003", type: "single_choice", content: "在其他条件不变时，如果某商品消费者收入上升且该商品为正常品，则其需求曲线最可能：", options: [{ label: "A", text: "向左移动" }, { label: "B", text: "沿曲线向下移动" }, { label: "C", text: "向右移动" }, { label: "D", text: "保持不变" }], correct_answer: "C", explanation: "正常品的需求与收入同向变化，收入上升使任一给定价格下的购买意愿增加，整条需求曲线向右移动。", knowledge_tags: ["供需分析", "需求曲线"], difficulty: "easy" },
    { id: "q004", type: "multiple_choice", content: "关于资产负债表、利润表和现金流量表之间的关系，下列说法正确的有：", options: [{ label: "A", text: "利润表中的净利润会影响资产负债表中的留存收益" }, { label: "B", text: "现金流量表解释现金及现金等价物变动的来源" }, { label: "C", text: "资产负债表反映某一期间的经营成果" }, { label: "D", text: "三张报表可以相互勾稽，用于检查财务数据一致性" }], correct_answer: ["A", "B", "D"], explanation: "利润表的净利润影响留存收益；现金流量表说明现金变动来源；资产负债表是时点报表而非期间报表，C 错误。", knowledge_tags: ["财务报表", "财务分析"], difficulty: "medium" },
    { id: "q005", type: "multiple_choice", content: "资本资产定价模型 CAPM 的常见假设包括：", options: [{ label: "A", text: "投资者只关心收益均值和方差" }, { label: "B", text: "存在无风险资产且投资者可以按无风险利率借贷" }, { label: "C", text: "市场存在显著交易成本和信息不对称" }, { label: "D", text: "投资者具有同质预期" }], correct_answer: ["A", "B", "D"], explanation: "标准 CAPM 建立在均值-方差偏好、无风险借贷、同质预期等假设之上。显著交易成本和信息不对称会破坏理想化条件。", knowledge_tags: ["CAPM", "资产定价"], difficulty: "hard" },
    { id: "q006", type: "true_false", content: "会计恒等式可以表示为：资产 = 负债 + 所有者权益。", correct_answer: true, explanation: "该等式是复式记账和资产负债表的基础，每笔经济业务都保持等式成立。", knowledge_tags: ["会计恒等式", "会计基础"], difficulty: "easy" },
    { id: "q007", type: "true_false", content: "比较优势理论说明，即使一国在所有产品上都有绝对优势，贸易仍可能使双方受益。", correct_answer: true, explanation: "比较优势强调机会成本而非绝对效率，只要各国相对成本不同，专业化交换仍可扩大总体消费组合。", knowledge_tags: ["比较优势", "国际贸易"], difficulty: "easy" },
    { id: "q008", type: "fill_in_blank", content: "费雪方程式表明，名义利率大致等于______加上预期通货膨胀率。", correct_answer: ["实际利率"], accept_keywords: ["实际利率", "真实利率", "real interest rate"], explanation: "费雪效应描述名义利率 ≈ 实际利率 + 预期通胀率。严格形式含乘积项，但低利率低通胀下近似成立。", knowledge_tags: ["费雪效应", "利率理论"], difficulty: "medium" },
    { id: "q009", type: "fill_in_blank", content: "在浮动汇率制度下，本币汇率主要由外汇市场的______决定。", correct_answer: ["供求关系"], accept_keywords: ["供求关系", "供给与需求", "供需", "supply and demand"], explanation: "浮动汇率制度下汇率由外汇市场供求决定，资本流动、贸易收支、利率差异和预期都影响供求。", knowledge_tags: ["汇率机制", "国际金融"], difficulty: "easy" },
    { id: "q010", type: "short_answer", content: "请简述有效市场假说的三个层次及其含义。", correct_answer: "有效市场假说分为弱式有效、半强式有效和强式有效。弱式有效指价格已反映全部历史交易信息；半强式有效指价格反映所有公开信息；强式有效指价格反映包括内幕信息在内的所有信息。", scoring_keywords: ["弱式有效", "半强式有效", "强式有效", "历史信息", "公开信息", "内幕信息"], explanation: "弱式强调历史交易信息已反映在价格中，半强式涵盖所有公开信息，强式进一步包含非公开信息。", knowledge_tags: ["有效市场假说", "金融市场"], difficulty: "hard" }
  ]
};

const typeText = { single_choice: "单选", multiple_choice: "多选", true_false: "判断", fill_in_blank: "填空", short_answer: "简答" };
const diffText = { easy: "简单", medium: "中等", hard: "困难" };
const diffColor = { easy: "emerald", medium: "amber", hard: "rose" };

const emptyConfig = { mode: "all", count: 5, timerMode: "bank", customMinutes: 30, shuffle: true, tags: [], difficulties: ["easy", "medium", "hard"], wrongOnly: false };

function normalizeBank(bank) {
  return { ...bank, id: bank.id || `bank-${Date.now()}`, exam_title: bank.exam_title || "未命名题库", description: bank.description || "", questions: Array.isArray(bank.questions) ? bank.questions.filter(Boolean) : [] };
}

function validateBank(bank) {
  if (!bank || typeof bank !== "object") return "题库必须是一个 JSON 对象。";
  if (!bank.exam_title || !Array.isArray(bank.questions)) return "缺少 exam_title 或 questions 字段。";
  if (!bank.questions.length) return "题库至少需要包含 1 道题。";
  for (const q of bank.questions) {
    if (!q.id || !q.type || !q.content || !q.explanation || !Array.isArray(q.knowledge_tags)) return `题目 ${q.id || "未命名"} 缺少必要字段。`;
    if (!["single_choice", "multiple_choice", "true_false", "fill_in_blank", "short_answer"].includes(q.type)) return `题目 ${q.id} 的 type 不受支持（支持 single_choice/multiple_choice/true_false/fill_in_blank/short_answer）。`;
    if (!["easy", "medium", "hard"].includes(q.difficulty)) return `题目 ${q.id} 的 difficulty 必须是 easy、medium 或 hard。`;
    if ((q.type === "single_choice" || q.type === "multiple_choice") && !Array.isArray(q.options)) return `题目 ${q.id} 必须提供 options。`;
    if (q.type === "multiple_choice" && !Array.isArray(q.correct_answer)) return `题目 ${q.id} 的 correct_answer 必须是数组。`;
    if (q.type === "fill_in_blank" && !q.correct_answer && !q.accept_keywords) return `填空题 ${q.id} 需要 correct_answer 或 accept_keywords。`;
    if (q.type === "short_answer" && !q.correct_answer && !q.scoring_keywords) return `简答题 ${q.id} 需要 correct_answer 或 scoring_keywords。`;
  }
  return "";
}

function fisherYatesShuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeText(s) {
  return String(s || "").trim().toLowerCase().replace(/\s+/g, "");
}

function sameAnswer(question, answer) {
  if (question.type === "multiple_choice") {
    const a = Array.isArray(answer) ? [...answer].sort().join("|") : "";
    return a === [...question.correct_answer].sort().join("|");
  }
  if (question.type === "fill_in_blank") {
    const userText = normalizeText(answer);
    if (!userText) return false;
    const keywords = question.accept_keywords || (Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer]);
    return keywords.some((kw) => normalizeText(kw) === userText || userText.includes(normalizeText(kw)));
  }
  if (question.type === "short_answer") {
    const userText = normalizeText(answer);
    if (!userText) return false;
    const keywords = question.scoring_keywords || [];
    if (!keywords.length) return userText.length >= 10;
    const matched = keywords.filter((kw) => userText.includes(normalizeText(kw)));
    return matched.length >= Math.ceil(keywords.length * 0.5);
  }
  return answer === question.correct_answer;
}

function shortAnswerScore(question, answer) {
  const userText = normalizeText(answer);
  if (!userText) return { matched: 0, total: 0, ratio: 0 };
  const keywords = question.scoring_keywords || [];
  if (!keywords.length) return { matched: userText.length >= 10 ? 1 : 0, total: 1, ratio: userText.length >= 10 ? 1 : 0 };
  const matched = keywords.filter((kw) => userText.includes(normalizeText(kw)));
  return { matched: matched.length, total: keywords.length, ratio: keywords.length ? matched.length / keywords.length : 0 };
}

function questionKey(q) { return `${q.__bankId || "bank"}:${q.id}`; }
function questionTags(q) { return Array.isArray(q?.knowledge_tags) ? q.knowledge_tags : []; }

function answerText(question, answer) {
  if (answer === undefined || answer === null || answer === "" || (Array.isArray(answer) && !answer.length)) return "未作答";
  if (question.type === "true_false") return answer ? "正确" : "错误";
  if (question.type === "fill_in_blank" || question.type === "short_answer") return String(answer);
  const fmt = (label) => { const o = question.options?.find((i) => i.label === label); return o ? `${label}. ${o.text}` : label; };
  return Array.isArray(answer) ? answer.map(fmt).join("；") : fmt(answer);
}

function correctAnswerText(question) {
  if (question.type === "true_false") return question.correct_answer ? "正确" : "错误";
  if (question.type === "fill_in_blank") {
    const kw = question.accept_keywords || (Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer]);
    return kw.join(" / ");
  }
  if (question.type === "short_answer") return String(question.correct_answer || "(参考答案见解析)");
  const fmt = (label) => { const o = question.options?.find((i) => i.label === label); return o ? `${label}. ${o.text}` : label; };
  return Array.isArray(question.correct_answer) ? question.correct_answer.map(fmt).join("；") : fmt(question.correct_answer);
}

function formatSeconds(total) {
  const m = Math.floor(total / 60); const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

function countBy(items, getter) {
  return items.reduce((acc, item) => { const k = getter(item); acc[k] = (acc[k] || 0) + 1; return acc; }, {});
}

// ─── Toast ───
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((text, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, text, type, leaving: false }]);
    setTimeout(() => { setToasts((p) => p.map((t) => t.id === id ? { ...t, leaving: true } : t)); setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 300); }, duration);
  }, []);
  return { toasts, toast: add };
}

function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  const icons = { success: "M5 13l4 4L19 7", error: "M6 18L18 6M6 6l12 12", info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" };
  const colors = { success: "border-emerald-200 bg-emerald-50 text-emerald-800", error: "border-red-200 bg-red-50 text-red-800", info: "border-blue-200 bg-blue-50 text-blue-800" };
  const ic = { success: "text-emerald-500", error: "text-red-500", info: "text-blue-500" };
  return (
    <div className="fixed right-4 top-20 z-50 flex flex-col gap-2" style={{ maxWidth: 380 }}>
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${colors[t.type]} ${t.leaving ? "animate-slide-out" : "animate-slide-in"}`}>
          <svg className={`mt-0.5 h-5 w-5 shrink-0 ${ic[t.type]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={icons[t.type]} /></svg>
          <span className="text-sm leading-relaxed">{t.text}</span>
        </div>
      ))}
    </div>
  );
}

// ─── UI Primitives ───
function Icon({ d, className = "h-5 w-5" }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>;
}

function Panel({ title, icon, children, extra, className = "" }) {
  return (
    <section className={`rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon && <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Icon d={icon} className="h-4.5 w-4.5" /></div>}
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
        {extra}
      </div>
      {children}
    </section>
  );
}

function Button({ children, tone = "primary", size = "md", className = "", ...props }) {
  const tones = { primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-600/20", secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 shadow-sm", danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm shadow-red-500/20", success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-600/20", warning: "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm shadow-amber-500/20", ghost: "text-slate-600 hover:bg-slate-100 active:bg-slate-200" };
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-2.5 text-sm" };
  return <button className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}

function StatCard({ label, value, tone }) {
  const bg = { blue: "from-blue-50 to-blue-100/50 border-blue-100", green: "from-emerald-50 to-emerald-100/50 border-emerald-100", red: "from-red-50 to-red-100/50 border-red-100", default: "from-slate-50 to-slate-100/50 border-slate-100" };
  const text = { blue: "text-blue-700", green: "text-emerald-700", red: "text-red-700", default: "text-slate-900" };
  return <div className={`stat-card rounded-xl border bg-gradient-to-br p-4 ${bg[tone || "default"]}`}><div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div><div className={`mt-1.5 text-2xl font-bold ${text[tone || "default"]}`}>{value}</div></div>;
}

function ProgressBar({ value, max, tone = "blue", className = "" }) {
  const colors = { blue: "bg-blue-500", green: "bg-emerald-500", red: "bg-red-500", amber: "bg-amber-500", slate: "bg-slate-400" };
  const w = max ? Math.round((value / max) * 100) : 0;
  return <div className={`space-y-1.5 ${className}`}><div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all duration-500 ${colors[tone]}`} style={{ width: `${w}%` }} /></div></div>;
}

function Bar({ label, value, max, tone = "blue" }) {
  const colors = { blue: "bg-blue-500", green: "bg-emerald-500", red: "bg-red-500", amber: "bg-amber-500", slate: "bg-slate-400" };
  const w = max ? Math.round((value / max) * 100) : 0;
  return <div className="space-y-1"><div className="flex justify-between text-sm"><span className="text-slate-600">{label}</span><span className="font-medium text-slate-900">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all duration-500 ${colors[tone]}`} style={{ width: `${w}%` }} /></div></div>;
}

function Badge({ children, tone = "blue" }) {
  const colors = { blue: "bg-blue-50 text-blue-700 border-blue-200", green: "bg-emerald-50 text-emerald-700 border-emerald-200", red: "bg-red-50 text-red-700 border-red-200", amber: "bg-amber-50 text-amber-700 border-amber-200", slate: "bg-slate-50 text-slate-600 border-slate-200", rose: "bg-rose-50 text-rose-700 border-rose-200" };
  return <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${colors[tone]}`}>{children}</span>;
}

function EmptyState({ icon, title, description }) {
  return <div className="flex flex-col items-center py-12 text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Icon d={icon} className="h-7 w-7" /></div><h3 className="text-base font-medium text-slate-700">{title}</h3>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>;
}

function FileDropZone({ onFile, accept = ".json", children }) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const readFile = (file) => { const r = new FileReader(); r.onload = (e) => onFile(e.target.result, file.name); r.readAsText(file); };
  return (
    <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={(e) => { e.preventDefault(); setDragActive(false); const f = e.dataTransfer?.files?.[0]; if (f) readFile(f); }} onClick={() => inputRef.current?.click()} className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${dragActive ? "drop-zone-active" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"}`}>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) readFile(f); e.target.value = ""; }} />
      {children}
    </div>
  );
}

// ─── Search Input ───
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      {value && <button onClick={() => onChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"><Icon d="M6 18L18 6M6 6l12 12" className="h-3.5 w-3.5" /></button>}
    </div>
  );
}

// ─── Main App ───
export default function App() {
  const [banks, setBanks] = useState([sampleBank]);
  const [activeBankId, setActiveBankId] = useState(sampleBank.id);
  const [selectedExamBankIds, setSelectedExamBankIds] = useState([sampleBank.id]);
  const [tab, setTab] = useState("bank");
  const [jsonText, setJsonText] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [config, setConfig] = useState(emptyConfig);
  const [session, setSession] = useState(null);
  const [paused, setPaused] = useState(false);
  const [pausedElapsed, setPausedElapsed] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(null);
  const [records, setRecords] = useState([]);
  const [wrongBook, setWrongBook] = useState({});
  const [reviewRecord, setReviewRecord] = useState(null);
  const [wrongFilter, setWrongFilter] = useState("all");
  const [wrongTagFilter, setWrongTagFilter] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [backendOk, setBackendOk] = useState(null);

  const { toasts, toast } = useToast();

  const activeBank = banks.find((b) => b.id === activeBankId) || banks[0];
  const selectedExamBanks = useMemo(() => { const sel = banks.filter((b) => selectedExamBankIds.includes(b.id)); return sel.length ? sel : [activeBank].filter(Boolean); }, [banks, selectedExamBankIds, activeBank]);
  const selectedQuestionPool = useMemo(() => selectedExamBanks.flatMap((b) => (Array.isArray(b.questions) ? b.questions : []).filter(Boolean).map((q) => ({ ...q, __bankId: b.id, __bankTitle: b.exam_title }))), [selectedExamBanks]);
  const allTags = useMemo(() => [...new Set(selectedQuestionPool.flatMap(questionTags))], [selectedQuestionPool]);

  const bankStats = useMemo(() => {
    const type = countBy(activeBank.questions, (q) => typeText[q.type] || q.type);
    const diff = countBy(activeBank.questions, (q) => diffText[q.difficulty]);
    const tags = activeBank.questions.reduce((acc, q) => { questionTags(q).forEach((t) => (acc[t] = (acc[t] || 0) + 1)); return acc; }, {});
    return { type, diff, tags };
  }, [activeBank]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const kw = searchQuery.trim().toLowerCase();
    return banks.flatMap((b) => b.questions.filter(Boolean).map((q) => ({ ...q, __bankId: b.id, __bankTitle: b.exam_title })).filter((q) => q.content.toLowerCase().includes(kw) || questionTags(q).some((t) => t.toLowerCase().includes(kw)) || (q.explanation || "").toLowerCase().includes(kw)));
  }, [searchQuery, banks]);

  // ─── Effects ───
  useEffect(() => {
    let c = false;
    fetch("/api/state").then((r) => { if (!r.ok) throw new Error(); return r.json(); }).then((data) => {
      if (c) return;
      if (Array.isArray(data.banks) && data.banks.length) { const nb = data.banks.map(normalizeBank); setBanks(nb); setActiveBankId(data.activeBankId || nb[0].id); setSelectedExamBankIds([data.activeBankId || nb[0].id]); }
      if (Array.isArray(data.records)) setRecords(data.records);
      if (data.wrongBook && typeof data.wrongBook === "object") setWrongBook(data.wrongBook);
      setBackendOk(true);
    }).catch(() => { if (!c) setBackendOk(false); }).finally(() => { if (!c) setDataLoaded(true); });
    return () => { c = true; };
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    const timer = setTimeout(() => {
      fetch("/api/state", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ banks, activeBankId, records, wrongBook }) })
        .then((r) => { if (!r.ok) throw new Error(); return r.json(); }).then(() => setBackendOk(true)).catch(() => setBackendOk(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [banks, activeBankId, records, wrongBook, dataLoaded]);

  useEffect(() => {
    if (!session || remaining === null || paused) return;
    if (remaining <= 0) { submitExam(true); return; }
    const timer = setTimeout(() => setRemaining((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [session, remaining, paused]);

  useEffect(() => {
    if (!session || paused) return;
    const handler = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || e.target?.isContentEditable) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); setCurrent((v) => Math.max(0, v - 1)); }
      if (e.key === "ArrowRight") { e.preventDefault(); setCurrent((v) => Math.min(session.questions.length - 1, v + 1)); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [session, paused]);

  useEffect(() => {
    if (!banks.length) return;
    if (!banks.some((b) => b.id === activeBankId)) setActiveBankId(banks[0].id);
    const ids = new Set(banks.map((b) => b.id));
    setSelectedExamBankIds((prev) => { const next = prev.filter((id) => ids.has(id)); return next.length ? next : [banks[0].id]; });
  }, [banks, activeBankId]);

  // ─── Actions ───
  function handleTabChange(newTab) {
    if (session && newTab !== "exam" && !window.confirm("考试正在进行中，确定离开？")) return;
    setTab(newTab);
  }

  function tryParseAndImport(text) {
    try {
      const parsed = normalizeBank(JSON.parse(text));
      const error = validateBank(parsed);
      if (error) { toast(error, "error"); return; }
      setBanks((prev) => [...prev, parsed]);
      setActiveBankId(parsed.id);
      setSelectedExamBankIds((prev) => [...new Set([...prev, parsed.id])]);
      setJsonText("");
      toast(`题库「${parsed.exam_title}」导入成功，共 ${parsed.questions.length} 道题`, "success");
    } catch (err) { toast(`JSON 解析失败：${err.message}`, "error", 5000); }
  }

  function exportAll() { downloadJson("personal-exam-data.json", { banks, activeBankId, records, wrongBook, exported_at: new Date().toISOString() }); toast("数据已导出", "success"); }

  function handleDataRestore(content) {
    try {
      const data = JSON.parse(content);
      if (!Array.isArray(data.banks) || !data.banks.length) { toast("恢复数据必须包含 banks 数组", "error"); return; }
      setBanks(data.banks.map(normalizeBank)); setActiveBankId(data.activeBankId || data.banks[0].id); setSelectedExamBankIds([data.activeBankId || data.banks[0].id]);
      setRecords(Array.isArray(data.records) ? data.records : []); setWrongBook(data.wrongBook || {});
      toast(`数据恢复成功，共 ${data.banks.length} 个题库`, "success");
    } catch (err) { toast(`恢复失败：${err.message}`, "error"); }
  }

  function toggleExamBank(bankId) { setSelectedExamBankIds((prev) => { if (prev.includes(bankId)) { const n = prev.filter((id) => id !== bankId); return n.length ? n : prev; } return [...prev, bankId]; }); }

  function deleteBank(bankId) {
    if (banks.length <= 1) { toast("至少需要保留一个题库", "error"); return; }
    const bank = banks.find((b) => b.id === bankId);
    if (!bank || !window.confirm(`确认删除题库「${bank.exam_title}」？`)) return;
    const next = banks.filter((b) => b.id !== bankId); setBanks(next);
    if (activeBankId === bankId) setActiveBankId(next[0].id);
    setSelectedExamBankIds((prev) => { const n = prev.filter((id) => id !== bankId); return n.length ? n : [next[0].id]; });
    setWrongBook((prev) => Object.fromEntries(Object.entries(prev).filter(([, v]) => v.bankId !== bankId)));
    toast("题库已删除", "info");
  }

  function filteredQuestions() {
    let qs = selectedQuestionPool;
    if (config.tags.length) qs = qs.filter((q) => questionTags(q).some((t) => config.tags.includes(t)));
    if (config.difficulties.length) qs = qs.filter((q) => config.difficulties.includes(q.difficulty));
    if (config.wrongOnly) {
      const bids = new Set(selectedExamBanks.map((b) => b.id));
      const wids = new Set(Object.values(wrongBook).filter((i) => bids.has(i.bankId) && !i.mastered).map((i) => `${i.bankId}:${i.questionId}`));
      qs = qs.filter((q) => wids.has(`${q.__bankId}:${q.id}`));
    }
    if (config.shuffle) qs = fisherYatesShuffle(qs);
    if (config.mode === "random") qs = qs.slice(0, Math.max(1, Number(config.count) || 1));
    return qs;
  }

  function startExam() {
    const qs = filteredQuestions();
    if (!qs.length) { toast("当前筛选条件下没有可用题目", "error"); return; }
    let minutes = null;
    if (config.timerMode === "bank") minutes = Math.max(...selectedExamBanks.map((b) => Number(b.time_limit_minutes) || 0));
    if (config.timerMode === "custom") minutes = Number(config.customMinutes) || 0;
    const bankTitle = selectedExamBanks.length === 1 ? selectedExamBanks[0].exam_title : `${selectedExamBanks.length} 个题库联合考试`;
    const passScorePercent = Math.round(selectedExamBanks.reduce((sum, b) => sum + (Number(b.pass_score_percent) || 60), 0) / selectedExamBanks.length);
    setSession({ id: `record-${Date.now()}`, bankId: selectedExamBanks.map((b) => b.id).join(","), bankIds: selectedExamBanks.map((b) => b.id), bankTitle, passScorePercent, questions: qs, startedAt: Date.now() });
    setAnswers({}); setMarked([]); setCurrent(0); setRemaining(minutes ? minutes * 60 : null); setReviewRecord(null); setPaused(false); setPausedElapsed(0); setTab("exam");
  }

  function updateAnswer(question, value) {
    setAnswers((prev) => {
      const key = questionKey(question);
      if (question.type === "multiple_choice") { const cur = Array.isArray(prev[key]) ? prev[key] : []; return { ...prev, [key]: cur.includes(value) ? cur.filter((i) => i !== value) : [...cur, value] }; }
      if (question.type === "fill_in_blank" || question.type === "short_answer") return { ...prev, [key]: value };
      return { ...prev, [key]: prev[key] === value ? undefined : value };
    });
  }

  function togglePause() {
    if (paused) { if (remaining !== null) { setRemaining((v) => v); } setPaused(false); toast("考试已恢复", "info"); }
    else { setPaused(true); toast("考试已暂停，计时停止", "info"); }
  }

  function cancelExam() {
    if (!session) return;
    if (!window.confirm("确认放弃本次考试？答题记录不会保存。")) return;
    setSession(null); setRemaining(null); setPaused(false); setPausedElapsed(0); toast("已放弃考试", "info");
  }

  function submitExam(timeUp = false) {
    if (!session) return;
    if (!timeUp && !window.confirm("确认交卷？")) return;
    const finishedAt = Date.now();
    const details = session.questions.map((q) => ({ question: q, answer: answers[questionKey(q)], correct: sameAnswer(q, answers[questionKey(q)]) }));
    const correctCount = details.filter((i) => i.correct).length;
    const record = { id: session.id, bankId: session.bankId, bankIds: session.bankIds, bankTitle: session.bankTitle, passScorePercent: session.passScorePercent || 60, createdAt: new Date().toISOString(), durationSeconds: Math.round((finishedAt - session.startedAt) / 1000), scorePercent: Math.round((correctCount / details.length) * 100), correctCount, total: details.length, details };
    const nw = { ...wrongBook };
    details.forEach((item) => {
      const bid = item.question.__bankId || session.bankId; const key = `${bid}:${item.question.id}`;
      if (!item.correct) { const old = nw[key] || { bankId: bid, questionId: item.question.id, count: 0, answers: [] }; nw[key] = { ...old, bankId: bid, question: item.question, count: old.count + 1, lastWrongAt: record.createdAt, lastAnswer: item.answer, mastered: false, answers: [...(old.answers || []), item.answer].slice(-5) }; }
      else if (nw[key]) { nw[key] = { ...nw[key], mastered: true }; }
    });
    setRecords((prev) => [record, ...prev]); setWrongBook(nw); setReviewRecord(record); setSession(null); setRemaining(null); setPaused(false); setPausedElapsed(0);
    if (timeUp) toast("时间到，已自动交卷", "info");
  }

  function startWrongPractice(filterTag = "") {
    const bids = new Set(banks.map((b) => b.id));
    let items = Object.values(wrongBook).filter((i) => bids.has(i.bankId) && !i.mastered);
    if (filterTag) items = items.filter((i) => questionTags(i.question).includes(filterTag));
    const wids = new Set(items.map((i) => `${i.bankId}:${i.questionId}`));
    const pool = banks.flatMap((b) => b.questions.filter(Boolean).map((q) => ({ ...q, __bankId: b.id, __bankTitle: b.exam_title })));
    const qs = fisherYatesShuffle(pool.filter((q) => wids.has(`${q.__bankId}:${q.id}`)));
    if (!qs.length) { toast("没有未掌握的错题", "info"); return; }
    setSession({ id: `record-${Date.now()}`, bankId: "wrong-practice", bankIds: [...bids], bankTitle: filterTag ? `错题重练：${filterTag}` : "错题重练", passScorePercent: 60, questions: qs, startedAt: Date.now() });
    setAnswers({}); setMarked([]); setCurrent(0); setRemaining(null); setReviewRecord(null); setPaused(false); setPausedElapsed(0); setTab("exam");
  }

  function tagPerformance(src = records) {
    const stats = {};
    src.forEach((r) => { r.details.forEach(({ question, correct }) => { questionTags(question).forEach((tag) => { if (!stats[tag]) stats[tag] = { total: 0, correct: 0, history: [] }; stats[tag].total += 1; stats[tag].correct += correct ? 1 : 0; stats[tag].history.push(correct ? 1 : 0); }); }); });
    return stats;
  }

  const wrongItems = Object.values(wrongBook).filter((i) => {
    if (wrongFilter === "active" && i.mastered) return false;
    if (wrongFilter === "mastered" && !i.mastered) return false;
    if (wrongTagFilter && !questionTags(i.question).includes(wrongTagFilter)) return false;
    return true;
  });
  const activeWrongCount = Object.values(wrongBook).filter((i) => !i.mastered).length;
  const wrongTags = useMemo(() => [...new Set(Object.values(wrongBook).filter((i) => !i.mastered).flatMap((i) => questionTags(i.question)))], [wrongBook]);
  const performance = tagPerformance();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <ToastContainer toasts={toasts} />

      <header className="glass-header sticky top-0 z-30 border-b border-slate-200/60">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-600/30">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div className="hidden sm:block"><h1 className="text-base font-semibold leading-tight">模拟考试</h1><p className="text-xs text-slate-500">AI 题库 · 自动判分 · 复盘分析</p></div>
          </div>
          <nav className="flex items-center gap-1 rounded-xl bg-slate-100/80 p-1">
            {tabs.map(([id, label, iconD]) => (
              <button key={id} onClick={() => handleTabChange(id)} className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${tab === id ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                <Icon d={iconD} className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
                {id === "wrong" && activeWrongCount > 0 && <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{activeWrongCount}</span>}
              </button>
            ))}
          </nav>
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${backendOk === true ? "bg-emerald-50 text-emerald-700" : backendOk === false ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${backendOk === true ? "bg-emerald-500" : backendOk === false ? "bg-amber-500 animate-pulse-slow" : "bg-slate-400"}`} />
            {backendOk === true ? "已同步" : backendOk === false ? "离线" : "连接中"}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1080px] space-y-5 px-5 py-6 fade-in">

        {/* ══ BANK TAB ══ */}
        {tab === "bank" && (
          <div className="space-y-5">
            {/* Search */}
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="搜索题目内容、知识点或解析..." />

            {searchQuery.trim() && searchResults !== null ? (
              <Panel title={`搜索结果 · ${searchResults.length} 题`} icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                {searchResults.length === 0 ? <EmptyState icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" title="未找到匹配题目" /> : (
                  <div className="space-y-2">
                    {searchResults.slice(0, 30).map((q) => (
                      <details key={`${q.__bankId}:${q.id}`} className="group rounded-xl border border-slate-200 transition hover:border-slate-300">
                        <summary className="flex cursor-pointer items-center gap-3 p-3">
                          <Badge tone={diffColor[q.difficulty]}>{typeText[q.type]}</Badge>
                          <span className="flex-1 text-sm text-slate-800">{q.content.slice(0, 100)}</span>
                          <span className="shrink-0 text-xs text-slate-400">{q.__bankTitle}</span>
                          <Icon d="M19 9l-7 7-7-7" className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
                        </summary>
                        <div className="border-t border-slate-100 px-3 pb-3 pt-2 text-sm">
                          <div className="flex flex-wrap gap-1 mb-2">{questionTags(q).map((t) => <Badge key={t} tone="slate">{t}</Badge>)}</div>
                          <p className="text-slate-600"><span className="font-medium">正确答案：</span>{correctAnswerText(q)}</p>
                          <div className="mt-2 rounded-lg bg-slate-50 p-3 text-slate-600 leading-relaxed">{q.explanation}</div>
                        </div>
                      </details>
                    ))}
                    {searchResults.length > 30 && <p className="text-center text-xs text-slate-400">仅显示前 30 条结果</p>}
                  </div>
                )}
              </Panel>
            ) : (
              <>
                <Panel title="题库概览" icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  extra={<div className="flex items-center gap-2"><select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500" value={activeBankId} onChange={(e) => setActiveBankId(e.target.value)}>{banks.map((b) => <option key={b.id} value={b.id}>{b.exam_title}</option>)}</select><Button tone="danger" size="sm" onClick={() => deleteBank(activeBank.id)} disabled={banks.length <= 1}><Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="h-3.5 w-3.5" />删除</Button></div>}
                >
                  <div className="mb-6"><h3 className="text-xl font-bold text-slate-900">{activeBank.exam_title}</h3>{activeBank.description && <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{activeBank.description}</p>}</div>
                  <div className="grid gap-3 sm:grid-cols-3"><StatCard label="题目数量" value={activeBank.questions.length} tone="blue" /><StatCard label="建议时长" value={`${activeBank.time_limit_minutes || "不限"} 分钟`} tone="default" /><StatCard label="及格线" value={`${activeBank.pass_score_percent || 60}%`} tone="green" /></div>
                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    <div className="space-y-3"><h4 className="text-sm font-semibold text-slate-700">题型分布</h4>{Object.entries(bankStats.type).map(([k, v]) => <Bar key={k} label={k} value={v} max={activeBank.questions.length} />)}</div>
                    <div className="space-y-3"><h4 className="text-sm font-semibold text-slate-700">难度分布</h4>{Object.entries(bankStats.diff).map(([k, v]) => <Bar key={k} label={k} value={v} max={activeBank.questions.length} tone="amber" />)}</div>
                    <div className="space-y-3"><h4 className="text-sm font-semibold text-slate-700">知识点分布</h4>{Object.entries(bankStats.tags).slice(0, 6).map(([k, v]) => <Bar key={k} label={k} value={v} max={activeBank.questions.length} tone="slate" />)}</div>
                  </div>
                </Panel>

                <Panel title="导入题库" icon="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12">
                  <textarea className="h-44 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-relaxed outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10" placeholder="在此粘贴题库 JSON..." value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
                  <div className="mt-3 flex items-center gap-2">
                    <Button onClick={() => tryParseAndImport(jsonText)}>导入题库</Button>
                    <Button tone="ghost" onClick={() => setJsonText(JSON.stringify(sampleBank, null, 2))}>填入示例</Button>
                    <span className="mx-1 text-xs text-slate-300">|</span>
                    <FileDropZone onFile={(c) => tryParseAndImport(c)}>
                      <button className="text-xs font-medium text-slate-400 transition hover:text-blue-500">或拖入/选择 JSON 文件</button>
                    </FileDropZone>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">支持单选 / 多选 / 判断 / 填空 / 简答五种题型</p>
                </Panel>

                <Panel title="数据备份" icon="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5"><h4 className="text-sm font-semibold text-slate-700">导出数据</h4><p className="mt-1 text-xs text-slate-500">导出所有题库、历史记录和错题本。</p><Button className="mt-4" onClick={exportAll}><Icon d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="h-4 w-4" />导出 JSON</Button></div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5"><h4 className="text-sm font-semibold text-slate-700">恢复数据</h4><p className="mt-1 text-xs text-slate-500">从备份文件恢复。</p><FileDropZone onFile={(c) => handleDataRestore(c)}><p className="text-xs text-slate-500">拖入或点击选择备份文件</p></FileDropZone></div>
                  </div>
                </Panel>
              </>
            )}
          </div>
        )}

        {/* ══ EXAM TAB ══ */}
        {tab === "exam" && (
          <div className="space-y-5">
            {!session && !reviewRecord && (
              <Panel title="考试配置" icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                <div className="mb-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><div className="text-sm font-semibold text-slate-800">选择题库</div><div className="mt-0.5 text-xs text-slate-500">已选 {selectedExamBanks.length} 个题库 · 共 {selectedQuestionPool.length} 道题</div></div><div className="flex gap-2"><Button tone="ghost" size="sm" onClick={() => setSelectedExamBankIds(banks.map((b) => b.id))}>全选</Button><Button tone="ghost" size="sm" onClick={() => setSelectedExamBankIds([activeBank.id])}>仅当前</Button></div></div>
                  <div className="grid gap-2 md:grid-cols-2">{banks.map((bank) => { const sel = selectedExamBankIds.includes(bank.id); return <label key={bank.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all ${sel ? "border-blue-500/50 bg-blue-50/50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}><input className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600" type="checkbox" checked={sel} onChange={() => toggleExamBank(bank.id)} /><span><span className="block text-sm font-medium text-slate-800">{bank.exam_title}</span><span className="block text-xs text-slate-500">{bank.questions.length} 题 · {bank.time_limit_minutes || "不限"} 分钟</span></span></label>; })}</div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1.5"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">出题方式</span><select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500" value={config.mode} onChange={(e) => setConfig({ ...config, mode: e.target.value })}><option value="all">全部题目</option><option value="random">随机抽取</option></select></label>
                  {config.mode === "random" && <label className="space-y-1.5"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">抽题数量</span><input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500" type="number" min="1" value={config.count} onChange={(e) => setConfig({ ...config, count: e.target.value })} /></label>}
                  <label className="space-y-1.5"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">计时方式</span><select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500" value={config.timerMode} onChange={(e) => setConfig({ ...config, timerMode: e.target.value })}><option value="bank">题库设定</option><option value="custom">自定义</option><option value="none">不限时</option></select></label>
                  {config.timerMode === "custom" && <label className="space-y-1.5"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">时长（分钟）</span><input className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-blue-500" type="number" min="1" value={config.customMinutes} onChange={(e) => setConfig({ ...config, customMinutes: e.target.value })} /></label>}
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div><div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">知识点</div><div className="flex flex-wrap gap-1.5">{allTags.length === 0 && <span className="text-xs text-slate-400">无可选标签</span>}{allTags.map((tag) => { const sel = config.tags.includes(tag); return <button key={tag} onClick={() => setConfig({ ...config, tags: sel ? config.tags.filter((t) => t !== tag) : [...config.tags, tag] })} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${sel ? "border-blue-500/40 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>{tag}</button>; })}</div></div>
                  <div><div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">难度</div><div className="flex flex-wrap gap-1.5">{Object.entries(diffText).map(([k, label]) => { const sel = config.difficulties.includes(k); return <button key={k} onClick={() => setConfig({ ...config, difficulties: sel ? config.difficulties.filter((d) => d !== k) : [...config.difficulties, k] })} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${sel ? "border-blue-500/40 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>{label}</button>; })}</div></div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 rounded border-slate-300 text-blue-600" type="checkbox" checked={config.shuffle} onChange={(e) => setConfig({ ...config, shuffle: e.target.checked })} />打乱顺序</label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 rounded border-slate-300 text-blue-600" type="checkbox" checked={config.wrongOnly} onChange={(e) => setConfig({ ...config, wrongOnly: e.target.checked })} />仅错题</label>
                </div>
                <div className="mt-6"><Button size="lg" onClick={startExam}><Icon d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" className="h-4 w-4" />开始考试</Button></div>
              </Panel>
            )}

            {session && (
              <>
                {/* Pause overlay */}
                {paused && (
                  <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                    <div className="animate-scale-in rounded-2xl bg-white p-8 text-center shadow-xl">
                      <div className="mb-2 text-4xl">⏸</div>
                      <h3 className="text-lg font-bold text-slate-800">考试已暂停</h3>
                      <p className="mt-1 text-sm text-slate-500">计时已停止，点击下方按钮继续</p>
                      <div className="mt-6 flex justify-center gap-3">
                        <Button size="lg" onClick={togglePause}><Icon d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" className="h-4 w-4" />继续考试</Button>
                        <Button tone="danger" onClick={cancelExam}>放弃考试</Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
                  <aside className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm lg:sticky lg:top-20 lg:self-start">
                    <div className="mb-4">
                      <div className="text-xs font-medium text-slate-400">{session.bankTitle}</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">第 {current + 1} / {session.questions.length} 题</div>
                      <ProgressBar value={current + 1} max={session.questions.length} className="mt-2" />
                    </div>
                    {remaining !== null && (
                      <div className={`mb-4 rounded-lg p-3 text-center ${remaining <= 300 ? "bg-red-50" : "bg-slate-50"}`}>
                        <div className="text-xs text-slate-500">剩余时间</div>
                        <div className={`mt-0.5 font-mono text-2xl font-bold ${remaining <= 300 ? "text-red-600" : remaining <= 600 ? "text-amber-600" : "text-slate-800"}`}>{formatSeconds(remaining)}</div>
                      </div>
                    )}
                    <div className="grid grid-cols-5 gap-1.5">
                      {session.questions.map((q, idx) => {
                        const key = questionKey(q); const a = answers[key];
                        const answered = a !== undefined && a !== "" && !(Array.isArray(a) && !a.length);
                        const isMark = marked.includes(key);
                        return <button key={key} onClick={() => setCurrent(idx)} className={`relative flex h-9 items-center justify-center rounded-lg text-xs font-medium transition-all ${idx === current ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30" : answered ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}>{idx + 1}{isMark && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white" />}</button>;
                      })}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded border border-slate-200 bg-white" /> 未答</span>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-emerald-50 border border-emerald-200" /> 已答</span>
                      <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-blue-600" /> 当前</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button tone="ghost" size="sm" className="flex-1" onClick={togglePause}><Icon d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" className="h-3.5 w-3.5" />暂停</Button>
                      <Button tone="ghost" size="sm" className="flex-1 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={cancelExam}><Icon d="M6 18L18 6M6 6l12 12" className="h-3.5 w-3.5" />放弃</Button>
                    </div>
                  </aside>

                  <QuestionCard question={session.questions[current]} index={current} total={session.questions.length} answer={answers[questionKey(session.questions[current])]} marked={marked.includes(questionKey(session.questions[current]))} onAnswer={updateAnswer} onMark={() => { const key = questionKey(session.questions[current]); setMarked((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]); }} onPrev={() => setCurrent(Math.max(0, current - 1))} onNext={() => setCurrent(Math.min(session.questions.length - 1, current + 1))} onSubmit={() => submitExam(false)} />
                </div>
              </>
            )}

            {reviewRecord && <Review record={reviewRecord} onBack={() => setReviewRecord(null)} />}
          </div>
        )}

        {/* ══ WRONG TAB ══ */}
        {tab === "wrong" && (
          <Panel title="错题本" icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            extra={<div className="flex items-center gap-2">
              {activeWrongCount > 0 && <Button tone="warning" size="sm" onClick={() => startWrongPractice(wrongTagFilter)}><Icon d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="h-3.5 w-3.5" />重练{wrongTagFilter ? `「${wrongTagFilter}」` : "错题"}</Button>}
              <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm outline-none" value={wrongFilter} onChange={(e) => setWrongFilter(e.target.value)}><option value="all">全部</option><option value="active">未掌握</option><option value="mastered">已掌握</option></select>
            </div>}
          >
            {wrongTags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                <button onClick={() => setWrongTagFilter("")} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${!wrongTagFilter ? "border-blue-500/40 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500"}`}>全部知识点</button>
                {wrongTags.map((tag) => <button key={tag} onClick={() => setWrongTagFilter(wrongTagFilter === tag ? "" : tag)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${wrongTagFilter === tag ? "border-blue-500/40 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-500"}`}>{tag}</button>)}
              </div>
            )}
            {wrongItems.length === 0 ? <EmptyState icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" title="暂无错题" description={wrongFilter === "all" ? "答错的题目会自动收录到这里" : null} /> : (
              <div className="space-y-3">
                {wrongItems.map((item) => (
                  <details key={`${item.bankId}:${item.questionId}`} className="group rounded-xl border border-slate-200 transition-all hover:border-slate-300">
                    <summary className="flex cursor-pointer items-center gap-3 p-4">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${item.mastered ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>{item.count}</span>
                      <span className="flex-1 text-sm font-medium text-slate-800">{item.question.content.slice(0, 80)}{item.question.content.length > 80 ? "..." : ""}</span>
                      <div className="flex shrink-0 items-center gap-2">{item.mastered && <Badge tone="green">已掌握</Badge>}<Icon d="M19 9l-7 7-7-7" className="h-4 w-4 text-slate-400 transition group-open:rotate-180" /></div>
                    </summary>
                    <div className="border-t border-slate-100 px-4 pb-4 pt-3 text-sm space-y-2.5">
                      <div className="flex flex-wrap gap-1.5">{questionTags(item.question).map((t) => <Badge key={t} tone="slate">{t}</Badge>)}</div>
                      <div className="grid gap-2 text-slate-600 sm:grid-cols-2"><p><span className="font-medium text-slate-700">你的答案：</span>{answerText(item.question, item.lastAnswer)}</p><p><span className="font-medium text-emerald-700">正确答案：</span>{correctAnswerText(item.question)}</p></div>
                      <div className="rounded-lg bg-slate-50 p-3 leading-relaxed text-slate-600">{item.question.explanation}</div>
                      <Button tone={item.mastered ? "ghost" : "success"} size="sm" onClick={() => setWrongBook({ ...wrongBook, [`${item.bankId}:${item.questionId}`]: { ...item, mastered: !item.mastered } })}>{item.mastered ? "标记为未掌握" : "标记为已掌握"}</Button>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </Panel>
        )}

        {/* ══ KNOWLEDGE TAB ══ */}
        {tab === "knowledge" && (
          <Panel title="知识点分析" icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
            {Object.keys(performance).length === 0 ? <EmptyState icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" title="暂无数据" description="完成考试后会生成知识点正确率与趋势" /> : (
              <div className="grid gap-4 md:grid-cols-2">{Object.entries(performance).map(([tag, stat]) => {
                const rate = Math.round((stat.correct / stat.total) * 100); const tone = rate >= 80 ? "green" : rate >= 60 ? "amber" : "red"; const label = rate >= 80 ? "掌握" : rate >= 60 ? "一般" : "薄弱";
                return <div key={tag} className="rounded-xl border border-slate-200 p-5 transition hover:shadow-sm"><div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold text-slate-800">{tag}</h3><p className="mt-0.5 text-xs text-slate-500">{stat.total} 次作答 · {stat.correct} 次正确</p></div><Badge tone={tone}>{label} · {rate}%</Badge></div><ProgressBar value={stat.correct} max={stat.total} tone={tone} className="mt-3" /><div className="mt-3 flex h-6 items-end gap-0.5">{stat.history.slice(-30).map((v, i) => <div key={i} className={`flex-1 rounded-sm ${v ? "bg-emerald-400" : "bg-red-300"}`} style={{ height: v ? "100%" : "40%" }} />)}</div></div>;
              })}</div>
            )}
          </Panel>
        )}

        {/* ══ HISTORY TAB ══ */}
        {tab === "history" && (
          <Panel title="考试历史" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
            {records.length === 0 ? <EmptyState icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" title="暂无记录" description="完成考试后会在这里显示历史" /> : (
              <div className="space-y-3">{records.map((record) => {
                const pass = record.scorePercent >= (record.passScorePercent || 60);
                return <div key={record.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:shadow-sm"><div className="flex items-center gap-4"><div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${pass ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>{record.scorePercent}</div><div><h3 className="text-sm font-semibold text-slate-800">{record.bankTitle}</h3><p className="mt-0.5 text-xs text-slate-500">{new Date(record.createdAt).toLocaleString()} · {formatSeconds(record.durationSeconds)} · {record.correctCount}/{record.total} 正确</p></div></div><Button tone="ghost" size="sm" onClick={() => { setReviewRecord(record); setTab("exam"); }}>查看解析<Icon d="M9 5l7 7-7 7" className="h-3.5 w-3.5" /></Button></div>;
              })}</div>
            )}
          </Panel>
        )}

        {tab === "help" && <Help />}
      </main>
    </div>
  );
}

// ─── Question Card (supports all 5 types) ───
function QuestionCard({ question, index, total, answer, marked, onAnswer, onMark, onPrev, onNext, onSubmit }) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Badge tone="blue">{typeText[question.type]}</Badge>
          <Badge tone={diffColor[question.difficulty]}>{diffText[question.difficulty]}</Badge>
          <span className="text-xs text-slate-400">第 {index + 1} / {total} 题</span>
        </div>
        <Button tone={marked ? "warning" : "ghost"} size="sm" onClick={onMark}>
          <Icon d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" className="h-4 w-4" />
          {marked ? "已标记" : "标记"}
        </Button>
      </div>

      <p className="mb-6 text-base font-medium leading-8 text-slate-800">{question.content}</p>

      <div className="space-y-2.5">
        {question.type === "true_false" && [true, false].map((value) => {
          const sel = answer === value;
          return <button key={String(value)} onClick={() => onAnswer(question, value)} className={`question-option flex w-full items-center gap-3 rounded-xl border px-5 py-3.5 text-left transition ${sel ? "border-blue-500/50 bg-blue-50/80 text-blue-800 shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${sel ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300 text-slate-400"}`}>{sel ? "✓" : value ? "T" : "F"}</span><span className="font-medium">{value ? "正确" : "错误"}</span></button>;
        })}

        {(question.type === "single_choice" || question.type === "multiple_choice") && question.options.map((opt) => {
          const sel = question.type === "multiple_choice" ? Array.isArray(answer) && answer.includes(opt.label) : answer === opt.label;
          return <button key={opt.label} onClick={() => onAnswer(question, opt.label)} className={`question-option flex w-full items-center gap-3 rounded-xl border px-5 py-3.5 text-left transition ${sel ? "border-blue-500/50 bg-blue-50/80 text-blue-800 shadow-sm" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${sel ? "border-blue-500 bg-blue-500 text-white" : "border-slate-300 text-slate-400"}`}>{sel ? "✓" : opt.label}</span><span>{opt.text}</span></button>;
        })}

        {question.type === "fill_in_blank" && (
          <input className="w-full rounded-xl border border-slate-200 px-5 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" placeholder="请输入答案..." value={answer || ""} onChange={(e) => onAnswer(question, e.target.value)} />
        )}

        {question.type === "short_answer" && (
          <textarea className="h-36 w-full rounded-xl border border-slate-200 p-4 text-sm leading-relaxed outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" placeholder="请输入你的回答..." value={answer || ""} onChange={(e) => onAnswer(question, e.target.value)} />
        )}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
        <Button tone="ghost" onClick={onPrev} disabled={index === 0}><Icon d="M15 19l-7-7 7-7" className="h-4 w-4" />上一题</Button>
        <div className="flex gap-2">
          {index < total - 1 && <Button tone="secondary" onClick={onNext}>下一题<Icon d="M9 5l7 7-7 7" className="h-4 w-4" /></Button>}
          <Button tone="danger" onClick={onSubmit}><Icon d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="h-4 w-4" />交卷</Button>
        </div>
      </div>
    </section>
  );
}

// ─── Review ───
function Review({ record, onBack }) {
  const [onlyWrong, setOnlyWrong] = useState(false);
  const pass = record.scorePercent >= (record.passScorePercent || 60);
  const tagStats = {}; const diffStats = {};
  record.details.forEach(({ question, correct }) => { questionTags(question).forEach((t) => { if (!tagStats[t]) tagStats[t] = { total: 0, correct: 0 }; tagStats[t].total += 1; tagStats[t].correct += correct ? 1 : 0; }); const d = diffText[question.difficulty]; if (!diffStats[d]) diffStats[d] = { total: 0, correct: 0 }; diffStats[d].total += 1; diffStats[d].correct += correct ? 1 : 0; });
  const details = onlyWrong ? record.details.filter((i) => !i.correct) : record.details;

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center gap-3"><Button tone="ghost" size="sm" onClick={onBack}><Icon d="M15 19l-7-7 7-7" className="h-4 w-4" />返回</Button><h2 className="text-lg font-semibold text-slate-800">考试结果</h2></div>
      <div className={`rounded-2xl border p-8 text-center ${pass ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/30" : "border-red-200 bg-gradient-to-br from-red-50 to-red-100/30"}`}>
        <div className={`text-6xl font-bold ${pass ? "text-emerald-600" : "text-red-600"}`}>{record.scorePercent}<span className="text-3xl">%</span></div>
        <div className={`mt-2 text-lg font-medium ${pass ? "text-emerald-700" : "text-red-700"}`}>{pass ? "通过" : "未通过"}</div>
        <div className="mt-4 flex justify-center gap-6 text-sm text-slate-600"><span>正确 {record.correctCount}/{record.total}</span><span>用时 {formatSeconds(record.durationSeconds)}</span><span>及格线 {record.passScorePercent || 60}%</span></div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Panel title="按知识点"><div className="space-y-3">{Object.entries(tagStats).map(([t, s]) => <Bar key={t} label={`${t} · ${Math.round((s.correct / s.total) * 100)}%`} value={s.correct} max={s.total} tone="green" />)}</div></Panel>
        <Panel title="按难度"><div className="space-y-3">{Object.entries(diffStats).map(([t, s]) => <Bar key={t} label={`${t} · ${Math.round((s.correct / s.total) * 100)}%`} value={s.correct} max={s.total} tone="amber" />)}</div></Panel>
      </div>
      <Panel title="逐题回顾" extra={<Button tone="ghost" size="sm" onClick={() => setOnlyWrong(!onlyWrong)}>{onlyWrong ? "查看全部" : "只看错题"}</Button>}>
        <div className="space-y-3">{details.map(({ question, answer, correct }, idx) => (
          <details key={question.id} className={`group rounded-xl border transition ${correct ? "border-emerald-200 bg-emerald-50/30" : "border-red-200 bg-red-50/30"}`}>
            <summary className="flex cursor-pointer items-center gap-3 p-4"><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${correct ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{correct ? "✓" : "✗"}</span><span className="flex-1 text-sm font-medium text-slate-800">{idx + 1}. {question.content.slice(0, 80)}</span><Icon d="M19 9l-7 7-7-7" className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" /></summary>
            <div className="border-t border-slate-100/80 px-4 pb-4 pt-3 text-sm leading-relaxed">
              <div className="grid gap-2 sm:grid-cols-2"><p className="text-slate-600"><span className="font-medium text-slate-700">你的答案：</span>{answerText(question, answer)}</p><p className="text-slate-600"><span className="font-medium text-emerald-700">正确答案：</span>{correctAnswerText(question)}</p></div>
              {question.type === "short_answer" && question.scoring_keywords && (
                <div className="mt-2 flex flex-wrap gap-1">{question.scoring_keywords.map((kw) => { const hit = normalizeText(answer || "").includes(normalizeText(kw)); return <Badge key={kw} tone={hit ? "green" : "red"}>{kw}{hit ? " ✓" : " ✗"}</Badge>; })}</div>
              )}
              <div className="mt-2 flex flex-wrap gap-1.5">{questionTags(question).map((t) => <Badge key={t} tone="slate">{t}</Badge>)}</div>
              <div className="mt-2 rounded-lg bg-white/60 p-3 text-slate-600">{question.explanation}</div>
            </div>
          </details>
        ))}</div>
      </Panel>
    </div>
  );
}

// ─── Help ───
function Help() {
  const prompt = `请按照以下 JSON 格式为我出 [N] 道关于 [主题] 的模拟考试题。题型包括单选题(single_choice)、多选题(multiple_choice)、判断题(true_false)、填空题(fill_in_blank)和简答题(short_answer)。

每道题必须包含 id、type、content、correct_answer、explanation（不少于50字的中文详细解析）、knowledge_tags（至少2个知识点标签）和 difficulty 字段。

- 选择题需要 options 数组
- 多选题 correct_answer 为数组
- 填空题可额外提供 accept_keywords（可接受的关键词数组）
- 简答题可额外提供 scoring_keywords（评分关键词数组，命中 50% 以上视为正确）

difficulty 只能使用 easy、medium、hard。请确保输出的是合法 JSON。`;

  const schema = `{
  "exam_title": "考试标题",
  "description": "考试描述",
  "time_limit_minutes": 60,
  "pass_score_percent": 60,
  "questions": [
    {
      "id": "q001", "type": "single_choice",
      "content": "题目正文",
      "options": [{"label": "A", "text": "选项A"}, {"label": "B", "text": "选项B"}],
      "correct_answer": "A",
      "explanation": "解析...",
      "knowledge_tags": ["知识点1"], "difficulty": "medium"
    },
    {
      "id": "q002", "type": "fill_in_blank",
      "content": "GDP 代表______。",
      "correct_answer": ["国内生产总值"],
      "accept_keywords": ["国内生产总值", "Gross Domestic Product", "GDP"],
      "explanation": "解析...",
      "knowledge_tags": ["GDP"], "difficulty": "easy"
    },
    {
      "id": "q003", "type": "short_answer",
      "content": "请简述供给定律的核心内容。",
      "correct_answer": "供给定律是指...(参考答案)",
      "scoring_keywords": ["价格上升", "供给量增加", "正向关系"],
      "explanation": "解析...",
      "knowledge_tags": ["供给"], "difficulty": "medium"
    }
  ]
}`;

  return (
    <div className="space-y-5">
      <Panel title="JSON 题库格式" icon="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4">
        <p className="mb-4 text-sm leading-relaxed text-slate-600">支持五种题型：单选 (single_choice)、多选 (multiple_choice)、判断 (true_false)、填空 (fill_in_blank)、简答 (short_answer)。</p>
        <div className="mb-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
          <p className="font-medium">新增题型说明</p>
          <ul className="mt-1 list-disc pl-4 space-y-1 text-blue-700">
            <li><strong>填空题</strong>：correct_answer 为答案数组，accept_keywords 为可接受的同义表述</li>
            <li><strong>简答题</strong>：scoring_keywords 为评分关键词，用户答案命中 ≥50% 视为正确</li>
          </ul>
        </div>
        <pre className="overflow-auto rounded-xl bg-slate-900 p-5 text-sm leading-relaxed text-slate-200">{schema}</pre>
      </Panel>
      <Panel title="AI 出题 Prompt" icon="M13 10V3L4 14h7v7l9-11h-7z">
        <p className="mb-3 text-sm text-slate-600">把以下 Prompt 发给 AI，将返回结果直接导入即可。</p>
        <pre className="whitespace-pre-wrap rounded-xl bg-slate-900 p-5 text-sm leading-relaxed text-slate-200">{prompt}</pre>
        <Button className="mt-3" tone="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(prompt); }}><Icon d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" className="h-4 w-4" />复制 Prompt</Button>
      </Panel>
    </div>
  );
}
