"use client";

import Link from "next/link";
import { ArrowLeft, BarChart2, PieChart, TrendingUp, DollarSign, Globe, Film } from "lucide-react";
import localFestivals from "../data/festivals.json";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { cn } from "../lib/utils";

import { useUser } from "../context/UserContext";

export default function StatisticsDashboard() {
    const { t, language } = useLanguage();
    const { isPremium } = useUser();

    // Filter festivals based on Premium Status
    const allFestivals = localFestivals as any[];
    const festivals = isPremium ? allFestivals : allFestivals.filter(f => f.region === "Chile");

    // --- CALCULATIONS ---

    // 1. Total & Status Counts
    const totalCount = festivals.length;
    const statusCounts = festivals.reduce((acc, f) => {
        const s = f.status || "Unknown";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // 2. Region Distribution
    const regionCounts = festivals.reduce((acc, f) => {
        const r = f.region || "Unknown";
        acc[r] = (acc[r] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Sort regions by count desc
    const sortedRegions = Object.entries(regionCounts).sort(([, a], [, b]) => (b as number) - (a as number));

    // 3. Free vs Paid
    let freeCount = 0;
    let paidCount = 0;
    let totalFee = 0;

    festivals.forEach(f => {
        const fee = f.fee;
        const isFree = !fee || fee === "0" || fee === "0.0" || fee.toString().toLowerCase() === "free";
        if (isFree) {
            freeCount++;
        } else {
            paidCount++;
            totalFee += parseFloat(fee) || 0;
        }
    });

    const avgFee = paidCount > 0 ? (totalFee / paidCount).toFixed(2) : "0.00";

    // 4. Genre Popularity
    const genreCounts = festivals.reduce((acc, f) => {
        const genres = f.genres || [];
        genres.forEach((g: string) => {
            acc[g] = (acc[g] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const topGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 8); // Top 8

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
            <LanguageSwitcher />
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <Link href="/" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors shrink-0">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                                {language === 'en' ? 'Strategy Dashboard' : 'Dashboard Estratégico'}
                            </h1>
                        </div>
                        <p className="text-neutral-400 text-sm md:text-base mt-1">
                            {language === 'en' ? 'Analyze the festival landscape to optimize your strategy.' : 'Analiza el panorama de festivales para optimizar tu estrategia.'}
                        </p>
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-neutral-400 text-sm font-medium uppercase">{language === 'en' ? 'Total Database' : 'Base de Datos'}</h3>
                            <Film size={18} className="text-neutral-600" />
                        </div>
                        <div className="text-3xl font-bold">{totalCount}</div>
                        <div className="text-xs text-neutral-500 mt-1">{language === 'en' ? 'Festivals Tracked' : 'Festivales Rastreados'}</div>
                    </div>

                    <Link href="/festivals" className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl block hover:border-emerald-500/50 transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-neutral-400 text-sm font-medium uppercase">{language === 'en' ? 'Open Now' : 'Abiertos Hoy'}</h3>
                            <TrendingUp size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-3xl font-bold text-emerald-400">{statusCounts["Open"] || 0}</div>
                        <div className="text-xs text-neutral-500 mt-1 group-hover:text-emerald-500/80 transition-colors">{language === 'en' ? 'Click to view list' : 'Ver lista completa'} →</div>
                    </Link>

                    <Link href="/festivals" className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl block hover:border-blue-500/50 transition-colors group">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-neutral-400 text-sm font-medium uppercase">{language === 'en' ? 'Free Opportunities' : 'Oportunidades Gratis'}</h3>
                            <DollarSign size={18} className="text-blue-500 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-3xl font-bold text-blue-400">{freeCount}</div>
                        <div className="text-xs text-neutral-500 mt-1">{language === 'en' ? `${((freeCount / totalCount) * 100).toFixed(0)}% of total` : `${((freeCount / totalCount) * 100).toFixed(0)}% del total`}</div>
                    </Link>

                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-neutral-400 text-sm font-medium uppercase">{language === 'en' ? 'Avg. Entry Fee' : 'Costo Promedio'}</h3>
                            <DollarSign size={18} className="text-neutral-600" />
                        </div>
                        <div className="text-3xl font-bold">
                            {language === 'en'
                                ? `$${avgFee}`
                                : `$${(parseFloat(avgFee) * 950).toLocaleString('es-CL')} CLP`
                            }
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">{language === 'en' ? 'For paid festivals' : 'Para festivales pagos'}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Region Distribution */}
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-6 text-indigo-400">
                            <Globe size={20} />
                            <h2 className="text-lg font-bold uppercase tracking-wider">{language === 'en' ? 'By Geography' : 'Distribución Geográfica'}</h2>
                        </div>
                        <div className="space-y-4">
                            {sortedRegions.map(([region, count]) => {
                                const countNum = count as number;
                                return (
                                    <Link href={`/festivals?region=${region}`} key={region} className="group block">
                                        <div className="flex justify-between text-sm mb-1 text-neutral-300 group-hover:text-white transition-colors">
                                            <span>{t.filters.regions[region as keyof typeof t.filters.regions] || region}</span>
                                            <span className="font-mono text-neutral-400 group-hover:text-indigo-400 transition-colors">{countNum}</span>
                                        </div>
                                        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500/60 rounded-full group-hover:bg-indigo-400 transition-all duration-300 ease-out group-hover:shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                                                style={{ width: `${(countNum / totalCount) * 100}%` }}
                                            ></div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    {/* Genre Hotspots */}
                    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
                        <div className="flex items-center gap-2 mb-6 text-amber-500">
                            <BarChart2 size={20} />
                            <h2 className="text-lg font-bold uppercase tracking-wider">{language === 'en' ? 'Top Genres Accepted' : 'Top Géneros Aceptados'}</h2>
                        </div>
                        <div className="space-y-4">
                            {topGenres.map(([genre, count], idx) => {
                                const countNum = count as number;
                                return (
                                    <Link href={`/festivals?genre=${genre}`} key={genre} className="flex items-center gap-3 group">
                                        <span className="text-neutral-600 font-mono text-sm w-4 group-hover:text-neutral-400 transition-colors">{idx + 1}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm text-neutral-200 group-hover:text-white transition-colors">
                                                <span className="font-medium">{(t.filters as any).genres?.[genre] || genre}</span>
                                            </div>
                                            <div className="h-1.5 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-500/60 rounded-full group-hover:bg-amber-400 transition-all duration-300 ease-out group-hover:shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                                                    style={{ width: `${(countNum / totalCount) * 100}%` }} // Approximate % based on total festivals
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-neutral-500 w-8 text-right group-hover:text-amber-400 transition-colors">{countNum}</div>
                                    </Link>
                                )
                            })}
                        </div>
                        <p className="text-xs text-neutral-600 mt-6 italic text-center">
                            {language === 'en' ? '* Most festivals accept multiple genres.' : '* La mayoría de los festivales aceptan múltiples géneros.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
