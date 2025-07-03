
'use client'

import * as React from 'react';
import { GitBranch } from 'lucide-react';

type Branch = { id: string; name: string; from: string; merged: boolean };
type Commit = { id: string; branch: string; message: string };

type Node = {
  id: string;
  x: number;
  y: number;
  branch: string;
  isMergeCommit: boolean;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  isMerge: boolean;
};

type BranchGraphProps = {
  branches: Branch[];
  commits: Commit[];
  activeBranch: string;
};

const BranchGraph: React.FC<BranchGraphProps> = ({ branches, commits, activeBranch }) => {
  const { nodes, edges, branchLabels } = React.useMemo(() => {
    const branchOrder = ['main', ...branches.filter(b => b.name !== 'main').map(b => b.name)];
    const branchY = new Map<string, number>();
    branchOrder.forEach((name, i) => branchY.set(name, (i * 40) + 20));

    const commitNodes: Node[] = [];
    const commitEdges: Edge[] = [];
    const commitMap = new Map<string, Node>();
    const branchHeads = new Map<string, string>();
    const finalLabels: { name: string; x: number; y: number }[] = [];

    const reversedCommits = [...commits].reverse();
    let xOffset = 30;

    reversedCommits.forEach((commit) => {
      const y = branchY.get(commit.branch) || 0;
      const isMergeCommit = commit.message.startsWith('merge:');
      
      const newNode: Node = { id: commit.id, x: xOffset, y, branch: commit.branch, isMergeCommit };
      commitNodes.push(newNode);
      commitMap.set(commit.id, newNode);

      const parentId = branchHeads.get(commit.branch);
      if (parentId) {
        commitEdges.push({ id: `${parentId}-${commit.id}`, source: parentId, target: commit.id, isMerge: false });
      }

      const branchInfo = branches.find(b => b.name === commit.branch);
      if (branchInfo && branchInfo.from && commit.message.includes(`Create branch '${commit.branch}'`)) {
        const fromBranchHead = branchHeads.get(branchInfo.from);
        if (fromBranchHead) {
          commitEdges.push({ id: `${fromBranchHead}-${commit.id}`, source: fromBranchHead, target: commit.id, isMerge: false });
        }
      }

      if (isMergeCommit) {
        const mergeSourceBranch = commit.message.split("'")[1];
        const sourceBranchHead = branchHeads.get(mergeSourceBranch);
        if (sourceBranchHead) {
          commitEdges.push({ id: `${sourceBranchHead}-${commit.id}`, source: sourceBranchHead, target: commit.id, isMerge: true });
        }
      }

      branchHeads.set(commit.branch, commit.id);
      xOffset += 50;
    });

    branches.forEach(branch => {
        const headCommitId = branchHeads.get(branch.name);
        if (headCommitId) {
            const headNode = commitMap.get(headCommitId);
            if(headNode) {
                 finalLabels.push({ name: branch.name, x: headNode.x + 15, y: headNode.y + 4 });
            }
        }
    })

    return { nodes: commitNodes, edges: commitEdges, branchLabels: finalLabels };
  }, [branches, commits]);

  const width = Math.max(400, (commits.length * 50) + 150);
  const height = branches.length * 40 + 20;

  const branchColors = [
    '#3b82f6', // blue-500
    '#22c55e', // green-500
    '#f97316', // orange-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#6366f1', // indigo-500
  ];
  
  const getBranchColor = (branchName: string) => {
    const index = branches.findIndex(b => b.name === branchName);
    return branchColors[index % branchColors.length];
  }

  return (
    <div className="w-full overflow-x-auto bg-muted/30 p-4 rounded-lg">
      <svg width={width} height={height} className="min-w-full">
        {edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;
          
          const color = getBranchColor(sourceNode.branch);
          const pathD = `M ${sourceNode.x} ${sourceNode.y} C ${sourceNode.x + 25} ${sourceNode.y}, ${targetNode.x - 25} ${targetNode.y}, ${targetNode.x} ${targetNode.y}`;

          return <path key={edge.id} d={pathD} stroke={color} strokeWidth="2" fill="none" />;
        })}

        {nodes.map(node => (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
             <circle 
                cx="0" 
                cy="0" 
                r="6" 
                fill={getBranchColor(node.branch)} 
                stroke={node.branch === activeBranch ? 'hsl(var(--primary))' : 'hsl(var(--background))'}
                strokeWidth="3"
             />
             {node.isMergeCommit && <circle cx="0" cy="0" r="9" stroke={getBranchColor(node.branch)} strokeWidth="2" fill="none" />}
          </g>
        ))}

        {branchLabels.map(label => (
            <text key={label.name} x={label.x} y={label.y} fill="hsl(var(--foreground))" fontSize="12" className="font-semibold">
                <GitBranch className="inline h-3 w-3 mr-1" style={{color: getBranchColor(label.name)}} />
                {label.name}
            </text>
        ))}

      </svg>
    </div>
  );
};

export default BranchGraph;
