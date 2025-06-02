"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface NovoTemaFormProps {
  onCancel: () => void
  onSave: (tema: any) => void
  editingTema?: any
  isEditing?: boolean
}

export function NovoTemaForm({ onCancel, onSave, editingTema, isEditing = false }: NovoTemaFormProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    pontos: "",
  })

  useEffect(() => {
    if (isEditing && editingTema) {
      setFormData({
        titulo: editingTema.titulo || "",
        descricao: editingTema.descricao || "",
        pontos: editingTema.pontos?.toString() || "",
      })
    } else {
      setFormData({
        titulo: "",
        descricao: "",
        pontos: "",
      })
    }
  }, [isEditing, editingTema])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3FA110]">{isEditing ? "Editar Tema" : "Novo Tema"}</h1>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-[#146E37] font-medium text-sm">
                Título
              </Label>
              <input
                id="titulo"
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite o título do tema..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-[#146E37] font-medium text-sm">
                Descrição
              </Label>
              <div className="relative">
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  maxLength={500}
                  className="w-full p-3 pr-20 border border-gray-300 rounded-lg resize-none h-32 text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                  placeholder="Digite a descrição do tema..."
                  required
                />
                <div className="absolute bottom-2 right-3 text-xs text-gray-500 bg-white px-1">
                  {formData.descricao.length}/500
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pontos" className="text-[#146E37] font-medium text-sm">
                Pontos
              </Label>
              <input
                id="pontos"
                type="number"
                value={formData.pontos}
                onChange={(e) => setFormData({ ...formData, pontos: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite a pontuação do tema..."
                min="0"
                required
              />
            </div>

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
