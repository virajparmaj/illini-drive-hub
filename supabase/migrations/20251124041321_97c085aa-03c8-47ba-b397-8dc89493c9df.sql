-- Create profiles table for user data
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name text,
  email text NOT NULL,
  has_license boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create buddy_posts table
CREATE TABLE public.buddy_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('NEED_HELP', 'CAN_HELP')),
  dmv_location text NOT NULL,
  test_date date NOT NULL,
  time_window text NOT NULL,
  details text,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on buddy_posts
ALTER TABLE public.buddy_posts ENABLE ROW LEVEL SECURITY;

-- Buddy posts policies
CREATE POLICY "Anyone can view active buddy posts"
  ON public.buddy_posts FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can create their own buddy posts"
  ON public.buddy_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buddy posts"
  ON public.buddy_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own buddy posts"
  ON public.buddy_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create appointment_preferences table
CREATE TABLE public.appointment_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  receive_emails boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on appointment_preferences
ALTER TABLE public.appointment_preferences ENABLE ROW LEVEL SECURITY;

-- Appointment preferences policies
CREATE POLICY "Users can view their own preferences"
  ON public.appointment_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.appointment_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.appointment_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create appointment_reports table
CREATE TABLE public.appointment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  dmv_location text NOT NULL,
  appointment_date date NOT NULL,
  time_observed timestamp with time zone DEFAULT now() NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on appointment_reports
ALTER TABLE public.appointment_reports ENABLE ROW LEVEL SECURITY;

-- Appointment reports policies
CREATE POLICY "Anyone can view appointment reports"
  ON public.appointment_reports FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create appointment reports"
  ON public.appointment_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_buddy_posts_updated_at
  BEFORE UPDATE ON public.buddy_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointment_preferences_updated_at
  BEFORE UPDATE ON public.appointment_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();