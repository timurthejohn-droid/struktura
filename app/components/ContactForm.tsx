"use client";
import { useState } from "react";
import SectionHead from "./SectionHead";

const fields = [
  { key: "name", label: "Имя", type: "text" },
  { key: "phone", label: "Номер телефона", type: "tel" },
  { key: "email", label: "E-mail", type: "email" },
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 md:py-36" style={{ background: "var(--paper)", borderTop: "1px solid var(--line-light)" }}>
      <div className="container-x">
        <SectionHead index="10" kicker="Контакты" theme="light" />
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24">
          {/* Left */}
          <div>
            <h2 className="text-ink mb-8" style={{ fontSize: "clamp(30px, 3.6vw, 60px)", lineHeight: 1.04 }}>
              Обсудить проект
            </h2>
            <p className="font-body text-ink-soft max-w-sm mb-12" style={{ fontSize: "17px", lineHeight: 1.6 }}>
              Расскажите о&nbsp;проекте — изучим задачу и&nbsp;предложим оптимальное
              решение. Первая консультация бесплатна.
            </p>

            <div className="space-y-6">
              <div>
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mb-1">Телефон</p>
                <a href="tel:+74956642823" className="font-mono text-ink text-xl hover:text-orange transition-colors">
                  +7 (495) 664-28-23
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mb-1">E-mail</p>
                <a href="mailto:office@sk-struktura.ru" className="font-body text-ink-soft hover:text-ink transition-colors">
                  office@sk-struktura.ru
                </a>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mb-1">Адрес</p>
                <p className="font-body text-ink-soft text-sm leading-relaxed">
                  125040 Москва, Ленинградский проспект,
                  <br />
                  д.&nbsp;15 стр.&nbsp;14, 4&nbsp;этаж
                </p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          {sent ? (
            <div className="flex items-center justify-center min-h-[360px]" style={{ border: "1px solid var(--line-light)" }}>
              <div className="text-center px-6">
                <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--orange)" }}>
                  <span className="text-white text-2xl">✓</span>
                </div>
                <h3 className="font-mono text-ink text-lg mb-3">Заявка отправлена</h3>
                <p className="font-body text-ink-soft text-sm">Свяжемся с&nbsp;вами в&nbsp;течение рабочего дня</p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mb-2">{f.label}</label>
                  <input
                    type={f.type}
                    required
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-4 py-3 font-body text-ink text-sm outline-none transition-colors"
                    style={{ border: "1px solid var(--line-light)", background: "var(--paper-card)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--orange)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
                  />
                </div>
              ))}
              <div>
                <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-ink/40 mb-2">Сообщение</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 font-body text-ink text-sm outline-none resize-none transition-colors"
                  style={{ border: "1px solid var(--line-light)", background: "var(--paper-card)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--orange)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
                />
              </div>

              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className="flex-shrink-0 w-4 h-4 mt-0.5"
                  style={{ border: "1px solid rgba(0,0,0,0.25)", background: agreed ? "var(--orange)" : "transparent" }}
                  aria-label="Согласие"
                >
                  {agreed && <span className="block text-white text-[10px] leading-none">✓</span>}
                </button>
                <p className="font-body text-ink/45 text-xs leading-relaxed">
                  Я принимаю условия обработки персональных данных и&nbsp;правила пользования сервисом
                </p>
              </div>

              <button
                type="submit"
                disabled={!agreed}
                className="w-full py-4 font-mono text-xs tracking-[0.15em] uppercase text-white transition-all"
                style={{ background: agreed ? "var(--orange)" : "rgba(0,0,0,0.15)", cursor: agreed ? "pointer" : "not-allowed" }}
              >
                Отправить
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
