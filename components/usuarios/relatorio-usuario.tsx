"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AtividadeRelatorio {
  id: number
  icone: string
  texto: string
  horario: string
}

interface Usuario {
  id: number
  nome: string
  cargo: string
  avatar: string
}

interface RelatorioUsuarioProps {
  usuario: Usuario
  atividades: AtividadeRelatorio[]
}

export function RelatorioUsuario({ usuario, atividades }: RelatorioUsuarioProps) {
  return (
    <div className="w-full max-w-4xl mx-auto pb-8">
      {/* Header com informações do usuário */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16 md:h-20 md:w-20">
              <AvatarImage src={usuario.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xl">{usuario.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-[#3FA110] mb-2">{usuario.nome}</h1>
              <p className="text-lg text-[#5A645A] font-medium">{usuario.cargo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Relatório de atividades */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 md:p-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg md:text-xl font-semibold text-[#3FA110]">Último Relatório</h2>
        </div>

        {/* Conteúdo do relatório com scroll */}
        <div className="max-h-[400px] md:max-h-[500px] overflow-y-auto lista-scroll">
          <div className="p-4 md:p-6 pt-4">
            <div className="space-y-4">
              {atividades.map((atividade) => (
                <div
                  key={atividade.id}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {/* Ícone */}
                  <div className="text-2xl flex-shrink-0 mt-1">{atividade.icone}</div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-relaxed mb-2">{atividade.texto}</p>
                    <p className="text-xs text-gray-500 font-medium">{atividade.horario}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
