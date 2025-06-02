"use client"

import { Edit, Trash2 } from "lucide-react"
import Image from "next/image"

interface Conquista {
  id: number
  nome: string
  imagem: string
}

interface ConquistasListProps {
  conquistas: Conquista[]
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function ConquistasList({ conquistas, onEdit, onDelete }: ConquistasListProps) {
  return (
    <div className="w-full max-w-6xl">
      {/* Tabela de Conquistas */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header apenas com título */}
        <div className="p-4 md:p-6 pb-4">
          <h2 className="text-lg md:text-xl font-semibold text-[#3FA110]">Lista de Conquistas</h2>
        </div>

        {/* Conteúdo da tabela com scroll */}
        <div className="max-h-[400px] md:max-h-[600px] overflow-y-auto lista-scroll">
          <div className="p-4 md:p-6 pt-4">
            <div className="space-y-4">
              {conquistas.map((conquista) => (
                <div key={conquista.id} className="border-b border-[#3FA110] pb-4 last:border-b-0">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    {/* Lado esquerdo: Imagem e Nome da Conquista */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={conquista.imagem || "/placeholder.svg"}
                          alt={conquista.nome}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-black">{conquista.nome}</h3>
                    </div>

                    {/* Lado direito: Ações */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(conquista.id)}
                        className="p-2 text-gray-600 hover:text-[#3FA110] transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(conquista.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
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
