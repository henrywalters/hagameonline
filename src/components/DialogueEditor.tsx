import { ReactFlow, addEdge, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes = [
  { id: '1', position: { x: 0,   y: 0   }, data: { label: 'Hello' } },
  { id: '2', position: { x: 0,   y: 100 }, data: { label: 'World' } },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2' },
];

export function DialogueEditor() {
    return (
        <div  style={{ width: '640px', height: '480px' }}>
            <ReactFlow nodes={nodes} edges={edges} fitView></ReactFlow>
        </div>
    )
}