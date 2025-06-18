"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/new-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      console.log("Status da resposta:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Erro da API:", errorData)
        throw new Error(errorData.error?.message || errorData.message || "Erro ao enviar solicitação")
      }

      console.log("=== SOLICITAÇÃO ENVIADA COM SUCESSO ===")

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para as instruções de recuperação de senha.",
      })

      // Limpar o formulário
      setEmail("")
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-sicredi-green rounded-xl py-12 px-8 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="text-white text-xl font-bold tracking-wide">SICREDI</div>
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
