"use client"

import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/api"

interface PerguntasListProps {
  perguntas: Question[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function PerguntasList({
  perguntas,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PerguntasListProps) {
  return (
    <div className="w-full max-w-[1400px]">
      {/* Tabela de Perguntas */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header apenas com título */}
        <div className="p-6 pb-4">
          <h2 className="text-xl font-semibold text-[#3FA110]">Lista de Perguntas</h2>
        </div>

        {/* Cabeçalho da tabela */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray-700">Título</span>
            </div>
            <div className="flex items-center gap-4 ml-6">
              <div className="w-24 text-center">
                <span className="text-sm font-semibold text-gray-700">Tema</span>
              </div>
              <div className="w-24 text-center">
                <span className="text-sm font-semibold text-gray-700">Pontos</span>
              </div>
              <div className="w-24 text-center">
                <span className="text-sm font-semibold text-gray-700">Ações</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo da tabela com scroll */}
        <div className="max-h-[600px] overflow-y-auto lista-scroll">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3FA110]"></div>
              <span className="ml-2 text-gray-600">Carregando perguntas...</span>
            </div>
          ) : perguntas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhuma pergunta encontrada</div>
          ) : (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                {perguntas.map((pergunta) => (
                  <div key={pergunta.id} className="border-b border-[#3FA110] pb-4 last:border-b-0">
                    <div className="flex justify-between items-start gap-4">
                      {/* Lado esquerdo: Pergunta e contexto */}
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-black mb-2">{pergunta.title}</h3>
                        <p className="text-sm text-gray-700 mb-2">{pergunta.context}</p>
                        {pergunta.week && (
                          <p className="text-xs text-[#5A645A] font-medium">
                            Semana: {pergunta.week.title || "Não definida"}
                          </p>
                        )}
                      </div>

                      {/* Lado direito: Ações */}
                      <div className="flex items-center justify-end gap-4 ml-6">
                        {pergunta.theme && (
                          <>
                            <div className="w-24 text-center">
                              <span className="text-sm text-[#5A645A] font-medium">
                                {pergunta.theme.title || "Sem tema"}
                              </span>
                            </div>
                            <div className="w-24 text-center">
                              <span className="text-sm font-medium text-black">{pergunta.theme.worth || 0} pts</span>
                            </div>
                          </>
                        )}
                        <div className="w-24 flex justify-center gap-2">
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
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Paginação */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4"
              >
                <ChevronLeft size={16} />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1 px-4"
              >
                Próxima
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
