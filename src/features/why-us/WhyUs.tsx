'use client';

import SectionDivider from '@/components/ui/SectionDivider/SectionDivider';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { WhyUsItem } from '@/lib/types';
import { whyUsItems } from './whyUsData';
import styles from './WhyUs.module.css';

interface WhyUsProps {
  items?: WhyUsItem[];
}

export default function WhyUs({ items = whyUsItems }: WhyUsProps) {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className={[styles.section, isVisible ? styles.visible : ''].filter(Boolean).join(' ')}
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <SectionDivider />
          <h2 className={styles.heading}>Why Resurgent India?</h2>
        </div>

        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id} className={styles.box}>
              <span
                className={styles.iconTile}
                dangerouslySetInnerHTML={{ __html: item.icon }}
                aria-hidden="true"
              />
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
              {item.detail && (
                <p className={styles.detail}>{item.detail}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
