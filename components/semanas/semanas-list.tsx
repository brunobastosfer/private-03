"use client"

import { Edit, Trash2 } from "lucide-react"

interface Semana {
  id: number
  titulo: string
  dataInicio: string
  dataFim: string
  tema: string
  dificuldade: string
}

interface SemanasListProps {
  semanas: Semana[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function SemanasList({ semanas, onEdit, onDelete }: SemanasListProps) {
  return (
    <div className="w-full max-w-6xl">
      {/* Tabela de Semanas */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header apenas com título */}
        <div className="p-4 md:p-6 pb-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#3FA110]">Lista de Semanas</h2>
        </div>

        {/* Conteúdo da tabela com scroll */}
        <div className="max-h-[400px] md:max-h-[600px] overflow-y-auto lista-scroll">
          <div className="p-4 md:p-6 pt-4">
            <div className="space-y-4">
              {semanas.map((semana) => (
                <div key={semana.id} className="border-b border-[#3FA110] pb-4 last:border-b-0">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    {/* Lado esquerdo: Semana, data e tema */}
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-black mb-2">{semana.titulo}</h3>
                      <p className="text-sm text-gray-700 mb-2">
                        Data: {semana.dataInicio} - {semana.dataFim}
                      </p>
                    </div>

                    {/* Lado direito: Dificuldade e ações */}
                    <div className="flex items-center justify-center md:justify-center gap-4 md:ml-6">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-black">{semana.dificuldade}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(semana.id)}
                          className="p-2 text-gray-600 hover:text-[#3FA110] transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(semana.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
