
'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast"
import { produce } from 'immer';
import { getInitialBranchingData, applyMerge } from './branching-actions';
import type { Device, Site, DeviceRole, Platform, Location, Rack, Cluster, Tenant, TenantGroup, VirtualChassis, DeviceType } from "@prisma/client"

type Branch = {
  id: string
  name: string
  from: string
  merged: boolean
}

type Commit = {
  id: string
  message: string
  body?: string
  branch: string
  author: string
  timestamp: string
}

export type EnrichedDevice = Device & {
  deviceRole: DeviceRole | null;
  site: Site | null;
  platform: Platform | null;
}

export interface AppState {
    devices: EnrichedDevice[];
    sites: Site[];
    deviceTypes: DeviceType[];
    deviceRoles: DeviceRole[];
    platforms: Platform[];
    locations: Location[];
    racks: Rack[];
    clusters: Cluster[];
    tenants: Tenant[];
    tenantGroups: TenantGroup[];
    virtualChassis: VirtualChassis[];
}

type BranchingContextType = {
  branches: Branch[]
  commits: Commit[]
  activeBranch: string
  isLoaded: boolean
  activeBranchData: AppState | null
  setActiveBranch: (branchId: string) => void
  createBranch: (name: string, fromBranch: string) => boolean
  mergeActiveBranch: (mergeMessage?: string) => Promise<void>
  updateFromMain: () => void
  createDevice: (deviceData: any) => void
  deleteDevice: (deviceId: string) => void
}

const generateCommitId = () => {
    // Generate a more realistic 7-character hex string
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0].toString(16).slice(0, 7);
};

const initialBranches: Branch[] = [
  { id: "main", name: "main", from: "", merged: false },
]

const initialCommits: Commit[] = [
  { id: 'f7c3b1e', message: "chore: Setup initial project structure", branch: 'main', author: 'system', timestamp: '2 days ago', body: 'Added basic pages and components.' },
  { id: 'a4d7e8f', message: "Initial commit", branch: "main", author: "system", timestamp: "3 days ago", body: "System initialization." },
]

const BranchingContext = createContext<BranchingContextType | undefined>(undefined);

