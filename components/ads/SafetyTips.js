import styles from './SafetyTips.module.css';

export default function SafetyTips() {
  return (
    <div className={styles.safetyTips}>
      <h3 className={styles.title}>Safety Tips</h3>
      <ul className={styles.tipsList}>
        <li>Meet seller in a public place</li>
        <li>Inspect the item before purchasing</li>
        <li>Never pay in advance</li>
        <li>Check all documents carefully</li>
        <li>Be wary of deals that seem too good to be true</li>
      </ul>
    </div>
  );
}