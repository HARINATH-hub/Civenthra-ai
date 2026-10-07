import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage, LANGUAGES } from '../../context/LanguageContext';
import { Sun, Moon, Bell, MapPin, Shield, Check, Globe } from 'lucide-react';

export default function CitizenSettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const { currentLanguage, setLanguage } = useLanguage();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [gpsPermissionEnabled, setGpsPermissionEnabled] = useState(true);
  const [privacyConsent, setPrivacyConsent] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Interface styling, multilingual preferences, and spatial telemetry privacy controls
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-semibold">
          <Check className="w-4 h-4" />
          Settings saved successfully!
        </div>
      )}

      {/* Theme Settings */}
      <Card className="p-6 border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Interface Color Scheme
              </h3>
              <p className="text-xs text-slate-500">
                Switch between high-contrast light mode and dark charcoal/navy mode
              </p>
            </div>
          </div>

          <Button
            onClick={toggleTheme}
            variant="secondary"
            size="sm"
            icon={isDark ? Sun : Moon}
          >
            {isDark ? 'Light Theme' : 'Dark Theme'}
          </Button>
        </div>
      </Card>

      {/* Language Settings */}
      <Card className="p-6 border space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Default GenAI Complaint Language
            </h3>
            <p className="text-xs text-slate-500">
              Generated complaints and voice transcripts will automatically render in this language
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`p-3 rounded-xl border text-left transition-all ${
                currentLanguage === l.code
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <p className="text-xs font-bold">{l.name}</p>
              <p className="text-[10px] text-slate-400">{l.native}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Permissions and Privacy */}
      <Card className="p-6 border space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Permissions & Citizen Privacy
            </h3>
            <p className="text-xs text-slate-500">
              Control what data Civenthra AI captures during issue reporting
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Browser Geolocation Permission
              </p>
              <p className="text-[11px] text-slate-500">
                Allow automatic GPS tagging for submitted civic images
              </p>
            </div>
            <input
              type="checkbox"
              checked={gpsPermissionEnabled}
              onChange={(e) => setGpsPermissionEnabled(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Computer Vision Progress Notifications
              </p>
              <p className="text-[11px] text-slate-500">
                Receive notifications when after-fix image is uploaded and verified
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Citizen Privacy Anonymization
              </p>
              <p className="text-[11px] text-slate-500">
                Mask citizen phone number and personal info on public grievance logs
              </p>
            </div>
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
            />
          </label>
        </div>

        <div className="pt-2">
          <Button onClick={handleSave} size="md">
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
}
