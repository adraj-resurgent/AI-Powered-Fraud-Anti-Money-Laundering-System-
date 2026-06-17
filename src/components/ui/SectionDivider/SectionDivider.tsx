import styles from './SectionDivider.module.css';

interface SectionDividerProps {
  /** Horizontal alignment of the bar (default "center"). */
  align?: 'left' | 'center';
  className?: string;
}

/** A short yellow accent bar used above section headings. */
export default function SectionDivider({ align = 'center', className = '' }: SectionDividerProps) {
  return (
    <span
      className={[styles.divider, align === 'left' ? styles.left : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    />
  );
}
