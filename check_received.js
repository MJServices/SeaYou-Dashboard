
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
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: received, error } = await supabase
    .from('received_bottles')
    .select('*, sender:profiles!received_bottles_sender_id_fkey(full_name), recipient:profiles!received_bottles_receiver_id_fkey(full_name, age, gender)')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching received_bottles:', error);
    // Try without relationships if fkeys are different
    const { data: simple } = await supabase.from('received_bottles').select('*').limit(10);
    console.log('Simple list:', simple);
    return;
  }

  console.log('--- Received Bottles (Last 10) ---');
  received.forEach(r => {
    console.log(`Bottle ID: ${r.sent_bottle_id}, Recipient: ${r.recipient?.full_name} (${r.recipient?.gender}, Age ${r.recipient?.age}), Date: ${r.created_at}`);
  });
}

check();
