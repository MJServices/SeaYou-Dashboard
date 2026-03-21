
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

async function testMatch() {
  const senderId = 'e4ef3954-1074-4d2a-b52a-05be7cffcadf'; // Use an existing user ID as sender
  
  console.log('--- Step 1: Inserting Test Bottle ---');
  const { data: bottle, error: insertError } = await supabase
    .from('sent_bottles')
    .insert({
      sender_id: senderId,
      content_type: 'text',
      message: 'Test matching logic - Age 18 Female',
      target_min_age: 18,
      target_max_age: 18,
      target_gender: ['female'],
      status: 'floating'
    })
    .select()
    .single();

  if (insertError) {
    console.error('Insert Error:', insertError);
    return;
  }
  console.log(`Bottle Inserted: ID ${bottle.id}, Status ${bottle.status}`);

  console.log('--- Step 2: Waiting for Match (5s) ---');
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('--- Step 3: Checking Match Result ---');
  const { data: updatedBottle, error: fetchError } = await supabase
    .from('sent_bottles')
    .select('*')
    .eq('id', bottle.id)
    .single();

  if (fetchError) {
    console.error('Fetch Error:', fetchError);
    return;
  }

  console.log(`Final Status: ${updatedBottle.status}`);
  console.log(`Matched Recipient ID: ${updatedBottle.matched_recipient_id || 'None'}`);
  
  if (updatedBottle.matched_recipient_id) {
     const { data: recipient } = await supabase
       .from('profiles')
       .select('full_name, gender, age')
       .eq('id', updatedBottle.matched_recipient_id)
       .single();
     console.log(`Recipient Info: Name: ${recipient.full_name}, Gender: ${recipient.gender}, Age: ${recipient.age}`);
  }
}

testMatch();
