
'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast"

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

type BranchingContextType = {
  branches: Branch[]
  commits: Commit[]
  activeBranch: string
  setActiveBranch: (branchId: string) => void
  createBranch: (name: string, fromBranch: string) => boolean
  mergeActiveBranch: (mergeMessage?: string) => void
  updateFromMain: () => void
}

const initialBranches: Branch[] = [
  { id: "main", name: "main", from: "", merged: false },
]

const initialCommits: Commit[] = [
  { id: 'c1', message: "Initial commit", branch: "system", author: "system", timestamp: "3 days ago", body: "System initialization." },
  { id: 'c2', message: "Add core networking devices", branch: "main", author: "admin", timestamp: "2 days ago", body: "- Added core-sw-01\n- Added edge-router-01" },
].reverse() // Newest first

const BranchingContext = createContext<BranchingContextType | undefined>(undefined);

export const BranchingProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast()
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [commits, setCommits] = useState<Commit[]>(initialCommits)
  const [activeBranch, setActiveBranch] = useState<string>("main")

  const createBranch = (name: string, fromBranch: string): boolean => {
    if (branches.some(b => b.name === name)) {
      return false; // Indicate failure
    }

    const newBranch: Branch = {
      id: name,
      name: name,
      from: fromBranch,
      merged: false,
    }
    const baseTimestamp = Date.now();
    const creationCommit: Commit = {
        id: `c${baseTimestamp}`,
        message: `feat: Create branch '${name}' from '${fromBranch}'`,
        branch: name,
        author: 'admin',
        timestamp: 'Just now'
    }

    const workCommits: Commit[] = [
      {
        id: `c${baseTimestamp + 2}`,
        message: `feat: Add new DC site in Dublin`,
        branch: name,
        author: 'admin',
        timestamp: 'Just now',
        body: 'Added a new Site object for the Dublin, Ireland location. Set status to "planned".'
      },
      {
        id: `c${baseTimestamp + 1}`,
        message: `fix: Update firewall rules for new site`,
        branch: name,
        author: 'admin',
        timestamp: 'Just now',
        body: 'Modified device "firewall-corp" to allow traffic to the new Dublin subnets.'
      },
    ];

    setBranches(prev => [...prev, newBranch]);
    setCommits(prev => [ ...workCommits, creationCommit, ...prev]);
    setActiveBranch(newBranch.name);
    toast({ title: "Branch Created", description: `Switched to new branch: ${name}` });
    return true; // Indicate success
  }

  const mergeActiveBranch = (mergeMessage?: string) => {
    const currentBranch = branches.find(b => b.id === activeBranch);
    if (!currentBranch || currentBranch.name === 'main' || currentBranch.merged) return;

    // This is a simplification; a real implementation would be more complex.
    const branchCommits = commits.filter(c => c.branch === currentBranch.name);
    
    const commitSummaries = branchCommits.length > 0 
      ? branchCommits.map(c => `- ${c.message}`).reverse().join('\n')
      : 'No new commits on this branch.';

    const mergeCommit: Commit = {
      id: `c${Date.now() + Math.random()}`,
      message: mergeMessage?.trim() || `Merge branch '${currentBranch.name}'`,
      body: commitSummaries,
      branch: currentBranch.from,
      author: 'admin',
      timestamp: 'Just now'
    };

    setCommits(prev => [mergeCommit, ...prev]);
    setBranches(prev => prev.map(b => b.id === activeBranch ? { ...b, merged: true } : b));
    setActiveBranch(currentBranch.from);
    toast({ title: "Merge Successful", description: `Branch '${currentBranch.name}' has been merged into '${currentBranch.from}'.`})
  }

  const updateFromMain = () => {
    const currentBranch = branches.find(b => b.id === activeBranch);
    if (!currentBranch || currentBranch.name === 'main' || currentBranch.merged) {
      toast({ title: "Action Not Allowed", description: "Cannot update this branch from main.", variant: "destructive" });
      return;
    }

    const mergeCommit: Commit = {
      id: `c${Date.now() + Math.random()}`,
      message: `merge: Merge branch 'main' into '${currentBranch.name}'`,
      body: `Pulled latest updates from main branch.`,
      branch: currentBranch.name, // The commit is ON the feature branch
      author: 'admin',
      timestamp: 'Just now'
    };
    
    setCommits(prev => [mergeCommit, ...prev]);
    toast({ title: "Branch Updated", description: `Latest changes from 'main' have been merged into '${currentBranch.name}'.`});
  }

  return (
    <BranchingContext.Provider value={{ branches, commits, activeBranch, setActiveBranch, createBranch, mergeActiveBranch, updateFromMain }}>
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

    