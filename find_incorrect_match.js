
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

async function findIncorrectMatch() {
  const { data: bottles, error } = await supabase
    .from('sent_bottles')
    .select('id, target_min_age, target_max_age, target_gender, matched_recipient_id, status, created_at')
    .not('matched_recipient_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error:', error);
    return;
  }

  for (const b of bottles) {
    const { data: recipient } = await supabase
      .from('profiles')
      .select('gender, age')
      .eq('id', b.matched_recipient_id)
      .single();

    if (!recipient) continue;

    const targetGenders = b.target_gender?.map(g => g.toLowerCase()) || [];
    const recipientGender = recipient.gender?.toLowerCase();
    
    // Check if recipient gender is in target list (if target list not empty)
    const genderOk = targetGenders.length === 0 || targetGenders.includes(recipientGender) || 
                       (targetGenders.includes('non-binary') && recipientGender === 'nonbinary');
    
    const ageOk = recipient.age >= b.target_min_age && recipient.age <= b.target_max_age;

    if (!genderOk || !ageOk) {
      console.log(`FOUND INCORRECT MATCH:`);
      console.log(`Bottle: ID ${b.id}, Target Age ${b.target_min_age}-${b.target_max_age}, Target Gender ${JSON.stringify(b.target_gender)}`);
      console.log(`Recipient: Gender ${recipient.gender}, Age ${recipient.age}`);
      console.log(`Status: ${b.status}, Created: ${b.created_at}`);
      console.log('-----------------------------------');
    }
  }
}

findIncorrectMatch();
