"use client"
import { Menu, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  onMenuClick: () => void
  onLogout: () => void
}

export function Header({ onMenuClick, onLogout }: HeaderProps) {
  return (
    <header className="h-16 md:h-20 bg-white shadow-sm flex items-center justify-between px-4 md:px-8 flex-shrink-0">
      {/* Menu button para mobile */}
      <button onClick={onMenuClick} className="text-gray-600 hover:text-gray-900 md:hidden">
        <Menu size={24} />
      </button>

      <div className="flex items-center gap-4 ml-auto">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40&query=current-user" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-medium text-gray-900">João Silva</span>
            <span className="text-xs text-gray-500">joao.silva@sicredi.com</span>
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
