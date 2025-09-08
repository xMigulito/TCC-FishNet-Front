"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface BiometriaSemanalModalProps {
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

export default function BiometriaSemanalModal({ isOpen, onClose, onSuccess, tanqueId }: BiometriaSemanalModalProps) {
  const [alojamentos, setAlojamentos] = useState<TanqueAlojamento[]>([]);
  const [selectedAlojamento, setSelectedAlojamento] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    Data_Alojamento: new Date().toISOString().split('T')[0],
    Peixes_Mortos: "",
    Peixes_Capturados: "",
    Peso: "",
    Biomassa_Total: "",
    Data_Abertura: new Date().toISOString().split('T')[0],
    Data_Fechamento: new Date().toISOString().split('T')[0],
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
      await axios.post("http://localhost:3001/biometria-semanal", {
        Tanque_Alojamento_Id: selectedAlojamento,
        Data_Alojamento: new Date(formData.Data_Alojamento),
        Peixes_Mortos: parseInt(formData.Peixes_Mortos),
        Peixes_Capturados: parseFloat(formData.Peixes_Capturados),
        Peso: parseFloat(formData.Peso),
        Biomassa_Total: parseInt(formData.Biomassa_Total),
        Data_Abertura: new Date(formData.Data_Abertura),
        Data_Fechamento: new Date(formData.Data_Fechamento),
      });

      setFormData({
        Data_Alojamento: new Date().toISOString().split('T')[0],
        Peixes_Mortos: "",
        Peixes_Capturados: "",
        Peso: "",
        Biomassa_Total: "",
        Data_Abertura: new Date().toISOString().split('T')[0],
        Data_Fechamento: new Date().toISOString().split('T')[0],
      });
      onSuccess();
      onClose();
    } catch (error) {
      setErro("Erro ao inserir biometria semanal. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary">Nova Biometria Semanal</h2>
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
              Peixes Mortos
            </label>
            <input
              type="number"
              value={formData.Peixes_Mortos}
              onChange={(e) => setFormData({ ...formData, Peixes_Mortos: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peixes Capturados
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.Peixes_Capturados}
              onChange={(e) => setFormData({ ...formData, Peixes_Capturados: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso (g)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.Peso}
              onChange={(e) => setFormData({ ...formData, Peso: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biomassa Total (kg)
            </label>
            <input
              type="number"
              value={formData.Biomassa_Total}
              onChange={(e) => setFormData({ ...formData, Biomassa_Total: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Abertura
            </label>
            <input
              type="date"
              value={formData.Data_Abertura}
              onChange={(e) => setFormData({ ...formData, Data_Abertura: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Fechamento
            </label>
            <input
              type="date"
              value={formData.Data_Fechamento}
              onChange={(e) => setFormData({ ...formData, Data_Fechamento: e.target.value })}
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
              {isLoading ? "Inserindo..." : "Inserir"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



