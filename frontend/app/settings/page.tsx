'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Key, Save, Eye, EyeOff, Loader2, CheckCircle2, MapPin, Mail, Server } from 'lucide-react';
import { api, Setting } from '@/lib/api';

const settingCategories = [
  { id: 'api_keys', label: 'AI & Search APIs' },
  { id: 'smtp', label: 'Email SMTP' },
  { id: 'storage', label: 'Storage & Drive' },
  { id: 'general', label: 'General System' },
];

const defaultSettings = [
  { key: 'GOOGLE_MAPS_API_KEY', category: 'api_keys', label: 'Google Maps API Key', encrypted: true, placeholder: 'AIzaSy...' },
  { key: 'GOOGLE_AI_STUDIO_KEY', category: 'api_keys', label: 'Google AI Studio Key (Gemini)', encrypted: true, placeholder: 'AIzaSy...' },
  { key: 'OPENAI_API_KEY', category: 'api_keys', label: 'OpenAI API Key', encrypted: true, placeholder: 'sk-...' },
  { key: 'SMTP_HOST', category: 'smtp', label: 'SMTP Server Host', encrypted: false, placeholder: 'smtp.gmail.com' },
  { key: 'SMTP_PORT', category: 'smtp', label: 'SMTP Server Port', encrypted: false, placeholder: '587' },
  { key: 'SMTP_USER', category: 'smtp', label: 'SMTP Username/Email', encrypted: false, placeholder: 'outreach@company.com' },
  { key: 'SMTP_PASS', category: 'smtp', label: 'SMTP Password/App Secret', encrypted: true, placeholder: '••••••••' },
  { key: 'GOOGLE_DRIVE_FOLDER', category: 'storage', label: 'Google Drive Root Folder', encrypted: false, placeholder: 'AI Lead Gen & Website Demos' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('api_keys');

  useEffect(() => {
    api.settings.list().then(({ settings }) => {
      setSettings(settings);
      const v: Record<string, string> = {};
      settings.forEach((s) => { v[s.key] = s.value !== '***' ? s.value : ''; });
      setValues(v);
    }).catch(console.error);
  }, []);

  const handleSave = async (key: string, category: string, encrypted: boolean) => {
    if (!values[key]) return;
    setSaving(key);
    try {
      await api.settings.set(key, values[key], category, encrypted);
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(null); }
  };

  const filteredSettings = defaultSettings.filter((s) => s.category === activeTab);

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Settings className="w-6 h-6 text-slate-400" /> Platform Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure Google Maps API, AI models, SMTP credentials & storage integrations</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card">
        {settingCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === cat.id ? 'bg-white/10 text-white shadow-sm' : 'text-muted-foreground hover:text-white'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Settings form */}
      <div className="space-y-4">
        {filteredSettings.map((def, i) => {
          const isEncrypted = def.encrypted;
          const isVisible = visible[def.key];
          const inputType = isEncrypted && !isVisible ? 'password' : 'text';
          return (
            <motion.div key={def.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Key className="w-4 h-4 text-cyan-400" />
                <label className="text-sm font-medium text-white">{def.label}</label>
                {isEncrypted && <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">Encrypted</span>}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={inputType}
                    value={values[def.key] || ''}
                    onChange={(e) => setValues((prev) => ({ ...prev, [def.key]: e.target.value }))}
                    placeholder={def.placeholder || `Enter ${def.label}`}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan-500 font-mono transition"
                  />
                  {isEncrypted && (
                    <button
                      onClick={() => setVisible((prev) => ({ ...prev, [def.key]: !prev[def.key] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                    >
                      {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleSave(def.key, def.category, def.encrypted)}
                  disabled={saving === def.key}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm shrink-0 font-medium"
                >
                  {saving === def.key ? <Loader2 className="w-4 h-4 animate-spin" /> : saved === def.key ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                  {saved === def.key ? 'Saved!' : 'Save'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
