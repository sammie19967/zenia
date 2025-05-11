'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './AdActions.module.css';

export default function AdActions({ ad }) {
  const { data: session } = useSession();
  
  if (!session || session.user.id !== ad.userId.toString()) {
    return null;
  }

  return (
    <div className={styles.actionsContainer}>
      <h3 className={styles.actionsTitle}>Manage Your Ad</h3>
      <div className={styles.actionsButtons}>
        <Link
          href={`/ads/${ad._id}/edit`}
          className={styles.editButton}
        >
          Edit
        </Link>
        <button
          className={styles.deleteButton}
          onClick={() => {
            if (confirm('Are you sure you want to delete this ad?')) {
              // Handle delete logic here
            }
          }}
        >
          Delete
        </button>
        {ad.status === 'inactive' && (
          <button className={styles.reactivateButton}>
            Reactivate
          </button>
        )}
      </div>
    </div>
  );
}