export function useEntitlements() {
  // Mock entitlements for now
  return {
    entitlements: {
      planName: 'Pro Plan',
      features: {
        inventoryAccess: {
          allowed: true,
          reason: ''
        },
        builderPublish: {
          allowed: true,
          reason: ''
        },
        senders: {
          allowed: true,
          reason: ''
        }
      }
    },
    loading: false
  };
}