/*
  # Complete GambarKaca Database Schema

  1. New Tables
    - `profiles` - User profiles extending auth.users with role-specific data
    - `campaigns` - Marketing campaigns with pricing and status tracking
    - `campaign_applications` - Talent applications to campaigns
    - `orders` - Orders created when talents are approved
    - `transactions` - Financial transactions and wallet operations
    - `earnings` - Talent earnings tracking
    - `messages` - Real-time chat between founders and talents

  2. Security
    - Enable RLS on all tables
    - Role-based access policies for admins, founders, and talents
    - Secure data access based on ownership and user roles

  3. Functions & Triggers
    - Automatic campaign pricing calculation
    - Wallet balance updates on transactions
    - Total earnings calculation for talents
    - New user profile creation

  4. Performance
    - Comprehensive indexing for optimal query performance
    - Foreign key constraints for data integrity
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types only if they don't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'founder', 'talent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'pending', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending_shipment', 'shipped', 'delivered', 'review_submitted', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('credit', 'debit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE earning_status AS ENUM ('pending', 'paid', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('image', 'video', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE duration_type AS ENUM ('30sec', '1min', '3min');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL DEFAULT 'talent',
  status user_status NOT NULL DEFAULT 'pending',
  avatar_url text,
  
  -- Founder specific fields
  company text,
  phone text,
  address text,
  wallet_balance decimal(10,2) DEFAULT 0.00,
  
  -- Talent specific fields
  bio text,
  portfolio jsonb DEFAULT '[]'::jsonb,
  rate_level integer DEFAULT 1 CHECK (rate_level IN (1, 2, 3)),
  skills jsonb DEFAULT '[]'::jsonb,
  social_media jsonb DEFAULT '{}'::jsonb,
  total_earnings decimal(10,2) DEFAULT 0.00,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  product_name text NOT NULL,
  category text NOT NULL,
  duration duration_type NOT NULL,
  product_images jsonb DEFAULT '[]'::jsonb,
  rate_level integer NOT NULL CHECK (rate_level IN (1, 2, 3)),
  media_type media_type NOT NULL,
  budget decimal(10,2) NOT NULL DEFAULT 0.00,
  price decimal(10,2) NOT NULL,
  status campaign_status NOT NULL DEFAULT 'draft',
  deadline timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Campaign applications table
CREATE TABLE IF NOT EXISTS campaign_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  talent_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  applied_at timestamptz DEFAULT now(),
  
  UNIQUE(campaign_id, talent_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  talent_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  founder_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status order_status NOT NULL DEFAULT 'pending_shipment',
  payout decimal(10,2) NOT NULL,
  
  -- Delivery information
  delivery_address text,
  tracking_number text,
  courier text,
  
  -- Review submission
  review_media_url text,
  review_media_type media_type,
  review_submitted_at timestamptz,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  amount decimal(10,2) NOT NULL,
  description text NOT NULL,
  related_order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Earnings table
CREATE TABLE IF NOT EXISTS earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  talent_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  campaign_title text NOT NULL,
  amount decimal(10,2) NOT NULL,
  status earning_status NOT NULL DEFAULT 'pending',
  earned_at timestamptz DEFAULT now(),
  paid_at timestamptz
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can read active campaigns" ON campaigns;
DROP POLICY IF EXISTS "Founders can manage own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Admins can read all campaigns" ON campaigns;
DROP POLICY IF EXISTS "Talents can manage own applications" ON campaign_applications;
DROP POLICY IF EXISTS "Founders can read applications to their campaigns" ON campaign_applications;
DROP POLICY IF EXISTS "Founders can update applications to their campaigns" ON campaign_applications;
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Founders can manage orders they created" ON orders;
DROP POLICY IF EXISTS "Talents can update their order submissions" ON orders;
DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
DROP POLICY IF EXISTS "System can create transactions" ON transactions;
DROP POLICY IF EXISTS "Talents can read own earnings" ON earnings;
DROP POLICY IF EXISTS "System can manage earnings" ON earnings;
DROP POLICY IF EXISTS "Users can read messages for their orders" ON messages;
DROP POLICY IF EXISTS "Users can send messages for their orders" ON messages;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Campaigns policies
CREATE POLICY "Anyone can read active campaigns"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (status = 'active' OR founder_id = auth.uid());

CREATE POLICY "Founders can manage own campaigns"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (founder_id = auth.uid());

CREATE POLICY "Admins can read all campaigns"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Campaign applications policies
CREATE POLICY "Talents can manage own applications"
  ON campaign_applications
  FOR ALL
  TO authenticated
  USING (talent_id = auth.uid());

CREATE POLICY "Founders can read applications to their campaigns"
  ON campaign_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_id AND founder_id = auth.uid()
    )
  );

CREATE POLICY "Founders can update applications to their campaigns"
  ON campaign_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE id = campaign_id AND founder_id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (founder_id = auth.uid() OR talent_id = auth.uid());

CREATE POLICY "Founders can manage orders they created"
  ON orders
  FOR ALL
  TO authenticated
  USING (founder_id = auth.uid());

CREATE POLICY "Talents can update their order submissions"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (talent_id = auth.uid());

-- Transactions policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Earnings policies
CREATE POLICY "Talents can read own earnings"
  ON earnings
  FOR SELECT
  TO authenticated
  USING (talent_id = auth.uid());

CREATE POLICY "System can manage earnings"
  ON earnings
  FOR ALL
  TO authenticated
  WITH CHECK (true);

-- Messages policies
CREATE POLICY "Users can read messages for their orders"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_id AND (founder_id = auth.uid() OR talent_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages for their orders"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_id AND (founder_id = auth.uid() OR talent_id = auth.uid())
    )
  );

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS calculate_campaign_price(integer, duration_type);
DROP FUNCTION IF EXISTS update_wallet_balance();
DROP FUNCTION IF EXISTS update_total_earnings();
DROP FUNCTION IF EXISTS handle_new_user();

-- Functions for campaign pricing
CREATE OR REPLACE FUNCTION calculate_campaign_price(rate_level integer, duration duration_type)
RETURNS decimal(10,2) AS $$
BEGIN
  CASE 
    WHEN rate_level = 1 THEN
      CASE duration
        WHEN '30sec' THEN RETURN 65.00;
        WHEN '1min' THEN RETURN 70.00;
        WHEN '3min' THEN RETURN 125.00;
      END CASE;
    WHEN rate_level = 2 THEN
      CASE duration
        WHEN '30sec' THEN RETURN 97.50;
        WHEN '1min' THEN RETURN 105.00;
        WHEN '3min' THEN RETURN 187.50;
      END CASE;
    WHEN rate_level = 3 THEN
      CASE duration
        WHEN '30sec' THEN RETURN 130.00;
        WHEN '1min' THEN RETURN 140.00;
        WHEN '3min' THEN RETURN 250.00;
      END CASE;
  END CASE;
  
  RETURN 0.00;
END;
$$ LANGUAGE plpgsql;

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS trigger AS $$
BEGIN
  IF NEW.type = 'credit' THEN
    UPDATE profiles 
    SET wallet_balance = wallet_balance + NEW.amount
    WHERE id = NEW.user_id;
  ELSIF NEW.type = 'debit' THEN
    UPDATE profiles 
    SET wallet_balance = wallet_balance - NEW.amount
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update total earnings
CREATE OR REPLACE FUNCTION update_total_earnings()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    UPDATE profiles 
    SET total_earnings = total_earnings + NEW.amount
    WHERE id = NEW.talent_id;
  ELSIF OLD.status = 'paid' AND NEW.status != 'paid' THEN
    UPDATE profiles 
    SET total_earnings = total_earnings - NEW.amount
    WHERE id = NEW.talent_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'talent');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_wallet_balance_trigger ON transactions;
DROP TRIGGER IF EXISTS update_total_earnings_trigger ON earnings;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to automatically update wallet balance
CREATE TRIGGER update_wallet_balance_trigger
  AFTER INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_balance();

-- Trigger to automatically update total earnings
CREATE TRIGGER update_total_earnings_trigger
  AFTER UPDATE ON earnings
  FOR EACH ROW
  EXECUTE FUNCTION update_total_earnings();

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_founder_id ON campaigns(founder_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_campaign_id ON campaign_applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_applications_talent_id ON campaign_applications(talent_id);
CREATE INDEX IF NOT EXISTS idx_orders_founder_id ON orders(founder_id);
CREATE INDEX IF NOT EXISTS idx_orders_talent_id ON orders(talent_id);
CREATE INDEX IF NOT EXISTS idx_orders_campaign_id ON orders(campaign_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_earnings_talent_id ON earnings(talent_id);
CREATE INDEX IF NOT EXISTS idx_messages_order_id ON messages(order_id);