'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Mic, Shield, History, Bookmark, 
  Plus, X, ChevronLeft, ChevronRight, MoreVertical, 
  Clock, Trash2, ExternalLink,
  Moon, Sun, Monitor, Globe, Zap, Lock, Eye,
  Home, Loader2, Unlock, Wifi, AlertCircle,
  ArrowLeft, ArrowRight, RefreshCw, Flame, Clock3,
  Timer, Settings2, Bell, Image, Globe2, ChevronFirst, ChevronLast,
  BookmarkCheck, Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useBrowserStore, type Shortcut, type HistoryItem } from '@/lib/browser-store';
import { toast } from 'sonner';

// Colors
const accentColors = [
  { name: 'Flame', value: '#f97316' },
  { name: 'Ember', value: '#ea580c' },
  { name: 'Fire', value: '#dc2626' },
  { name: 'Sunset', value: '#f59e0b' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Rose', value: '#f43f5e' },
];

interface SearchResult {
  id: number;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  date: string | null;
  favicon: string;
}

// Theme context
function useTheme(theme: 'dark' | 'light' | 'system') {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      if (theme === 'system') {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDark(theme === 'dark');
      }
    };

    updateTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  return isDark;
}

// Enhanced Entry Animation Component
function EntryAnimation({ onComplete, isDark }: { onComplete: () => void; isDark: boolean }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'exit'>('loading');

  useEffect(() => {
    const loadInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(loadInterval);
          setPhase('ready');
          return 100;
        }
        return p + 2;
      });
    }, 25);

    return () => clearInterval(loadInterval);
  }, []);

  useEffect(() => {
    if (phase === 'ready') {
      const timer = setTimeout(() => {
        setPhase('exit');
        setTimeout(onComplete, 400);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  // Pre-defined particles to avoid hydration mismatch
  const particles = useMemo(() => [
    { id: 0, delay: 0.5, duration: 3.2, x: 15, xOffset: 5, size: 6 },
    { id: 1, delay: 1.2, duration: 2.8, x: 25, xOffset: -8, size: 8 },
    { id: 2, delay: 0.3, duration: 3.5, x: 45, xOffset: 10, size: 5 },
    { id: 3, delay: 1.8, duration: 2.5, x: 65, xOffset: -5, size: 7 },
    { id: 4, delay: 0.8, duration: 3.0, x: 85, xOffset: 3, size: 6 },
    { id: 5, delay: 1.5, duration: 2.9, x: 35, xOffset: -10, size: 8 },
    { id: 6, delay: 0.2, duration: 3.3, x: 55, xOffset: 7, size: 5 },
    { id: 7, delay: 1.1, duration: 2.7, x: 75, xOffset: -3, size: 7 },
    { id: 8, delay: 0.6, duration: 3.1, x: 20, xOffset: 8, size: 6 },
    { id: 9, delay: 1.4, duration: 2.6, x: 40, xOffset: -6, size: 8 },
    { id: 10, delay: 0.4, duration: 3.4, x: 60, xOffset: 4, size: 5 },
    { id: 11, delay: 1.7, duration: 2.4, x: 80, xOffset: -7, size: 7 },
    { id: 12, delay: 0.9, duration: 3.2, x: 10, xOffset: 9, size: 6 },
    { id: 13, delay: 1.3, duration: 2.8, x: 30, xOffset: -4, size: 8 },
    { id: 14, delay: 0.1, duration: 3.6, x: 50, xOffset: 6, size: 5 },
    { id: 15, delay: 1.6, duration: 2.5, x: 70, xOffset: -9, size: 7 },
    { id: 16, delay: 0.7, duration: 3.0, x: 90, xOffset: 2, size: 6 },
    { id: 17, delay: 1.0, duration: 2.9, x: 5, xOffset: -11, size: 8 },
    { id: 18, delay: 0.35, duration: 3.3, x: 95, xOffset: 12, size: 5 },
    { id: 19, delay: 1.45, duration: 2.7, x: 12, xOffset: -2, size: 7 },
  ], []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'exit' ? 0 : 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden ${
        isDark ? 'bg-gray-950' : 'bg-white'
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-orange-950/30 via-gray-950 to-red-950/20' : 'bg-gradient-to-br from-orange-100/50 via-white to-amber-50/30'}`} />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-orange-500/20 to-transparent blur-3xl"
        />
      </div>

      {/* Floating fire particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: 100, opacity: 0, x: `${p.x}vw` }}
          animate={{
            y: -100,
            opacity: [0, 1, 1, 0],
            x: `${p.x + p.xOffset}vw`,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          className="absolute bottom-0"
        >
          <div 
            className="rounded-full bg-gradient-to-t from-orange-500 to-yellow-400"
            style={{ width: p.size, height: p.size }}
          />
        </motion.div>
      ))}

      {/* Main logo container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Fire icon with glow */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.1,
          }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-orange-500/40 blur-3xl rounded-full scale-150"
          />
          <motion.div
            animate={{ scale: [1.2, 1.5, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute inset-0 bg-amber-500/30 blur-3xl rounded-full scale-200"
          />
          
          <motion.span 
            className="relative text-9xl block"
            animate={{ 
              scale: [1, 1.05, 1],
              filter: ['drop-shadow(0 0 20px rgba(249, 115, 22, 0.8))', 'drop-shadow(0 0 40px rgba(249, 115, 22, 1))', 'drop-shadow(0 0 20px rgba(249, 115, 22, 0.8))'],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            🔥
          </motion.span>
        </motion.div>

        {/* BRAZER title */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
          className="text-5xl font-bold tracking-wider"
        >
          <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-red-400 bg-clip-text text-transparent">
            BRAZER
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={`mt-3 text-sm tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Browse freely. No limits. No tracking.
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '240px' }}
          transition={{ delay: 0.7, duration: 0.3 }}
          className={`mt-10 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800/80' : 'bg-gray-200'}`}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #f97316, #f59e0b, #ea580c)',
              width: `${progress}%`,
            }}
          />
        </motion.div>

        {/* Status text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className={`text-xs mt-4 tracking-wide ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
        >
          {phase === 'loading' ? (
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Initializing secure connection...
              </motion.span>
            </span>
          ) : (
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-orange-400 flex items-center gap-2"
            >
              <Shield className="w-3 h-3" /> Ready to browse freely!
            </motion.span>
          )}
        </motion.p>
      </div>

      {/* Bottom branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 text-center"
      >
        <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>v2.0 • Privacy-First Browser</p>
      </motion.div>
    </motion.div>
  );
}

// Enhanced Pagination Component - Shows ALL pages like Google
function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isDark
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
  isDark: boolean;
}) {
  // Generate all page numbers
  const getPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center gap-4 py-8 mt-8 border-t ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      }`}
    >
      {/* Google-style pagination */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentPage === 1
              ? 'opacity-30 cursor-not-allowed'
              : isDark
                ? 'text-orange-400 hover:bg-orange-500/10'
                : 'text-orange-500 hover:bg-orange-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        {/* Page Numbers - Show all */}
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {pages.map((page) => (
            <motion.button
              key={page}
              onClick={() => onPageChange(page)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`min-w-[40px] h-10 px-3 rounded-full text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {page}
            </motion.button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentPage === totalPages
              ? 'opacity-30 cursor-not-allowed'
              : isDark
                ? 'text-orange-400 hover:bg-orange-500/10'
                : 'text-orange-500 hover:bg-orange-50'
          }`}
        >
          Selanjutnya
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Page Info */}
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Halaman {currentPage} dari {totalPages}
      </p>
    </motion.div>
  );
}

// Enhanced Search Result Card with cleaner layout
function ResultCard({ result, onBookmark, isBookmarked, onVisit, index, isDark }: { 
  result: SearchResult; 
  onBookmark: () => void;
  isBookmarked: boolean;
  onVisit: () => void;
  index: number;
  isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group"
    >
      <Card className={`border transition-all duration-200 rounded-2xl overflow-hidden ${
        isDark 
          ? 'bg-gray-900/50 border-gray-800/40 hover:border-orange-500/50 hover:bg-gray-800/50' 
          : 'bg-white border-gray-200 hover:border-orange-400 hover:shadow-lg'
      }`}>
        <CardContent className="p-5">
          <div className="flex gap-4">
            {/* Favicon */}
            <div className="flex-shrink-0 pt-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden border shadow-lg ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <img
                  src={result.favicon}
                  alt=""
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = '<svg class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Domain */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-medium text-orange-400/90 hover:text-orange-300 cursor-pointer transition-colors">
                  {result.domain}
                </span>
                {result.date && (
                  <>
                    <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>•</span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{result.date}</span>
                  </>
                )}
              </div>
              
              {/* Title */}
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onVisit}
                className={`block text-lg font-semibold transition-colors line-clamp-2 mb-2 leading-snug ${
                  isDark 
                    ? 'text-white hover:text-orange-400' 
                    : 'text-gray-900 hover:text-orange-500'
                }`}
              >
                {result.title}
              </a>
              
              {/* Snippet */}
              <p className={`text-sm leading-relaxed line-clamp-2 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {result.snippet}
              </p>

              {/* URL display */}
              <div className={`flex items-center gap-2 text-xs transition-colors ${isDark ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-400 group-hover:text-gray-500'}`}>
                <Globe className="w-3 h-3" />
                <span className="truncate">{result.url}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0 pt-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBookmark}
                className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-gray-700/60' : 'hover:bg-gray-100'}`}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-orange-400" />
                ) : (
                  <Bookmark className={`w-5 h-5 transition-colors ${isDark ? 'text-gray-400 group-hover:text-orange-400' : 'text-gray-400 group-hover:text-orange-500'}`} />
                )}
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-xl transition-colors ${isDark ? 'hover:bg-gray-700/60' : 'hover:bg-gray-100'}`}
                title="Open in new tab"
              >
                <ExternalLink className="w-5 h-5 text-gray-400 hover:text-orange-400 transition-colors" />
              </motion.a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function BrazerBrowser() {
  const [showEntry, setShowEntry] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showAddShortcut, setShowAddShortcut] = useState(false);
  const [newShortcut, setNewShortcut] = useState({ name: '', url: '', color: '#f97316' });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // Search state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchType, setSearchType] = useState('web');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [trendingSearches, setTrendingSearches] = useState<{query: string; category: string}[]>([]);
  const [historyTimeLeft, setHistoryTimeLeft] = useState('');

  const {
    profileName,
    tabs,
    shortcuts,
    history,
    bookmarks,
    settings,
    showSettings,
    showHistory,
    showBookmarks,
    isFirstVisit,
    addTab,
    closeTab,
    setActiveTab,
    addShortcut,
    removeShortcut,
    addToHistory,
    clearHistory,
    addBookmark,
    removeBookmark,
    isBookmarked,
    updateSettings,
    toggleSettings,
    toggleHistory,
    toggleBookmarks,
    setFirstVisit,
    cleanOldHistory,
  } = useBrowserStore();

  // Theme
  const isDark = useTheme(settings.theme);

  // Initialize
  useEffect(() => {
    cleanOldHistory();
    
    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'trending' }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.trending) setTrendingSearches(data.trending);
      })
      .catch(() => {
        setTrendingSearches([
          { query: 'Technology news', category: 'Tech' },
          { query: 'World events', category: 'News' },
          { query: 'Gaming updates', category: 'Gaming' },
          { query: 'Entertainment', category: 'Fun' },
        ]);
      });
  }, [cleanOldHistory]);

  // History countdown
  useEffect(() => {
    const update = () => {
      if (history.length > 0 && history[history.length - 1]?.visitedAt) {
        const oldest = new Date(history[history.length - 1].visitedAt).getTime();
        const deleteAfter = settings.autoDeleteHistoryHours * 60 * 60 * 1000;
        const remaining = deleteAfter - (Date.now() - oldest);
        if (remaining > 0) {
          const h = Math.floor(remaining / (60 * 60 * 1000));
          const m = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
          setHistoryTimeLeft(`${h}h ${m}m`);
        } else {
          cleanOldHistory();
        }
      }
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [history, settings.autoDeleteHistoryHours, cleanOldHistory]);

  // Search
  const performSearch = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setShowResults(true);
    setSearchError(null);
    setShowSuggestions(false);
    
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        num: settings.resultsPerPage.toString(),
        type: searchType,
      });

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();
      
      if (data.success && data.results) {
        setSearchResults(data.results);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages || 1);
        setTotalResults(data.totalResults || 0);
        setHasMore(data.hasMore || false);
        
        if (page === 1) {
          addToHistory({
            url: `brazer://search?q=${encodeURIComponent(query)}`,
            title: `Search: ${query}`,
            favicon: null,
          });
        }
      } else {
        setSearchError(data.error || 'No results found. Try different keywords.');
      }
    } catch {
      setSearchError('Connection error. Please check your network.');
    } finally {
      setIsSearching(false);
    }
  }, [searchType, settings.resultsPerPage, addToHistory]);

  // Suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2 && !showResults) {
        try {
          const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'suggestions', query: searchQuery }),
          });
          const data = await res.json();
          if (data.suggestions) {
            setSuggestions(data.suggestions);
            setShowSuggestions(true);
          }
        } catch {
          setSuggestions([]);
        }
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, showResults]);

  // Voice
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SR = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SR();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = settings.language === 'id' ? 'id-ID' : 'en-US';
      recognitionRef.current.onresult = (e: any) => {
        setSearchQuery(e.results[0][0].transcript);
        performSearch(e.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => { setIsListening(false); toast.error('Voice error'); };
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [settings.language, performSearch]);

  const startVoice = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      toast.error('Voice not supported');
    }
  };

  // Shortcuts
  const handleShortcut = (s: Shortcut) => {
    addToHistory({ url: s.url, title: s.name, favicon: null });
    window.open(s.url, settings.openInNewTab ? '_blank' : '_self');
  };

  const handleAddShortcut = () => {
    if (!newShortcut.name || !newShortcut.url) {
      toast.error('Fill all fields');
      return;
    }
    let url = newShortcut.url;
    if (!url.startsWith('http')) url = 'https://' + url;
    addShortcut({ name: newShortcut.name, url, icon: null, color: newShortcut.color });
    setNewShortcut({ name: '', url: '', color: '#f97316' });
    setShowAddShortcut(false);
    toast.success('Added!');
  };

  // Navigate
  const navigate = (url: string) => {
    let finalUrl = url;
    if (!url.startsWith('http')) {
      if (url.includes('.') && !url.includes(' ')) {
        finalUrl = 'https://' + url;
      } else {
        performSearch(url);
        return;
      }
    }
    addToHistory({ url: finalUrl, title: finalUrl, favicon: null });
    window.open(finalUrl, settings.openInNewTab ? '_blank' : '_self');
  };

  // Pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      performSearch(searchQuery, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Font size class
  const fontSizeClass = useMemo(() => {
    switch (settings.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  }, [settings.fontSize]);

  // Theme icon
  const ThemeIcon = () => {
    if (settings.theme === 'system') return <Monitor className="w-4 h-4" />;
    if (settings.theme === 'dark') return <Moon className="w-4 h-4" />;
    return <Sun className="w-4 h-4" />;
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${fontSizeClass} ${
      isDark 
        ? 'bg-gradient-to-br from-gray-950 via-zinc-900 to-gray-950 text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
    }`}>
      {/* Entry Animation */}
      <AnimatePresence>
        {showEntry && isFirstVisit && (
          <EntryAnimation onComplete={() => { setShowEntry(false); setFirstVisit(false); }} isDark={isDark} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isDark ? 'bg-gray-950/95 border-gray-800/30' : 'bg-white/95 border-gray-200'}`}>
        {/* Tabs */}
        <div className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl min-w-[80px] max-w-[120px] cursor-pointer transition-all ${
                tab.isActive 
                  ? 'bg-orange-500/10 ring-1 ring-orange-500/40' 
                  : isDark
                    ? 'bg-gray-800/40 hover:bg-gray-800/60'
                    : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={`flex-1 truncate text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{tab.title || 'New'}</span>
              <button onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} className={`p-0.5 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}>
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
          <button onClick={addTab} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-gray-800/60' : 'hover:bg-gray-200'}`}>
            <Plus className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={() => {
              const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
              const currentIndex = themes.indexOf(settings.theme);
              const nextTheme = themes[(currentIndex + 1) % themes.length];
              updateSettings({ theme: nextTheme });
              toast.success(`Theme: ${nextTheme}`);
            }}
          >
            <ThemeIcon />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight className="w-4 h-4" /></Button>
        </div>
        
        {/* Search Bar */}
        <div className="px-3 pb-3">
          <div className="relative">
            <div className={`flex items-center rounded-2xl px-4 py-2.5 gap-3 border transition-all ${
              isDark 
                ? 'bg-gray-900/90 border-gray-800/50 focus-within:border-orange-500/50 focus-within:ring-2 focus-within:ring-orange-500/20' 
                : 'bg-white border-gray-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/20'
            }`}>
              <span className="text-xl">🔥</span>
              
              <div className="flex-1 relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search the web freely..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setShowSuggestions(false);
                      if (searchQuery.includes('.') && !searchQuery.includes(' ')) {
                        navigate(searchQuery);
                      } else {
                        performSearch(searchQuery);
                      }
                    }
                  }}
                  className={`w-full bg-transparent border-0 focus:ring-0 focus:outline-none ${isDark ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
                />
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && !showResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-2xl overflow-hidden z-50 ${
                        isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                      }`}
                    >
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => { setSearchQuery(s); setShowSuggestions(false); performSearch(s); }}
                          className={`w-full px-4 py-3 text-left flex items-center gap-3 ${isDark ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                        >
                          <Search className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span>{s}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button onClick={startVoice} className={`p-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                <Mic className={`w-4 h-4 ${isListening ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
              
              <button onClick={() => { setShowSuggestions(false); performSearch(searchQuery); }} className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400">
                <Search className="w-4 h-4 text-white" />
              </button>
              
              <Sheet open={showSettings} onOpenChange={toggleSettings}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                </SheetTrigger>
                <SheetContent className={`${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} w-[340px] overflow-y-auto`}>
                  <SheetHeader>
                    <SheetTitle className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <Settings2 className="w-5 h-5 text-orange-500" />
                      Settings
                    </SheetTitle>
                  </SheetHeader>
                  <SettingsPanel 
                    settings={settings} 
                    updateSettings={updateSettings} 
                    profileName={profileName} 
                    historyTimeLeft={historyTimeLeft} 
                    historyCount={history.length}
                    bookmarksCount={bookmarks.length}
                    clearHistoryFn={clearHistory}
                    isDark={isDark}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto px-4 py-4">
          
          {showResults ? (
            /* Search Results */
            <div>
              {/* Header */}
              <div className={`flex items-center justify-between mb-5 sticky top-0 backdrop-blur-sm py-3 z-10 ${isDark ? 'bg-gray-950/90' : 'bg-white/90'}`}>
                <button onClick={() => { setShowResults(false); setSearchResults([]); setSearchQuery(''); }} className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> <span>Home</span>
                </button>
                
                <div className={`flex items-center gap-1 rounded-xl p-1 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                  {['web', 'news', 'images', 'videos'].map((t) => (
                    <button key={t} onClick={() => { setSearchType(t); performSearch(searchQuery, 1); }} className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${searchType === t ? 'bg-orange-500/20 text-orange-400' : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Query Info */}
              <div className="mb-6">
                <h2 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Results for &quot;{searchQuery}&quot;
                </h2>
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  Found {totalResults.toLocaleString()} results
                  {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                </p>
              </div>
              
              {/* Loading */}
              {isSearching && (
                <div className="flex flex-col items-center py-20">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                    <Loader2 className="w-12 h-12 text-orange-500" />
                  </motion.div>
                  <p className={isDark ? 'text-gray-400 mt-4' : 'text-gray-500 mt-4'}>Searching the free web...</p>
                </div>
              )}
              
              {/* Error */}
              {searchError && !isSearching && (
                <div className="flex flex-col items-center py-20 text-center">
                  <AlertCircle className="w-14 h-14 text-red-400 mb-4" />
                  <p className="text-red-400 mb-2">{searchError}</p>
                  <Button variant="outline" onClick={() => performSearch(searchQuery, currentPage)} className={`mt-3 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                  </Button>
                </div>
              )}
              
              {/* Results */}
              {!isSearching && !searchError && searchResults.length > 0 && (
                <>
                  <div className="space-y-4">
                    {searchResults.map((result, i) => (
                      <ResultCard
                        key={`${result.id}-${i}`}
                        result={result}
                        index={i}
                        isDark={isDark}
                        isBookmarked={isBookmarked(result.url)}
                        onBookmark={() => {
                          if (isBookmarked(result.url)) {
                            const bm = bookmarks.find(b => b.url === result.url);
                            if (bm) removeBookmark(bm.id);
                          } else {
                            addBookmark({ url: result.url, title: result.title, favicon: result.favicon });
                          }
                        }}
                        onVisit={() => addToHistory({ url: result.url, title: result.title, favicon: result.favicon })}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} isDark={isDark} />
                </>
              )}
            </div>
          ) : (
            /* Home */
            <>
              {/* Logo */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative inline-block">
                  <div className="absolute inset-0 bg-orange-500/30 blur-3xl rounded-full animate-pulse" />
                  <span className="relative text-7xl">🔥</span>
                </motion.div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-red-400 bg-clip-text text-transparent mt-3 mb-1">
                  BRAZER
                </h1>
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Browse freely. No limits. No tracking.</p>
              </motion.div>

              {/* Badges */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap justify-center gap-2 mb-6">
                {[
                  { icon: Unlock, label: 'Unrestricted', color: 'orange' },
                  { icon: Shield, label: 'Private', color: 'amber' },
                  { icon: Eye, label: 'No Tracking', color: 'red' },
                  { icon: Timer, label: 'Auto-Delete', color: 'yellow' },
                ].map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }}>
                    <Badge variant="outline" className={`bg-${item.color}-500/10 border-${item.color}-500/30 text-${item.color}-400 px-3 py-1.5`}>
                      <item.icon className="w-3 h-3 mr-1.5" /> {item.label}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>

              {/* Features */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
                <Card className={`border ${isDark ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/40 border-gray-700/30' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { icon: Lock, label: 'Secure', desc: 'Encrypted' },
                        { icon: Eye, label: 'Invisible', desc: 'No tracking' },
                        { icon: Wifi, label: 'Unlimited', desc: 'Full access' },
                        { icon: Zap, label: 'Fast', desc: 'Optimized' },
                      ].map((f) => (
                        <div key={f.label} className="text-center">
                          <div className="w-11 h-11 mx-auto rounded-xl bg-orange-500/10 flex items-center justify-center mb-2">
                            <f.icon className="w-5 h-5 text-orange-400" />
                          </div>
                          <p className="text-sm font-medium">{f.label}</p>
                          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Access */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Quick Access</h3>
                  <Dialog open={showAddShortcut} onOpenChange={setShowAddShortcut}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-orange-400 h-7 text-xs"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                    </DialogTrigger>
                    <DialogContent className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                      <DialogHeader><DialogTitle>Add Shortcut</DialogTitle></DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Name</Label>
                          <Input value={newShortcut.name} onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} mt-1`} />
                        </div>
                        <div>
                          <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>URL</Label>
                          <Input value={newShortcut.url} onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value })} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'} mt-1`} />
                        </div>
                        <div>
                          <Label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} block mb-2`}>Color</Label>
                          <div className="flex gap-2 flex-wrap">
                            {accentColors.map((c) => (
                              <button key={c.value} onClick={() => setNewShortcut({ ...newShortcut, color: c.value })} className={`w-7 h-7 rounded-full border-2 ${newShortcut.color === c.value ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.value }} />
                            ))}
                          </div>
                        </div>
                        <Button onClick={handleAddShortcut} className="w-full bg-gradient-to-r from-orange-500 to-amber-500">Add</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {shortcuts.map((s, i) => (
                    <motion.div key={s.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} className="group relative">
                      <button onClick={() => handleShortcut(s)} className="w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 p-2 transition-all hover:scale-105" style={{ backgroundColor: `${s.color}15` }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg" style={{ backgroundColor: s.color }}>{s.name.charAt(0).toUpperCase()}</div>
                        <span className={`text-[11px] truncate w-full text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.name}</span>
                      </button>
                      <button onClick={() => { removeShortcut(s.id); toast.success('Removed'); }} className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-2.5 h-2.5 text-white" /></button>
                    </motion.div>
                  ))}
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowAddShortcut(true)} className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 p-2 border-2 border-dashed transition-colors ${isDark ? 'border-gray-700/50 hover:border-orange-500/50' : 'border-gray-300 hover:border-orange-400'}`}>
                    <Plus className={`w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Add</span>
                  </motion.button>
                </div>
              </motion.section>

              {/* Trending */}
              {trendingSearches.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Trending</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.slice(0, 8).map((t, i) => (
                      <motion.button key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }} onClick={() => { setSearchQuery(t.query); performSearch(t.query); }} className={`px-4 py-2 rounded-full border text-sm transition-all ${isDark ? 'bg-gray-800/50 hover:bg-gray-700/50 border-gray-700/50 hover:border-orange-500/30 text-gray-300 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-orange-400 text-gray-600 hover:text-gray-900'}`}>
                        {t.query}
                      </motion.button>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* History */}
              {history.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock3 className="w-4 h-4 text-orange-400" />
                      <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Recent</h3>
                      {historyTimeLeft && (
                        <Badge variant="outline" className={`text-[10px] ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
                          <Timer className="w-3 h-3 mr-1" /> {historyTimeLeft}
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { clearHistory(); toast.success('Cleared'); }} className="text-red-400 h-7 text-xs">
                      <Trash2 className="w-3 h-3 mr-1" /> Clear
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    {history.slice(0, 6).map((item) => (
                      <button key={item.id} onClick={() => {
                        if (item.url.startsWith('brazer://')) {
                          const q = new URLSearchParams(item.url.split('?')[1]).get('q');
                          if (q) { setSearchQuery(q); performSearch(q); }
                        } else {
                          window.open(item.url, '_blank');
                        }
                      }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${isDark ? 'bg-gray-800/30 hover:bg-gray-800/50' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        <Globe className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`flex-1 text-sm truncate text-left ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.title || item.url}</span>
                        <ExternalLink className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      </button>
                    ))}
                  </div>
                </motion.section>
              )}
            </>
          )}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t px-6 py-2 safe-area-inset-bottom ${isDark ? 'bg-gray-950/95 border-gray-800/30' : 'bg-white/95 border-gray-200'}`}>
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Button variant="ghost" size="icon" className="flex flex-col gap-0.5 h-auto py-1.5" onClick={() => { setShowResults(false); setSearchResults([]); }}>
            <Home className="w-5 h-5 text-orange-400" />
            <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Home</span>
          </Button>
          
          <Sheet open={showHistory} onOpenChange={toggleHistory}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="flex flex-col gap-0.5 h-auto py-1.5">
                <History className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>History</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className={`${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} h-[70vh] rounded-t-3xl`}>
              <SheetHeader><SheetTitle className="text-center">History</SheetTitle></SheetHeader>
              <div className={`px-4 py-2 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {history.length} items • Auto-delete in {historyTimeLeft || '24h'}
              </div>
              <ScrollArea className="h-[calc(100%-100px)] px-4">
                {history.length === 0 ? (
                  <div className="text-center py-8 text-gray-500"><History className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>No history</p></div>
                ) : (
                  <div className="space-y-1">
                    {history.map((item) => (
                      <button key={item.id} onClick={() => { if (!item.url.startsWith('brazer://')) window.open(item.url, '_blank'); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl ${isDark ? 'bg-gray-800/30 hover:bg-gray-800/50' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        <Globe className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.title || item.url}</span>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>
          
          <Button variant="ghost" size="icon" className="flex flex-col gap-0.5 h-auto py-1.5" onClick={() => searchInputRef.current?.focus()}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center -mt-8 shadow-lg shadow-orange-500/20">
              <Search className="w-5 h-5 text-white" />
            </div>
          </Button>
          
          <Sheet open={showBookmarks} onOpenChange={toggleBookmarks}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="flex flex-col gap-0.5 h-auto py-1.5">
                <Bookmark className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Saved</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className={`${isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'} h-[70vh] rounded-t-3xl`}>
              <SheetHeader><SheetTitle className="text-center">Bookmarks</SheetTitle></SheetHeader>
              <div className={`px-4 py-2 text-center text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{bookmarks.length} saved</div>
              <ScrollArea className="h-[calc(100%-100px)] px-4">
                {bookmarks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500"><Bookmark className="w-12 h-12 mx-auto mb-2 opacity-50" /><p>No bookmarks</p></div>
                ) : (
                  <div className="space-y-1">
                    {bookmarks.map((item) => (
                      <div key={item.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
                        <Globe className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className={`flex-1 text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{item.title || item.url}</a>
                        <button onClick={() => { removeBookmark(item.id); toast.success('Removed'); }} className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}><X className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>
          
          <Button variant="ghost" size="icon" className="flex flex-col gap-0.5 h-auto py-1.5">
            <Shield className="w-5 h-5 text-orange-400" />
            <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Privacy</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}

// Settings Panel
function SettingsPanel({ 
  settings, 
  updateSettings, 
  profileName, 
  historyTimeLeft, 
  historyCount,
  bookmarksCount,
  clearHistoryFn,
  isDark
}: { 
  settings: any; 
  updateSettings: (u: any) => void; 
  profileName: string;
  historyTimeLeft: string;
  historyCount: number;
  bookmarksCount: number;
  clearHistoryFn: () => void;
  isDark: boolean;
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  return (
    <div className="space-y-6 mt-4">
      {/* Profile */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-xl font-bold text-white">
          {profileName.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-lg">{profileName}</p>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Free Explorer</p>
        </div>
      </div>

      {/* Theme Selection */}
      <div>
        <h4 className={`text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <Sun className="w-3.5 h-3.5" /> Theme
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { key: 'light', label: 'Light', icon: Sun },
            { key: 'dark', label: 'Dark', icon: Moon },
            { key: 'system', label: 'System', icon: Monitor },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => updateSettings({ theme: item.key })}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl text-sm transition-all ${
                settings.theme === item.key
                  ? 'bg-orange-500/20 border border-orange-500 text-orange-400'
                  : isDark
                    ? 'bg-gray-800/30 border border-transparent hover:bg-gray-800/50'
                    : 'bg-gray-100 border border-transparent hover:bg-gray-200'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Delete */}
      <div>
        <h4 className={`text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <Timer className="w-3.5 h-3.5" /> Auto-Delete History
        </h4>
        <Card className={`${isDark ? 'bg-gray-800/30 border-gray-700/30' : 'bg-gray-100 border-gray-200'}`}>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-sm">Delete history after</Label>
              <Select value={settings.autoDeleteHistoryHours?.toString() || '24'} onValueChange={(v) => updateSettings({ autoDeleteHistoryHours: parseInt(v) })}>
                <SelectTrigger className={`mt-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="6">6 hours</SelectItem>
                  <SelectItem value="12">12 hours</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="72">3 days</SelectItem>
                  <SelectItem value="168">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className={`flex items-center justify-between text-sm rounded-lg px-3 py-2 ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{historyCount} history items</span>
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Expires: {historyTimeLeft || '24h'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Display */}
      <div>
        <h4 className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Display</h4>
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
            <div>
              <p className="text-sm">Results per page</p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Number of search results</p>
            </div>
            <Select value={settings.resultsPerPage?.toString() || '40'} onValueChange={(v) => updateSettings({ resultsPerPage: parseInt(v) })}>
              <SelectTrigger className={`w-20 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
            <div>
              <p className="text-sm">Font size</p>
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Text size preference</p>
            </div>
            <Select value={settings.fontSize || 'medium'} onValueChange={(v) => updateSettings({ fontSize: v })}>
              <SelectTrigger className={`w-24 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
            <div>
              <p className="text-sm">Open links in new tab</p>
            </div>
            <Switch checked={settings.openInNewTab} onCheckedChange={(c) => updateSettings({ openInNewTab: c })} />
          </div>
          
          <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
            <div>
              <p className="text-sm">Show favicons</p>
            </div>
            <Switch checked={settings.showFavicons} onCheckedChange={(c) => updateSettings({ showFavicons: c })} />
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div>
        <h4 className={`text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <Shield className="w-3.5 h-3.5" /> Privacy
        </h4>
        <div className="space-y-1">
          {[
            { key: 'blockTrackers', label: 'Block Trackers', desc: 'Stop tracking scripts' },
            { key: 'blockAds', label: 'Block Ads', desc: 'Remove advertisements' },
            { key: 'preventFingerprinting', label: 'Anti-Fingerprinting', desc: 'Prevent identification' },
            { key: 'doNotTrack', label: 'Do Not Track', desc: 'Request no tracking' },
          ].map((item) => (
            <div key={item.key} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isDark ? 'bg-gray-800/30 hover:bg-gray-800/50' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <div>
                <p className="text-sm">{item.label}</p>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
              </div>
              <Switch checked={settings[item.key]} onCheckedChange={(c) => updateSettings({ [item.key]: c })} />
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <h4 className={`text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <Globe2 className="w-3.5 h-3.5" /> Language
        </h4>
        <div className="flex gap-2">
          <button onClick={() => updateSettings({ language: 'id' })} className={`flex-1 p-3 rounded-xl text-sm transition-all ${settings.language === 'id' ? 'bg-orange-500/20 border border-orange-500' : isDark ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
            🇮🇩 Indonesia
          </button>
          <button onClick={() => updateSettings({ language: 'en' })} className={`flex-1 p-3 rounded-xl text-sm transition-all ${settings.language === 'en' ? 'bg-orange-500/20 border border-orange-500' : isDark ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
            🇺🇸 English
          </button>
        </div>
      </div>

      {/* Color */}
      <div>
        <h4 className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Accent Color</h4>
        <div className={`flex gap-2 flex-wrap p-3 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-100'}`}>
          {accentColors.map((c) => (
            <button key={c.value} onClick={() => updateSettings({ accentColor: c.value })} className={`w-8 h-8 rounded-full border-2 transition-all ${settings.accentColor === c.value ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c.value }} />
          ))}
        </div>
      </div>

      {/* Data */}
      <div>
        <h4 className={`text-xs font-medium uppercase tracking-wider mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Data</h4>
        <div className="space-y-2">
          <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
            <DialogTrigger asChild>
              <Button variant="outline" className={`w-full text-red-400 ${isDark ? 'bg-gray-800/30 border-gray-700 hover:bg-red-500/10' : 'bg-gray-100 border-gray-200 hover:bg-red-500/10'}`}>
                <Trash className="w-4 h-4 mr-2" /> Clear All History
              </Button>
            </DialogTrigger>
            <DialogContent className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
              <DialogHeader><DialogTitle>Clear History?</DialogTitle></DialogHeader>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>This will delete all {historyCount} history items. This cannot be undone.</p>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowClearConfirm(false)} className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}>Cancel</Button>
                <Button onClick={() => { clearHistoryFn(); setShowClearConfirm(false); toast.success('History cleared'); }} className="bg-red-500 hover:bg-red-600">Clear</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* About */}
      <div className={`text-center py-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <p className="flex items-center justify-center gap-2 text-orange-400">
          <span className="text-lg">🔥</span>
          <span className="font-semibold">BRAZER</span>
        </p>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Browse freely. No limits.</p>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>v2.0.0</p>
      </div>
    </div>
  );
}
