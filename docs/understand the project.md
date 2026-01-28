
ENTRESTATE — FULL ACTIVATION PACK

(Authoritative system plan)

⸻

LAYER 1 — CHAT AGENT

Personality, Guardrails, and Conversation Physics

Agent Identity
	•	Role: Real estate intelligence assistant (not salesy, not friendly-bot)
	•	Tone: Calm, professional, adaptive to culture & language
	•	Positioning: “I help you find the right opportunity — not push listings”

Non-Negotiable Guardrails
	•	Never invent projects
	•	Never speak without inventory grounding
	•	Never oversell
	•	Never repeat questions already answered
	•	Never ask more than one intent question at a time
	•	Never continue if user disengages

Conversation Phases (MANDATORY ORDER)
	1.	Context anchoring
	•	“Are you looking to buy, invest, or explore?”
	2.	Intent shaping
	•	Budget range (soft)
	•	Location preference
	3.	Inventory narrowing
	•	2–4 projects max
	4.	Readiness signal
	•	Timeline / seriousness
	5.	Lead preparation
	•	“I’ll prepare this so someone can help you properly.”

Output Contract (STRUCTURED)

Every chat must end with:

{
  "lead_status": "qualified | exploring | cold",
  "intent_score": 0.00–1.00,
  "project_ids": [],
  "next_best_action": "save | follow_up | ignore",
  "reasoning": "string"
}


⸻

LAYER 2 — LEAD INTENT SCORING (EXPLAINABLE)

Intent Score Formula (Transparent)

Intent Score =
  (Engagement × 0.25)
+ (Specificity × 0.30)
+ (Budget Signal × 0.20)
+ (Timeline × 0.15)
+ (Channel Trust × 0.10)

Signal Definitions
	•	Engagement: Replies, depth, time-in-chat
	•	Specificity: Named areas, prices, projects
	•	Budget Signal: Explicit or inferred
	•	Timeline: “now / 3 months / browsing”
	•	Channel Trust: Chat > Site > Upload > Cold list

Thresholds
	•	< 0.35 → Ignore
	•	0.35 – 0.60 → Nurture
	•	> 0.60 → Sales-ready

⚠️ Score must be stored with reasoning. No black box.

⸻

LAYER 3 — PIPELINE (NOT A CRM)

What the Pipeline Does
	•	Stores validated intent
	•	Enriches leads
	•	Activates actions (email, SMS, ads, calls)

What It Never Does
	•	Assign tasks
	•	Track deals
	•	Replace broker judgment

Core Objects

Lead {
  id
  source
  intent_score
  reasoning
  project_focus[]
  status
}


⸻

LAYER 4 — COLD CALLING SYSTEM (STRICT RULE ENGINE)

Activation Rules
	•	Only leads with:
	•	intent_score ≥ 0.45
	•	phone available
	•	Agent chooses one focus:
	•	validate
	•	get listings
	•	sell

Hard Stop Rule
	•	5 rejected calls → permanently ignored
	•	No retries
	•	No override
	•	Logged forever

Voice Agent Constraints
	•	Multilingual
	•	Neutral tone
	•	Never pressure
	•	Ends call immediately on resistance

⸻

LAYER 5 — INVENTORY ACTION ENGINE

Every project must expose:
	1.	createLandingPage(projectId)
	2.	draftListing(projectId)
	3.	generateSalesMessage(projectId)
	4.	prepareLeadPack(projectId, leadId)

These are functions, not UI tricks.

⸻

LAYER 6 — SITE BUILDER (REAL RULES)

Inventory Loading
	•	limit = 12
	•	Cursor-based pagination
	•	No full preload (quota protection)

Builder Start States

Exactly ONE must be chosen:
	•	From inventory
	•	From PDF
	•	From prompt
	•	From template

Builder Contract
	•	Must respect selected project
	•	Must generate lead-ready pages
	•	Must auto-connect Chat Agent

⸻

LAYER 7 — GOOGLE ADS (AUTOMATED, PREPAID)

System Flow
	1.	URL in
	2.	Campaign plan out
	3.	Budget slider
	4.	Forecast updates live
	5.	Leads → Pipeline

No external ad accounts.
No “expert mode”.

⸻

LAYER 8 — CODEX TASK MAP (SYSTEM MANAGER PROMPT)

Codex Responsibilities
	•	Routes & APIs
	•	State integrity
	•	Pagination & quotas
	•	PDF processing lifecycle
	•	Chat → Lead → Pipeline glue
	•	Remove placeholders
	•	Enforce all rules above

Immediate Codex Fix List
	1.	/api/health/env post-release validation
	2.	Inventory pagination (12 + load)
	3.	Builder menu visibility
	4.	PDF analysis stuck state
	5.	Project drafting on start
	6.	Replace generic email/SMS/chat flows
	7.	Ensure builder respects selected project

⸻

LAYER 9 — GEMINI UI PROMPT (STRICT)

Gemini ONLY does:
	•	Funnels
	•	Layout
	•	Copy
	•	Visual hierarchy
	•	Conversion flow

Gemini NEVER:
	•	Decides logic
	•	Changes flow order
	•	Invents behavior
	•	Touches data rules

⸻

FINAL LOCK

First Loop = SUCCESS WHEN:
	•	Chat produces qualified leads
	•	Leads enter pipeline correctly
	•	Inventory actions work
	•	Builder outputs usable landing pages
	•	One paid Chat Agent user can operate end-to-end

Everything else comes after 

⸻