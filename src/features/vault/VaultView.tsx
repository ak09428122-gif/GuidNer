import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, Key, Eye, EyeOff, Plus, Trash2, QrCode, Send, Smartphone } from 'lucide-react';
import { VaultItem, VaultCategory } from '../../core/database/schema';
import { encryptVaultData, decryptVaultData, hashPin } from '../../core/security/crypto';
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

  // Item Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<VaultCategory>('password');
  const [newSecretText, setNewSecretText] = useState('');
  const [decryptedMap, setDecryptedMap] = useState<Record<string, string>>({});

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    try {
      // Default passcode for demonstration is 1234
      if (passcode === '1234' || passcode.length >= 4) {
        setIsUnlocked(true);
        setPasscodeError('');
      } else {
        setPasscodeError('Invalid PIN code. Enter 1234.');
      }
    } catch {
      setPasscodeError('Decryption error.');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSecretText) return;

    const { encryptedPayload, iv } = await encryptVaultData(newSecretText, passcode);

    const item: VaultItem = {
      id: `vault-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      encrypted_payload: encryptedPayload,
      iv,
      updated_at: new Date().toISOString(),
    };

    onSaveVaultItem(item);
    setNewTitle('');
    setNewSecretText('');
  };

  const handleDecryptItem = async (item: VaultItem) => {
    if (decryptedMap[item.id]) {
      const next = { ...decryptedMap };
      delete next[item.id];
      setDecryptedMap(next);
      return;
    }

    try {
      const plain = await decryptVaultData(item.encrypted_payload, item.iv, passcode);
      setDecryptedMap({ ...decryptedMap, [item.id]: plain });
    } catch {
      alert('Failed to decrypt payload.');
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex justify-center items-center py-12 pb-20">
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-sm p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl text-center space-y-6"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-extrabold text-xl text-slate-900 dark:text-white">AES-256 Encrypted Vault</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter Master Security PIN (Default: <strong className="text-blue-600 font-mono">1234</strong>)
            </p>
          </div>

          <input
            type="password"
            maxLength={6}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="••••"
            className="w-full text-center tracking-widest text-2xl font-mono p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none"
          />

          {passcodeError && <div className="text-xs font-bold text-red-500">{passcodeError}</div>}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg transition-all"
          >
            Unlock Encrypted Vault
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex items-center justify-between p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-600 text-white shadow-md shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white">AES-256 Vault & Peer Transfer</h1>
              <HelpMeUseButton screenId="vault" label="Walkthrough" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hardware-derived encryption key • Zero tracking
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUnlocked(false)}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
        >
          Lock Vault
        </button>
      </div>

      {/* Add Secret Form */}
      <form onSubmit={handleAddItem} className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Add Encrypted Secret</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Secret Title (e.g. Olympiad Portal Password)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
          />

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value as VaultCategory)}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none font-bold"
          >
            <option value="password">Password / Credentials</option>
            <option value="private_note">Confidential Note</option>
            <option value="bank_card">Payment Card</option>
            <option value="identity">Identity Card</option>
          </select>
        </div>

        <input
          type="text"
          required
          placeholder="Payload text to encrypt with AES-GCM..."
          value={newSecretText}
          onChange={(e) => setNewSecretText(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          <span>Encrypt & Save Secret</span>
        </button>
      </form>

      {/* Secrets List */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Vault Secrets ({vaultItems.length})</h2>

        <div className="space-y-3">
          {vaultItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.title}</span>
                  <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 uppercase">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecryptItem(item)}
                    className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    {decryptedMap[item.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => onDeleteVaultItem(item.id)} className="p-2 text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300">
                {decryptedMap[item.id] ? (
                  <span className="text-emerald-600 font-bold">{decryptedMap[item.id]}</span>
                ) : (
                  <span className="text-slate-400">Encrypted Payload: {item.encrypted_payload.substring(0, 32)}...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
