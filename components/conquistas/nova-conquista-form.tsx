"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface NovaConquistaFormProps {
  onCancel: () => void
  onSave: (conquista: any) => void
  editingConquista?: any
  isEditing?: boolean
}

export function NovaConquistaForm({ onCancel, onSave, editingConquista, isEditing = false }: NovaConquistaFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    imagem: "",
  })

  useEffect(() => {
    if (isEditing && editingConquista) {
      setFormData({
        nome: editingConquista.nome || "",
        imagem: editingConquista.imagem || "",
      })
    } else {
      setFormData({
        nome: "",
        imagem: "",
      })
    }
  }, [isEditing, editingConquista])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3FA110]">
            {isEditing ? "Editar Conquista" : "Nova Conquista"}
          </h1>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-[#146E37] font-medium text-sm">
                Nome da Conquista
              </Label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite o nome da conquista..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagem" className="text-[#146E37] font-medium text-sm">
                URL da Imagem
              </Label>
              <input
                id="imagem"
                type="url"
                value={formData.imagem}
                onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite a URL da imagem da conquista..."
              />
            </div>

            {formData.imagem && (
              <div className="space-y-2">
                <Label className="text-[#146E37] font-medium text-sm">Preview da Imagem</Label>
                <div className="flex justify-center">
                  <img
                    src={formData.imagem || "/placeholder.svg"}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=96&width=96"
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button type="submit" className="px-6 py-2 bg-[#3FA110] text-white hover:bg-[#2d7a0c] font-medium">
                {isEditing ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
