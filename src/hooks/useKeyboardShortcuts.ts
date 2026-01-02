import { useEffect } from 'react';

// ==========================================
// KEYBOARD SHORTCUTS HOOK
// ==========================================

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow Escape and Ctrl/Cmd shortcuts even in input fields
      const isEscape = event.key === 'Escape';
      const isCtrlShortcut = event.ctrlKey || event.metaKey;

      if (isInputField && !isEscape && !isCtrlShortcut) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : true;
        const shiftMatches = shortcut.shift ? event.shiftKey : true;
        const altMatches = shortcut.alt ? event.altKey : true;

        // Special handling for keys that shouldn't require exact modifier match
        const isSpecialKey = ['Escape', '/', '?'].includes(event.key);
        const modifiersMatch = isSpecialKey
          ? !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey
          : ctrlMatches && shiftMatches && altMatches;

        if (keyMatches && modifiersMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

// Helper to get modifier key display (Cmd on Mac, Ctrl on Windows/Linux)
export const getModifierKey = () => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  return isMac ? '⌘' : 'Ctrl';
};