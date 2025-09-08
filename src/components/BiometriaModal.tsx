"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface BiometriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tanqueId: number;
}

interface TanqueAlojamento {
  id: number;
  Tanque_Id: number;
  Data_Alojamento: string;
  Data_Saida: string | null;
  Total_Peixes: number | null;
}

export default function BiometriaModal({ isOpen, onClose, onSuccess, tanqueId }: BiometriaModalProps) {
  const [alojamentos, setAlojamentos] = useState<TanqueAlojamento[]>([]);
  const [selectedAlojamento, setSelectedAlojamento] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    Data: new Date().toISOString().split('T')[0],
    Racao: "",
    Temperatura_Agua: "",
    Ph: "",
    Temperatura_Ambiente: "",
    Oxigenacao: "",
    Percentual_Renovacao_Agua: "",
    Nitrito: "",
    Amonia: "",
    Transparencia: "",
    Quantidade_Alimentacoes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (isOpen && tanqueId) {
      loadAlojamentos();
    }
  }, [isOpen, tanqueId, loadAlojamentos]);

  const loadAlojamentos = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/tanque-alojamento/tanque/${tanqueId}`);
      const alojamentosAtivos = response.data.filter((alojamento: TanqueAlojamento) => !alojamento.Data_Saida);
      setAlojamentos(alojamentosAtivos);
      if (alojamentosAtivos.length > 0) {
        setSelectedAlojamento(alojamentosAtivos[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar alojamentos:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlojamento) {
      setErro("Selecione um alojamento ativo");
      return;
    }

    setIsLoading(true);
    setErro("");

    try {
      await axios.post("http://localhost:3001/biometria-diaria", {
        Data: new Date(formData.Data),
        Racao: parseFloat(formData.Racao),
        Tanque_Alojamento_Id: selectedAlojamento,
        Temperatura_Agua: parseFloat(formData.Temperatura_Agua),
        Ph: parseFloat(formData.Ph),
        Temperatura_Ambiente: formData.Temperatura_Ambiente,
        Oxigenacao: parseFloat(formData.Oxigenacao),
        Percentual_Renovacao_Agua: formData.Percentual_Renovacao_Agua ? parseFloat(formData.Percentual_Renovacao_Agua) : undefined,
        Nitrito: formData.Nitrito ? parseFloat(formData.Nitrito) : undefined,
        Amonia: formData.Amonia ? parseFloat(formData.Amonia) : undefined,
        Transparencia: formData.Transparencia ? parseFloat(formData.Transparencia) : undefined,
        Quantidade_Alimentacoes: formData.Quantidade_Alimentacoes ? parseInt(formData.Quantidade_Alimentacoes) : undefined,
      });

      setFormData({
        Data: new Date().toISOString().split('T')[0],
        Racao: "",
        Temperatura_Agua: "",
        Ph: "",
        Temperatura_Ambiente: "",
        Oxigenacao: "",
        Percentual_Renovacao_Agua: "",
        Nitrito: "",
        Amonia: "",
        Transparencia: "",
        Quantidade_Alimentacoes: "",
      });
      onSuccess();
      onClose();
    } catch (error) {
      setErro("Erro ao inserir biometria. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">Nova Biometria Diária</h2>
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
              Alojamento Ativo
            </label>
            <select
              value={selectedAlojamento || ""}
              onChange={(e) => setSelectedAlojamento(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              <option value="">Selecione um alojamento</option>
              {alojamentos.map((alojamento) => (
                <option key={alojamento.id} value={alojamento.id}>
                  Alojamento {alojamento.id} - {new Date(alojamento.Data_Alojamento).toLocaleDateString('pt-BR')}
                  {alojamento.Total_Peixes && ` (${alojamento.Total_Peixes} peixes)`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              value={formData.Data}
              onChange={(e) => setFormData({ ...formData, Data: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ração (kg)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.Racao}
              onChange={(e) => setFormData({ ...formData, Racao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade de Alimentações
            </label>
            <input
              type="number"
              min="1"
              value={formData.Quantidade_Alimentacoes}
              onChange={(e) => setFormData({ ...formData, Quantidade_Alimentacoes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Ex: 3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperatura da Água (°C)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.Temperatura_Agua}
              onChange={(e) => setFormData({ ...formData, Temperatura_Agua: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              pH
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.Ph}
              onChange={(e) => setFormData({ ...formData, Ph: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oxigenação (mg/L)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.Oxigenacao}
              onChange={(e) => setFormData({ ...formData, Oxigenacao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperatura Ambiente
            </label>
            <input
              type="text"
              value={formData.Temperatura_Ambiente}
              onChange={(e) => setFormData({ ...formData, Temperatura_Ambiente: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Ex: Quente, Frio, Ameno"
              required
            />
          </div>

          {/* Novos campos de qualidade da água */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-primary mb-3">Qualidade da Água</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Percentual de Renovação da Água (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.Percentual_Renovacao_Agua}
                onChange={(e) => setFormData({ ...formData, Percentual_Renovacao_Agua: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Ex: 15.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nitrito (mg/L)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.Nitrito}
                onChange={(e) => setFormData({ ...formData, Nitrito: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Ex: 0.05"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amônia (mg/L)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.Amonia}
                onChange={(e) => setFormData({ ...formData, Amonia: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Ex: 0.02"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transparência (cm)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.Transparencia}
                onChange={(e) => setFormData({ ...formData, Transparencia: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Ex: 25.0"
              />
            </div>
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
              {isLoading ? "Inserindo..." : "Inserir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
