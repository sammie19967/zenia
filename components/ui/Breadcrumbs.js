// components/ui/Breadcrumbs.jsx
import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ items }) => {
  return (
    <nav className={styles.breadcrumbs}>
      <ol>
        {items.map((item, index) => (
          <li key={index}>
            {index < items.length - 1 ? (
              <Link href={item.href} className={styles.link}>
                {item.name}
              </Link>
            ) : (
              <span className={styles.current}>{item.name}</span>
            )}
            {index < items.length - 1 && (
              <span className={styles.separator}>/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; // Make sure this is a default export