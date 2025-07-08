"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { Theme } from "@/lib/api"

interface NovaConquistaFormProps {
  onCancel: () => void
  onSave: (data: any) => void
  editingConquista?: any
  isEditing?: boolean
  temas: Theme[]
}

export function NovaConquistaForm({
  onCancel,
  onSave,
  editingConquista,
  isEditing = false,
  temas,
}: NovaConquistaFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badge: "",
    condition: "",
    more_than: "",
    theme: "",
    order: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isEditing && editingConquista) {
      setFormData({
        title: editingConquista.title || "",
        description: editingConquista.description || "",
        badge: editingConquista.badge || "",
        condition: editingConquista.condition || "",
        more_than: editingConquista.more_than?.toString() || "",
        theme: editingConquista.theme || "",
        order: editingConquista.order || ""
      })
    }
  }, [isEditing, editingConquista])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Título é obrigatório")
      return
    }

    if (!formData.description.trim()) {
      alert("Descrição é obrigatória")
      return
    }

    if (!formData.badge.trim()) {
      alert("Badge é obrigatório")
      return
    }

    if (!formData.condition.trim()) {
      alert("Condição é obrigatória")
      return
    }

    if (!formData.order) {
      alert("Condição é obrigatória")
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        badge: formData.badge.trim(),
        condition: formData.condition.trim(),
        more_than: formData.more_than ? Number.parseInt(formData.more_than) : null,
        theme: formData.theme || null,
        order: formData.order || null
      }

      await onSave(submitData)
    } catch (error) {
      console.error("Erro ao salvar conquista:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Restore the original condition options
  const conditionOptions = [
    { value: "", label: "Selecione uma condição..." },
    { value: "questions", label: "Perguntas respondidas" },
    { value: "question_themes", label: "Temas de perguntas" },
    { value: "points", label: "Pontos acumulados" },
  ]

  return (
    <div className="w-full max-w-[800px] mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#3FA110]">{isEditing ? "Editar Conquista" : "Nova Conquista"}</h2>
          <p className="text-gray-600 mt-2">
            {isEditing ? "Edite as informações da conquista" : "Preencha as informações para criar uma nova conquista"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Título *
              </Label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
                placeholder="Digite o título da conquista"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge" className="text-sm font-medium text-gray-700">
                Badge *
              </Label>
              <input
                id="badge"
                type="text"
                value={formData.badge}
                onChange={(e) => handleInputChange("badge", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
                placeholder="Digite o badge da conquista"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descrição *
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110] min-h-[100px]"
              placeholder="Digite a descrição da conquista"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Ordem *
            </Label>
            <input
              id="order"
              type="text"
              value={formData.order}
              onChange={(e) => handleInputChange("order", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110] min-h-[50px]"
              placeholder="Digite a ordenação da conquista."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="condition" className="text-sm font-medium text-gray-700">
                Condição *
              </Label>
              <select
                id="condition"
                value={formData.condition}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
                required
              >
                {conditionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="more_than" className="text-sm font-medium text-gray-700">
                Mais que (número)
              </Label>
              <input
                id="more_than"
                type="number"
                value={formData.more_than}
                onChange={(e) => handleInputChange("more_than", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
                placeholder="Ex: 100"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme" className="text-sm font-medium text-gray-700">
                Tema (opcional)
              </Label>
              <select
                id="theme"
                value={formData.theme}
                onChange={(e) => handleInputChange("theme", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
              >
                <option value="">Selecione um tema</option>
                {temas.map((tema) => (
                  <option key={tema.id} value={tema.title}>
                    {tema.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2 bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3FA110] hover:bg-[#2d7a0c] text-white px-6 py-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? "Atualizando..." : "Criando..."}
                </>
              ) : isEditing ? (
                "Atualizar Conquista"
              ) : (
                "Criar Conquista"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
