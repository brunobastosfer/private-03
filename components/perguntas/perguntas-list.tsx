"use client"

import { Edit, Trash2 } from "lucide-react"

interface Pergunta {
  id: number
  titulo: string
  descricao: string
  tema: string
  porcentagem: number
  pontos: number
}

interface PerguntasListProps {
  perguntas: Pergunta[]
  temas: Array<{ id: number; titulo: string; pontos: number }>
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function PerguntasList({ perguntas, temas, onEdit, onDelete }: PerguntasListProps) {
  return (
    <div className="w-full max-w-6xl">
      {/* Tabela de Perguntas */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header apenas com título */}
        <div className="p-4 md:p-6 pb-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#3FA110]">Lista de Perguntas</h2>
        </div>

        {/* Conteúdo da tabela com scroll */}
        <div className="max-h-[400px] md:max-h-[600px] overflow-y-auto lista-scroll">
          <div className="p-4 md:p-6 pt-4">
            <div className="space-y-4">
              {perguntas.map((pergunta) => {
                // Buscar o tema correspondente
                const temaEncontrado = temas.find((t) => t.titulo === pergunta.tema)
                const temaDisplay = temaEncontrado ? temaEncontrado.titulo : pergunta.tema

                return (
                  <div key={pergunta.id} className="border-b border-[#3FA110] pb-4 last:border-b-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      {/* Lado esquerdo: Pergunta, descrição e tema */}
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-black mb-2">{pergunta.titulo}</h3>
                        <p className="text-sm text-gray-700 mb-2">{pergunta.descricao}</p>
                        <p className="text-xs text-[#5A645A] font-medium">{temaDisplay}</p>
                      </div>

                      {/* Lado direito: Porcentagem, pontos da pergunta e ações */}
                      <div className="flex items-center justify-between md:justify-end gap-4 md:ml-6">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-black">{pergunta.porcentagem}%</div>
                          <div className="text-sm font-medium text-black">{pergunta.pontos} pts</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onEdit(pergunta.id)}
                            className="p-2 text-gray-600 hover:text-[#3FA110] transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(pergunta.id)}
                            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
