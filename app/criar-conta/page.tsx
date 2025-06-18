"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function CriarContaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Modificar a estrutura inicial do formData para corresponder exatamente à ordem e formato do exemplo
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    avatar: "",
    password: "",
    gamerole_id: "4c7a325d-39cd-42d9-84fe-8281df8db8d2",
    points: 0,
  })

  const [passwordValidation, setPasswordValidation] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasValidLength: false,
    isValid: false,
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Validação de senha em tempo real
  useEffect(() => {
    const password = formData.password

    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    const hasValidLength = password.length >= 8 && password.length <= 30

    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasValidLength

    setPasswordValidation({
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      hasValidLength,
      isValid,
    })
  }, [formData.password])

  // Função corrigida para lidar com resposta em texto ou JSON
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)

    // Upload da imagem
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", file) // Nome do campo é "file"

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

      console.log("Enviando arquivo:", file.name, file.type, file.size)

      // Enviar como multipart/form-data (o navegador configura automaticamente)
      const response = await fetch(`${API_BASE_URL}/upload-image`, {
        method: "POST",
        body: formData,
        // Não definir Content-Type manualmente para que o navegador configure corretamente com boundary
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Resposta do servidor:", response.status, errorText)
        throw new Error(`Falha ao fazer upload da imagem: ${response.status} ${errorText}`)
      }

      // Verificar o Content-Type da resposta
      const contentType = response.headers.get("content-type") || ""
      let imageUrl = ""

      if (contentType.includes("application/json")) {
        // Se for JSON, parse normalmente
        const data = await response.json()
        console.log("Resposta do upload (JSON):", data)
        imageUrl = data.url || data.imageUrl || data.image || data.path || ""
      } else {
        // Se não for JSON, assume que é texto direto (URL)
        imageUrl = await response.text()
        console.log("Resposta do upload (texto):", imageUrl)
      }

      // Verificar se temos uma URL válida
      if (!imageUrl || typeof imageUrl !== "string") {
        throw new Error("URL da imagem não encontrada na resposta")
      }

      // Atualizar o estado com a URL da imagem
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

  // Substituir a parte do handleSubmit que envia a requisição para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordValidation.isValid) {
      toast({
        title: "⚠️ Senha inválida",
        description: "Por favor, verifique os requisitos de senha",
        variant: "destructive",
      })
      return
    }

    if (!formData.avatar) {
      toast({
        title: "⚠️ Avatar necessário",
        description: "Por favor, faça upload de uma imagem de avatar",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

      // Criar o payload exatamente na ordem e formato esperado
      const payload = {
        email: formData.email,
        name: formData.name,
        avatar: formData.avatar,
        password: formData.password,
        gamerole_id: formData.gamerole_id,
        points: formData.points,
      }

      // Log detalhado do payload (sem a senha)
      console.log("Enviando payload para registro:", {
        ...payload,
        password: "[REDACTED]",
      })

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      // Log da resposta bruta
      console.log("Status da resposta:", response.status)
      console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()))

      // Capturar o texto da resposta para debug
      const responseText = await response.text()
      console.log("Texto da resposta:", responseText)

      let responseData
      try {
        // Tentar parsear a resposta como JSON
        responseData = JSON.parse(responseText)
        console.log("Resposta parseada como JSON:", responseData)
      } catch (e) {
        console.error("Erro ao parsear resposta como JSON:", e)
        // Se não for JSON, usar o texto como está
        responseData = { message: responseText }
      }

      if (!response.ok) {
        // Extrair mensagem de erro detalhada
        const errorMessage =
          responseData?.message ||
          responseData?.error ||
          responseData?.errors?.[0]?.message ||
          `Erro ${response.status}: Falha ao registrar usuário`

        console.error("Erro detalhado:", errorMessage)
        throw new Error(errorMessage)
      }

      toast({
        title: "✅ Conta criada",
        description: "Sua conta foi criada com sucesso. Faça login para continuar.",
      })

      // Redirecionar para a página de login
      router.push("/")
    } catch (error) {
      // Log detalhado do erro
      console.error("Erro ao registrar (objeto completo):", error)

      if (error instanceof Error) {
        console.error("Mensagem de erro:", error.message)
        console.error("Stack trace:", error.stack)
      }

      // Extrair mensagem de erro de forma mais robusta
      let errorMessage = "Não foi possível criar sua conta"

      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "object" && error !== null) {
        // Tentar extrair mensagem de diferentes formatos de erro
        const errorObj = error as any
        console.log("Propriedades do objeto de erro:", Object.keys(errorObj))

        errorMessage = errorObj.message || errorObj.error || errorObj.statusText || JSON.stringify(error)
      }

      toast({
        title: "⚠️ Erro no registro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-sicredi-green rounded-xl py-12 px-8 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="text-white text-xl font-bold tracking-wide">SICREDI</div>
        </div>

        {/* Título */}
        <h1 className="text-white text-lg font-medium text-left mb-10 tracking-wide">Criar nova conta</h1>

        {/* Formulário */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Campo Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white text-xs font-medium">
              Nome completo
            </Label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu nome completo"
              className="sicredi-input w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-xs font-medium">
              Email
            </Label>
            <input
              id="email"
              type="email"
              placeholder="@sicredi.com"
              className="sicredi-input w-full text-right"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white text-xs font-medium">
              Senha
            </Label>
            <input
              id="password"
              type="password"
              placeholder="Crie uma senha segura"
              className="sicredi-input w-full"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            {formData.password && (
              <div className="mt-2 text-xs space-y-1">
                <p className={passwordValidation.hasUpperCase ? "text-white" : "text-red-300"}>
                  {passwordValidation.hasUpperCase ? "✓" : "✗"} Pelo menos uma letra maiúscula
                </p>
                <p className={passwordValidation.hasLowerCase ? "text-white" : "text-red-300"}>
                  {passwordValidation.hasLowerCase ? "✓" : "✗"} Pelo menos uma letra minúscula
                </p>
                <p className={passwordValidation.hasNumber ? "text-white" : "text-red-300"}>
                  {passwordValidation.hasNumber ? "✓" : "✗"} Pelo menos um número
                </p>
                <p className={passwordValidation.hasSpecialChar ? "text-white" : "text-red-300"}>
                  {passwordValidation.hasSpecialChar ? "✓" : "✗"} Pelo menos um caractere especial
                </p>
                <p className={passwordValidation.hasValidLength ? "text-white" : "text-red-300"}>
                  {passwordValidation.hasValidLength ? "✓" : "✗"} Entre 8 e 30 caracteres
                </p>
              </div>
            )}
          </div>

          {/* Campo Avatar */}
          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-white text-xs font-medium">
              Avatar
            </Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sicredi-input w-full"
                />
                {isUploading && (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span className="text-white text-xs">Enviando...</span>
                  </div>
                )}
              </div>

              {selectedFile && !formData.avatar && !isUploading && (
                <div className="text-yellow-200 text-xs">Aguardando upload da imagem...</div>
              )}

              {formData.avatar && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={formData.avatar || "/placeholder.svg"}
                    alt="Avatar preview"
                    className="h-10 w-10 rounded-full object-cover border border-white"
                    onError={(e) => {
                      console.error("Erro ao carregar imagem:", formData.avatar)
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=40&width=40"
                    }}
                  />
                  <span className="text-white text-xs">Imagem carregada com sucesso</span>
                </div>
              )}
            </div>
          </div>

          {/* Campo URL (desabilitado) */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-white text-xs font-medium">
              URL da imagem
            </Label>
            <input
              id="url"
              type="text"
              value={formData.avatar}
              className="sicredi-input w-full bg-opacity-50 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Campo Pontos (desabilitado) */}
          <div className="space-y-2">
            <Label htmlFor="points" className="text-white text-xs font-medium">
              Pontos
            </Label>
            <input
              id="points"
              type="number"
              value={formData.points}
              className="sicredi-input w-full bg-opacity-50 cursor-not-allowed"
              disabled
            />
          </div>

          {/* Botão Criar Conta */}
          <Button
            type="submit"
            className="w-full bg-white text-sicredi-green font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg"
            disabled={isSubmitting || !passwordValidation.isValid || !formData.avatar}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>

        {/* Link para login */}
        <div className="mt-10 text-center">
          <span className="text-white text-xs font-normal">
            Já tem uma conta?{" "}
            <Link href="/" className="text-white font-medium hover:underline transition-all hover:text-white/80">
              Fazer login
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
