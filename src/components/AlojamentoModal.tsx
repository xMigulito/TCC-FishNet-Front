"use client";

import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { useHotJar } from "@/hooks/useHotJar";
import { cache } from "../utils/cache";

interface AlojamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tanqueId: number;
}

export default function AlojamentoModal({ isOpen, onClose, onSuccess, tanqueId }: AlojamentoModalProps) {
  const [formData, setFormData] = useState({
    Data_Alojamento: new Date().toISOString().split('T')[0],
    Total_Peixes: "",
    Peso_Medio_Inicial: "",
    Biomassa_Inicial: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState("");
  const { trackEvent, trackConversion } = useHotJar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro("");

    try {
      await axios.post(API_ENDPOINTS.ALOJAMENTOS, {
        Tanque_Id: tanqueId,
        Data_Alojamento: new Date(formData.Data_Alojamento),
        Total_Peixes: parseInt(formData.Total_Peixes),
        Peso_Medio_Inicial: parseFloat(formData.Peso_Medio_Inicial),
        Biomassa_Inicial: parseInt(formData.Biomassa_Inicial),
      });

      // Limpar cache relacionado a alojamentos e tanques
      cache.invalidateOnInsert('alojamento');
      cache.invalidateOnInsert('tanque');
      console.log('🗑️ Cache de alojamentos e tanques limpo após cadastro');

      // Rastrear criação de alojamento
      trackEvent('Tank Housing Created', {
        tanqueId: tanqueId,
        totalPeixes: parseInt(formData.Total_Peixes),
        pesoMedioInicial: parseFloat(formData.Peso_Medio_Inicial),
        biomassaInicial: parseInt(formData.Biomassa_Inicial),
        dataAlojamento: formData.Data_Alojamento,
        timestamp: new Date().toISOString()
      });
      
      trackConversion('Tank Housing Created', 1);

      setFormData({
        Data_Alojamento: new Date().toISOString().split('T')[0],
        Total_Peixes: "",
        Peso_Medio_Inicial: "",
        Biomassa_Inicial: "",
      });
      onSuccess();
      onClose();
    } catch (error) {
      setErro("Erro ao cadastrar alojamento. Verifique os dados e tente novamente.");
      
      // Rastrear erro na criação
      trackEvent('Tank Housing Creation Error', {
        tanqueId: tanqueId,
        totalPeixes: formData.Total_Peixes,
        pesoMedioInicial: formData.Peso_Medio_Inicial,
        biomassaInicial: formData.Biomassa_Inicial,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">Novo Alojamento</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Alojamento
            </label>
            <input
              type="date"
              value={formData.Data_Alojamento}
              onChange={(e) => setFormData({ ...formData, Data_Alojamento: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total de Peixes
            </label>
            <input
              type="number"
              value={formData.Total_Peixes}
              onChange={(e) => setFormData({ ...formData, Total_Peixes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso Médio Inicial (g)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.Peso_Medio_Inicial}
              onChange={(e) => setFormData({ ...formData, Peso_Medio_Inicial: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biomassa Inicial (kg)
            </label>
            <input
              type="number"
              value={formData.Biomassa_Inicial}
              onChange={(e) => setFormData({ ...formData, Biomassa_Inicial: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>


          {erro && (
            <div className="text-red-600 text-sm">{erro}</div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/80 disabled:opacity-50"
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



