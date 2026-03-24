-- 1. Add view counts to posts if it doesn't exist
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views integer NOT NULL DEFAULT 0;

-- 2. Add system setting for reward rate per 1000 views
INSERT INTO public.system_settings (key, value, is_public, description)
VALUES (
  'view_reward_rate_per_1k', 
  '100.00', 
  true,
  'How much an author earns for every 1000 views'
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3. Create RPC for processing a view and automatically distributing fractional rewards
CREATE OR REPLACE FUNCTION process_article_view(p_post_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_author_id uuid;
  v_views integer;
  v_rate numeric;
  v_reward numeric;
BEGIN
  -- Get author and current views
  SELECT author_user_id, views INTO v_author_id, v_views
  FROM public.posts WHERE id = p_post_id;
  
  IF v_author_id IS NULL THEN
     RETURN json_build_object('success', false, 'message', 'Post not found or has no author');
  END IF;

  -- increment views
  UPDATE public.posts SET views = COALESCE(views, 0) + 1 WHERE id = p_post_id;
  
  -- get reward rate in JSONB from system_settings
  SELECT (value#>>'{}')::numeric INTO v_rate 
  FROM public.system_settings 
  WHERE key = 'view_reward_rate_per_1k';

  IF v_rate IS NULL THEN 
     v_rate := 100.00; 
  END IF;
  
  v_reward := v_rate / 1000.0;
  
  IF v_reward > 0 THEN
    -- credit wallet using existing function
    PERFORM public.credit_wallet(v_author_id, v_reward, 'reading_reward', 'Earnings from article view');
  END IF;
  
  RETURN json_build_object('success', true, 'views', v_views + 1, 'reward_given', v_reward);
END;
$$;
