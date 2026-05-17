# Personal Exam System

一个本地运行的个人模拟考试系统，支持 AI 生成题库导入、模拟考试、自动判分、答案解析、错题本、知识点分析、考试历史和后端持久化保存。

## 功能

- JSON 题库导入与格式校验
- 多题库管理与切换
- 全量出题、随机抽题、知识点筛选、难度筛选、仅错题练习
- 单选题、多选题、判断题
- 倒计时、答题卡、标记题目、左右方向键切题
- 自动判分与逐题解析
- 解析界面显示所选答案与正确答案的完整选项内容
- 错题本自动记录与掌握状态标记
- 知识点正确率和趋势分析
- 考试历史回看
- Express 后端持久化保存题库、历史记录和错题本

## 技术栈

- React
- Vite
- Tailwind CSS
- Express
- 本地 JSON 文件数据库

## 快速开始

### Windows 一键运行

双击：

```text
run-exam-system.bat
```

脚本会自动安装依赖、构建前端、启动后端，并打开：

```text
http://127.0.0.1:4173/
```

使用期间请保持命令行窗口打开。

### 手动运行

```bash
npm install
npm run build
npm start
```

然后访问：

```text
http://127.0.0.1:4173/
```

## 数据持久化

后端会自动创建本地数据库文件：

```text
data/exam-state.json
```

该文件保存题库、考试历史和错题本。`data/` 默认不提交到 Git，避免把个人学习记录上传到公开仓库。

## 题库格式

系统支持如下题型：

- `single_choice`：单选题
- `multiple_choice`：多选题
- `true_false`：判断题

示例：

```json
{
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
        { "label": "A", "text": "选项A" },
        { "label": "B", "text": "选项B" }
      ],
      "correct_answer": "A",
      "explanation": "不少于50字的中文详细解析。",
      "knowledge_tags": ["知识点1", "知识点2"],
      "difficulty": "medium"
    }
  ]
}
```

## 开发

```bash
npm run dev
```

开发模式只启动前端 Vite 服务；需要测试后端持久化时，请先构建再运行：

```bash
npm run build
npm start
```

## License

MIT
