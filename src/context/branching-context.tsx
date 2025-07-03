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
  createBranch: (name: string) => boolean
  mergeActiveBranch: () => void
}

const initialBranches: Branch[] = [
  { id: "main", name: "main", from: "", merged: false },
]

const initialCommits: Commit[] = [
  { id: 'c1', message: "Initial commit", branch: "main", author: "system", timestamp: "3 days ago" },
  { id: 'c2', message: "Add core networking devices", branch: "main", author: "admin", timestamp: "2 days ago" },
]

const BranchingContext = createContext<BranchingContextType | undefined>(undefined);

export const BranchingProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast()
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [commits, setCommits] = useState<Commit[]>(initialCommits)
  const [activeBranch, setActiveBranch] = useState<string>("main")

  const createBranch = (name: string): boolean => {
    if (branches.some(b => b.name === name)) {
      return false; // Indicate failure
    }

    const newBranch: Branch = {
      id: name,
      name: name,
      from: activeBranch,
      merged: false,
    }
    const newCommit: Commit = {
        id: `c${commits.length + 1}`,
        message: `feat: Create branch '${name}' from '${activeBranch}'`,
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
    if (!currentBranch || currentBranch.name === 'main') return;

    const newCommits: Commit[] = [
        {
            id: `c${commits.length + 1}`,
            message: `feat: Add new DC site in Dublin`,
            branch: currentBranch.name,
            author: 'admin',
            timestamp: 'Just now'
        },
        {
            id: `c${commits.length + 2}`,
            message: `fix: Update firewall rules for new site`,
            branch: currentBranch.name,
            author: 'admin',
            timestamp: 'Just now'
        },
        {
            id: `c${commits.length + 3}`,
            message: `merge: Merge branch '${currentBranch.name}' into '${currentBranch.from}'`,
            branch: currentBranch.from,
            author: 'admin',
            timestamp: 'Just now'
        },
    ]

    setBranches(prev => prev.map(b => b.id === activeBranch ? { ...b, merged: true } : b));
    setCommits(prev => [newCommits.slice(0, 2).reverse(), {id: newCommits[2].id, message: newCommits[2].message, branch: newCommits[2].branch, author: newCommits[2].author, timestamp: newCommits[2].timestamp}, ...prev.slice(1)].flat());
    setActiveBranch(currentBranch.from);
    toast({ title: "Merge Successful", description: `Branch '${currentBranch.name}' has been merged into '${currentBranch.from}'.`})
  }

  return (
    <BranchingContext.Provider value={{ branches, commits, activeBranch, setActiveBranch, createBranch, mergeActiveBranch }}>
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
