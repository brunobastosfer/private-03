"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Conquista {
  id: string
  title: string
  description: string
  badge: string
  condition: string
  more_than?: number | null
  theme?: string | null
}

interface NovaConquistaFormProps {
  onCancel: () => void
  onSave: (conquista: any) => void
  editingConquista?: Conquista | null
  isEditing?: boolean
}

export function NovaConquistaForm({ onCancel, onSave, editingConquista, isEditing = false }: NovaConquistaFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [badgeError, setBadgeError] = useState("")
  const [conditionError, setConditionError] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    badge: "",
    condition: "",
    more_than: "",
    theme: "",
  })

  // Opções válidas para condição
  const conditionOptions = [
    { value: "", label: "Selecione uma condição..." },
    { value: "questions", label: "Perguntas respondidas" },
    { value: "question_theme", label: "Temas de perguntas" },
    { value: "points", label: "Pontos acumulados" },
  ]

  useEffect(() => {
    if (isEditing && editingConquista) {
      setFormData({
        title: editingConquista.title || "",
        description: editingConquista.description || "",
        badge: editingConquista.badge || "",
        condition: editingConquista.condition || "",
        more_than: editingConquista.more_than?.toString() || "",
        theme: editingConquista.theme || "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        badge: "",
        condition: "",
        more_than: "",
        theme: "",
      })
    }
  }, [isEditing, editingConquista])

  // Validação em tempo real do badge
  const validateBadge = (badge: string) => {
    if (!badge.trim()) {
      setBadgeError("")
      return true
    }

    // Regex para validar: apenas letras minúsculas, números e hífen
    const badgeRegex = /^[a-z0-9-]+$/

    if (!badgeRegex.test(badge)) {
      setBadgeError("O identificador do emblema deve conter apenas letras minúsculas, números e hífen")
      return false
    }

    setBadgeError("")
    return true
  }

  // Validação da condição
  const validateCondition = (condition: string) => {
    const validConditions = ["questions", "question_theme", "points"]

    if (!condition.trim()) {
      setConditionError("A condição é obrigatória")
      return false
    }

    if (!validConditions.includes(condition)) {
      setConditionError('O tipo de condição deve ser "questions" ou "question_theme" ou "points"')
      return false
    }

    setConditionError("")
    return true
  }

  // Handler para mudança no badge
  const handleBadgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({ ...formData, badge: value })
    validateBadge(value)
  }

  // Handler para mudança na condição
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFormData({ ...formData, condition: value })
    validateCondition(value)
  }

  // Verificar se o formulário é válido
  const isFormValid = () => {
    const isTitleValid = formData.title.trim().length > 0
    const isDescriptionValid = formData.description.trim().length > 0
    const isBadgeValid = formData.badge.trim().length > 0 && badgeError === ""
    const isConditionValid = formData.condition.trim().length > 0 && conditionError === ""

    return isTitleValid && isDescriptionValid && isBadgeValid && isConditionValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("=== INICIANDO SUBMIT DO FORMULÁRIO ===")
    console.log("Form Data atual:", formData)

    // Validate required fields
    if (!formData.title.trim()) {
      toast({
        title: "⚠️ Campo obrigatório",
        description: "O título da conquista é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (!formData.description.trim()) {
      toast({
        title: "⚠️ Campo obrigatório",
        description: "A descrição da conquista é obrigatória.",
        variant: "destructive",
      })
      return
    }

    if (!formData.badge.trim()) {
      toast({
        title: "⚠️ Campo obrigatório",
        description: "O badge da conquista é obrigatório.",
        variant: "destructive",
      })
      return
    }

    // Validar badge
    if (!validateBadge(formData.badge)) {
      toast({
        title: "⚠️ Badge inválido",
        description: "O identificador do emblema deve conter apenas letras minúsculas, números e hífen.",
        variant: "destructive",
      })
      return
    }

    if (!formData.condition.trim()) {
      toast({
        title: "⚠️ Campo obrigatório",
        description: "A condição da conquista é obrigatória.",
        variant: "destructive",
      })
      return
    }

    // Validar condição
    if (!validateCondition(formData.condition)) {
      toast({
        title: "⚠️ Condição inválida",
        description: 'O tipo de condição deve ser "questions" ou "question_theme" ou "points".',
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Preparar dados da conquista com conversões adequadas
      const conquistaData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        badge: formData.badge.trim(),
        condition: formData.condition.trim(),
        more_than: formData.more_than.trim() ? Number(formData.more_than.trim()) : null,
        theme: formData.theme.trim() || null,
      }

      console.log("=== DADOS PREPARADOS PARA ENVIO ===")
      console.log("Form Data original:", formData)
      console.log("Conquista Data processada:", conquistaData)
      console.log("Tipos dos campos:")
      console.log("- title:", typeof conquistaData.title, conquistaData.title)
      console.log("- description:", typeof conquistaData.description, conquistaData.description)
      console.log("- badge:", typeof conquistaData.badge, conquistaData.badge)
      console.log("- condition:", typeof conquistaData.condition, conquistaData.condition)
      console.log("- more_than:", typeof conquistaData.more_than, conquistaData.more_than)
      console.log("- theme:", typeof conquistaData.theme, conquistaData.theme)

      // Validações adicionais após processamento
      if (conquistaData.more_than !== null && (isNaN(conquistaData.more_than) || conquistaData.more_than < 0)) {
        toast({
          title: "⚠️ Valor inválido",
          description: "O campo 'Mais que' deve ser um número válido maior ou igual a zero.",
          variant: "destructive",
        })
        return
      }

      await onSave(conquistaData)
    } catch (error) {
      console.error("=== ERRO NO SUBMIT DO FORMULÁRIO ===")
      console.error("Erro completo:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao processar os dados da conquista.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3FA110]">
            {isEditing ? "Editar Conquista" : "Nova Conquista"}
          </h1>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#146E37] font-medium text-sm">
                Título da Conquista
              </Label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite o título da conquista..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#146E37] font-medium text-sm">
                Descrição
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent resize-none h-24"
                placeholder="Digite a descrição da conquista..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge" className="text-[#146E37] font-medium text-sm">
                Badge (Identificador do Emblema)
              </Label>
              <div className="relative">
                <input
                  id="badge"
                  type="text"
                  value={formData.badge}
                  onChange={handleBadgeChange}
                  className={`w-full p-3 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                    badgeError
                      ? "border-red-500 focus:ring-red-500"
                      : formData.badge && !badgeError
                        ? "border-green-500 focus:ring-green-500"
                        : "border-gray-300 focus:ring-[#3FA110]"
                  }`}
                  placeholder="Digite o badge (ex: mestre-conhecimento, expert-100)..."
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {formData.badge && (
                    <>
                      {badgeError ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </>
                  )}
                </div>
              </div>
              {badgeError && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {badgeError}
                </p>
              )}
              <p className="text-gray-500 text-xs">
                Apenas letras minúsculas, números e hífen são permitidos (ex: mestre-conhecimento, expert-100)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition" className="text-[#146E37] font-medium text-sm">
                Condição
              </Label>
              <div className="relative">
                <select
                  id="condition"
                  value={formData.condition}
                  onChange={handleConditionChange}
                  className={`w-full p-3 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                    conditionError
                      ? "border-red-500 focus:ring-red-500"
                      : formData.condition && !conditionError
                        ? "border-green-500 focus:ring-green-500"
                        : "border-gray-300 focus:ring-[#3FA110]"
                  }`}
                  required
                  disabled={isLoading}
                >
                  {conditionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-8 pr-3 flex items-center pointer-events-none">
                  {formData.condition && (
                    <>
                      {conditionError ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </>
                  )}
                </div>
              </div>
              {conditionError && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {conditionError}
                </p>
              )}
              <p className="text-gray-500 text-xs">Selecione o tipo de condição para a conquista</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="more_than" className="text-[#146E37] font-medium text-sm">
                Mais que (opcional)
              </Label>
              <input
                id="more_than"
                type="number"
                value={formData.more_than}
                onChange={(e) => setFormData({ ...formData, more_than: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite um número (deixe vazio para null)..."
                min="0"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme" className="text-[#146E37] font-medium text-sm">
                Tema (opcional)
              </Label>
              <input
                id="theme"
                type="text"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                placeholder="Digite o tema da conquista (deixe vazio para null)..."
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
                className={`px-6 py-2 font-medium flex items-center gap-2 ${
                  isFormValid() && !isLoading
                    ? "bg-[#3FA110] text-white hover:bg-[#2d7a0c]"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                disabled={isLoading || !isFormValid()}
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
