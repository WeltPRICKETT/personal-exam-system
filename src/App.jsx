import { useEffect, useMemo, useState } from "react";

const tabs = [
  ["bank", "题库"],
  ["exam", "考试"],
  ["wrong", "错题本"],
  ["knowledge", "知识点"],
  ["history", "历史"],
  ["help", "帮助"]
];

const sampleBank = {
  id: "sample-econ-finance",
  exam_title: "经济学与金融学基础模拟考试",
  description: "覆盖宏观经济、金融市场、财务分析与基础会计的示例题库。",
  time_limit_minutes: 45,
  pass_score_percent: 60,
  questions: [
    {
      id: "q001",
      type: "single_choice",
      content: "在支出法核算 GDP 时，下列哪一项通常不计入当期国内生产总值？",
      options: [
        { label: "A", text: "家庭购买新生产的家用电器" },
        { label: "B", text: "企业购买当年生产的新设备" },
        { label: "C", text: "居民购买二手住房" },
        { label: "D", text: "政府购买公共服务" }
      ],
      correct_answer: "C",
      explanation:
        "GDP 衡量一定时期内一国境内新生产的最终产品和服务价值。二手住房交易只是既有资产所有权转移，房屋本身已经在建成时计入过 GDP，重复计入会高估当期产出。交易中产生的经纪服务费可计入服务产出，但二手房总价不计入。",
      knowledge_tags: ["GDP核算", "宏观经济"],
      difficulty: "easy"
    },
    {
      id: "q002",
      type: "single_choice",
      content: "中央银行通过公开市场操作买入政府债券，最直接的货币政策效果通常是：",
      options: [
        { label: "A", text: "回笼基础货币并推高市场利率" },
        { label: "B", text: "投放基础货币并降低短期利率压力" },
        { label: "C", text: "提高商业银行法定准备金率" },
        { label: "D", text: "直接增加政府财政收入" }
      ],
      correct_answer: "B",
      explanation:
        "央行买入政府债券时向市场支付资金，商业银行准备金和基础货币增加，流动性更宽松，短期利率通常面临下行压力。这是扩张性货币政策工具。它并不等同于调整法定准备金率，也不是财政收入项目。",
      knowledge_tags: ["货币政策", "公开市场操作"],
      difficulty: "medium"
    },
    {
      id: "q003",
      type: "single_choice",
      content: "在其他条件不变时，如果某商品消费者收入上升且该商品为正常品，则其需求曲线最可能：",
      options: [
        { label: "A", text: "向左移动" },
        { label: "B", text: "沿曲线向下移动" },
        { label: "C", text: "向右移动" },
        { label: "D", text: "保持不变" }
      ],
      correct_answer: "C",
      explanation:
        "正常品的需求与收入通常同向变化。消费者收入上升会使任一给定价格下的购买意愿增加，表现为整条需求曲线向右移动。沿曲线移动是由该商品自身价格变化引起的，而收入变化属于非价格因素。",
      knowledge_tags: ["供需分析", "需求曲线"],
      difficulty: "easy"
    },
    {
      id: "q004",
      type: "single_choice",
      content: "在浮动汇率制度下，本币汇率主要由什么机制决定？",
      options: [
        { label: "A", text: "外汇市场供求关系" },
        { label: "B", text: "固定黄金平价" },
        { label: "C", text: "财政部每日直接规定" },
        { label: "D", text: "企业出口合同统一定价" }
      ],
      correct_answer: "A",
      explanation:
        "浮动汇率制度下，汇率主要由外汇市场上的供给与需求决定，资本流动、贸易收支、利率差异和预期都会影响供求。政府或央行可能干预以平滑波动，但制度核心并非固定黄金平价或行政逐日定价。",
      knowledge_tags: ["汇率机制", "国际金融"],
      difficulty: "medium"
    },
    {
      id: "q005",
      type: "multiple_choice",
      content: "关于资产负债表、利润表和现金流量表之间的关系，下列说法正确的有：",
      options: [
        { label: "A", text: "利润表中的净利润会影响资产负债表中的留存收益" },
        { label: "B", text: "现金流量表解释现金及现金等价物变动的来源" },
        { label: "C", text: "资产负债表反映某一期间的经营成果" },
        { label: "D", text: "三张报表可以相互勾稽，用于检查财务数据一致性" }
      ],
      correct_answer: ["A", "B", "D"],
      explanation:
        "利润表反映一段期间的经营成果，净利润在分配后会影响所有者权益中的留存收益。现金流量表说明现金变动来自经营、投资和筹资活动。资产负债表是时点报表，反映某一日期的财务状况，因此 C 的期间表述错误。",
      knowledge_tags: ["财务报表", "财务分析"],
      difficulty: "medium"
    },
    {
      id: "q006",
      type: "multiple_choice",
      content: "资本资产定价模型 CAPM 的常见假设包括：",
      options: [
        { label: "A", text: "投资者只关心收益均值和方差" },
        { label: "B", text: "存在无风险资产且投资者可以按无风险利率借贷" },
        { label: "C", text: "市场存在显著交易成本和信息不对称" },
        { label: "D", text: "投资者具有同质预期" }
      ],
      correct_answer: ["A", "B", "D"],
      explanation:
        "标准 CAPM 建立在均值-方差偏好、无风险借贷、同质预期、市场充分竞争等假设之上，用来推导资产预期收益与系统性风险之间的线性关系。显著交易成本和信息不对称会破坏模型的理想化条件，因此不是常见基础假设。",
      knowledge_tags: ["CAPM", "资产定价"],
      difficulty: "hard"
    },
    {
      id: "q007",
      type: "multiple_choice",
      content: "有效市场假说通常将市场有效性分为哪些层次？",
      options: [
        { label: "A", text: "弱式有效" },
        { label: "B", text: "半强式有效" },
        { label: "C", text: "强式有效" },
        { label: "D", text: "完全无风险有效" }
      ],
      correct_answer: ["A", "B", "C"],
      explanation:
        "有效市场假说按信息反映程度分为弱式、半强式和强式有效。弱式强调价格反映历史交易信息，半强式反映所有公开信息，强式进一步包含非公开信息。市场有效并不表示投资无风险，所以 D 不是标准分类。",
      knowledge_tags: ["有效市场假说", "金融市场"],
      difficulty: "medium"
    },
    {
      id: "q008",
      type: "true_false",
      content: "会计恒等式可以表示为：资产 = 负债 + 所有者权益。",
      correct_answer: true,
      explanation:
        "该等式是复式记账和资产负债表的基础。企业资产代表资源，负债和所有者权益代表这些资源的资金来源或权益归属。每一笔经济业务都会在等式两侧或同侧产生相互抵消的变化，从而保持恒等关系成立。",
      knowledge_tags: ["会计恒等式", "会计基础"],
      difficulty: "easy"
    },
    {
      id: "q009",
      type: "true_false",
      content: "费雪效应认为，名义利率大致等于实际利率加预期通货膨胀率。",
      correct_answer: true,
      explanation:
        "费雪效应用来描述名义利率、实际利率和预期通胀之间的关系，常用近似式为名义利率等于实际利率加预期通货膨胀率。严格形式包含乘积项，但在利率和通胀率较低时，近似式已经能反映主要经济含义。",
      knowledge_tags: ["费雪效应", "利率理论"],
      difficulty: "medium"
    },
    {
      id: "q010",
      type: "true_false",
      content: "比较优势理论说明，即使一国在所有产品上都有绝对优势，贸易仍可能使双方受益。",
      correct_answer: true,
      explanation:
        "比较优势强调机会成本而不是绝对生产效率。即便一国在所有产品上生产效率都更高，只要各国相对成本不同，专业化生产并交换仍可扩大总体可消费组合，使参与贸易的双方都获得潜在收益。",
      knowledge_tags: ["比较优势", "国际贸易"],
      difficulty: "easy"
    }
  ]
};

