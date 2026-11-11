/** One box in a service diagram. `x`/`y` are its centre in a 400 × 340 field. */
export interface GraphNode {
  id: string
  /** Keep it to ~13 characters: three nodes share a row on a 390px phone. */
  label: string
  x: number
  y: number
  /** A TechIcon name, or a concept key (`chat`, `db`, `bars`…). None: a dot. */
  icon?: string
}

export interface Service {
  /** Also the URL: the service's own page is `/services/<id>`. */
  id: string
  /** Short label for the index row. */
  title: string
  /** One line, shown collapsed. */
  summary: string
  /** What the engagement actually produces. */
  deliverables: string[]
  /** Names must exist in TechIcon's map or they fall back to the cube glyph. */
  stack: string[]

  // ── The service page (`pages/ServicePage.tsx`) ───────────────────────────
  /** The page's <title>, before " — Ahmed Islam". Carries the words people
   *  actually search for, which `title` (a label in a list) doesn't need to. */
  seoTitle: string
  /** Meta description and share text. Keep it under ~160 characters. */
  description: string
  /** The H1, as the site's two-tone pair: solid line, then ghost line. */
  heading: [string, string]
  /** "The problem": one statement, lit in reading order as it scrolls in. */
  problem: string
  /** The system the page is about, drawn whole in the hero and built up step
   *  by step in "How I build it". Diagrams, not screenshots: generic parts. */
  graph: { nodes: GraphNode[]; edges: [string, string][] }
  /** "How I build it". Each step lights the nodes it adds to the diagram. */
  steps: { title: string; body: string; nodes: string[] }[]
  /** "Where I've done it": CV entries (`EXPERIENCE` in Work.tsx) by company,
   *  and which of its `points` apply. Quoted as written, never paraphrased. */
  experience: { company: string; points: number[] }[]
  /** Slugs from `data/projects.ts`, shown under the CV lines. */
  projects: string[]
  /** "Questions clients ask". */
  faqs: { q: string; a: string }[]
}

/**
 * DRAFT COPY — the second section not taken from the CV (Method is the other).
 * These are positioning, not facts: nothing here claims a past client or a metric.
 *
 * Every `stack` entry below is in `Stack.tsx`, so the offer stays inside what Ahmed
 * demonstrably works with. `web-apps` used to hedge — the CV listed JavaScript,
 * FastAPI and REST APIs but no front-end — so it sold "the interface on top of the
 * AI" rather than front-end work. Ahmed added HTML, CSS, Tailwind and Bootstrap to
 * the stack on 2026-08-12 and asked for the hedge removed, so it now sells the
 * front end outright. Put the hedge back if the stack ever loses that group.
 *
 * `web-development` is the second half of the full-stack reframe (2026-08-12):
 * web development sold on its own terms, with no AI in it, because that is now
 * half of what Ahmed takes on. It sits beside `full-stack-ai` rather than
 * replacing it — one is a site or app, the other is a product with a model
 * inside it, and a visitor who wants the first should not have to read an agent
 * pitch to find it.
 *
 * Each service has its own page since 2026-11-11 (SEO step 2: Google ranks
 * pages, not sites, so one home page can't rank for seven services). The `id`s
 * were renamed then to be the URL slugs, so they carry search words. The page
 * copy (`problem`, `steps`, `faqs`) is DRAFT positioning like the rest of this
 * file; the only claims about Ahmed's own work are the CV lines `experience`
 * points at, quoted rather than retold.
 *
 * This file is also imported by `blog.vite.ts` at build time, in Node. Keep it
 * plain data: no imports, no `import.meta.env`.
 */
