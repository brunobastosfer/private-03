"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Download,
  Clock,
  Target,
  Award,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Medal,
  Plus,
} from "lucide-react"
import { getAuthToken } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Achievement {
  id: string
  user_id: string
  achievement_id: string
  gained_at: string
  achievement: {
    id: string
    title: string
    description: string
    badge: string
    condition: string
    more_than: number
    theme: string | null
  }
}

interface UserStatistics {
  answered_questions: number
  correct: number
  incorrect: number
  correct_rate: number
  achievements_gotten: Achievement[]
  perTheme: Record<string, number>
}

interface Usuario {
  id: string
  nome: string
  cargo: string
  avatar: string
}

interface RelatorioUsuarioDetalhadoProps {
  usuario: Usuario
}

export function RelatorioUsuarioDetalhado({ usuario }: RelatorioUsuarioDetalhadoProps) {
  const { toast } = useToast()
  const [statistics, setStatistics] = useState<UserStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false)
  const [availableAchievements, setAvailableAchievements] = useState<any[]>([])
  const [selectedAchievementId, setSelectedAchievementId] = useState<string>("")
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(false)
  const [isAddingAchievement, setIsAddingAchievement] = useState(false)

  // Função para formatar tempo
  const formatTime = (seconds: number) => {
    if (seconds === 0) return "0s"
    if (seconds < 60) return `${seconds}s`

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes < 60) {
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${hours}h`
  }

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Buscar estatísticas do usuário
  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        setIsLoading(true)
        const token = getAuthToken()

        if (!token) {
          throw new Error("Token não encontrado")
        }

        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

        console.log(`Buscando estatísticas do usuário: ${usuario.id}`)

        const response = await fetch(`${API_BASE_URL}/dashboard/per-user-statistics/${usuario.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error?.message || `Erro ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("Estatísticas do usuário:", data)
        setStatistics(data)
      } catch (error) {
        console.error("Erro ao buscar estatísticas do usuário:", error)
        toast({
          title: "⚠️ Erro",
          description: error instanceof Error ? error.message : "Erro ao carregar estatísticas do usuário.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserStatistics()
  }, [usuario.id, toast])

  // Função para download do CSV
  const handleDownloadCSV = async () => {
    try {
      setIsDownloading(true)
      const token = getAuthToken()

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

      console.log(`Fazendo download do CSV para usuário: ${usuario.id}`)

      // Abrir nova aba para download
      const newTab = window.open("", "_blank")

      if (!newTab) {
        throw new Error("Não foi possível abrir nova aba. Verifique se o bloqueador de pop-ups está desabilitado.")
      }

      const response = await fetch(`${API_BASE_URL}/dashboard/per-user-statistics/${usuario.id}?csv=true`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        newTab.close()
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Erro ${response.status}: ${response.statusText}`)
      }

      // Criar blob e fazer download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // Configurar download na nova aba
      newTab.location.href = url

      // Aguardar um pouco e fechar a aba
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        newTab.close()
      }, 1000)

      toast({
        title: "✅ Download Concluído",
        description: "O relatório CSV foi baixado com sucesso.",
        variant: "default",
      })
    } catch (error) {
      console.error("Erro ao fazer download do CSV:", error)
      toast({
        title: "⚠️ Erro",
        description: error instanceof Error ? error.message : "Erro ao fazer download do relatório.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Função para buscar conquistas disponíveis
  const fetchAvailableAchievements = async () => {
    try {
      setIsLoadingAchievements(true)
      const token = getAuthToken()

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

      const response = await fetch(`${API_BASE_URL}/achievements?page=1&perPage=100`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setAvailableAchievements(data.data || [])
    } catch (error) {
      console.error("Erro ao buscar conquistas:", error)
      toast({
        title: "⚠️ Erro",
        description: "Não foi possível carregar as conquistas disponíveis.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAchievements(false)
    }
  }

  // Função para adicionar conquista ao usuário
  const handleAddAchievement = async () => {
    if (!selectedAchievementId) {
      toast({
        title: "⚠️ Atenção",
        description: "Selecione uma conquista para adicionar.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAddingAchievement(true)
      const token = getAuthToken()

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

      const response = await fetch(`${API_BASE_URL}/achievements-to-players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: usuario.id,
          achievement_id: selectedAchievementId,
        }),
      })

      if (!response.ok) {
        throw new Error("Não foi possível atribuir esta conquista ao jogador")
      }

      toast({
        title: "✅ Conquista Adicionada",
        description: "A conquista foi atribuída ao jogador com sucesso.",
        variant: "default",
      })

      // Fechar modal e limpar seleção
      setShowAddAchievementModal(false)
      setSelectedAchievementId("")

      // Recarregar estatísticas para mostrar a nova conquista
      const fetchUserStatistics = async () => {
        try {
          const token = getAuthToken()
          if (!token) return

          const response = await fetch(`${API_BASE_URL}/dashboard/per-user-statistics/${usuario.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            setStatistics(data)
          }
        } catch (error) {
          console.error("Erro ao recarregar estatísticas:", error)
        }
      }

      fetchUserStatistics()
    } catch (error) {
      console.error("Erro ao adicionar conquista:", error)
      toast({
        title: "⚠️ Erro",
        description: "Não foi possível atribuir esta conquista ao jogador.",
        variant: "destructive",
      })
    } finally {
      setIsAddingAchievement(false)
    }
  }

  // Função para abrir modal de adicionar conquista
  const handleOpenAddAchievementModal = () => {
    setShowAddAchievementModal(true)
    fetchAvailableAchievements()
  }

  // Função para fechar modal
  const handleCloseAddAchievementModal = () => {
    setShowAddAchievementModal(false)
    setSelectedAchievementId("")
  }

  // Processar dados por tema
  const getThemeData = () => {
    if (!statistics?.perTheme) return []

    const themes = new Set<string>()
    Object.keys(statistics.perTheme).forEach((key) => {
      const theme = key.split(" - ")[0]
      themes.add(theme)
    })

    return Array.from(themes).map((theme) => ({
      name: theme,
      abandoned: statistics.perTheme[`${theme} - abandoned`] || 0,
      answered: statistics.perTheme[`${theme} - answered`] || 0,
      correct: statistics.perTheme[`${theme} - correct`] || 0,
      wrong: statistics.perTheme[`${theme} - wrong`] || 0,
      correct_rate: statistics.perTheme[`${theme} - correct_rate`] || 0,
      wrong_rate: statistics.perTheme[`${theme} - wrong_rate`] || 0,
      average_time: statistics.perTheme[`${theme} - average_time`] || 0,
    }))
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto pb-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3FA110]"></div>
            <span className="ml-2 text-gray-600">Carregando estatísticas...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!statistics) {
    return (
      <div className="w-full max-w-4xl mx-auto pb-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center py-8 text-gray-500">Não foi possível carregar as estatísticas do usuário.</div>
        </div>
      </div>
    )
  }

  const themeData = getThemeData()

  return (
    <div className="w-full max-w-6xl mx-auto pb-8">
      {/* Header com informações do usuário */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between">
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

            {/* Botões de ação */}
            <div className="flex items-center">
              <Button
                onClick={handleDownloadCSV}
                disabled={isDownloading}
                className="bg-[#3FA110] hover:bg-[#2d7a0c] text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Baixando...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Baixar CSV
                  </>
                )}
              </Button>

              {/* Botão de Adicionar Conquista */}
              <Button
                onClick={handleOpenAddAchievementModal}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 ml-3"
              >
                <Medal size={16} />
                Adicionar Conquista
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Perguntas Respondidas</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.answered_questions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Respostas Corretas</p>
              <p className="text-2xl font-bold text-green-600">{statistics.correct}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Respostas Incorretas</p>
              <p className="text-2xl font-bold text-red-600">{statistics.incorrect}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3FA110]/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-[#3FA110]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Taxa de Acerto</p>
              <p className="text-2xl font-bold text-[#3FA110]">{statistics.correct_rate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conquistas */}
      {statistics.achievements_gotten.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#3FA110] flex items-center gap-2">
              <Award className="h-5 w-5" />
              Conquistas Obtidas ({statistics.achievements_gotten.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statistics.achievements_gotten.map((achievement) => (
                <div
                  key={achievement.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{achievement.achievement.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{achievement.achievement.description}</p>
                      <p className="text-xs text-gray-500">Obtida em: {formatDate(achievement.gained_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Estatísticas por Tema */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-[#3FA110]">Desempenho por Tema</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {themeData.map((theme) => (
              <div key={theme.name} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{theme.name}</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-gray-600">Respondidas</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{theme.answered}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-gray-600">Corretas</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">{theme.correct}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-xs text-gray-600">Erradas</span>
                    </div>
                    <p className="text-lg font-bold text-red-600">{theme.wrong}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <span className="text-xs text-gray-600">Abandonadas</span>
                    </div>
                    <p className="text-lg font-bold text-orange-600">{theme.abandoned}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="h-4 w-4 text-[#3FA110]" />
                      <span className="text-xs text-gray-600">% Acerto</span>
                    </div>
                    <p className="text-lg font-bold text-[#3FA110]">{theme.correct_rate}%</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-xs text-gray-600">% Erro</span>
                    </div>
                    <p className="text-lg font-bold text-red-600">{theme.wrong_rate}%</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-xs text-gray-600">Tempo Médio</span>
                    </div>
                    <p className="text-lg font-bold text-purple-600">{formatTime(theme.average_time)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Adicionar Conquista */}
      <Dialog open={showAddAchievementModal} onOpenChange={setShowAddAchievementModal}>
        <DialogContent className="bg-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#3FA110] flex items-center gap-2">
              <Medal className="h-5 w-5" />
              Adicionar Conquista para {usuario.nome}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Selecione uma conquista para atribuir ao jogador.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isLoadingAchievements ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3FA110]"></div>
                <span className="ml-2 text-gray-600">Carregando conquistas...</span>
              </div>
            ) : availableAchievements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhuma conquista disponível.</div>
            ) : (
              <RadioGroup value={selectedAchievementId} onValueChange={setSelectedAchievementId}>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <RadioGroupItem value={achievement.id} id={achievement.id} className="mt-1" />
                      <Label htmlFor={achievement.id} className="flex-1 cursor-pointer">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                            <Medal className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm mb-1">{achievement.title}</h3>
                            <p className="text-xs text-gray-600 mb-1">{achievement.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded">{achievement.badge}</span>
                              <span>Condição: {achievement.condition}</span>
                              {achievement.more_than && <span>Mais que: {achievement.more_than}</span>}
                            </div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseAddAchievementModal}
              disabled={isAddingAchievement}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddAchievement}
              disabled={isAddingAchievement || !selectedAchievementId || isLoadingAchievements}
              className="bg-[#3FA110] hover:bg-[#2d7a0c] text-white"
            >
              {isAddingAchievement ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adicionando...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Salvar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
