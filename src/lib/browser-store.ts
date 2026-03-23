import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Tab {
  id: string;
  url: string | null;
  title: string | null;
  favicon: string | null;
  isActive: boolean;
}

export interface Shortcut {
  id: string;
  name: string;
  url: string;
  icon: string | null;
  color: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string | null;
  favicon: string | null;
  visitedAt: string;
}

export interface BookmarkItem {
  id: string;
  url: string;
  title: string | null;
  favicon: string | null;
  createdAt: string;
}

export interface BrowserSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  // Privacy
  blockTrackers: boolean;
  blockAds: boolean;
  preventFingerprinting: boolean;
  doNotTrack: boolean;
  // Auto-delete
  autoDeleteHistoryHours: number;
  autoDeleteBookmarksDays: number;
  // Display
  resultsPerPage: number;
  fontSize: 'small' | 'medium' | 'large';
  showImages: boolean;
  showFavicons: boolean;
  openInNewTab: boolean;
  // Language
  language: 'id' | 'en';
  // Safe Search
  safeSearch: boolean;
  // Notifications
  showNotifications: boolean;
}

interface BrowserState {
  profileName: string;
  tabs: Tab[];
  activeTabId: string | null;
  shortcuts: Shortcut[];
  history: HistoryItem[];
  bookmarks: BookmarkItem[];
  settings: BrowserSettings;
  showSettings: boolean;
  showHistory: boolean;
  showBookmarks: boolean;
  isFirstVisit: boolean;
  
  setProfileName: (name: string) => void;
  addTab: () => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  
  addShortcut: (shortcut: Omit<Shortcut, 'id'>) => void;
  removeShortcut: (id: string) => void;
  
  addToHistory: (item: Omit<HistoryItem, 'id' | 'visitedAt'>) => void;
  clearHistory: () => void;
  cleanOldHistory: () => void;
  
