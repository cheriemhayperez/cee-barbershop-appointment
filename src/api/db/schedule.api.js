import { supabase } from '@/lib/supabase';
import { defaultSchedule } from '@/static/shared/scheduleDefaults';

export async function fetchSchedule() {
  const { data, error } = await supabase
    .from('schedule_config')
    .select('config')
    .eq('id', 1)
    .maybeSingle();
  if (error) throw error;
  if (!data?.config) return defaultSchedule;
  return { ...defaultSchedule, ...data.config };
}

export async function saveSchedule(schedule) {
  const { error } = await supabase.from('schedule_config').upsert({
    id: 1,
    config: schedule,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
