"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface NovoUsuarioFormProps {
  onCancel: () => void
  onSave: (usuario: any) => void
  editingUsuario?: any
  isEditing?: boolean
}

export function NovoUsuarioForm({ onCancel, onSave, editingUsuario, isEditing = false }: NovoUsuarioFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cargo: "",
    status: "Ativo",
  })

  useEffect(() => {
    if (isEditing && editingUsuario) {
      setFormData({
        nome: editingUsuario.nome || "",
        email: editingUsuario.email || "",
        cargo: editingUsuario.cargo || "",
        status: editingUsuario.status || "Ativo",
      })
    } else {
      setFormData({
        nome: "",
        email: "",
        cargo: "",
        status: "Ativo",
      })
    }
  }, [isEditing, editingUsuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3FA110]">
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </h1>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-[#146E37] font-medium text-sm">
                Nome Completo
              </Label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite o nome completo do usuário..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#146E37] font-medium text-sm">
                Email
              </Label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="usuario@sicredi.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo" className="text-[#146E37] font-medium text-sm">
                Cargo
              </Label>
              <input
                id="cargo"
                type="text"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite o cargo do usuário..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-[#146E37] font-medium text-sm">
                Status
              </Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-[#3FA110] text-white hover:bg-[#2d7a0c] font-medium flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
