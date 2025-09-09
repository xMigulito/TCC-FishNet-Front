"use client";

import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { useHotJar } from "@/hooks/useHotJar";

interface NovoTanqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function NovoTanqueModal({ isOpen, onClose, onSuccess }: NovoTanqueModalProps) {
  const [formData, setFormData] = useState({
    Local: "",
    Largura: "",
    Comprimento: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState("");
  const { trackEvent, trackConversion } = useHotJar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErro("");

    try {
      await axios.post(API_ENDPOINTS.TANQUES, {
        Local: formData.Local,
        Largura: parseFloat(formData.Largura),
        Comprimento: parseFloat(formData.Comprimento),
      });

      // Rastrear criação de tanque
      trackEvent('Tank Created', {
        local: formData.Local,
        largura: parseFloat(formData.Largura),
        comprimento: parseFloat(formData.Comprimento),
        timestamp: new Date().toISOString()
      });
      
      trackConversion('Tank Created', 1);

      setFormData({ Local: "", Largura: "", Comprimento: "" });
      onSuccess();
      onClose();
    } catch (error) {
      setErro("Erro ao cadastrar tanque. Verifique os dados e tente novamente.");
      
      // Rastrear erro na criação
      trackEvent('Tank Creation Error', {
        local: formData.Local,
        largura: formData.Largura,
        comprimento: formData.Comprimento,
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
          <h2 className="text-xl font-bold text-primary">Novo Tanque</h2>
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
              Local
            </label>
            <input
              type="text"
              value={formData.Local}
              onChange={(e) => setFormData({ ...formData, Local: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Largura (metros)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.Largura}
              onChange={(e) => setFormData({ ...formData, Largura: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comprimento (metros)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.Comprimento}
              onChange={(e) => setFormData({ ...formData, Comprimento: e.target.value })}
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
