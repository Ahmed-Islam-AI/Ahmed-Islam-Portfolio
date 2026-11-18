/** The ink "Let's talk" panel that closes a service page. */
export default function TalkPanel({ title, body, href = '/#contact' }: { title: string; body: string; href?: string }) {
  return (
    <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-7 py-12 sm:px-12 sm:py-14">
      <div aria-hidden className="absolute -top-1/2 -right-1/4 -z-10 size-[60%] rounded-full bg-brand/20 blur-[100px]" />
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-eyebrow text-brand-bright uppercase">Work with me</p>
          <p className="type-hero mt-3 max-w-[18ch] text-h2 leading-[1.05] text-balance text-white">
            {title}
            <span className="text-brand">?</span>
          </p>
          <p className="mt-3 max-w-[46ch] text-body text-dark-muted">{body}</p>
        </div>
        {/* A plain <a>, like Nav's off-home links: a full load of `/#contact`
            lets the browser do the anchor scroll, which a router <Link> won't. */}
        <a
          href={href}
          data-track="contact_cta"
          data-track-from="talk_panel"
          className="press inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-gradient-to-b from-brand to-brand-deep px-6 py-3.5 text-[0.75rem] font-bold tracking-[0.14em] text-white uppercase shadow-lg shadow-brand/25 hover:brightness-110 sm:self-auto"
        >
          Let&rsquo;s talk
          <span aria-hidden>&rarr;</span>
        </a>
      </div>
    </div>
  )
}