  addBookmark: (item: Omit<BookmarkItem, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (url: string) => boolean;
  
  updateSettings: (updates: Partial<BrowserSettings>) => void;
  
  toggleSettings: () => void;
  toggleHistory: () => void;
  toggleBookmarks: () => void;
  setFirstVisit: (value: boolean) => void;
}

const defaultSettings: BrowserSettings = {
  theme: 'dark',
  accentColor: '#f97316',
  blockTrackers: true,
  blockAds: true,
  preventFingerprinting: true,
  doNotTrack: true,
  autoDeleteHistoryHours: 24,
  autoDeleteBookmarksDays: 30,
  resultsPerPage: 40,
  fontSize: 'medium',
  showImages: true,
  showFavicons: true,
  openInNewTab: true,
  language: 'id',
  safeSearch: false,
  showNotifications: true,
};

const defaultShortcuts: Shortcut[] = [
  { id: '1', name: 'YouTube', url: 'https://youtube.com', icon: null, color: '#ff0000' },
  { id: '2', name: 'Twitter', url: 'https://x.com', icon: null, color: '#1da1f2' },
  { id: '3', name: 'GitHub', url: 'https://github.com', icon: null, color: '#8b5cf6' },
  { id: '4', name: 'Reddit', url: 'https://reddit.com', icon: null, color: '#ff4500' },
  { id: '5', name: 'Twitch', url: 'https://twitch.tv', icon: null, color: '#9146ff' },
  { id: '6', name: 'Wikipedia', url: 'https://wikipedia.org', icon: null, color: '#6b7280' },
];

const generateId = () => Math.random().toString(36).substring(2, 11);

const cleanOldHistoryItems = (history: HistoryItem[], hours: number): HistoryItem[] => {
  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
  return history.filter(item => new Date(item.visitedAt) > cutoff);
};

export const useBrowserStore = create<BrowserState>()(
  persist(
    (set, get) => ({
      profileName: 'Brazer',
      tabs: [{ id: generateId(), url: null, title: 'New Tab', favicon: null, isActive: true }],
      activeTabId: null,
      shortcuts: defaultShortcuts,
      history: [],
      bookmarks: [],
      settings: defaultSettings,
      showSettings: false,
      showHistory: false,
      showBookmarks: false,
      isFirstVisit: true,
      
      setProfileName: (name) => set({ profileName: name }),
      
      addTab: () => {
        const newTab: Tab = { id: generateId(), url: null, title: 'New Tab', favicon: null, isActive: true };
        set(state => ({ tabs: [...state.tabs.map(t => ({ ...t, isActive: false })), newTab], activeTabId: newTab.id }));
      },
      
      closeTab: (id) => {
        const state = get();
        const newTabs = state.tabs.filter(t => t.id !== id);
        if (newTabs.length === 0) {
          const newTab: Tab = { id: generateId(), url: null, title: 'New Tab', favicon: null, isActive: true };
          set({ tabs: [newTab], activeTabId: newTab.id });
        } else {
          const tabIndex = state.tabs.findIndex(t => t.id === id);
          if (state.activeTabId === id) {
            const newIndex = Math.min(tabIndex, newTabs.length - 1);
            newTabs[newIndex].isActive = true;
            set({ tabs: newTabs, activeTabId: newTabs[newIndex].id });
          } else {
            set({ tabs: newTabs });
          }
        }
      },
      
      setActiveTab: (id) => set(state => ({ tabs: state.tabs.map(t => ({ ...t, isActive: t.id === id })), activeTabId: id })),
      updateTab: (id, updates) => set(state => ({ tabs: state.tabs.map(t => t.id === id ? { ...t, ...updates } : t) })),
      
      addShortcut: (shortcut) => set(state => ({ shortcuts: [...state.shortcuts, { ...shortcut, id: generateId() }] })),
      removeShortcut: (id) => set(state => ({ shortcuts: state.shortcuts.filter(s => s.id !== id) })),
      
      addToHistory: (item) => {
        const now = new Date().toISOString();
        set(state => {
          const cleaned = cleanOldHistoryItems(state.history, state.settings.autoDeleteHistoryHours);
          return { history: [{ ...item, id: generateId(), visitedAt: now }, ...cleaned].slice(0, 200) };
        });
      },
      
      clearHistory: () => set({ history: [] }),
      cleanOldHistory: () => set(state => ({ history: cleanOldHistoryItems(state.history, state.settings.autoDeleteHistoryHours) })),
      
      addBookmark: (item) => set(state => ({ bookmarks: [{ ...item, id: generateId(), createdAt: new Date().toISOString() }, ...state.bookmarks] })),
      removeBookmark: (id) => set(state => ({ bookmarks: state.bookmarks.filter(b => b.id !== id) })),
      isBookmarked: (url) => get().bookmarks.some(b => b.url === url),
      
      updateSettings: (updates) => set(state => {
        const newSettings = { ...state.settings, ...updates };
        let newHistory = state.history;
        if (updates.autoDeleteHistoryHours !== undefined) {
          newHistory = cleanOldHistoryItems(state.history, newSettings.autoDeleteHistoryHours);
        }
        return { settings: newSettings, history: newHistory };
      }),
      
      toggleSettings: () => set(state => ({ showSettings: !state.showSettings })),
      toggleHistory: () => set(state => ({ showHistory: !state.showHistory })),
      toggleBookmarks: () => set(state => ({ showBookmarks: !state.showBookmarks })),
      setFirstVisit: (value) => set({ isFirstVisit: value }),
    }),
    {
      name: 'brazer-browser-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        profileName: state.profileName,
        tabs: state.tabs,
        shortcuts: state.shortcuts,
        history: state.history,
        bookmarks: state.bookmarks,
        settings: state.settings,
        isFirstVisit: state.isFirstVisit,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.history = cleanOldHistoryItems(state.history, state.settings.autoDeleteHistoryHours);
        }
      },
    }
  )
);

// Auto-cleanup
if (typeof window !== 'undefined') {
  setInterval(() => useBrowserStore.getState().cleanOldHistory(), 60000);
}
