import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  onSnapshot,
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export interface JobStep {
  name: string;
  status: 'pending' | 'running' | 'done' | 'error';
  result?: string;
  error?: string;
  timestamp: number;
}

export interface Job {
  id: string;
  ownerUid: string;
  type: 'site_generation' | 'ad_campaign' | 'seo_audit' | 'site_refiner';
  status: 'queued' | 'running' | 'done' | 'error';
  plan: {
    flowId: string;
    steps: string[];
    params: Record<string, any>;
  };
  steps: JobStep[];
  result?: Record<string, any>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const JOBS_COLLECTION = 'jobs';

let hasWarnedMissingDb = false;
const getDb = () => {
  if (!db) {
    if (!hasWarnedMissingDb) {
      console.warn('[jobs] Client Firestore is not configured.');
      hasWarnedMissingDb = true;
    }
    return null;
  }
  return db;
};

export const createJob = async (ownerUid: string, type: Job['type'], params: any) => {
  const firestore = getDb();
  if (!firestore) return null;
  let planSteps = ['init'];
  if (type === 'site_generation') {
    planSteps = ['renderBlocks', 'seoGenerate', 'adsGenerate', 'deploy'];
  } else if (type === 'ad_campaign') {
    planSteps = ['analyzeContent', 'generateKeywords', 'createHeadlines', 'budgetOptimization'];
  } else if (type === 'site_refiner') {
    planSteps = ['analyzeStructure', 'applyRefinements', 'finalReview'];
  }

  const jobData = {
    ownerUid,
    type,
    status: 'queued',
    plan: {
      flowId: `\${type}-flow`,
      steps: planSteps,
      params
    },
    steps: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(firestore, JOBS_COLLECTION), jobData);
  return { id: docRef.id, ...jobData };
};

export const getJobs = async (ownerUid: string) => {
  try {
    const firestore = getDb();
    if (!firestore) return [];
    const q = query(
      collection(firestore, JOBS_COLLECTION),
      where('ownerUid', '==', ownerUid),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Job[];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export const subscribeToJobs = (ownerUid: string, callback: (jobs: Job[]) => void) => {
  const firestore = getDb();
  if (!firestore) return () => {};
  const q = query(
    collection(firestore, JOBS_COLLECTION),
    where('ownerUid', '==', ownerUid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Job[];
    callback(jobs);
  });
};

export const processJob = async (jobId: string) => {
  console.log(`Processing job \${jobId}...`);
  
  try {
    const firestore = getDb();
    if (!firestore) return;
    const jobRef = doc(firestore, JOBS_COLLECTION, jobId);
    
    await updateDoc(jobRef, { 
      status: 'running',
      updatedAt: serverTimestamp() 
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await updateDoc(jobRef, {
      steps: [{
        name: 'init',
        status: 'done',
        result: 'System initialized',
        timestamp: Date.now()
      }],
      updatedAt: serverTimestamp()
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    await updateDoc(jobRef, { 
      status: 'done', 
      updatedAt: serverTimestamp() 
    });

  } catch (error) {
    console.error("Error processing job:", error);
    const firestore = getDb();
    if (!firestore) return;
    const jobRef = doc(firestore, JOBS_COLLECTION, jobId);
    await updateDoc(jobRef, { status: 'error', updatedAt: serverTimestamp() });
  }
};
