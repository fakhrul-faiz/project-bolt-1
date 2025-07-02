import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getCampaigns, 
  getOrders, 
  getTransactions, 
  getEarnings, 
  getMessages,
  subscribeToMessages,
  subscribeToOrders
} from '../lib/supabase';
import { Campaign, Order, Transaction, Earning, Message } from '../types';

interface AppContextType {
  campaigns: Campaign[];
  orders: Order[];
  transactions: Transaction[];
  earnings: Earning[];
  messages: Message[];
  loading: boolean;
  refreshCampaigns: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshEarnings: () => Promise<void>;
  refreshMessages: (orderId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const convertSupabaseCampaign = (campaign: any): Campaign => ({
  id: campaign.id,
  founderId: campaign.founder_id,
  title: campaign.title,
  description: campaign.description,
  productName: campaign.product_name,
  category: campaign.category,
  duration: campaign.duration,
  productImages: Array.isArray(campaign.product_images) ? campaign.product_images : [],
  rateLevel: campaign.rate_level,
  mediaType: campaign.media_type,
  budget: campaign.budget,
  price: campaign.price,
  status: campaign.status,
  applicants: campaign.applications?.filter((app: any) => app.status === 'pending').map((app: any) => app.talent_id) || [],
  approvedTalents: campaign.applications?.filter((app: any) => app.status === 'approved').map((app: any) => app.talent_id) || [],
  createdAt: new Date(campaign.created_at),
  deadline: campaign.deadline ? new Date(campaign.deadline) : undefined,
});

const convertSupabaseOrder = (order: any): Order => ({
  id: order.id,
  campaignId: order.campaign_id,
  talentId: order.talent_id,
  founderId: order.founder_id,
  talentName: order.talent?.name || 'Unknown Talent',
  campaignTitle: order.campaign?.title || 'Unknown Campaign',
  productName: order.campaign?.product_name || 'Unknown Product',
  status: order.status,
  payout: order.payout,
  createdAt: new Date(order.created_at),
  deliveryInfo: order.delivery_address ? {
    address: order.delivery_address,
    trackingNumber: order.tracking_number,
    courier: order.courier,
  } : undefined,
  reviewSubmission: order.review_media_url ? {
    mediaUrl: order.review_media_url,
    mediaType: order.review_media_type,
    submittedAt: new Date(order.review_submitted_at),
  } : undefined,
});

const convertSupabaseTransaction = (transaction: any): Transaction => ({
  id: transaction.id,
  userId: transaction.user_id,
  type: transaction.type,
  amount: transaction.amount,
  description: transaction.description,
  relatedJobId: transaction.related_order_id,
  createdAt: new Date(transaction.created_at),
});

const convertSupabaseEarning = (earning: any): Earning => ({
  id: earning.id,
  talentId: earning.talent_id,
  orderId: earning.order_id,
  campaignTitle: earning.campaign_title,
  amount: earning.amount,
  status: earning.status,
  earnedAt: new Date(earning.earned_at),
  paidAt: earning.paid_at ? new Date(earning.paid_at) : undefined,
});

const convertSupabaseMessage = (message: any): Message => ({
  id: message.id,
  jobId: message.order_id,
  senderId: message.sender_id,
  content: message.content,
  timestamp: new Date(message.created_at),
  read: message.read,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCampaigns = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const filters = user.role === 'founder' ? { founderId: user.id } : {};
      const { data, error } = await getCampaigns(filters);
      
      if (error) {
        console.error('Error fetching campaigns:', error);
        return;
      }

      if (data) {
        setCampaigns(data.map(convertSupabaseCampaign));
      }
    } catch (error) {
      console.error('Error refreshing campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const filters = user.role === 'founder' 
        ? { founderId: user.id } 
        : user.role === 'talent' 
          ? { talentId: user.id }
          : {};
          
      const { data, error } = await getOrders(filters);
      
      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      if (data) {
        setOrders(data.map(convertSupabaseOrder));
      }
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await getTransactions(user.id);
      
      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      if (data) {
        setTransactions(data.map(convertSupabaseTransaction));
      }
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshEarnings = async () => {
    if (!user || user.role !== 'talent') return;
    
    try {
      setLoading(true);
      const { data, error } = await getEarnings(user.id);
      
      if (error) {
        console.error('Error fetching earnings:', error);
        return;
      }

      if (data) {
        setEarnings(data.map(convertSupabaseEarning));
      }
    } catch (error) {
      console.error('Error refreshing earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshMessages = async (orderId: string) => {
    try {
      const { data, error } = await getMessages(orderId);
      
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      if (data) {
        setMessages(data.map(convertSupabaseMessage));
      }
    } catch (error) {
      console.error('Error refreshing messages:', error);
    }
  };

  // Load initial data when user changes
  useEffect(() => {
    if (user) {
      refreshCampaigns();
      refreshOrders();
      refreshTransactions();
      if (user.role === 'talent') {
        refreshEarnings();
      }
    } else {
      setCampaigns([]);
      setOrders([]);
      setTransactions([]);
      setEarnings([]);
      setMessages([]);
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const subscriptions: any[] = [];

    // Subscribe to order changes
    if (user.role === 'founder' || user.role === 'talent') {
      const orderSub = subscribeToOrders(user.id, () => {
        refreshOrders();
      });
      subscriptions.push(orderSub);
    }

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe());
    };
  }, [user]);

  return (
    <AppContext.Provider value={{
      campaigns,
      orders,
      transactions,
      earnings,
      messages,
      loading,
      refreshCampaigns,
      refreshOrders,
      refreshTransactions,
      refreshEarnings,
      refreshMessages,
    }}>
      {children}
    </AppContext.Provider>
  );
};