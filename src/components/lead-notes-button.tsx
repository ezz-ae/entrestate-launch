import React from 'react';

type Props = {
  leadId: string;
  initialNotes?: string | null;
};

// Minimal stub for LeadNotesButton used by leads-table.
// Replace with the full implementation if you have it elsewhere.
export function LeadNotesButton({ leadId, initialNotes }: Props) {
  return (
    <button
      type="button"
      className="px-2 py-1 rounded bg-gray-100 text-sm"
      onClick={() => {
        // noop stub — a real implementation would open an editor/modal
        // kept intentionally minimal so builds succeed.
        // eslint-disable-next-line no-console
        console.log('Open lead notes for', leadId);
      }}
    >
      Notes
    </button>
  );
}

export default LeadNotesButton;
