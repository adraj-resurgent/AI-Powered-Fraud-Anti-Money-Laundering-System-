'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import { products as defaultProducts } from './productsData';
import styles from './ProductSection.module.css';

interface ProductSectionProps {
  items?: Product[];
}

export default function ProductSection({ items = defaultProducts }: ProductSectionProps) {
  const [sectionRef, isVisible] = useIntersectionObserver<HTMLElement>();

  return (
    <section
      id="products"
      ref={sectionRef}
      className={[styles.section, isVisible ? styles.visible : ''].filter(Boolean).join(' ')}
      style={{ paddingTop: '40px', paddingBottom: '60px' }}
    >
      <div className={styles.header} style={{ marginBottom: 0 }}>
        <div
          aria-hidden="true"
          style={{
            width: '60px',
            height: '3px',
            backgroundColor: '#F5A623',
            margin: '0 auto 16px auto',
          }}
        />
        <h2 className={styles.heading} style={{ marginBottom: '40px', textAlign: 'center' }}>
          Our Products
        </h2>
      </div>

      <div className={styles.grid}>
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
