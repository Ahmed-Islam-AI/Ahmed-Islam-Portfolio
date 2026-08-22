import {
  siArduino,
  siBitbucket,
  siBootstrap,
  siClaude,
  siCplusplus,
  siCss,
  siDocker,
  siFastapi,
  siFirebase,
  siFlask,
  siGit,
  siGithub,
  siGooglecloud,
  siGooglegemini,
  siGradio,
  siHtml5,
  siHuggingface,
  siJavascript,
  siKubernetes,
  siLangchain,
  siLanggraph,
  siMeta,
  siMistralai,
  siModelcontextprotocol,
  siMongodb,
  siMysql,
  siN8n,
  siNetlify,
  siNextdotjs,
  siOllama,
  siOpencv,
  siOpentelemetry,
  siPandas,
  siPostgresql,
  siPostman,
  siPytorch,
  siPython,
  siReact,
  siRedis,
  siRos,
  siScikitlearn,
  siSelenium,
  siSocketdotio,
  siSqlite,
  siStreamlit,
  siTailwindcss,
  siTensorflow,
  siVercel,
  siYolo,
} from 'simple-icons'

/**
 * Solid glyphs for the things that have no brand mark — either genuine concepts
 * (RAG, tool calling, CNNs) or brands simple-icons v16 dropped for trademark
 * reasons (OpenAI, AWS, Azure, Power BI). Drawn as closed silhouettes with no
 * interior holes, so they need no fill-rule and sit next to the filled
 * simple-icons paths without looking like a different set.
 */
const CONCEPT = {
  spark: 'M12 1.8l2.4 5.6 5.6 2.4-5.6 2.4L12 17.8l-2.4-5.6L4 9.8l5.6-2.4zM18.6 15.1l.85 2.15 2.15.85-2.15.85-.85 2.15-.85-2.15-2.15-.85 2.15-.85z',
  nodes:
    'M12 1.6a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zM4.6 15.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zM19.4 15.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zM10.4 8.3l-4.3 7 1.7 1.05 4.3-7zM13.6 8.3l-1.7 1.05 4.3 7 1.7-1.05zM7.6 17.8h8.8v2H7.6z',
  plug: 'M8.2 2h2.2v5.6H8.2zM13.6 2h2.2v5.6h-2.2zM5.6 9.1h12.8v2.7a6.4 6.4 0 0 1-5.3 6.31V22h-2.2v-3.89A6.4 6.4 0 0 1 5.6 11.8z',
  layers:
    'M12 1.9l9.6 5.05L12 12 2.4 6.95zM4.6 11.5L12 15.4l7.4-3.9 2.2 1.15L12 17.7 2.4 12.65zM4.6 15.7L12 19.6l7.4-3.9 2.2 1.15L12 21.9 2.4 16.85z',
  chat: 'M4.6 3h14.8A2.6 2.6 0 0 1 22 5.6v8.8a2.6 2.6 0 0 1-2.6 2.6H9.4L4 21.4V5.6A2.6 2.6 0 0 1 4.6 3z',
  funnel: 'M2.2 4h19.6v2.6L14.4 14v6.6l-4.8-2.4V14L2.2 6.6z',
  cloud: 'M6.9 19.4a4.9 4.9 0 0 1-.5-9.77 6.4 6.4 0 0 1 12.2-1.03A4.2 4.2 0 0 1 18.2 19.4z',
  monitor:
    'M3 3.6h18a2 2 0 0 1 2 2v9.8a2 2 0 0 1-2 2h-7.8v2.6h3.4V22H7.4v-2h3.4v-2.6H3a2 2 0 0 1-2-2V5.6a2 2 0 0 1 2-2z',
  bars: 'M3.4 13.2h3.7V21H3.4zM10.15 7.4h3.7V21h-3.7zM16.9 3h3.7v18h-3.7z',
  db: 'M12 2c4.42 0 8 1.34 8 3s-3.58 3-8 3-8-1.34-8-3 3.58-3 8-3zM4 8.9C5.7 10.05 8.65 10.7 12 10.7s6.3-.65 8-1.8V12c0 1.66-3.58 3-8 3s-8-1.34-8-3zM4 15.9c1.7 1.15 4.65 1.8 8 1.8s6.3-.65 8-1.8V19c0 1.66-3.58 3-8 3s-8-1.34-8-3z',
  scan: 'M3 3h6v2.2H5.2V9H3zM15 3h6v6h-2.2V5.2H15zM3 15h2.2v3.8H9V21H3zM18.8 15H21v6h-6v-2.2h3.8zM12 9.4a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2z',
  // Knobs wind clockwise (sweep 1), the same direction as the track rects, so the
  // overlaps union instead of cancelling into holes under the default fill rule.
  sliders:
    'M2.6 3.9h18.8v2.2H2.6zM7 1.9a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 1 1 0-6.2zM2.6 10.9h18.8v2.2H2.6zM15.5 8.9a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 1 1 0-6.2zM2.6 17.9h18.8v2.2H2.6zM10 15.9a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 1 1 0-6.2z',
  cube: 'M12 1.8l8.8 5.1v10.2L12 22.2l-8.8-5.1V6.9z',
}

