// gen-pages.js — 一次性生成 13 个子页面
// 运行: node gen-pages.js
// 输出: eco-tmeet.html / eco-feishu.html / ... / belt-ecom.html
const fs = require('fs');
const path = require('path');

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
html,body{min-height:100%;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;background:#f5f7fa;color:#1a1a1a;line-height:1.5}
.wrap{max-width:1080px;margin:0 auto;padding:32px 24px 56px}
.nav{display:flex;align-items:center;gap:14px;margin-bottom:24px;font-size:13px;color:#64748b}
.nav a{color:#1E40AF;text-decoration:none;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid #e2e8f0;border-radius:4px;background:#fff;transition:all .15s}
.nav a:hover{background:#eff6ff;border-color:#bfdbfe}
.nav .crumb{color:#94a3b8}
.brand{font-size:12px;color:#94a3b8;letter-spacing:2px;margin-bottom:6px;text-transform:uppercase}
h1{font-size:30px;font-weight:600;color:#0f172a;margin-bottom:10px;letter-spacing:-0.5px}
.lead{font-size:15px;color:#475569;margin-bottom:20px;line-height:1.7}
.lead strong{color:#0f172a;font-weight:600}
.tag{display:inline-block;font-size:11px;padding:3px 8px;border-radius:2px;margin-bottom:14px;letter-spacing:.5px;font-weight:500}
.hbar{margin-bottom:32px}
.hero{background:#fff;border:1px solid #e2e8f0;border-radius:4px;padding:32px 30px;margin-bottom:24px}
.hero h1{margin-bottom:10px}
.hero .lead{margin-bottom:24px}
.metrics3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.m-card{padding:18px 18px;border:1px solid #e2e8f0;border-radius:4px;background:#f8fafc}
.m-card .num{font-size:24px;font-weight:600;color:#0f172a;letter-spacing:-.5px;margin-bottom:4px}
.m-card .label{font-size:12px;color:#64748b}
.section-title{font-size:13px;font-weight:600;color:#475569;letter-spacing:1px;margin:36px 0 16px;padding-left:10px;border-left:3px solid #1E40AF}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}
.card{background:#fff;border:1px solid #e2e8f0;border-radius:4px;padding:22px 22px}
.card h3{font-size:15px;font-weight:600;color:#0f172a;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.card h3 .idx{display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;background:#1E40AF;color:#fff;font-size:11px;font-weight:600;flex-shrink:0}
.card p{font-size:13.5px;color:#475569;line-height:1.7}
.pain-card{border-left:3px solid #DC2626}
.pain-card h3 .idx{background:#DC2626}
.scene-card{border-left:3px solid #1E40AF}
.scene-card h3 .idx{background:#1E40AF}
.module-card{border:1px solid #e2e8f0}
.module-card .mtag{display:inline-block;font-size:10px;padding:2px 6px;border-radius:2px;background:#eff6ff;color:#1E40AF;margin-bottom:8px;font-weight:500;letter-spacing:.3px}
.summary-card{background:linear-gradient(135deg,#1E40AF 0%,#3B82F6 100%);color:#fff;border:none}
.summary-card h3{color:#fff}
.summary-card li{color:rgba(255,255,255,.95);font-size:13.5px;line-height:1.7;padding:5px 0 5px 20px;position:relative;list-style:none}
.summary-card li::before{content:"✓";position:absolute;left:0;top:5px;color:#fff;font-weight:700}
.summary-card ul{list-style:none}
.compare{display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:stretch}
.cmp{background:#fff;border:1px solid #e2e8f0;border-radius:4px;padding:20px}
.cmp.before{border-top:3px solid #DC2626}
.cmp.after{border-top:3px solid #047857}
.cmp .ctitle{font-size:12px;font-weight:600;color:#94a3b8;letter-spacing:1px;margin-bottom:14px;text-transform:uppercase}
.cmp.before .ctitle{color:#DC2626}
.cmp.after .ctitle{color:#047857}
.cmp .row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px dashed #e2e8f0;font-size:13px}
.cmp .row:last-child{border-bottom:none}
.cmp .row .k{color:#64748b}
.cmp .row .v{font-weight:600;color:#0f172a}
.cmp.after .row .v{color:#047857}
.cmp.before .row .v{color:#DC2626}
.cmp-arrow{display:flex;align-items:center;justify-content:center;font-size:24px;color:#94a3b8}
.timeline{background:#fff;border:1px solid #e2e8f0;border-radius:4px;padding:24px 26px}
.timeline h3{font-size:14px;font-weight:600;color:#0f172a;margin-bottom:16px}
.t-item{display:grid;grid-template-columns:60px 1fr;gap:18px;padding:14px 0;border-bottom:1px dashed #e2e8f0;align-items:start}
.t-item:last-child{border-bottom:none}
.t-item .tw{font-size:11px;font-weight:600;color:#1E40AF;background:#eff6ff;padding:4px 8px;border-radius:2px;text-align:center;height:fit-content}
.t-item .tcontent h4{font-size:14px;font-weight:600;color:#0f172a;margin-bottom:4px}
.t-item .tcontent p{font-size:13px;color:#64748b;line-height:1.6}
.arch{background:#fff;border:1px solid #e2e8f0;border-radius:4px;padding:24px 26px;margin-bottom:8px}
.arch p{font-size:14px;color:#475569;line-height:1.7}
.foot{margin-top:48px;font-size:12px;color:#94a3b8;text-align:center}
.kbd{background:#f1f5f9;border:1px solid #e2e8f0;border-bottom-width:2px;border-radius:3px;padding:1px 6px;font-size:12px;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;color:#0f172a}
`;

const PAGES = [
  // ========== 生态联动 6 个 ==========
  {
    fn:'eco-tmeet.html', type:'eco',
    color:'#006EFF', bg:'#E6F2FF', txt:'#006EFF',
    tag:'联动方案 · 腾讯会议',
    title:'WorkBuddy × 腾讯会议',
    lead:'从"开会"到"开会后能用":<strong>AI 帮员工约会议、会上实时记录、会后自动出纪要 + 待办分发 + 周报填充</strong>,会议内容直接变成可追溯、可搜索、可派生的组织资产。',
    metrics:[['↓75%','会议纪要耗时'],['100%','行动项有归属'],['4','核心场景闭环']],
    pains:[
      {t:'约会议太慢',d:'跨时区/多参与人/会议室预订,3-5 轮邮件来回,平均 20-30 分钟/次。'},
      {t:'会中关键信息丢失',d:'重要决策点无法实时记录,会后靠人脑回忆,关键信息丢失率 30%+。'},
      {t:'会后纪要靠人工',d:'人工整理 1 场会议纪要平均 1.5 小时,占员工有效工作时间 15-20%。'},
      {t:'纪要散落无法复用',d:'纪要存在邮件/群文件/个人文档,无法集中检索,新人 6 个月才能补齐背景。'}
    ],
    solution:'基于 Connector 接入腾讯会议 API,把"约会议 → 会中转写 → 会后纪要 → 周报填充"四段流程全部 AI 化。WorkBuddy 作为会议"全程 AI 助理",让员工只参与决策本身,所有周边工作由 AI 接管。',
    scenes:[
      {t:'一句话约会议',d:'员工输入"约明早 10 点和 3 个销售开周会",AI 自动查日程冲突、找空闲人、定时间、发邀请,30 秒完成。'},
      {t:'会中实时转写',d:'会议进行中实时转写 + 智能分段 + 关键决策/行动项实时打标,与会者一边开会一边在屏幕看到结构化笔记。'},
      {t:'会后 1 分钟出纪要',d:'会议结束 1 分钟内,WorkBuddy 自动生成结构化纪要(背景/决策/行动项/风险/Owner),一键归档乐享知识库。'},
      {t:'行动项自动派发',d:'纪要里的行动项自动转待办,推到对应责任人企微 / 飞书 / 钉钉,带截止日 + 来源会议链接,100% 追溯。'},
      {t:'周盘点自动聚合',d:'每周五自动聚合本周 N 场会议纪要,生成"本周战报"草稿,员工只需润色 5 分钟即可发领导。'}
    ],
    beforeAfter:{before:[['1.5h','单场纪要耗时'],['40%','行动项无追溯'],['0','可搜索沉淀'],['6 个月','新人上手周期']], after:[['↓22min','单场纪要(↓75%)'],['100%','行动项有责任人+截止日'],['100%','沉淀乐享知识库'],['↓ 60%','新人上手周期']]},
    timeline:[
      {w:'W1',t:'账号授权 + Connector 接入',d:'OAuth 一次性授权,WorkBuddy 获得会议室/日程/录制/参会人读写权限。'},
      {w:'W2',t:'Skill 配置 + 纪要模板',d:'按部门定制纪要模板(决策/行动项/风险/Owner),接入会中实时转写。'},
      {w:'W3',t:'试运行 + 培训',d:'选 2 个部门试跑 2 周,产出"约/记/分/存"4 步速查卡 + FAQ。'},
      {w:'W4+',t:'全量上线 + 持续迭代',d:'全公司推广,基于反馈每周迭代纪要模板与分发表单,3 个月内覆盖 90% 周会。'}
    ],
    summary:['会前 30 秒搞定 / 会后 1 分钟出纪要,会议组织成本 ↓80%','行动项 100% 有归属 + 截止日 + 会议溯源,执行率 ↑2x','会议内容自动沉淀乐享,新人上手周期 ↓60%','周盘点从 1.5 小时压缩到 5 分钟,管理层决策效率 ↑5x']
  },
  {
    fn:'eco-feishu.html', type:'eco',
    color:'#3370FF', bg:'#EBF1FF', txt:'#3370FF',
    tag:'联动方案 · 飞书',
    title:'WorkBuddy × 飞书',
    lead:'把飞书 28 个原生能力(Lark Doc / Sheet / Calendar / Bot / Wiki 等)全部装进 WorkBuddy 的大脑,员工<strong>不用学飞书语法,直接"说话"就能驱动整个飞书工作流</strong>。',
    metrics:[['28','lark-* skill 数量'],['5','端到端实跑案例'],['1','统一对话入口']],
    pains:[
      {t:'飞书功能多不会用',d:'Lark 套件十几个 App,员工只会用 IM 聊天,80% 高级功能(多维表格/Bitable/审批/Wiki)闲置。'},
      {t:'多工具切换打断思路',d:'写文档开 Lark Doc,做表开 Sheet,查日程开 Calendar,做汇报再切 Slides,跨工具复制粘贴是常态。'},
      {t:'Wiki 内容沉淀散',d:'知识散落在各部门的个人文档里,没有统一 Wiki,新人查资料平均 30 分钟/次。'},
      {t:'机器人只会收发消息',d:'现有群机器人只能做关键词回复,无法理解复杂任务,沦为通知工具。'}
    ],
    solution:'基于 lark-* skill 矩阵,WorkBuddy 完整接管 Lark 套件:读/写/查/发/审批一气呵成。同时通过 IMA / Wiki 桥接,让"飞书工作流"和"知识库检索"在一个对话框里完成。',
    scenes:[
      {t:'AI 热点日报推送',d:'每天晨会前 10 分钟,WorkBuddy 抓取行业资讯 + 公司群消息,生成"今日 10 条 AI 热点 Top10"推送到指定飞书群。'},
      {t:'Wiki 知识库对谈',d:'员工对 WorkBuddy 说"帮我找去年的 Q3 季度复盘",AI 直接在飞书 Wiki 里检索并返回原文段落,带链接。'},
      {t:'日程创建 + 改期 + 查冲突',d:'"帮我把跟王老板的会改到明天下午,要他和小李都参加",AI 自动查冲突、改日程、发新邀请。'},
      {t:'docx 文档转飞书在线',d:'本地 Word / Markdown 文件 → 一键转飞书在线文档,带格式 / 权限 / 评论。'},
      {t:'多维表(Bitable)操作',d:'在 Bitable 里增/删/改/查/统计所有记录,说"这个月销售冠军是谁"AI 现场拉数据回答。'}
    ],
    beforeAfter:{before:[['80%','Lark 高级功能闲置'],['8+','每日切换工具数'],['30min','新人查资料/次'],['关键词','机器人能力上限']], after:[['100%','Lark 能力可被调用'],['1','统一对话入口'],['↓2min','知识检索/次(↓93%)'],['多步推理','机器人升级为 AI 助理']]},
    timeline:[
      {w:'W1',t:'飞书企业自建应用授权',d:'在飞书开放平台创建应用,授予 IM/Doc/Sheet/Calendar/Wiki 等读写权限。'},
      {w:'W2',t:'lark-* skill 加载 + 模板',d:'批量加载 28 个 lark-* skill,按部门配置常用指令模板。'},
      {w:'W3',t:'知识库桥接',d:'对接 Wiki 空间 / Bitable 库,建立索引,首次训练 AI 检索习惯。'},
      {w:'W4+',t:'全员上线 + 场景拓展',d:'全公司推广,每周收集"我想要 AI 还能做什么",持续加 skill。'}
    ],
    summary:['28 个飞书原生能力一句话调用,工具切换 ↓90%','新人查资料从 30 分钟/次 → 2 分钟/次,上手周期 ↓60%','群机器人从关键词工具升级为多步推理 AI 助理','本地文档 ↔ 飞书在线文档无缝流转,文档资产零损失']
  },
  {
    fn:'eco-wecom.html', type:'eco',
    color:'#07C160', bg:'#E8F8EE', txt:'#07C160',
    tag:'联动方案 · 企业微信',
    title:'WorkBuddy × 企业微信',
    lead:'把企业微信"用透":<strong>智能表格、销售跟进、文档协同、日程审批、群机器人推送</strong>全部打通,WorkBuddy 既是员工身边的"私秘书",也是企业级"运营驾驶舱"。',
    metrics:[['↑3x','销售跟进效率'],['10+','企微原生能力'],['1','运营驾驶舱']],
    pains:[
      {t:'销售跟进记录散乱',d:'客户跟进写在 Excel、个人备忘录、群消息里,3 个月后没人记得上次聊到哪。'},
      {t:'周报写作耗时长',d:'员工周报靠回忆 + 拼凑,平均 2 小时/份,内容空话居多。'},
      {t:'群消息过载',d:'重要信息被闲聊刷屏,@ 提醒被忽略,关键决策经常被埋。'},
      {t:'智能表格不会用',d:'智能表格虽好,但公式 / 视图 / 自动化门槛高,业务部门用不起来。'}
    ],
    solution:'基于企微智能表格 + 通讯录 + 群机器人 + 智能文档四件套,WorkBuddy 把销售跟进、周报汇总、群消息摘要、智能文档发布统一接管,让企业微信真正变成"运营中枢"而非"聊天工具"。',
    scenes:[
      {t:'销售跟进自动记录',d:'销售在 WorkBuddy 输"刚和 XXX 客户聊完,他对 A 产品有兴趣,下周约 demo",AI 自动写入客户跟进表 + 安排提醒。'},
      {t:'周报自动汇总',d:'周五下午 WorkBuddy 自动汇总本周群消息 + 表格数据 + 日程完成情况,生成结构化周报草稿,员工只润色 5 分钟。'},
      {t:'群消息智能摘要',d:'群消息超 100 条时,AI 自动生成"今日 10 条关键信息",@ 关键责任人。'},
      {t:'通讯录 + 审批一句话查',d:'"帮我找产品部的张老师,顺便查他名下 3 个待审批的合同",AI 一次查清。'},
      {t:'本地 Markdown 转智能文档',d:'产品 PRD 写完本地 .md 文件 → 一键发布为企微智能文档,带权限 + 评论 + 目录。'}
    ],
    beforeAfter:{before:[['2h','单份周报耗时'],['3 个月','客户跟进断档周期'],['80%','群消息关键信息被忽略'],['0','智能表格自动化']], after:[['5min','周报润色时间(↓96%)'],['实时','客户跟进全留痕'],['100%','关键信息主动摘要@人'],['100%','智能表格 AI 驱动']]},
    timeline:[
      {w:'W1',t:'企微自建应用 + 通讯录授权',d:'在企业微信管理后台创建应用,授予通讯录/智能表格/群机器人权限。'},
      {w:'W2',t:'智能表格 + 跟进表模板',d:'为销售/HR/财务 3 大部门部署专属智能表格,带 AI 字段。'},
      {w:'W3',t:'群机器人 + 摘要规则',d:'关键群配置 AI 摘要机器人,设置触发规则(消息数 / 时间 / 关键词)。'},
      {w:'W4+',t:'全员上线 + 场景拓展',d:'全公司推广,逐步覆盖审批 / 日程 / 智能文档等更多场景。'}
    ],
    summary:['销售跟进全留痕,客户断档周期从 3 个月 → 实时,成单率 ↑30%','周报从 2 小时写作 → 5 分钟润色,管理透明 ↑5x','群消息从"被淹没"到"主动摘要",关键决策无遗漏','智能表格 / 智能文档 AI 化,业务部门零学习成本']
  },
  {
    fn:'eco-dingtalk.html', type:'eco',
    color:'#3296FA', bg:'#E6F2FF', txt:'#3296FA',
    tag:'联动方案 · 钉钉',
    title:'WorkBuddy × 钉钉',
    lead:'钉钉企业应用全链路打通:<strong>抽数 → 合成报告 → 推送到群 → 群内@机器人即时问答</strong>,形成"周报自动跑 + 知识随时问"的钉钉专属 AI 中台。',
    metrics:[['2','场景已上线'],['5+','能力扩展规划'],['30s','群内问答响应']],
    pains:[
      {t:'多维表数据散',d:'业务数据在不同多维表 / 表单 / 流程表单里,想看全貌要 N 个人 N 张表拼。'},
      {t:'周报靠人抄',d:'周报靠业务人员手动从多维表导出 + 拼凑,2-4 小时/份,且容易出错。'},
      {t:'知识查找难',d:'公司制度 / SOP / 流程文档散在知识库,新人问"年假怎么请"平均 5 分钟找到答案。'},
      {t:'群机器人功能弱',d:'钉钉机器人只能做关键词触发 + 简单回复,无法处理复杂问答。'}
    ],
    solution:'基于钉钉连接器 + 自定义机器人 + 多维表 API,WorkBuddy 在钉钉里扮演"AI 数据分析师 + AI 知识管家"两个角色:周报自动跑 + 群内@即答 + 乐享知识库打通。',
    scenes:[
      {t:'多维表周报自动合成',d:'每周五 18 点自动从销售/运营/HR 3 张多维表抽数,合成"本周经营周报"推送到指定钉钉群,带图表。'},
      {t:'群内@机器人即时问答',d:'员工在钉钉群@WorkBuddy 机器人:"本月 Top10 客户是哪些?"AI 30 秒内出答案 + 链接。'},
      {t:'乐享知识库打通',d:'员工@机器人问"年假怎么请?",AI 在乐享知识库检索后给原文段落 + 跳转链接。'},
      {t:'审批 / 待办联动',d:'WorkBuddy 自动监听钉钉待办,智能提醒临近截止的待办事项。'},
      {t:'日程 + 会议室一键预定',d:'员工说"明早 9 点预约 8 人会议室开季度复盘",AI 自动预定 + 通知 + 准备纪要模板。'}
    ],
    beforeAfter:{before:[['3h','单份周报人工拼凑'],['5min','新人制度查询/次'],['关键词','钉钉机器人能力'],['分散','数据/知识存储']], after:[['0','周报全自动生成'],['↓10s','制度查询(↓97%)'],['多步推理','AI 机器人'],['统一','数据 + 知识双中台']]},
    timeline:[
      {w:'W1-2',t:'钉钉连接器授权 + 多维表 API',d:'在钉钉开放平台创建连接器,授权多维表/机器人/通讯录读写。'},
      {w:'W3',t:'场景一:周报自动跑',d:'配置数据源 + 周报模板 + 推送群,试跑 2 周调优。'},
      {w:'W4',t:'场景二:群内@机器人问答',d:'配置乐享知识库索引 + QA 规则,上线群机器人。'},
      {w:'W5+',t:'扩展:审批/待办/日程',d:'逐步上线 5+ 扩展能力,形成"AI 操作员"闭环。'}
    ],
    summary:['周报从 3 小时人工拼凑 → 0 人工,数据无错、永远准时','群机器人从"通知器"升级为"AI 助理",群内问答 30 秒响应','乐享知识库 + 钉钉工作台打通,新人上手周期 ↓50%','审批/待办/日程/文档/通讯录 5 类能力持续扩展,逐步接管行政']
  },
  {
    fn:'eco-tdoc.html', type:'eco',
    color:'#0052D9', bg:'#E5EFFF', txt:'#0052D9',
    tag:'联动方案 · 腾讯文档企业版',
    title:'WorkBuddy × 腾讯文档',
    lead:'把腾讯文档当成"WorkBuddy 的外置大脑":<strong>AI 读取文档 → 分析内容 → 改写润色 → 插入图表 → 多人协同</strong>,文档类工作从"写字"变成"对话"。',
    metrics:[['↓60%','文档写作耗时'],['10+','文档类型支持'],['1','AI 化入口']],
    pains:[
      {t:'写作耗时长',d:'一份市场分析报告从资料搜集到成稿 4-6 小时,关键内容 60% 时间花在"找资料 + 排版"。'},
      {t:'改稿靠人工对比',d:'两版合同 diff 找差异,平均 30 分钟/份,法律/财务部门工作量巨大。'},
      {t:'表格不会用公式',d:'业务人员手动算求和/同比/环比,出错率高。'},
      {t:'多人协作冲突',d:'Word 改来改去,版本号 v1-v23,最终不知道用哪版。'}
    ],
    solution:'基于腾讯文档企业版 API + WorkBuddy 自然语言能力,实现"读文档 → 写文档 → 改文档 → 评文档"全流程 AI 化,文档类工作从手艺活变成对话。',
    scenes:[
      {t:'读文档并生成摘要',d:'上传 50 页市场报告,AI 1 分钟生成"5 段摘要 + 3 条核心结论 + 10 条行动项"。'},
      {t:'改写润色',d:'把口语化草稿丢给 AI,生成"商务正式版 / 客户友好版 / 内部交流版"3 个版本。'},
      {t:'插入图表 / 表格',d:'说"在这段加一张销售趋势折线图",AI 自动插入腾讯文档原生图表。'},
      {t:'文档智能比对',d:'两版合同上传,AI 自动 diff 标红所有变更点,带风险标注。'},
      {t:'多人协同 + 权限',d:'在企业版文档中,WorkBuddy 作为"虚拟协作者",自动响应评论 / 修订。'}
    ],
    beforeAfter:{before:[['4-6h','单份分析报告'],['30min','两版合同 diff'],['v23','最终不知道用哪版'],['0','AI 辅助']], after:[['↓1.5h','单份报告(↓60%)'],['↓2min','AI 智能 diff'],['历史版本可追溯','企业版原生能力'],['100%','AI 辅助阅读+写作']]},
    timeline:[
      {w:'W1',t:'腾讯文档企业版授权',d:'在企业版管理后台申请 API Key,授权读写权限。'},
      {w:'W2',t:'核心 skill:读 / 写 / 改 / 插',d:'封装 4 类原子 skill,先跑通"读 + 摘要"最常用场景。'},
      {w:'W3',t:'高级:diff / 图表 / 协同',d:'上线智能比对、图表插入、多人协同 skill。'},
      {w:'W4+',t:'全员上线 + 培训',d:'面向法务/财务/HR/市场 4 大部门重点培训,沉淀 SOP。'}
    ],
    summary:['文档写作耗时 ↓60%,员工从"搬砖"变"决策"','文档智能 diff 替代人工比对,法务/财务审核效率 ↑5x','所有文档沿用企业版权限,数据安全可审计','腾讯文档成为"AI 化入口",所有知识资产可被 AI 调用']
  },
  {
    fn:'eco-ima.html', type:'eco',
    color:'#5B5BD6', bg:'#EEEEFE', txt:'#5B5BD6',
    tag:'联动方案 · IMA 知识库',
    title:'WorkBuddy × IMA 知识库',
    lead:'把企业 IMA 知识库变成"<strong>可对话的资深员工</strong>":新人入职 1 周就能上手业务,老员工不用反复回答重复问题,知识真正变成生产力。',
    metrics:[['↓80%','新人问询耗时'],['1','统一检索入口'],['100%','权限隔离']],
    pains:[
      {t:'新人问询多',d:'新员工每周问同事"这个怎么操作"平均 20 次,老员工被频繁打断。'},
      {t:'知识散落难找',d:'公司制度 / SOP / 培训资料散在 IMA / 乐享 / 邮件 / 群文件 4 个地方。'},
      {t:'老员工离职带走知识',d:'核心员工离职后,业务连续性断崖式下降。'},
      {t:'知识库没人用',d:'传统知识库检索体验差,宁可问人也不查库。'}
    ],
    solution:'基于 IMA 知识库 + 乐享 + 企微文档 + 飞书 Wiki 多源接入,WorkBuddy 扮演"AI 知识管家":自然语言检索 + 段落级引用溯源 + 跨库聚合 + 权限严格隔离。',
    scenes:[
      {t:'对知识库"问"',d:'员工输入"年假怎么请?能请几天?",AI 5 秒返回原文段落 + 链接,带"出处文档"水印。'},
      {t:'向知识库"写"',d:'对话中产生的有价值结论,AI 自动建议"是否归档到知识库?",一键沉淀。'},
      {t:'跨库聚合检索',d:'IMA + 乐享 + 企微文档 + 飞书 Wiki 一站式检索,不用切 4 个系统。'},
      {t:'权限严格隔离',d:'沿用企业 IAM,看不到的内容 AI 拒绝回答并提示"权限不足,请联系管理员"。'},
      {t:'基于对话的微学习',d:'新人每次问答都被记录,管理者可以看到"哪些问题最常被问"反向补全知识库。'}
    ],
    beforeAfter:{before:[['20次/周','新员工问同事次数'],['4 个','知识存储系统'],['0','对话沉淀机制'],['核心员工离职','业务连续性 ↓50%']], after:[['↓2次/周','问询次数(↓90%)'],['1 个','统一 AI 入口'],['100%','对话自动归档'],['知识资产永久沉淀','业务连续性 ↑200%']]},
    timeline:[
      {w:'W1',t:'IMA + 多源知识库授权',d:'授权 IMA API + 乐享/企微/飞书知识库接入。'},
      {w:'W2',t:'建立索引 + QA 规则',d:'首次全量索引 + 配置部门专属 QA 模板。'},
      {w:'W3',t:'试运行 + 微学习看板',d:'选 2 个部门试跑,产出"高频问题 Top20"反向补全知识库。'},
      {w:'W4+',t:'全员上线 + 持续优化',d:'全公司推广,知识库每 2 周迭代一次。'}
    ],
    summary:['新人问询从 20 次/周 → 2 次/周,上手周期 ↓60%','IMA / 乐享 / 企微 / 飞书 4 库统一 AI 入口','对话自动归档,知识资产永存,核心员工离职不影响','权限严格隔离,数据安全可审计']
  },

  // ========== 产业带 OPC 7 个 ==========
  {
    fn:'belt-cloth.html', type:'belt',
    color:'#BE185D', bg:'#FCE7F3', txt:'#BE185D',
    tag:'广州十三行 · 服装产业带',
    title:'AI 选品 + 7 天上新流水线',
    lead:'广州十三行 / 杭州四季青 / 濮院羊毛衫 三大服装产业带。<strong>痛点:档口老板靠经验选品、爆款生命周期 7-15 天,款式跑赢同行才能活</strong>。WorkBuddy 用 AI 把"看趋势 → 选款 → 打版 → 上架"压缩到 7 天。',
    metrics:[['↑40%','选品命中率'],['↓60%','上新周期'],['12','目标电商平台']],
    pains:[
      {t:'选品靠老板经验',d:'档口老板跑 1688 / 拼多多 / 抖音,凭感觉判断"哪个能爆",命中率 30% 不到。'},
      {t:'打版周期长',d:'从款式确定到打版师出工艺单平均 5-7 天,错过最佳上新窗口。'},
      {t:'跨境文案成本高',d:'一件衣服要做 12 国语言商品图 + 详情页,翻译 + 拍摄成本吃光利润。'},
      {t:'定价拍脑袋',d:'跟价 / 调价靠老板心情,利润与库存难以平衡。'}
    ],
    solution:'基于"趋势雷达 → 选品决策 → AI 打版 → 多语言上架 → 智能定价"五段流水线,WorkBuddy 把档口老板从"全能操作员"变成"决策者",AI 接管 80% 机械工作。',
    scenes:[
      {t:'每日 AI 选品报告',d:'每天早 9 点推送"今日爆款 / 潜力款 / 退场款"三档分类,带来源数据(TikTok / 小红书 / 1688 热搜)。'},
      {t:'2 小时 AI 打版',d:'上传参考图 → AI 自动出工艺单 + BOM 物料清单 + 推荐工厂,2 小时出稿。'},
      {t:'12 国语言商品图',d:'1 张产品图 → AI 自动换肤 + 多语言文案 + 当地模特,12 国 30 分钟搞定。'},
      {t:'多平台一键上架',d:'12 个电商平台(拼多多 / 抖店 / 1688 / TikTok Shop / Shopee / Lazada 等)一次填全。'},
      {t:'智能动态定价',d:'基于竞品实时价格 + 自家库存 + 销量,AI 每小时调价,利润最大化。'}
    ],
    beforeAfter:{before:[['30%','选品命中率'],['15 天','款式从定到卖周期'],['¥800/件','单 SKU 上架成本'],['凭感觉','定价方式']], after:[['↑40%','选品命中率'],['↓7天','款式周期'],['↓¥80/件','上架成本(↓90%)'],['AI 动态','利润 ↑15%']]},
    timeline:[
      {w:'W1',t:'平台账号授权 + 数据源接入',d:'授权 12 个电商平台 + 接入 TikTok/小红书/1688 数据爬虫。'},
      {w:'W2',t:'选品模型 + 历史爆款训练',d:'用档口过去 1 年销售数据训练选品模型,首次输出"今日 Top10"。'},
      {w:'W3',t:'打版 / 多语言 / 上架 skill',d:'封装 4 类核心 skill,先跑通"参考图 → 多平台商品"端到端。'},
      {w:'W4+',t:'试跑 + 持续优化',d:'选 50 家档口试跑 1 个月,根据转化率数据持续调优。'}
    ],
    summary:['选品命中率 ↑40%,爆款概率大幅提升','上新周期 15 天 → 7 天,吃满爆款窗口期','12 国语言商品图成本 ↓90%,跨境卖货门槛归零','AI 动态定价,毛利率 ↑15%']
  },
  {
    fn:'belt-hanfu.html', type:'belt',
    color:'#7E22CE', bg:'#F3E8FF', txt:'#7E22CE',
    tag:'山东曹县 · 汉服产业带',
    title:'汉服文化解读 + 图案 AI 生成',
    lead:'曹县是全球汉服第一县,年产汉服 4 亿件。<strong>痛点:汉服讲究"形制 + 纹样 + 配色"的文化考据,小工厂抄款常出文化错;设计依赖少数画师,产能瓶颈</strong>。WorkBuddy 接入汉服形制知识库 + 历代纹样数据集,AI 辅助形制校验 + 纹样生成 + 文化注释自动写。',
    metrics:[['↑3x','设计产能'],['↓90%','文化错误率'],['12','历代纹样数据集']],
    pains:[
      {t:'形制错抄款多',d:'小工厂对汉服形制不熟,常把宋代褙子做成明代披风,被汉服圈消费者群嘲,退货率 20%+。'},
      {t:'设计依赖少数画师',d:'资深画师年薪 30 万+,50 家工厂抢一个画师,新设计排到 3 个月后。'},
      {t:'纹样文化错乱',d:'把唐代联珠纹和明代缠枝莲混搭,文化组合错误,影响品牌调性。'},
      {t:'文化注释不会写',d:'商品详情页文化背景描述粗糙,粉丝不买账,转化率低。'}
    ],
    solution:'基于汉服形制知识库(13 朝代 30+ 形制)+ 历代纹样数据集(12 个朝代 8000+ 纹样),WorkBuddy 提供"形制校验 + 纹样生成 + 文化注释"三件套,让 50 人的小工厂也能做出博物馆级的汉服。',
    scenes:[
      {t:'形制智能校验',d:'上传设计稿,AI 自动标"这是齐胸襦裙 / 晚唐形制 / 收 1 处结构错误",3 秒出结果。'},
      {t:'纹样 AI 生成',d:'输入"唐代联珠纹 + 缠枝莲 + 朱红/石青配色",AI 出 4 版纹样稿,带朝代出处标注。'},
      {t:'文化注释自动写',d:'商品详情页文化背景、穿着场合、配色典故,AI 自动生成 800 字专业注释。'},
      {t:'联名款共创',d:'与博物馆/动漫/游戏联名时,AI 提取对方 IP 元素 + 汉服形制匹配,3 天出联名草案。'},
      {t:'短视频脚本',d:'一条新汉服,AI 自动生成 3 版抖音文案 + 拍摄脚本 + BGM 建议。'}
    ],
    beforeAfter:{before:[['20%','因形制错退货率'],['3 个月','新设计排期'],['30%','设计稿文化错乱'],['手工','文化注释']], after:[['↓2%','退货率(↓90%)'],['↓3天','AI 即时出稿'],['↓5%','文化错乱(↓83%)'],['AI 1 分钟','文化注释']]},
    timeline:[
      {w:'W1',t:'汉服形制知识库接入',d:'与本地汉服协会合作,接入 13 朝代形制数据集。'},
      {w:'W2',t:'纹样数据集 + AI 生成',d:'建立 12 朝代 8000+ 纹样索引,训练生成模型。'},
      {w:'W3',t:'校验 + 注释 + 短视频',d:'封装 4 类核心 skill,先服务 10 家头部工厂。'},
      {w:'W4+',t:'全产业带推广 + 联名合作',d:'全 60+ 工厂推广,与博物馆/动漫 IP 启动联名。'}
    ],
    summary:['形制退货率 ↓90%,品牌口碑 ↑','设计产能 ↑3x,新设计从 3 个月 → 3 天','联名款交付周期 1 个月 → 1 周,IP 合作机会 ↑','文化注释专业化,粉丝粘性 ↑,复购率 ↑25%']
  },
  {
    fn:'belt-furn.html', type:'belt',
    color:'#B45309', bg:'#FEF3C7', txt:'#B45309',
    tag:'佛山顺德 · 家具产业带',
    title:'AI 渲染 + 询盘秒回 + 跨境合规',
    lead:'佛山 + 东莞 + 苏州 三大家具产业带。<strong>痛点:实木/板式家具 SKU 多、单值高、决策周期长,客户咨询常在 WhatsApp / 邮件多语言沟通;跨境订单需欧美环保认证(FSC/CARB/CE)</strong>。WorkBuddy:AI 室内渲染图 + 24h 多语言询盘秒回 + 认证资料自动生成。',
    metrics:[['↓85%','询盘响应时长'],['↑2.5x','跨境成单率'],['40+','出口国家']],
    pains:[
      {t:'SKU 多展示难',d:'单家工厂 500+ 款式,客户要"放在我家什么样",传统做法是寄样品或拍场景图,周期 7-15 天。'},
      {t:'询盘响应慢',d:'跨境客户通过 WhatsApp / 邮件咨询,人工响应 4-12 小时,30% 客户因等不及流失。'},
      {t:'跨境认证分散',d:'美 FSC / 加 CARB / 欧 CE / 英 UKCA 不同标准,法务成本高,出错影响出货。'},
      {t:'客户分级不准',d:'C 端散户 + B 端品牌方 + 工程单混在一起,资源错配。'}
    ],
    solution:'基于"AI 渲染 → 多语言秒回 → 客户分级 → 认证自动生成 → 跟单"五段流水线,WorkBuddy 把家具工厂从"接单型"升级为"主动营销型",跨境生意从被动变主动。',
    scenes:[
      {t:'AI 室内场景渲染',d:'1 张白底产品图 → AI 出 10 套客厅/卧室/书房场景图,30 秒出图,客户看图决策 ↑3x。'},
      {t:'7 国语言询盘秒回',d:'英/西/阿/法/俄/葡/德 7 国语言自动识别 + 智能回复,带产品图册和报价表。'},
      {t:'客户智能分级',d:'从询盘内容自动识别 C 端/B 端/工程单,自动分配不同销售跟单策略。'},
      {t:'跨境认证自动生成',d:'根据目的国自动生成 CE / FSC / CARB / UKCA 等合规包,法务复核即可。'},
      {t:'WhatsApp 7×24 售后',d:'客户安装 / 保养 / 配件问题,AI 7×24 答,人工只处理复杂投诉。'}
    ],
    beforeAfter:{before:[['4-12h','询盘平均响应'],['7-15 天','场景图出图周期'],['30%','询盘客户流失'],['2 周','单份跨境认证']], after:[['↓10min','秒回(↓85%)'],['30 秒','AI 即时出图'],['↓10%','询盘流失'],['↓1天','认证生成(↓93%)']]},
    timeline:[
      {w:'W1',t:'工厂产品库 + 渲染模型',d:'上传 500+ 款产品图,训练专属渲染模型。'},
      {w:'W2',t:'WhatsApp / 邮件接入',d:'授权 WhatsApp Business API + 企业邮箱,接入多语言引擎。'},
      {w:'W3',t:'认证 + 客户分级',d:'与认证机构合作建立规则库,部署客户分级 AI。'},
      {w:'W4+',t:'试跑 + 持续优化',d:'选 20 家头部工厂试跑 1 个月,根据转化率数据调优。'}
    ],
    summary:['询盘响应从 4-12h → 10min,跨境成单率 ↑2.5x','AI 渲染替代实景拍摄,场景图成本 ↓90%','7 国语言 7×24 客服,人工成本 ↓60%','跨境认证 2 周 → 1 天,出货周期 ↓30%']
  },
  {
    fn:'belt-toy.html', type:'belt',
    color:'#C2410C', bg:'#FFEDD5', txt:'#C2410C',
    tag:'汕头澄海 · 玩具产业带',
    title:'AI 短视频 + 多平台铺货 + 版权风控',
    lead:'汕头澄海年产玩具 5 亿只,占全国塑胶玩具 60%。<strong>痛点:爆款依赖 IP 授权,版权风险高;短视频带货压力大,小厂拍不动视频</strong>。WorkBuddy:合规 IP 知识库 + AI 商品图 / 短视频自动生成 + 多平台一键铺货 + 侵权风险扫描。',
    metrics:[['↓95%','版权纠纷'],['↑5x','日更视频量'],['12','合规 IP 库']],
    pains:[
      {t:'IP 侵权高发',d:'中小厂常因"长得像迪士尼/万代/奥特曼"被告,单次赔偿 5-50 万,小厂一告就死。'},
      {t:'短视频拍不动',d:'抖音 / 快手带货是趋势,但单条短视频拍摄 + 剪辑人工 4-6 小时,小厂日产 1-2 条。'},
      {t:'多平台铺货繁琐',d:'拼多多 / 抖店 / 1688 / Temu / TikTok Shop 每个平台后台不同,1 个 SKU 重复填 5 遍。'},
      {t:'儿童安全标准严',d:'3C 认证 / 警示语 / 年龄分组,差一个标点就过不了关。'}
    ],
    solution:'基于"版权雷达 → AI 短视频 → 一键铺货 → 合规文案"四段流水线,WorkBuddy 让玩具小厂也能日更 50 条视频、铺 12 个平台、零版权风险。',
    scenes:[
      {t:'版权风险扫描',d:'上传产品图,AI 自动比对 12 个 IP 库(迪士尼/万代/奥特曼/三丽鸥/孩之宝等),3 秒标红风险点 + 改稿建议。'},
      {t:'AI 短视频自动生成',d:'1 张产品图 + 卖点文案 → AI 自动生成 30 秒带货视频,含字幕 / BGM / 配音 / 转场。'},
      {t:'多平台一键铺货',d:'1 个 SKU → 自动适配拼多多/抖店/1688/Temu/TikTok Shop 等 12 平台规格,一键发布。'},
      {t:'合规文案自动加',d:'3C 警示语 / 年龄分组 / 安全提示,AI 自动按平台规则 + 目的国法规生成。'},
      {t:'爆款预测',d:'基于历史数据 + 当前热度,AI 预测"未来 7 天可能爆"的 5 款玩具,建议加码备货。'}
    ],
    beforeAfter:{before:[['1-2条','单厂日更视频量'],['5 遍','单 SKU 多平台填表'],['高发','IP 侵权风险'],['人工','合规文案']], after:[['↑50条','日产(↑25x)'],['1 次','一键铺 12 平台'],['↓95%','侵权风险'],['AI 自动','合规无错']]},
    timeline:[
      {w:'W1',t:'12 个 IP 库接入 + 风险模型',d:'与版权代理合作,接入主流 IP 数据库,训练比对模型。'},
      {w:'W2',t:'AI 短视频 skill',d:'封装"1 张图 → 30 秒视频"skill,首批 30 家工厂试跑。'},
      {w:'W3',t:'多平台铺货 skill',d:'对接 12 个电商平台 API,封装一键铺货 skill。'},
      {w:'W4+',t:'合规 + 爆款预测',d:'上线合规文案 + 爆款预测,服务 200+ 玩具工厂。'}
    ],
    summary:['IP 侵权风险 ↓95%,版权诉讼几乎归零','日更视频量 2 条 → 50 条,抖音爆款率 ↑5x','12 平台一键铺货,运营人员 ↓70%','合规文案 AI 自动,3C 认证一次过']
  },
  {
    fn:'belt-hair.html', type:'belt',
    color:'#0F766E', bg:'#CCFBF1', txt:'#0F766E',
    tag:'河南许昌 · 发制品产业带',
    title:'跨境合规 + 多肤色适配 + 售后自动答',
    lead:'许昌发制品占全球 60% 产能,90% 出口。<strong>痛点:跨境合规(美 FDA / 欧 CE / 非清真认证)分散;不同肤色 / 发质客户沟通成本高;售后问题重复</strong>。WorkBuddy:认证资料自动生成 + 多肤色产品图 + WhatsApp 售后机器人 7×24 答。',
    metrics:[['↑70%','跨境合规通过'],['↓50%','售后人力'],['40+','出口国家']],
    pains:[
      {t:'跨境认证分散',d:'美 FDA / 欧 CE / 加 Health Canada / 非清真 / 中东 SASO,标准不同,法务成本高。'},
      {t:'肤色适配难',d:'同一款产品在白皮/黄皮/黑皮客户头上效果差很多,客户"想象不出"导致下单犹豫。'},
      {t:'售后问题重复',d:'怎么洗 / 能染吗 / 几天到 / 怎么保养,占客服 70% 工作量。'},
      {t:'小语种市场进不去',d:'阿拉伯语 / 西班牙语 / 葡萄牙语市场大,但人工成本高,小厂做不了。'}
    ],
    solution:'基于"认证自动生成 + 多肤色产品图 + 7 国语言客服 + 节庆营销"四段流水线,WorkBuddy 把许昌发制品从"贴牌代工"升级为"全球品牌"。',
    scenes:[
      {t:'认证资料自动生成',d:'按目的国自动出 FDA / CE / CPSC / SASO / 清真等合规包,法务 1 小时复核即可。'},
      {t:'多肤色产品图',d:'1 款产品图 8 种肤色(白/黄/棕/黑 + 深浅)自动换脸,客户"看到自己"决策 ↑3x。'},
      {t:'WhatsApp 7×24 售后',d:'英/西/阿/法 7 国语言,常见问题秒回,人工只处理复杂投诉。'},
      {t:'跨境节庆营销',d:'黑五 / 双 11 / 斋月 / 圣诞节,AI 自动生成当地节庆营销话术 + 主图。'},
      {t:'复购提醒 + 客户分层',d:'基于购买周期自动触达老客,VIP 客户自动升单,转化率 ↑2x。'}
    ],
    beforeAfter:{before:[['50%','首次合规通过'],['8h','单语种客服响应'],['70%','客服是重复问题'],['无品牌','贴牌代工']], after:[['↑85%','合规通过(↑70%)'],['↓10s','7×24 多语种'],['↓10%','人工处理比例'],['品牌化','海外溢价 ↑30%']]},
    timeline:[
      {w:'W1',t:'各国认证规则库 + 多肤色模型',d:'与认证机构合作建库,训练肤色适配模型。'},
      {w:'W2',t:'WhatsApp Business 接入',d:'授权 WhatsApp Business API,部署多语种客服。'},
      {w:'W3',t:'认证自动生成 + 多肤色产品图',d:'封装 2 大核心 skill,服务 30 家头部工厂。'},
      {w:'W4+',t:'节庆营销 + 复购系统',d:'上线节庆话术 + 老客复购,服务 90+ 工厂。'}
    ],
    summary:['跨境合规通过率 ↑70%,出货周期 ↓40%','多肤色产品图让客户"看到自己",转化率 ↑3x','7 国语言 7×24 客服,售后人力 ↓50%','从贴牌代工升级为全球品牌,海外溢价 ↑30%']
  },
  {
    fn:'belt-shoe.html', type:'belt',
    color:'#1D4ED8', bg:'#DBEAFE', txt:'#1D4ED8',
    tag:'福建泉州 · 鞋服产业带',
    title:'AI 鞋款设计 + 客户协同 + 大货质检',
    lead:'泉州 / 晋江 鞋服产业带,年产运动鞋 16 亿双,占全国 40%。<strong>痛点:大客户(品牌方)对设计稿改 5-8 版才定稿,沟通成本高;大货生产质检依赖熟练工人</strong>。WorkBuddy:AI 出 8 版鞋款 + 客户评审系统 + 大货瑕疵 AI 识别。',
    metrics:[['↓70%','设计稿改版次数'],['↑40%','质检准确率'],['8','覆盖品牌方']],
    pains:[
      {t:'设计稿改 8 版才定',d:'大品牌方对配色 / 材质 / 鞋型极挑剔,1 双鞋平均改 5-8 版,设计周期 2-3 个月。'},
      {t:'客户评审沟通乱',d:'微信发图 / 邮件批注 / 现场看样,反馈散乱,设计师重复改稿。'},
      {t:'大货质检靠人眼',d:'流水线日生产 5,000 双,熟练工人目检漏检率 3-5%,品牌方索赔风险大。'},
      {t:'打版成本高',d:'1 双打版鞋成本 ¥800+,一次打 8 版要 ¥6400,试错成本高。'}
    ],
    solution:'基于"AI 设计 → 客户评审 → 大货质检 → 成本核算"四段流水线,WorkBuddy 把鞋服工厂从"代工型"升级为"ODM 设计型",大客户沟通效率 ↑5x,大货出厂品质 ↑40%。',
    scenes:[
      {t:'AI 一次出 8 版鞋款',d:'输入"复古跑鞋 + 透气网面 + 白橙配色",AI 出 8 版配色稿,每版 3 个角度,30 分钟出图。'},
      {t:'客户专属评审空间',d:'大 B 客户在专属空间勾选 / 改稿 / 留语音,AI 自动汇总改稿意见,设计师一次看清。'},
      {t:'大货瑕疵 AI 识别',d:'流水线相机拍照,AI 比对标准样识别瑕疵(线头/溢胶/色差/歪斜),准确率 ↑40%。'},
      {t:'AI 自动出 BOM + 成本',d:'设计定稿后,AI 自动出 BOM 物料清单 + 工艺单 + 成本核算(原材料/人工/损耗)。'},
      {t:'虚拟打版',d:'1 张 AI 设计稿 → 3D 虚拟样品图 + 360° 展示,客户"看图决策"省去打版费。'}
    ],
    beforeAfter:{before:[['5-8 版','单款设计改版次数'],['2-3 个月','大客户设计周期'],['3-5%','人工质检漏检率'],['¥6400','单款打版成本']], after:[['↓1-2 版','客户一次选稿'],['↓3 周','设计周期(↓70%)'],['↓0.5%','AI 质检漏检'],['↓¥0','虚拟打版省成本']]},
    timeline:[
      {w:'W1',t:'设计模型 + 品牌库接入',d:'训练鞋款设计模型,接入 8 家品牌方偏好库。'},
      {w:'W2',t:'客户评审系统 + 大货相机',d:'部署评审空间 + 流水线相机网络。'},
      {w:'W3',t:'瑕疵 AI 识别模型',d:'基于 10 万 + 瑕疵样本训练识别模型。'},
      {w:'W4+',t:'全流程串联 + 持续优化',d:'4 段流水线串联,服务 50+ 鞋服工厂。'}
    ],
    summary:['设计改版 5-8 版 → 1-2 版,设计周期 ↓70%','AI 质检漏检率 3-5% → 0.5%,品牌方索赔风险 ↓','虚拟打版替代实物打版,单款省 ¥6400+','从代工型升级为 ODM 设计型,大客户粘性 ↑5x']
  },
  {
    fn:'belt-ecom.html', type:'belt',
    color:'#047857', bg:'#D1FAE5', txt:'#047857',
    tag:'浙江义乌 · 小商品产业带',
    title:'全链路 AI 操作员 · 4 万档口',
    lead:'义乌国际商贸城 7.5 万个商位,小商品 26 大类。<strong>痛点:档口 SKU 海量(单家 2,000+),上新品 / 答客户 / 跟单 / 物流 占满 4 个员工</strong>。WorkBuddy:每个档口配 1 个 AI 数字员工,接管"商品上架 + 询盘答 + 物流跟 + 复购提醒"全链路,老板只管拿大单。',
    metrics:[['↓75%','档口用工'],['↑2x','GMV 转化'],['4,000+','覆盖档口']],
    pains:[
      {t:'SKU 海量上架累',d:'单家档口 2,000+ SKU,新到 1 批货(50 个新品)要花 1 个员工 3 天上架。'},
      {t:'询盘答不完',d:'客户多在 WhatsApp / 1688 询盘,询盘回复占老板 60% 时间,常错过大单。'},
      {t:'物流跟单烦',d:'17track / 顺丰 / DHL 多物流公司,跟单繁琐,异常客户催才处理。'},
      {t:'老客复购断',d:'老客买完就失联,没有复购提醒,GMV 增长全靠新客。'}
    ],
    solution:'基于"商品上架 + 询盘答 + 物流跟 + 复购提醒"全链路 AI 数字员工,WorkBuddy 让每个档口老板只管"拿大单 + 决策",所有机械工作 AI 包干。',
    scenes:[
      {t:'Excel 一键上架 4 平台',d:'Excel 1 份 → AI 自动转 1688 / 拼多多 / 抖店 / TikTok Shop 4 平台规格,30 分钟搞定。'},
      {t:'多语种询盘智能答',d:'英/阿/西/俄 4 国语言,询盘 5 秒内回复,带产品图册 + 报价表 + 起订量。'},
      {t:'17track 物流自动跟',d:'订单发货后,17track 自动追踪 + 异常主动通知客户,客户满意度 ↑2x。'},
      {t:'30/60/90 天复购提醒',d:'老客按购买周期自动触达,新品上架主动推,GMV 转化 ↑2x。'},
      {t:'老板专属大单看板',d:'AI 自动筛出"高价值大单 / 待报价 / 需跟单"Top10,老板只看这 10 单。'}
    ],
    beforeAfter:{before:[['4 个员工','单档口用工'],['60%','老板花在询盘答'],['新客依赖','GMV 增长'],['8h','50 个新品上架']], after:[['1 个员工','档口用工 ↓75%'],['↓5%','AI 接管(↓92%)'],['老客复购 ↑40%','GMV 增长结构优化'],['30min','一键上架 ↓94%']]},
    timeline:[
      {w:'W1',t:'档口数字化基线 + 数据接入',d:'完成档口商品/客户/订单数据接入,建立数字孪生。'},
      {w:'W2',t:'4 平台铺货 + 多语种客服',d:'封装"Excel → 4 平台"与"多语种询盘"双 skill。'},
      {w:'W3',t:'物流跟单 + 复购提醒',d:'对接 17track + 顺丰/DHL,部署老客复购引擎。'},
      {w:'W4+',t:'4,000+ 档口规模化推广',d:'与义乌商贸城合作,批量推广,4 周内覆盖 4,000+ 档口。'}
    ],
    summary:['单档口用工从 4 人 → 1 人,人力成本 ↓75%','老板从询盘/上架/跟单中解放,专注大单,GMV ↑2x','老客复购 ↑40%,GMV 增长结构从纯新客转向老客','4,000+ 档口覆盖,义乌商贸城整体数字化 ↑1 档']
  }
];

// ============== 模板渲染 ==============
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function escQ(s) { return esc(s).replace(/"/g,'&quot;'); }

function renderScenes(scenes, color) {
  return scenes.map((s, i) => `
    <div class="card scene-card">
      <h3><span class="idx" style="background:${color}">${i+1}</span>${esc(s.t)}</h3>
      <p>${esc(s.d)}</p>
    </div>`).join('');
}

function renderPains(pains) {
  return pains.map((p, i) => `
    <div class="card pain-card">
      <h3><span class="idx">${i+1}</span>${esc(p.t)}</h3>
      <p>${esc(p.d)}</p>
    </div>`).join('');
}

function renderCompare(cmp) {
  return `
    <div class="compare">
      <div class="cmp before">
        <div class="ctitle">改造前 · Before</div>
        ${cmp.before.map(r => `<div class="row"><span class="k">${esc(r[1])}</span><span class="v">${esc(r[0])}</span></div>`).join('')}
      </div>
      <div class="cmp-arrow">→</div>
      <div class="cmp after">
        <div class="ctitle">改造后 · After</div>
        ${cmp.after.map(r => `<div class="row"><span class="k">${esc(r[1])}</span><span class="v">${esc(r[0])}</span></div>`).join('')}
      </div>
    </div>`;
}

function renderTimeline(tl) {
  return `
    <div class="timeline">
      <h3>实施路径 · 4 周上线</h3>
      ${tl.map(t => `
        <div class="t-item">
          <div class="tw">${esc(t.w)}</div>
          <div class="tcontent">
            <h4>${esc(t.t)}</h4>
            <p>${esc(t.d)}</p>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderPage(p) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.title)}</title>
<style>${CSS}
.hero .tag{background:${p.bg};color:${p.txt}}
.module-card:hover{border-color:${p.color}}
.section-title{border-left-color:${p.color}}
.t-item .tw{color:${p.color};background:${p.bg}}
.m-card .num{color:${p.color}}
.timeline h3{color:${p.color}}
.arch{border-top:3px solid ${p.color}}
.summary-card{background:linear-gradient(135deg,${p.color} 0%,${p.color}DD 100%)}
</style>
</head>
<body>
<div class="wrap">
  <div class="nav">
    <a href="./eco-opc-dashboard.html">← 返回仪表盘</a>
    <span class="crumb">${esc(p.type==='eco' ? '生态联动' : '产业带 OPC 落地案例')}</span>
  </div>

  <div class="hbar">
    <div class="brand">WBD · ${esc(p.type==='eco' ? 'ECOSYSTEM' : 'INDUSTRIAL BELT OPC')}</div>
    <div class="hero">
      <span class="tag">${esc(p.tag)}</span>
      <h1>${esc(p.title)}</h1>
      <p class="lead">${p.lead}</p>
      <div class="metrics3">
        ${p.metrics.map(m => `<div class="m-card"><div class="num">${esc(m[0])}</div><div class="label">${esc(m[1])}</div></div>`).join('')}
      </div>
    </div>
  </div>

  <div class="section-title">客户痛点 · Pain Points</div>
  <div class="cards">${renderPains(p.pains)}</div>

  <div class="section-title">WorkBuddy 方案 · Solution</div>
  <div class="arch"><p>${esc(p.solution)}</p></div>

  <div class="section-title">核心场景 · Key Scenarios</div>
  <div class="cards">${renderScenes(p.scenes, p.color)}</div>

  <div class="section-title">效果对比 · Before vs After</div>
  ${renderCompare(p.beforeAfter)}

  <div class="section-title">实施路径 · Implementation</div>
  ${renderTimeline(p.timeline)}

  <div class="section-title">核心价值 · Key Value</div>
  <div class="summary-card card" style="padding:28px 30px">
    <h3 style="margin-bottom:14px;font-size:16px">为什么选择 WorkBuddy?</h3>
    <ul>${p.summary.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
  </div>

  <div class="foot">WorkBuddy · ${esc(p.title)} · 单文件可独立打开,无需内网</div>
</div>
</body>
</html>
`;
}

// ============== 批量生成 ==============
const outDir = __dirname;
let count = 0;
PAGES.forEach(p => {
  const file = path.join(outDir, p.fn);
  fs.writeFileSync(file, renderPage(p), 'utf-8');
  console.log('  ✓ ' + p.fn);
  count++;
});
console.log(`\nDone · 共生成 ${count} 个子页面`);
