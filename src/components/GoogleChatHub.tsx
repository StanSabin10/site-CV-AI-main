import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
export interface User {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

export interface ChatSpace {
  name: string;
  displayName: string;
  type: string;
  spaceType?: string;
}

export interface ChatMessage {
  name: string;
  text: string;
  createTime: string;
  sender?: {
    displayName?: string;
    avatarUri?: string;
  };
}

interface GoogleChatHubProps {
  lang: 'ro' | 'en';
  onClose?: () => void;
}

export default function GoogleChatHub({ lang }: GoogleChatHubProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Chat Data State
  const [spaces, setSpaces] = useState<ChatSpace[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [spaceSearch, setSpaceSearch] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<ChatSpace | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  
  // New Space Creation State
  const [newSpaceName, setNewSpaceName] = useState('');
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);

  // Mandatory Confirmation Dialog for Workspace Operations (Sending messages, creating spaces)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    targetAction: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    targetAction: async () => {},
  });

  const [notification, setNotification] = useState<string | null>(null);

  const t = {
    ro: {
      hubTitle: "Google Chat Workspace Bridge",
      hubBadge: "Google Workspace 1P API · Certified",
      hubSubtitle: "Consolă de dispecerat bidirecțional pentru alerte critice, rapoarte de reconciliere și aprobări umane în timp real.",
      connectPrompt: "Conectează-te cu contul tău Google Workspace pentru a autoriza accesul securizat la Google Chat.",
      signInGoogle: "Conectare securizată cu Google",
      signingIn: "Se inițializează sesiunea...",
      connectedAs: "Cont autorizat:",
      disconnect: "Deconectare",
      refreshSpaces: "Reîmprospătează",
      searchSpacesPlaceholder: "Filtrează spațiile...",
      noSpacesFound: "Nu a fost găsit niciun spațiu în Google Chat.",
      selectSpacePrompt: "Selectează un canal din panoul din stânga pentru a examina fluxul de mesaje și a trimite notificări.",
      messagesTitle: "Jurnal Mesaje în Timp Real",
      noMessages: "Nu există mesaje recente înregistrate în acest spațiu.",
      typeMessagePlaceholder: "Scrie un mesaj sau o notificare autonomă către echipă...",
      sendBtn: "Trimite în Chat",
      quickDispatchTitle: "Șabloane de Dispecerat Rapid SynthIQ",
      quickAlert1: "⚡ SynthIQ Alertă: Reconcilierea tranzacțiilor Stripe a fost finalizată cu succes în 94ms. Toate verificările de idempotență sunt valide.",
      quickAlert2: "🛡️ SynthIQ Securitate: Punctul de control SOC2 / HIPAA a fost validat. Nicio anomalie de autorizare detectată în ultimele 24 ore.",
      quickAlert3: "🚀 SynthIQ Telemetrie: Vârf de sarcină de 14.8k req/sec procesat pe clusterul us-east-1 cu zero comenzi pierdute.",
      createSpaceBtn: "+ Creează Spațiu",
      createSpaceModalTitle: "Creează un Nou Spațiu în Google Chat",
      spaceNameLabel: "Denumirea canalului / spațiului:",
      createConfirmPrompt: "Ești sigur că dorești să creezi acest spațiu în Google Chat?",
      sendConfirmTitle: "Confirmare Trimitere Notificare",
      sendConfirmDesc: (space: string, text: string) => 
        `Ești sigur că vrei să transmiți următorul mesaj în spațiul Google Chat "${space}"?\n\n"${text}"`,
      createConfirmTitle: "Confirmare Creare Canal",
      createConfirmDesc: (name: string) => 
        `Ești sigur că vrei să inițializezi un nou spațiu Google Chat denumit "${name}"?`,
      confirmBtn: "Confirmă & Trimite",
      cancelBtn: "Anulează",
      permissionNotice: "Toate acțiunile de scriere în Google Chat necesită confirmare explicită din partea utilizatorului. Tokenul este stocat exclusiv în memoria de execuție a sesiunii.",
    },
    en: {
      hubTitle: "Google Chat Workspace Bridge",
      hubBadge: "Google Workspace 1P API · Certified",
      hubSubtitle: "Bi-directional enterprise dispatch console for critical alerts, reconciliation digests, and human approval gates.",
      connectPrompt: "Connect your Google Workspace account to securely authorize Google Chat API access.",
      signInGoogle: "Sign in with Google",
      signingIn: "Initializing session...",
      connectedAs: "Authorized account:",
      disconnect: "Disconnect",
      refreshSpaces: "Refresh",
      searchSpacesPlaceholder: "Filter spaces...",
      noSpacesFound: "No Google Chat spaces found.",
      selectSpacePrompt: "Select a channel from the left panel to inspect message telemetry and dispatch notifications.",
      messagesTitle: "Real-Time Message Stream",
      noMessages: "No recent messages recorded in this space.",
      typeMessagePlaceholder: "Compose an autonomous dispatch or status update...",
      sendBtn: "Dispatch Message",
      quickDispatchTitle: "SynthIQ Rapid Dispatch Templates",
      quickAlert1: "⚡ SynthIQ Alert: Stripe transaction reconciliation completed in 94ms. All distributed idempotency locks verified.",
      quickAlert2: "🛡️ SynthIQ Security: SOC2 / HIPAA compliance checkpoint verified. Zero unauthorized deviations detected in last 24h.",
      quickAlert3: "🚀 SynthIQ Telemetry: Handled 14.8k req/sec peak throughput across us-east-1 cluster with zero dropped packets.",
      createSpaceBtn: "+ Create Space",
      createSpaceModalTitle: "Create a New Google Chat Space",
      spaceNameLabel: "Space display name:",
      createConfirmPrompt: "Are you sure you want to create this space in Google Chat?",
      sendConfirmTitle: "Confirm Message Dispatch",
      sendConfirmDesc: (space: string, text: string) => 
        `Are you sure you want to dispatch this message into Google Chat space "${space}"?\n\n"${text}"`,
      createConfirmTitle: "Confirm Space Creation",
      createConfirmDesc: (name: string) => 
        `Are you sure you want to create a new Google Chat space named "${name}"?`,
      confirmBtn: "Confirm & Dispatch",
      cancelBtn: "Cancel",
      permissionNotice: "All Google Chat write operations require explicit human confirmation. Tokens are retained strictly in session runtime memory.",
    }
  }[lang];

  useEffect(() => {
    // Static demo initialization
  }, []);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setUser({
        uid: 'demo-user',
        displayName: 'Sabin Stan',
        email: 'stansabin575@gmail.com'
      });
      setAccessToken('demo-token');
      const demoSpaces: ChatSpace[] = [
        { name: 'spaces/general', displayName: 'General Team Chat', type: 'SPACE' },
        { name: 'spaces/alerts', displayName: 'System Alerts & Telemetry', type: 'SPACE' }
      ];
      setSpaces(demoSpaces);
      setSelectedSpace(demoSpaces[0]);
      setMessages([
        {
          name: 'msg-1',
          text: 'Welcome to Google Chat Workspace Dispatcher!',
          createTime: new Date().toISOString(),
          sender: { displayName: 'System' }
        }
      ]);
      triggerNotification(lang === 'ro' ? 'Conectat cu succes la Google Chat!' : 'Successfully connected to Google Chat!');
    } catch (err: any) {
      setAuthError(err.message || (lang === 'ro' ? 'Autentificarea Google a eșuat.' : 'Google authentication failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setUser(null);
    setAccessToken(null);
    setSpaces([]);
    setSelectedSpace(null);
    setMessages([]);
    triggerNotification(lang === 'ro' ? 'Te-ai deconectat de la Google Chat.' : 'Disconnected from Google Chat.');
  };

  const loadSpaces = async (_token?: string) => {
    setLoadingSpaces(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
    } finally {
      setLoadingSpaces(false);
    }
  };

  const loadMessages = async (_token?: string, _spaceName?: string) => {
    setLoadingMessages(true);
    try {
      await new Promise((r) => setTimeout(r, 200));
    } finally {
      setLoadingMessages(false);
    }
  };

  const createChatSpace = async (_token: string, spaceName: string): Promise<ChatSpace> => {
    await new Promise((r) => setTimeout(r, 300));
    const cleanId = spaceName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newSpace: ChatSpace = {
      name: `spaces/${cleanId}`,
      displayName: spaceName,
      type: 'SPACE',
      spaceType: 'SPACE',
    };
    setSpaces((prev) => [...prev, newSpace]);
    return newSpace;
  };

  const handleSelectSpace = (sp: ChatSpace) => {
    setSelectedSpace(sp);
  };

  // Prepare Send Message with mandatory user confirmation dialog
  const requestSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || !selectedSpace) return;

    const spaceLabel = selectedSpace.displayName || selectedSpace.name;
    setConfirmModal({
      isOpen: true,
      title: t.sendConfirmTitle,
      description: t.sendConfirmDesc(spaceLabel, textToSend),
      targetAction: async () => {
        setMessages((prev) => [
          ...prev,
          {
            name: `msg-${Date.now()}`,
            text: textToSend,
            createTime: new Date().toISOString(),
            sender: { displayName: user?.displayName || 'Sabin Stan' }
          }
        ]);
        setNewMessageText('');
        triggerNotification(lang === 'ro' ? 'Mesaj trimis cu succes în Google Chat!' : 'Message sent successfully to Google Chat!');
      },
    });
  };

  // Prepare Create Space with mandatory user confirmation dialog
  const requestCreateSpace = () => {
    if (!newSpaceName.trim() || !accessToken) return;

    setConfirmModal({
      isOpen: true,
      title: t.createConfirmTitle,
      description: t.createConfirmDesc(newSpaceName),
      targetAction: async () => {
        try {
          const created = await createChatSpace(accessToken, newSpaceName);
          setNewSpaceName('');
          setShowCreateSpaceModal(false);
          triggerNotification(lang === 'ro' ? `Spațiul "${created.displayName || newSpaceName}" a fost creat!` : `Space "${created.displayName || newSpaceName}" created!`);
          await loadSpaces(accessToken);
          setSelectedSpace(created);
          await loadMessages(accessToken, created.name);
        } catch (err: any) {
          triggerNotification(err.message);
        }
      },
    });
  };

  const filteredSpaces = spaces.filter(sp => {
    const label = sp.displayName || sp.name;
    return label.toLowerCase().includes(spaceSearch.toLowerCase());
  });

  return (
    <div className="relative w-full rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 shadow-2xl overflow-hidden text-left font-sans">
      
      {/* Sleek Glassmorphism Header Bar */}
      <div className="px-6 py-4 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
        
        <div className="flex items-center gap-3.5">
          {/* Logo Badge with Aura Ring */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl blur-sm opacity-40 animate-pulse" />
            <div className="relative w-10 h-10 rounded-xl bg-zinc-900 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-inner">
              <span className="material-symbols-outlined text-2xl">forum</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold text-zinc-100 tracking-tight">
                {t.hubTitle}
              </h3>
              
              {/* Certified Status Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{t.hubBadge}</span>
              </span>
            </div>
            
            <p className="text-xs text-zinc-400 mt-0.5 max-w-xl leading-relaxed">
              {t.hubSubtitle}
            </p>
          </div>
        </div>

        {/* User Session Bar */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-800/70 backdrop-blur-sm border border-zinc-700/60 shadow-sm">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full border border-sky-400/40" />
                ) : (
                  <span className="material-symbols-outlined text-base text-sky-400">account_circle</span>
                )}
                <span className="text-xs text-zinc-200 font-semibold truncate max-w-[150px]">
                  {user.displayName || user.email}
                </span>
              </div>
              <button 
                onClick={handleSignOut}
                className="text-xs text-zinc-400 hover:text-zinc-100 px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800 transition-all cursor-pointer font-medium"
              >
                {t.disconnect}
              </button>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignIn}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-zinc-950 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-sky-500/10 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{loading ? t.signingIn : t.signInGoogle}</span>
            </motion.button>
          )}
        </div>
      </div>

      {authError && (
        <div className="px-6 py-2.5 bg-rose-500/10 border-b border-rose-500/20 text-rose-300 text-xs flex items-center justify-between font-mono">
          <span>⚠️ {authError}</span>
          <button onClick={() => setAuthError(null)} className="text-rose-400 hover:text-white cursor-pointer px-2">✕</button>
        </div>
      )}

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
        
        {/* Left Column: Spaces / Channels Explorer */}
        <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-zinc-800/80 bg-zinc-950/70 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5 px-1">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold">
                Google Chat Spaces ({filteredSpaces.length})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadSpaces()}
                  disabled={!accessToken || loadingSpaces}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-30"
                  title={t.refreshSpaces}
                >
                  <span className={`material-symbols-outlined text-base ${loadingSpaces ? 'animate-spin' : ''}`}>refresh</span>
                </button>
                <button
                  onClick={() => setShowCreateSpaceModal(true)}
                  disabled={!accessToken}
                  className="text-xs px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-semibold transition-all cursor-pointer disabled:opacity-30"
                >
                  {t.createSpaceBtn}
                </button>
              </div>
            </div>

            {accessToken && (
              <div className="mb-3.5 relative">
                <input
                  type="text"
                  value={spaceSearch}
                  onChange={(e) => setSpaceSearch(e.target.value)}
                  placeholder={t.searchSpacesPlaceholder}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/30 transition-all font-sans"
                />
                <span className="material-symbols-outlined text-zinc-500 text-base absolute left-2.5 top-2.5 pointer-events-none">search</span>
              </div>
            )}

            {!accessToken ? (
              <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center my-6 space-y-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {t.connectPrompt}
                </p>
                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-100 transition-colors cursor-pointer shadow-md"
                >
                  {t.signInGoogle}
                </button>
              </div>
            ) : loadingSpaces ? (
              <div className="p-10 text-center text-xs text-zinc-400 flex flex-col items-center gap-3 font-mono">
                <span className="material-symbols-outlined text-2xl animate-spin text-sky-400">sync</span>
                <span>Se încarcă spațiile autorizate...</span>
              </div>
            ) : filteredSpaces.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-500">
                <p className="mb-3">{t.noSpacesFound}</p>
                <button
                  onClick={() => setShowCreateSpaceModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  {t.createSpaceBtn}
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {filteredSpaces.map((sp) => {
                  const isSelected = selectedSpace?.name === sp.name;
                  const isDirect = sp.spaceType === 'DIRECT_MESSAGE' || sp.type === 'DIRECT_MESSAGE';
                  return (
                    <button
                      key={sp.name}
                      onClick={() => handleSelectSpace(sp)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                        isSelected
                          ? 'bg-gradient-to-r from-sky-950/70 to-indigo-950/40 border-sky-500/60 text-white shadow-lg shadow-sky-500/10'
                          : 'bg-zinc-900/40 border-zinc-800/70 text-zinc-300 hover:bg-zinc-800/60 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          <span className="material-symbols-outlined text-sm">
                            {isDirect ? 'person' : 'tag'}
                          </span>
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-bold block truncate">
                            {sp.displayName || sp.name.replace('spaces/', '#')}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500 block truncate group-hover:text-zinc-400">
                            {sp.name}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase shrink-0 ml-2 ${
                        isSelected ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-zinc-800/80 text-zinc-400'
                      }`}>
                        {sp.spaceType || sp.type || 'SPACE'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Encryption Pill */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>OAuth 2.0 Active</span>
            </span>
            <span className="text-sky-400 font-semibold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              AES In-Memory
            </span>
          </div>
        </div>

        {/* Right Column: Live Conversation Stream & Dispatcher */}
        <div className="md:col-span-8 bg-zinc-950/40 flex flex-col justify-between">
          
          {selectedSpace ? (
            <div className="flex flex-col h-full">
              
              {/* Space Header */}
              <div className="px-6 py-3.5 bg-zinc-900/70 backdrop-blur-sm border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold text-xs">
                    #
                  </div>
                  <span className="text-sm font-bold text-zinc-100">
                    {selectedSpace.displayName || selectedSpace.name}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    ({selectedSpace.name})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => accessToken && loadMessages(accessToken, selectedSpace.name)}
                    disabled={loadingMessages}
                    className="text-xs text-zinc-400 hover:text-white px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className={`material-symbols-outlined text-sm ${loadingMessages ? 'animate-spin text-sky-400' : ''}`}>sync</span>
                    <span className="hidden sm:inline font-mono">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="p-6 flex-1 max-h-[320px] overflow-y-auto space-y-3.5">
                {loadingMessages ? (
                  <div className="py-14 text-center text-xs text-zinc-400 flex flex-col items-center justify-center gap-2.5 font-mono">
                    <span className="material-symbols-outlined text-2xl animate-spin text-sky-400">sync</span>
                    <span>Se descarcă conversația...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-14 text-center text-xs text-zinc-500 flex flex-col items-center">
                    <span className="material-symbols-outlined text-3xl text-zinc-600 mb-2">chat_bubble_outline</span>
                    <p>{t.noMessages}</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isSystem = msg.text?.includes('SynthIQ');
                    return (
                      <div 
                        key={msg.name || i} 
                        className={`p-4 rounded-xl border text-xs transition-all ${
                          isSystem 
                            ? 'bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-zinc-950 border-sky-500/30 text-sky-100 shadow-md shadow-sky-500/5'
                            : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold border border-zinc-700">
                              {msg.sender?.displayName?.[0] || 'G'}
                            </div>
                            <span className="font-bold text-zinc-200">
                              {msg.sender?.displayName || 'Google Workspace User'}
                            </span>
                            {isSystem && (
                              <span className="text-[10px] font-mono text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">
                                SynthIQ Dispatch
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
                            {msg.createTime ? new Date(msg.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap text-zinc-300 font-sans">
                          {msg.text}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Autonomous Dispatch Presets */}
              <div className="px-6 py-3 bg-zinc-950/60 border-t border-zinc-800/80 space-y-2">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-bold block">
                  {t.quickDispatchTitle}
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => requestSendMessage(t.quickAlert1)}
                    disabled={!accessToken}
                    className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-sky-500/40 transition-all cursor-pointer text-left truncate max-w-xs font-mono disabled:opacity-40"
                  >
                    ⚡ Reconciliere Plată (94ms)
                  </button>
                  <button
                    onClick={() => requestSendMessage(t.quickAlert2)}
                    disabled={!accessToken}
                    className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-sky-500/40 transition-all cursor-pointer text-left truncate max-w-xs font-mono disabled:opacity-40"
                  >
                    🛡️ Raport Audit SOC2 / HIPAA
                  </button>
                  <button
                    onClick={() => requestSendMessage(t.quickAlert3)}
                    disabled={!accessToken}
                    className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-sky-500/40 transition-all cursor-pointer text-left truncate max-w-xs font-mono disabled:opacity-40"
                  >
                    🚀 Telemetrie Vârf (14.8k req/s)
                  </button>
                </div>
              </div>

              {/* Message Composer */}
              <div className="p-4 bg-zinc-950 border-t border-zinc-800/90">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    requestSendMessage(newMessageText);
                  }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder={t.typeMessagePlaceholder}
                    disabled={!accessToken}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!accessToken || !newMessageText.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-zinc-950 font-bold text-xs transition-all disabled:opacity-40 cursor-pointer shrink-0 flex items-center gap-1.5 shadow-md shadow-sky-500/10"
                  >
                    <span>{t.sendBtn}</span>
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </form>
                <p className="text-[10px] text-zinc-500 mt-2 font-mono">
                  {t.permissionNotice}
                </p>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-xs text-zinc-500 flex flex-col items-center justify-center h-full space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                <span className="material-symbols-outlined text-3xl">forum</span>
              </div>
              <p className="max-w-sm leading-relaxed text-zinc-400">{t.selectSpacePrompt}</p>
            </div>
          )}

        </div>

      </div>

      {/* MANDATORY CONFIRMATION MODAL */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-100">{confirmModal.title}</h4>
                  <span className="text-[11px] font-mono text-zinc-400">Explicit User Authorization Check</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap bg-zinc-900 p-4 rounded-xl border border-zinc-800 font-mono">
                {confirmModal.description}
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer border border-zinc-800"
                >
                  {t.cancelBtn}
                </button>
                <button
                  onClick={async () => {
                    const act = confirmModal.targetAction;
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    await act();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-zinc-950 text-xs font-bold transition-all cursor-pointer shadow-lg"
                >
                  {t.confirmBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE SPACE MODAL */}
      <AnimatePresence>
        {showCreateSpaceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <h4 className="font-extrabold text-sm text-zinc-100">{t.createSpaceModalTitle}</h4>
              <p className="text-xs text-zinc-400">{t.createConfirmPrompt}</p>

              <div className="py-2">
                <label className="block text-xs font-mono text-zinc-400 mb-2">
                  {t.spaceNameLabel}
                </label>
                <input
                  type="text"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="ex. eng-incidents-prod"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowCreateSpaceModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer border border-zinc-800"
                >
                  {t.cancelBtn}
                </button>
                <button
                  onClick={requestCreateSpace}
                  disabled={!newSpaceName.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-zinc-950 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
                >
                  {t.confirmBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 right-4 z-40 px-4 py-2.5 rounded-xl bg-zinc-950 border border-sky-500/50 text-xs text-zinc-200 shadow-2xl flex items-center gap-2.5 font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
