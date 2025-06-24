"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check, Loader2 } from "lucide-react"

// Modificar a interface para incluir week_id
interface NovaPerguntaFormProps {
  onCancel: () => void
  onSave: (pergunta: any & { week_id: string }) => void
  temas: Array<{ id: string; titulo: string }>
  locais: Array<{ id: string; nome: string }>
  personagens: Array<{ id: string; nome: string }>
  semanas: Array<{ id: string; titulo: string }>
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
  // Estado para controlar o loading do botão
  const [isLoading, setIsLoading] = useState(false)

  // Modificar o estado inicial para incluir week_id e reduzir para 3 respostas
  const [formData, setFormData] = useState({
    title: "",
    context: "",
    answers: [
      { text: "", correct: false },
      { text: "", correct: false },
      { text: "", correct: false },
    ],
    theme_id: "",
    department_id: "",
    character_id: "",
    week_id: "",
  })

  // Modificar o useEffect para incluir week_id
  useEffect(() => {
    if (isEditing && editingPergunta) {
      if (editingPergunta.id && editingPergunta.title) {
        // Dados da API
        const answers = editingPergunta.answers || []

        // Garantir que temos 3 respostas (preencher com vazias se necessário)
        while (answers.length < 3) {
          answers.push({ text: "", correct: false })
        }

        // Limitar a 3 respostas se tiver mais
        const limitedAnswers = answers.slice(0, 3)

        setFormData({
          title: editingPergunta.title || "",
          context: editingPergunta.context || "",
          answers: limitedAnswers,
          theme_id: editingPergunta.theme_id || "",
          department_id: editingPergunta.department_id || "",
          character_id: editingPergunta.character_id || "",
          week_id: editingPergunta.week_id || "",
        })
      } else {
        // Dados mockados (manter compatibilidade)
        const temaEncontrado = temas.find((t) => t.titulo === editingPergunta.tema)
        const semanaEncontrada = semanas.find((s) => s.titulo === editingPergunta.semana)

        setFormData({
          title: editingPergunta.titulo || "",
          context: editingPergunta.introducao || "",
          answers: (editingPergunta.respostas || []).slice(0, 3) || [
            { text: "Resposta A", correct: true },
            { text: "Resposta B", correct: false },
            { text: "Resposta C", correct: false },
          ],
          theme_id: temaEncontrado ? temaEncontrado.id.toString() : "",
          department_id: editingPergunta.local || "",
          character_id: editingPergunta.personagem || "",
          week_id: semanaEncontrada ? semanaEncontrada.id.toString() : "",
        })
      }
    } else {
      // Reset form para nova pergunta
      setFormData({
        title: "",
        context: "",
        answers: [
          { text: "", correct: false },
          { text: "", correct: false },
          { text: "", correct: false },
        ],
        theme_id: "",
        department_id: "",
        character_id: "",
        week_id: "",
      })
    }
  }, [isEditing, editingPergunta, temas, semanas])

  const handleRespostaChange = (index: number, field: string, value: string | boolean) => {
    const novasRespostas = [...formData.answers]
    if (field === "correct" && value === true) {
      // Se esta resposta está sendo marcada como correta, desmarcar as outras
      novasRespostas.forEach((resposta, i) => {
        resposta.correct = i === index
      })
    } else {
      novasRespostas[index] = { ...novasRespostas[index], [field]: value }
    }
    setFormData({ ...formData, answers: novasRespostas })
  }

  // Modificar o handleSubmit para incluir week_id e loading
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações do frontend
    if (!formData.title.trim()) {
      alert("O título da pergunta é obrigatório.")
      return
    }

    if (!formData.context.trim()) {
      alert("O contexto da pergunta é obrigatório.")
      return
    }

    // Se estiver editando, validar apenas título e contexto
    if (isEditing) {
      // Ativar loading
      setIsLoading(true)

      try {
        // Preparar dados para envio à API apenas com title e context
        const apiData = {
          title: formData.title.trim(),
          context: formData.context.trim(),
        }

        console.log("=== DADOS DO FORMULÁRIO DE EDIÇÃO ===")
        console.log("Dados preparados para envio à API (apenas title e context):", apiData)

        await onSave(apiData)
      } finally {
        // Desativar loading
        setIsLoading(false)
      }
      return
    }

    // Validações para nova pergunta
    if (!formData.theme_id) {
      alert("É necessário selecionar um tema.")
      return
    }

    if (!formData.department_id) {
      alert("É necessário selecionar um departamento.")
      return
    }

    if (!formData.character_id) {
      alert("É necessário selecionar um personagem.")
      return
    }

    if (!formData.week_id) {
      alert("É necessário selecionar uma semana.")
      return
    }

    // Verificar se pelo menos uma resposta está marcada como correta
    const hasCorrectAnswer = formData.answers.some((answer) => answer.correct)
    if (!hasCorrectAnswer) {
      alert("É necessário marcar pelo menos uma resposta como correta.")
      return
    }

    // Filtrar respostas vazias
    const validAnswers = formData.answers.filter((answer) => answer.text.trim() !== "")

    if (validAnswers.length < 2) {
      alert("É necessário fornecer pelo menos duas respostas.")
      return
    }

    // Ativar loading
    setIsLoading(true)

    try {
      // Preparar dados para envio à API no formato correto
      const apiData = {
        title: formData.title.trim(),
        context: formData.context.trim(),
        answers: validAnswers.map((answer) => ({
          text: answer.text.trim(),
          correct: answer.correct,
        })),
        theme_id: formData.theme_id,
        department_id: formData.department_id,
        character_id: formData.character_id,
        week_id: formData.week_id, // Incluído para validação e PATCH posterior
      }

      console.log("=== DADOS DO FORMULÁRIO ===")
      console.log("Dados preparados para envio à API:", apiData)

      await onSave(apiData)
    } finally {
      // Desativar loading
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {" "}
      {/* Aumentado para max-w-7xl e centralizado */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Título */}
        <div className="p-6 md:p-8 border-b border-gray-200">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3FA110]">
            {isEditing ? "Editar Pergunta" : "Nova Pergunta"}
          </h1>
        </div>

