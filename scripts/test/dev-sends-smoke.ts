async function main() {
  const base = process.env.DEV_BASE || 'http://localhost:3002';
  console.log('Testing dev endpoints on', base);
  const cookiePath = '/tmp/dev-cookies.txt';
  const fs = await import('fs');
  let cookieHeader: string | undefined = undefined;
  try {
    if (fs.existsSync(cookiePath)) {
      const raw = fs.readFileSync(cookiePath, 'utf8');
      const allLines = raw.split(/\r?\n/).filter(Boolean);
      const normalized: string[] = [];
      for (let l of allLines) {
        // curl writes HttpOnly cookies with a leading '#HttpOnly_' marker.
        // Accept those by stripping the leading '#' so the parser can read them.
        if (l.startsWith('#HttpOnly_')) {
          l = l.replace(/^#/, '');
        }
        // skip comment lines
        if (l.startsWith('#')) continue;
        normalized.push(l);
      }

      const parts: string[] = [];
      for (const line of normalized) {
        const cols = line.split(/\s+/);
        // Netscape cookie format: domain, flag, path, secure, expiration, name, value
        if (cols.length >= 7) {
          const name = cols[cols.length - 2];
          const value = cols[cols.length - 1];
          parts.push(`${name}=${decodeURIComponent(value)}`);
        }
      }
      if (parts.length) cookieHeader = parts.join('; ');
    }
  } catch (e) {}

  const headers = cookieHeader ? { 'cookie': cookieHeader } : undefined;

  try {
    const fx = await fetch(`${base}/api/dev/fixtures`, { headers });
    if (!fx.ok) throw new Error(`fixtures failed: ${fx.status}`);
    const j = await fx.json();
    console.log('fixtures:', Object.keys(j).join(', '), 'leads:', (j.leads || []).length);

    const lead = (j.leads && j.leads[0]) || { email: 'dev@example.com', phone: '+15550000000' };

    const emailResp = await fetch(`${base}/api/email/send`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}),
      body: JSON.stringify({ to: lead.email, subject: 'Smoke test', body: 'hello' }),
    });
    console.log('email send status', emailResp.status);
    let emailJson;
    try { emailJson = await emailResp.json(); } catch (e) { emailJson = { error: 'non-json response' }; }
    console.log('email send response', emailJson);

    // record the send to dev store
    const rec = await fetch(`${base}/api/dev/sends`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}),
      body: JSON.stringify({ type: 'email', to: lead.email, result: emailJson }),
    });
    let recJson;
    try { recJson = await rec.json(); } catch (e) { recJson = { error: 'non-json' }; }
    console.log('record send status', rec.status, recJson);

  const gets = await fetch(`${base}/api/dev/sends`, { headers });
  let getsJson;
  try { getsJson = await gets.json(); } catch (e) { getsJson = { error: 'non-json' }; }
  console.log('dev sends GET', gets.status, getsJson);

    // test SMS
    const smsResp = await fetch(`${base}/api/sms/send`, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}),
      body: JSON.stringify({ to: lead.phone, message: 'Smoke SMS' }),
    });
    let smsJson;
    try { smsJson = await smsResp.json(); } catch (e) { smsJson = { error: 'non-json' }; }
    console.log('sms status', smsResp.status, smsJson);

    console.log('smoke finished');
  } catch (e) {
    console.error('smoke failed', e);
    process.exitCode = 2;
  }
}

main();
