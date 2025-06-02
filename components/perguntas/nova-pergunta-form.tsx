"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

interface NovaPerguntaFormProps {
  onCancel: () => void
  onSave: (pergunta: any) => void
  temas: Array<{ id: number; titulo: string }>
  locais: Array<{ id: number; nome: string }>
  personagens: Array<{ id: number; nome: string }>
  semanas: Array<{ id: number; titulo: string }>
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
    introducao: "",
    pergunta: "",
    respostas: [
      { texto: "", correta: false },
      { texto: "", correta: false },
      { texto: "", correta: false },
      { texto: "", correta: false },
    ],
    tema: "",
    local: "",
    personagem: "",
    semana: "",
  })

  // Carregar dados da pergunta quando estiver editando
  useEffect(() => {
    if (isEditing && editingPergunta) {
      // Encontrar o tema correspondente
      const temaEncontrado = temas.find((t) => t.titulo === editingPergunta.tema)

      setFormData({
        introducao: editingPergunta.introducao || "",
        pergunta: editingPergunta.descricao || "",
        respostas: editingPergunta.respostas || [
          { texto: "Resposta A", correta: true },
          { texto: "Resposta B", correta: false },
          { texto: "Resposta C", correta: false },
          { texto: "Resposta D", correta: false },
        ],
        tema: temaEncontrado ? temaEncontrado.id.toString() : "",
        local: editingPergunta.local || "",
        personagem: editingPergunta.personagem || "",
        semana: editingPergunta.semana || "",
      })
    } else {
      // Reset form para nova pergunta
      setFormData({
        introducao: "",
        pergunta: "",
        respostas: [
          { texto: "", correta: false },
          { texto: "", correta: false },
          { texto: "", correta: false },
          { texto: "", correta: false },
        ],
        tema: "",
        local: "",
        personagem: "",
        semana: "",
      })
    }
  }, [isEditing, editingPergunta, temas])

  const handleRespostaChange = (index: number, field: string, value: string | boolean) => {
    const novasRespostas = [...formData.respostas]
    if (field === "correta" && value === true) {
      // Se esta resposta está sendo marcada como correta, desmarcar as outras
      novasRespostas.forEach((resposta, i) => {
        resposta.correta = i === index
      })
    } else {
      novasRespostas[index] = { ...novasRespostas[index], [field]: value }
    }
    setFormData({ ...formData, respostas: novasRespostas })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="w-full max-w-4xl">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Introdução */}
              <div className="space-y-2">
                <Label htmlFor="introducao" className="text-[#146E37] font-medium text-sm">
                  Introdução
                </Label>
                <div className="relative">
                  <textarea
                    id="introducao"
                    value={formData.introducao}
                    onChange={(e) => setFormData({ ...formData, introducao: e.target.value })}
                    maxLength={500}
                    className="w-full p-3 pr-20 border border-gray-300 rounded-lg resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                    placeholder="Digite a introdução da pergunta..."
                  />
                  <div className="absolute bottom-2 right-3 text-xs text-gray-500 bg-white px-1">
                    {formData.introducao.length}/500
                  </div>
                </div>
              </div>

              {/* Pergunta */}
              <div className="space-y-2">
                <Label htmlFor="pergunta" className="text-[#146E37] font-medium text-sm">
                  Pergunta
                </Label>
                <div className="relative">
                  <textarea
                    id="pergunta"
                    value={formData.pergunta}
                    onChange={(e) => setFormData({ ...formData, pergunta: e.target.value })}
                    maxLength={500}
                    className="w-full p-3 pr-20 border border-gray-300 rounded-lg resize-none h-24 text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                    placeholder="Digite a pergunta..."
                  />
                  <div className="absolute bottom-2 right-3 text-xs text-gray-500 bg-white px-1">
                    {formData.pergunta.length}/500
                  </div>
                </div>
              </div>

              {/* Respostas */}
              <div className="space-y-4">
                <Label className="text-[#146E37] font-medium text-sm">Respostas</Label>
                {formData.respostas.map((resposta, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <button
                      type="button"
                      onClick={() => handleRespostaChange(index, "correta", !resposta.correta)}
                      className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                        resposta.correta
                          ? "bg-[#3FA110] border-[#3FA110] text-white"
                          : "border-gray-300 hover:border-[#3FA110]"
                      }`}
                    >
                      {resposta.correta && <Check size={16} />}
                    </button>
                    <input
                      type="text"
                      value={resposta.texto}
                      onChange={(e) => handleRespostaChange(index, "texto", e.target.value)}
                      placeholder={`Escreva a resposta de opção ${index + 1}`}
                      className="flex-1 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                    />
                  </div>
                ))}
              </div>

              {/* Tema */}
              <div className="space-y-2">
                <Label htmlFor="tema" className="text-[#146E37] font-medium text-sm">
                  Tema
                </Label>
                <select
                  id="tema"
                  value={formData.tema}
                  onChange={(e) => setFormData({ ...formData, tema: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                >
                  <option value="">Escolha o tema abaixo</option>
                  {temas.map((tema) => (
                    <option key={tema.id} value={tema.id}>
                      {tema.titulo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Local */}
              <div className="space-y-2">
                <Label htmlFor="local" className="text-[#146E37] font-medium text-sm">
                  Local
                </Label>
                <select
                  id="local"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                >
                  <option value="">Escolha o local abaixo</option>
                  {locais.map((local) => (
                    <option key={local.id} value={local.id}>
                      {local.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personagem */}
              <div className="space-y-2">
                <Label htmlFor="personagem" className="text-[#146E37] font-medium text-sm">
                  Personagem
                </Label>
                <select
                  id="personagem"
                  value={formData.personagem}
                  onChange={(e) => setFormData({ ...formData, personagem: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                >
                  <option value="">Escolha o personagem abaixo</option>
                  {personagens.map((personagem) => (
                    <option key={personagem.id} value={personagem.id}>
                      {personagem.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semana */}
              <div className="space-y-2">
                <Label htmlFor="semana" className="text-[#146E37] font-medium text-sm">
                  Semana
                </Label>
                <select
                  id="semana"
                  value={formData.semana}
                  onChange={(e) => setFormData({ ...formData, semana: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                >
                  <option value="">Escolha a semana abaixo</option>
                  {semanas.map((semana) => (
                    <option key={semana.id} value={semana.id}>
                      {semana.titulo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botões */}
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
    </div>
  )
}
