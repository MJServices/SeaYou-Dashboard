
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

async function checkAgeConsistency() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, birth_year, age');

  if (error) {
    console.error('Error:', error);
    return;
  }

  const currentYear = new Date().getFullYear();
  profiles.forEach(p => {
    const calculatedAge = p.birth_year ? currentYear - p.birth_year : null;
    console.log(`User: ${p.full_name}, Age Col: ${p.age}, Calc Age: ${calculatedAge}, Birth Year: ${p.birth_year}`);
    if (calculatedAge !== null && p.age !== calculatedAge) {
      console.log('--- STALE AGE DETECTED! ---');
    }
  });
}

checkAgeConsistency();
