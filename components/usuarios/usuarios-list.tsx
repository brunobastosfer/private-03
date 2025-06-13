"use client"

import { Edit, Trash2, BarChart3, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Usuario {
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

interface UsuariosListProps {
  usuarios: Usuario[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onViewReport: (id: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function UsuariosList({
  usuarios,
  onEdit,
  onDelete,
  onViewReport,
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: UsuariosListProps) {
  return (
    <div className="w-full max-w-[1400px]">
      {/* Tabela de Usuários */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header com título */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#3FA110]">Lista de Usuários</h2>
        </div>

        {/* Cabeçalho da tabela */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12"></div> {/* Espaço para avatar */}
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
              <div className="w-24 text-center">
                <span className="text-sm font-semibold text-gray-700">Ações</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo da tabela com scroll */}
        <div className="max-h-[500px] overflow-y-auto lista-scroll">
          <div className="p-6 pt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3FA110]"></div>
                <span className="ml-2 text-gray-600">Carregando usuários...</span>
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum usuário encontrado</div>
            ) : (
              <div className="space-y-4">
                {usuarios.map((usuario) => (
                  <div key={usuario.id} className="border-b border-[#3FA110] pb-4 last:border-b-0">
                    <div className="flex items-center justify-between">
                      {/* Lado esquerdo: Avatar e Nome */}
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={usuario.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{usuario.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1">
                          <h3 className="text-sm font-semibold text-black mb-1">{usuario.name}</h3>
                          <p className="text-xs text-gray-600">{usuario.email}</p>
                        </div>
                      </div>

                      {/* Lado direito: Cargo, Pontos e Ações */}
                      <div className="flex items-center gap-4 ml-6">
                        <div className="w-20 text-center">
                          <span className="text-sm text-[#5A645A] font-medium">{usuario.gamerole?.title || "N/A"}</span>
                        </div>
                        <div className="w-20 text-center">
                          <span className="text-sm font-medium text-black">{usuario.points} pts</span>
                        </div>
                        <div className="w-24 flex justify-center gap-1">
                          <button
                            onClick={() => onViewReport(usuario.id)}
                            className="p-2 text-gray-600 hover:text-[#3FA110] transition-colors"
                            title="Ver Relatório"
                          >
                            <BarChart3 size={16} />
                          </button>
                          <button
                            onClick={() => onEdit(usuario.id)}
                            className="p-2 text-gray-600 hover:text-[#3FA110] transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(usuario.id)}
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
