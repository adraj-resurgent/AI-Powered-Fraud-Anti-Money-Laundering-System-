'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button/Button';
import type { PricingPlan } from '@/lib/types';
import { pricingPlans, pricingFaqs } from './pricingData';
import styles from './PricingSection.module.css';

interface PricingSectionProps {
  plans?: PricingPlan[];
  faqs?: { question: string; answer: string }[];
}

export default function PricingSection({
  plans = pricingPlans,
  faqs = pricingFaqs,
}: PricingSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Pricing on Your Terms!</h1>
          <p className={styles.heroSubtext}>
            Flexible, transparent pricing designed for BFSI compliance teams of all sizes.
          </p>
        </div>
      </section>

      {/* PLAN CARDS */}
      <section className={styles.plansSection}>
        <div className={styles.container}>
          <div className={styles.plans}>
            {plans.map((plan) => (
              <article
                key={plan.id}
                className={[styles.plan, plan.highlighted ? styles.highlighted : '']
                  .filter(Boolean)
                  .join(' ')}
              >
                <span
                  className={[styles.badge, plan.highlighted ? styles.badgeFilled : styles.badgeOutline]
                    .join(' ')}
                >
                  {plan.badge}
                </span>
                <h2 className={styles.planName}>{plan.name}</h2>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.period}>{plan.period}</span>
                </div>
                <p className={styles.planDescription}>{plan.description}</p>

                <ul className={styles.features}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.feature}>
                      <span className={styles.check} aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  href="/contact-us"
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  fullWidth
                >
                  Get Started
                </Button>
              </article>
            ))}
          </div>

          <p className={styles.note}>
            All prices in USD. Indian clients contact us for INR pricing.
          </p>

          {/* FAQ accordion */}
          <div className={styles.faqWrap}>
            <h2 className={styles.faqHeading}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={faq.question} className={styles.faqItem}>
                    <button
                      className={styles.faqQuestion}
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <span
                        className={[styles.faqIcon, isOpen ? styles.faqIconOpen : ''].join(' ')}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      className={[styles.faqAnswer, isOpen ? styles.faqAnswerOpen : ''].join(' ')}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
