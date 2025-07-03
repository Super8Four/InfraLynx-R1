
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

const generateCommitId = () => Math.random().toString(16).slice(2, 9);

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

  const createBranch = (name: string, fromBranch: string): boolean => {
    if (branches.some(b => b.name === name)) {
      return false;
    }

    const newBranch: Branch = {
      id: name,
      name: name,
      from: fromBranch,
      merged: false,
    }
    const creationCommit: Commit = {
        id: generateCommitId(),
        message: `feat: Create branch '${name}' from '${fromBranch}'`,
        branch: name,
        author: 'admin',
        timestamp: 'Just now'
    }

    setBranches(prev => [...prev, newBranch]);
    // In a real implementation, you might snapshot data here.
    // For now, we just create the branch and a commit log for it.
    setCommits(prev => [creationCommit, ...prev]);
    setActiveBranch(newBranch.name);
    toast({ title: "Branch Created", description: `Switched to new branch: ${name}` });
    return true;
  }

  const mergeActiveBranch = (mergeMessage?: string) => {
    const currentBranch = branches.find(b => b.id === activeBranch);
    if (!currentBranch || currentBranch.name === 'main' || currentBranch.merged) return;

    const branchCommits = commits.filter(c => c.branch === currentBranch.name);
    
    const commitSummaries = branchCommits.length > 0 
      ? branchCommits.map(c => `- ${c.message}`).reverse().join('\n')
      : 'No new commits on this branch.';

    const mergeCommit: Commit = {
      id: generateCommitId(),
      message: `merge: ${mergeMessage?.trim() || `Merge branch '${currentBranch.name}'`}`,
      body: `This would trigger server actions to persist changes to the database.\n\nChanges:\n${commitSummaries}`,
      branch: currentBranch.from,
      author: 'admin',
      timestamp: 'Just now'
    };

    setCommits(prev => [mergeCommit, ...prev]);
    setBranches(prev => prev.map(b => b.id === activeBranch ? { ...b, merged: true } : b));
    setActiveBranch(currentBranch.from);
    toast({ title: "Merge Successful", description: `Branch '${currentBranch.name}' merged into '${currentBranch.from}'. In a real app, data would now be persisted.`})
  }

  const updateFromMain = () => {
    const currentBranch = branches.find(b => b.id === activeBranch);
    if (!currentBranch || currentBranch.name === 'main' || currentBranch.merged) {
      toast({ title: "Action Not Allowed", description: "Cannot update this branch from main.", variant: "destructive" });
      return;
    }

    const mergeCommit: Commit = {
      id: generateCommitId(),
      message: `merge: Merge branch 'main' into '${currentBranch.name}'`,
      body: `Pulled latest updates from main branch.`,
      branch: currentBranch.name,
      author: 'admin',
      timestamp: 'Just now'
    };
    
    setCommits(prev => [mergeCommit, ...prev]);
    toast({ title: "Branch Updated", description: `Latest changes from 'main' have been merged into '${currentBranch.name}'.`});
  }

  // This is a placeholder for adding commits when actions happen on a branch
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
