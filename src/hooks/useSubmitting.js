import { useCallback, useState } from 'react';

export function useSubmitting() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const withSubmitting = useCallback(async (action) => {
    setIsSubmitting(true);
    try {
      return await action();
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const runIfChanged = useCallback(async ({ hasChanges, onUnchanged, onChanged }) => {
    if (!hasChanges) {
      onUnchanged?.();
      return;
    }

    return withSubmitting(onChanged);
  }, [withSubmitting]);

  return { isSubmitting, withSubmitting, runIfChanged };
}
