"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Clapperboard, Film, Users, MapPin, DollarSign, Target, Sparkles, Copy, MonitorPlay, Trophy, Check, X, Trash2, Plus, Edit2, FileDown } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";
import UpgradeModal from "../components/UpgradeModal";
import { Lock } from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { cn } from "../lib/utils";

export default function StudioPage() {
    const { language, t } = useLanguage();
    const { isPremium } = useUser();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // If not premium, block completely
    if (!isPremium) {
        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
                <LanguageSwitcher />
                {showUpgradeModal && <UpgradeModal />}
                <div className="text-center space-y-6 max-w-lg">
                    <div className="mx-auto w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800 shadow-xl shadow-amber-900/10">
                        <Lock size={40} className="text-amber-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-600 mb-2">
                            {language === 'en' ? 'Portal AT-SIT Studios' : 'Portal AT-SIT Estudios'}
                        </h1>
                        <p className="text-neutral-400">
                            {language === 'en'
                                ? 'This advanced tool is available for Premium users only.'
                                : 'Esta herramienta avanzada está disponible solo para usuarios Premium.'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                    >
                        {language === 'en' ? 'Unlock Studio' : 'Desbloquear Estudio'}
                    </button>
                    <Link href="/" className="block text-sm text-neutral-600 hover:text-neutral-400">
                        {language === 'en' ? 'Return to Dashboard' : 'Volver al Inicio'}
                    </Link>
                </div>
            </div>
        );
    }

    // Granular Controls State
    const [pacing, setPacing] = useState(50); // 0 (Slow) to 100 (Fast)
    const [contrast, setContrast] = useState(50); // 0 (Natural) to 100 (Stylized)
    const [sceneCount, setSceneCount] = useState(3); // Manual scene count (fallback)
    const [scriptText, setScriptText] = useState(""); // Full script content
    const [duration, setDuration] = useState(600); // Duration in SECONDS (Default 10 min)

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return s > 0 ? `${m}m ${s}s` : `${m} min`;
    };

    // Base Script Data Enhanced (Full Story Evolution)
    const getDetailedScript = (isEsp: boolean, script: string, pacingVal: number, contrastVal: number, scManualCount: number) => {
        const paceNote = pacingVal < 40 ? (isEsp ? "Toma larga, estática" : "Long take, static") : pacingVal > 70 ? (isEsp ? "Corte rápido, nervioso" : "Quick cut, nervous") : (isEsp ? "Giro suave" : "Smooth pan");
        const lightNote = contrastVal > 60 ? (isEsp ? "Clarioscuro fuerte, sombras duras" : "High contrast, hard shadows") : (isEsp ? "Luz suave, naturalista" : "Soft, natural light");

        const inputContent = script || customVision;
        const hasVision = inputContent && inputContent.trim().length > 0;

        // --- CUSTOM SCRIPT / VISION LOGIC ---
        if (hasVision) {
            // Helper to clean technical headers for narrative use
            const cleanNarrativeText = (text: string) => {
                if (!text) return "";
                // 1. Remove standard scene headings (ESC 1 / INT. LOC - DAY)
                let clean = text.replace(/(?:ESC|ESCENA|SCENE)\s*\d+(?:[\s\/\-\.]+(?:INT|EXT|INTERIOR|EXTERIOR|INT\/EXT)[\w\s\.\-\/]+)?(?:DÍA|NOCHE|DAY|NIGHT)?/gi, " ");

                // 2. Remove explicit full-word headers even without scene numbers (INTERIOR CASA / - )
                // Looks for start of string or new sentence + INTERIOR/EXTERIOR + Uppercase words/Slashes + optional hyphen
                clean = clean.replace(/\b(?:INT\.|EXT\.|INTERIOR|EXTERIOR)\s+[A-ZÁÉÍÓÚÑ\s\/\-\.]+(?:-|–)?/g, " ");

                // 3. Remove isolated technical words and leftovers
                clean = clean.replace(/\b(INT\.|EXT\.|DÍA|NOCHE|DAY|NIGHT|CASA|HABITACIÓN)\b/gi, " ");

                // 4. Cleanup trailing/leading punctuation/spaces left behind (e.g. "/ - Escuchamos")
                clean = clean.replace(/^[\s\/\-\.\,]+|[\s\/\-\.\,]+$/g, "").trim();

                // 5. Ensure first letter is capitalized after cleaning
                return clean.charAt(0).toUpperCase() + clean.slice(1);
            };

            // Scene extraction logic: Look for ESC or SCENE patterns
            const sceneHeaders = inputContent.match(/(?:ESC|ESCENA|SCENE)\s*(\d+)/gi) || [];
            const detectedSceneCount = sceneHeaders.length > 0 ? sceneHeaders.length : scManualCount;

            // Smart Snippet Extraction: Split by periods/newlines but filter out technical-only lines
            const rawSnippets = inputContent.split(/[\.\n]+/).filter(s => s.trim().length > 0);
            const validSnippets = rawSnippets.filter(s => {
                const upper = s.toUpperCase().trim();
                // Filter out short lines that look like headers
                if (upper.length < 50 && (upper.includes("EXT.") || upper.includes("INT.") || upper.includes("ESC "))) return false;
                return true;
            });

            // Use cleaned snippets or fallback to raw if too aggressive filtering
            const effectiveSnippets = validSnippets.length > 0 ? validSnippets : rawSnippets;

            const act1 = cleanNarrativeText(effectiveSnippets[0]) || (isEsp ? "Introducción del conflicto" : "Conflict intro");
            const act2 = cleanNarrativeText(effectiveSnippets[1]) || (isEsp ? "Escalada de tensión" : "Tension escalation");
            const act3 = cleanNarrativeText(effectiveSnippets[2]) || (isEsp ? "Clímax y resolución" : "Climax and resolution");

            // Analyze Tone/Genre for Ending Suggestion
            const lowerVision = inputContent.toLowerCase();
            let endingProposal = { title: "", desc: "" };

            if (lowerVision.includes("miedo") || lowerVision.includes("asesino") || lowerVision.includes("oscur") || lowerVision.includes("horror") || lowerVision.includes("kill") || lowerVision.includes("dark")) {
                endingProposal = {
                    title: isEsp ? "El Giro Nihilista" : "The Nihilistic Twist",
                    desc: isEsp
                        ? "El protagonista cree haber escapado, pero revelamos que todo este tiempo ha estado atrapado en el lugar donde empezó. El 'monstruo' es interno."
                        : "Protagonist thinks they escaped, but we reveal they've been trapped where they started all along. The 'monster' is internal."
                };
            } else if (lowerVision.includes("amor") || lowerVision.includes("pareja") || lowerVision.includes("love") || lowerVision.includes("relationship")) {
                endingProposal = {
                    title: isEsp ? "La Separación Necesaria" : "The Necessary Separation",
                    desc: isEsp
                        ? "En lugar de un reencuentro feliz, ambos aceptan que deben seguir caminos separados para crecer. Un final agridulce pero maduro."
                        : "Instead of a happy reunion, both accept they must part ways to grow. A bittersweet but mature ending."
                };
            } else if (lowerVision.includes("futuro") || lowerVision.includes("ia ") || lowerVision.includes("robot") || lowerVision.includes("tech")) {
                endingProposal = {
                    title: isEsp ? "El Bucle Recursivo" : "The Recursive Loop",
                    desc: isEsp
                        ? "La última toma revela que el protagonista es en realidad una simulación reviviendo el mismo recuerdo una y otra vez."
                        : "The final shot reveals the protagonist is actually a simulation reliving the same memory over and over."
                };
            } else {
                endingProposal = {
                    title: isEsp ? "La Ambigüedad Poética" : "The Poetic Ambiguity",
                    desc: isEsp
                        ? "Corte a negro justo antes de la resolución. Dejamos a la audiencia con la duda de si logró su objetivo, forzando la reflexión."
                        : "Cut to black right before resolution. Leave the audience wondering if they succeeded, forcing reflection."
                };
            }

            // --- SMART TITLE DETECTION ---
            const scriptLines = inputContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            let detectedTitle = "";

            // 1. Look for explicit Title markers
            const titleLine = scriptLines.find(l =>
                l.toUpperCase().startsWith("TÍTULO:") ||
                l.toUpperCase().startsWith("TITLE:") ||
                l.toUpperCase().startsWith("PROYECTO:")
            );

            if (titleLine) {
                detectedTitle = titleLine.split(':')[1]?.trim().toUpperCase();
            }

            // 2. If no explicit marker, try to find the first non-technical line at the top
            if (!detectedTitle) {
                const technicalTerms = [
                    "INT.", "EXT.", "INT/", "EXT/", "ESCENA", "ESC ", "SCENE",
                    "DÍA", "NOCHE", "DAY", "NIGHT", "INTERIOR", "EXTERIOR", "ESTUDIO", "STUDIO"
                ];
                const firstCleanLine = scriptLines.slice(0, 10).find(line => {
                    const upper = line.toUpperCase();
                    // Skip lines that contain technical terms or look like scene headers (numbers, dashes, slashes)
                    const isTechnical = technicalTerms.some(term => upper.includes(term));
                    const isSceneHeader = /^[\d\s\/\.\-]+$/.test(line); // Just numbers and symbols
                    // Force exclude if it starts with common scene heading words even if not full match
                    const startsWithTechnical = ["EXT", "INT", "CASA", "HABITACIÓN", "ROOM", "HOUSE", "STREET", "CALLE", "DIA", "NOCHE"].some(w => upper.startsWith(w));

                    const isShort = line.length < 3;
                    const isTooLong = line.length > 60;

                    return !isTechnical && !isSceneHeader && !startsWithTechnical && !isShort && !isTooLong;
                });
                if (firstCleanLine) detectedTitle = firstCleanLine.toUpperCase();
            }

            // 3. Fallback to Theme-based suggestion or Generic
            if (!detectedTitle || detectedTitle.length < 3) {
                detectedTitle = endingProposal.title.toUpperCase();
            }

            // --- TIME & STRUCTURE LOGIC IN SECONDS ---
            const totalSeconds = typeof duration === 'number' ? duration : 600;

            // Calculate structural beats (approximate percentages)
            const beat1 = Math.floor(totalSeconds * 0.20); // 20%
            const beat2 = Math.floor(totalSeconds * 0.50); // 50% (Cumulative)
            const beat3 = Math.floor(totalSeconds * 0.80); // 80% (Cumulative)

            const fmt = formatTime;

            // Clean content for Logline
            const cleanedInputForLogline = cleanNarrativeText(inputContent);

            return {
                title: detectedTitle,
                logline: isEsp
                    ? `Cuando un ${cleanedInputForLogline.toLowerCase().includes('mujer') ? 'mujer' : 'personaje'} se enfrenta a "${cleanedInputForLogline.substring(0, 60)}...", deberá luchar contra lo imposible para lograr su objetivo principal antes de que sea demasiado tarde.`
                    : `When a ${cleanedInputForLogline.toLowerCase().includes('woman') ? 'woman' : 'character'} faces "${cleanedInputForLogline.substring(0, 60)}...", they must fight against the odds to achieve their goal before it's too late.`,
                ref: isEsp ? "Ref: Estilo visual adaptado al input del usuario." : "Ref: Visual style adapted to user input.",

                // AI SUGGESTED ENDING
                suggestedEnding: endingProposal,

                // DYNAMIC STORY STRUCTURE (ESCALETA)
                escaleta: [
                    { time: `0-${fmt(beat1)}`, title: isEsp ? "El Detonante" : "The Trigger", desc: act1 },
                    { time: `${fmt(beat1)}-${fmt(beat2)}`, title: isEsp ? "Desarrollo / Complicación" : "Development / Complication", desc: isEsp ? `La situación se complica: ${act2}` : `The situation gets complicated: ${act2}` },
                    { time: `${fmt(beat2)}-${fmt(beat3)}`, title: isEsp ? "El Punto de No Retorno" : "Point of No Return", desc: isEsp ? "El protagonista debe tomar una decisión drástica." : "The protagonist must make a drastic decision." },
                    { time: `${fmt(beat3)}-${fmt(totalSeconds)}`, title: isEsp ? "Desenlace" : "Resolution", desc: act3 }
                ],

                // DETAILED TECHNICAL SCRIPT (SHOT LIST)
                shotList: Array.from({ length: detectedSceneCount }).map((_, i) => {
                    const sceneNum = i + 1;
                    const timePerSc = totalSeconds / detectedSceneCount;
                    const elapsed = i * timePerSc;

                    // Format as MM:SS for the table, or SSs if very short
                    const m = Math.floor(elapsed / 60);
                    const s = Math.floor(elapsed % 60);
                    const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

                    return {
                        id: (i + 1).toString(),
                        scene: sceneNum.toString(),
                        time: timeStr,
                        type: "MASTER SHOT",
                        lens: "35mm",
                        subject: isEsp ? `Apertura de Escena ${sceneNum}` : `Opening of Scene ${sceneNum}`,
                        description_detail: isEsp ? "Plano general de situación basado en el guion." : "Master shot based on the script.",
                        audio: isEsp ? "Ambiente sincronizado" : "Synchronized ambience",
                        props: "",
                        detail_shot: "",
                        actors: "",
                        note: `${lightNote}. ${paceNote}.`
                    };
                })
            };
        }

        // --- DEFAULT SILENT MODE LOGIC ---
        return {
            title: isEsp ? "MODO SILENCIO" : "SILENT MODE",
            logline: isEsp
                ? `Un joven intenta cenar con su madre, pero descubre que ella solo responde a través de mensajes de texto. La realidad física se deteriora.`
                : `A young man tries to have dinner with his mother, but discovers she only responds via text messages. Physical reality decays.`,
            ref: "Ref: 'The Menu' (Food prep sounds), 'Hereditary' (Wide shots).",

            // FULL STRUCTURE
            escaleta: [
                { time: "0-2 min", title: isEsp ? "La Espera" : "The Wait", desc: isEsp ? "Lucas prepara dinner. Absolute silence." : "Lucas prepares dinner. Absolute silence." },
                { time: "2-4 min", title: isEsp ? "Conexión Perdida" : "Lost Connection", desc: isEsp ? "Madre entra. No habla. Solo responde por WhatsApp." : "Mother enters. Doesn't speak. Only answers via WhatsApp." },
                { time: "4-7 min", title: isEsp ? "La Glitch" : "The Glitch", desc: isEsp ? "Lucas ve a través de su cámara que su madre sonríe falsamente." : "Lucas sees through his camera that his mother is smiling falsely." },
                { time: "9-10 min", title: isEsp ? "Rendición" : "Surrender", desc: isEsp ? "Lucas accepts the simulation." : "Lucas accepts the simulation." }
            ],

            // DETAILED TECHNICAL SCRIPT
            shotList: [
                { id: "1A", time: "00:00", type: "INSERT / MACRO", lens: "100mm", subject: isEsp ? "Vapor saliendo de la sopa caliente" : "Steam rising from hot soup", audio: isEsp ? "Sonido amplificado de burbujeo" : "Amplified bubbling sound", note: `${paceNote}.` },
                { id: "1B", time: "00:15", type: "ECU (Extreme Close Up)", lens: "85mm", subject: isEsp ? "Ojos de LUCAS mirando el reloj" : "LUCAS's eyes checking the clock", audio: isEsp ? "Tic-tac del reloj muy fuerte" : "Loud clock ticking", note: isEsp ? "La mirada denota ansiedad." : "Look shows anxiety." },
                { id: "2", time: "00:30", type: "WIDE / MASTER", lens: "24mm", subject: isEsp ? "El comedor perfectamente puesto, silla vacía" : "Perfectly set dining room, empty chair", audio: isEsp ? "Zumbido eléctrico (Room Tone)" : "Electric hum (Room Tone)", note: `${lightNote}. ${isEsp ? "Simetría Kubrickiana." : "Kubrickian symmetry."}` },
                { id: "3", time: "00:50", type: "MEDIUM", lens: "50mm", subject: isEsp ? "Lucas coloca los DOS celulares en la mesa" : "Lucas places BOTH phones on table", audio: isEsp ? "Golpe seco del vidrio contra madera" : "Sharp thud of glass on wood", note: isEsp ? "Acción ritualística." : "Ritualistic action." },
                { id: "4", time: "01:20", type: "POV / HANDHELD", lens: "35mm", subject: isEsp ? "Desde atrás de Lucas hacia la puerta oscura" : "From behind Lucas towards dark door", audio: isEsp ? "Sonido de notificación distante" : "Distant notification sound", note: `${pacingVal > 70 ? "Cámara en mano temblorosa" : "Dolly in superlento"}` },
                { id: "5", time: "01:45", type: "CLOSE UP", lens: "50mm", subject: isEsp ? "La notificación ilumina su rostro" : "Notification lights up his face", audio: isEsp ? "Silencio súbito" : "Sudden silence", note: `${lightNote}. Ref: 'Euphoria' aesthetics.` }
            ]
        };
    };

    const [generatedConcept, setGeneratedConcept] = useState<null | { title: string, logline: string, ref: string, escaleta?: any[], shotList?: any[], isCustom?: boolean, suggestedEnding?: { title: string, desc: string } }>(null);

    const handleGenerate = () => {
        const finalInput = scriptText || customVision;
        if (finalInput.length < 5) return;
        const isEsp = language !== 'en';
        const newScript = getDetailedScript(isEsp, finalInput, pacing, contrast, sceneCount /* duration is used inside but passed via state context if simpler, or let's pass it for purity */);
        // Actually getDetailedScript is a closure that uses 'duration' from state scope? 
        // Checking the original code... 
        // ORIGINAL: const getDetailedScript = (isEsp: boolean, script: string, pacingVal: number, contrastVal: number, scManualCount: number) => { ... }
        // It uses 'duration' from the component scope inside.
        // Wait, line 172 in original: "const timePerSc = (duration * 60) / detectedSceneCount;"
        // Yes, it captures 'duration' from the component state scope.
        // But for clarity and correctness (since I'm editing the function definition in chunk 2), let's ensure it uses the 'totalSeconds' variable I defined there which takes 'duration' from scope.
        // My replacement chunk 2 uses: "const totalSeconds = typeof duration === 'number' ? duration : 600;"
        // So it captures 'duration' from state.

        // This chunk is just to match the tool call validation if I changed line 228. 
        // Wait, do I need to change line 228? 
        // "const newScript = getDetailedScript(isEsp, finalInput, pacing, contrast, sceneCount) as any;"
        // The signature didn't change in my Chunk 2 replacement (lines 151-191 replacement inside the function body, or start line 60 for the function def).
        // Let's check Chunk 2 target content... 
        // Chunk 2 targets lines 151-191 (return object). It does NOT target the function signature line 60.
        // Line 60: "const getDetailedScript = (isEsp: boolean, script: string, pacingVal: number, contrastVal: number, scManualCount: number) => {"
        // I am NOT changing the signature. I am referencing 'duration' from the closure scope which is 'seconds' now.
        // So "min * 60" logic in original was relying on 'duration' being minutes.
        // My new logic "const totalSeconds = duration" relies on 'duration' being seconds.
        // So I don't need to change line 228.

        // Actually, I should check if there are other calls to getDetailedScript.
        // Line 247: "setGeneratedConcept(getDetailedScript(isEsp, scriptText, newPacing, newContrast, sceneCount) as any);"
        // This is also fine.

        // So this chunk is NOT needed.
        setGeneratedConcept(newScript);
        setActiveTab("concept"); // Reset to Concept to show the storage evolution first
        setRefinementStep(0);
        setAdvisorNote(isEsp
            ? "He estructurado tu idea completa. Revisa el flujo narrativo en 'Estructura' antes de pasar al 'Guion Técnico'."
            : "I've structured your full idea. Review the narrative flow in 'Structure' before moving to the 'Shot List'.");
    };

    // Update script when sliders change
    const updateAtmosphere = (newPacing: number, newContrast: number) => {
        setPacing(newPacing);
        setContrast(newContrast);
        if (generatedConcept) {
            // Auto-switch to Shot List to show the real-time changes
            if (activeTab !== "shotlist") {
                setActiveTab("shotlist");
            }
            const isEsp = language !== 'en';
            setGeneratedConcept(getDetailedScript(isEsp, scriptText, newPacing, newContrast, sceneCount) as any);
        }
    };

    // The following states and functions are no longer used based on the new functionality
    const [vibe, setVibe] = useState("Drama");
    const [customVision, setCustomVision] = useState("");
    const [activeTab, setActiveTab] = useState("concept");
    const [refinementStep, setRefinementStep] = useState(0); // 0: Base, 1: Arthouse, 2: Genre/Horror
    const [advisorNote, setAdvisorNote] = useState("");

    // Shot List Editing State
    const [editingShotIndex, setEditingShotIndex] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Persistence Logic
    useEffect(() => {
        const savedData = localStorage.getItem("studio_project_data");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.generatedConcept) setGeneratedConcept(parsed.generatedConcept);
                if (parsed.scriptText) setScriptText(parsed.scriptText);
                if (parsed.duration) setDuration(parsed.duration);
                if (parsed.sceneCount) setSceneCount(parsed.sceneCount);
                if (parsed.pacing) setPacing(parsed.pacing);
                if (parsed.contrast) setContrast(parsed.contrast);
                if (parsed.customVision) setCustomVision(parsed.customVision);
            } catch (e) {
                console.error("Error loading saved data", e);
            }
        }
    }, []);

    useEffect(() => {
        const dataToSave = {
            generatedConcept,
            scriptText,
            duration,
            sceneCount,
            pacing,
            contrast,
            customVision
        };
        localStorage.setItem("studio_project_data", JSON.stringify(dataToSave));
    }, [generatedConcept, scriptText, duration, sceneCount, pacing, contrast, customVision]);


    const extractTextFromPDF = async (file: File) => {
        setIsProcessing(true);
        try {
            // Dynamic import of the legacy build for better compatibility
            const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf');

            // Set worker using a reliable CDN that matches the installed version
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let fullText = "";

            // AT-SIT HYDRATION CHECK
            // We look for a special marker in the last page or metadata logic
            // Since we write white text at end, it should appear in textContent
            let foundState = null;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(" ");
                fullText += pageText + "\n\n";

                // Check for injected state
                if (pageText.includes("ATSIT_STATE_START")) {
                    try {
                        const startIndex = pageText.indexOf("ATSIT_STATE_START");
                        const endIndex = pageText.indexOf("ATSIT_STATE_END");
                        if (startIndex !== -1 && endIndex !== -1) {
                            const jsonStr = pageText.substring(startIndex + "ATSIT_STATE_START".length, endIndex);
                            // It might have spaces due to PDF mapping, try to clean if simple parse fails
                            // But usually hidden text remains contiguous or we can just filter non-base64 chars if encoded
                            // Let's assume it's URI encoded or Base64 to avoid space issues
                            foundState = JSON.parse(decodeURIComponent(jsonStr));
                        }
                    } catch (e) {
                        console.error("Failed to hydrate state from PDF", e);
                    }
                }
            }

            if (foundState && foundState.generatedConcept) {
                setGeneratedConcept(foundState.generatedConcept);
                if (foundState.pacing) setPacing(foundState.pacing);
                if (foundState.contrast) setContrast(foundState.contrast);
                if (foundState.sceneCount) setSceneCount(foundState.sceneCount);
                if (foundState.scriptText) setScriptText(foundState.scriptText);

                setAdvisorNote(language === 'en'
                    ? "✨ PROJECT RESTORED! We found a full project state inside this PDF. Welcome back."
                    : "✨ ¡PROYECTO RESTAURADO! Encontramos un estado completo dentro de este PDF. Bienvenido de nuevo.");
            } else if (fullText.trim().length === 0) {
                throw new Error("Empty text extracted");
            } else {
                setScriptText(fullText);
                setAdvisorNote(language === 'en' ? "PDF processed (Text Only)!" : "¡Texto del PDF procesado!");
            }

        } catch (err) {
            console.error("PDF Processing Error:", err);
            setAdvisorNote(language === 'en'
                ? "Could not read this PDF. Please copy and paste the text instead."
                : "No pudimos leer este PDF. Por favor, copia y pega el texto directamente.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            await extractTextFromPDF(file);
        } else if (file && file.type === "text/plain") {
            const text = await file.text();
            setScriptText(text);
        }
    };

    // Helper to renumber all shots globally
    const renumberShots = (list: any[]) => {
        let currentSceneNum = 0;
        return list.map((shot, index) => {
            if (shot.type === "MASTER SHOT") {
                currentSceneNum++;
            }
            return {
                ...shot,
                id: (index + 1).toString(),
                scene: currentSceneNum.toString() || "1"
            };
        });
    };

    const handleAddSceneAt = (index: number) => {
        if (!generatedConcept || !generatedConcept.shotList) return;

        const newScene = {
            id: "", // Will be renumbered
            scene: "", // Will be renumbered
            time: "00:00",
            type: "MASTER SHOT",
            lens: "24mm",
            subject: language === 'en' ? "New Scene" : "Nueva Escena",
            description_detail: "",
            audio: language === 'en' ? "Ambience" : "Ambiente",
            props: "",
            detail_shot: "",
            actors: "",
            note: ""
        };

        const newList = [...generatedConcept.shotList];
        newList.splice(index + 1, 0, newScene);
        const renumbered = renumberShots(newList);
        setGeneratedConcept({ ...generatedConcept, shotList: renumbered });
        setEditingShotIndex(index + 1);
    };

    const handleAddShotAt = (index: number) => {
        if (!generatedConcept || !generatedConcept.shotList) return;

        const newShot = {
            id: "", // Will be renumbered
            scene: "", // Will be renumbered
            time: "00:00",
            type: "MEDIUM / DETAIL",
            lens: "50mm",
            subject: language === 'en' ? "Secondary Shot" : "Plano Secundario",
            description_detail: "",
            audio: "",
            props: "",
            detail_shot: "",
            actors: "",
            note: ""
        };

        const newList = [...generatedConcept.shotList];
        newList.splice(index + 1, 0, newShot);
        const renumbered = renumberShots(newList);
        setGeneratedConcept({ ...generatedConcept, shotList: renumbered });
        setEditingShotIndex(index + 1);
    };

    const handleDeleteShot = (index: number) => {
        if (!generatedConcept || !generatedConcept.shotList) return;
        const newList = generatedConcept.shotList.filter((_, i) => i !== index);
        const renumbered = renumberShots(newList);
        setGeneratedConcept({ ...generatedConcept, shotList: renumbered });
        if (editingShotIndex === index) setEditingShotIndex(null);
    };

    const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (!generatedConcept || !generatedConcept.shotList || !e.target.files?.[0]) return;

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result as string;
            if (!generatedConcept?.shotList) return;
            const updatedList = [...generatedConcept.shotList];
            updatedList[index] = { ...updatedList[index], storyboardImage: base64String };
            setGeneratedConcept({ ...generatedConcept, shotList: updatedList });
        };

        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (index: number) => {
        if (!generatedConcept || !generatedConcept.shotList) return;
        const updatedList = [...generatedConcept.shotList];
        updatedList[index] = { ...updatedList[index], storyboardImage: undefined };
        setGeneratedConcept({ ...generatedConcept, shotList: updatedList });
    };

    // Handler for updating Structure (Escaleta)
    const handleUpdateEscaleta = (index: number, field: 'title' | 'desc', value: string) => {
        if (!generatedConcept || !generatedConcept.escaleta) return;
        const newEscaleta = [...generatedConcept.escaleta];
        newEscaleta[index] = { ...newEscaleta[index], [field]: value };
        setGeneratedConcept({ ...generatedConcept, escaleta: newEscaleta });
    };

    const handleUpdateShot = (index: number, field: string, value: string) => {
        if (!generatedConcept || !generatedConcept.shotList) return;
        const updatedList = [...generatedConcept.shotList];
        updatedList[index] = { ...updatedList[index], [field]: value };
        // If type changed value to MASTER SHOT or vice versa, we should renumber
        const finalContent = field === 'type' ? renumberShots(updatedList) : updatedList;
        setGeneratedConcept({ ...generatedConcept, shotList: finalContent });
    };

    // Export PDF Function (Optimized for Legal/Oficio Landscape)
    const handleExportPDF = async () => {
        if (!generatedConcept || !generatedConcept.shotList) return;

        try {
            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;

            // 1. Legal Format (Oficio) - Landscape: 355.6mm width
            const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'legal' });
            const isEsp = language !== 'en';
            const pageWidth = doc.internal.pageSize.getWidth();

            // --- HEADER & BRANDING ---
            // Brand Logo / Name (Top Left)
            try {
                const logoImg = new Image();
                logoImg.src = '/at-sit-logo.png';
                await new Promise((resolve) => { logoImg.onload = resolve; logoImg.onerror = resolve; });
                doc.addImage(logoImg, 'PNG', 5, 5, 50, 15); // Slightly taller for AT-SIT logo
            } catch (e) {
                doc.setFontSize(18);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(0);
                doc.text("AT-SIT", 5, 12);
            }

            doc.setFontSize(8);
            doc.setTextColor(100);
            const subTitle = isEsp ? "INTEGRACIÓN TECNOLÓGICA" : "TECHNOLOGICAL INTEGRATION";
            doc.text(subTitle, 5, 24); // Adjusted Y for new logo height

            // Timestamp (Top Right)
            const now = new Date();
            const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(dateStr, pageWidth - 5, 10, { align: 'right' });

            // Project Title (Center-ish / Below Header)
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0);
            doc.text(generatedConcept.title, 5, 40); // Moved down significantly to clear logo

            // Logline
            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(80);
            const splitLogline = doc.splitTextToSize(generatedConcept.logline, pageWidth - 10);
            doc.text(splitLogline, 5, 50);

            // Director's Note
            let currentY = 50 + (splitLogline.length * 4) + 4;
            if (advisorNote) {
                doc.setFontSize(8);
                doc.setFont("helvetica", "normal");
                doc.setTextColor(60);
                const notePrefix = isEsp ? "NOTA:" : "NOTE:";
                const noteText = `${notePrefix} ${advisorNote}`;
                const splitNote = doc.splitTextToSize(noteText, pageWidth - 10);
                doc.text(splitNote, 5, currentY);
                currentY += (splitNote.length * 3) + 4;
            } else {
                currentY += 2;
            }

            // --- TABLE ---
            const tableColumn = isEsp
                ? ["#", "Esc", "Tiempo", "Tipo", "Lente", "Acción / Descripción", "Detalles Técnicos", "Audio", "Utilería", "Cast", "Notas", "Storyboard"]
                : ["#", "Sc", "Time", "Type", "Lens", "Action / Description", "Technical Details", "Audio", "Props", "Cast", "Notes", "Storyboard"];

            const tableRows = generatedConcept.shotList.map(shot => [
                shot.id,
                shot.scene || "",
                shot.time,
                shot.type,
                shot.lens,
                shot.subject + (shot.description_detail ? `\n\n${shot.description_detail}` : ""), // Merged Action & Desc for better space
                (shot.detail_shot || "") + (shot.detail_shot ? "\n" : "") + (isEsp ? "Mvt: " : "Mov: ") + (pacing > 70 ? "Handheld" : "Static"), // Tech column
                shot.audio,
                shot.props || "",
                shot.actors || "",
                shot.note,
                "" // Empty space for drawing
            ]);

            autoTable(doc, {
                startY: currentY,
                head: [tableColumn],
                body: tableRows,
                styles: {
                    fontSize: 7,
                    cellPadding: 2,
                    minCellHeight: 45, // Big square for drawing
                    valign: 'middle',
                    overflow: 'linebreak',
                    lineWidth: 0.1,
                    lineColor: [220, 220, 220]
                },
                columnStyles: {
                    0: { cellWidth: 10 }, // #
                    1: { cellWidth: 8 },  // Esc
                    2: { cellWidth: 18 }, // Time (Wider)
                    3: { cellWidth: 20 }, // Type
                    4: { cellWidth: 12 }, // Lens
                    5: { cellWidth: 50 }, // Action
                    6: { cellWidth: 30 }, // Tech
                    7: { cellWidth: 25 }, // Audio
                    8: { cellWidth: 20 }, // Props
                    9: { cellWidth: 20 }, // Cast
                    10: { cellWidth: 25 }, // Notes
                    11: { cellWidth: 'auto' } // Storyboard takes remaining space (approx 100mm+)
                },
                headStyles: {
                    fillColor: [23, 23, 23],
                    textColor: [245, 158, 11], // Amber 500
                    fontStyle: 'bold',
                    halign: 'center'
                },
                alternateRowStyles: { fillColor: [248, 248, 248] },
                margin: { left: 5, right: 5, top: 15, bottom: 5 },
                tableWidth: 'auto',
                didDrawCell: (data) => {
                    // Check if we are in the Storyboard column (index 11) and it's the body section
                    if (data.section === 'body' && data.column.index === 11) {
                        const rowIndex = data.row.index;
                        const shot = generatedConcept.shotList[rowIndex];

                        if (shot && shot.storyboardImage) {
                            try {
                                // Calculate dimensions to fit in cell while maintaining aspect ratio
                                // cell width is auto... roughly 100mm? Let's check dimensions of cell
                                const cellWidth = data.cell.width;
                                const cellHeight = data.cell.height;

                                // Padding
                                const padx = 2;
                                const pady = 2;

                                doc.addImage(shot.storyboardImage, 'JPEG', data.cell.x + padx, data.cell.y + pady, cellWidth - (padx * 2), cellHeight - (pady * 2));
                            } catch (err) {
                                // Fail silently if image is bad
                            }
                        }
                    }
                }
            });


            // --- INJECT HIDDEN STATE FOR "TIME TRAVEL" RESTORE ---
            // We encode the full state object into a hidden string at the end of the PDF
            // This allows the app to fully reconstruct the project when this PDF is uploaded back
            try {
                const fullState = {
                    generatedConcept,
                    scriptText,
                    pacing,
                    contrast,
                    sceneCount
                };
                // Use encodeURIComponent to ensure characters are safe, but PDF text might break huge strings
                // We'll write it as white text (invisible) at the very bottom of the last page
                doc.addPage(); // Add a dedicated metadata page to avoid layout issues
                doc.setFontSize(1);
                doc.setTextColor(255, 255, 255); // White on White

                const jsonStr = JSON.stringify(fullState);
                const safeStr = encodeURIComponent(jsonStr);

                // Write marker + data + endmarker
                const metaString = `ATSIT_STATE_START${safeStr}ATSIT_STATE_END`;

                // Split into chunks if too long for one line (though addPage helps)
                const chunks = doc.splitTextToSize(metaString, pageWidth - 10);
                doc.text(chunks, 5, 5);

                doc.setFontSize(8);
                doc.setTextColor(200);
                doc.text("AT-SIT RESTORE DATA - DO NOT REMOVE PAGE", 5, 20);
            } catch (e) {
                console.error("Could not inject hydratation data", e);
            }

            doc.save(`Script_${generatedConcept.title.replace(/[^a-z0-9]/gi, '_')}_AT-SIT.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert(language === 'en' ? "Error generating PDF" : "Error al generar el PDF");
        }
    };

    // Base Script Data (The "Silent Mode" Project) - This is replaced by getDetailedScript
    const baseScript = (isEsp: boolean, vision: string) => ({
        title: isEsp ? "MODO SILENCIO" : "SILENT MODE",
        logline: isEsp
            ? `Un joven intenta cenar con su madre, pero descubre que ella solo responde a través de mensajes de texto. La realidad física se deteriora.${vision ? ` (Idea: ${vision})` : ''}`
            : `A young man tries to have dinner with his mother, but discovers she only responds via text messages. Physical reality decays.${vision ? ` (Idea: ${vision})` : ''}`,
        ref: "Ref: 'Black Mirror', 'Hereditary'.",
        escaleta: [
            { time: "0-2 min", title: isEsp ? "La Espera" : "The Wait", desc: isEsp ? "Lucas prepara dinner. Absolute silence." : "Lucas prepares dinner. Absolute silence." },
            { time: "2-4 min", title: isEsp ? "Conexión Perdida" : "Lost Connection", desc: isEsp ? "Madre entra. No habla. Solo responde por WhatsApp." : "Mother enters. Doesn't speak. Only answers via WhatsApp." },
            { time: "4-7 min", title: isEsp ? "La Glitch" : "The Glitch", desc: isEsp ? "Lucas ve a través de su cámara que su madre sonríe falsamente." : "Lucas sees through his camera that his mother is smiling falsely." },
            { time: "9-10 min", title: isEsp ? "Rendición" : "Surrender", desc: isEsp ? "Lucas accepts the simulation." : "Lucas accepts the simulation." }
        ],
        shotList: [
            { id: 1, type: isEsp ? "Detalle" : "Detail", subject: isEsp ? "Vapor de la sopa" : "Soup Steam", note: isEsp ? "Audio ASMR" : "ASMR Audio" },
            { id: 2, type: isEsp ? "General" : "Wide", subject: isEsp ? "Comedor oscuro" : "Dark Dining Room", note: isEsp ? "Aislamiento" : "Isolation" },
            { id: 3, type: isEsp ? "Medio" : "Medium", subject: isEsp ? "Madre con celular" : "Mother with phone", note: isEsp ? "Luz Azul" : "Blue Light" },
            { id: 4, type: isEsp ? "POV" : "POV", subject: isEsp ? "Pantalla de Lucas" : "Lucas' Screen", note: isEsp ? "Filtro Feliz" : "Happy Filter" },
            { id: 5, type: isEsp ? "Primer Plano" : "Close Up", subject: isEsp ? "Reacción Lucas" : "Lucas Reaction", note: isEsp ? "Terror" : "Terror" },
        ]
    });

    // This function is no longer used as the refinement logic is removed
    const applyRefinement = (type: 'arthouse' | 'horror' | 'budget') => {
        if (!generatedConcept) return;
        const isEsp = language !== 'en';
        let newScript = { ...generatedConcept };

        if (type === 'arthouse') {
            newScript.title = isEsp ? "SILENCIO_01" : "SILENCE_01";
            newScript.logline = isEsp ? "Sin diálogos. Una exploración visual de la desconexión." : "No dialogue. A visual exploration of disconnection.";
            newScript.escaleta![1].desc = isEsp ? "Madre entra. Lucas intenta hablar. Ella sube el volumen de su música." : "Mother enters. Lucas tries to speak. She turns up her music.";
            newScript.shotList = [
                { id: 1, type: isEsp ? "Plano Secuencia (2 min)" : "Sequence Shot (2 min)", subject: isEsp ? "La cena completa sin cortes" : "Entire dinner without cuts", note: isEsp ? "Estilo Haneke. Tensión estática." : "Haneke style. Static tension." },
                { id: 2, type: isEsp ? "Detalle Extremo" : "Extreme Detail", subject: isEsp ? "Ojo de la madre no parpadea" : "Mother's eye doesn't blink", note: "Macro lens." },
                { id: 3, type: isEsp ? "General Distante" : "Distant Wide", subject: isEsp ? "Ambos en extremos de la mesa" : "Both at ends of the table", note: isEsp ? "Simetría perfecta." : "Perfect symmetry." }
            ];
            setAdvisorNote(isEsp
                ? "💡 ESTRATEGIA: El 'Cine Lento' tiene un 40% más de probabilidad de selección en festivales Clase A (Cannes/Berlin) que el terror convencional."
                : "💡 STRATEGY: 'Slow Cinema' has a 40% higher selection rate in Class A festivals than conventional horror.");
            setRefinementStep(1);
        }

        if (type === 'horror') {
            newScript.title = isEsp ? "NOTIFICACIÓN FINAL" : "FINAL NOTIFICATION";
            newScript.logline = isEsp ? "La adicción se vuelve posesión demoníaca digital." : "Addiction becomes digital demonic possession.";
            newScript.escaleta![3].desc = isEsp ? "La madre empieza a sangrar píxeles negros por los ojos." : "Mother starts bleeding black pixels from her eyes.";
            newScript.shotList!.push({ id: 6, type: "Dutch Angle", subject: isEsp ? "Madre gritando estática" : "Mother screaming static", note: isEsp ? "Distorsión de lente." : "Lens distortion." });
            setAdvisorNote(isEsp
                ? "🩸 ESTRATEGIA: Para Sitges/Midnight, el impacto visual final lo es todo. Sacrificamos sutileza por memorabilidad."
                : "🩸 STRATEGY: For Sitges/Midnight, the final visual impact is everything. We sacrifice subtlety for memorability.");
            setRefinementStep(2);
        }

        if (type === 'budget') {
            newScript.title = isEsp ? "MODO SILENCIO (Low Cost)" : "SILENT MODE (Low Cost)";
            newScript.shotList = [
                { id: 1, type: isEsp ? "Trípode Fijo" : "Fixed Tripod", subject: isEsp ? "Toda la acción en un plano" : "All action in one shot", note: isEsp ? "Sin operador de cámara necesario." : "No camera operator needed." },
                { id: 2, type: isEsp ? "POV Celular" : "Phone POV", subject: isEsp ? "Grabado con el mismo teléfono" : "Shot with the same phone", note: isEsp ? "Estilo Found Footage." : "Found Footage style." }
            ];
            setAdvisorNote(isEsp
                ? "💰 ESTRATEGIA: Menos cortes = Menos días de rodaje. 'Tangerine' ganó Sundance grabada solo con iPhones."
                : "💰 STRATEGY: Fewer cuts = Fewer shooting days. 'Tangerine' won Sundance shot entirely on iPhones.");
            setRefinementStep(3);
        }

        setGeneratedConcept(newScript);
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 p-8 font-sans">
            <LanguageSwitcher />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center gap-4 border-b border-neutral-800 pb-6">
                    <Link href="/" className="p-3 bg-neutral-900 rounded-full hover:bg-neutral-800 transition-colors group">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <Clapperboard className="text-amber-500" size={32} />
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-600">
                                {language === 'en' ? 'Technical Director Studio' : 'Estudio de Dirección Técnica'}
                            </h1>
                        </div>
                        <p className="text-neutral-400 mt-1">
                            {language === 'en' ? 'Interactive scene breakdown.' : 'Desglose de escena interactivo.'}
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Controls */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Reset / New Project Button */}
                        <button
                            onClick={() => {
                                if (confirm(language === 'en' ? "Are you sure? This will clear everything." : "¿Estás seguro? Esto borrará todo tu progreso.")) {
                                    localStorage.removeItem("studio_project_data");
                                    setScriptText("");
                                    setCustomVision("");
                                    setGeneratedConcept(null);
                                    setDuration(600);
                                    setSceneCount(3);
                                    setPacing(50);
                                    setContrast(50);
                                    setActiveTab("concept");
                                    setAdvisorNote("");
                                }
                            }}
                            className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-red-500 border border-neutral-800 hover:border-red-500/50 rounded-lg transition-all mb-2"
                        >
                            <Trash2 size={14} />
                            {language === 'en' ? 'Reset Project' : 'Reiniciar Proyecto'}
                        </button>

                        {/* Guión Input */}
                        <section className="bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
                            <h2 className="text-sm font-semibold mb-2 flex items-center gap-2 text-neutral-400 uppercase tracking-wider">
                                {language === 'en' ? 'Screenplay' : 'Guión'}
                                {isProcessing && <div className="ml-auto animate-spin h-3 w-3 border-2 border-amber-500 border-t-transparent rounded-full" />}
                            </h2>

                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={cn(
                                    "relative group transition-all duration-300 mb-4",
                                    isDragging ? "scale-[1.02]" : ""
                                )}
                            >
                                <textarea
                                    value={scriptText}
                                    onChange={(e) => setScriptText(e.target.value)}
                                    placeholder={language === 'en' ? "Paste or Drop PDF screenplay..." : "Pega o Arrastra tu guión PDF..."}
                                    className={cn(
                                        "w-full h-32 bg-neutral-950 border rounded-lg p-3 text-sm text-neutral-100 focus:border-amber-500 outline-none resize-none placeholder:text-neutral-500 transition-colors",
                                        isDragging ? "border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]" : "border-neutral-700"
                                    )}
                                />

                                {/* File Picker Trigger */}
                                <label className="absolute bottom-2 right-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-md cursor-pointer hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-amber-500 group-hover:border-neutral-700 shadow-lg">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.txt"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                if (file.type === "application/pdf") await extractTextFromPDF(file);
                                                else setScriptText(await file.text());
                                            }
                                        }}
                                    />
                                    <Edit2 size={12} />
                                </label>

                                {isDragging && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-amber-500/5 backdrop-blur-[1px] rounded-lg border-2 border-dashed border-amber-500">
                                        <div className="bg-amber-500 text-black px-4 py-2 rounded-full text-xs font-black animate-bounce shadow-xl uppercase tracking-tighter">
                                            {language === 'en' ? 'Drop PDF Here' : 'Suelta el PDF aquí'}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!scriptText || scriptText.length < 10 ? (
                                <div className="space-y-3 mb-6 bg-amber-500/5 p-4 rounded-lg border border-amber-500/10">
                                    <h3 className="text-[10px] font-black uppercase text-amber-500/60 tracking-tighter">
                                        {language === 'en' ? 'Quick Plot Idea (Optional)' : 'Idea Rápida / Sinopsis (Opcional)'}
                                    </h3>
                                    <textarea
                                        value={customVision}
                                        onChange={(e) => setCustomVision(e.target.value)}
                                        placeholder={language === 'en' ? "Short summary if no script provided..." : "Resumen corto si no tienes el guion..."}
                                        className="w-full h-16 bg-transparent border-none p-0 text-xs text-neutral-300 focus:ring-0 outline-none resize-none placeholder:text-neutral-500"
                                    />
                                </div>
                            ) : (
                                <div className="mb-6 p-3 bg-neutral-950/50 rounded-lg border border-neutral-800 text-[10px] text-neutral-500 italic">
                                    {language === 'en' ? 'Using full screenplay for generation. Quick Plot ignored.' : 'Usando el guión completo para la generación. Idea rápida omitida.'}
                                </div>
                            )}

                            {/* Duration Selector */}
                            <div className="space-y-3 mb-6">
                                <label className="text-xs text-neutral-400 uppercase font-bold flex flex-wrap items-end justify-between gap-2">
                                    <span>{language === 'en' ? 'Target Duration' : 'Duración Estimada'}</span>
                                    <span className="text-amber-500 bg-neutral-900 px-2 py-0.5 rounded text-[10px] tracking-wide border border-neutral-800">
                                        {formatTime(duration)}
                                    </span>
                                </label>
                                <input
                                    type="range" min="7" max="12600" step="1"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <div className="flex justify-between text-[10px] text-neutral-500 italic">
                                    <span>7s (Reels)</span>
                                    <span>210m (Film)</span>
                                </div>
                            </div>

                            {/* Scene Count Selector - Conditional */}
                            {!scriptText || scriptText.length < 10 ? (
                                <div className="space-y-3 mb-6">
                                    <label className="text-xs text-neutral-400 uppercase font-bold flex justify-between">
                                        <span>{language === 'en' ? 'Scenes' : 'Escenas'}</span>
                                        <span className="text-amber-500">{sceneCount}</span>
                                    </label>
                                    <input
                                        type="range" min="1" max="15" value={sceneCount}
                                        onChange={(e) => setSceneCount(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <p className="text-[10px] text-neutral-500 italic">
                                        {language === 'en' ? 'Determines the number of AI-generated scenes.' : 'Determina el número de escenas generadas por la IA.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-6 space-y-2">
                                    <div className="flex justify-between items-center bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{language === 'en' ? 'Auto-Detected Scenes' : 'Escenas Detectadas'}</span>
                                        <span className="bg-amber-500 text-black text-xs font-black px-2 py-0.5 rounded-full">
                                            {scriptText.match(/(?:ESC|ESCENA|SCENE)\s*(\d+)/gi)?.length || 1}
                                        </span>
                                    </div>
                                    <p className="text-[9px] text-neutral-500 px-1">
                                        {language === 'en' ? 'AI will follow the structure of your script headers.' : 'La IA seguirá la estructura de los encabezados de tu guión.'}
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleGenerate}
                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg font-bold text-neutral-950 transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] text-sm"
                            >
                                {language === 'en' ? 'Generate Opening Sc.' : 'Generar Apertura'}
                            </button>
                        </section>

                        {/* ATMOSPHERE CONTROLS */}
                        {generatedConcept && (
                            <section className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-8 animate-in fade-in slide-in-from-left-4">
                                <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
                                    <Target size={16} className="text-amber-500" />
                                    {language === 'en' ? 'Atmosphere' : 'Atmósfera'}
                                </h2>

                                {/* Pacing Slider */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs text-neutral-400 uppercase font-mono">
                                        <span>{language === 'en' ? 'Slow / Tension' : 'Lento / Tensión'}</span>
                                        <span>{language === 'en' ? 'Fast / Chaos' : 'Rápido / Caos'}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" value={pacing}
                                        onChange={(e) => updateAtmosphere(parseInt(e.target.value), contrast)}
                                        className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                    <div className="text-xs text-center text-amber-500 font-mono">{pacing}% {language === 'en' ? 'Pacing' : 'Ritmo'}</div>
                                </div>

                                {/* Contrast Slider */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs text-neutral-400 uppercase font-mono">
                                        <span>{language === 'en' ? 'Natural' : 'Natural'}</span>
                                        <span>{language === 'en' ? 'Stylized' : 'Estilizado'}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" value={contrast}
                                        onChange={(e) => updateAtmosphere(pacing, parseInt(e.target.value))}
                                        className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <div className="text-xs text-center text-indigo-400 font-mono">{contrast}% {language === 'en' ? 'Contrast' : 'Contraste'}</div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: The Detailed Shot List */}
                    <div className="lg:col-span-9">
                        {generatedConcept ? (
                            <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden min-h-[600px] flex flex-col relative">

                                {advisorNote && (
                                    <div className="bg-indigo-500/10 border-b border-indigo-500/20 p-3 text-sm text-indigo-200 flex items-start gap-2">
                                        <div className="mt-0.5"><Users size={16} /></div>
                                        <p>{advisorNote}</p>
                                    </div>
                                )}

                                {/* Header */}
                                <div className="p-8 border-b border-neutral-800 bg-neutral-900/30">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <Film size={14} />
                                                {language === 'en' ? 'Project Overview' : 'Resumen del Proyecto'}
                                            </div>
                                            <input
                                                value={generatedConcept.title}
                                                onChange={(e) => setGeneratedConcept({ ...generatedConcept, title: e.target.value })}
                                                className="text-4xl font-extrabold text-white mb-2 bg-transparent border-none outline-none focus:ring-0 placeholder:text-neutral-700 w-full"
                                                placeholder="Project Title"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs Navigation */}
                                <div className="flex border-b border-neutral-800 bg-neutral-900/50 px-8 gap-6">
                                    <button
                                        onClick={() => setActiveTab('concept')}
                                        className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === 'concept' ? "border-amber-500 text-white" : "border-transparent text-neutral-500 hover:text-neutral-300")}
                                    >
                                        <Sparkles size={14} />
                                        {language === 'en' ? 'Concept' : 'Concepto'}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('structure')}
                                        className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === 'structure' ? "border-amber-500 text-white" : "border-transparent text-neutral-500 hover:text-neutral-300")}
                                    >
                                        <Trophy size={14} />
                                        {language === 'en' ? 'Structure' : 'Estructura'}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('shotlist')}
                                        className={cn("py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2", activeTab === 'shotlist' ? "border-amber-500 text-white" : "border-transparent text-neutral-500 hover:text-neutral-300")}
                                    >
                                        <Clapperboard size={14} />
                                        {language === 'en' ? 'Shot List' : 'Guion Técnico'}
                                    </button>
                                </div>

                                {/* Content Area */}
                                <div className="p-8 space-y-4 overflow-y-auto bg-neutral-950 flex-1">

                                    {/* CONCEPT TAB */}
                                    {activeTab === 'concept' && (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                            <div>
                                                <h3 className="text-neutral-500 text-sm font-mono uppercase mb-2">Logline</h3>
                                                <p className="text-2xl text-white leading-relaxed font-serif italic border-l-4 border-amber-500 pl-4">
                                                    "{generatedConcept.logline}"
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-neutral-500 text-sm font-mono uppercase mb-2">{language === 'en' ? 'Visual References' : 'Referencias Visuales'}</h3>
                                                <p className="text-neutral-300">{generatedConcept.ref}</p>
                                            </div>
                                            <div className="p-5 bg-emerald-900/10 border border-emerald-900/30 rounded-xl">
                                                <h3 className="text-emerald-500 text-sm font-bold mb-2 flex items-center gap-2">
                                                    <Target size={14} />
                                                    {language === 'en' ? 'Director\'s Note' : 'Nota del Director'}
                                                </h3>
                                                <p className="text-emerald-200/80 text-sm leading-relaxed">
                                                    {language === 'en'
                                                        ? "The structure focuses on establishing atmosphere before introducing the central conflict. This slow-burn approach is highly effective for festival circuits like Sundance or Berlin."
                                                        : "La estructura se centra en establecer la atmósfera antes de introducir el conflicto central. Este enfoque 'slow-burn' es muy efectivo para circuitos de festivales como Sundance o Berlín."}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* STRUCTURE TAB */}
                                    {activeTab === 'structure' && (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="space-y-4">
                                                {generatedConcept.escaleta?.map((beat: any, i: number) => (
                                                    <div key={i} className="flex gap-4 p-5 bg-neutral-900/50 rounded-xl border border-neutral-800 hover:border-amber-500/30 transition-all items-start group">
                                                        <div className="text-amber-500 font-mono text-xs font-bold whitespace-nowrap pt-3 w-20 bg-amber-500/10 py-1 px-2 rounded text-center">{beat.time}</div>
                                                        <div className="flex-1 space-y-2">
                                                            <input
                                                                value={beat.title}
                                                                onChange={(e) => handleUpdateEscaleta(i, 'title', e.target.value)}
                                                                className="font-bold text-white text-lg bg-transparent border border-transparent hover:border-neutral-700 focus:border-amber-500 rounded px-2 -ml-2 w-full outline-none transition-colors"
                                                            />
                                                            <textarea
                                                                value={beat.desc}
                                                                onChange={(e) => handleUpdateEscaleta(i, 'desc', e.target.value)}
                                                                rows={2}
                                                                className="text-neutral-400 text-sm leading-relaxed bg-transparent border border-transparent hover:border-neutral-700 focus:border-amber-500 rounded px-2 -ml-2 w-full outline-none transition-colors resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* AI ENDING PROPOSAL */}
                                            {generatedConcept.suggestedEnding && (
                                                <div className="mt-4 p-6 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-neutral-900 rounded-xl relative overflow-hidden group hover:border-amber-500/40 transition-all">
                                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                        <Sparkles size={120} />
                                                    </div>

                                                    <h4 className="text-amber-500 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                                        <Sparkles size={16} />
                                                        {language === 'en' ? 'AI Suggestion: Alternate Ending' : 'Sugerencia IA: Final Alternativo'}
                                                    </h4>

                                                    <h3 className="text-xl font-serif text-white italic mb-2">
                                                        "{generatedConcept.suggestedEnding.title}"
                                                    </h3>
                                                    <p className="text-neutral-300 text-sm leading-relaxed max-w-2xl relative z-10">
                                                        {generatedConcept.suggestedEnding.desc}
                                                    </p>

                                                    <div className="mt-4 flex gap-3">
                                                        <button className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold rounded-lg transition-colors border border-amber-500/20">
                                                            {language === 'en' ? 'Adopt this Ending' : 'Adoptar este Final'}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* SHOT LIST TAB */}
                                    {activeTab === 'shotlist' && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                            {generatedConcept.shotList?.map((shot: any, index: number) => (
                                                <div key={index} className={cn(
                                                    "group border rounded-lg p-5 transition-all flex gap-6 items-start",
                                                    editingShotIndex === index
                                                        ? "bg-neutral-900 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                                                        : "bg-neutral-900/50 border-neutral-800 hover:border-amber-500/40 hover:bg-neutral-900"
                                                )}>

                                                    {/* EDIT MODE */}
                                                    {editingShotIndex === index ? (
                                                        <div className="flex-1 space-y-4">
                                                            <div className="flex flex-wrap gap-4">
                                                                <div className="w-16 shrink-0">
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'ID' : 'ID'}</label>
                                                                    <input
                                                                        value={shot.id}
                                                                        onChange={(e) => handleUpdateShot(index, 'id', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-sm font-bold text-white text-center"
                                                                    />
                                                                </div>
                                                                <div className="w-16 shrink-0">
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Scene' : 'Escena'}</label>
                                                                    <input
                                                                        value={shot.scene}
                                                                        onChange={(e) => handleUpdateShot(index, 'scene', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-sm font-bold text-amber-500 text-center"
                                                                    />
                                                                </div>
                                                                <div className="w-24 shrink-0">
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Lens' : 'Lente'}</label>
                                                                    <input
                                                                        value={shot.lens}
                                                                        onChange={(e) => handleUpdateShot(index, 'lens', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs font-mono text-neutral-300 text-center"
                                                                    />
                                                                </div>
                                                                <div className="w-32 shrink-0">
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Type' : 'Encuadre'}</label>
                                                                    <input
                                                                        value={shot.type}
                                                                        onChange={(e) => handleUpdateShot(index, 'type', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-emerald-900/50 rounded px-2 py-1 text-xs font-bold text-emerald-400 uppercase"
                                                                    />
                                                                </div>
                                                                <div className="w-24 shrink-0">
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Time' : 'Tiempo'}</label>
                                                                    <input
                                                                        value={shot.time}
                                                                        onChange={(e) => handleUpdateShot(index, 'time', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-xs font-mono text-neutral-400"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Subject / Action' : 'Acción'}</label>
                                                                    <textarea
                                                                        value={shot.subject}
                                                                        onChange={(e) => handleUpdateShot(index, 'subject', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-white resize-none h-20 focus:border-amber-500 outline-none"
                                                                        placeholder={language === 'en' ? "What happens in this shot..." : "Qué sucede en este plano..."}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Shot Description' : 'Descripción plano'}</label>
                                                                    <textarea
                                                                        value={shot.description_detail}
                                                                        onChange={(e) => handleUpdateShot(index, 'description_detail', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-white resize-none h-20 focus:border-amber-500 outline-none"
                                                                        placeholder={language === 'en' ? "Visual composition, framing details..." : "Composición visual, detalles de encuadre..."}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* STORYBOARD UPLOAD AREA */}
                                                            <div className="mt-4 pt-4 border-t border-neutral-800">
                                                                <h4 className="text-[10px] uppercase text-neutral-500 font-bold mb-2 flex items-center gap-2">
                                                                    <Film size={12} />
                                                                    Storyboard / Reference
                                                                </h4>

                                                                {shot.storyboardImage ? (
                                                                    <div className="relative w-48 h-28 group/img overflow-hidden rounded-lg border border-neutral-700">
                                                                        <img src={shot.storyboardImage} alt="Storyboard" className="w-full h-full object-cover" />
                                                                        <button
                                                                            onClick={() => handleRemoveImage(index)}
                                                                            className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-48">
                                                                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-neutral-800 border-dashed rounded-lg cursor-pointer bg-neutral-900/50 hover:bg-neutral-800 hover:border-amber-500/50 transition-all">
                                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                                <FileDown size={20} className="text-neutral-500 mb-2" />
                                                                                <p className="text-[10px] text-neutral-400 font-bold uppercase">{language === 'en' ? 'Upload Image' : 'Subir Imagen'}</p>
                                                                            </div>
                                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(index, e)} />
                                                                        </label>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Audio / SFX' : 'Sonido/ Efectos'}</label>
                                                                    <input
                                                                        value={shot.audio}
                                                                        onChange={(e) => handleUpdateShot(index, 'audio', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-300"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Props' : 'Utilería'}</label>
                                                                    <input
                                                                        value={shot.props}
                                                                        onChange={(e) => handleUpdateShot(index, 'props', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-300"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Detail' : 'Detalle'}</label>
                                                                    <input
                                                                        value={shot.detail_shot}
                                                                        onChange={(e) => handleUpdateShot(index, 'detail_shot', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-300"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Actors' : 'Actores'}</label>
                                                                    <input
                                                                        value={shot.actors}
                                                                        onChange={(e) => handleUpdateShot(index, 'actors', e.target.value)}
                                                                        className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-300"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <label className="text-[10px] uppercase text-neutral-500 font-bold mb-1 block">{language === 'en' ? 'Director Note' : 'Nota del Director'}</label>
                                                                <input
                                                                    value={shot.note}
                                                                    onChange={(e) => handleUpdateShot(index, 'note', e.target.value)}
                                                                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-amber-200/70"
                                                                />
                                                            </div>

                                                            <div className="flex justify-end gap-2 pt-2">
                                                                <button
                                                                    onClick={() => setEditingShotIndex(null)}
                                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors"
                                                                >
                                                                    <Check size={14} /> {language === 'en' ? 'Save' : 'Guardar'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        // VIEW MODE
                                                        <>
                                                            {/* ID & Lens */}
                                                            <div className="flex flex-col items-center justify-center w-16 shrink-0 gap-2">
                                                                <div className="text-2xl font-black text-neutral-700 group-hover:text-amber-500/50 transition-colors">{shot.id}</div>
                                                                <div className="px-2 py-1 bg-neutral-950 rounded text-xs font-mono text-neutral-400 border border-neutral-800">{shot.lens}</div>
                                                            </div>

                                                            {/* Shot Details */}
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex flex-wrap items-center gap-3 mb-1">
                                                                    <span className={cn(
                                                                        "font-bold text-xs px-2 py-0.5 rounded border transition-all",
                                                                        shot.type === 'MASTER SHOT'
                                                                            ? "bg-amber-500 text-black border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                                                            : "text-amber-500 bg-amber-950/20 border-amber-900/40"
                                                                    )}>
                                                                        SC {shot.scene}
                                                                    </span>
                                                                    <span className="font-bold text-xs px-2 py-0.5 rounded border border-neutral-700 bg-neutral-800 text-neutral-300">
                                                                        {language === 'en' ? 'SHOT' : 'PLANO'} {shot.id}
                                                                    </span>
                                                                    <span className={cn(
                                                                        "font-bold tracking-wide text-sm uppercase px-2 py-0.5 rounded border",
                                                                        shot.type === 'MASTER SHOT'
                                                                            ? "bg-emerald-500 text-black border-emerald-400"
                                                                            : "text-emerald-400 bg-emerald-950/30 border-emerald-900/50"
                                                                    )}>
                                                                        {shot.type}
                                                                    </span>
                                                                    <span className="text-neutral-500 text-xs font-mono">{shot.time}</span>
                                                                </div>
                                                                <h3 className="text-lg font-bold text-white leading-snug">{shot.subject}</h3>
                                                                {shot.description_detail && (
                                                                    <p className="text-sm text-neutral-400 mt-1 italic leading-relaxed">{shot.description_detail}</p>
                                                                )}

                                                                {/* Audio, Props, Detail, Actors & Notes */}
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-neutral-800/50">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-neutral-600 uppercase font-black text-[9px]">{language === 'en' ? 'AUDIO / SFX' : 'SONIDO/ EFECTOS'}:</span>
                                                                        <span className="text-xs text-neutral-400">{shot.audio}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-neutral-600 uppercase font-black text-[9px]">{language === 'en' ? 'DESCRIPTION' : 'DESCRIPCIÓN'}:</span>
                                                                        <span className="text-xs text-neutral-300 italic">{shot.description_detail || "-"}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-neutral-600 uppercase font-black text-[9px]">{language === 'en' ? 'PROPS' : 'UTILERÍA'}:</span>
                                                                        <span className="text-xs text-neutral-400">{shot.props || "-"}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-neutral-600 uppercase font-black text-[9px]">{language === 'en' ? 'DETAIL' : 'DETALLE'}:</span>
                                                                        <span className="text-xs text-indigo-400">{shot.detail_shot || "-"}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-neutral-600 uppercase font-black text-[9px]">{language === 'en' ? 'ACTORS' : 'ACTORES'}:</span>
                                                                        <span className="text-xs text-emerald-400">{shot.actors || "-"}</span>
                                                                    </div>
                                                                    {shot.type === 'MASTER SHOT' && (
                                                                        <div className="flex flex-col gap-1 md:col-span-2">
                                                                            <span className="text-amber-500/50 uppercase font-black text-[9px]">{language === 'en' ? 'DIRECTOR NOTE' : 'NOTA DIRECTOR'}:</span>
                                                                            <span className="text-xs text-amber-200/70">{shot.note}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                                                <div className="flex flex-col gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                                                                    <button
                                                                        onClick={() => handleAddShotAt(index)}
                                                                        className="p-1.5 hover:bg-neutral-800 rounded text-amber-500/70 hover:text-amber-500 transition-colors flex items-center gap-2 text-[10px] font-bold"
                                                                        title={language === 'en' ? "Insert Shot After" : "Insertar Plano Después"}
                                                                    >
                                                                        <Plus size={14} /> {language === 'en' ? "SHOT" : "PLANO"}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleAddSceneAt(index)}
                                                                        className="p-1.5 hover:bg-neutral-800 rounded text-emerald-500/70 hover:text-emerald-500 transition-colors flex items-center gap-2 text-[10px] font-bold border-t border-neutral-800"
                                                                        title={language === 'en' ? "Insert Scene After" : "Insertar Escena Después"}
                                                                    >
                                                                        <Clapperboard size={14} /> {language === 'en' ? "SCENE" : "ESCENA"}
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() => setEditingShotIndex(index)}
                                                                    className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteShot(index)}
                                                                    className="p-2 hover:bg-red-900/30 rounded text-neutral-400 hover:text-red-400 transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            ))}

                                            <div className="flex justify-center pt-8 pb-4 gap-4">
                                                <button
                                                    onClick={() => handleAddSceneAt((generatedConcept.shotList?.length || 1) - 1)}
                                                    className="text-neutral-500 hover:text-amber-500 transition-colors text-sm flex items-center gap-2 group"
                                                >
                                                    <div className="w-8 h-8 rounded-full border border-dashed border-neutral-600 flex items-center justify-center group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-all">
                                                        <Film size={16} />
                                                    </div>
                                                    {language === 'en' ? 'Add Final Scene' : 'Añadir Escena Final'}
                                                </button>

                                                <button
                                                    onClick={handleExportPDF}
                                                    className="text-neutral-500 hover:text-emerald-500 transition-colors text-sm flex items-center gap-2 group"
                                                >
                                                    <div className="w-8 h-8 rounded-full border border-dashed border-neutral-600 flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                                                        <FileDown size={16} />
                                                    </div>
                                                    {language === 'en' ? 'Export to PDF' : 'Exportar a PDF'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full border-2 border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center p-8 text-center bg-neutral-900/20">
                                <Film size={48} className="text-neutral-700 mb-4" />
                                <h3 className="text-xl font-bold text-neutral-500 mb-2">
                                    {language === 'en' ? 'Script Generator' : 'Generador de Guiones'}
                                </h3>
                                <p className="text-neutral-600 max-w-sm">
                                    {language === 'en'
                                        ? 'Enter your vision on the left and generate a complete project breakdown.'
                                        : 'Introduce tu visión a la izquierda y genera un desglose de proyecto completo.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main >
    );
}
