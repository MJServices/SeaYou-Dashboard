
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

async function findMale() {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, gender, age')
    .eq('gender', 'male')
    .limit(1)
    .single();

  if (profile) {
    console.log(`Found Male User: ID ${profile.id}, Name ${profile.full_name}, Age ${profile.age}`);
  } else {
    console.log('No male user found.');
  }
  
  const { data: female } = await supabase
    .from('profiles')
    .select('id, full_name, gender, age')
    .eq('gender', 'female')
    .limit(1)
    .single();
    
  if (female) {
    console.log(`Found Female User: ID ${female.id}, Name ${female.full_name}, Age ${female.age}`);
  } else {
    console.log('No female user found.');
  }
}

findMale();
