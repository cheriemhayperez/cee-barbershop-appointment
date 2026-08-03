import { useCallback, useEffect, useRef, useState } from 'react';

const SAVED_IDLE_MS = 2000;

export function useSaveStatus() {
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError, setSaveError] = useState(null);
  const savedTimeoutRef = useRef(null);

  useEffect(() => () => {
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
  }, []);

  const markSaved = useCallback(() => {
    setSaveStatus('saved');
    if (savedTimeoutRef.current) clearTimeout(savedTimeoutRef.current);
    savedTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), SAVED_IDLE_MS);
  }, []);

  const beginSave = useCallback(() => {
    setSaveStatus('saving');
    setSaveError(null);
  }, []);

  const failSave = useCallback((message) => {
    setSaveStatus('error');
    setSaveError(message);
  }, []);

  const withSave = useCallback(async (action, errorMessage = 'Failed to save.') => {
    beginSave();
    try {
      const result = await action();
      markSaved();
      return result;
    } catch (err) {
      failSave(err?.message || errorMessage);
      throw err;
    }
  }, [beginSave, failSave, markSaved]);

  return {
    saveStatus,
    saveError,
    isSaving: saveStatus === 'saving',
    markSaved,
    beginSave,
    failSave,
    withSave,
  };
}
