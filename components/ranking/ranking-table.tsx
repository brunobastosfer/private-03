"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface RankingUser {
  id: string
  name: string
  email: string
  avatar: string
  points: number
  role: string
  gamerole: {
    id: string
    title: string
    points_to_achieve: number
  }
}

interface RankingTableProps {
  users: RankingUser[]
  isLoading?: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function RankingTable({ users, isLoading = false, currentPage, totalPages, onPageChange }: RankingTableProps) {
  return (
    <div className="flex-1 max-w-[1000px]">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Cabeçalho da tabela */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12"></div> {/* Espaço para posição + avatar */}
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-700">Nome</span>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-6">
              <div className="w-20 text-center">
                <span className="text-sm font-semibold text-gray-700">Cargo</span>
              </div>
              <div className="w-20 text-center">
                <span className="text-sm font-semibold text-gray-700">Pontuação</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo da tabela */}
        <div className="max-h-[500px] overflow-y-auto lista-scroll">
          <div className="p-6 pt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3FA110]"></div>
                <span className="ml-2 text-gray-600">Carregando ranking...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum usuário encontrado no ranking</div>
            ) : (
              <div className="space-y-4">
                {users.map((user, index) => {
                  // Calcular posição baseada na página atual
                  const position = (currentPage - 1) * 10 + index + 1

                  return (
                    <div key={user.id} className="border-b border-[#3FA110] pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        {/* Lado esquerdo: Posição + Avatar e Nome */}
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#3FA110] w-6">#{position}</span>
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex flex-col flex-1">
                            <h3 className="text-sm font-semibold text-black mb-1">{user.name}</h3>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>

                        {/* Lado direito: Cargo e Pontos */}
                        <div className="flex items-center gap-4 ml-6">
                          <div className="w-20 text-center">
                            <span className="text-sm text-[#5A645A] font-medium">{user.gamerole?.title || "N/A"}</span>
                          </div>
                          <div className="w-20 text-center">
                            <span className="text-sm font-medium text-black">{user.points} pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
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
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4"
                >
                  Próxima
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
