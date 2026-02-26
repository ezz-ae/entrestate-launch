export async function getDashboardStats(ownerUid?: string) {
  void ownerUid;
  return {
    totalProjects: 0,
    userSites: 0,
    newLeads: 0,
    systemHealth: "100%",
    aiEfficiency: "94%"
  };
}
