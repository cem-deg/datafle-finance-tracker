"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { ChevronDown } from "lucide-react";

const FAQ_DATA = [
  {
    q: "What is Datafle?",
    a: "Datafle is a smart personal finance tracker that helps you log expenses, visualize spending patterns with beautiful charts, and receive AI-powered insights to make better financial decisions.",
  },
  {
    q: "Is Datafle free to use?",
    a: "Yes! Datafle is completely free. You can create an account, track unlimited expenses, and access all analytics features at no cost.",
  },
  {
    q: "How does the AI Insights feature work?",
    a: "Our AI Insights feature uses Google Gemini AI to analyze your spending data and provide personalized recommendations. It looks at your spending trends, category breakdowns, and predicted future spending to give actionable advice.",
  },
  {
    q: "Which currencies are supported?",
    a: "Datafle supports 18+ currencies including USD, EUR, TRY, GBP, JPY, KRW, CAD, AUD, CHF, INR, BRL, and more. You can switch currencies anytime from the settings panel in the sidebar.",
  },
  {
    q: "Can I create custom categories?",
    a: "Absolutely! You can create unlimited custom categories with your choice of 50+ icons organized across 12 groups (Food, Transport, Shopping, Pets, etc.) and 15 color options.",
  },
  {
    q: "Is my financial data secure?",
    a: "Your data is stored securely with encrypted passwords using bcrypt hashing. All API communications use JWT token authentication. Your financial data is never shared with third parties.",
  },
  {
    q: "How does the spending prediction work?",
    a: "Datafle uses machine learning (linear regression) on your historical monthly spending data to predict how much you'll likely spend next month. The more data you add, the more accurate predictions become.",
  },
  {
    q: "Can I export my data?",
    a: "Data export functionality is planned for a future release. Currently, you can view all your expenses in the Expenses page with filtering and search capabilities.",
  },
  {
    q: "What happens if I delete a category?",
    a: "You can only delete categories that have no expenses assigned to them. If a category has expenses, you'll need to reassign those expenses to another category first.",
  },
  {
    q: "Does Datafle have a mobile app?",
    a: "Datafle is a responsive web application that works beautifully on mobile browsers. A dedicated mobile app is being considered for future development.",
  },
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <div className="faq-page">
        <div className="section-header animate-in" style={{ marginBottom: "var(--space-xl)" }}>
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions about Datafle</p>
        </div>

        {FAQ_DATA.map((item, i) => (
          <div
            key={i}
            className={`faq-item animate-in ${openIdx === i ? "open" : ""}`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              <span>{item.q}</span>
              <ChevronDown size={18} />
            </button>
            <div className="faq-answer">{item.a}</div>
          </div>
        ))}
      </div>
    </>
  );
}