export const SERVICES: Service[] = [
  {
    id: 'agentic-ai',
    title: 'Agentic AI systems',
    summary: 'Multi-agent workflows that do real work instead of demoing well.',
    deliverables: [
      'Agent graph design — state, routing, retries, human-in-the-loop',
      'Tool surface over your existing APIs and business logic',
      'An MCP server so any client can call those tools',
      'Rubric-graded evaluation before anything reaches users',
    ],
    stack: ['LangGraph', 'LangChain', 'MCP', 'Python'],
    seoTitle: 'Agentic AI Development',
    description:
      'Agentic AI systems built for production: multi-agent workflows in LangGraph, tools exposed through an MCP server, and rubric-graded evaluation before launch.',
    heading: ['Agentic AI', 'systems'],
    problem:
      'An agent that works in a demo can still fail on step ten of a real task. It calls the wrong tool, loses the thread, or answers with confidence and nobody checks.',
    graph: {
      nodes: [
        { id: 'request', label: 'Request', x: 200, y: 36, icon: 'chat' },
        { id: 'memory', label: 'Memory', x: 72, y: 112, icon: 'Redis' },
        { id: 'supervisor', label: 'Supervisor', x: 200, y: 112, icon: 'LangGraph' },
        { id: 'evaluator', label: 'Evaluator', x: 328, y: 112, icon: 'bars' },
        { id: 'data', label: 'Data agent', x: 96, y: 192, icon: 'nodes' },
        { id: 'action', label: 'Action agent', x: 304, y: 192, icon: 'nodes' },
        { id: 'mcp', label: 'MCP server', x: 200, y: 258, icon: 'MCP' },
        { id: 'tracing', label: 'Tracing', x: 328, y: 304, icon: 'Langfuse' },
        { id: 'apis', label: 'Your APIs', x: 200, y: 314, icon: 'plug' },
      ],
      edges: [
        ['request', 'supervisor'],
        ['supervisor', 'memory'],
        ['supervisor', 'evaluator'],
        ['supervisor', 'data'],
        ['supervisor', 'action'],
        ['data', 'mcp'],
        ['action', 'mcp'],
        ['mcp', 'apis'],
        ['mcp', 'tracing'],
      ],
    },
    steps: [
      {
        title: 'Map the work',
        body: 'I start with the job, not the model. We list the tasks the system must do, the data each one needs, and where a person has to approve an action.',
        nodes: ['request', 'supervisor'],
      },
      {
        title: 'Build the tools',
        body: 'Agents act through tools. Your APIs and business logic become tools with clear inputs, served from an MCP server so any agent or MCP client can call them.',
        nodes: ['mcp', 'apis'],
      },
      {
        title: 'Wire the agents',
        body: 'Each agent gets one job and only the tools it needs. LangGraph holds the state, routes between agents and retries a step that fails. Memory keeps the conversation together.',
        nodes: ['data', 'action', 'memory'],
      },
      {
        title: 'Grade every answer',
        body: 'Before users see it, a set of real questions runs through the system and each answer is graded against a rubric. A change that makes answers worse shows up as a lower score.',
        nodes: ['evaluator'],
      },
      {
        title: 'Ship it and watch it',
        body: 'It goes live with tracing on each call: which agent ran, which tools it used, how long it took. Problems show up on a dashboard before they reach a user.',
        nodes: ['tracing'],
      },
    ],
    experience: [
      { company: 'Padelos', points: [0, 1, 2] },
      { company: 'IR Solutions', points: [0, 1] },
      { company: 'University of Haripur', points: [3] },
    ],
    projects: ['padelgpt', 'segments'],
    faqs: [
      {
        q: 'Do I need several agents, or is one enough?',
        a: 'Often one agent with good tools is enough, and it is easier to run. I split the work into more agents only when the tasks really differ, such as reading data and changing it.',
      },
      {
        q: 'Can the agents use our existing systems?',
        a: 'Yes. Your APIs and business logic become tools the agents call. With an MCP server in front of them, other MCP clients can use the same tools later.',
      },
      {
        q: 'How do you know the answers are right?',
        a: 'A test set of real questions runs before each release, and every answer is graded against a rubric. You get the scores in a report, so quality is something you can track.',
      },
      {
        q: 'Which model do you use?',
        a: 'The one that fits the task and the budget. The agent graph doesn’t depend on one provider, so the model can change without rebuilding the system.',
      },
    ],
  },
  {
    id: 'rag-development',
    title: 'RAG & knowledge systems',
    summary: 'Answers grounded in your own documents, with the retrieval measured.',
    deliverables: [
      'Ingestion and chunking pipeline for your corpus',
      'Vector store selection, indexing and hybrid retrieval',
      'Multimodal retrieval across text and images',
      'Retrieval scoring, so you can see what it actually found',
    ],
    stack: ['RAG', 'FAISS', 'ChromaDB', 'Hugging Face'],
    seoTitle: 'RAG Development & Knowledge Systems',
    description:
      'Retrieval-augmented generation (RAG) on your own documents: ingestion and chunking, vector search with FAISS or ChromaDB, multimodal retrieval, measured results.',
    heading: ['RAG & knowledge', 'systems'],
    problem:
      'Most wrong answers from a RAG system are retrieval failures. The right passage never reached the model, so it filled the gap with something that sounded right.',
    graph: {
      nodes: [
        { id: 'docs', label: 'Documents', x: 72, y: 50, icon: 'layers' },
        { id: 'chunk', label: 'Chunking', x: 200, y: 50, icon: 'funnel' },
        { id: 'embed', label: 'Embeddings', x: 328, y: 50, icon: 'Hugging Face' },
        { id: 'question', label: 'Question', x: 72, y: 165, icon: 'chat' },
        { id: 'retriever', label: 'Retriever', x: 200, y: 165, icon: 'RAG' },
        { id: 'store', label: 'Vector store', x: 328, y: 165, icon: 'FAISS' },
        { id: 'score', label: 'Retrieval score', x: 80, y: 285, icon: 'bars' },
        { id: 'llm', label: 'LLM', x: 200, y: 285, icon: 'spark' },
        { id: 'answer', label: 'Cited answer', x: 324, y: 285, icon: 'chat' },
      ],
      edges: [
        ['docs', 'chunk'],
        ['chunk', 'embed'],
        ['embed', 'store'],
        ['question', 'retriever'],
        ['store', 'retriever'],
        ['retriever', 'llm'],
        ['llm', 'answer'],
        ['retriever', 'score'],
      ],
    },
    steps: [
      {
        title: 'Collect the sources',
        body: 'Every source gets a way in: PDFs, web pages, exports, images. Each document is split into chunks that keep their meaning, with the heading and context attached.',
        nodes: ['docs', 'chunk'],
      },
      {
        title: 'Build the index',
        body: 'Chunks become embeddings in a vector store, FAISS or ChromaDB depending on size and hosting. Keyword search runs beside it for exact names, codes and numbers.',
        nodes: ['embed', 'store'],
      },
      {
        title: 'Find the right passages',
        body: 'A question pulls back the passages most likely to answer it. With multimodal retrieval, that includes images as well as text.',
        nodes: ['question', 'retriever'],
      },
      {
        title: 'Answer from the sources',
        body: 'The model answers from what was retrieved and says which document each part came from. If nothing relevant comes back, it should say so.',
        nodes: ['llm', 'answer'],
      },
      {
        title: 'Measure the retrieval',
        body: 'A test set of questions checks whether the right passages come back. The score shows what to fix: the chunking, the index or the way questions are handled.',
        nodes: ['score'],
      },
    ],
    experience: [
      { company: 'Padelos', points: [3] },
      { company: 'University of Haripur', points: [2] },
    ],
    projects: ['padelgpt'],
    faqs: [
      {
        q: 'What documents can it work with?',
        a: 'Most text formats: PDFs, Word files, web pages and exports from your tools. Scanned pages need their text extracted first, and multimodal retrieval can search images directly.',
      },
      {
        q: 'Will it make things up?',
        a: 'It can, which is why the retrieval is measured and each answer cites its sources. When the right passage isn’t found, the system should say so rather than guess.',
      },
      {
        q: 'Can our data stay on our own servers?',
        a: 'Yes. FAISS and ChromaDB both run on your infrastructure, and an open model from Hugging Face can run there too if the documents can’t leave it.',
      },
      {
        q: 'How does it stay up to date?',
        a: 'The ingestion pipeline runs again when documents change, so new and edited files are indexed without rebuilding everything.',
      },
    ],
  },
  {
    id: 'web-development',
    title: 'Web apps & websites',
    summary: 'Fast, responsive builds in React and Next.js — no AI required.',
    deliverables: [
      'Marketing sites and landing pages that load fast and rank',
      'React and Next.js applications with routing, auth and real state',
      'Dashboards and admin panels over your existing API',
      'Responsive from 390px up, accessible, and yours to hand to any developer',
    ],
    stack: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
    seoTitle: 'Web Development with React & Next.js',
    description:
      'Websites and web apps in React and Next.js: fast marketing sites, dashboards and full applications. Responsive, accessible, and easy for any developer to take over.',
    heading: ['Web apps &', 'websites'],
    problem:
      'A slow or confusing site loses visitors before they read a word. And a page that search engines can’t read is a page nobody finds.',
    graph: {
      nodes: [
        { id: 'plan', label: 'Page plan', x: 72, y: 40, icon: 'layers' },
        { id: 'ui', label: 'Components', x: 200, y: 40, icon: 'React' },
        { id: 'pages', label: 'Pages', x: 328, y: 40, icon: 'Next.js' },
        { id: 'api', label: 'Your API', x: 72, y: 125, icon: 'plug' },
        { id: 'data', label: 'Data & state', x: 200, y: 125, icon: 'db' },
        { id: 'login', label: 'Login', x: 328, y: 125 },
        { id: 'checks', label: 'Speed & SEO', x: 200, y: 210, icon: 'bars' },
        { id: 'repo', label: 'Your repo', x: 72, y: 295, icon: 'GitHub' },
        { id: 'deploy', label: 'Deploy', x: 200, y: 295, icon: 'Vercel' },
      ],
      edges: [
        ['plan', 'ui'],
        ['ui', 'pages'],
        ['ui', 'data'],
        ['api', 'data'],
        ['login', 'data'],
        ['data', 'checks'],
        ['checks', 'deploy'],
        ['deploy', 'repo'],
      ],
    },
    steps: [
      {
        title: 'Plan the pages',
        body: 'We agree on the pages, what each one must do and who it is for. For a marketing site that includes the searches each page should rank for.',
        nodes: ['plan', 'pages'],
      },
      {
        title: 'Build the interface',
        body: 'The interface is built from React components and styled with Tailwind, responsive from 390px up. Next.js handles routing and renders pages on the server where search engines need them.',
        nodes: ['ui'],
      },
      {
        title: 'Connect the data',
        body: 'Forms, dashboards and logins are wired to your API, with loading and error states handled. If there is no API yet, I build one.',
        nodes: ['api', 'data', 'login'],
      },
      {
        title: 'Make it fast',
        body: 'Images are compressed and code is split per page. Before launch, every page is checked for speed, accessibility and the search basics: titles, descriptions, structured data.',
        nodes: ['checks'],
      },
      {
        title: 'Launch and hand over',
        body: 'It deploys to Vercel or your own host. The code lives in your repository, with a README another developer can follow.',
        nodes: ['deploy', 'repo'],
      },
    ],
    experience: [],
    projects: ['flintgrab'],
    faqs: [
      {
        q: 'Can you redesign our current site?',
        a: 'Yes. I can rebuild it in React or Next.js and keep your content and URLs, so the search rankings you already have aren’t thrown away.',
      },
      {
        q: 'Will the site show up on Google?',
        a: 'Every page gets its own title, description and structured data, and the content is in the HTML where search engines read it. Rankings also depend on your content, which we can plan together.',
      },
      {
        q: 'Who owns the code?',
        a: 'You do. It lives in your repository, and the README explains how to run and deploy it.',
      },
      {
        q: 'Can we add AI features later?',
        a: 'Yes, that’s the other half of my work. A React or Next.js site can take a chat assistant or a search over your own content without a rebuild.',
      },
    ],
  },
  {
    id: 'full-stack-ai',
    title: 'Full-stack AI products',
    summary: 'The whole product around the model — API, database, and the front end people use.',
    deliverables: [
      'FastAPI or Flask backend with authentication and rate limiting',
      'Schema design on PostgreSQL, MongoDB or Redis',
      'React or Next.js front ends with streaming chat and live dashboards',
      'Internal tools and quick prototypes with Streamlit or Gradio',
    ],
    stack: ['FastAPI', 'PostgreSQL', 'Tailwind CSS', 'Streamlit'],
    seoTitle: 'Full-Stack AI Product Development',
    description:
      'The whole product around an AI model: a FastAPI or Flask backend, the database, and a React or Next.js front end with streaming chat and live dashboards.',
    heading: ['Full-stack', 'AI products'],
    problem:
      'Most AI projects stall between the notebook and the product. The model works, but nothing around it is ready: no login, no database, no screen a customer can use.',
    graph: {
      nodes: [
        { id: 'user', label: 'User', x: 72, y: 46 },
        { id: 'ui', label: 'Front end', x: 200, y: 46, icon: 'React' },
        { id: 'tools', label: 'Admin tools', x: 328, y: 46, icon: 'Streamlit' },
        { id: 'auth', label: 'Auth & limits', x: 76, y: 158 },
        { id: 'api', label: 'API', x: 200, y: 158, icon: 'FastAPI' },
        { id: 'model', label: 'AI model', x: 328, y: 158, icon: 'spark' },
        { id: 'db', label: 'Database', x: 128, y: 278, icon: 'PostgreSQL' },
        { id: 'cache', label: 'Cache', x: 272, y: 278, icon: 'Redis' },
      ],
      edges: [
        ['user', 'ui'],
        ['ui', 'api'],
        ['tools', 'api'],
        ['api', 'auth'],
        ['api', 'model'],
        ['api', 'db'],
        ['api', 'cache'],
      ],
    },
    steps: [
      {
        title: 'Start from the user',
        body: 'We start with the person using it: what they do on each screen, and where the AI actually saves them time.',
        nodes: ['user'],
      },
      {
        title: 'Build the backend',
        body: 'A FastAPI or Flask backend serves the model and everything around it, with authentication and rate limits from the first version.',
        nodes: ['api', 'auth'],
      },
      {
        title: 'Design the data',
        body: 'The schema goes on PostgreSQL, MongoDB or Redis, depending on the data. User records, conversation history and cached results each get the store that suits them.',
        nodes: ['db', 'cache'],
      },
      {
        title: 'Put the model inside',
        body: 'The model, agent or RAG pipeline runs behind the API like any other service. The rest of the product doesn’t need to know which model it is.',
        nodes: ['model'],
      },
      {
        title: 'Build what people use',
        body: 'A React or Next.js front end with streaming chat and live dashboards, and internal tools in Streamlit or Gradio for your team.',
        nodes: ['ui', 'tools'],
      },
    ],
    experience: [
      { company: 'Padelos', points: [3, 5] },
      { company: 'University of Haripur', points: [2] },
    ],
    projects: ['padelgpt', 'smog-analysis', 'content-moderation'],
    faqs: [
      {
        q: 'We already have a model. Can you build the product around it?',
        a: 'Yes. The model goes behind an API, and I build the backend, the database and the front end around it.',
      },
      {
        q: 'Can we start with a prototype?',
        a: 'Yes. A Streamlit or Gradio prototype is a quick way to test an idea with real users. What works then moves into the full product.',
      },
      {
        q: 'Which database will you use?',
        a: 'PostgreSQL for most product data, Redis for caching and short-term state, and MongoDB when the data has no fixed shape. Often it’s more than one.',
      },
      {
        q: 'Do you build the front end too?',
        a: 'Yes, in React or Next.js, including chat replies that stream in as they’re written and dashboards that update live.',
      },
    ],
  },
  {
    id: 'automation',
    title: 'Automation & data pipelines',
    summary: 'The unglamorous plumbing that moves your data where it needs to be.',
    deliverables: [
      'n8n workflows connecting the tools you already pay for',
      'ETL / ELT pipelines with scheduling and retries',
      'Large-scale scraping and data ingestion',
      'Scheduled Excel and CSV reporting off live data',
    ],
    stack: ['n8n', 'ETL / ELT pipelines', 'pandas', 'REST APIs'],
    seoTitle: 'n8n Automation & Data Pipelines',
    description:
      'Workflow automation with n8n, ETL pipelines with scheduling and retries, large-scale web scraping, and scheduled Excel and CSV reports from live data.',
    heading: ['Automation &', 'data pipelines'],
    problem:
      'Someone on your team moves data by hand every week. It’s slow, it’s easy to get wrong, and it stops the day that person is away.',
    graph: {
      nodes: [
        { id: 'schedule', label: 'Schedule', x: 200, y: 40 },
        { id: 'tools', label: 'Your tools', x: 72, y: 125, icon: 'plug' },
        { id: 'n8n', label: 'n8n workflow', x: 200, y: 125, icon: 'n8n' },
        { id: 'clean', label: 'Clean', x: 328, y: 125, icon: 'pandas' },
        { id: 'sites', label: 'Websites', x: 72, y: 215 },
        { id: 'scraper', label: 'Scraper', x: 200, y: 215, icon: 'Web scraping' },
        { id: 'db', label: 'Database', x: 328, y: 215, icon: 'db' },
        { id: 'reports', label: 'Reports', x: 328, y: 300, icon: 'bars' },
      ],
      edges: [
        ['schedule', 'n8n'],
        ['tools', 'n8n'],
        ['n8n', 'clean'],
        ['sites', 'scraper'],
        ['scraper', 'clean'],
        ['clean', 'db'],
        ['db', 'reports'],
      ],
    },
    steps: [
      {
        title: 'Find the manual work',
        body: 'We list the jobs someone does by hand every week: the exports, the copy and paste, the report that takes a morning.',
        nodes: ['tools'],
      },
      {
        title: 'Connect the tools',
        body: 'An n8n workflow links the tools you already pay for through their APIs. It runs on a schedule, or when something happens in one of them.',
        nodes: ['n8n', 'schedule'],
      },
      {
        title: 'Collect from the web',
        body: 'When the data lives on websites, a scraper collects it at scale. It runs at a polite rate and retries, so a slow site doesn’t break the run.',
        nodes: ['sites', 'scraper'],
      },
      {
        title: 'Clean and load',
        body: 'pandas cleans and reshapes the data before it is stored. Each step retries when it fails and logs what it did.',
        nodes: ['clean', 'db'],
      },
      {
        title: 'Report on a schedule',
        body: 'Excel and CSV reports build themselves from live data and arrive when they’re due. Nobody copies numbers by hand.',
        nodes: ['reports'],
      },
    ],
    experience: [
      { company: 'Padelos', points: [4] },
      { company: 'IR Solutions', points: [0] },
    ],
    projects: ['ecommerce-scraper'],
    faqs: [
      {
        q: 'Why n8n?',
        a: 'It connects to hundreds of tools without custom code, each workflow is visible as a diagram, and it can run on your own server. When a step needs real code, Python does that part.',
      },
      {
        q: 'Will it work with the tools we use?',
        a: 'If a tool has an API or exports files, yes. If it has neither, scraping is often still an option.',
      },
      {
        q: 'What happens when a step fails?',
        a: 'It retries. Every run is logged, so you can see what failed and run it again once the cause is fixed.',
      },
      {
        q: 'Can you collect data from large sites?',
        a: 'Yes. I’ve built large-scale scraping and data-ingestion pipelines. The data is checked before it is stored, so bad rows don’t end up in your reports.',
      },
    ],
  },
  {
    id: 'machine-learning',
    title: 'ML & computer vision',
    summary: 'Custom models for when a general-purpose API is the wrong tool.',
    deliverables: [
      'Image classification, detection and segmentation',
      'Training on your data, with augmentation for class imbalance',
      'NLP classification and extraction',
      'Honest evaluation — accuracy, Dice, confusion matrices',
    ],
    stack: ['PyTorch', 'TensorFlow', 'U-Net', 'Computer Vision'],
    seoTitle: 'Machine Learning & Computer Vision',
    description:
      'Custom machine learning models: image classification, object detection with YOLO, segmentation with U-Net, and NLP. Trained on your data and evaluated honestly.',
    heading: ['Machine learning', '& computer vision'],
    problem:
      'A model can score well and still fail in use. It learned the common cases, missed the rare ones, and nobody checked where it goes wrong.',
    graph: {
      nodes: [
        { id: 'data', label: 'Your data', x: 72, y: 46, icon: 'db' },
        { id: 'labels', label: 'Labels', x: 200, y: 46 },
        { id: 'augment', label: 'Augmentation', x: 324, y: 46, icon: 'layers' },
        { id: 'eval', label: 'Evaluation', x: 72, y: 160, icon: 'bars' },
        { id: 'model', label: 'Model', x: 200, y: 160, icon: 'CNNs' },
        { id: 'train', label: 'Training', x: 328, y: 160, icon: 'PyTorch' },
        { id: 'holdout', label: 'Test set', x: 72, y: 280, icon: 'db' },
        { id: 'serve', label: 'Serving', x: 200, y: 280, icon: 'Flask' },
      ],
      edges: [
        ['data', 'labels'],
        ['labels', 'augment'],
        ['augment', 'train'],
        ['train', 'model'],
        ['model', 'eval'],
        ['holdout', 'eval'],
        ['model', 'serve'],
      ],
    },
    steps: [
      {
        title: 'Understand the data',
        body: 'First I look at what you have: how much data, how it’s labelled, and which classes are rare. That decides more than the choice of model.',
        nodes: ['data'],
      },
      {
        title: 'Prepare it',
        body: 'Labels are checked and fixed. Augmentation adds variety to the rare classes, so the model doesn’t only learn the common ones.',
        nodes: ['labels', 'augment'],
      },
      {
        title: 'Train the model',
        body: 'The model fits the task: a CNN to classify, YOLO to detect, U-Net to segment, a text model for NLP. Usually it starts from a pretrained one.',
        nodes: ['train', 'model'],
      },
      {
        title: 'Evaluate honestly',
        body: 'It’s tested on data it never saw in training, with the measure that fits: accuracy, Dice for segmentation, a confusion matrix to show where it fails.',
        nodes: ['eval', 'holdout'],
      },
      {
        title: 'Put it to work',
        body: 'The model ships behind an API or inside an app, such as a Flask or Streamlit interface, ready for new images or text.',
        nodes: ['serve'],
      },
    ],
    experience: [
      { company: 'Itsolera', points: [0, 1] },
      { company: 'University of Haripur', points: [1] },
      { company: 'Bytewise', points: [1] },
    ],
    projects: ['ppe-safety', 'content-moderation', 'smog-analysis', 'phishing-detector'],
    faqs: [
      {
        q: 'How much data do I need?',
        a: 'It depends on the task. Starting from a pretrained model usually needs far less labelled data than training from zero. A look at your data gives a real answer.',
      },
      {
        q: 'Can you use the data we’ve already labelled?',
        a: 'Yes. I check the labels first, because a model learns its labels’ mistakes along with everything else.',
      },
      {
        q: 'Why not just use an AI API?',
        a: 'Sometimes you should. For detection in camera frames, segmentation in medical images or fast classification on your own servers, a trained model is often more accurate and cheaper to run.',
      },
      {
        q: 'How will I know how good it is?',
        a: 'You get the evaluation on held-out data, including the cases where it fails, not a single accuracy number.',
      },
    ],
  },
  {
    id: 'ai-deployment',
    title: 'Deployment & observability',
    summary: 'Getting it live, and knowing the moment it stops working.',
    deliverables: [
      'Containerisation and CI/CD pipelines',
      'Deployment to AWS or Azure',
      'Tracing and token/cost tracking on every LLM call',
      'Alerting and dashboards on the metrics that matter',
    ],
    stack: ['Docker', 'AWS EC2', 'Langfuse', 'OpenTelemetry'],
    seoTitle: 'AI Deployment & LLM Observability',
    description:
      'Getting AI systems live and keeping them healthy: Docker, CI/CD, deployment to AWS or Azure, and tracing with token and cost tracking on every LLM call.',
    heading: ['Deployment &', 'observability'],
    problem:
      'An AI system can break without crashing. Answers get worse, costs creep up, a tool starts timing out, and the first sign is a user who stops coming back.',
    graph: {
      nodes: [
        { id: 'code', label: 'Your code', x: 72, y: 46 },
        { id: 'ci', label: 'CI/CD', x: 200, y: 46, icon: 'Bitbucket Pipelines' },
        { id: 'docker', label: 'Container', x: 328, y: 46, icon: 'Docker' },
        { id: 'alerts', label: 'Alerts', x: 72, y: 160 },
        { id: 'users', label: 'Users', x: 200, y: 160 },
        { id: 'cloud', label: 'AWS / Azure', x: 328, y: 160, icon: 'AWS EC2' },
        { id: 'dash', label: 'Dashboards', x: 72, y: 280, icon: 'bars' },
        { id: 'cost', label: 'Token & cost', x: 200, y: 280, icon: 'Langfuse' },
        { id: 'trace', label: 'Tracing', x: 328, y: 280, icon: 'OpenTelemetry' },
      ],
      edges: [
        ['code', 'ci'],
        ['ci', 'docker'],
        ['docker', 'cloud'],
        ['users', 'cloud'],
        ['cloud', 'trace'],
        ['trace', 'cost'],
        ['cost', 'dash'],
        ['dash', 'alerts'],
      ],
    },
    steps: [
      {
        title: 'Package it',
        body: 'The app and everything it depends on go into a Docker container, so it runs the same on a laptop and on a server.',
        nodes: ['code', 'docker'],
      },
      {
        title: 'Automate the release',
        body: 'A CI/CD pipeline tests and ships every change, so a release doesn’t depend on one person’s machine.',
        nodes: ['ci'],
      },
      {
        title: 'Deploy to the cloud',
        body: 'It runs on AWS or Azure, with secrets and access set up properly and room to grow with your traffic.',
        nodes: ['cloud', 'users'],
      },
      {
        title: 'Trace every call',
        body: 'Each LLM call is traced: the prompt, the tools it used, how long it took and how many tokens it cost. Langfuse and OpenTelemetry collect it.',
        nodes: ['trace', 'cost'],
      },
      {
        title: 'Watch and alert',
        body: 'Dashboards show the numbers that matter, and alerts fire when errors, response times or costs move outside their normal range.',
        nodes: ['dash', 'alerts'],
      },
    ],
    experience: [{ company: 'Padelos', points: [5] }],
    projects: ['padelgpt'],
    faqs: [
      {
        q: 'Can you move our app to another cloud?',
        a: 'Yes. At Padelos I migrated the platform chatbot from Azure to AWS EC2, with Docker and CI/CD around it.',
      },
      {
        q: 'AWS or Azure?',
        a: 'Whichever you already use. If you use neither, the choice comes down to your other tools and the cost.',
      },
      {
        q: 'What does LLM observability show me?',
        a: 'Every call to the model: what was asked, which tools ran, how long it took and what it cost. Over time it shows whether quality, speed and cost are going the right way.',
      },
      {
        q: 'Can you add CI/CD to an existing project?',
        a: 'Yes. Tests and an automated release can be added to a codebase that already exists, without rewriting it.',
      },
    ],
  },
]
