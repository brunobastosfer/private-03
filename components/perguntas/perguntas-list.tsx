"use client"

import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { Question, Week } from "@/lib/api"

interface WeekWithCount extends Week {
  questionCount?: number
}

interface PerguntasListProps {
  perguntas: Question[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  weeks: WeekWithCount[]
  weekFilter: string
  onWeekFilterChange: (weekId: string) => void
  selectedWeekDetails?: any
  isLoadingWeekDetails?: boolean
}

export function PerguntasList({
  perguntas,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  weeks,
  weekFilter,
  onWeekFilterChange,
  selectedWeekDetails,
  isLoadingWeekDetails = false,
}: PerguntasListProps) {
  const getWeekDisplayName = (week: WeekWithCount) => {
    const count = week.questionCount || 0
    return `${week.title}`
  }

  const getQuestionsWithoutWeekCount = () => {
    return perguntas.filter((p) => !p.week_id).length
  }

  return (
    <div className="w-full max-w-[1400px]">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#3FA110]">Lista de Perguntas</h2>
          <div className="flex items-center gap-2">
            <Label htmlFor="week-filter" className="text-sm font-medium text-gray-700 shrink-0">
              Filtrar por Semana:
            </Label>
            <select
              id="week-filter"
              value={weekFilter}
              onChange={(e) => onWeekFilterChange(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] min-w-[250px]"
            >
              <option value="all">Todas as Semanas</option>
              <option value="none">
                Sem Semana ({getQuestionsWithoutWeekCount()})
              </option>
              {weeks.map((week) => (
                <option key={week.id} value={week.id}>
                  {getWeekDisplayName(week)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Week Details Section */}
        {weekFilter !== "all" && weekFilter !== "none" && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Detalhes da Semana</h3>
            {isLoadingWeekDetails ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-600">Carregando detalhes...</span>
              </div>
            ) : selectedWeekDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Título:</span>
                  <span className="ml-2 text-blue-600">{selectedWeekDetails.title}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Data Início:</span>
                  <span className="ml-2 text-blue-600">
                    {new Date(selectedWeekDetails.start_date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Data Fim:</span>
                  <span className="ml-2 text-blue-600">
                    {new Date(selectedWeekDetails.end_date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Bônus:</span>
                  <span className="ml-2 text-blue-600">{selectedWeekDetails.bonus ? "Sim" : "Não"}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Dificuldade:</span>
                  <span className="ml-2 text-blue-600">{selectedWeekDetails.difficulty}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Total de Perguntas:</span>
                  <span className="ml-2 text-blue-600">{perguntas.length}</span>
                </div>
              </div>
            ) : (
              <p className="text-blue-600">Não foi possível carregar os detalhes da semana.</p>
            )}
          </div>
        )}

        {weekFilter === "none" && (
          <div className="px-6 py-4 bg-orange-50 border-b border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Perguntas Sem Semana</h3>
            <p className="text-orange-600 text-sm">
              Exibindo {getQuestionsWithoutWeekCount()} pergunta{getQuestionsWithoutWeekCount() !== 1 ? "s" : ""} que
              não estão associadas a nenhuma semana.
            </p>
          </div>
        )}

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

        <div className="max-h-[600px] overflow-y-auto lista-scroll">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3FA110]"></div>
              <span className="ml-2 text-gray-600">Carregando perguntas...</span>
            </div>
          ) : perguntas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {weekFilter === "all"
                ? "Nenhuma pergunta encontrada."
                : weekFilter === "none"
                  ? "Nenhuma pergunta sem semana encontrada."
                  : "Nenhuma pergunta encontrada para esta semana."}
            </div>
          ) : (
            <div className="p-6 pt-4">
              <div className="space-y-4">
                {perguntas.map((pergunta) => (
                  <div key={pergunta.id} className="border-b border-[#3FA110] pb-4 last:border-b-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-black mb-2">{pergunta.title}</h3>
                        <p className="text-sm text-gray-700 mb-2">{pergunta.context}</p>
                        {pergunta.week ? (
                          <p className="text-xs text-[#5A645A] font-medium">Semana: {pergunta.week.title}</p>
                        ) : (
                          <p className="text-xs text-red-600 font-medium">Semana: Não definida</p>
                        )}
                      </div>

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
