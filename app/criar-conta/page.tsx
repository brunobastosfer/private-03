import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function CriarContaPage() {
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
        <form className="space-y-6">
          {/* Campo Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-white text-xs font-medium">
              Nome completo
            </Label>
            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
              className="sicredi-input w-full"
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
              required
            />
          </div>

          {/* Campo Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white text-xs font-medium">
              Confirmar senha
            </Label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              className="sicredi-input w-full"
              required
            />
          </div>

          {/* Botão Criar Conta */}
          <Button
            type="submit"
            className="w-full bg-white text-sicredi-green font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg"
          >
            Criar conta
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
