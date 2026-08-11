"use client";

import { useState } from "react";
import SectionHead from "../SectionHead";
import { email, vacancies } from "./careersData";

// Отклик уходит письмом: кнопка собирает готовое письмо в почтовом клиенте —
// так резюме можно приложить файлом, и заявка не теряется без бэкенда.

const roles = ["Не выбрана", ...vacancies.map((vacancy) => vacancy.title)];

export default function ResumeForm() {
  const [form, setForm] = useState({ name: "", mail: "", role: roles[0], link: "", message: "" });
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: event.target.value });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = form.role === roles[0] ? "Резюме в STRUKTURA" : `Отклик на вакансию: ${form.role}`;
    const body = [
      `Имя: ${form.name}`,
      `E-mail: ${form.mail}`,
      `Вакансия: ${form.role}`,
      form.link ? `Резюме / портфолио: ${form.link}` : null,
      form.message ? `\n${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "block h-9 w-full border-0 border-b border-black/15 bg-transparent px-0 font-body text-[15px] text-ink outline-none transition-colors focus:border-orange";
  const label = "block font-mono text-[11px] uppercase leading-9 tracking-[0.16em] text-ink/50";

  return (
    <section id="resume" className="scroll-mt-24 bg-paper py-16 md:py-24">
      <div className="container-x">
        <SectionHead index="03" kicker="Отправить резюме" theme="light" />

        <div className="grid border border-black/10 bg-white lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="flex flex-col justify-between gap-10 border-b border-black/10 p-7 md:p-10 lg:border-b-0 lg:border-r">
            <div>
              <p className="font-body text-[clamp(17px,1.6vw,24px)] leading-[1.35] text-ink">
                Расскажите о себе — и приложите резюме файлом в письме.
              </p>
              <p className="mt-6 font-body text-[14px] leading-[1.6] text-ink/55">
                Кнопка соберёт готовое письмо в вашем почтовом клиенте: останется прикрепить файл и
                отправить.
              </p>
            </div>

            <div className="border-t border-black/10 pt-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">Почта для резюме</span>
              <a
                href={`mailto:${email}`}
                className="mt-3 block font-mono text-[clamp(15px,1.5vw,20px)] uppercase text-ink transition-colors hover:text-orange"
              >
                {email}
              </a>
            </div>
          </div>

          <div className="p-7 md:p-10">
            {sent ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center bg-orange text-2xl text-white">✓</div>
                <h3 className="font-mono text-[18px] uppercase tracking-[0.08em] text-ink">Письмо собрано</h3>
                <p className="mt-3 max-w-[320px] font-body text-[14px] leading-[1.55] text-ink/60">
                  Проверьте почтовый клиент: приложите резюме и отправьте письмо на{" "}
                  <a href={`mailto:${email}`} className="text-orange hover:text-ink">
                    {email}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={label}>Имя</span>
                    <input type="text" required value={form.name} onChange={set("name")} className={field} />
                  </label>
                  <label className="block">
                    <span className={label}>E-mail</span>
                    <input type="email" required value={form.mail} onChange={set("mail")} className={field} />
                  </label>
                  <label className="block">
                    <span className={label}>Вакансия</span>
                    <select value={form.role} onChange={set("role")} className={`${field} cursor-pointer`}>
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className={label}>Ссылка на резюме или портфолио</span>
                    <input type="url" value={form.link} onChange={set("link")} className={field} placeholder="https://" />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className={label}>Сообщение</span>
                  <textarea
                    rows={2}
                    value={form.message}
                    onChange={set("message")}
                    className={`${field} h-auto resize-none py-2`}
                  />
                </label>

                <div className="mt-9 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                  <button
                    type="submit"
                    disabled={!agreed}
                    className="inline-grid h-11 w-[240px] grid-cols-[1fr_44px] bg-orange font-mono text-[12px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-orange-dark disabled:cursor-not-allowed disabled:bg-black/15"
                  >
                    <span className="flex items-center px-5">Отправить резюме</span>
                    <span className="flex items-center justify-center border-l border-white/35" aria-hidden>
                      →
                    </span>
                  </button>

                  <label className="flex max-w-[280px] items-start gap-[14px]">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(event) => setAgreed(event.target.checked)}
                      className="mt-0.5 h-[18px] w-[18px] shrink-0 appearance-none border border-black/15 bg-white checked:border-orange checked:bg-orange"
                      aria-label="Согласие на обработку персональных данных"
                    />
                    <span className="font-body text-[11px] leading-[15px] text-ink/55">
                      Я принимаю <span className="text-ink">условия обработки</span> моих персональных данных
                    </span>
                  </label>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
