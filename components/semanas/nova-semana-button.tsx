"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NovaSemanaButtonProps {
  onClick: () => void
}

export function NovaSemanaButton({ onClick }: NovaSemanaButtonProps) {
  return (
    <div className="w-full max-w-[1400px] mb-8 flex justify-end">
      <Button
        onClick={onClick}
        className="bg-[#3FA110] hover:bg-[#2d7a0c] text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 text-base"
      >
        <Plus size={16} />
        <span>Nova Semana</span>
      </Button>
    </div>
  )
}