/** name → SVG path. Brand mark where one exists, concept glyph otherwise. */
const ICONS: Record<string, string> = {
  // LLM & agentic AI
  LangChain: siLangchain.path,
  LangGraph: siLanggraph.path,
  MCP: siModelcontextprotocol.path,
  FastMCP: siModelcontextprotocol.path,
  RAG: CONCEPT.nodes,
  'Tool calling': CONCEPT.plug,
  'Multi-agent orchestration': CONCEPT.nodes,
  'Prompt engineering': CONCEPT.spark,
  'Generative AI apps': CONCEPT.spark,
  OpenAI: CONCEPT.spark,
  'Anthropic Claude': siClaude.path,
  'Google Gemini': siGooglegemini.path,
  LLaMA: siMeta.path,
  Mistral: siMistralai.path,
  Ollama: siOllama.path,
  'Hugging Face': siHuggingface.path,
  'Groq API': CONCEPT.spark,
  'Fine-tuning': CONCEPT.sliders,

  // ML & deep learning
  'scikit-learn': siScikitlearn.path,
  TensorFlow: siTensorflow.path,
  PyTorch: siPytorch.path,
  // `nodes` rather than `layers`: it's the canonical net-graph glyph, and it keeps
  // this group from showing four identical stacks (CNNs, U-Net, Transfer Learning).
  // It's also used for RAG, but that lives in a different tab and only one tab
  // renders at a time.
  'Deep Learning': CONCEPT.nodes,
  CNNs: CONCEPT.layers,
  'U-Net': CONCEPT.layers,
  YOLO: siYolo.path,
  OpenCV: siOpencv.path,
  NLP: CONCEPT.chat,
  'Computer Vision': CONCEPT.scan,
  'Transfer Learning': CONCEPT.layers,
  'Feature engineering': CONCEPT.layers,

  // Data & backend
  FastAPI: siFastapi.path,
  Flask: siFlask.path,
  'ETL / ELT pipelines': CONCEPT.funnel,
  ETL: CONCEPT.funnel,
  'Web scraping': CONCEPT.funnel,
  n8n: siN8n.path,
  'REST APIs': CONCEPT.plug,
  'Socket.io': siSocketdotio.path,
  // Raw ws, not Socket.io — the speech/audio project uses the protocol directly,
  // so it gets the generic connector rather than borrowing another lib's mark.
  WebSockets: CONCEPT.plug,
  Postman: siPostman.path,
  pandas: siPandas.path,

  // Scraping tools. simple-icons has no BeautifulSoup mark, so it shares the
  // funnel with `Web scraping` — the two only ever appear on the same card, and
  // a repeated glyph there reads as one idea rather than two mistakes.
  Selenium: siSelenium.path,
  BeautifulSoup: CONCEPT.funnel,

  // Hardware & robotics. These appear on a project card only — deliberately not
  // in Stack.tsx, which is Ahmed's curated skill set. See the note on
  // `Project.stack` in data/projects.ts.
  Arduino: siArduino.path,
  ROS: siRos.path,

  // Front-end
  HTML: siHtml5.path,
  CSS: siCss.path,
  React: siReact.path,
  'Next.js': siNextdotjs.path,
  'Tailwind CSS': siTailwindcss.path,
  Bootstrap: siBootstrap.path,

  // Cloud & DevOps
  'AWS EC2': CONCEPT.cloud,
  CloudWatch: CONCEPT.monitor,
  'Azure App Service': CONCEPT.cloud,
  // AWS and Azure fall back to the generic cloud because simple-icons v16 dropped
  // both; Google Cloud is still in the set, so it gets its real mark.
  'Google Cloud': siGooglecloud.path,
  Docker: siDocker.path,
  Kubernetes: siKubernetes.path,
  'Bitbucket Pipelines': siBitbucket.path,
  Git: siGit.path,
  GitHub: siGithub.path,
  Vercel: siVercel.path,
  Netlify: siNetlify.path,
  OpenTelemetry: siOpentelemetry.path,
  Langfuse: CONCEPT.monitor,

  // Memory, vector stores, databases
  FAISS: siMeta.path,
  ChromaDB: CONCEPT.db,
  Redis: siRedis.path,
  PostgreSQL: siPostgresql.path,
  MySQL: siMysql.path,
  SQLite: siSqlite.path,
  MongoDB: siMongodb.path,
  Firebase: siFirebase.path,

  // Languages
  Python: siPython.path,
  SQL: CONCEPT.db,
  JavaScript: siJavascript.path,
  'C++': siCplusplus.path,

  // Visualisation
  'Power BI': CONCEPT.bars,
  Streamlit: siStreamlit.path,
  Gradio: siGradio.path,
}

export default function TechIcon({ name, className }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d={ICONS[name] ?? CONCEPT.cube} />
    </svg>
  )
}
