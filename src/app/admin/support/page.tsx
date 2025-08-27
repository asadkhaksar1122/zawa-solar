// app/support/page.tsx
"use client"
import React from 'react';
import { Phone, Mail, MessageSquare, Search, ArrowRight, Paperclip, ChevronDown, Building, Home, ShieldCheck, Smartphone, CreditCard, Plus, PhoneCall } from 'lucide-react';

export default function SupportPage() {
    return (
        <main className="min-h-screen bg-background text-foreground font-body">
            <section className="relative">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 pointer-events-none" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                    {/* Hero / Search */}
                    <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm p-6 sm:p-10 relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
                                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                                    All systems operational
                                </div>
                                <h1 className="mt-4 font-headline text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
                                    How can we help?
                                </h1>
                                <p className="mt-3 text-muted-foreground">
                                    Zawa Solar Support is here 24/7 to keep your energy flowing. Search help articles, browse topics, or contact us.
                                </p>
                            </div>

                            <div className="w-full md:max-w-sm">
                                <div className="flex items-center rounded-xl border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring">
                                    <span className="pl-3 text-muted-foreground">
                                        <Search size={20} />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search FAQs, guides, troubleshooting…"
                                        className="w-full bg-transparent px-3 py-3 outline-none placeholder:text-muted-foreground"
                                        aria-label="Search support content"
                                    />
                                    <button className="m-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-95 transition">
                                        Search
                                    </button>
                                </div>

                                {/* Quick tags */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {['Installation', 'Billing', 'Monitoring App', 'Warranty', 'Commercial', 'Residential'].map((tag) => (
                                        <button
                                            key={tag}
                                            className="rounded-full border border-border bg-secondary/30 px-3 py-1 text-xs text-secondary-foreground hover:bg-secondary/40 transition"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact options */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <SupportCard
                            title="Call us 24/7"
                            desc="Avg. wait time: 2–4 min"
                            action="Call now"
                            href="tel:+923449212613"
                            icon={
                                <Phone className="h-5 w-5" />
                            }
                        />
                        <SupportCard
                            title="Email support"
                            desc="Response in ~4 hours"
                            action="Send email"
                            href="mailto:zawasoler@gmail.com"
                            icon={<Mail className="h-5 w-5" />}
                        />
                        <SupportCard
                            title="Live chat"
                            desc="Mon–Sat 7am–10pm"
                            action="Start chat"
                            href="#chat"
                            icon={<MessageSquare className="h-5 w-5" />}
                        />
                        <SupportCard
                            title="WhatsApp"
                            desc="Quick answers"
                            action="Open WhatsApp"
                            href="https://wa.me/923449212613"
                            icon={<MessageSquare className="h-5 w-5" />}
                        />
                    </div>

                    {/* Self-serve categories */}
                    <div className="mt-10 rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-8">
                        <h2 className="font-headline text-2xl font-semibold">Browse help by topic</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Step-by-step guides, best practices, and troubleshooting.</p>

                        <div className="mt-6 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
                            {topics.map((t) => (
                                <a
                                    key={t.title}
                                    href={t.href}
                                    className="group rounded-xl border border-border bg-background p-5 hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-primary/15 text-primary p-2 ring-1 ring-primary/20">
                                            {t.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{t.title}</h3>
                                            <p className="text-sm text-muted-foreground">{t.desc}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-primary inline-flex items-center gap-1">
                                        View articles
                                        <ArrowRight className="h-4 w-4 translate-x-0 group-hover:translate-x-0.5 transition" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Ticket form + FAQs */}
                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Ticket form */}
                        <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-8">
                            <h2 className="font-headline text-2xl font-semibold">Create a support ticket</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Tell us what’s going on and we’ll get back to you ASAP.
                            </p>

                            <form className="mt-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Full name">
                                        <input className="Input" placeholder="Jane Doe" />
                                    </Field>
                                    <Field label="Email address">
                                        <input type="email" className="Input" placeholder="you@company.com" />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Category">
                                        <select className="Input">
                                            <option>Installation</option>
                                            <option>Billing</option>
                                            <option>Monitoring App</option>
                                            <option>Warranty & Repairs</option>
                                            <option>Commercial Systems</option>
                                            <option>Residential Systems</option>
                                            <option>Other</option>
                                        </select>
                                    </Field>
                                    <Field label="Priority">
                                        <select className="Input">
                                            <option>Normal</option>
                                            <option>High</option>
                                            <option>Urgent</option>
                                        </select>
                                    </Field>
                                </div>

                                <Field label="Subject">
                                    <input className="Input" placeholder="e.g., Inverter showing error code 305" />
                                </Field>

                                <Field label="Order/Installation ID (optional)">
                                    <input className="Input" placeholder="ZAWA-INV-12345" />
                                </Field>

                                <Field label="Message">
                                    <textarea className="Input min-h-[120px]" placeholder="Describe the issue, steps you’ve tried, and when it started…" />
                                </Field>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div>
                                        <label className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm cursor-pointer hover:bg-muted/30 transition">
                                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                                            <span>Attach file</span>
                                            <input type="file" className="hidden" />
                                        </label>
                                        <p className="mt-1 text-xs text-muted-foreground">Max 10MB. Screenshots help a lot!</p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition"
                                    >
                                        Submit ticket
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* FAQs */}
                        <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-8">
                            <h2 className="font-headline text-2xl font-semibold">Frequently asked questions</h2>
                            <div className="mt-4 divide-y divide-border">
                                {faqs.map((f, idx) => (
                                    <details key={idx} className="group py-4">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                                            <span className="font-medium">{f.q}</span>
                                            <ChevronDown className="h-5 w-5 text-muted-foreground transition group-open:rotate-180" />
                                        </summary>
                                        <div className="mt-3 text-sm text-muted-foreground animate-in fade-in-50 slide-in-from-top-1">
                                            {f.a}
                                        </div>
                                    </details>
                                ))}
                            </div>

                            <div className="mt-6 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                                Can’t find what you need?{' '}
                                <a className="text-primary underline underline-offset-4 hover:opacity-90" href="#ticket">
                                    Create a ticket
                                </a>{' '}
                                or{' '}
                                <a className="text-primary underline underline-offset-4 hover:opacity-90" href="mailto:zawasoler@gmail.com">
                                    email us
                                </a>.
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card text-card-foreground p-6 sm:p-8 lg:flex-row">
                        <div>
                            <h3 className="font-headline text-xl font-semibold">Need urgent help right now?</h3>
                            <p className="text-sm text-muted-foreground">Our emergency line is available for critical outages.</p>
                        </div>
                        <a
                            href="tel:+923449212613"
                            className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2.5 text-destructive-foreground hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring transition"
                        >
                            <PhoneCall className="h-5 w-5" />
                            Call emergency support
                        </a>
                    </div>
                </div>
            </section>

            <style jsx global>{`
        /* Small utility so we don't repeat input classes: */
        .Input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--input));
          background: hsl(var(--background));
          padding: 0.625rem 0.875rem;
          outline: none;
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .Input:focus {
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.6);
          border-color: hsl(var(--ring));
        }
      `}</style>
        </main>
    );
}

/* Reusable components */

function SupportCard({
    title,
    desc,
    action,
    href,
    icon,
}: {
    title: string;
    desc: string;
    action: string;
    href: string;
    icon: React.ReactNode;
}) {
    return (
        <a
            href={href}
            className="group rounded-2xl border border-border bg-card text-card-foreground p-5 shadow-sm hover:shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/15 text-primary p-2 ring-1 ring-primary/20">
                    {icon}
                </div>
                <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
                        {action}
                        <ArrowRight className="h-4 w-4 translate-x-0 group-hover:translate-x-0.5 transition" />
                    </div>
                </div>
            </div>
        </a>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1 block text-sm font-medium">{label}</span>
            {children}
        </label>
    );
}

/* Data */

const topics = [
    {
        title: 'Installation & Onboarding',
        desc: 'Site prep, permitting, go-live checklist.',
        href: '#installation',
        icon: (
            <Plus className="h-5 w-5" />
        ),
    },
    {
        title: 'Billing & Payments',
        desc: 'Invoices, financing, and receipts.',
        href: '#billing',
        icon: (
            <CreditCard className="h-5 w-5" />
        ),
    },
    {
        title: 'Monitoring App',
        desc: 'App setup, alerts, and dashboards.',
        href: '#app',
        icon: (
            <Smartphone className="h-5 w-5" />
        ),
    },
    {
        title: 'Warranty & Repairs',
        desc: 'Coverage terms and claims.',
        href: '#warranty',
        icon: (
            <ShieldCheck className="h-5 w-5" />
        ),
    },
    {
        title: 'Commercial Systems',
        desc: 'Scale, monitoring, SLAs.',
        href: '#commercial',
        icon: (
            <Building className="h-5 w-5" />
        ),
    },
    {
        title: 'Residential Systems',
        desc: 'Home setup and maintenance.',
        href: '#residential',
        icon: (
            <Home className="h-5 w-5" />
        ),
    },
];

const faqs = [
    {
        q: 'My inverter displays an error code. What should I do?',
        a: 'Power-cycle the inverter (turn off/on), check the breaker, and ensure the app shows a connection. If the error persists, create a ticket with the code and a photo; our team will guide you.',
    },
    {
        q: 'How do I track my installation status?',
        a: 'Open the Monitoring App → Account → Projects → Installation Status. You can also contact your project manager or chat with us for real-time updates.',
    },
    {
        q: 'Where can I find my warranty details?',
        a: 'Warranty information is available in your onboarding email and inside the app (Account → Documents). You can also request a copy via email support.',
    },
    {
        q: 'Do you support net metering and grid tie-ins?',
        a: 'Yes. We provide documentation and local compliance guidance. Create a ticket with your utility details and we’ll assist with the next steps.',
    },
    {
        q: 'How quickly do you respond to tickets?',
        a: 'Most tickets receive a response within 4–6 business hours. Emergency outages are prioritized with a dedicated hotline.',
    },
];