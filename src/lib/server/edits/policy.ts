export function canSubmitEditRequest(currentCount: number, maxRequests: number | null) {
  if (maxRequests === null) return true;
  return currentCount < maxRequests;
}
