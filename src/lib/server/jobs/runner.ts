import { markJobDone, markJobFailed } from '@/lib/server/jobs/queue';
import { processProvisionWorkspace } from '@/lib/server/jobs/processors/provisionWorkspace';
import { processBuildPreview } from '@/lib/server/jobs/processors/buildPreview';
import { processPublishSubdomain } from '@/lib/server/jobs/processors/publishSubdomain';
import { processConnectDomain } from '@/lib/server/jobs/processors/connectDomain';
import { processExtractBrochure } from '@/lib/server/jobs/processors/extractBrochure';
import { processGenerateLanding } from '@/lib/server/jobs/processors/generateLanding';
import { processApplyEditBatch } from '@/lib/server/jobs/processors/applyEditBatch';
import { processSendDelivery } from '@/lib/server/jobs/processors/sendDelivery';

export async function processJob(job: any) {
  try {
    let result: unknown;

    switch (job.type) {
      case 'provision_workspace':
        result = await processProvisionWorkspace(job);
        break;
      case 'build_preview':
        result = await processBuildPreview(job);
        break;
      case 'publish_subdomain':
        result = await processPublishSubdomain(job);
        break;
      case 'connect_domain':
        result = await processConnectDomain(job);
        break;
      case 'extract_brochure':
        result = await processExtractBrochure(job);
        break;
      case 'generate_landing':
      case 'generate_landing_from_brochure':
        result = await processGenerateLanding(job);
        break;
      case 'apply_edit_batch':
        result = await processApplyEditBatch(job);
        break;
      case 'send_delivery':
        result = await processSendDelivery(job);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }

    await markJobDone(job.id, result as any);
    return { jobId: job.id, status: 'done' as const };
  } catch (error) {
    await markJobFailed(job.id, error);
    return { jobId: job.id, status: 'failed' as const, error: String(error) };
  }
}
