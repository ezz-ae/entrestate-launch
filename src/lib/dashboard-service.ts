import { collection, getDocs, query, where, getCountFromServer } from 'firebase/firestore';
import { getDbSafe } from '@/lib/firebase/client';

let hasWarnedMissingDb = false;
const getDb = () => {
    const firestore = getDbSafe();
    if (!firestore) {
        if (!hasWarnedMissingDb) {
            console.warn('[dashboard] Client Firestore is not configured.');
            hasWarnedMissingDb = true;
        }
        return null;
    }
    return firestore;
};

export async function getDashboardStats(ownerUid?: string) {
    let totalProjects = 0;
    let userSitesCount = 0;

    try {
        const firestore = getDb();
        if (!firestore) {
            return {
                totalProjects,
                userSites: userSitesCount,
                newLeads: 0,
                systemHealth: "100%",
                aiEfficiency: "94%"
            };
        }
        const countSnapshot = await getCountFromServer(collection(firestore, 'inventory_projects'));
        totalProjects = countSnapshot.data().count;
    } catch (error) {
        console.error('Failed to count inventory projects:', error);
    }

    if (ownerUid) {
        try {
            const firestore = getDb();
            if (!firestore) {
                return {
                    totalProjects,
                    userSites: userSitesCount,
                    newLeads: 0,
                    systemHealth: "100%",
                    aiEfficiency: "94%"
                };
            }
            const sitesQuery = query(collection(firestore, 'sites'), where('ownerUid', '==', ownerUid));
            const sitesSnap = await getDocs(sitesQuery);
            userSitesCount = sitesSnap.size;
        } catch (e) {
            console.error("Error fetching dashboard stats:", e);
        }
    }

    return {
        totalProjects,
        userSites: userSitesCount,
        newLeads: 0,
        systemHealth: "100%",
        aiEfficiency: "94%"
    };
}
