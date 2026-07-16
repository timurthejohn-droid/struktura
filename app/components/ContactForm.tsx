"use client";
import { useState } from "react";
import { useReveal } from "./useReveal";

const fields = [
  { key: "name", label: "Имя", type: "text" },
  { key: "phone", label: "Номер телефона", type: "tel" },
  { key: "email", label: "E-mail", type: "email" },
];

const contactBackground =
  "https://www.figma.com/api/mcp/asset/8cc5dc92-091d-467b-9918-dbabd554dea9";

export default function ContactForm() {
  const revealRef = useReveal();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="bg-paper pt-16 md:pt-24">
      <div className="container-x reveal" ref={revealRef}>
        <div
          className="relative min-h-[600px] overflow-hidden px-5 py-5 md:px-10 md:py-8"
          style={{ background: "var(--orange)" }}
        >
          <img
            src={contactBackground}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-orange/20 mix-blend-overlay" />
          <div className="relative z-10 grid min-h-[560px] gap-6 lg:grid-cols-2">
            <div className="flex items-end">
              <div className="w-full max-w-[270px] bg-white px-5 py-6 md:px-8 md:py-7">
                <a
                  href="tel:+74956642823"
                  className="block font-mono text-[20px] uppercase tracking-[0.1em] text-ink transition-colors hover:text-orange"
                >
                  +7 495 664 28 23
                </a>
                <p className="mt-12 font-body text-[12px] font-medium leading-[18px] text-ink/60">
                  125040 Москва, Ленинградский проспект, д.&nbsp;15 стр.&nbsp;14,
                  4&nbsp;этаж
                </p>
              </div>
            </div>

            <div className="bg-white px-6 py-8 md:px-10 md:py-10 lg:min-h-[560px]">
              <h2
                className="text-ink"
                style={{ fontSize: "clamp(30px, 3.2vw, 40px)", lineHeight: 1.1, letterSpacing: "0.05em" }}
              >
                Обсудить проект
              </h2>

              {sent ? (
                <div className="flex min-h-[360px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center bg-orange">
                      <span className="text-2xl text-white">✓</span>
                    </div>
                    <h3 className="font-mono text-lg uppercase tracking-[0.1em] text-ink">
                      Заявка отправлена
                    </h3>
                    <p className="mt-3 font-body text-sm text-ink-soft">
                      Свяжемся с&nbsp;вами в&nbsp;течение рабочего дня
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mt-20 md:mt-28">
                  <div className="space-y-[17px]">
                    {fields.map((f) => (
                      <label key={f.key} className="block">
                        <span className="block font-mono text-[12px] uppercase leading-10 tracking-[0.16em] text-black">
                          {f.label}
                        </span>
                        <input
                          type={f.type}
                          required
                          value={form[f.key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          className="block h-8 w-full border-0 border-b border-black/10 bg-transparent px-0 font-body text-sm text-ink outline-none transition-colors focus:border-orange"
                        />
                      </label>
                    ))}
                    <label className="block">
                      <span className="block font-mono text-[12px] uppercase leading-10 tracking-[0.16em] text-black">
                        Сообщение
                      </span>
                      <textarea
                        rows={1}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="block h-8 w-full resize-none border-0 border-b border-black/10 bg-transparent px-0 font-body text-sm text-ink outline-none transition-colors focus:border-orange"
                      />
                    </label>
                  </div>

                  <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <button
                      type="submit"
                      disabled={!agreed}
                      className="inline-grid h-10 w-[220px] grid-cols-[1fr_40px] bg-orange font-mono text-[12px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-orange-dark disabled:cursor-not-allowed disabled:bg-black/15"
                    >
                      <span className="flex items-center px-5">Оставить заявку</span>
                      <span className="flex items-center justify-center border-l border-white/35" aria-hidden="true">
                        →
                      </span>
                    </button>

                    <label className="flex max-w-[260px] items-start gap-[15px]">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-0.5 h-[18px] w-[18px] shrink-0 appearance-none border border-black/10 bg-white checked:border-orange checked:bg-orange"
                        aria-label="Согласие на обработку персональных данных"
                      />
                      <span className="font-body text-[10px] leading-[13px] text-[#595959]">
                        Я принимаю <span className="text-black">условия обработки</span>{" "}
                        моих персональных данных и правила пользования сервисом
                      </span>
                    </label>
                  </div>
                </form>
              )}
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
