import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function EsqueceuSenhaPage() {
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
        <form className="space-y-6">
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

          {/* Botão Enviar */}
          <Button
            type="submit"
            className="w-full bg-white text-sicredi-green font-bold py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm tracking-wide shadow-md hover:shadow-lg"
          >
            Enviar instruções
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
