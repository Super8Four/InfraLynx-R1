
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
  mergeActiveBranch: () => void
  updateFromMain: () => void
}

const initialBranches: Branch[] = [
  { id: "main", name: "main", from: "", merged: false },
]

const initialCommits: Commit[] = [
  { id: 'c2', message: "Add core networking devices", branch: "main", author: "admin", timestamp: "2 days ago" },
  { id: 'c1', message: "Initial commit", branch: "system", timestamp: "3 days ago" },
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
    const newCommit: Commit = {
        id: `c${Date.now() + Math.random()}`,
        message: `feat: Create branch '${name}' from '${fromBranch}'`,
        branch: name,
        author: 'admin',
        timestamp: 'Just now'
    }

    setBranches(prev => [...prev, newBranch]);
    setCommits(prev => [newCommit, ...prev]);
    setActiveBranch(newBranch.name);
    toast({ title: "Branch Created", description: `Switched to new branch: ${name}` });
    return true; // Indicate success
  }

  const mergeActiveBranch = () => {
    const currentBranch = branches.find(b => b.id === activeBranch);
    if (!currentBranch || currentBranch.name === 'main' || currentBranch.merged) return;

    // Simulate work being done on the feature branch. These are added as if they happened before the merge.
    const simulatedWork: Omit<Commit, 'id' | 'timestamp'>[] = [
      {
        message: `feat: Add new DC site in Dublin`,
        branch: currentBranch.name,
        author: 'admin',
      },
      {
        message: `fix: Update firewall rules for new site`,
        branch: currentBranch.name,
        author: 'admin',
      },
    ];

    const baseTimestamp = Date.now();
    
    // Create new commits for the feature branch. Newest first.
    const featureCommits: Commit[] = simulatedWork.reverse().map((work, index) => ({
      ...work,
      id: `c${baseTimestamp + index}`,
      timestamp: 'Just now'
    }));

    // Find the original creation commit to keep it in history.
    const creationCommit = commits.find(c => c.message.includes(`Create branch '${currentBranch.name}'`));
    
    // Create the merge commit, which is the newest of all.
    const mergeCommit: Commit = {
      id: `c${baseTimestamp + simulatedWork.length}`,
      message: `merge: Merge branch '${currentBranch.name}' into '${currentBranch.from}'`,
      branch: currentBranch.from,
      author: 'admin',
      timestamp: 'Just now'
    };

    // Prepend all new commits to the history (newest first).
    // Ensure the creation commit is not lost if it was part of the recent slice.
    const otherCommits = commits.filter(c => c.id !== creationCommit?.id);
    
    let allNewCommits = [mergeCommit, ...featureCommits];
    if (creationCommit) {
      allNewCommits.push(creationCommit);
    }

    setCommits(prev => [mergeCommit, ...featureCommits, ...prev]);

    // Mark branch as merged and switch to parent branch.
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