export const BranchingProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast()
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [commits, setCommits] = useState<Commit[]>(initialCommits)
  const [activeBranch, setActiveBranch] = useState<string>("main")

  const [branchStates, setBranchStates] = useState<Map<string, AppState>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await getInitialBranchingData();
        setBranchStates(new Map([['main', data]]));
      } catch (error) {
        console.error("Failed to load initial data", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not load data from database." });
      } finally {
        setIsLoaded(true);
      }
    };
    loadInitialData();
  }, [toast]);

  const activeBranchData = useMemo(() => branchStates.get(activeBranch) || null, [branchStates, activeBranch]);

  const addCommit = (message: string, body?: string) => {
      if (activeBranch === 'main') return;

      const newCommit: Commit = {
          id: generateCommitId(),
          message,
          body,
          branch: activeBranch,
          author: 'admin',
          timestamp: 'Just now'
      };
      setCommits(prev => [newCommit, ...prev]);
  }

  const createBranch = (name: string, fromBranch: string): boolean => {
    if (branches.some(b => b.name === name)) {
      return false;
    }

    const fromState = branchStates.get(fromBranch);
    if (!fromState) {
        toast({ variant: 'destructive', title: "Error", description: `Cannot find state for source branch '${fromBranch}'.` });
        return false;
    }
    
    setBranchStates(produce(draft => {
        draft.set(name, JSON.parse(JSON.stringify(fromState))); // Deep clone
    }));

    const newBranch: Branch = {
      id: name,
      name: name,
      from: fromBranch,
      merged: false,
    }
    addCommit(`feat: Create branch '${name}' from '${fromBranch}'`);
    setBranches(prev => [...prev, newBranch]);
    setActiveBranch(newBranch.name);
    toast({ title: "Branch Created", description: `Switched to new branch: ${name}` });
    return true;
  }
  
  const createDevice = (deviceData: any) => {
    if (activeBranch === 'main') {
        toast({ variant: 'destructive', title: "Error", description: "Cannot add devices directly to the main branch. Please create a new branch first.", });
        return;
    }

    const newId = `dev-${Date.now()}`;
    const tags = deviceData.tags ? deviceData.tags.split(",").map((t:string) => t.trim()) : [];
    
    // Find related objects to create an "enriched" device for immediate UI update
    const state = branchStates.get(activeBranch);
    if (!state) return;
    
    const deviceRole = state.deviceRoles.find(dr => dr.id === deviceData.deviceRoleId) || null;
    const site = state.sites.find(s => s.id === deviceData.siteId) || null;
    const platform = state.platforms.find(p => p.id === deviceData.platformId) || null;

    const newDevice: EnrichedDevice = {
      ...deviceData,
      id: newId,
      tags,
      // Default values for fields not in the form but in the model
      configBackup: null,
      deviceRole,
      site,
      platform,
    };
    
    setBranchStates(produce(draft => {
        const branchState = draft.get(activeBranch);
        if (branchState) {
            branchState.devices.push(newDevice);
        }
    }));

    addCommit(`feat(devices): Create device ${newDevice.name}`);
  }

  const deleteDevice = (deviceId: string) => {
     if (activeBranch === 'main') {
        toast({ variant: 'destructive', title: "Error", description: "Cannot delete devices directly from the main branch." });
        return;
    }
    
    let deletedDeviceName = 'unknown device';

    setBranchStates(produce(draft => {
        const branchState = draft.get(activeBranch);
        if (branchState) {
            const deviceIndex = branchState.devices.findIndex(d => d.id === deviceId);
            if (deviceIndex > -1) {
                deletedDeviceName = branchState.devices[deviceIndex].name ?? deletedDeviceName;
                branchState.devices.splice(deviceIndex, 1);
            }
        }
    }));

    addCommit(`fix(devices): Delete device ${deletedDeviceName}`);
  }

  const mergeActiveBranch = async (mergeMessage?: string) => {
    const currentBranch = branches.find(b => b.id === activeBranch);
    if (!currentBranch || currentBranch.name === 'main' || currentBranch.merged) return;

    const dataToMerge = branchStates.get(activeBranch);
    if (!dataToMerge) return;

    toast({ title: "Merging branch...", description: "Please wait while changes are applied to the database." });
    
    const result = await applyMerge(dataToMerge);
    
    if (result.success) {
      const latestMainData = await getInitialBranchingData(); // Re-fetch to ensure consistency
      setBranchStates(produce(draft => {
        draft.set('main', latestMainData);
        draft.delete(activeBranch); // Optionally remove merged branch state
      }));
      setBranches(prev => prev.map(b => b.id === activeBranch ? { ...b, merged: true } : b));
      setActiveBranch(currentBranch.from);

      const mergeCommit: Commit = {
        id: generateCommitId(),
        message: `merge: ${mergeMessage?.trim() || `Merge branch '${currentBranch.name}'`}`,
        body: `Merged changes from ${currentBranch.name} into ${currentBranch.from}.`,
        branch: currentBranch.from,
        author: 'admin',
        timestamp: 'Just now'
      };
      setCommits(prev => [mergeCommit, ...prev]);

      toast({ title: "Merge Successful", description: `Branch '${currentBranch.name}' has been merged and persisted.` })
    } else {
      toast({ title: "Error", description: result.message, variant: 'destructive' })
    }
  }

  const updateFromMain = () => {
    // This is more complex with real state, involves a 3-way merge.
    // For now, it will just show a message.
    toast({ title: "Action Not Supported", description: `Updating a branch from main is not implemented in this demo.` });
  }

  return (
    <BranchingContext.Provider value={{ 
        branches, 
        commits, 
        activeBranch, 
        isLoaded,
        activeBranchData,
        setActiveBranch, 
        createBranch, 
        mergeActiveBranch, 
        updateFromMain,
        createDevice,
        deleteDevice,
    }}>
      {children}
    </BranchingContext.Provider>
  )
}

export const useBranching = () => {
  const context = useContext(BranchingContext);
  if (context === undefined) {
    throw new Error('useBranching must be used within a BranchingProvider');
  }
  return context;
}
