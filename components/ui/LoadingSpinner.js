import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`${styles.spinnerContainer} ${className}`}>
      <div className={styles.spinner}></div>
    </div>
  );
}