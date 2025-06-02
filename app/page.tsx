"use client"
import Link from "next/link"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular login e redirecionar para Home
    router.push("/home")
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-sicredi-green rounded-xl py-12 px-8 shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="text-white text-xl font-bold tracking-wide">SICREDI</div>
        </div>

        {/* Título */}
        <h1 className="text-white text-lg font-medium text-left mb-10 tracking-wide">Entre com sua conta</h1>

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
            />
          </div>

          {/* Botão Entrar */}
          <Button
            type="submit"
            className="w-full bg-white text-sicredi-green font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg"
          >
            Entrar
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