const typeText = {
  single_choice: "单选",
  multiple_choice: "多选",
  true_false: "判断"
};

const diffText = {
  easy: "简单",
  medium: "中等",
  hard: "困难"
};

const emptyConfig = {
  mode: "all",
  count: 5,
  timerMode: "bank",
  customMinutes: 30,
  shuffle: true,
  tags: [],
  difficulties: ["easy", "medium", "hard"],
  wrongOnly: false
};

function normalizeBank(bank) {
  return {
    ...bank,
    id: bank.id || `bank-${Date.now()}`,
    questions: bank.questions || []
  };
}

function validateBank(bank) {
  if (!bank || typeof bank !== "object") return "题库必须是一个 JSON 对象。";
  if (!bank.exam_title || !Array.isArray(bank.questions)) return "缺少 exam_title 或 questions 字段。";
  if (!bank.questions.length) return "题库至少需要包含 1 道题。";
  for (const q of bank.questions) {
    if (!q.id || !q.type || !q.content || !q.explanation || !Array.isArray(q.knowledge_tags)) {
      return `题目 ${q.id || "未命名"} 缺少必要字段。`;
    }
    if (!["single_choice", "multiple_choice", "true_false"].includes(q.type)) {
      return `题目 ${q.id} 的 type 不受支持。`;
    }
    if (!["easy", "medium", "hard"].includes(q.difficulty)) {
      return `题目 ${q.id} 的 difficulty 必须是 easy、medium 或 hard。`;
    }
    if (q.type !== "true_false" && !Array.isArray(q.options)) {
      return `题目 ${q.id} 必须提供 options。`;
    }
    if (q.type === "multiple_choice" && !Array.isArray(q.correct_answer)) {
      return `题目 ${q.id} 的 correct_answer 必须是数组。`;
    }
  }
  return "";
}

