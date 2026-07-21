import { supabase } from '@/lib/supabase';

export async function invokeSendBookingEmails(payload) {
  return supabase.functions.invoke('send-booking-emails', {
    body: payload,
  });
}
