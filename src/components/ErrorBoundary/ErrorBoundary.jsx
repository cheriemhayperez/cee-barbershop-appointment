import { Component } from 'react';

import styles from '@/components/ErrorBoundary/ErrorBoundary.module.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap}>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.message}>Refresh the page or try again in a moment.</p>
          <button type="button" className={styles.button} onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
