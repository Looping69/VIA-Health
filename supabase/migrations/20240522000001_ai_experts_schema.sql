-- Create AI Experts table
CREATE TABLE IF NOT EXISTS ai_experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE,
  api_key TEXT,
  llm_provider TEXT,
  llm_model TEXT,
  temperature NUMERIC DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1000,
  system_prompt TEXT,
  knowledge_base_id UUID,
  fine_tuning_status TEXT DEFAULT 'not_started',
  fine_tuning_progress NUMERIC DEFAULT 0,
  training_data_path TEXT
);

-- Create AI Expert Capabilities table
CREATE TABLE IF NOT EXISTS ai_expert_capabilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_id UUID REFERENCES ai_experts(id) ON DELETE CASCADE,
  capability TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI Expert Consultations table
CREATE TABLE IF NOT EXISTS ai_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_id UUID REFERENCES ai_experts(id),
  user_id UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'in_progress',
  summary TEXT,
  recommendation TEXT,
  severity TEXT,
  referred_to_doctor BOOLEAN DEFAULT FALSE,
  doctor_id UUID REFERENCES auth.users(id),
  doctor_notes TEXT
);

-- Create AI Consultation Messages table
CREATE TABLE IF NOT EXISTS ai_consultation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES ai_consultations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI Expert Training Data table
CREATE TABLE IF NOT EXISTS ai_expert_training_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expert_id UUID REFERENCES ai_experts(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  completion TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Create AI Expert Knowledge Base table
CREATE TABLE IF NOT EXISTS ai_expert_knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create AI Expert Knowledge Base Documents table
CREATE TABLE IF NOT EXISTS ai_expert_knowledge_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_base_id UUID REFERENCES ai_expert_knowledge_base(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  document_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  embedding TEXT
);

-- Create AI Expert Referrals table
CREATE TABLE IF NOT EXISTS ai_expert_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES ai_consultations(id),
  patient_id UUID REFERENCES auth.users(id),
  doctor_id UUID REFERENCES auth.users(id),
  symptoms TEXT NOT NULL,
  assessment TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  doctor_notes TEXT,
  decline_reason TEXT
);

-- Enable row level security
ALTER TABLE ai_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_expert_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_consultation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_expert_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_expert_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_expert_knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_expert_referrals ENABLE ROW LEVEL SECURITY;

-- Create policies
-- AI Experts policies
CREATE POLICY "AI Experts are viewable by all users"
  ON ai_experts FOR SELECT
  USING (true);

-- Add user_role column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'user';

CREATE POLICY "AI Experts can be created by admins"
  ON ai_experts FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT id FROM users WHERE user_role = 'admin'
  ));

CREATE POLICY "AI Experts can be updated by admins"
  ON ai_experts FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM users WHERE user_role = 'admin'
  ));

-- AI Expert Capabilities policies
CREATE POLICY "AI Expert Capabilities are viewable by all users"
  ON ai_expert_capabilities FOR SELECT
  USING (true);

CREATE POLICY "AI Expert Capabilities can be created by admins"
  ON ai_expert_capabilities FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT id FROM users WHERE user_role = 'admin'
  ));

-- AI Consultations policies
CREATE POLICY "Users can view their own consultations"
  ON ai_consultations FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = doctor_id);

CREATE POLICY "Users can create consultations"
  ON ai_consultations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consultations"
  ON ai_consultations FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = doctor_id);

-- AI Consultation Messages policies
CREATE POLICY "Users can view messages from their consultations"
  ON ai_consultation_messages FOR SELECT
  USING (
    consultation_id IN (
      SELECT id FROM ai_consultations 
      WHERE user_id = auth.uid() OR doctor_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their consultations"
  ON ai_consultation_messages FOR INSERT
  WITH CHECK (
    consultation_id IN (
      SELECT id FROM ai_consultations 
      WHERE user_id = auth.uid() OR doctor_id = auth.uid()
    )
  );

-- AI Expert Referrals policies
CREATE POLICY "Patients can view their own referrals"
  ON ai_expert_referrals FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Doctors can view referrals assigned to them"
  ON ai_expert_referrals FOR SELECT
  USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update referrals assigned to them"
  ON ai_expert_referrals FOR UPDATE
  USING (auth.uid() = doctor_id);

-- Add realtime
alter publication supabase_realtime add table ai_experts;
alter publication supabase_realtime add table ai_expert_capabilities;
alter publication supabase_realtime add table ai_consultations;
alter publication supabase_realtime add table ai_consultation_messages;
alter publication supabase_realtime add table ai_expert_referrals;