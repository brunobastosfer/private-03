"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import type { Week } from "@/lib/api"

interface NovaSemanaFormProps {
  onCancel: () => void
  onSave: (semana: any) => void
  editingSemana?: Week | null
  isEditing?: boolean
}

export function NovaSemanaForm({ onCancel, onSave, editingSemana, isEditing = false }: NovaSemanaFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    bonus: false,
    difficulty: "easy",
  })

  useEffect(() => {
    if (isEditing && editingSemana) {
      // Formatar as datas para o formato YYYY-MM-DD para o input date
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString)
        return date.toISOString().split("T")[0]
      }

      setFormData({
        title: editingSemana.title || "",
        start_date: formatDateForInput(editingSemana.start_date) || "",
        end_date: formatDateForInput(editingSemana.end_date) || "",
        bonus: editingSemana.bonus || false,
        difficulty: editingSemana.difficulty || "easy",
      })
    } else {
      setFormData({
        title: "",
        start_date: "",
        end_date: "",
        bonus: false,
        difficulty: "easy",
      })
    }
  }, [isEditing, editingSemana])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)

    try {
      // Converter as datas para o formato ISO-8601 completo
      const formattedData = {
        ...formData,
        start_date: formData.start_date ? new Date(formData.start_date + "T00:00:00.000Z").toISOString() : "",
        end_date: formData.end_date ? new Date(formData.end_date + "T23:59:59.999Z").toISOString() : "",
      }

      await onSave(formattedData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3FA110]">
            {isEditing ? "Editar Semana" : "Nova Semana"}
          </h1>
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
                placeholder="Digite o título da semana..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date" className="text-[#146E37] font-medium text-sm">
                Data de Início
              </Label>
              <input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date" className="text-[#146E37] font-medium text-sm">
                Data de Fim
              </Label>
              <input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-[#146E37] font-medium text-sm">
                Dificuldade
              </Label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                required
                disabled={isLoading}
              >
                <option value="easy">Fácil</option>
                <option value="medium">Normal</option>
                <option value="hard">Difícil</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="bonus"
                checked={formData.bonus}
                onCheckedChange={(checked) => setFormData({ ...formData, bonus: checked === true })}
                disabled={isLoading}
              />
              <Label htmlFor="bonus" className="text-[#146E37] font-medium text-sm cursor-pointer">
                Bonus
              </Label>
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
                {isLoading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
