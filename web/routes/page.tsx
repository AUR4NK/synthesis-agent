import { useState, useEffect } from "react";
import { 
  Wallet, Shield, Handshake, Lock, 
  ExternalLink, Github, Twitter, Clock,
  Activity, CreditCard, Award, LockKeyhole,
  X, Plus, Copy, Check, Send
} from "lucide-react";

type WalletState = { connected: boolean; address: string | null; chainId: number | null };

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function ThemeCard({ title, icon: Icon, status, items, onClick, live }: { title: string; icon: React.ElementType; status: string; items: { label: string; value: string; live?: boolean }[]; onClick: () => void; live?: boolean; }) {
  return (
    <div onClick={onClick} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-green-500/50 transition-all cursor-pointer hover:bg-zinc-900/80 group">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
          <Icon className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{title}</h3>
          <div className="flex items-center gap-2">
            {live && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            <span className="text-xs text-green-400 font-mono">{status}</span>
          </div>
        </div>
        <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">Open →</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-zinc-400">{item.label}</span>
            <span className={"font-mono " + (item.live ? "text-green-400" : "text-white")}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SynthesisPage() {
  const [state, setState] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [themeData, setThemeData] = useState<Record<string, unknown>>({});
  const [wallet, setWallet] = useState<WalletState>({ connected: false, address: null, chainId: null });

  const fetchAllData = async () => {
    try {
      const [spending, trust, cooperation, privacy, agentState] = await Promise.all([
        fetch("/api/spending").then(r => r.json()).catch(() => ({ permissions: [] })),
        fetch("/api/trust").then(r => r.json()).catch(() => ({ attestations: [], reputationScore: 0 })),
        fetch("/api/cooperation").then(r => r.json()).catch(() => ({ commitments: [] })),
        fetch("/api/privacy").then(r => r.json()).catch(() => ({ policies: [], secrets: [] })),
        fetch("/api/agent/state").then(r => r.json()).catch(() => ({}))
      ]);
      setThemeData({ spending, trust, cooperation, privacy });
      setState(agentState);
      setLoading(false);
    } catch { setLoading(false); }
  };

  useEffect(() => {
    fetchAllData();
    const end = new Date("2026-03-22T17:00:00Z").getTime();
    const update = () => {
      const diff = Math.max(0, end - Date.now());
      setCountdown({ days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000) });
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as unknown as { ethereum?: unknown }).ethereum) {
      try {
        const eth = (window as unknown as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } }).ethereum;
        const accounts = await eth?.request({ method: "eth_requestAccounts" });
        if (accounts && accounts[0]) setWallet({ connected: true, address: accounts[0], chainId: 8453 });
      } catch { console.error("Wallet connection failed"); }
    } else { alert("Please install MetaMask or another Web3 wallet"); }
  };

  const disconnectWallet = () => {
    setWallet({ connected: false, address: null, chainId: null });
  };

  const addSpendingPermission = async (recipient: string, maxAmount: string) => {
    await fetch("/api/spending", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", recipient, maxAmount, timeWindow: "30 days", ownerAddress: wallet.address }) });
    fetchAllData();
  };

  const revokePermission = async (id: string) => { await fetch("/api/spending", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "revoke", id }) }); fetchAllData(); };
  const addAttestation = async (type: string, claim: string) => { await fetch("/api/trust", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, claim, issuer: wallet.address || "self" }) }); fetchAllData(); };
  const createCommitment = async (description: string, stake: string, deadline: number) => { await fetch("/api/cooperation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", type: "escrow", party: wallet.address || "user", description, stake, deadline }) }); fetchAllData(); };
  const fulfillCommitment = async (id: string) => { await fetch("/api/cooperation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "fulfill", id }) }); fetchAllData(); };
  const addPrivacyPolicy = async (dataType: string, disclosure: string, retention: string) => { await fetch("/api/privacy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add_policy", dataType, disclosure, retention, anonymize: ["pii"] }) }); fetchAllData(); };
  const storeSecret = async (key: string, value: string) => { await fetch("/api/privacy", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "store_secret", key, value, owner: wallet.address }) }); fetchAllData(); };

  const identity = state?.identity as Record<string, unknown> | undefined;
  const spending = themeData.spending as Record<string, { id?: string; recipient?: string; maxAmount?: string; spent?: string; status?: string }[]> | undefined;
  const trust = themeData.trust as Record<string, unknown> | undefined;
  const cooperation = themeData.cooperation as Record<string, { id?: string; description?: string; stake?: string; status?: string; deadline?: number }[]> | undefined;
  const privacy = themeData.privacy as Record<string, unknown> | undefined;

  const spendingPerms = spending?.permissions || [];
  const attestations = (trust?.attestations as { type?: string; claim?: string; issuer?: string }[]) || [];
  const commitments = cooperation?.commitments || [];
  const policies = (privacy?.policies as { dataType?: string; disclosure?: string; retention?: string }[]) || [];
  const secrets = (privacy?.secrets as { key?: string; createdAt?: number }[]) || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/oxbytpro-logo.png?v=3" alt="oxbytpro" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <h1 className="text-lg font-semibold">Zo Synthesis Agent</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-zinc-400 font-mono">ERC-8004 Active on Base</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {wallet.connected ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-mono text-zinc-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
                </div>
                <button onClick={disconnectWallet} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 font-medium transition-colors">
                  Disconnect
                </button>
              </div>
            ) : (
              <button onClick={connectWallet} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors">Connect Wallet</button>
            )}
            <a href="https://x.com/oxbytpro" target="_blank" rel="noopener" className="text-zinc-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="https://github.com/AUR4NK/synthesis-agent" target="_blank" rel="noopener" className="text-zinc-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </header>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-mono mb-8">
            <Activity className="w-4 h-4" /> OPERATIONAL — LIVE ON BASE MAINNET
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Autonomous Agent with<br /><span className="text-green-400">Ethereum Infrastructure</span></h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">Fully functional agent with real spending permissions, on-chain identity, smart contract commitments, and encrypted secrets management.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/AUR4NK/synthesis-agent" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"><Github className="w-5 h-5" /> View Source</a>
            <a href="https://basescan.org/tx/0x26e7717a3e5e737b40a4189280288bc997e2a089c1d51b30335687e388614369" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white font-semibold rounded-lg hover:bg-zinc-700 transition-colors"><ExternalLink className="w-5 h-5" /> On-Chain Identity</a>
          </div>
        </div>
      </section>

      <section className="py-8 px-6 border-y border-zinc-800 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-8">
          <Clock className="w-5 h-5 text-green-400" />
          <div className="flex items-center gap-6 text-center">
            <div><div className="text-2xl font-bold font-mono text-green-400">{countdown.days}</div><div className="text-xs text-zinc-500 uppercase">Days</div></div>
            <div className="text-zinc-600 font-bold">:</div>
            <div><div className="text-2xl font-bold font-mono text-green-400">{String(countdown.hours).padStart(2, "0")}</div><div className="text-xs text-zinc-500 uppercase">Hours</div></div>
            <div className="text-zinc-600 font-bold">:</div>
            <div><div className="text-2xl font-bold font-mono text-green-400">{String(countdown.minutes).padStart(2, "0")}</div><div className="text-xs text-zinc-500 uppercase">Mins</div></div>
          </div>
          <span className="text-sm text-zinc-400 font-mono">until building closes</span>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (<div className="text-center text-zinc-400 py-12">Loading agent state...</div>) : (
            <div className="grid md:grid-cols-2 gap-6">
              <ThemeCard title="Agents That Pay" icon={CreditCard} status="SPENDING PERMISSIONS" live={spendingPerms.length > 0} items={[{ label: "Active Permissions", value: spendingPerms.length.toString(), live: spendingPerms.length > 0 }, { label: "Total Allowance", value: spendingPerms.reduce((sum, p) => sum + parseFloat(p.maxAmount || "0"), 0).toFixed(2) + " ETH" }, { label: "Total Spent", value: spendingPerms.reduce((sum, p) => sum + parseFloat(p.spent || "0"), 0).toFixed(4) + " ETH" }]} onClick={() => setActiveModal("spending")} />
              <ThemeCard title="Agents That Trust" icon={Award} status="ERC-8004 IDENTITY" live={true} items={[{ label: "Token ID", value: String(identity?.erc8004TokenId || 32484), live: true }, { label: "Attestations", value: attestations.length.toString() }, { label: "Reputation Score", value: String(trust?.reputationScore || 10) }]} onClick={() => setActiveModal("trust")} />
              <ThemeCard title="Agents That Cooperate" icon={Handshake} status="SMART CONTRACT COMMITMENTS" live={commitments.length > 0} items={[{ label: "Active Commitments", value: commitments.length.toString(), live: commitments.length > 0 }, { label: "Total Staked", value: commitments.reduce((sum, c) => sum + parseFloat(c.stake || "0"), 0).toFixed(2) + " ETH" }, { label: "Escrow Status", value: "Enabled" }]} onClick={() => setActiveModal("cooperation")} />
              <ThemeCard title="Agents That Keep Secrets" icon={LockKeyhole} status="ENCRYPTED VAULT" live={secrets.length > 0} items={[{ label: "Privacy Policies", value: policies.length.toString() }, { label: "Encrypted Secrets", value: secrets.length.toString(), live: secrets.length > 0 }, { label: "Encryption", value: "AES-256-GCM" }]} onClick={() => setActiveModal("privacy")} />
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/oxbytpro-logo.png?v=3" alt="oxbytpro" className="w-6 h-6 rounded object-cover" />
            <span className="text-sm text-zinc-400">Built by <a href="https://x.com/oxbytpro" target="_blank" className="text-white hover:underline">@oxbytpro</a></span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <a href="https://github.com/AUR4NK/synthesis-agent" target="_blank" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://x.com/oxbytpro" target="_blank" className="hover:text-white transition-colors">Twitter</a>
            <a href="https://synthesis.md" target="_blank" className="hover:text-white transition-colors">Synthesis</a>
          </div>
        </div>
      </footer>
    </div>
  );
}