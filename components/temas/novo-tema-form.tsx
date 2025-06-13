"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import type { Theme } from "@/lib/api"

interface NovoTemaFormProps {
  onCancel: () => void
  onSave: (tema: any) => void
  editingTema?: Theme | null
  isEditing?: boolean
}

export function NovoTemaForm({ onCancel, onSave, editingTema, isEditing = false }: NovoTemaFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    worth: "",
  })

  useEffect(() => {
    if (isEditing && editingTema) {
      setFormData({
        title: editingTema.title || "",
        worth: editingTema.worth?.toString() || "",
      })
    } else {
      setFormData({
        title: "",
        worth: "",
      })
    }
  }, [isEditing, editingTema])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      // Converter worth para número
      const themeData = {
        title: formData.title,
        worth: Number.parseInt(formData.worth, 10),
      }

      await onSave(themeData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3FA110]">{isEditing ? "Editar Tema" : "Novo Tema"}</h1>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#146E37] font-medium text-sm">
                Título
              </Label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite o título do tema..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="worth" className="text-[#146E37] font-medium text-sm">
                Pontos
              </Label>
              <input
                id="worth"
                type="number"
                value={formData.worth}
                onChange={(e) => setFormData({ ...formData, worth: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite a pontuação do tema..."
                min="0"
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
