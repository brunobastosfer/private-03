"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface NovaSemanaFormProps {
  onCancel: () => void
  onSave: (semana: any) => void
  editingSemana?: any
  isEditing?: boolean
}

export function NovaSemanaForm({ onCancel, onSave, editingSemana, isEditing = false }: NovaSemanaFormProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    dataInicio: "",
    dataFim: "",
    tema: "",
    dificuldade: "",
  })

  useEffect(() => {
    if (isEditing && editingSemana) {
      setFormData({
        titulo: editingSemana.titulo || "",
        dataInicio: editingSemana.dataInicio || "",
        dataFim: editingSemana.dataFim || "",
        tema: editingSemana.tema || "",
        dificuldade: editingSemana.dificuldade || "",
      })
    } else {
      setFormData({
        titulo: "",
        dataInicio: "",
        dataFim: "",
        tema: "",
        dificuldade: "",
      })
    }
  }, [isEditing, editingSemana])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3FA110]">
            {isEditing ? "Editar Semana" : "Nova Semana"}
          </h1>
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
                placeholder="Digite o título da semana..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dataInicio" className="text-[#146E37] font-medium text-sm">
                  Data de Início
                </Label>
                <input
                  id="dataInicio"
                  type="text"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                  placeholder="DD/MM/AAAA"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim" className="text-[#146E37] font-medium text-sm">
                  Data de Fim
                </Label>
                <input
                  id="dataFim"
                  type="text"
                  value={formData.dataFim}
                  onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                  placeholder="DD/MM/AAAA"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tema" className="text-[#146E37] font-medium text-sm">
                Tema
              </Label>
              <input
                id="tema"
                type="text"
                value={formData.tema}
                onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite o tema da semana..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dificuldade" className="text-[#146E37] font-medium text-sm">
                Dificuldade
              </Label>
              <select
                id="dificuldade"
                value={formData.dificuldade}
                onChange={(e) => setFormData({ ...formData, dificuldade: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                required
              >
                <option value="">Selecione a dificuldade</option>
                <option value="Fácil">Fácil</option>
                <option value="Normal">Normal</option>
                <option value="Difícil">Difícil</option>
              </select>
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