function shuffleItems(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function sameAnswer(question, answer) {
  if (question.type === "multiple_choice") {
    const a = Array.isArray(answer) ? [...answer].sort().join("|") : "";
    const b = [...question.correct_answer].sort().join("|");
    return a === b;
  }
  return answer === question.correct_answer;
}

function answerText(question, answer) {
  if (answer === undefined || answer === null || answer === "" || (Array.isArray(answer) && !answer.length)) return "未作答";
  if (question.type === "true_false") return answer ? "正确" : "错误";
  const formatOption = (label) => {
    const option = question.options?.find((item) => item.label === label);
    return option ? `${label}. ${option.text}` : label;
  };
  return Array.isArray(answer) ? answer.map(formatOption).join("；") : formatOption(answer);
}

function formatSeconds(total) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function countBy(items, getter) {
  return items.reduce((acc, item) => {
    const key = getter(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function Bar({ label, value, max, tone = "blue" }) {
  const colors = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    red: "bg-red-600",
    orange: "bg-orange-500",
    slate: "bg-slate-500"
  };
  const width = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded bg-slate-200">
        <div className={`h-2 rounded ${colors[tone]}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function Panel({ title, children, extra }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {extra}
      </div>
      {children}
    </section>
  );
}

function Button({ children, tone = "primary", className = "", ...props }) {
  const tones = {
    primary: "bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900",
    secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
    warning: "bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700"
  };
  return (
    <button
      className={`rounded px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function App() {
  const [banks, setBanks] = useState([sampleBank]);
  const [activeBankId, setActiveBankId] = useState(sampleBank.id);
  const [tab, setTab] = useState("bank");
  const [jsonText, setJsonText] = useState("");
  const [dataText, setDataText] = useState("");
  const [message, setMessage] = useState("");
  const [config, setConfig] = useState(emptyConfig);
  const [session, setSession] = useState(null);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState([]);
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(null);
  const [records, setRecords] = useState([]);
  const [wrongBook, setWrongBook] = useState({});
  const [reviewRecord, setReviewRecord] = useState(null);
  const [wrongFilter, setWrongFilter] = useState("all");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [backendStatus, setBackendStatus] = useState("正在连接后端数据库...");

  const activeBank = banks.find((bank) => bank.id === activeBankId) || banks[0];
  const allTags = useMemo(() => [...new Set(activeBank.questions.flatMap((q) => q.knowledge_tags))], [activeBank]);

  const bankStats = useMemo(() => {
    const type = countBy(activeBank.questions, (q) => typeText[q.type]);
    const diff = countBy(activeBank.questions, (q) => diffText[q.difficulty]);
    const tags = activeBank.questions.reduce((acc, q) => {
      q.knowledge_tags.forEach((tag) => (acc[tag] = (acc[tag] || 0) + 1));
      return acc;
    }, {});
    return { type, diff, tags };
  }, [activeBank]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/state")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.banks) && data.banks.length) {
          const nextBanks = data.banks.map(normalizeBank);
          setBanks(nextBanks);
          setActiveBankId(data.activeBankId || nextBanks[0].id);
        }
        if (Array.isArray(data.records)) setRecords(data.records);
        if (data.wrongBook && typeof data.wrongBook === "object") setWrongBook(data.wrongBook);
        setBackendStatus(data.updatedAt ? `已恢复数据库：${new Date(data.updatedAt).toLocaleString()}` : "后端数据库已连接");
      })
      .catch(() => {
        if (!cancelled) setBackendStatus("未连接后端，当前为临时内存模式");
      })
      .finally(() => {
        if (!cancelled) setDataLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    const timer = setTimeout(() => {
      fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banks, activeBankId, records, wrongBook })
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then((data) => setBackendStatus(`数据库已保存：${new Date(data.updatedAt).toLocaleString()}`))
        .catch(() => setBackendStatus("自动保存失败，请确认后端服务仍在运行"));
    }, 500);
    return () => clearTimeout(timer);
  }, [banks, activeBankId, records, wrongBook, dataLoaded]);

  useEffect(() => {
    if (!session || remaining === null) return;
    if (remaining <= 0) {
      submitExam();
      return;
    }
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [session, remaining]);

  useEffect(() => {
    if (!session) return;
    const handleKeyDown = (event) => {
      const target = event.target;
      const tagName = target?.tagName?.toLowerCase();
      const isTyping = tagName === "input" || tagName === "textarea" || tagName === "select" || target?.isContentEditable;
      if (isTyping) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrent((value) => Math.max(0, value - 1));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setCurrent((value) => Math.min(session.questions.length - 1, value + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [session]);

  function importBank() {
    try {
      const parsed = normalizeBank(JSON.parse(jsonText));
      const error = validateBank(parsed);
      if (error) {
        setMessage(error);
        return;
      }
      setBanks((items) => [...items, parsed]);
      setActiveBankId(parsed.id);
      setJsonText("");
      setMessage("题库导入成功。");
    } catch (error) {
      setMessage(`JSON 解析失败：${error.message}`);
    }
  }

  function exportAll() {
    downloadJson("personal-exam-data.json", { banks, activeBankId, records, wrongBook, exported_at: new Date().toISOString() });
  }

  function importAll() {
    try {
      const data = JSON.parse(dataText);
      if (!Array.isArray(data.banks) || !data.banks.length) {
        setMessage("恢复数据必须包含 banks 数组。");
        return;
      }
      setBanks(data.banks.map(normalizeBank));
      setActiveBankId(data.activeBankId || data.banks[0].id);
      setRecords(Array.isArray(data.records) ? data.records : []);
      setWrongBook(data.wrongBook || {});
      setDataText("");
      setMessage("完整数据恢复成功。");
    } catch (error) {
      setMessage(`恢复失败：${error.message}`);
    }
  }

  function filteredQuestions() {
    let questions = activeBank.questions;
    if (config.tags.length) questions = questions.filter((q) => q.knowledge_tags.some((tag) => config.tags.includes(tag)));
    if (config.difficulties.length) questions = questions.filter((q) => config.difficulties.includes(q.difficulty));
    if (config.wrongOnly) {
      const wrongIds = new Set(Object.values(wrongBook).filter((item) => item.bankId === activeBank.id && !item.mastered).map((item) => item.questionId));
      questions = questions.filter((q) => wrongIds.has(q.id));
    }
    if (config.shuffle) questions = shuffleItems(questions);
    if (config.mode === "random") questions = questions.slice(0, Math.max(1, Number(config.count) || 1));
    return questions;
  }

  function startExam() {
    const questions = filteredQuestions();
    if (!questions.length) {
      setMessage("当前筛选条件下没有可用题目。");
      return;
    }
    let minutes = null;
    if (config.timerMode === "bank") minutes = activeBank.time_limit_minutes;
    if (config.timerMode === "custom") minutes = Number(config.customMinutes) || 0;
    setSession({ id: `record-${Date.now()}`, bankId: activeBank.id, bankTitle: activeBank.exam_title, questions, startedAt: Date.now() });
    setAnswers({});
    setMarked([]);
    setCurrent(0);
    setRemaining(minutes ? minutes * 60 : null);
    setReviewRecord(null);
    setTab("exam");
    setMessage("");
  }

  function updateAnswer(question, value) {
    setAnswers((prev) => {
      if (question.type === "multiple_choice") {
        const currentAnswer = Array.isArray(prev[question.id]) ? prev[question.id] : [];
        const next = currentAnswer.includes(value) ? currentAnswer.filter((item) => item !== value) : [...currentAnswer, value];
        return { ...prev, [question.id]: next };
      }
      return { ...prev, [question.id]: prev[question.id] === value ? undefined : value };
    });
  }

  function submitExam() {
    if (!session) return;
    if (remaining !== 0 && !window.confirm("确认交卷吗？交卷后将立即生成成绩与解析。")) return;
    const finishedAt = Date.now();
    const details = session.questions.map((question) => ({
      question,
      answer: answers[question.id],
      correct: sameAnswer(question, answers[question.id])
    }));
    const correctCount = details.filter((item) => item.correct).length;
    const record = {
      id: session.id,
      bankId: session.bankId,
      bankTitle: session.bankTitle,
      createdAt: new Date().toISOString(),
      durationSeconds: Math.round((finishedAt - session.startedAt) / 1000),
      scorePercent: Math.round((correctCount / details.length) * 100),
      correctCount,
      total: details.length,
      details
    };
    const nextWrongBook = { ...wrongBook };
    details.forEach((item) => {
      const key = `${session.bankId}:${item.question.id}`;
      if (!item.correct) {
        const old = nextWrongBook[key] || { bankId: session.bankId, questionId: item.question.id, count: 0, answers: [] };
        nextWrongBook[key] = {
          ...old,
          question: item.question,
          count: old.count + 1,
          lastWrongAt: record.createdAt,
          lastAnswer: item.answer,
          mastered: false,
          answers: [...(old.answers || []), item.answer].slice(-5)
        };
      } else if (nextWrongBook[key]) {
        nextWrongBook[key] = { ...nextWrongBook[key], mastered: true };
      }
    });
    setRecords((items) => [record, ...items]);
    setWrongBook(nextWrongBook);
    setReviewRecord(record);
    setSession(null);
    setRemaining(null);
  }

  function tagPerformance(sourceRecords = records) {
    const stats = {};
    sourceRecords.forEach((record) => {
      record.details.forEach(({ question, correct }) => {
        question.knowledge_tags.forEach((tag) => {
          if (!stats[tag]) stats[tag] = { total: 0, correct: 0, history: [] };
          stats[tag].total += 1;
          stats[tag].correct += correct ? 1 : 0;
          stats[tag].history.push(correct ? 1 : 0);
        });
      });
    });
    return stats;
  }

  function recordSummary(record) {
    const pass = record.scorePercent >= (activeBank.pass_score_percent || 60);
    return (
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded border border-slate-200 p-4">
          <div className="text-sm text-slate-500">得分</div>
          <div className="mt-1 text-3xl font-semibold text-slate-900">{record.scorePercent}%</div>
        </div>
        <div className="rounded border border-slate-200 p-4">
          <div className="text-sm text-slate-500">正确题数</div>
          <div className="mt-1 text-3xl font-semibold text-slate-900">{record.correctCount}/{record.total}</div>
        </div>
        <div className="rounded border border-slate-200 p-4">
          <div className="text-sm text-slate-500">用时</div>
          <div className="mt-1 text-3xl font-semibold text-slate-900">{formatSeconds(record.durationSeconds)}</div>
        </div>
        <div className={`rounded border p-4 ${pass ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
          <div className="text-sm text-slate-500">结果</div>
          <div className={`mt-1 text-3xl font-semibold ${pass ? "text-emerald-700" : "text-red-700"}`}>{pass ? "通过" : "未通过"}</div>
        </div>
      </div>
    );
  }

  const wrongItems = Object.values(wrongBook).filter((item) => wrongFilter === "all" || (wrongFilter === "active" ? !item.mastered : item.mastered));
  const performance = tagPerformance();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">个人模拟考试系统</h1>
            <p className="text-sm text-slate-500">AI 题库导入、自动判分与复盘分析</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`rounded px-3 py-2 text-sm transition ${tab === id ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] space-y-5 px-4 py-6 fade-in">
        {message && <div className="rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">{message}</div>}
        <div className="rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          数据状态：{backendStatus}
        </div>

        {tab === "bank" && (
          <div className="space-y-5">
            <Panel
              title="题库概览"
              extra={
                <select className="rounded border border-slate-300 px-3 py-2 text-sm" value={activeBankId} onChange={(e) => setActiveBankId(e.target.value)}>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>{bank.exam_title}</option>
                  ))}
                </select>
              }
            >
              <div className="mb-5">
                <h3 className="text-2xl font-semibold">{activeBank.exam_title}</h3>
                <p className="mt-1 text-slate-600">{activeBank.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded border border-slate-200 p-4">
                  <div className="text-sm text-slate-500">题目数量</div>
                  <div className="mt-1 text-3xl font-semibold">{activeBank.questions.length}</div>
                </div>
                <div className="rounded border border-slate-200 p-4">
                  <div className="text-sm text-slate-500">建议时长</div>
                  <div className="mt-1 text-3xl font-semibold">{activeBank.time_limit_minutes || "不限"} 分钟</div>
                </div>
                <div className="rounded border border-slate-200 p-4">
                  <div className="text-sm text-slate-500">及格线</div>
                  <div className="mt-1 text-3xl font-semibold">{activeBank.pass_score_percent || 60}%</div>
                </div>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div className="space-y-3">
                  <h4 className="font-medium">题型分布</h4>
                  {Object.entries(bankStats.type).map(([key, value]) => <Bar key={key} label={key} value={value} max={activeBank.questions.length} />)}
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">难度分布</h4>
                  {Object.entries(bankStats.diff).map(([key, value]) => <Bar key={key} label={key} value={value} max={activeBank.questions.length} tone="orange" />)}
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">知识点分布</h4>
                  {Object.entries(bankStats.tags).slice(0, 6).map(([key, value]) => <Bar key={key} label={key} value={value} max={activeBank.questions.length} tone="slate" />)}
                </div>
              </div>
            </Panel>

            <Panel title="导入题库">
              <textarea
                className="h-48 w-full rounded border border-slate-300 p-3 text-sm outline-none focus:border-blue-600"
                placeholder="粘贴符合 Schema 的题库 JSON..."
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
              />
              <div className="mt-3 flex gap-3">
                <Button onClick={importBank}>导入题库</Button>
                <Button tone="secondary" onClick={() => setJsonText(JSON.stringify(sampleBank, null, 2))}>填入示例</Button>
              </div>
            </Panel>

            <Panel title="数据备份">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm text-slate-600">导出当前所有题库、历史记录和错题本。</p>
                  <Button onClick={exportAll}>导出数据 JSON</Button>
                </div>
                <div>
                  <textarea
                    className="h-28 w-full rounded border border-slate-300 p-3 text-sm outline-none focus:border-blue-600"
                    placeholder="粘贴之前导出的完整数据 JSON..."
                    value={dataText}
                    onChange={(e) => setDataText(e.target.value)}
                  />
                  <Button className="mt-3" tone="secondary" onClick={importAll}>恢复数据</Button>
                </div>
              </div>
            </Panel>
          </div>
        )}

        {tab === "exam" && (
          <div className="space-y-5">
            {!session && !reviewRecord && (
              <Panel title="考试配置">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium">出题方式</span>
                    <select className="w-full rounded border border-slate-300 px-3 py-2" value={config.mode} onChange={(e) => setConfig({ ...config, mode: e.target.value })}>
                      <option value="all">使用全部题目</option>
                      <option value="random">随机抽取 N 题</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium">抽题数量</span>
                    <input className="w-full rounded border border-slate-300 px-3 py-2" type="number" min="1" value={config.count} onChange={(e) => setConfig({ ...config, count: e.target.value })} />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium">计时方式</span>
                    <select className="w-full rounded border border-slate-300 px-3 py-2" value={config.timerMode} onChange={(e) => setConfig({ ...config, timerMode: e.target.value })}>
                      <option value="bank">使用题库时长</option>
                      <option value="custom">自定义时长</option>
                      <option value="none">不限时</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium">自定义分钟</span>
                    <input className="w-full rounded border border-slate-300 px-3 py-2" type="number" min="1" value={config.customMinutes} onChange={(e) => setConfig({ ...config, customMinutes: e.target.value })} />
                  </label>
                </div>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <div className="mb-2 text-sm font-medium">知识点筛选</div>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setConfig({ ...config, tags: config.tags.includes(tag) ? config.tags.filter((item) => item !== tag) : [...config.tags, tag] })}
                          className={`rounded border px-3 py-1 text-sm ${config.tags.includes(tag) ? "border-blue-700 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-600"}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-sm font-medium">难度筛选</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(diffText).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setConfig({ ...config, difficulties: config.difficulties.includes(key) ? config.difficulties.filter((item) => item !== key) : [...config.difficulties, key] })}
                          className={`rounded border px-3 py-1 text-sm ${config.difficulties.includes(key) ? "border-blue-700 bg-blue-50 text-blue-700" : "border-slate-300 text-slate-600"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={config.shuffle} onChange={(e) => setConfig({ ...config, shuffle: e.target.checked })} />
                    打乱题目顺序
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={config.wrongOnly} onChange={(e) => setConfig({ ...config, wrongOnly: e.target.checked })} />
                    仅错题模式
                  </label>
                </div>
                <div className="mt-6">
                  <Button onClick={startExam}>开始考试</Button>
                </div>
              </Panel>
            )}

            {session && (
              <div className="grid gap-5 md:grid-cols-[240px_1fr]">
                <aside className="rounded border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-4">
                    <div className="text-sm text-slate-500">{session.bankTitle}</div>
                    <div className="mt-1 font-semibold">第 {current + 1} / {session.questions.length} 题</div>
                    {remaining !== null && <div className={`mt-2 text-2xl font-semibold ${remaining <= 300 ? "text-red-600" : "text-slate-900"}`}>{formatSeconds(remaining)}</div>}
                  </div>
                  <div className="grid grid-cols-5 gap-2 md:grid-cols-4">
                    {session.questions.map((q, index) => {
                      const answered = answers[q.id] !== undefined && !(Array.isArray(answers[q.id]) && !answers[q.id].length);
                      const isMarked = marked.includes(q.id);
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrent(index)}
                          className={`h-9 rounded border text-sm ${index === current ? "border-blue-700 bg-blue-700 text-white" : answered ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-slate-300 bg-white text-slate-600"} ${isMarked ? "ring-2 ring-orange-300" : ""}`}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                </aside>
                <QuestionCard
                  question={session.questions[current]}
                  index={current}
                  total={session.questions.length}
                  answer={answers[session.questions[current].id]}
                  marked={marked.includes(session.questions[current].id)}
                  onAnswer={updateAnswer}
                  onMark={() => {
                    const id = session.questions[current].id;
                    setMarked((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
                  }}
                  onPrev={() => setCurrent(Math.max(0, current - 1))}
                  onNext={() => setCurrent(Math.min(session.questions.length - 1, current + 1))}
                  onSubmit={submitExam}
                />
              </div>
            )}

            {reviewRecord && <Review record={reviewRecord} summary={recordSummary(reviewRecord)} />}
          </div>
        )}

        {tab === "wrong" && (
          <Panel
            title="错题本"
            extra={
              <select className="rounded border border-slate-300 px-3 py-2 text-sm" value={wrongFilter} onChange={(e) => setWrongFilter(e.target.value)}>
                <option value="all">全部</option>
                <option value="active">未掌握</option>
                <option value="mastered">已掌握</option>
              </select>
            }
          >
            <div className="space-y-3">
              {wrongItems.length === 0 && <p className="text-slate-500">暂无错题记录。</p>}
              {wrongItems.map((item) => (
                <details key={`${item.bankId}:${item.questionId}`} className="rounded border border-slate-200 p-4">
                  <summary className="cursor-pointer font-medium">
                    {item.question.content.slice(0, 60)} <span className="ml-2 text-sm text-red-600">错 {item.count} 次</span>
                    {item.mastered && <span className="ml-2 text-sm text-emerald-600">已掌握</span>}
                  </summary>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <p>知识点：{item.question.knowledge_tags.join("、")}</p>
                    <p>上次错误：{item.lastWrongAt ? new Date(item.lastWrongAt).toLocaleString() : "-"}</p>
                    <p>你的答案：{answerText(item.question, item.lastAnswer)}</p>
                    <p>正确答案：{answerText(item.question, item.question.correct_answer)}</p>
                    <p className="leading-7">解析：{item.question.explanation}</p>
                    <Button tone={item.mastered ? "secondary" : "success"} onClick={() => setWrongBook({ ...wrongBook, [`${item.bankId}:${item.questionId}`]: { ...item, mastered: !item.mastered } })}>
                      {item.mastered ? "标记为未掌握" : "标记为已掌握"}
                    </Button>
                  </div>
                </details>
              ))}
            </div>
          </Panel>
        )}

        {tab === "knowledge" && (
          <Panel title="知识点分析">
            <div className="space-y-4">
              {Object.keys(performance).length === 0 && <p className="text-slate-500">完成考试后会生成知识点正确率与趋势。</p>}
              {Object.entries(performance).map(([tag, stat]) => {
                const rate = Math.round((stat.correct / stat.total) * 100);
                const tone = rate >= 80 ? "green" : rate >= 60 ? "orange" : "red";
                return (
                  <div key={tag} className="rounded border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{tag}</h3>
                        <p className="text-sm text-slate-500">累计 {stat.total} 次，正确 {stat.correct} 次</p>
                      </div>
                      <span className={`rounded px-3 py-1 text-sm ${tone === "green" ? "bg-emerald-50 text-emerald-700" : tone === "orange" ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700"}`}>
                        {rate >= 80 ? "掌握" : rate >= 60 ? "一般" : "薄弱"} · {rate}%
                      </span>
                    </div>
                    <div className="mt-3 flex h-8 items-end gap-1">
                      {stat.history.slice(-20).map((value, index) => (
                        <div key={index} className={`w-4 rounded-t ${value ? "bg-emerald-500" : "bg-red-500"}`} style={{ height: value ? "100%" : "45%" }} title={value ? "正确" : "错误"} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}

        {tab === "history" && (
          <Panel title="考试历史">
            <div className="space-y-3">
              {records.length === 0 && <p className="text-slate-500">暂无考试记录。</p>}
              {records.map((record) => (
                <div key={record.id} className="rounded border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{record.bankTitle}</h3>
                      <p className="text-sm text-slate-500">{new Date(record.createdAt).toLocaleString()} · 用时 {formatSeconds(record.durationSeconds)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-semibold ${record.scorePercent >= 60 ? "text-emerald-700" : "text-red-700"}`}>{record.scorePercent}%</span>
                      <Button tone="secondary" onClick={() => { setReviewRecord(record); setTab("exam"); }}>查看解析</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === "help" && <Help />}
      </main>
    </div>
  );
}

function QuestionCard({ question, index, total, answer, marked, onAnswer, onMark, onPrev, onNext, onSubmit }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm text-slate-500">第 {index + 1} 题 / 共 {total} 题</div>
          <div className="mt-1 flex gap-2 text-sm">
            <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">{typeText[question.type]}</span>
            <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">{diffText[question.difficulty]}</span>
          </div>
        </div>
        <Button tone={marked ? "warning" : "secondary"} onClick={onMark}>{marked ? "取消标记" : "标记本题"}</Button>
      </div>
      <p className="mb-5 text-lg font-medium leading-8">{question.content}</p>
      <div className="space-y-3">
        {question.type === "true_false" ? (
          [true, false].map((value) => (
            <button
              key={String(value)}
              onClick={() => onAnswer(question, value)}
              className={`w-full rounded border px-4 py-3 text-left transition hover:border-blue-500 hover:bg-blue-50 ${answer === value ? "border-blue-700 bg-blue-50 text-blue-800" : "border-slate-300 bg-white"}`}
            >
              {value ? "正确" : "错误"}
            </button>
          ))
        ) : (
          question.options.map((option) => {
            const selected = question.type === "multiple_choice" ? Array.isArray(answer) && answer.includes(option.label) : answer === option.label;
            return (
              <button
                key={option.label}
                onClick={() => onAnswer(question, option.label)}
                className={`w-full rounded border px-4 py-3 text-left transition hover:border-blue-500 hover:bg-blue-50 ${selected ? "border-blue-700 bg-blue-50 text-blue-800" : "border-slate-300 bg-white"}`}
              >
                <span className="mr-3 font-semibold">{option.label}</span>
                {option.text}
              </button>
            );
          })
        )}
      </div>
      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Button tone="secondary" onClick={onPrev} disabled={index === 0}>上一题</Button>
        <div className="flex gap-3">
          <Button tone="secondary" onClick={onNext} disabled={index === total - 1}>下一题</Button>
          <Button tone="danger" onClick={onSubmit}>交卷</Button>
        </div>
      </div>
    </section>
  );
}

function Review({ record, summary }) {
  const [onlyWrong, setOnlyWrong] = useState(false);
  const tagStats = {};
  const diffStats = {};
  record.details.forEach(({ question, correct }) => {
    question.knowledge_tags.forEach((tag) => {
      if (!tagStats[tag]) tagStats[tag] = { total: 0, correct: 0 };
      tagStats[tag].total += 1;
      tagStats[tag].correct += correct ? 1 : 0;
    });
    const diff = diffText[question.difficulty];
    if (!diffStats[diff]) diffStats[diff] = { total: 0, correct: 0 };
    diffStats[diff].total += 1;
    diffStats[diff].correct += correct ? 1 : 0;
  });
  const details = onlyWrong ? record.details.filter((item) => !item.correct) : record.details;

  return (
    <div className="space-y-5">
      <Panel title="成绩总览">{summary}</Panel>
      <Panel title="维度统计">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium">按知识点</h3>
            {Object.entries(tagStats).map(([tag, stat]) => <Bar key={tag} label={`${tag} · ${Math.round((stat.correct / stat.total) * 100)}%`} value={stat.correct} max={stat.total} tone="green" />)}
          </div>
          <div className="space-y-3">
            <h3 className="font-medium">按难度</h3>
            {Object.entries(diffStats).map(([tag, stat]) => <Bar key={tag} label={`${tag} · ${Math.round((stat.correct / stat.total) * 100)}%`} value={stat.correct} max={stat.total} tone="orange" />)}
          </div>
        </div>
      </Panel>
      <Panel title="逐题回顾" extra={<Button tone="secondary" onClick={() => setOnlyWrong(!onlyWrong)}>{onlyWrong ? "查看全部" : "只看错题"}</Button>}>
        <div className="space-y-3">
          {details.map(({ question, answer, correct }, index) => (
            <details key={question.id} className={`rounded border p-4 ${correct ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"}`}>
              <summary className="cursor-pointer font-medium">
                {index + 1}. {question.content} <span className={correct ? "text-emerald-700" : "text-red-700"}>{correct ? "正确" : "错误"}</span>
              </summary>
              <div className="mt-3 space-y-2 text-sm leading-7">
                <p>你的答案：{answerText(question, answer)}</p>
                <p>正确答案：{answerText(question, question.correct_answer)}</p>
                <p>知识点：{question.knowledge_tags.join("、")}</p>
                <p>解析：{question.explanation}</p>
              </div>
            </details>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Help() {
  const prompt = `请按照以下 JSON 格式为我出 [N] 道关于 [主题] 的模拟考试题。题型包括单选题、多选题和判断题。每道题必须包含 id、type、content、options（选择题）、correct_answer、explanation（不少于50字的中文详细解析）、knowledge_tags（至少2个知识点标签）和 difficulty 字段。difficulty 只能使用 easy、medium、hard。请确保输出的是合法 JSON，可以直接粘贴导入。`;
  const schema = `{
  "exam_title": "考试标题",
  "description": "考试描述",
  "time_limit_minutes": 60,
  "pass_score_percent": 60,
  "questions": [
    {
      "id": "q001",
      "type": "single_choice",
      "content": "题目正文",
      "options": [
        {"label": "A", "text": "选项A"},
        {"label": "B", "text": "选项B"}
      ],
      "correct_answer": "A",
      "explanation": "不少于50字的中文解析。",
      "knowledge_tags": ["知识点1", "知识点2"],
      "difficulty": "medium"
    }
  ]
}`;

  return (
    <div className="space-y-5">
      <Panel title="JSON 题库格式说明">
        <p className="mb-3 leading-7 text-slate-700">系统支持单选题、多选题和判断题。单选题答案为选项字母，多选题答案为选项字母数组，判断题答案为 true 或 false。每道题都需要解析、知识点标签和难度。</p>
        <pre className="overflow-auto rounded bg-slate-900 p-4 text-sm text-slate-100">{schema}</pre>
      </Panel>
      <Panel title="AI 出题 Prompt 模板">
        <pre className="whitespace-pre-wrap rounded bg-slate-900 p-4 text-sm leading-7 text-slate-100">{prompt}</pre>
      </Panel>
    </div>
  );
}
