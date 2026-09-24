-- Create a function to handle new user signups and automatically create their profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- 1. Insert into profiles using the metadata we passed during signUp
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  
  -- 2. Automatically assign the 'customer' role in user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'customer');

  RETURN new;
END;
$$;

-- Create the trigger on Supabase's internal auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- BACKFILL EXISTING USERS
-- Ensure all existing users in auth.users have a profile (using email prefix as first_name if metadata missing)
INSERT INTO public.profiles (id, first_name, last_name)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'first_name', split_part(email, '@', 1)),
    COALESCE(raw_user_meta_data->>'last_name', '')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

-- Ensure all existing users have the 'customer' role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'customer'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles);
