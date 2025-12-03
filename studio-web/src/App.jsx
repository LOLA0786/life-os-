import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import EventsPage from "./pages/EventsPage";
import ChatConsole from "./components/ChatConsole";
import TimelineAdvanced from "./components/TimelineAdvanced";
import AutomationBuilder from "./components/AutomationBuilder";
import NotionEditor from "./components/NotionEditor";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gradient-to-b from-[#071024] via-[#0b1220] to-[#071022] text-white">
        <aside className="w-72 p-6 border-r border-black/20 backdrop-blur-md" style={{minWidth:220}}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-black font-bold bg-gradient-to-br from-cyan-400 to-indigo-400">LO</div>
            <div>
              <div className="font-bold">Life OS — Studio</div>
              <div className="text-sm text-gray-300">Personal AI OS</div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link to="/" className="px-3 py-2 rounded hover:bg-white/5">🏠 Dashboard</Link>
            <Link to="/timeline" className="px-3 py-2 rounded hover:bg-white/5">🕒 Timeline</Link>
            <Link to="/search" className="px-3 py-2 rounded hover:bg-white/5">🔎 Search</Link>
            <Link to="/events" className="px-3 py-2 rounded hover:bg-white/5">🗂 Events</Link>
            <Link to="/notebook" className="px-3 py-2 rounded hover:bg-white/5">✍️ Notebook</Link>
            <Link to="/automations" className="px-3 py-2 rounded hover:bg-white/5">⚙️ Automations</Link>
            <Link to="/chat" className="px-3 py-2 rounded hover:bg-white/5">💬 Chat</Link>
          </nav>

          <div className="mt-8">
            <div className="text-xs text-gray-400 mb-2">Theme</div>
            <div className="flex gap-2">
              <button onClick={()=>setTheme('dark')} className={"px-3 py-1 rounded " + (theme==='dark' ? "bg-white/10":"")}>Dark</button>
              <button onClick={()=>setTheme('light')} className={"px-3 py-1 rounded " + (theme==='light' ? "bg-white/10":"")}>Light</button>
              <button onClick={()=>setTheme('premium')} className={"px-3 py-1 rounded " + (theme==='premium' ? "bg-white/10":"")}>Premium</button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-6">
          <header className="flex justify-between items-center mb-4">
            <div>
              <div className="text-2xl font-bold">Life OS Studio</div>
              <div className="text-sm text-gray-300">Your personal memory & automation hub</div>
            </div>
            <div className="flex items-center gap-3">
              <input id="global-search" placeholder="Search (press enter)" className="px-3 py-2 rounded bg-black/20 text-white" onKeyDown={(e)=>{ if(e.key==='Enter'){ document.getElementById('global-search-btn').click() }}} />
              <button id="global-search-btn" className="px-3 py-2 bg-cyan-500 rounded">Search</button>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timeline" element={<TimelineAdvanced />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/notebook" element={<NotionEditor />} />
            <Route path="/automations" element={<AutomationBuilder />} />
            <Route path="/chat" element={<ChatConsole />} />
          </Routes>
        </main>

        <aside className="w-80 p-6 border-l border-black/20 hidden md:block">
          <div className="panel p-3 rounded-lg bg-black/20">
            <h4 className="font-semibold">Quick Actions</h4>
            <div className="mt-3 flex flex-col gap-2">
              <button onClick={async ()=> {
                await fetch('http://0.0.0.0:8000/ingest', {
                  method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
                    source:'studio-quick', type:'note', timestamp: Math.floor(Date.now()/1000), content:'Quick ingest from Studio', metadata:{from:'studio-quick'}
                  })
                })
                alert('Quick ingested')
              }} className="px-3 py-2 bg-white/10 rounded">Quick Ingest</button>
              <button onClick={()=>{ navigator.clipboard.writeText(window.location.href); alert('URL copied') }} className="px-3 py-2 bg-white/5 rounded">Copy URL</button>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold">Life Graph (demo)</h4>
            <div className="h-44 bg-black/20 mt-3 rounded flex items-center justify-center text-gray-400">Graph placeholder</div>
          </div>
        </aside>
      </div>
    </BrowserRouter>
  );
}
