"use client";

import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";
import { Lock, Crown } from "lucide-react";

export default function UpgradeModal() {
    const { t, language } = useLanguage();
    const { upgradeToPremium } = useUser();

    // Mercado Pago Details from User
    const mpDetails = {
        name: "José Patricio Díaz Guajardo",
        rut: "11.229.252-7",
        bank: "Mercado Pago",
        type: "Cuenta Vista",
        number: "1037318913",
        email: "pdiazg46@gmail.com",
        amount: "$8.900", // New single price
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 md:p-8 relative shadow-2xl shadow-amber-900/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-t-2xl"></div>

                <div className="text-center mb-6">
                    <div className="inline-flex p-3 bg-amber-500/10 rounded-full text-amber-500 mb-4">
                        <Crown size={32} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {language === 'en' ? 'Unlock Full Access' : 'Desbloquea Acceso Total'}
                    </h2>
                    <p className="text-neutral-400">
                        {language === 'en'
                            ? 'Get unlimited access to the global festival database and the Creative Studio.'
                            : 'Obtén acceso ilimitado a la base de datos global y al Estudio Creativo.'}
                    </p>
                </div>

                <div className="bg-neutral-800/50 rounded-xl p-4 mb-6 border border-neutral-700">
                    <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wide mb-3 text-center">
                        {language === 'en' ? 'Payment Details (Transfer)' : 'Datos de Transferencia'}
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-neutral-500">{language === 'en' ? 'Bank' : 'Banco'}:</span>
                            <span className="text-white font-medium">{mpDetails.bank}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-500">{language === 'en' ? 'Account Type' : 'Tipo Cuenta'}:</span>
                            <span className="text-white font-medium">{mpDetails.type}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-500">{language === 'en' ? 'Account Number' : 'Nº Cuenta'}:</span>
                            <span className="text-white font-medium font-mono text-amber-200">{mpDetails.number}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-500">RUT:</span>
                            <span className="text-white font-medium">{mpDetails.rut}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-500">Email:</span>
                            <span className="text-white font-medium">{mpDetails.email}</span>
                        </div>
                        <div className="flex justify-between mt-2 pt-2 border-t border-neutral-700">
                            <span className="text-neutral-400">{language === 'en' ? 'Amount (One-time)' : 'Monto (Pago Único)'}:</span>
                            <span className="text-xl font-bold text-green-400">{mpDetails.amount} CLP</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => window.open(`mailto:${mpDetails.email}?subject=Pago Suscripción DESFOGA&body=Hola, he realizado la transferencia de ${mpDetails.amount} a la cuenta ${mpDetails.number}. Adjunto comprobante.`, '_blank')}
                        className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        {language === 'en' ? 'I sent the transfer' : 'Ya realicé la transferencia'}
                    </button>

                    {/* Simulator Button for MVP */}
                    <button
                        onClick={upgradeToPremium}
                        className="w-full py-2 px-4 text-xs text-neutral-500 hover:text-neutral-300 transition-colors uppercase tracking-widest"
                    >
                        {language === 'en' ? '[DEV] Activate Premium Now' : '[DEV] Activar Premium Ahora'}
                    </button>
                </div>

                <p className="text-xs text-neutral-600 text-center mt-6">
                    {language === 'en'
                        ? 'Your account will be activated manually after verifying the transfer.'
                        : 'Tu cuenta se activará manualmente tras verificar la transferencia (o usa el botón dev).'}
                </p>
            </div>
        </div>
    );
}
