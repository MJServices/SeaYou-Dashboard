
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/^"|"$/g, '');
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listRecentBottles() {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  
  const { data: bottles, error } = await supabase
    .from('sent_bottles')
    .select('*, sender:profiles!sender_id(full_name), recipient:profiles!matched_recipient_id(full_name, age, gender)')
    .gte('created_at', tenMinutesAgo)
    .order('created_at', { ascending: false });

  if (error) {
    // Fallback if relationships fail
    const { data: simple } = await supabase.from('sent_bottles').select('*').gte('created_at', tenMinutesAgo);
    console.log('Recent bottles (simple):', JSON.stringify(simple, null, 2));
    return;
  }

  console.log(`Recent bottles (${bottles.length}):`, JSON.stringify(bottles, null, 2));
}

listRecentBottles();
