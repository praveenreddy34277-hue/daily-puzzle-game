(async ()=>{
  try{
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo', password: 'password123' })
    });
    const text = await res.text();
    console.log('status', res.status);
    console.log(text);
  } catch(e){
    console.error('request error', e);
  }
})();
