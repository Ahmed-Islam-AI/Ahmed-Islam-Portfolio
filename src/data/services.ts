export interface Service {
  id: string
  /** Short label for the index row. */
  title: string
  /** One line, shown collapsed. */
  summary: string
  /** What the engagement actually produces. */
  deliverables: string[]
  /** Names must exist in TechIcon's map or they fall back to the cube glyph. */
  stack: string[]
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
 * `web` is the second half of the full-stack reframe (2026-08-12): web development
 * sold on its own terms, with no AI in it, because that is now half of what Ahmed
 * takes on. It sits beside `web-apps` rather than replacing it — one is a site or
 * app, the other is a product with a model inside it, and a visitor who wants the
 * first should not have to read an agent pitch to find it. React and Next.js are
 * named here because Ahmed added them to `Stack.tsx` on the same instruction.
 *
 * NOTE: Ahmed confirmed he has shipped real client sites, but none of them are in
 * `data/projects.ts` yet — that file still holds four AI projects. Until web work
 * is in the gallery, this section is the only place the site makes the claim, and
 * it deliberately names no client and no number.
 */
export const SERVICES: Service[] = [
  {
    id: 'agents',
    title: 'Agentic AI systems',
    summary: 'Multi-agent workflows that do real work instead of demoing well.',
    deliverables: [
      'Agent graph design — state, routing, retries, human-in-the-loop',
      'Tool surface over your existing APIs and business logic',
      'An MCP server so any client can call those tools',
      'Rubric-graded evaluation before anything reaches users',
    ],
    stack: ['LangGraph', 'LangChain', 'MCP', 'Python'],
  },
  {
    id: 'rag',
    title: 'RAG & knowledge systems',
    summary: 'Answers grounded in your own documents, with the retrieval measured.',
    deliverables: [
      'Ingestion and chunking pipeline for your corpus',
      'Vector store selection, indexing and hybrid retrieval',
      'Multimodal retrieval across text and images',
      'Retrieval scoring, so you can see what it actually found',
    ],
    stack: ['RAG', 'FAISS', 'ChromaDB', 'Hugging Face'],
  },
  {
    id: 'web',
    title: 'Web apps & websites',
    summary: 'Fast, responsive builds in React and Next.js — no AI required.',
    deliverables: [
      'Marketing sites and landing pages that load fast and rank',
      'React and Next.js applications with routing, auth and real state',
      'Dashboards and admin panels over your existing API',
      'Responsive from 390px up, accessible, and yours to hand to any developer',
    ],
    stack: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
  },
  {
    id: 'web-apps',
    title: 'Full-stack AI products',
    summary: 'The whole product around the model — API, database, and the front end people use.',
    deliverables: [
      'FastAPI or Flask backend with authentication and rate limiting',
      'Schema design on PostgreSQL, MongoDB or Redis',
      'React or Next.js front ends with streaming chat and live dashboards',
      'Internal tools and quick prototypes with Streamlit or Gradio',
    ],
    stack: ['FastAPI', 'PostgreSQL', 'Tailwind CSS', 'Streamlit'],
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
  },
  {
    id: 'ml',
    title: 'ML & computer vision',
    summary: 'Custom models for when a general-purpose API is the wrong tool.',
    deliverables: [
      'Image classification, detection and segmentation',
      'Training on your data, with augmentation for class imbalance',
      'NLP classification and extraction',
      'Honest evaluation — accuracy, Dice, confusion matrices',
    ],
    stack: ['PyTorch', 'TensorFlow', 'U-Net', 'Computer Vision'],
  },
  {
    id: 'ship',
    title: 'Deployment & observability',
    summary: 'Getting it live, and knowing the moment it stops working.',
    deliverables: [
      'Containerisation and CI/CD pipelines',
      'Deployment to AWS or Azure',
      'Tracing and token/cost tracking on every LLM call',
      'Alerting and dashboards on the metrics that matter',
    ],
    stack: ['Docker', 'AWS EC2', 'Langfuse', 'OpenTelemetry'],
  },
]
