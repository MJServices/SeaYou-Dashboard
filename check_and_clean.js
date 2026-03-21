
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

async function checkAndClean() {
  console.log('--- Checking for Profiles with NULL age ---');
  const { data: nullAgeProfiles, error: pError } = await supabase
    .from('profiles')
    .select('id, full_name, age')
    .is('age', null);

  if (pError) console.error('Profiles Error:', pError);
  else console.log('Profiles with NULL age:', nullAgeProfiles.length, nullAgeProfiles.map(p => p.full_name));

  console.log('\n--- Checking for malformed target_gender in sent_bottles ---');
  const { data: bottles, error: bError } = await supabase
    .from('sent_bottles')
    .select('id, target_gender');

  if (bError) {
    console.error('Bottles Error:', bError);
  } else {
    const malformed = bottles.filter(b => {
      if (!Array.isArray(b.target_gender)) return true;
      return b.target_gender.some(g => typeof g !== 'string' || g.includes(':') || g.includes('{'));
    });

    console.log('Malformed bottles found:', malformed.length);
    if (malformed.length > 0) {
      console.log('Sample IDs:', malformed.slice(0, 5).map(m => m.id));
      
      // Proactively clean them up if they are old or just for testing
      // Actually, let's just mark them for now or delete if they are our recent tests
      const idsToDelete = malformed.map(m => m.id);
      console.log('Cleaning up malformed bottles...');
      const { error: delError } = await supabase
        .from('sent_bottles')
        .delete()
        .in('id', idsToDelete);
      
      if (delError) console.error('Delete Error:', delError);
      else console.log('Successfully deleted malformed bottles.');
    }
  }
}

checkAndClean();
