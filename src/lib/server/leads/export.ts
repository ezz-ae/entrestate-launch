import { listLeadsForOrder } from '@/lib/server/leads/list';

function csvCell(value: unknown) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function exportLeadsCsv(orderId: string) {
  const leads = await listLeadsForOrder(orderId);
  const rows = ['id,name,phone,email,source,status,createdAt'];

  for (const lead of leads) {
    rows.push(
      [
        lead.id,
        lead.name,
        lead.phone,
        lead.email,
        lead.source,
        lead.status,
        lead.createdAt.toISOString(),
      ]
        .map(csvCell)
        .join(','),
    );
  }

  return rows.join('\n');
}
