(async function main(){
  const base = process.env.DEV_BASE_URL || 'http://localhost:3002';
  console.log('Running dev jobs retry smoke test against', base);

  function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

  try {
    // Create a job
    console.log('Creating job...');
    const createRes = await fetch(`${base}/api/dev/jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'cli-test', name: 'smoke-job' }) });
    const createJson = await createRes.json().catch(() => null);
    if (!createRes.ok || !createJson?.job) {
      console.error('Failed to create job', createRes.status, createJson);
      process.exit(2);
    }
    const jobId = createJson.job.id;
    console.log('Created job', jobId);

    // Poll until job finishes (succeeded/failed) or timeout
    const waitFor = async (id: string, timeout = 30000) => {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        const res = await fetch(`${base}/api/dev/jobs`);
        if (!res.ok) { await sleep(500); continue; }
        const j = await res.json().catch(() => null);
        const job = (j?.recentJobs || []).find((x: any) => x.id === id);
        if (job && ['succeeded','failed','cancelled'].includes(job.status)) return job;
        await sleep(700);
      }
      return null;
    };

    console.log('Waiting for job to finish...');
    const finished = await waitFor(jobId, 25000);
    if (!finished) { console.error('Job did not finish in time'); process.exit(3); }
    console.log('Job finished with status', finished.status);

    // Request retry
    console.log('Requesting retry...');
    const retryRes = await fetch(`${base}/api/dev/jobs/${encodeURIComponent(jobId)}/retry`, { method: 'POST' });
    const retryJson = await retryRes.json().catch(() => null);
    if (!retryRes.ok || !retryJson?.job) { console.error('Retry failed', retryRes.status, retryJson); process.exit(4); }
    const newJobId = retryJson.job.id;
    console.log('Retry created job', newJobId);

    // Check original job logs contain requeue entry
    console.log('Fetching original job logs...');
    const logsRes = await fetch(`${base}/api/dev/jobs/${encodeURIComponent(jobId)}/logs`);
    const logsJson = await logsRes.json().catch(() => null);
    if (!logsRes.ok || !Array.isArray(logsJson?.logs)) { console.error('Failed to fetch logs', logsRes.status, logsJson); process.exit(5); }
    const found = logsJson.logs.some((l: any) => String(l.message).includes('requeued') || String(l.message).includes('requeue'));
    if (!found) { console.error('Requeue log entry not found in original job logs', logsJson.logs); process.exit(6); }
    console.log('Original job logs include requeue entry');

    // Wait for new job to finish
    console.log('Waiting for retry job to finish...');
    const newFinished = await waitFor(newJobId, 25000);
    if (!newFinished) { console.error('Retry job did not finish in time'); process.exit(7); }
    console.log('Retry job finished with status', newFinished.status);

    console.log('Dev jobs retry smoke test passed');
    process.exit(0);
  } catch (e) {
    console.error('Unexpected error', e);
    process.exit(99);
  }
})();
