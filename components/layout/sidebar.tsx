"use client"
import { X } from "lucide-react"

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
  { id: "usuario-admin", label: "Usuário Admin" },
  { id: "personagens", label: "Personagens" },
  { id: "conquistas", label: "Conquistas" },
]

export function Sidebar({ activeItem, onNavigate, isMobile, onClose }: SidebarProps) {
  return (
    <div className="w-80 bg-[#3FA110] h-screen fixed left-0 top-0 flex flex-col z-50">
      {/* Logo */}
      <div className="flex justify-center items-center py-8 relative">
        <div className="text-white text-2xl font-bold tracking-wide">SICREDI</div>
        {/* Botão fechar no mobile */}
        {isMobile && (
          <button onClick={onClose} className="absolute right-4 text-white">
            <X size={24} />
          </button>
        )}
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
