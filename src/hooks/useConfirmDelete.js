import { useCallback, useState } from 'react';

const initialState = { open: false, id: null, label: '' };

export function useConfirmDelete(onConfirm) {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const requestDelete = useCallback((id, label) => {
    setState({ open: true, id, label });
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    if (loading) return;
    setState(initialState);
  }, [loading]);

  const confirmDelete = useCallback(async () => {
    if (state.id == null || loading) return;

    setLoading(true);
    try {
      await onConfirm(state.id, state.label);
      setState(initialState);
    } finally {
      setLoading(false);
    }
  }, [state.id, state.label, loading, onConfirm]);

  return {
    deleteConfirmOpen: state.open,
    deleteTargetName: state.label,
    requestDelete,
    closeDeleteConfirm,
    confirmDelete,
    deleteLoading: loading,
  };
}
