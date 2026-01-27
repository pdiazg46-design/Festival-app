"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";
import festivals from "../data/festivals.json";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useUser } from "../context/UserContext";
import UpgradeModal from "../components/UpgradeModal";
import { Lock } from "lucide-react";
import { useState } from "react";

function ThemeAnalysisContent() {
    const { t, language } = useLanguage();
    const { isPremium } = useUser();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Filter festivals based on Premium Status
    const availableFestivals = isPremium
        ? festivals
        : festivals.filter(f => f.region === "Chile");

    // Aggregate themes based on current language
    const themeCounts: Record<string, number> = {};

    availableFestivals.forEach(f => {
        f.winners.forEach(w => {
            // Helper to extract theme string depending on structure
            const extract = (th: any) => typeof th === 'object' ? th[language] : th;

            const themes = Array.isArray(w.theme)
                ? w.theme.map(extract)
                : [extract(w.theme)];

            themes.forEach(t => {
                if (!t || t === "Unknown" || t === "Desconocido") return;
                themeCounts[t] = (themeCounts[t] || 0) + 1;
            });
        });
    });

    // Convert to array and sort
    const sortedThemes = Object.entries(themeCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }));

    const maxCount = sortedThemes[0]?.count || 1;

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8 relative">
            {showUpgradeModal && <UpgradeModal />}
            <LanguageSwitcher />
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <Link href="/" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors shrink-0">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500">
                            {t.analysis_title}
                        </h1>
                        <p className="text-neutral-400 text-sm md:text-base mt-1">
                            {t.analysis_desc}
                        </p>
                    </div>
                </header>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-8">
                    <div className="flex items-center gap-2 mb-6 text-amber-500">
                        <TrendingUp size={24} />
                        <h2 className="text-xl font-bold">{t.ranking_title}</h2>
                    </div>

                    <div className="space-y-6">
                        {!isPremium && (
                            <div onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-neutral-900 to-neutral-900 border border-amber-500/30 p-6 rounded-xl cursor-pointer hover:border-amber-500 transition-colors group relative overflow-hidden mb-6">
                                <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-amber-500/20 rounded-full text-amber-500">
                                            <Lock size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">
                                                {language === 'en' ? 'Unlock Global Trends' : 'Desbloquea Tendencias Globales'}
                                            </h3>
                                            <p className="text-neutral-400 text-sm">
                                                {language === 'en' ? 'See what is winning worldwide.' : 'Mira qué está ganando en todo el mundo.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {sortedThemes.map((theme, idx) => (
                            <Link
                                href={`/festivals?theme=${encodeURIComponent(theme.name)}`}
                                key={theme.name}
                                className="relative block group cursor-pointer"
                            >
                                <div className="flex justify-between items-end mb-1 text-sm font-medium">
                                    <span className="flex items-center gap-2">
                                        <span className="text-neutral-500 w-4 text-right">{idx + 1}.</span>
                                        <span className="text-neutral-200 group-hover:text-amber-400 transition-colors">{theme.name}</span>
                                    </span>
                                    <span className="text-amber-500 font-bold">{theme.count} {t.awards}</span>
                                </div>

                                <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                                        style={{ width: `${(theme.count / maxCount) * 100}%` }}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-neutral-950/50 rounded-lg border border-neutral-800 text-sm text-neutral-400 leading-relaxed">
                        <strong className="text-neutral-200">{t.insight_label}</strong> {t.insight_text.replace("{highlight}", t.highlight_text).split(t.highlight_text).map((part, i, arr) => (
                            <span key={i}>
                                {part}
                                {i < arr.length - 1 && <span className="text-amber-400">{t.highlight_text}</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ThemeAnalysis() {
    return (
        <LanguageProvider>
            <ThemeAnalysisContent />
        </LanguageProvider>
    );
}
