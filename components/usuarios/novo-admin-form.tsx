"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { getAuthToken } from "@/lib/auth"

interface NovoAdminFormProps {
  onClose: () => void
  onSuccess: () => void
}

export function NovoAdminForm({ onClose, onSuccess }: NovoAdminFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    avatar: "",
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    try {
      setIsUploading(true)
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

      console.log("Enviando arquivo:", file.name, file.type, file.size)

      const response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: "POST",
        body: formDataUpload,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Resposta do servidor:", response.status, errorText)
        throw new Error(`Falha ao fazer upload da imagem: ${response.status} ${errorText}`)
      }

      const contentType = response.headers.get("content-type") || ""
      let imageUrl = ""

      if (contentType.includes("application/json")) {
        const data = await response.json()
        console.log("Resposta do upload (JSON):", data)
        imageUrl = data.url || data.imageUrl || data.image || data.path || ""
      } else {
        imageUrl = await response.text()
        console.log("Resposta do upload (texto):", imageUrl)
      }

      if (!imageUrl || typeof imageUrl !== "string") {
        throw new Error("URL da imagem não encontrada na resposta")
      }

      setFormData((prev) => ({ ...prev, avatar: imageUrl }))

      toast({
        title: "✅ Upload concluído",
        description: "Imagem carregada com sucesso",
      })
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      toast({
        title: "⚠️ Erro no upload",
        description: error instanceof Error ? error.message : "Não foi possível fazer o upload da imagem",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    console.log("=== CANCELANDO FORMULÁRIO ===")
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      email: formData.email,
      name: formData.name,
      avatar: formData.avatar || null,
      gamerole_id: "761647be-49e7-4cde-9107-277042dbb3c2",
    }

    try {
      setIsSubmitting(true)

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

      console.log("Enviando payload para criação de admin:", payload)

      // Obter token do cookie
      const token = getAuthToken()

      if (!token) {
        console.error("=== TOKEN NÃO ENCONTRADO ===")
        console.error("Cookie sicredi_auth_token não existe ou está vazio")
        throw new Error("Token de autorização não encontrado. Faça login novamente.")
      }

      console.log("=== TOKEN ENCONTRADO ===")
      console.log("Token:", token.substring(0, 20) + "...")

      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      console.log("Status da resposta:", response.status)
      console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log("Texto da resposta:", responseText)

      let responseData
      try {
        responseData = JSON.parse(responseText)
        console.log("Resposta parseada como JSON:", responseData)
      } catch (e) {
        console.error("Erro ao parsear resposta como JSON:", e)
        responseData = { message: responseText }
      }

      if (!response.ok) {
        let errorMessage = "Erro ao criar usuário admin"

        switch (response.status) {
          case 400:
            errorMessage = responseData?.message || "Dados inválidos. Verifique os campos preenchidos."
            break
          case 401:
            errorMessage = "Não autorizado. Faça login novamente."
            break
          case 403:
            errorMessage = "Sem permissão para criar usuários admin."
            break
          case 409:
            errorMessage = "Email já está em uso. Escolha outro email."
            break
          case 422:
            errorMessage = "Dados não atendem aos critérios. Verifique os campos."
            break
          case 500:
            errorMessage = "Erro interno do servidor. Tente novamente mais tarde."
            break
          default:
            errorMessage = responseData?.message || `Erro ${response.status}: Falha ao criar usuário admin`
        }

        if (response.status === 401) {
          console.error("=== ERRO 401 - NÃO AUTORIZADO ===")
          console.error("Redirecionando para login...")

          // Remover token e redirecionar
          document.cookie = "sicredi_auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict"
          window.location.href = "/"
          return
        }

        console.error("Erro detalhado:", errorMessage)
        throw new Error(errorMessage)
      }

      toast({
        title: "✅ Admin criado",
        description: "Usuário admin foi criado com sucesso.",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Erro ao criar admin (objeto completo):", error)

      let errorMessage = "Não foi possível criar o usuário admin"

      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: "⚠️ Erro na criação",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Criar Usuário Admin</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 text-sm font-medium">
              Nome completo *
            </Label>
            <input
              id="name"
              type="text"
              placeholder="Digite o nome completo"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sicredi-green focus:border-transparent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
              Email *
            </Label>
            <input
              id="email"
              type="email"
              placeholder="admin@sicredi.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sicredi-green focus:border-transparent"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Campo Avatar */}
          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-gray-700 text-sm font-medium">
              Avatar (opcional)
            </Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sicredi-green focus:border-transparent"
                />
                {isUploading && (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin text-sicredi-green" />
                    <span className="text-sicredi-green text-xs">Enviando...</span>
                  </div>
                )}
              </div>

              {formData.avatar && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={formData.avatar || "/placeholder.svg"}
                    alt="Avatar preview"
                    className="h-10 w-10 rounded-full object-cover border border-gray-300"
                    onError={(e) => {
                      console.error("Erro ao carregar imagem:", formData.avatar)
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                    }}
                  />
                  <span className="text-green-600 text-xs">Imagem carregada com sucesso</span>
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="flex-1 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-[#FF6B35] hover:bg-[#E55A2B] text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Admin"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
