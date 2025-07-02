import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

// Campaign helpers
export const getCampaigns = async (filters?: any) => {
  let query = supabase
    .from('campaigns')
    .select(`
      *,
      founder:profiles!campaigns_founder_id_fkey(name, company),
      applications:campaign_applications(
        id,
        talent_id,
        status,
        talent:profiles!campaign_applications_talent_id_fkey(name, email, rate_level)
      )
    `);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.founderId) {
    query = query.eq('founder_id', filters.founderId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const createCampaign = async (campaignData: any) => {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaignData)
    .select()
    .single();
  return { data, error };
};

export const updateCampaign = async (campaignId: string, updates: any) => {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', campaignId)
    .select()
    .single();
  return { data, error };
};

export const deleteCampaign = async (campaignId: string) => {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', campaignId);
  return { error };
};

// Campaign application helpers
export const applyCampaign = async (campaignId: string, talentId: string) => {
  const { data, error } = await supabase
    .from('campaign_applications')
    .insert({
      campaign_id: campaignId,
      talent_id: talentId,
    })
    .select()
    .single();
  return { data, error };
};

export const updateApplicationStatus = async (applicationId: string, status: string) => {
  const { data, error } = await supabase
    .from('campaign_applications')
    .update({ status })
    .eq('id', applicationId)
    .select()
    .single();
  return { data, error };
};

// Order helpers
export const getOrders = async (filters?: any) => {
  let query = supabase
    .from('orders')
    .select(`
      *,
      campaign:campaigns(title, product_name),
      talent:profiles!orders_talent_id_fkey(name, email),
      founder:profiles!orders_founder_id_fkey(name, company)
    `);

  if (filters?.founderId) {
    query = query.eq('founder_id', filters.founderId);
  }

  if (filters?.talentId) {
    query = query.eq('talent_id', filters.talentId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

export const createOrder = async (orderData: any) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  return { data, error };
};

export const updateOrder = async (orderId: string, updates: any) => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();
  return { data, error };
};

// Transaction helpers
export const getTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createTransaction = async (transactionData: any) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select()
    .single();
  return { data, error };
};

// Earnings helpers
export const getEarnings = async (talentId: string) => {
  const { data, error } = await supabase
    .from('earnings')
    .select('*')
    .eq('talent_id', talentId)
    .order('earned_at', { ascending: false });
  return { data, error };
};

export const updateEarning = async (earningId: string, updates: any) => {
  const { data, error } = await supabase
    .from('earnings')
    .update(updates)
    .eq('id', earningId)
    .select()
    .single();
  return { data, error };
};

// Message helpers
export const getMessages = async (orderId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(name, role)
    `)
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });
  return { data, error };
};

export const sendMessage = async (messageData: any) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();
  return { data, error };
};

// Real-time subscriptions
export const subscribeToMessages = (orderId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`messages:${orderId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `order_id=eq.${orderId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToOrders = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`orders:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `founder_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};