"use client";

import { useState } from "react";
import { Youtube, Sparkles, Brain, AlertTriangle, ChevronRight, Loader2 } from "lucide-react";
import { Recommendation, analyzeYouTubeLink } from "../lib/recommendationEngine";

export default function YouTubeRecommender() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Recommendation[] | null>(null);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setResults(null);
        try {
            const data = await analyzeYouTubeLink(url);
            setResults(data);
        } catch (error) {
            console.error("Error analyzing link:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 py-12 px-4">
            {/* Header Sección */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-medium uppercase tracking-widest">
                    <Sparkles size={12} />
                    New Feature
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Análisis de Afinidad Histórica
                </h2>
                <p className="text-neutral-400 max-w-2xl mx-auto">
                    Ingresa el enlace de tu obra para contrastarla con el ADN artístico de los festivales clase A.
                    Nuestro algoritmo evalúa patrones de éxito, temática y madurez técnica.
                </p>
            </div>

            {/* Input de URL */}
            <form onSubmit={handleAnalyze} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-2 pl-4">
                    <Youtube className="text-red-500 mr-3" size={24} />
                    <input
                        type="text"
                        placeholder="Pega el link de YouTube de tu cortometraje..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-neutral-500 text-lg py-2"
                    />
                    <button
                        type="submit"
                        disabled={loading || !url}
                        className="ml-4 px-6 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Analizando...
                            </>
                        ) : (
                            <>
                                Analizar Obra
                                <ChevronRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Resultados */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-pulse">
                    <Brain size={48} className="text-blue-500 animate-bounce" />
                    <p className="text-neutral-400 font-mono text-sm tracking-widest uppercase">
                        Escaneando metadata y patrones rítmicos...
                    </p>
                </div>
            )}

            {results && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {results.map((rec, i) => (
                        <div
                            key={rec.festivalId}
                            className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 space-y-4 hover:border-neutral-700 transition-all group"
                        >
                            <div className="flex justify-between items-start">
                                <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                    {i + 1}
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-white">{rec.affinityScore}%</div>
                                    <div className="text-[10px] text-neutral-500 uppercase tracking-tighter">Afinidad Histórica</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight mb-2">
                                    {rec.festivalName}
                                </h3>
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-800 rounded font-mono text-[10px] text-neutral-400">
                                    Tema: {rec.matchingWinner?.theme}
                                </div>
                            </div>

                            <p className="text-sm text-neutral-400 leading-relaxed italic border-l-2 border-blue-500 pl-3">
                                "{rec.technicalReasoning}"
                            </p>

                            <div className="pt-4 border-t border-neutral-800 space-y-2">
                                <div className="flex items-center gap-2 text-amber-500/80">
                                    <AlertTriangle size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Observaciones Técnicas</span>
                                </div>
                                <p className="text-xs text-neutral-500 italic">
                                    {rec.weaknesses}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
