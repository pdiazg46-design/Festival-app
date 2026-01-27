"use client";

import Link from "next/link";
import { ArrowLeft, Lightbulb, CheckCircle2, AlertCircle, Trophy } from "lucide-react";
import festivals from "../data/festivals.json";
import { useState } from "react";
import { cn } from "../lib/utils";
import { LanguageProvider, useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useUser } from "../context/UserContext"; // Import useUser

function RecommendStrategyContent() {
    const { t, language } = useLanguage();
    const { isPremium } = useUser(); // Get premium status
    const [selectedFestival, setSelectedFestival] = useState("");

    // Filter festivals based on premium status
    const availableFestivals = isPremium
        ? festivals
        : festivals.filter(f => f.region === "Chile");

    const festivalData = availableFestivals.find(f => f.id === selectedFestival);

    // Logic to find top themes for selected festival
    const topThemes = festivalData ?
        Object.entries(
            festivalData.winners.flatMap(w => {
                const extract = (th: any) => typeof th === 'object' ? th[language] : th;
                return Array.isArray(w.theme) ? w.theme.map(extract) : [extract(w.theme)];
            })
                .reduce((acc, theme) => {
                    if (!theme || theme === "Unknown" || theme === "Desconocido") return acc;
                    acc[theme] = (acc[theme] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>)
        ).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 3)
        : [];

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
            <LanguageSwitcher />
            <div className="max-w-2xl mx-auto space-y-8">
                <header className="flex items-center gap-4">
                    <Link href="/" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                            {t.recommender_title}
                        </h1>
                        <p className="text-neutral-400">
                            {t.recommender_desc}
                        </p>
                    </div>
                </header>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">{t.rec_select_festival}</label>
                        <select
                            value={selectedFestival}
                            onChange={(e) => setSelectedFestival(e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-200 focus:outline-none focus:border-purple-500 transition-colors"
                        >
                            <option value="" disabled>{t.rec_choose}</option>
                            {availableFestivals.map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </div>

                    {selectedFestival && festivalData && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-purple-500/20 rounded-full text-purple-400">
                                        <Lightbulb size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{t.rec_strategy}</h3>
                                        <p className="text-neutral-300 text-sm mb-4">
                                            {t.rec_based_on} <strong>{festivalData.name}</strong>, {t.rec_intro}
                                        </p>

                                        {topThemes.length > 0 ? (
                                            <ul className="space-y-3">
                                                {topThemes.map(([theme, count]: [string, any], idx: number) => (
                                                    <li key={theme} className="flex items-center gap-3 bg-neutral-950/50 p-3 rounded-md border border-purple-500/10">
                                                        <div className={cn(
                                                            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                                                            idx === 0 ? "bg-yellow-500 text-black" : "bg-neutral-700 text-neutral-300"
                                                        )}>
                                                            {idx + 1}
                                                        </div>
                                                        <span className="font-medium text-purple-200">{theme}</span>
                                                        <span className="text-xs text-neutral-500 ml-auto">{count} {t.rec_prev_winners}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 p-3 rounded text-sm">
                                                <AlertCircle size={16} />
                                                {t.rec_insufficient}
                                            </div>
                                        )}

                                        <div className="mt-10 pt-8 border-t border-purple-500/30">
                                            <div className="bg-gradient-to-br from-amber-500/20 to-yellow-600/5 rounded-2xl border border-amber-500/40 p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 -m-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                    <Trophy size={120} />
                                                </div>
                                                <div className="flex items-start gap-5 relative z-10">
                                                    <div className="p-3 bg-amber-500 text-black rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                                                        <CheckCircle2 size={24} strokeWidth={3} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-amber-400 font-black uppercase tracking-[0.2em] text-xs">
                                                                {t.rec_tip}
                                                            </span>
                                                            <div className="h-px w-12 bg-amber-500/30"></div>
                                                        </div>
                                                        <p className="text-white text-lg font-bold leading-tight">
                                                            {
                                                                festivalData.description[language].toLowerCase().includes(language === 'en' ? "experim" : "experim")
                                                                    ? t.rec_tip_exp
                                                                    : t.rec_tip_soc
                                                            }
                                                        </p>
                                                        <p className="text-neutral-200 text-sm md:text-base leading-relaxed max-w-xl">
                                                            {t.insight_text.replace("{highlight}", t.highlight_text).split(t.highlight_text).map((part, i, arr) => (
                                                                <span key={i}>
                                                                    {part}
                                                                    {i < arr.length - 1 && <span className="text-amber-400 font-bold">{t.highlight_text}</span>}
                                                                </span>
                                                            ))}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function RecommendStrategy() {
    return <RecommendStrategyContent />;
}
