import { COMPANY } from '@/lib/constants';
import styles from './AnimatedOrbit.module.css';

interface OrbitNode {
  label: string;
  /** Angle in degrees around the ring (0 = top, clockwise). */
  angle: number;
}

/* Clockwise arrangement (0deg = top):
   AML ~11 o'clock · Credit & Risk ~2 · Sanctions ~5 · PEP ~7 · Regulatory ~9 */
const DEFAULT_NODES: OrbitNode[] = [
  { label: 'AML Screening', angle: 330 },
  { label: 'Credit & Risk Analytics', angle: 60 },
  { label: 'Sanctions Screening', angle: 150 },
  { label: 'PEP Screening', angle: 210 },
  { label: 'Regulatory Monitoring', angle: 270 },
];

interface AnimatedOrbitProps {
  nodes?: OrbitNode[];
}

/**
 * Self-contained, CSS-only animated orbit:
 * a central yellow shield with "RI", surrounded by labelled nodes
 * rotating on a dashed glowing ring. Nodes counter-rotate to stay upright.
 */
export default function AnimatedOrbit({ nodes = DEFAULT_NODES }: AnimatedOrbitProps) {
  return (
    <div className={styles.orbit} role="img" aria-label="Resurgent India AML capability orbit">
      {/* Outer glowing dashed ring */}
      <div className={styles.ring} aria-hidden="true" />

      {/* Rotating layer carrying the nodes */}
      <div className={styles.rotor} aria-hidden="true">
        {nodes.map((node) => (
          <div
            key={node.label}
            className={styles.nodeAnchor}
            style={{ transform: `rotate(${node.angle}deg) translateY(-40.9cqmin)` }}
          >
            {/* counterRotor cancels the rotor's spin; inner rotate cancels the anchor angle */}
            <div className={styles.counterRotor}>
              <div
                className={styles.node}
                style={{ transform: `rotate(${-node.angle}deg)` }}
              >
                <span className={styles.dot} />
                <span className={styles.nodeLabel}>{node.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Central shield */}
      <div className={styles.shield}>
        <svg viewBox="0 0 120 140" className={styles.shieldSvg} aria-hidden="true">
          <defs>
            <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0a83a" />
              <stop offset="100%" stopColor="#d4900a" />
            </linearGradient>
          </defs>
          <path
            d="M60 4 L112 24 V70 C112 104 88 126 60 136 C32 126 8 104 8 70 V24 Z"
            fill="url(#shieldGrad)"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>
        <span className={styles.shieldText}>{COMPANY.initials}</span>
      </div>
    </div>
  );
}
