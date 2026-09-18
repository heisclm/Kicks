const dotenv = require('dotenv');
dotenv.config({ path: 'admin/.env.local' });

async function runTest() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/user_roles';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    },
    body: JSON.stringify({ user_id: '00000000-0000-0000-0000-000000000000', role: 'admin' })
  });
  
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}

runTest();
