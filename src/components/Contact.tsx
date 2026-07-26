import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import Reveal from "./Reveal";
import { addSubmission } from "../lib/cms";
import { useContent } from "../lib/content";

export default function Contact() {
  const { contact } = useContent();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    budget: "",
    message: "",
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addSubmission({
      name: form.name.trim(),
      email: form.email.trim(),
      projectType: form.type,
      budget: form.budget,
      message: form.message.trim(),
    });
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", type: "", budget: "", message: "" });
  };

  const INFO = [
    { icon: "📧", label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: "📱", label: "Instagram", value: contact.instagram, href: "https://instagram.com" },
    { icon: "▶️", label: "YouTube", value: contact.youtube, href: "https://youtube.com" },
    { icon: "📍", label: "Location", value: contact.location },
    { icon: "⚡", label: "Response Time", value: contact.response },
  ];

  const inputCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white placeholder:text-gray-500 outline-none transition-colors focus:border-lime";

  return (
    <section id="contact" className="relative bg-ink-2 py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <h2 className="text-4xl font-bold text-white sm:text-6xl">
            {contact.headingPre} <span className="text-lime">{contact.headingAccent}</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
          {/* left column */}
          <Reveal delay={100}>
            <div className="space-y-4">
              {INFO.map((item) => {
                const inner = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.06] text-lg">
                      {item.icon}
                    </span>
                    <span>
                      <span className="block font-bold text-white">{item.label}</span>
                      <span
                        className={`block text-gray-400 ${
                          item.href ? "underline decoration-gray-600 underline-offset-4" : ""
                        }`}
                      >
                        {item.value}
                      </span>
                    </span>
                  </>
                );
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="flex items-center gap-4 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-4 transition-all duration-200 hover:border-lime/50 hover:bg-lime/[0.05]"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-4"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

            <div className="mt-10">
              <p className="text-sm font-semibold tracking-[0.25em] text-gray-500">TOOLS I USE</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {contact.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-gray-200 transition-colors hover:border-lime/50 hover:text-lime"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={200}>
            <form onSubmit={submit} className="rounded-3xl border border-white/[0.08] bg-[#0e1118] p-7 sm:p-9">
              <h3 className="text-2xl font-bold text-white">{contact.formTitle}</h3>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold tracking-[0.18em] text-gray-500">YOUR NAME</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold tracking-[0.18em] text-gray-500">YOUR EMAIL</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold tracking-[0.18em] text-gray-500">PROJECT TYPE</span>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={`${inputCls} appearance-none ${form.type ? "text-white" : "text-gray-500"}`}
                  >
                    <option value="" className="bg-[#0e1118]">Select type...</option>
                    <option className="bg-[#0e1118]">Reel / Short</option>
                    <option className="bg-[#0e1118]">YouTube Video</option>
                    <option className="bg-[#0e1118]">Brand Video</option>
                    <option className="bg-[#0e1118]">Motion Graphics</option>
                    <option className="bg-[#0e1118]">Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold tracking-[0.18em] text-gray-500">BUDGET RANGE</span>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className={`${inputCls} appearance-none ${form.budget ? "text-white" : "text-gray-500"}`}
                  >
                    <option value="" className="bg-[#0e1118]">Select budget...</option>
                    <option className="bg-[#0e1118]">Under ₹5,000</option>
                    <option className="bg-[#0e1118]">₹5,000 – ₹15,000</option>
                    <option className="bg-[#0e1118]">₹15,000 – ₹50,000</option>
                    <option className="bg-[#0e1118]">₹50,000+</option>
                  </select>
                </label>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-semibold tracking-[0.18em] text-gray-500">YOUR MESSAGE</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project, timeline, and goals..."
                  className={`${inputCls} resize-none`}
                />
              </label>

              <button
                type="submit"
                className="glow-lime mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime py-4 text-base font-bold text-black transition-transform duration-200 hover:scale-[1.02] active:scale-95"
              >
                {sent ? (
                  <>
                    <CheckCircle2 size={18} /> Message Sent — I'll reply within 24h!
                  </>
                ) : (
                  <>
                    {contact.submit} <Send size={16} fill="currentColor" />
                  </>
                )}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
