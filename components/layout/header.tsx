"use client"
import { LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  points: number
  role: string
}

interface HeaderProps {
  onMenuClick: () => void
  onLogout: () => void
  user?: User | null
}

// Ajustar o header para tamanho fixo
export function Header({ onMenuClick, onLogout, user }: HeaderProps) {
  return (
    <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 flex-shrink-0">
      {/* Menu button para mobile - removido */}

      <div className="flex items-center gap-4 ml-auto">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40&query=current-user"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">{user?.name || "Usuário"}</span>
            <span className="text-xs text-gray-500">{user?.email || "email@sicredi.com"}</span>
          </div>
        </div>

        {/* Logout Icon */}
        <button
          onClick={onLogout}
          className="ml-4 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
