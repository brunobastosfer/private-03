"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"

function AlterarSenhaContent() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")
    console.log("Token da URL:", tokenFromUrl)

    if (!tokenFromUrl) {
      toast({
        title: "Erro",
        description: "Token de recuperação não encontrado. Solicite uma nova recuperação de senha.",
        variant: "destructive",
      })
      // Redirecionar para página de esqueceu senha após 3 segundos
      setTimeout(() => {
        router.push("/esqueceu-senha")
      }, 3000)
      return
    }

    setToken(tokenFromUrl)
  }, [searchParams, router, toast])

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      toast({
        title: "Erro",
        description: "Token inválido. Solicite uma nova recuperação de senha.",
        variant: "destructive",
      })
      return
    }

    // Validações
    if (!newPassword.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite a nova senha",
        variant: "destructive",
      })
      return
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      toast({
        title: "Erro",
        description: passwordError,
        variant: "destructive",
      })
      return
    }

    if (!confirmPassword.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, confirme sua nova senha",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("=== ALTERANDO SENHA ===")
      console.log("Token:", token)
      console.log("URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/new-password`)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/new-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: newPassword.trim(),
        }),
      })

      console.log("Status da resposta:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Erro da API:", errorData)

        // Tratar diferentes tipos de erro
        if (response.status === 401) {
          throw new Error("Token expirado ou inválido. Solicite uma nova recuperação de senha.")
        } else if (response.status === 400) {
          throw new Error("Dados inválidos. Verifique se a senha atende aos requisitos.")
        } else {
          throw new Error(errorData.error?.message || errorData.message || "Erro ao alterar senha")
        }
      }

      console.log("=== SENHA ALTERADA COM SUCESSO ===")

      toast({
        title: "Sucesso!",
        description: "Sua senha foi alterada com sucesso. Você será redirecionado para o login.",
      })

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("=== ERRO AO ALTERAR SENHA ===")
      console.error("Erro completo:", error)

      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao alterar senha. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-sicredi-green rounded-xl py-12 px-8 shadow-xl">
          <div className="flex justify-center mb-10">
            <div className="text-white text-xl font-bold tracking-wide">SICREDI</div>
          </div>
          <div className="text-white text-center">
            <p className="mb-4">Verificando token...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-sicredi-green rounded-xl py-12 px-8 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="text-white text-xl font-bold tracking-wide">SICREDI</div>
        </div>

        {/* Título */}
        <h1 className="text-white text-lg font-medium text-left mb-10 tracking-wide">Alterar Senha</h1>

        <p className="text-white text-xs text-center mb-10 opacity-90 font-normal leading-relaxed">
          Digite sua nova senha nos campos abaixo
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nova Senha */}
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-white text-xs font-medium">
              Nova Senha
            </Label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Digite sua nova senha"
                className="sicredi-input w-full pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Campo Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white text-xs font-medium">
              Confirme sua Nova Senha
            </Label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme sua nova senha"
                className="sicredi-input w-full pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Botão Confirmar */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-sicredi-green font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Alterando..." : "Confirmar"}
          </Button>
        </form>

        {/* Link para voltar ao login */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-white text-xs hover:underline font-normal transition-all hover:text-white/80 inline-flex items-center gap-1"
          >
            ← Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AlterarSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
          <div className="w-full max-w-md bg-sicredi-green rounded-xl py-12 px-8 shadow-xl">
            <div className="flex justify-center mb-10">
              <div className="text-white text-xl font-bold tracking-wide">SICREDI</div>
            </div>
            <div className="text-white text-center">
              <p className="mb-4">Carregando...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            </div>
          </div>
        </div>
      }
    >
      <AlterarSenhaContent />
    </Suspense>
  )
}
