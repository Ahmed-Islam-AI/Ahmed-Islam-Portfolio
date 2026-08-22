export interface Certification {
  id: string
  /** Large top-left mark — issuing org's short name, used like a rank. */
  highlight: string
  /** e.g. "AUG 2025". */
  date: string
  name: string
  issuer: string
  /** Credential ID or key skills. */
  detail: string
  badges: string[]
  /** Credential URL. Omit and the card renders as plain content, not a link. */
  href?: string
}

/**
 * Ahmed's LinkedIn certifications section — a list, not a per-credential page, so
 * every card that uses it says "View", not "Verify". One constant because all six
 * LinkedIn-sourced entries share it; replacing any with a real per-credential URL
 * is a one-line change on that entry.
 */
const LINKEDIN_CERTS = 'https://www.linkedin.com/in/ahmed-islam01/details/certifications/'

/**
 * Two sources, merged 2026-08-12 — nothing was dropped, because the CV and the
 * LinkedIn profile list completely different certifications and both are real.
 *
 * **1-6 came from Ahmed's LinkedIn** and are the complete entries: real dates, a
 * link, and skills taken from the credential itself.
 *
 * **7-11 are verbatim from the CERTIFICATIONS block of Ahmed-Islam-CV.pdf**, which
 * lists none of the first six. They are still missing:
 *
 * - `date` is **"ADD DATE" on all five** — the CV gives no dates and they are not
 *   guessable. It shows in the pill on purpose.
 * - `href` is absent, so those five render as plain cards rather than links.
 * - `detail` restates each course's own subject. Swap for the real credential ID
 *   ("Credential ID: ABC-123") once you have them.
 *
 * `badges` are topic tags, never status claims — no card asserts "VERIFIED".
 *
 * The six `href`s all point at the same LinkedIn *certifications list*, not at a
 * per-credential page, which is why the card's affordance reads "View →" and not
 * "Verify →". If you get real per-credential URLs (Credly, Coursera), swap them in
 * and the wording still holds.
 */
export const CERTIFICATIONS: Certification[] = [
  {
    id: 'aws-cloud-101',
    highlight: 'AWS',
    date: 'AUG 2025',
    name: 'AWS Educate: Introduction to Cloud 101',
    issuer: 'Amazon Web Services (AWS)',
    detail: 'Skills: Cloud Foundations, AWS',
    badges: ['CLOUD'],
    href: LINKEDIN_CERTS,
  },
  {
    id: 'dlai-langchain-llm-apps',
    highlight: 'DLAI',
    date: '2025',
    name: 'LangChain for LLM App Development',
    issuer: 'DeepLearning.AI',
    detail: 'Skills: LLMs, LangChain, RAG',
    badges: ['LLM APPS'],
    href: LINKEDIN_CERTS,
  },
  {
    id: 'tensorflow-developer',
    highlight: 'TF',
    date: '2024',
    name: 'TensorFlow Developer Certificate',
    issuer: 'TensorFlow · Google',
    detail: 'Skills: TensorFlow, Deep Learning',
    badges: ['DEEP LEARNING'],
    href: LINKEDIN_CERTS,
  },
  {
    id: 'dlai-deep-learning-specialization',
    highlight: 'DLAI',
    date: '2024',
    name: 'Deep Learning Specialization',
    issuer: 'DeepLearning.AI · Coursera',
    detail: 'Skills: Neural Networks, CNNs, RNNs',
    badges: ['NEURAL NETWORKS'],
    href: LINKEDIN_CERTS,
  },
  {
    id: 'ibm-python-data-science',
    highlight: 'IBM',
    date: '2024',
    name: 'Python for Data Science, AI & Development',
    issuer: 'IBM · Coursera',
    detail: 'Skills: Python, Pandas, NumPy',
    badges: ['PYTHON'],
    href: LINKEDIN_CERTS,
  },
  {
    id: 'dlai-machine-learning-specialization',
    highlight: 'DLAI',
    date: '2024',
    name: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI · Coursera',
    detail: 'Skills: Machine Learning, Supervised Learning',
    badges: ['MACHINE LEARNING'],
    href: LINKEDIN_CERTS,
  },
  {
    id: 'atomcamp-data-science-ai',
    highlight: 'ATOM',
    date: 'ADD DATE',
    name: 'Data Science & AI Bootcamp',
    issuer: 'Atomcamp',
    detail: 'Skills: Python, pandas, data analysis, applied ML',
    badges: ['DATA SCIENCE'],
  },
  {
    id: 'ibm-machine-learning',
    highlight: 'IBM',
    date: 'ADD DATE',
    name: 'IBM Certified Machine Learning',
    issuer: 'IBM',
    detail: 'Skills: supervised & unsupervised learning, model evaluation',
    badges: ['MACHINE LEARNING'],
  },
  {
    id: 'xeven-ai-ml-foundation',
    highlight: 'XEVEN',
    date: 'ADD DATE',
    name: 'AI & Machine Learning Foundation',
    issuer: 'Xeven Solutions',
    detail: 'Skills: ML foundations, feature engineering, evaluation',
    badges: ['FOUNDATION'],
  },
  {
    id: 'udemy-mlops',
    highlight: 'UDEMY',
    date: 'ADD DATE',
    name: 'MLOps Course',
    issuer: 'Udemy',
    detail: 'Skills: CI/CD for ML, containerisation, model deployment',
    badges: ['MLOPS'],
  },
  {
    id: 'langchain-academy-langgraph',
    highlight: 'LCA',
    date: 'ADD DATE',
    name: 'Introduction to LangGraph',
    issuer: 'LangChain Academy',
    detail: 'Skills: agent graphs, state, checkpointing, human-in-the-loop',
    badges: ['AGENTS'],
  },
]
