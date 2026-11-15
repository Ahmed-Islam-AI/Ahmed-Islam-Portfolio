# Changelog

All notable changes to ahmedislam.tech. Newest first. Reasons behind decisions are in HISTORY.md.

## 2026-11-13
### Added
- CHANGELOG.md and HISTORY.md for people working on the code.
- README for the GitHub repository, with screenshots of the site and the project cards.
- Privacy page (/privacy) lists Cloudflare, which forwards email, and Brevo, which sends replies.
### Changed
- The blog moved out to its own repo and site, and this site no longer links to it: the nav's Blog button and the footer's Blog link are gone.
- The orange nav button reads "Let's work together" at every width again.
- Unknown addresses, including the old /blog ones, redirect to the home page instead of showing a blank page.
- Projects: the Flintgrab card links to its live site at flintgrab.ahmedislam.tech instead of its GitHub repository.
- The contact address is hello@ahmedislam.tech across the site: Hero, Contact form and its FormSubmit endpoint, Footer, /privacy and README. It replaces the Gmail address.
- The domain's DNS moved to Cloudflare.
- Skills section shows all 70 tools by default. A category tab filters to one group, and "Show all" returns to the full set.
- The Archivo font is served from this site and preloaded, instead of from Google Fonts.
- Long code comments were shortened to one or two lines, and their reasoning moved to HISTORY.md. CLAUDE.md was slimmed to rules.
### Removed
- The /blog pages and the code that built them: the Markdown compiler, `marked`, `highlight.js` and the post-only styles.
- Breadcrumb trails above the heading on service pages and blog posts. Those pages and /privacy keep one back button, which is hidden on phones.
### Fixed
- On phones, taps on the top half of the screen were caught by the closed mobile menu. Experience, Skills, Services, blog contents and FAQ controls now respond anywhere on the screen.
- Sections no longer appear in a fallback font and then reflow when Archivo loads.
- Method section: the orange progress line now ends exactly at the moving dot, at every screen width.

## 2026-11-12
### Added
- A page for each service at /services/<id>: an animated diagram of the system, the problem, the build steps, related experience from the CV, related projects and questions. Linked from the Services section and the Footer.
- Projects: Dukaan, an offline Android app for billing, stock and customer credit, linked to its latest APK download. It replaces Player Segmentation among the three featured projects.
- Privacy page at /privacy, linked from the Footer.
- Google Analytics 4 with Consent Mode, a cookie banner for visitors in Europe, and a "Cookie settings" link in the Footer.
- sitemap.xml, robots.txt and structured data for search engines.
### Changed
- Every page's HTML now contains its text, so search engines and link previews can read it without running JavaScript.
- Home, /projects and /blog take their titles and descriptions from one source. The home page's main heading now includes the role line, with no visible change.
- Hero portrait is a WebP file: 82 kB instead of 1.2 MB.
- Contact form: a link from a service page ticks that service, then removes the parameter from the address bar.
- The blog post and the project summaries were rewritten in shorter, plainer sentences.
### Fixed
- /projects has its own title and description. It used to show the home page's.

## 2026-10-25
### Added
- Blog at /blog, reached from a Blog button in the nav. The first post is a guide to missing values and outliers, and every number in it comes from running its code.
- Blog post layout: a centred heading with byline and portrait, a drawn cover made for each post, a contents list, share links, an author card and previous/next links. The /blog index shows a featured post and a two-column grid of cover cards.
- A share image and preview tags for every page.
- Stats bar on phones shows one stat at a time and advances every 3.2 seconds.
### Changed
- Stats count up over 2.4 seconds instead of 1.5.
- Nav: the orange button reads "Let's talk" on narrower screens, to make room for the Blog button.
- Hero: the line above the closing sentence is gone, and the sentence fits on two lines on wide screens.

## 2026-10-24
### Added
- Buttons, pills and chips give a small spring when pressed. Section headings rise line by line. A dot slides under the active nav link. Experience and Skills crossfade when you switch.
- Scroll-linked motion: the Hero recedes under the nav, the pull quote in About lights up in reading order, and the featured project opens out from an inset frame.
### Changed
- The mobile menu opens as an animated sheet and closes on Escape or a tap outside it.
### Removed
- The vertical note beside the About section.
### Fixed
- Faded heading lines, call-to-action labels and small labels now meet minimum text contrast.
- On phones: larger text on the Hero chips, a role pill that no longer wraps, and larger tap areas on "Show all" and "Read more".
- Services section text says seven offers, which matches the list.

## 2026-10-21
### Added
- The site deploys to GitHub Pages at ahmedislam.tech on every push.
- Favicon (an "AI." monogram) and an Apple touch icon.
- Certifications: the five certifications from the CV show dates and link to LinkedIn.
### Changed
- Contact form sends each enquiry by email through FormSubmit. Before, it only opened the visitor's mail app.
- The page title is shorter: "Ahmed Islam — Full-Stack AI Engineer".
### Removed
- The "0N / NAME" label above each section heading. Section numbers stay in the left rail.
### Fixed
- /projects loads on GitHub Pages instead of returning a 404.

## 2026-09-21
### Added
- Projects: Flintgrab, a Windows desktop app, browser extension and website built with Electron, React, TypeScript and Tailwind, with a capture of the running app. It replaces Construction Safety System among the three featured projects.
### Changed
- Hero: on phones the portrait sits between the headline and the introduction.
- Stats bar scrolls sideways on phones instead of stacking.
- Sideways-scrolling rows (Skills tabs, Experience companies, stats) hide the scrollbar and still scroll.

## 2026-08-30
### Added
- /projects page that lists every project as a full-width row.
- Projects: Player Segmentation, from the Padelos product.
- Images on the PadelGPT, Construction Safety System and Player Segmentation cards. The other cards show a drawn diagram of the project.
- Support for opening /projects directly on hosts that cannot rewrite URLs.
- CLAUDE.md and STYLE.md: project notes and design rules for people working on the code.
### Changed
- Projects section: one featured project, two smaller cards and a link to /projects. It replaces a pinned sideways scroll through every project and is about 1.4 screens tall instead of 6.
- Footer lists nine social profiles and adds GitHub, Medium, LeetCode and X. The rail on the right edge shows five, with GitHub in place of Facebook.
- Nav and Footer section links also work from /projects.
### Removed
- The "Case study coming soon" placeholder page that project cards used to open.

## 2026-08-23
### Added
- Experience section: roles and education from the CV, with a company switcher.
- Skills section: technologies grouped by category, each with an icon.
- Stats bar with three counters that count up.
- Social links fixed to the right edge of the page.
- Content for Services, Reviews and Certifications: seven service offers, five LinkedIn recommendations quoted as written, and eleven certifications.
- The CV as a PDF download.
- Content fades in as it scrolls into view, and the left rail marks the current section.
### Changed
- Projects: each card shows a one-line summary and its tech stack instead of a generated poster image.

## 2026-08-22
### Added
- Hero, About, Method, Reviews, Certifications and Contact sections, the nav bar and the Footer.
- Two scrolling bands of technology icons.
- A rail on the left edge that shows scroll progress and links to each section.
- Projects: technology icons on each card.

## 2026-08-21
### Added
- First version of the site, built with React, TypeScript, Vite and Tailwind CSS.
- Home page with the Projects and Services sections. Projects lists seven projects with links to a live site or a GitHub repository.
- Employer logos for the Experience section.