        {/* Container com scroll */}
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto lista-scroll">
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
              {/* Título da Pergunta */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#146E37] font-medium text-sm">
                  Título da Pergunta *
                </Label>
                <div className="relative">
                  <input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    maxLength={225}
                    className="w-full p-3 pr-20 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                    placeholder="Digite o título da pergunta..."
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-2 right-3 text-xs text-gray-500 bg-white px-1">
                    {formData.title.length}/225
                  </div>
                </div>
              </div>

              {/* Contexto */}
              <div className="space-y-2">
                <Label htmlFor="context" className="text-[#146E37] font-medium text-sm">
                  Contexto *
                </Label>
                <div className="relative">
                  <textarea
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    maxLength={225}
                    className="w-full p-3 pr-20 border border-gray-300 rounded-lg resize-none h-32 text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                    placeholder="Digite o contexto da pergunta..."
                    minLength={8}
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-2 right-3 text-xs text-gray-500 bg-white px-1">
                    {formData.context.length}/225
                  </div>
                </div>
              </div>

              {/* Tema - Bloqueado na edição */}
              <div className="space-y-2">
                <Label htmlFor="theme_id" className="text-[#146E37] font-medium text-sm">
                  Tema * {isEditing && <span className="text-gray-500">(bloqueado na edição)</span>}
                </Label>
                <select
                  id="theme_id"
                  value={formData.theme_id}
                  onChange={(e) => setFormData({ ...formData, theme_id: e.target.value })}
                  className={`w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent ${
                    isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  required={!isEditing}
                  disabled={isLoading || isEditing}
                >
                  <option value="">Escolha o tema abaixo</option>
                  {temas.map((tema) => (
                    <option key={tema.id} value={tema.id}>
                      {tema.titulo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Local/Departamento - Bloqueado na edição */}
              <div className="space-y-2">
                <Label htmlFor="department_id" className="text-[#146E37] font-medium text-sm">
                  Local * {isEditing && <span className="text-gray-500">(bloqueado na edição)</span>}
                </Label>
                <select
                  id="department_id"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  className={`w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent ${
                    isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  required={!isEditing}
                  disabled={isLoading || isEditing}
                >
                  <option value="">Escolha o local abaixo</option>
                  {locais.map((local) => (
                    <option key={local.id} value={local.id}>
                      {local.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personagem - Bloqueado na edição */}
              <div className="space-y-2">
                <Label htmlFor="character_id" className="text-[#146E37] font-medium text-sm">
                  Personagem * {isEditing && <span className="text-gray-500">(bloqueado na edição)</span>}
                </Label>
                <select
                  id="character_id"
                  value={formData.character_id}
                  onChange={(e) => setFormData({ ...formData, character_id: e.target.value })}
                  className={`w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent ${
                    isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  required={!isEditing}
                  disabled={isLoading || isEditing}
                >
                  <option value="">Escolha o personagem abaixo</option>
                  {personagens.map((personagem) => (
                    <option key={personagem.id} value={personagem.id}>
                      {personagem.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semana - Bloqueado na edição */}
              <div className="space-y-2">
                <Label htmlFor="week_id" className="text-[#146E37] font-medium text-sm">
                  Semana * {isEditing && <span className="text-gray-500">(bloqueado na edição)</span>}
                </Label>
                <select
                  id="week_id"
                  value={formData.week_id}
                  onChange={(e) => setFormData({ ...formData, week_id: e.target.value })}
                  className={`w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent ${
                    isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  required={!isEditing}
                  disabled={isLoading || isEditing}
                >
                  <option value="">Escolha a semana abaixo</option>
                  {semanas.map((semana) => (
                    <option key={semana.id} value={semana.id}>
                      {semana.titulo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Respostas - Bloqueadas na edição */}
              {!isEditing && (
                <div className="space-y-4">
                  <Label className="text-[#146E37] font-medium text-sm">
                    Respostas * (pelo menos 2 respostas obrigatórias)
                  </Label>
                  {formData.answers.map((resposta, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <button
                        type="button"
                        onClick={() => handleRespostaChange(index, "correct", !resposta.correct)}
                        className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                          resposta.correct
                            ? "bg-[#3FA110] border-[#3FA110] text-white"
                            : "border-gray-300 hover:border-[#3FA110]"
                        }`}
                        title={resposta.correct ? "Resposta correta" : "Marcar como resposta correta"}
                        disabled={isLoading}
                      >
                        {resposta.correct && <Check size={16} />}
                      </button>
                      <input
                        type="text"
                        value={resposta.text}
                        onChange={(e) => handleRespostaChange(index, "text", e.target.value)}
                        placeholder={`Escreva a resposta de opção ${index + 1}${index < 2 ? " (obrigatória)" : " (opcional)"}`}
                        className="flex-1 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                        maxLength={200}
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                  <p className="text-xs text-gray-600">
                    * Clique no círculo ao lado da resposta para marcá-la como correta. Pelo menos uma resposta deve
                    estar marcada como correta.
                  </p>
                </div>
              )}

              {/* Aviso para edição */}
              {isEditing && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Modo de Edição:</strong> Apenas o título e contexto podem ser editados. Os demais campos
                    estão bloqueados.
                  </p>
                </div>
              )}

              {/* Botões */}
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
    </div>
  )
}
