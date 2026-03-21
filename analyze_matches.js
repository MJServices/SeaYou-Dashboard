
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

async function analyzeMatches() {
  const { data: bottles, error } = await supabase
    .from('sent_bottles')
    .select('id, target_min_age, target_max_age, target_gender, matched_recipient_id, status, created_at')
    .not('matched_recipient_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`--- Analyzing ${bottles.length} Recent Matches ---`);
  for (const b of bottles) {
    const { data: recipient } = await supabase
      .from('profiles')
      .select('gender, age')
      .eq('id', b.matched_recipient_id)
      .single();

    if (!recipient) continue;

    const genderMatch = b.target_gender?.includes(recipient.gender) || !b.target_gender || b.target_gender.length === 0;
    const ageMatch = (recipient.age >= b.target_min_age && recipient.age <= b.target_max_age);

    if (!genderMatch || !ageMatch) {
       console.log(`FAIL: Bottle ${b.id} Target [Age ${b.target_min_age}-${b.target_max_age}, Genders ${JSON.stringify(b.target_gender)}] matched Recipient [Age ${recipient.age}, Gender ${recipient.gender}]`);
    } else {
       // console.log(`OK: Bottle ${b.id}`);
    }
  }
}

analyzeMatches();
