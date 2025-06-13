"use client"
import Link from "next/link"
import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { loginUser, setAuthToken } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await loginUser(email, password)

      if (result.success && result.token) {
        // Store the token in cookies
        setAuthToken(result.token)
        // Redirect to home page
        router.push("/home")
      } else {
        // Show error message
        setError(result.error || "Credenciais inválidas. Por favor, tente novamente.")
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-sicredi-green rounded-xl py-12 px-8 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image src="logo-sicredi-branco.svg" alt="Logo Sicredi" width={200} height={300} />
        </div>

        {/* Título */}
        <h1 className="text-white text-lg font-medium text-left mb-10 tracking-wide">Entre com sua conta</h1>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">{error}</div>
        )}

        {/* Formulário */}
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Campo Senha com link Esqueceu */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-white text-xs font-medium">
                Senha
              </Label>
              <Link
                href="/esqueceu-senha"
                className="text-white text-xs hover:underline font-normal transition-all hover:text-white/80"
              >
                Esqueceu?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              placeholder="Insira sua senha"
              className="sicredi-input w-full"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Botão Entrar */}
          <Button
            type="submit"
            className="w-full bg-white text-sicredi-green font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        {/* Link para criar conta */}
        <div className="mt-10 text-center">
          <span className="text-white text-xs font-normal">
            Você ainda não tem conta?{" "}
            <Link
              href="/criar-conta"
              className="text-white font-medium hover:underline transition-all hover:text-white/80"
            >
              Criar conta
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
