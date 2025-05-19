import { create } from 'zustand';

type TranslationKey = 'home' | 'workouts' | 'goals' | 'profile';

interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: TranslationKey) => string;
}

const translations = {
  ja: {
    // ここに日本語の翻訳を追加
    'home': 'ホーム',
    'workouts': 'ワークアウト',
    'goals': '目標',
    'profile': 'プロフィール',
  },
  en: {
    // ここに英語の翻訳を追加
    'home': 'Home',
    'workouts': 'Workouts',
    'goals': 'Goals',
    'profile': 'Profile',
  }
} as const;

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'ja', // デフォルトは日本語
  setLanguage: (language) => set({ language }),
  t: (key: TranslationKey) => {
    const { language } = get();
    return translations[language as keyof typeof translations]?.[key] || key;
  },
})); 