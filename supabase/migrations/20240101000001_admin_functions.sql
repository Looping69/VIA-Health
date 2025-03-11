-- Create function to get all tables and their row counts
CREATE OR REPLACE FUNCTION get_all_tables()
RETURNS TABLE (name text, schema text, rowCount bigint) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tables.table_name::text as name,
    tables.table_schema::text as schema,
    (SELECT COUNT(*) FROM information_schema.tables t WHERE t.table_schema = tables.table_schema AND t.table_name = tables.table_name)::bigint as rowCount
  FROM 
    information_schema.tables tables
  WHERE 
    tables.table_schema NOT IN ('pg_catalog', 'information_schema')
    AND tables.table_type = 'BASE TABLE'
  ORDER BY 
    tables.table_schema, tables.table_name;
END;
$$;

-- Create function to execute SQL queries (with security restrictions)
CREATE OR REPLACE FUNCTION execute_sql(query_text text)
RETURNS JSONB
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  result JSONB;
BEGIN
  -- Prevent destructive operations
  IF query_text ~* '^\s*(DROP|DELETE|TRUNCATE|ALTER|UPDATE|INSERT)' THEN
    RAISE EXCEPTION 'Destructive operations are not allowed through this interface';
  END IF;
  
  -- Execute the query and return results as JSON
  EXECUTE 'SELECT COALESCE(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (' || query_text || ') t' INTO result;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RAISE;
END;
$$;

-- Add role column to users table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'users' 
                 AND column_name = 'role') THEN
    ALTER TABLE public.users ADD COLUMN role text DEFAULT 'user';
  END IF;
END
$$;

-- Enable realtime for users table
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
