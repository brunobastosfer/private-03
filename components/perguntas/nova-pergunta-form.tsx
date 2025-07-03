"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"

interface Tema {
  id: string
  titulo: string
}

interface Local {
  id: string
  nome: string
}

interface Personagem {
  id: string
  nome: string
}

interface Semana {
  id: string
  titulo: string
}

interface Answer {
  id?: string
  text: string
  correct: boolean
}

interface NovaPerguntaFormProps {
  onCancel: () => void
  onSave: (data: any) => void
  temas: Tema[]
  locais: Local[]
  personagens: Personagem[]
  semanas: Semana[]
  editingPergunta?: any
  isEditing?: boolean
}

export function NovaPerguntaForm({
  onCancel,
  onSave,
  temas,
  locais,
  personagens,
  semanas,
  editingPergunta,
  isEditing = false,
}: NovaPerguntaFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    context: "",
    theme_id: "",
    department_id: "",
    character_id: "",
    week_id: "",
  })

  const [answers, setAnswers] = useState<Answer[]>([
    { text: "", correct: false },
    { text: "", correct: false },
    { text: "", correct: false },
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isEditing && editingPergunta) {
      setFormData({
        title: editingPergunta.title || "",
        context: editingPergunta.context || "",
        theme_id: editingPergunta.theme_id || "",
        department_id: editingPergunta.department_id || "",
        character_id: editingPergunta.character_id || "",
        week_id: editingPergunta.week_id || "",
      })

      if (editingPergunta.answers && editingPergunta.answers.length > 0) {
        setAnswers(
          editingPergunta.answers.map((answer: any) => ({
            id: answer.id,
            text: answer.text,
            correct: answer.correct,
          })),
        )
      }
    }
  }, [isEditing, editingPergunta])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Título é obrigatório")
      return
    }

    if (!formData.context.trim()) {
      alert("Contexto é obrigatório")
      return
    }

    if (!formData.theme_id) {
      alert("Tema é obrigatório")
      return
    }

    if (!formData.department_id) {
      alert("Departamento é obrigatório")
      return
    }

    if (!formData.character_id) {
      alert("Personagem é obrigatório")
      return
    }

    const validAnswers = answers.filter((answer) => answer.text.trim())
    if (validAnswers.length < 2) {
      alert("É necessário pelo menos 2 respostas válidas")
      return
    }

    const hasCorrectAnswer = validAnswers.some((answer) => answer.correct)
    if (!hasCorrectAnswer) {
      alert("É necessário marcar pelo menos uma resposta como correta")
      return
    }

    setIsSubmitting(true)

    try {
      const submitData = {
        title: formData.title.trim(),
        context: formData.context.trim(),
        theme_id: formData.theme_id,
        department_id: formData.department_id,
        character_id: formData.character_id,
        week_id: formData.week_id || undefined,
        answers: validAnswers,
      }

      await onSave(submitData)
    } catch (error) {
      console.error("Erro ao salvar pergunta:", error)
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

  const handleAnswerChange = (index: number, field: "text" | "correct", value: string | boolean) => {
    if (field === "correct" && value === true) {
      // Only allow one correct answer - uncheck all others when one is selected
      setAnswers((prev) =>
        prev.map((answer, i) => ({
          ...answer,
          correct: i === index,
        })),
      )
    } else if (field === "text") {
      setAnswers((prev) => prev.map((answer, i) => (i === index ? { ...answer, [field]: value } : answer)))
    }
  }

  // Remove the removeAnswer function and addAnswer button functionality for editing
  const addAnswer = () => {
    if (!isEditing) {
      setAnswers((prev) => [...prev, { text: "", correct: false }])
    }
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-8">
        {!isEditing && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#3FA110]">Nova Pergunta</h2>
            <p className="text-gray-600 mt-2">Preencha as informações para criar uma nova pergunta</p>
          </div>
        )}

        {isEditing && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#3FA110]">Editar Pergunta</h2>
            <p className="text-gray-600 mt-2">Edite as informações da pergunta</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Título da Pergunta *
            </Label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
              placeholder="Digite o título da pergunta"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context" className="text-sm font-medium text-gray-700">
              Contexto da Pergunta *
            </Label>
            <textarea
              id="context"
              value={formData.context}
              onChange={(e) => handleInputChange("context", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110] min-h-[120px]"
              placeholder="Digite o contexto da pergunta"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme_id" className="text-sm font-medium text-gray-700">
                Tema *
              </Label>
              <select
                id="theme_id"
                value={formData.theme_id}
                onChange={(e) => handleInputChange("theme_id", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
                required
              >
                <option value="">Selecione um tema</option>
                {temas.map((tema) => (
                  <option key={tema.id} value={tema.id}>
                    {tema.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_id" className="text-sm font-medium text-gray-700">
                Departamento *
              </Label>
              <select
                id="department_id"
                value={formData.department_id}
                onChange={(e) => handleInputChange("department_id", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
                required
              >
                <option value="">Selecione um departamento</option>
                {locais.map((local) => (
                  <option key={local.id} value={local.id}>
                    {local.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="character_id" className="text-sm font-medium text-gray-700">
                Personagem *
              </Label>
              <select
                id="character_id"
                value={formData.character_id}
                onChange={(e) => handleInputChange("character_id", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
                required
              >
                <option value="">Selecione um personagem</option>
                {personagens.map((personagem) => (
                  <option key={personagem.id} value={personagem.id}>
                    {personagem.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="week_id" className="text-sm font-medium text-gray-700">
                Semana (opcional)
              </Label>
              <select
                id="week_id"
                value={formData.week_id}
                onChange={(e) => handleInputChange("week_id", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
              >
                <option value="">Sem semana</option>
                {semanas.map((semana) => (
                  <option key={semana.id} value={semana.id}>
                    {semana.titulo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">Respostas *</Label>
              {/* {!isEditing && (
                <Button
                  type="button"
                  onClick={addAnswer}
                  className="bg-[#3FA110] hover:bg-[#2d7a0c] text-white text-sm px-3 py-1 flex items-center gap-1"
                >
                  <Plus size={14} />
                  Adicionar Resposta
                </Button>
              )} */}
            </div>

            <div className="space-y-3">
              {answers.map((answer, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`answer-${index}`}
                      checked={answer.correct}
                      onCheckedChange={(checked) => handleAnswerChange(index, "correct", checked as boolean)}
                    />
                    <Label htmlFor={`answer-${index}`} className="text-sm text-gray-600">
                      Correta
                    </Label>
                  </div>

                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e) => handleAnswerChange(index, "text", e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3FA110]"
                    placeholder={`Resposta ${index + 1}`}
                  />

                  {/* Remove the delete button completely */}
                </div>
              ))}
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
                "Atualizar Pergunta"
              ) : (
                "Criar Pergunta"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
