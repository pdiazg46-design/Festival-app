"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Trophy, Film, RefreshCw, Globe, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import localFestivals from "../data/festivals.json";
import { cn } from "../lib/utils";
import { useState, useEffect, Suspense } from "react";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { fetchFestivalsFromSheet, FestivalData } from "../lib/sheetLoader";
import { useSearchParams } from "next/navigation";
import { useUser } from "../context/UserContext";
import UpgradeModal from "../components/UpgradeModal";
import { Lock } from "lucide-react";

function FestivalExplorerContent() {
    const { t, language } = useLanguage();
    const searchParams = useSearchParams();

    const initialRegion = searchParams.get("region") || "All";
    const initialGenre = searchParams.get("genre") || "All";
    const initialTheme = searchParams.get("theme") || "All";

    const [festivals, setFestivals] = useState<FestivalData[]>(localFestivals as any);
    const [statusFilter, setStatusFilter] = useState("All");
    const [regionFilter, setRegionFilter] = useState(initialRegion);
    const [typeFilter, setTypeFilter] = useState("All");
    const [genreFilter, setGenreFilter] = useState(initialGenre);
    const [themeFilter, setThemeFilter] = useState(initialTheme);
    const [showFreeOnly, setShowFreeOnly] = useState(false);
    const { isPremium } = useUser();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);


    const uniqueRegions = Array.from(new Set(festivals.map(f => f.region))).sort();
    const uniqueTypes = Array.from(new Set(festivals.map(f => f.type))).sort();

    // Extract unique genres
    const uniqueGenres = Array.from(new Set(festivals.flatMap(f => (f as any).genres || []))).sort();

    const filteredFestivals = festivals.filter(f => {
        const matchesStatus = statusFilter === "All" ? true : f.status === statusFilter;
        const matchesRegion = regionFilter === "All" ? true : f.region === regionFilter;
        const matchesType = typeFilter === "All" ? true : f.type === typeFilter;

        // Match Genre
        const festivalGenres = (f as any).genres || [];
        const matchesGenre = genreFilter === "All" ? true : festivalGenres.includes(genreFilter);

        // Match Theme
        const matchesTheme = themeFilter === "All" ? true : f.winners?.some(w => {
            const themes = Array.isArray(w.theme) ? w.theme : [w.theme];
            return themes.some(th => {
                if (typeof th === 'object') {
                    return Object.values(th).some(v => v === themeFilter);
                }
                return th === themeFilter;
            });
        });

        // Fee logic: Check if fee is "0", "0.0", "Free" or empty/undefined
        const fee = (f as any).fee;
        const isFree = !fee || fee === "0" || fee === "0.0" || fee.toLowerCase() === "free";
        const matchesCost = showFreeOnly ? isFree : true;

        return matchesStatus && matchesRegion && matchesType && matchesGenre && matchesCost && matchesTheme;
    });

    const displayedFestivals = isPremium
        ? filteredFestivals
        : filteredFestivals.filter(f => f.region === "Chile");

    const lockedCount = filteredFestivals.length - displayedFestivals.length;

    const handleExportPDF = () => {
        const doc = new jsPDF();

        const tableColumn = ["Name", "Region", "Types", "Status", "Web"];
        const tableRows = displayedFestivals.map(festival => [
            festival.name,
            festival.region,
            festival.type,
            festival.status,
            (festival as any).website || "N/A"
        ]);

        doc.text("Festival List", 14, 15);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("festivals_export.pdf");
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8 relative">
            {showUpgradeModal && <UpgradeModal />}
            <LanguageSwitcher />
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors shrink-0">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                            {t.explorer_title}
                        </h1>
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-colors border border-neutral-700 hover:border-neutral-600 ml-2"
                        >
                            <Download size={14} />
                            {language === 'en' ? 'Export PDF' : 'Exportar PDF'}
                        </button>
                    </div>
                    <div>
                        <div className="hidden md:flex items-center gap-3">
                            {/* Title moved inside flex above for mobile alignment, simplified here for logic */}
                        </div>
                        {themeFilter !== "All" && (
                            <div className="mt-2 md:mt-0 flex items-center">
                                <span className="px-3 py-1 bg-amber-500/20 text-amber-500 text-sm font-bold rounded-full border border-amber-500/30 flex items-center gap-2">
                                    <Trophy size={12} />
                                    {themeFilter}
                                    <button
                                        onClick={() => setThemeFilter("All")}
                                        className="hover:text-amber-300 ml-1"
                                    >
                                        ×
                                    </button>
                                </span>
                            </div>
                        )}
                        <p className="text-neutral-400 text-sm md:text-base mt-2 md:mt-0">
                            {t.explorer_desc}
                        </p>
                    </div>
                </header>

                {/* Filters Section */}
                <div className="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-4 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {["All", "Open", "Upcoming", "Closed"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-colors border whitespace-nowrap",
                                    statusFilter === status
                                        ? "bg-neutral-100 text-neutral-950 border-neutral-100"
                                        : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                                )}
                            >
                                {(t.filters as any)[status.toLowerCase()]}
                            </button>
                        ))}
                    </div>

                    <div className="h-px w-full md:h-8 md:w-px bg-neutral-800"></div>

                    <div className="grid grid-cols-1 md:flex md:items-center gap-4">
                        <select
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                            className="bg-neutral-900 border border-neutral-700 text-neutral-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-2.5"
                        >
                            <option value="All">{t.filters.region}: {t.filters.all}</option>
                            {uniqueRegions.map(region => (
                                <option key={region} value={region}>
                                    {t.filters.regions[region as keyof typeof t.filters.regions] || region}
                                </option>
                            ))}
                        </select>

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-neutral-900 border border-neutral-700 text-neutral-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-2.5"
                        >
                            <option value="All">{t.filters.type}: {t.filters.all}</option>
                            {uniqueTypes.map(type => (
                                <option key={type} value={type}>
                                    {t.filters.types[type as keyof typeof t.filters.types] || type}
                                </option>
                            ))}
                        </select>

                        {/* Genre Filter */}
                        <select
                            value={genreFilter}
                            onChange={(e) => setGenreFilter(e.target.value)}
                            className="bg-neutral-900 border border-neutral-700 text-neutral-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-auto p-2.5"
                        >
                            <option value="All">{language === 'en' ? 'Genre: All' : 'Género: Todos'}</option>
                            {uniqueGenres.map((genre: any) => (
                                <option key={genre} value={genre}>
                                    {(t.filters as any).genres?.[genre] || genre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="h-px w-full md:h-8 md:w-px bg-neutral-800 hidden md:block"></div>

                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showFreeOnly}
                            onChange={(e) => setShowFreeOnly(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        <span className="ms-3 text-sm font-medium text-neutral-300">{t.filters.show_free_only}</span>
                    </label>


                </div>

                {/* Export Button */}


                {/* List */}
                <div className="grid grid-cols-1 gap-6">
                    {!isPremium && lockedCount > 0 && (
                        <div onClick={() => setShowUpgradeModal(true)} className="bg-gradient-to-r from-neutral-900 to-neutral-900 border border-amber-500/30 p-6 rounded-xl cursor-pointer hover:border-amber-500 transition-colors group relative overflow-hidden">
                            <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors"></div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-500/20 rounded-full text-amber-500">
                                        <Lock size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {language === 'en' ? `Unlock ${lockedCount} more festivals` : `Desbloquea ${lockedCount} festivales más`}
                                        </h3>
                                        <p className="text-neutral-400 text-sm">
                                            {language === 'en' ? 'Get full access to the global database.' : 'Obtén acceso total a la base de datos mundial.'}
                                        </p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 transition-colors">
                                    {language === 'en' ? 'Upgrade' : 'Mejorar'}
                                </button>
                            </div>
                        </div>
                    )}

                    {displayedFestivals.length > 0 ? (
                        displayedFestivals.map((festival) => {
                            const fee = (festival as any).fee;
                            const isFree = !fee || fee === "0" || fee === "0.0" || fee.toLowerCase() === "free";
                            const genres = (festival as any).genres || [];

                            // Determine which winners to show
                            let winners = festival.winners || [];
                            if (themeFilter !== "All") {
                                winners = winners.filter(w => {
                                    const themes = Array.isArray(w.theme) ? w.theme : [w.theme];
                                    return themes.some(th => {
                                        if (typeof th === 'object') {
                                            return Object.values(th).some(v => v === themeFilter);
                                        }
                                        return th === themeFilter;
                                    });
                                });
                            } else {
                                winners = winners.slice(0, 3);
                            }

                            return (
                                <div key={festival.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <h2 className="text-xl font-bold text-neutral-100 mr-2">{festival.name}</h2>
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-xs font-bold uppercase",
                                                    festival.status === "Open" ? "bg-green-500/20 text-green-400" :
                                                        festival.status === "Upcoming" ? "bg-amber-500/20 text-amber-400" :
                                                            "bg-red-500/20 text-red-400"
                                                )}>
                                                    {(t.filters as any)[festival.status.toLowerCase()]}
                                                </span>
                                                <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    {t.filters.regions[festival.region as keyof typeof t.filters.regions] || festival.region}
                                                </span>
                                                {/* Cost Tag */}
                                                <span className={cn(
                                                    "px-2 py-0.5 rounded text-xs font-bold uppercase border",
                                                    isFree
                                                        ? "bg-green-900/30 text-green-400 border-green-500/30"
                                                        : "bg-neutral-800 text-neutral-400 border-neutral-700"
                                                )}>
                                                    {isFree
                                                        ? (language === 'en' ? 'FREE' : 'GRATIS')
                                                        : (language === 'en'
                                                            ? `$${fee}`
                                                            : `$${(parseInt(fee) * 950).toLocaleString('es-CL')} CLP`)
                                                    }
                                                </span>
                                            </div>

                                            {/* Genres Tags */}
                                            {genres.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {genres.map((g: string) => (
                                                        <span key={g} className="text-[10px] px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded border border-neutral-700 uppercase tracking-wide">
                                                            {(t.filters as any).genres?.[g] || g}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-neutral-400">
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    {festival.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {festival.dates}
                                                </div>
                                            </div>
                                            <p className="mt-4 text-neutral-300 max-w-2xl text-sm leading-relaxed">
                                                {festival.description[language]}
                                            </p>

                                            <div className="flex gap-3 mt-4">
                                                {(festival as any).website && (
                                                    <a
                                                        href={(festival as any).website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded hover:bg-blue-500/20 transition-colors"
                                                    >
                                                        <Globe size={14} />
                                                        {language === 'en' ? 'Website' : 'Sitio Web'}
                                                    </a>
                                                )}
                                                {(festival as any).rules && (
                                                    <a
                                                        href={(festival as any).rules}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700 transition-colors"
                                                    >
                                                        <Film size={14} />
                                                        {language === 'en' ? 'Rules / Submit' : 'Bases / Postular'}
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Winners Section */}
                                        <div className="md:w-1/3 w-full bg-neutral-950/50 rounded-lg p-4 border border-neutral-800/50">
                                            <div className="flex items-center gap-2 mb-3 text-amber-500">
                                                <Trophy size={16} />
                                                <span className="text-sm font-bold uppercase tracking-wider">
                                                    {themeFilter !== "All" ? (language === 'en' ? 'Matching Winners' : 'Ganadores Coincidentes') : t.winners_history}
                                                </span>
                                            </div>
                                            <div className="space-y-4">
                                                {winners.map((w, idx) => (
                                                    <div key={idx} className="text-sm border-b border-neutral-800/50 last:border-0 pb-3 last:pb-0">
                                                        <div className="flex justify-between items-start mb-1.5">
                                                            <span className="text-neutral-100 font-bold leading-tight">{w.title}</span>
                                                            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400 border border-neutral-700">{w.year}</span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {w.director && (
                                                                <div className="text-[11px] flex items-center gap-2">
                                                                    <span className="text-neutral-500 font-medium">{(t as any).director}:</span>
                                                                    <span className="text-neutral-300">{w.director}</span>
                                                                </div>
                                                            )}
                                                            <div className="text-[11px] flex items-start gap-2">
                                                                <span className="text-indigo-400 font-medium whitespace-nowrap">{t.theme}:</span>
                                                                <span className={cn(
                                                                    "text-neutral-300",
                                                                    themeFilter !== "All" && "text-amber-400 font-bold"
                                                                )}>{
                                                                        Array.isArray(w.theme)
                                                                            ? w.theme.map(th => typeof th === 'object' ? th[language] : th).join(", ")
                                                                            : (typeof w.theme === 'object' ? w.theme[language] : w.theme)
                                                                    }</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {winners.length === 0 && (
                                                    <div className="text-xs text-neutral-500 italic">
                                                        {language === 'en' ? 'No winners match' : 'Sin ganadores coincidentes'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 text-neutral-500">
                            <Film size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No festivals match your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function FestivalExplorer() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">Loading...</div>}>
            <FestivalExplorerContent />
        </Suspense>
    );
}
