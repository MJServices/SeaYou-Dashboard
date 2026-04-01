
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Simple .env parser
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

async function inspect() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, last_active, created_at');

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  console.log(`--- Total Profiles: ${profiles.length} ---`);
  console.log(JSON.stringify(profiles, null, 2));
}

inspect();
