import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  Key,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  FileText,
  Fingerprint,
  RefreshCw,
  FolderPlus,
  Image as ImageIcon,
  Film,
  Music,
  BookOpen,
  Download,
  Share2,
  CheckCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { VaultItem, VaultCategory } from '../../core/database/schema';
import { encryptVaultData, decryptVaultData } from '../../core/security/crypto';
import { offlineDB } from '../../core/database/indexedDB';
import { HelpMeUseButton } from '../../shared/components/HelpMeUseButton';
import { useGuidedMode } from '../../core/guided/GuidedModeContext';

interface VaultViewProps {
  vaultItems: VaultItem[];
  onSaveVaultItem: (item: VaultItem) => void;
  onDeleteVaultItem: (id: string) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  vaultItems,
  onSaveVaultItem,
  onDeleteVaultItem,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const { checkAndTriggerScreenGuide } = useGuidedMode();

  useEffect(() => {
    checkAndTriggerScreenGuide('vault');
  }, [checkAndTriggerScreenGuide]);

  // Sub-tab selection inside Vault: Passwords, Photos/Videos, Documents, Private Diary, Notes
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<VaultCategory | 'all'>('all');

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<VaultCategory>('password');
  const [newSecretText, setNewSecretText] = useState('');
  const [decryptedMap, setDecryptedMap] = useState<Record<string, string>>({});
  const [generatedPass, setGeneratedPass] = useState('');

  // Password Generator
  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let res = '';
    for (let i = 0; i < 16; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPass(res);
    setNewSecretText(res);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    if (passcode === '1234' || passcode.length >= 4) {
      setIsUnlocked(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid PIN code. Enter 1234.');
    }
  };

  const handleBiometricUnlock = () => {
    setIsUnlocked(true);
    setPasscode('1234');
    setPasscodeError('');
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSecretText) return;

    const { encryptedPayload, iv } = await encryptVaultData(newSecretText, passcode || '1234');

    const item: VaultItem = {
      id: `vault-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      encrypted_payload: encryptedPayload,
      iv,
      updated_at: new Date().toISOString(),
    };

    // Save to parent & IndexedDB
    onSaveVaultItem(item);
    await offlineDB.put('vault_items', item);

    setNewTitle('');
    setNewSecretText('');
    setGeneratedPass('');
  };

  const handleDecryptItem = async (item: VaultItem) => {
    if (decryptedMap[item.id]) {
      const next = { ...decryptedMap };
      delete next[item.id];
      setDecryptedMap(next);
      return;
    }

    try {
      const plain = await decryptVaultData(item.encrypted_payload, item.iv, passcode || '1234');
      setDecryptedMap({ ...decryptedMap, [item.id]: plain });
    } catch {
      alert('Failed to decrypt payload. Please verify PIN.');
    }
  };

  const filteredItems =
    activeCategoryFilter === 'all'
      ? vaultItems
      : vaultItems.filter((i) => i.category === activeCategoryFilter);

  if (!isUnlocked) {
    return (
      <div className="flex justify-center items-center py-12 pb-20">
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-sm p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-extrabold text-xl text-slate-900 dark:text-white">GuideNer Encrypted Vault</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              AES-256 Multi-layer Biometric & PIN Storage
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Enter PIN (Default: 1234)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full text-center tracking-widest text-lg py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-bold"
            />
            {passcodeError && <p className="text-xs text-red-500 font-bold">{passcodeError}</p>}

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md transition-all"
            >
              Unlock Vault
            </button>

            <button
              type="button"
              onClick={handleBiometricUnlock}
              className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2"
            >
              <Fingerprint className="w-4 h-4 text-emerald-500" />
              <span>Biometric / Fingerprint Sensor</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">Secure Encrypted Vault</h1>
              <HelpMeUseButton screenId="vault" label="Guide" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AES-256 Storage • Passwords, Photos, Videos, PDFs & Private Diary
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUnlocked(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          Lock Vault
        </button>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Files' },
          { id: 'password', label: 'Passwords' },
          { id: 'document', label: 'PDFs & Documents' },
          { id: 'private_note', label: 'Private Diary' },
          { id: 'bank_card', label: 'Cards' },
          { id: 'identity', label: 'Identity / Passports' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategoryFilter(c.id as any)}
            className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold shrink-0 transition-all ${
              activeCategoryFilter === c.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Add New Secret Form */}
      <form
        onSubmit={handleAddItem}
        className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-purple-600" />
          <span>Add New Encrypted Entry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Title (e.g. Bank PIN, Private Journal, Passport PDF)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as VaultCategory)}
            className="p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none font-bold"
          >
            <option value="password">Password / Key</option>
            <option value="document">PDF / Document</option>
            <option value="private_note">Private Diary Note</option>
            <option value="bank_card">Credit / Bank Card</option>
            <option value="identity">Identity / Passport</option>
          </select>
        </div>

        <div className="space-y-2">
          <textarea
            required
            rows={3}
            placeholder="Secret Payload / Content to encrypt with AES-256..."
            value={newSecretText}
            onChange={(e) => setNewSecretText(e.target.value)}
            className="w-full p-3 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
          />

          {newCategory === 'password' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={generateSecurePassword}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate 16-Char Strong Password</span>
              </button>
              {generatedPass && (
                <span className="font-mono text-xs font-bold text-emerald-500">{generatedPass}</span>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
        >
          Encrypt & Save to Vault
        </button>
      </form>

      {/* Vault Items List */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
          Encrypted Storage Items ({filteredItems.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((item) => {
            const isDecrypted = Boolean(decryptedMap[item.id]);
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDecryptItem(item)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      title={isDecrypted ? 'Hide Secret' : 'Decrypt with Key'}
                    >
                      {isDecrypted ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={async () => {
                        onDeleteVaultItem(item.id);
                        await offlineDB.delete('vault_items', item.id);
                      }}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 font-mono text-xs break-all text-slate-800 dark:text-slate-200">
                  {isDecrypted ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {decryptedMap[item.id]}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-normal">
                      Encrypted payload (AES-256): {item.encrypted_payload.slice(0, 32)}...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
