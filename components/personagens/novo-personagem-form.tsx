"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { Character } from "@/lib/api"

interface NovoPersonagemFormProps {
  onCancel: () => void
  onSave: (personagem: any) => void
  editingPersonagem?: Character | null
  isEditing?: boolean
}

export function NovoPersonagemForm({
  onCancel,
  onSave,
  editingPersonagem,
  isEditing = false,
}: NovoPersonagemFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
  })

  useEffect(() => {
    if (isEditing && editingPersonagem) {
      setFormData({
        name: editingPersonagem.name || "",
      })
    } else {
      setFormData({
        name: "",
      })
    }
  }, [isEditing, editingPersonagem])

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
            {isEditing ? "Editar Personagem" : "Novo Personagem"}
          </h1>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#146E37] font-medium text-sm">
                Nome do Personagem
              </Label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite o nome do personagem..."
                required
                disabled={isLoading}
              />
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
