
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

async function inspectBottle() {
  const bottleId = 'be4ca3fa-8aff-46f0-a069-924f52a4fb42';
  
  const { data: bottle } = await supabase
    .from('sent_bottles')
    .select('*')
    .eq('id', bottleId)
    .single();

  console.log('--- Sent Bottle ---');
  console.log(`ID: ${bottle.id}`);
  console.log(`Target Gender: ${JSON.stringify(bottle.target_gender)}`);
  console.log(`Target Age: ${bottle.target_min_age} - ${bottle.target_max_age}`);
  
  const rid = bottle.matched_recipient_id || bottle.receiver_id;
  if (rid) {
    const { data: recipient } = await supabase
      .from('profiles')
      .select('full_name, gender, age, birth_year')
      .eq('id', rid)
      .single();
    console.log('--- Recipient ---');
    console.log(`Name: ${recipient.full_name}`);
    console.log(`Gender: ${recipient.gender}`);
    console.log(`Age: ${recipient.age}`);
  }
}

inspectBottle();
