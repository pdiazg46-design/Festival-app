import Papa from "papaparse";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1lc35_9wzNzYheLZhmrZU2zPQ9cpdDC0mHacCQb6LPs0/export?format=csv";

export interface FestivalData {
    id: string;
    name: string;
    location: string;
    region: string;
    type: string;
    dates: string;
    status: string;
    fee: string;
    description: {
        en: string;
        es: string;
    };
    winners: Array<{
        year: number;
        title: string;
        director: string;
        theme: {
            en: string;
            es: string;
        };
    }>;
}

export async function fetchFestivalsFromSheet(): Promise<FestivalData[]> {
    try {
        const response = await fetch(SHEET_URL);
        const csvData = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse(csvData, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const rawData = results.data as any[];

                    // Procesar los datos planos del CSV al formato JSON estructurado que usa la app
                    const processedData = rawData.map(row => ({
                        id: row.id || row.ID || "",
                        name: row.name || row.Nombre || "",
                        location: row.location || row.Ubicación || "",
                        region: row.region || row.Región || "",
                        type: row.type || row.Tipo || "",
                        dates: row.dates || row.Fechas || "",
                        status: row.status || row.Estado || "",
                        fee: row.fee || row.Costo || "0",
                        description: {
                            en: row.description_en || row["Descripción EN"] || "",
                            es: row.description_es || row["Descripción ES"] || ""
                        },
                        // Como las winners son complejas para un CSV plano, 
                        // asumimos un formato simplificado o inicial en la hoja.
                        // Para la prueba de fuego, pondremos ganadores ficticios si no existen.
                        winners: row.winners_json ? JSON.parse(row.winners_json) : [
                            {
                                year: 2024,
                                title: row.winner_title || row["Ganador"] || "Por anunciar",
                                director: "TBD",
                                theme: {
                                    en: row.winner_theme_en || row["Tema EN"] || "TBD",
                                    es: row.winner_theme_es || row["Tema ES"] || "TBD"
                                }
                            }
                        ]
                    }));

                    resolve(processedData);
                },
                error: (error: any) => {
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error("Error fetching sheet data:", error);
        return [];
    }
}
