import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Terminal, 
  LayoutDashboard, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Layers, 
  Maximize2, 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Cpu, 
  Database, 
  Server, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  GitBranch
} from 'lucide-react';

interface ProjectUIPreviewProps {
  projectId: string;
}

type TabType = 'preview' | 'architecture' | 'code';

export const ProjectUIPreview: React.FC<ProjectUIPreviewProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Interactive state for preview widgets
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 'TASK-104', title: 'Optimistic UI Updates', status: 'in-progress', tech: 'React 19 / State', assignee: 'Sabin' },
    { id: 'TASK-102', title: 'Google Chat Dispatch', status: 'done', tech: '1P API Webhook', assignee: 'Sabin' },
    { id: 'TASK-105', title: 'Redis Cache Layer', status: 'todo', tech: 'Node / Redis', assignee: 'Sabin' }
  ]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<'checkout' | 'orders' | 'health'>('checkout');
  const [wsActive, setWsActive] = useState(true);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Modern code snippets per project
  const getCodeSnippet = () => {
    if (projectId === 'devtask') {
      return `// React 19 Optimistic State & Google Chat 1P Dispatch Hook
import { useOptimistic, useTransition } from 'react';
import { sendGoogleChatAlert } from '@/services/googleChat';

export function useTaskBoard(initialTasks: Task[]) {
  const [isPending, startTransition] = useTransition();
  const [optimisticTasks, setOptimisticTask] = useOptimistic(
    initialTasks,
    (state, updatedTask: Task) => 
      state.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t)
  );

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    startTransition(async () => {
      // 1. Instantly reflect in optimistic UI
      setOptimisticTask({ id: taskId, status: newStatus });

      // 2. Persist to API & Dispatch 1P Notification
      const res = await fetch(\`/api/v1/tasks/\${taskId}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok && newStatus === 'done') {
        await sendGoogleChatAlert({
          space: 'spaces/eng-sprints',
          text: \`⚡ TASK-\${taskId} completed & validated by Sabin Stan.\`
        });
      }
    });
  };

  return { tasks: optimisticTasks, moveTask, isPending };
}`;
    }

    if (projectId === 'cloudstore') {
      return `// Express REST Controller with PostgreSQL ACID Transaction & Redis Cache
import { Router } from 'express';
import { redisClient } from '@/config/redis';
import { dbPool } from '@/config/database';
import { verifyJWT } from '@/middleware/auth';

export const orderRouter = Router();

orderRouter.post('/checkout', verifyJWT, async (req, res) => {
  const client = await dbPool.connect();
  try {
    // 1. Begin ACID Transaction
    await client.query('BEGIN');

    const { items, totalAmount } = req.body;
    const orderRes = await client.query(
      'INSERT INTO orders (user_id, amount, status) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, totalAmount, 'confirmed']
    );

    const orderId = orderRes.rows[0].id;

    // 2. Update Inventory Locks
    await client.query(
      'UPDATE inventory SET stock = stock - 1 WHERE item_id = ANY($1)',
      [items.map((i: any) => i.id)]
    );

    await client.query('COMMIT');

    // 3. Invalidate Redis Cache Layer
    await redisClient.del(\`user_orders:\${req.user.id}\`);

    return res.status(201).json({
      order_id: \`ord_\${orderId}\`,
      status: 'confirmed',
      db_transaction: 'ACID_COMMITTED',
      latency_ms: 11.8
    });
  } catch (err) {
    await client.query('ROLLBACK');
    return res.status(500).json({ error: 'Transaction rolled back safely' });
  } finally {
    client.release();
  }
});`;
    }

    return `// Node.js WebSocket Live Telemetry Broadcast Server
import { WebSocketServer, WebSocket } from 'ws';
import { getSystemMetrics } from '@/utils/telemetry';

export class TelemetryHub {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.init();
  }

  private init() {
    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      ws.send(JSON.stringify({ event: 'connected', timestamp: Date.now() }));

      ws.on('close', () => this.clients.delete(ws));
    });

    // 100ms High-frequency metric heartbeat engine
    setInterval(async () => {
      if (this.clients.size === 0) return;

      const metrics = await getSystemMetrics();
      const payload = JSON.stringify({
        p95Latency: metrics.p95,
        uptime: '99.98%',
        throughput: '14.8k req/s',
        timestamp: new Date().toISOString()
      });

      for (const client of this.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      }
    }, 100);
  }
}`;
  };

  // Modern architecture diagram representation
  const renderArchitecture = () => {
    if (projectId === 'devtask') {
      return (
        <div className="p-4 bg-zinc-950/90 rounded-xl border border-zinc-800 space-y-4 font-mono text-[11px] text-zinc-300">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-bold border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <span>DevTask System Topology</span>
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              React 19 + 1P Chat API
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 transition-colors">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Client Tier</div>
              <div className="text-zinc-100 font-bold mt-1">React 19 SPA</div>
              <div className="text-[9px] text-indigo-400 mt-0.5">Optimistic State</div>
            </div>
            
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition-colors">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">API Gateway</div>
              <div className="text-zinc-100 font-bold mt-1">Express Node</div>
              <div className="text-[9px] text-purple-400 mt-0.5">REST + Auth JWT</div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 transition-colors">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Persistence</div>
              <div className="text-zinc-100 font-bold mt-1">PostgreSQL 16</div>
              <div className="text-[9px] text-cyan-400 mt-0.5">Relational DB</div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-sky-500/50 transition-colors">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Integrations</div>
              <div className="text-zinc-100 font-bold mt-1">Google Chat</div>
              <div className="text-[9px] text-sky-400 mt-0.5">1P API Webhooks</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>State Flow: Optimistic Local State Update ➔ Async Dispatch ➔ Webhook Verification</span>
            </span>
            <span className="text-emerald-400 font-mono">Verified</span>
          </div>
        </div>
      );
    }

    if (projectId === 'cloudstore') {
      return (
        <div className="p-4 bg-zinc-950/90 rounded-xl border border-zinc-800 space-y-4 font-mono text-[11px] text-zinc-300">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold border-b border-zinc-800 pb-2">
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>CloudStore ACID & Redis Topology</span>
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              High Concurrency
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">HTTP Ingress</div>
              <div className="text-zinc-100 font-bold mt-1">Node.js Express</div>
              <div className="text-[9px] text-cyan-400 mt-0.5">Rate Limited & Auth</div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">L1 In-Memory Cache</div>
              <div className="text-zinc-100 font-bold mt-1">Redis Store</div>
              <div className="text-[9px] text-rose-400 mt-0.5">Sub-5ms Latency</div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="text-[10px] text-zinc-500 uppercase font-bold">Transactional Storage</div>
              <div className="text-zinc-100 font-bold mt-1">PostgreSQL ACID</div>
              <div className="text-[9px] text-emerald-400 mt-0.5">Strict Isolation Level</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Guarantee: Zero double-spend via PostgreSQL row-level locks & Redis mutex</span>
            </span>
            <span className="text-cyan-400 font-mono">11.8ms p95</span>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-zinc-950/90 rounded-xl border border-zinc-800 space-y-4 font-mono text-[11px] text-zinc-300">
        <div className="flex items-center justify-between text-xs text-emerald-400 font-bold border-b border-zinc-800 pb-2">
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>SystemPulse Telemetry Pipeline</span>
          </span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            WebSocket Stream
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Telemetry Agents</div>
            <div className="text-zinc-100 font-bold mt-1">Docker Containers</div>
            <div className="text-[9px] text-emerald-400 mt-0.5">Continuous Monitoring</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Real-time Transport</div>
            <div className="text-zinc-100 font-bold mt-1">WebSocket Gateway</div>
            <div className="text-[9px] text-purple-400 mt-0.5">Bi-directional Engine</div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="text-[10px] text-zinc-500 uppercase font-bold">Visual Dashboard</div>
            <div className="text-zinc-100 font-bold mt-1">React Dashboard</div>
            <div className="text-[9px] text-cyan-400 mt-0.5">Live SVG Waveforms</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Stream Rate: 100ms ticker interval with zero dropping connection auto-reconnect</span>
          </span>
          <span className="text-emerald-400 font-mono">14.8k req/s</span>
        </div>
      </div>
    );
  };

  // Render project-specific interactive preview UI
  const renderPreviewContent = () => {
    if (projectId === 'devtask') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {kanbanTasks.map((t) => (
              <div 
                key={t.id} 
                className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-2 hover:border-zinc-700 transition-all cursor-pointer"
                onClick={() => {
                  setKanbanTasks(prev => prev.map(item => {
                    if (item.id !== t.id) return item;
                    const nextStatus = item.status === 'todo' ? 'in-progress' : item.status === 'in-progress' ? 'done' : 'todo';
                    return { ...item, status: nextStatus };
                  }));
                }}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-zinc-500">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${
                    t.status === 'done' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    t.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {t.status === 'done' ? '✓ Done' : t.status === 'in-progress' ? '⚡ Active' : 'To Do'}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-zinc-100">
                  {t.title}
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center justify-between pt-1 border-t border-zinc-800/60 font-mono">
                  <span>{t.tech}</span>
                  <span className="text-indigo-400">{t.assignee}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between bg-zinc-950 p-2 rounded-lg border border-zinc-900">
            <span className="text-zinc-400">💡 Click any card above to toggle task status & trigger optimistic state engine</span>
            <span className="text-indigo-400 font-semibold">Interactive Board</span>
          </div>
        </div>
      );
    }

    if (projectId === 'cloudstore') {
      return (
        <div className="space-y-3 font-mono text-[11px]">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <button
              onClick={() => setSelectedEndpoint('checkout')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                selectedEndpoint === 'checkout' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              POST /checkout
            </button>
            <button
              onClick={() => setSelectedEndpoint('orders')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                selectedEndpoint === 'orders' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              GET /orders
            </button>
            <button
              onClick={() => setSelectedEndpoint('health')}
              className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                selectedEndpoint === 'health' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              GET /health
            </button>
          </div>

          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span className="text-cyan-400 font-bold">
                {selectedEndpoint === 'checkout' ? 'POST /api/v1/orders/checkout' : selectedEndpoint === 'orders' ? 'GET /api/v1/orders?limit=10' : 'GET /healthz'}
              </span>
              <span className="text-emerald-400 font-bold">
                {selectedEndpoint === 'checkout' ? '201 Created (11.8ms)' : selectedEndpoint === 'orders' ? '200 OK (3.2ms)' : '200 Healthy (0.9ms)'}
              </span>
            </div>

            <pre className="text-[11px] leading-relaxed text-zinc-300 overflow-x-auto p-2 rounded bg-zinc-900/80">
              <code>
                {selectedEndpoint === 'checkout' ? (
                  <>
                    <span className="text-zinc-500">&#123;</span>{'\n'}
                    {'  '}<span className="text-zinc-400">"order_id"</span>: <span className="text-emerald-400">"ord_84920"</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">"status"</span>: <span className="text-amber-300">"confirmed"</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">"db_transaction"</span>: <span className="text-cyan-400">"ACID_COMMITTED"</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">"redis_cache"</span>: <span className="text-purple-400">"PURGED"</span>{'\n'}
                    <span className="text-zinc-500">&#125;</span>
                  </>
                ) : selectedEndpoint === 'orders' ? (
                  <>
                    <span className="text-zinc-500">&#123;</span>{'\n'}
                    {'  '}<span className="text-zinc-400">"cached"</span>: <span className="text-emerald-400">true</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">"total_records"</span>: <span className="text-amber-300">42</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">"ttl_remaining"</span>: <span className="text-cyan-400">"298s"</span>{'\n'}
                    <span className="text-zinc-500">&#125;</span>
                  </>
                ) : (
                  <>
                    <span className="text-zinc-500">&#123;</span>{'\n'}
                    {'  '}<span className="text-zinc-400">"uptime_seconds"</span>: <span className="text-emerald-400">948210</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">"postgres"</span>: <span className="text-emerald-400">"CONNECTED"</span>,{'\n'}
                    {'  '}<span className="text-zinc-400">"redis"</span>: <span className="text-emerald-400">"CONNECTED"</span>{'\n'}
                    <span className="text-zinc-500">&#125;</span>
                  </>
                )}
              </code>
            </pre>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="text-[9px] text-zinc-500 uppercase font-mono">p95 Latency</div>
            <div className="text-xs font-bold text-white font-mono mt-0.5">12.4 ms</div>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="text-[9px] text-zinc-500 uppercase font-mono">Uptime</div>
            <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">99.98%</div>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
            <div className="text-[9px] text-zinc-500 uppercase font-mono">Throughput</div>
            <div className="text-xs font-bold text-cyan-400 font-mono mt-0.5">14.8k req/s</div>
          </div>
        </div>

        <div className="h-12 w-full relative bg-zinc-950 p-1.5 rounded-lg border border-zinc-900 overflow-hidden">
          <svg viewBox="0 0 280 40" className="w-full h-full">
            <defs>
              <linearGradient id={`grad-${projectId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,28 Q35,20 70,24 T140,12 T210,18 T280,10 L280,40 L0,40 Z"
              fill={`url(#grad-${projectId})`}
            />
            <path
              d="M0,28 Q35,20 70,24 T140,12 T210,18 T280,10"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="280" cy="10" r="3" fill="#10b981" className="animate-pulse" />
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono bg-zinc-950 p-2 rounded-lg border border-zinc-900">
          <button 
            onClick={() => setWsActive(!wsActive)}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 cursor-pointer"
          >
            <span className={`w-2 h-2 rounded-full ${wsActive ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
            <span>WebSocket {wsActive ? 'Connected (100ms Ticker)' : 'Paused'}</span>
          </button>
          <span className="text-zinc-500">4 Docker Nodes</span>
        </div>
      </div>
    );
  };

  const getHeaderIcon = () => {
    if (projectId === 'devtask') return <LayoutDashboard className="w-4 h-4 text-indigo-400" />;
    if (projectId === 'cloudstore') return <Terminal className="w-4 h-4 text-cyan-400" />;
    return <Activity className="w-4 h-4 text-emerald-400" />;
  };

  const getHeaderTitle = () => {
    if (projectId === 'devtask') return 'DevTask · Interactive Board';
    if (projectId === 'cloudstore') return 'CloudStore · REST API Terminal';
    return 'SystemPulse · Real-time Telemetry';
  };

  return (
    <>
      {/* INLINE CARD PREVIEW */}
      <div className="w-full rounded-xl overflow-hidden border border-zinc-200/90 dark:border-zinc-800 bg-zinc-950 text-zinc-100 font-sans text-xs select-none shadow-md transition-all hover:border-zinc-700/80">
        
        {/* Sleek Glassmorphism Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/80 text-[11px]">
          
          <div className="flex items-center gap-2 font-semibold text-zinc-200">
            {getHeaderIcon()}
            <span className="truncate max-w-[140px] sm:max-w-none">{getHeaderTitle()}</span>
          </div>

          {/* Interactive Tab Controls & Expand Button */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center p-0.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[10px]">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-zinc-800 text-white font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                UI
              </button>
              <button
                onClick={() => setActiveTab('architecture')}
                className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === 'architecture'
                    ? 'bg-zinc-800 text-white font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Arch
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-zinc-800 text-white font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Code
              </button>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="p-1 rounded-lg bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors cursor-pointer"
              title="Expand Full Spec & Modal"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-3.5 bg-zinc-950/90 min-h-[175px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="h-full"
            >
              {activeTab === 'preview' && renderPreviewContent()}

              {activeTab === 'architecture' && renderArchitecture()}

              {activeTab === 'code' && (
                <div className="relative space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-b border-zinc-900 pb-1.5">
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Production Implementation Snippet</span>
                    </span>
                    <button
                      onClick={() => handleCopyCode(getCodeSnippet())}
                      className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="text-[10px] leading-relaxed text-zinc-300 overflow-x-auto p-3 rounded-lg bg-zinc-900/90 font-mono max-h-[150px] border border-zinc-800/80">
                    <code>{getCodeSnippet()}</code>
                  </pre>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Expand Detail Link Bar */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-3 pt-2 border-t border-zinc-900/80 w-full flex items-center justify-between text-[10px] font-mono text-zinc-400 hover:text-indigo-400 transition-colors group cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Inspect full specs, interactive state & code</span>
            </span>
            <span className="flex items-center gap-0.5 font-bold group-hover:translate-x-0.5 transition-transform">
              <span>Inspect</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </button>
        </div>

      </div>

      {/* FULL PROJECT DETAIL MODAL WITH SLEEK GLASSMORPHISM & ANIMATIONS */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl">
            
            {/* Modal Backdrop Click Handler */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-3xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden text-zinc-100 z-10 flex flex-col max-h-[90vh]"
            >
              
              {/* Glassmorphism Header */}
              <div className="px-6 py-4 bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-800 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    {getHeaderIcon()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-2">
                      <span>{getHeaderTitle()}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        Interactive Spec
                      </span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                      Full-Stack Architecture & Production Code Inspector
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-xl bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="px-6 py-3 bg-zinc-900/40 border-b border-zinc-800/80 flex items-center justify-between shrink-0 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'preview'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Live UI Preview</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('architecture')}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'architecture'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>System Architecture</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'code'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Source Snippet</span>
                  </button>
                </div>

                {activeTab === 'code' && (
                  <button
                    onClick={() => handleCopyCode(getCodeSnippet())}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                  </button>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                
                {activeTab === 'preview' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
                      <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-3">
                        Interactive Live Snapshot
                      </h4>
                      {renderPreviewContent()}
                    </div>
                  </div>
                )}

                {activeTab === 'architecture' && (
                  <div className="space-y-4">
                    {renderArchitecture()}
                  </div>
                )}

                {activeTab === 'code' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
                      <pre className="text-xs leading-relaxed text-zinc-200 font-mono overflow-x-auto">
                        <code>{getCodeSnippet()}</code>
                      </pre>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-xs font-mono shrink-0">
                <span className="text-zinc-400">
                  Built with React 19, TypeScript & Tailwind CSS
                </span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-colors cursor-pointer"
                >
                  Close Inspector
                </button>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </>
  );
};
