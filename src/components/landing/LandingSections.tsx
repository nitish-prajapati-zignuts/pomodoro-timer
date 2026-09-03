"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is the Pomodoro Technique?",
    answer:
      "The Pomodoro Technique is a time-tested productivity method developed in the late 1980s by Francesco Cirillo. You work in focused 25-minute intervals called pomodoros, each followed by a restorative 5-minute break, with a longer 15-minute break after every four rounds. The structured cadence eliminates procrastination and preserves cognitive stamina.",
  },
  {
    question: "How do the ancient civilization backgrounds help focus?",
    answer:
      "Visual tranquility and awe induce flow states by reducing visual noise and anxiety. Our photorealistic depictions of ancient wonders—from Egyptian pyramids under starry skies to tranquil Greek coastal temples and Rajput lakeside palaces—provide a calming, inspiring backdrop that keeps you immersed.",
  },
  {
    question: "Does the timer keep running if I switch tabs or close my browser?",
    answer:
      "Yes. The countdown uses timestamp-based wall-clock synchronization. Even when your browser tab is backgrounded or throttled, the timer will never drift, and your completed sessions will be preserved when you return.",
  },
  {
    question: "How do tasks and time tracking integrate with the timer?",
    answer:
      "You can add your to-do items in the slide-out Task panel and click the target icon next to any task. The timer will automatically accumulate your active focus minutes directly onto that task, allowing you to track exactly how long your projects take.",
  },
  {
    question: "Where is my data stored? Do I need an account?",
    answer:
      "You can use the timer immediately without an account—all tasks, streaks, and settings are saved locally in your browser. When you sign in (via Google, GitHub, or our instant Scholar profile), your sessions, tasks, and streaks sync to the MongoDB database so you never lose your progress across devices.",
  },
];

export function LandingSections() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="landing-content">
      {/* Statement Section */}
      <section className="lsec text-center flex flex-col items-center">
        <p className="leyebrow">Ancient Wisdom • Modern Productivity</p>
        <h1 className="landing-h1">The Pomodoro timer that counts your wins.</h1>
        <p className="landing-sub">
          A timeless Pomodoro timer with harmonic ambient soundscapes, a built-in to-do list,
          custom intervals, daily streaks and challenges — everything you need to stay in flow and
          conquer procrastination.
        </p>
      </section>

      {/* Features Grid */}
      <section className="lsec">
        <div className="text-center mb-8">
          <p className="leyebrow">Features</p>
          <h2 className="text-3xl font-bold font-[var(--font-ancient)] text-white">
            Everything you need to stay in flow
          </h2>
        </div>

        <div className="lgrid">
          <div className="lcard">
            <span className="lbadge">🍅</span>
            <h3>Pomodoro Cycles</h3>
            <p>
              Classic 25 / 5 focus-and-break intervals, tuned to how human attention and cognitive
              endurance actually function.
            </p>
          </div>

          <div className="lcard">
            <span className="lbadge">✅</span>
            <h3>Tasks That Ride Along</h3>
            <p>
              Keep your to-do list right beside the timer and mark exactly what you’re focusing on.
              Time logs aggregate automatically.
            </p>
          </div>

          <div className="lcard">
            <span className="lbadge">🎁</span>
            <h3>Challenges &amp; Laurels</h3>
            <p>
              Commit to daily focus goals and unlock ancient laurels and confetti celebrations the
              moment you conquer your target.
            </p>
          </div>

          <div className="lcard">
            <span className="lbadge">🔥</span>
            <h3>Daily Streaks</h3>
            <p>
              Show up every day and watch your flame grow. Weekly streak protection ensures an
              unexpected interruption won&apos;t break your chain.
            </p>
          </div>

          <div className="lcard">
            <span className="lbadge">🎧</span>
            <h3>Harmonic Soundscapes</h3>
            <p>
              Synthesized 432Hz binaural focus tones, rainstorms, and Tibetan bronze singing bowls to
              drown out surrounding distractions.
            </p>
          </div>

          <div className="lcard">
            <span className="lbadge">🏛️</span>
            <h3>Living Ancient Wonders</h3>
            <p>
              Immerse yourself in photorealistic wonders: the Pyramids of Giza, the Acropolis of Athens,
              Rajasthan Forts, Gothic Castles, and Mayan Pyramids.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="lsec">
        <div className="text-center mb-8">
          <p className="leyebrow">How It Works</p>
          <h2 className="text-3xl font-bold font-[var(--font-ancient)] text-white">
            Four focused sprints, then a real break
          </h2>
          <p className="text-white/60 text-sm max-w-lg mx-auto mt-2">
            The Pomodoro Technique breaks complex work into deliberate, bite-sized sprints so focus
            stays razor-sharp and rest stays guilt-free.
          </p>
        </div>

        <ol className="lsteps">
          <li className="lstep">
            <span className="num">01</span>
            <h3>Pick a Task</h3>
            <p>Choose the single most important endeavor you will dedicate your mind to next.</p>
          </li>
          <li className="lstep">
            <span className="num">02</span>
            <h3>Focus for 25 Min</h3>
            <p>One pomodoro. Zero open social tabs, zero distractions. Uninterrupted presence.</p>
          </li>
          <li className="lstep">
            <span className="num">03</span>
            <h3>Short 5 Min Break</h3>
            <p>Step away from the screen, take a deep breath, hydrate, or stretch. Never skip.</p>
          </li>
          <li className="lstep">
            <span className="num">04</span>
            <h3>Repeat ×4, Long Rest</h3>
            <p>After four completed pomodoros, enjoy a restorative 15 to 30-minute deep recovery.</p>
          </li>
        </ol>
      </section>

      {/* Science Section */}
      <section className="lsec text-center bg-white/[0.02] border border-white/10 rounded-3xl p-10 max-w-4xl mx-auto">
        <p className="leyebrow">The Science</p>
        <h2 className="text-3xl font-bold font-[var(--font-ancient)] text-white mb-4">
          Why ~20-25 minutes is the sweet spot
        </h2>
        <p className="text-white/70 leading-relaxed text-base max-w-2xl mx-auto mb-6">
          Cognitive neuroscience reveals that human sustained attention naturally begins to attenuate
          after 20 to 25 minutes. Taking brief, proactive resets resets neuronal vigilance and
          prevents mental fatigue, allowing you to produce higher quality work in fewer total hours.
        </p>
        <span className="text-xs text-[var(--gold-primary)] font-semibold tracking-wide uppercase">
          Proven across decades of psychological research
        </span>
      </section>

      {/* FAQ Section */}
      <section className="lsec max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="leyebrow">FAQ</p>
          <h2 className="text-3xl font-bold font-[var(--font-ancient)] text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={faq.question} className={`faq-item ${isOpen ? "open" : ""}`}>
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="faq-trigger"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[var(--gold-primary)] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && <div className="faq-content">{faq.answer}</div>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="w-full text-center pt-10 border-t border-white/10 text-xs text-white/40">
        <p>© 2026 Ancient Pomodoro Timer • Built with Next.js SSR &amp; MongoDB</p>
      </footer>
    </div>
  );
}
