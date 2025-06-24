"use client"

import Image from "next/image"

interface SidebarProps {
  activeItem: string
  onNavigate: (itemId: string) => void
  isMobile: boolean
  onClose: () => void
}

const navigationItems = [
  { id: "home", label: "Home" },
  { id: "perguntas", label: "Perguntas" },
  { id: "semanas", label: "Semanas" },
  { id: "tema", label: "Tema" },
  { id: "usuarios", label: "Usuários" },
  { id: "personagens", label: "Personagens" },
  { id: "conquistas", label: "Conquistas" },
]

// Remover o botão X e ajustar para tamanho fixo
export function Sidebar({ activeItem, onNavigate, isMobile, onClose }: SidebarProps) {
  return (
    <div className="w-80 bg-[#3FA110] h-screen fixed left-0 top-0 flex flex-col z-50">
      {/* Logo */}
      <div className="flex justify-center items-center py-8">
        <Image src="./logo-sicredi-branco.svg" alt="Logo Sicredi" width={200} height={150} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-10">
        <ul className="space-y-4">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`text-white text-left w-full py-2 transition-all ${
                  activeItem === item.id ? "font-bold" : "font-normal opacity-70 hover:opacity-100"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
