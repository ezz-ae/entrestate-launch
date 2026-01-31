export function useEntitlements() {
  // Mock entitlements for now
  return {
    entitlements: {
      planName: 'Pro Plan',
      features: {
        inventoryAccess: {
          allowed: true,
          reason: ''
        }
      }
    },
    loading: false
  };
}