"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail } from "lucide-react"
import Image from "next/image"

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite seu email",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("=== ENVIANDO SOLICITAÇÃO DE RECUPERAÇÃO DE SENHA ===")
      console.log("Email:", email)
      console.log("URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/new-password`)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/new-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      console.log("Status da resposta:", response.status)
      console.log("Headers da resposta:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorMessage = "Erro ao enviar solicitação"

        try {
          const errorData = await response.json()
          console.error("Erro da API:", errorData)

          // Tratamento específico por status code
          switch (response.status) {
            case 400:
              errorMessage =
                errorData.error?.message || errorData.message || "Dados inválidos. Verifique o email digitado."
              break
            case 404:
              errorMessage = "Email não encontrado. Verifique se o email está correto."
              break
            case 429:
              errorMessage = "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente."
              break
            case 500:
              errorMessage = "Erro interno do servidor. Tente novamente mais tarde."
              break
            default:
              errorMessage =
                errorData.error?.message || errorData.message || `Erro ${response.status}: ${response.statusText}`
          }
        } catch (parseError) {
          console.error("Erro ao fazer parse da resposta:", parseError)
          errorMessage = `Erro ${response.status}: ${response.statusText}`
        }

        throw new Error(errorMessage)
      }

      const responseData = await response.json().catch(() => ({}))
      console.log("=== SOLICITAÇÃO ENVIADA COM SUCESSO ===")
      console.log("Resposta da API:", responseData)

      // Mostrar componente de email enviado
      setEmailSent(true)
    } catch (error) {
      console.error("=== ERRO AO ENVIAR SOLICITAÇÃO ===")
      console.error("Erro completo:", error)

      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToForm = () => {
    setEmailSent(false)
    setEmail("")
  }

  // Componente de email enviado
  if (emailSent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-sicredi-green rounded-xl py-12 px-8 shadow-xl">
          {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image src="./logo-sicredi-branco.svg" alt="Logo Sicredi" width={300} height={200}/>
        </div>

          {/* Ícone de Email */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-6 shadow-lg">
              <Mail className="w-12 h-12 text-sicredi-green" />
            </div>
          </div>

          {/* Mensagem */}
          <div className="text-center mb-10">
            <h1 className="text-white text-lg font-medium mb-4 tracking-wide">Email Enviado!</h1>
            <p className="text-white text-sm opacity-90 font-normal leading-relaxed">
              Verifique seu email e atualize sua senha
            </p>
          </div>

          {/* Botões */}
          <div className="space-y-4">
            <Button
              onClick={handleBackToForm}
              className="w-full bg-white text-sicredi-green font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg"
            >
              Enviar novamente
            </Button>

            <div className="text-center">
              <Link
                href="/"
                className="text-white text-xs hover:underline font-normal transition-all hover:text-white/80 inline-flex items-center gap-1"
              >
                ← Voltar ao login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Formulário inicial
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-sicredi-green rounded-xl py-12 px-8 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image src="./logo-sicredi-branco.svg" alt="Logo Sicredi" width={300} height={200}/>
        </div>

        {/* Título */}
        <h1 className="text-white text-lg font-medium text-left mb-10 tracking-wide">Esqueceu sua senha?</h1>

        <p className="text-white text-xs text-center mb-10 opacity-90 font-normal leading-relaxed">
          Digite seu email para receber as instruções de recuperação
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Botão Enviar */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-sicredi-green font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Enviando..." : "Enviar instruções"}
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
