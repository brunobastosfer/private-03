"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NovoUsuarioButtonProps {
  onClick: () => void
}

export function NovoUsuarioButton({ onClick }: NovoUsuarioButtonProps) {
  return (
    <div className="w-full max-w-6xl mb-6 md:mb-8 flex justify-end">
      <Button
        onClick={onClick}
        className="bg-[#3FA110] hover:bg-[#2d7a0c] text-white font-medium px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 text-sm md:text-base"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Novo Usuário</span>
        <span className="sm:hidden">Novo</span>
      </Button>
    </div>
  )
}
