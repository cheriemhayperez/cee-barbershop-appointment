import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchAllData } from '@/api/db';
import { CBLoaderBackdrop } from '@/components';
import { isSupabaseConfigured } from '@/lib/supabase';
import { setAppointments } from '@/reducers/appointments/appointments.slice';
import { setBarbers } from '@/reducers/barbers/barbers.slice';
import { setCustomers } from '@/reducers/customers/customers.slice';
import { setServices } from '@/reducers/services/services.slice';
import { setLoadedSchedule } from '@/utils/scheduleBus';
import { setLoadedShop } from '@/utils/shopBus';
import { defaultSchedule } from '@/constants';
import defaultShop from '@/static/defaultShop.json';
import { normalizeShopConfig } from '@/utils/shopUtils';

function isMissingTablesError(err) {
  const message = err?.message ?? '';
  return err?.code === 'PGRST205' || message.includes('Could not find the table');
}

function clearStore(dispatch) {
  dispatch(setAppointments([]));
  dispatch(setBarbers([]));
  dispatch(setServices([]));
  dispatch(setCustomers([]));
  setLoadedSchedule(defaultSchedule);
  setLoadedShop(normalizeShopConfig(defaultShop));
}

function LoadingScreen() {
  return <CBLoaderBackdrop label="Loading shop data" />;
}

function SetupScreen({ title, message }) {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        color: '#666',
        fontSize: '0.875rem',
      }}
    >
      <div>
        <p style={{ color: '#c0392b', marginBottom: '0.5rem' }}>{title}</p>
        <p>{message}</p>
      </div>
    </div>
  );
}

export function DataProvider({ children }) {
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);
  const [setupError, setSetupError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSetupError({
        title: 'Database not configured',
        message: 'Run supabase/migrations/001_initial_schema.sql in the Supabase SQL Editor to create tables.',
      });
      return;
    }

    let cancelled = false;

    fetchAllData()
      .then((data) => {
        if (cancelled || !data) return;

        dispatch(setAppointments(data.appointments));
        dispatch(setBarbers(data.barbers));
        dispatch(setServices(data.services));
        dispatch(setCustomers(data.customers));
        setLoadedSchedule(data.schedule);
        setLoadedShop(data.shop);
        setReady(true);
      })
      .catch((err) => {
        if (cancelled) return;

        if (isMissingTablesError(err)) {
          clearStore(dispatch);
          setSetupError({
            title: 'Database tables not found',
            message: 'Run supabase/migrations/001_initial_schema.sql in the Supabase SQL Editor to create tables.',
          });
          return;
        }

        setSetupError({
          title: 'Could not connect to the database',
          message: err.message || 'Failed to load data from database.',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (setupError) {
    return <SetupScreen title={setupError.title} message={setupError.message} />;
  }

  if (!ready) return <LoadingScreen />;

  return children;
}
