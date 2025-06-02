"use client"

import { Edit, Trash2, BarChart3 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Usuario {
  id: number
  nome: string
  email: string
  cargo: string
  avatar: string
  pontos: number
  dataIngresso: string
  status: string
}

interface UsuariosListProps {
  usuarios: Usuario[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  onViewReport: (id: number) => void
}

export function UsuariosList({ usuarios, onEdit, onDelete, onViewReport }: UsuariosListProps) {
  return (
    <div className="w-full max-w-6xl">
      {/* Tabela de Usuários */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header apenas com título */}
        <div className="p-4 md:p-6 pb-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#3FA110]">Lista de Usuários</h2>
        </div>

        {/* Conteúdo da tabela com scroll */}
        <div className="max-h-[400px] md:max-h-[600px] overflow-y-auto lista-scroll">
          <div className="p-4 md:p-6 pt-4">
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="border-b border-[#3FA110] pb-4 last:border-b-0">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Lado esquerdo: Avatar, Nome, Email e Cargo */}
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={usuario.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{usuario.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-black mb-1">{usuario.nome}</h3>
                        <p className="text-xs text-gray-600 mb-1">{usuario.email}</p>
                        <p className="text-xs text-[#5A645A] font-medium">{usuario.cargo}</p>
                      </div>
                    </div>

                    {/* Lado direito: Status, Pontos e Ações */}
                    <div className="flex items-center justify-between md:justify-end gap-4 md:ml-6">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              usuario.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {usuario.status}
                          </span>
                          <span className="text-sm font-medium text-black mt-1">{usuario.pontos} pts</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
          </div>
        </div>
      </div>
    </div>
  )
}
