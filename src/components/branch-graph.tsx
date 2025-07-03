
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
  orientation?: 'horizontal' | 'vertical';
};

const BranchGraph: React.FC<BranchGraphProps> = ({ branches, commits, activeBranch, orientation = 'horizontal' }) => {
  const { nodes, edges, branchLabels, width, height } = React.useMemo(() => {
    const isHorizontal = orientation === 'horizontal';
    
    const branchOrder = ['main', ...branches.filter(b => b.name !== 'main').map(b => b.name)];
    const branchLane = new Map<string, number>();
    
    if (isHorizontal) {
        branchOrder.forEach((name, i) => branchLane.set(name, (i * 40) + 20)); // y-lanes
    } else {
        branchOrder.forEach((name, i) => branchLane.set(name, (i * 60) + 40)); // x-lanes
    }

    const commitNodes: Node[] = [];
    const commitEdges: Edge[] = [];
    const commitMap = new Map<string, Node>();
    const branchHeads = new Map<string, string>();
    const finalLabels: { name: string; x: number; y: number }[] = [];
    
    const calculatedWidth = isHorizontal ? Math.max(400, (commits.length * 50) + 150) : branches.length * 60 + 100;
    const calculatedHeight = isHorizontal ? branches.length * 40 + 20 : commits.length * 50 + 60;
    
    const reversedCommits = [...commits].reverse();
    // Start from the bottom for vertical, or left for horizontal.
    let mainAxisOffset = isHorizontal ? 30 : calculatedHeight - 60;


    reversedCommits.forEach((commit) => {
        const crossAxisPosition = branchLane.get(commit.branch) || 0;
        const isMergeCommit = commit.message.startsWith('merge:');
        
        const newNode: Node = { 
            id: commit.id, 
            x: isHorizontal ? mainAxisOffset : crossAxisPosition, 
            y: isHorizontal ? crossAxisPosition : mainAxisOffset, 
            branch: commit.branch, 
            isMergeCommit 
        };
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
        
        if (isHorizontal) {
            mainAxisOffset += 50;
        } else {
            mainAxisOffset -= 50; // Go upwards
        }
    });

    branches.forEach(branch => {
        const headCommitId = branchHeads.get(branch.name);
        if (headCommitId) {
            const headNode = commitMap.get(headCommitId);
            if(headNode) {
                 finalLabels.push({ 
                    name: branch.name, 
                    x: headNode.x + (isHorizontal ? 15 : 0), 
                    y: headNode.y + (isHorizontal ? 4 : 25) 
                });
            }
        }
    })

    return { nodes: commitNodes, edges: commitEdges, branchLabels: finalLabels, width: calculatedWidth, height: calculatedHeight };

  }, [branches, commits, orientation]);

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
  
  const getPathD = (sourceNode: Node, targetNode: Node) => {
    const { x: x1, y: y1 } = sourceNode;
    const { x: x2, y: y2 } = targetNode;

    if (orientation === 'horizontal') {
        return `M ${x1} ${y1} C ${x1 + 25} ${y1}, ${x2 - 25} ${y2}, ${x2} ${y2}`;
    }
    
    // For vertical (bottom-up), parent (source) y is > child (target) y.
    if (y1 > y2) {
      return `M ${x1} ${y1} C ${x1} ${y1 - 25}, ${x2} ${y2 + 25}, ${x2} ${y2}`;
    }
    // Fallback for any other case
    return `M ${x1} ${y1} C ${x1} ${y1 + 25}, ${x2} ${y2 - 25}, ${x2} ${y2}`;
  }
  
  const getLabelAnchor = () => orientation === 'horizontal' ? 'start' : 'middle';

  return (
    <div className={orientation === 'horizontal' ? "w-full overflow-x-auto bg-muted/30 p-4 rounded-lg" : "h-full w-full overflow-y-auto bg-muted/30 p-4 rounded-lg"}>
      <svg width={width} height={height} className={orientation === 'horizontal' ? "min-w-full" : "min-h-full"}>
        {edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;
          
          const color = getBranchColor(sourceNode.branch);

          return <path key={edge.id} d={getPathD(sourceNode, targetNode)} stroke={color} strokeWidth="2" fill="none" />;
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
            <text key={label.name} x={label.x} y={label.y} fill="hsl(var(--foreground))" fontSize="12" className="font-semibold" textAnchor={getLabelAnchor()}>
                <GitBranch className="inline h-3 w-3 mr-1" style={{color: getBranchColor(label.name)}} />
                {label.name}
            </text>
        ))}
      </svg>
    </div>
  );
};

export default BranchGraph;
