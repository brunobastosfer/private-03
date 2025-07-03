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
  Calendar,
  Info,
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

interface Week {
  id: string
  title: string
  start_date: string
  end_date: string
  bonus: boolean
  difficulty: string
}

interface QuestionReport {
  id: string
  question_id: string
  answerer_id: string
  answer_id: string
  status: string
  date_created: string
  date_answered: string
  time_to_answer: number
  question: {
    id: string
    title: string
    context: string
    theme_id: string
    department_id: string
    character_id: string
    week_id: string
    answers: Array<{
      id: string
      text: string
      question_id: string
      correct: boolean
    }>
    theme: {
      id: string
      title: string
      worth: number
    }
    department: {
      id: string
      title: string
    }
    character: {
      name: string
    }
    week: {
      id: string
      title: string
      start_date: string
      end_date: string
      bonus: boolean
      difficulty: string
    }
  }
  answer: {
    id: string
    text: string
    question_id: string
    correct: boolean
  }
}

interface ThemeData {
  name: string
  abandoned: number
  answered: number
  correct: number
  wrong: number
  correct_rate: number
  wrong_rate: number
  average_time: number
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
  const [themeData, setThemeData] = useState<ThemeData[]>([])

  // Estados para desempenho por semana
  const [viewMode, setViewMode] = useState<"theme" | "week">("theme")
  const [availableWeeks, setAvailableWeeks] = useState<Week[]>([])
  const [selectedWeekId, setSelectedWeekId] = useState<string>("")
  const [weekReports, setWeekReports] = useState<QuestionReport[]>([])
  const [isLoadingWeeks, setIsLoadingWeeks] = useState(false)
  const [isLoadingWeekReports, setIsLoadingWeekReports] = useState(false)

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

  // Processar dados por tema
  const processThemeData = (data: UserStatistics | null) => {
    if (!data || !data.perTheme) {
      console.log("Não há dados de perTheme para processar")
      return []
    }

    // Criar temas de exemplo se não houver dados
    if (Object.keys(data.perTheme).length === 0) {
      // Se o usuário respondeu perguntas mas não há dados por tema, criar dados de exemplo
      if (data.answered_questions > 0) {
        return [
          {
            name: "Geral",
            abandoned: 0,
            answered: data.answered_questions,
            correct: data.correct,
            wrong: data.incorrect,
            correct_rate: data.correct_rate,
            wrong_rate: 100 - data.correct_rate,
            average_time: 0,
          },
        ]
      }
      return []
    }

    console.log("Processando dados de tema:", data.perTheme)

    // Verificar o formato dos dados
    const keys = Object.keys(data.perTheme)
    console.log("Chaves disponíveis:", keys)

    // Tentar identificar o padrão das chaves
    const themeNames = new Set<string>()

    // Primeiro, tentar extrair nomes de temas das chaves
    keys.forEach((key) => {
      // Verificar diferentes padrões possíveis
      if (key.includes(" - ")) {
        const themeName = key.split(" - ")[0]
        themeNames.add(themeName)
      } else if (key.includes("_")) {
        const themeName = key.split("_")[0]
        themeNames.add(themeName)
      }
    })

    // Se não encontrou temas pelo padrão, usar outro método
    if (themeNames.size === 0) {
      // Verificar se há chaves específicas que indicam temas
      const possibleThemeKeys = keys.filter(
        (key) => !key.includes("total") && !key.includes("average") && !key.includes("rate"),
      )

      possibleThemeKeys.forEach((key) => {
        // Extrair possível nome de tema
        const themeName = key.replace(/answered|correct|wrong|abandoned|time/g, "").trim()
        if (themeName) themeNames.add(themeName)
      })
    }

    console.log("Temas encontrados:", Array.from(themeNames))

    // Se ainda não encontrou temas, criar um tema geral
    if (themeNames.size === 0 && data.answered_questions > 0) {
      return [
        {
          name: "Geral",
          abandoned: 0,
          answered: data.answered_questions,
          correct: data.correct,
          wrong: data.incorrect,
          correct_rate: data.correct_rate,
          wrong_rate: 100 - data.correct_rate,
          average_time: 0,
        },
      ]
    }

    // Processar dados para cada tema encontrado
    return Array.from(themeNames).map((theme) => {
      // Tentar diferentes padrões de chaves
      const patterns = [
        {
          answered: `${theme} - answered`,
          correct: `${theme} - correct`,
          wrong: `${theme} - wrong`,
          abandoned: `${theme} - abandoned`,
          correct_rate: `${theme} - correct_rate`,
          wrong_rate: `${theme} - wrong_rate`,
          average_time: `${theme} - average_time`,
        },
        {
          answered: `${theme}_answered`,
          correct: `${theme}_correct`,
          wrong: `${theme}_wrong`,
          abandoned: `${theme}_abandoned`,
          correct_rate: `${theme}_correct_rate`,
          wrong_rate: `${theme}_wrong_rate`,
          average_time: `${theme}_average_time`,
        },
        {
          answered: `${theme}answered`,
          correct: `${theme}correct`,
          wrong: `${theme}wrong`,
          abandoned: `${theme}abandoned`,
          correct_rate: `${theme}correct_rate`,
          wrong_rate: `${theme}wrong_rate`,
          average_time: `${theme}average_time`,
        },
      ]

      // Encontrar o padrão que melhor se encaixa
      let bestPattern = patterns[0]
      for (const pattern of patterns) {
        if (data.perTheme[pattern.answered] !== undefined) {
          bestPattern = pattern
          break
        }
      }

      // Extrair dados usando o melhor padrão
      const answered = data.perTheme[bestPattern.answered] || 0
      const correct = data.perTheme[bestPattern.correct] || 0
      const wrong = data.perTheme[bestPattern.wrong] || 0
      const abandoned = data.perTheme[bestPattern.abandoned] || 0
      const correct_rate = data.perTheme[bestPattern.correct_rate] || 0
      const wrong_rate = data.perTheme[bestPattern.wrong_rate] || 0
      const average_time = data.perTheme[bestPattern.average_time] || 0

      // Calcular taxas se não estiverem disponíveis
      const calculatedCorrectRate = answered > 0 ? Math.round((correct / answered) * 100) : 0
      const calculatedWrongRate = answered > 0 ? Math.round((wrong / answered) * 100) : 0

      return {
        name: theme,
        abandoned,
        answered,
        correct,
        wrong,
        correct_rate: correct_rate || calculatedCorrectRate,
        wrong_rate: wrong_rate || calculatedWrongRate,
        average_time,
      }
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

        // Processar dados de tema
        const processedThemeData = processThemeData(data)
        setThemeData(processedThemeData)
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

  // Buscar semanas disponíveis
  useEffect(() => {
    const fetchAvailableWeeks = async () => {
      try {
        setIsLoadingWeeks(true)
        const token = getAuthToken()

        if (!token) {
          throw new Error("Token não encontrado")
        }

        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

        const response = await fetch(`${API_BASE_URL}/week?page=1&perPage=100`, {
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
        setAvailableWeeks(data.data || [])
      } catch (error) {
        console.error("Erro ao buscar semanas:", error)
        toast({
          title: "⚠️ Erro",
          description: "Não foi possível carregar as semanas disponíveis.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingWeeks(false)
      }
    }

    fetchAvailableWeeks()
  }, [toast])

  // Buscar relatórios da semana selecionada
  const fetchWeekReports = async (weekId: string) => {
    try {
      setIsLoadingWeekReports(true)
      const token = getAuthToken()

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const selectedWeek = availableWeeks.find((w) => w.id === weekId)
      if (!selectedWeek) {
        throw new Error("Semana não encontrada")
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

      // Converter datas para ISO 8601 correto
      let startDate: string
      let endDate: string

      try {
        // Garantir que as datas sejam válidas e ajustar para início e fim do dia
        const startDateObj = new Date(selectedWeek.start_date)
        const endDateObj = new Date(selectedWeek.end_date)

        // Verificar se as datas são válidas
        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
          throw new Error("Datas da semana são inválidas")
        }

        // Ajustar para início do dia (00:00:00)
        startDateObj.setHours(0, 0, 0, 0)

        // Ajustar para fim do dia (23:59:59)
        endDateObj.setHours(23, 59, 59, 999)

        // Converter para ISO 8601 sem encoding
        startDate = startDateObj.toISOString()
        endDate = endDateObj.toISOString()

        console.log(`=== DEBUG WEEK REPORTS ===`)
        console.log(`Semana selecionada: ${selectedWeek.title}`)
        console.log(`Usuário ID: ${usuario.id}`)
        console.log(`Data início original: ${selectedWeek.start_date}`)
        console.log(`Data fim original: ${selectedWeek.end_date}`)
        console.log(`Data início ISO: ${startDate}`)
        console.log(`Data fim ISO: ${endDate}`)
      } catch (dateError) {
        console.error("Erro ao processar datas:", dateError)
        throw new Error("Erro ao processar as datas da semana")
      }

      // Construir URL manualmente sem URLSearchParams para evitar encoding excessivo
      const url = `${API_BASE_URL}/question-reports?answerer_id=${usuario.id}&min_date=${startDate}&max_date=${endDate}&page=1&perPage=100`

      console.log(`URL da requisição: ${url}`)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log(`Status da resposta: ${response.status}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Erro da API:", errorData)
        console.error("Response headers:", Object.fromEntries(response.headers.entries()))
        throw new Error(
          errorData.error?.message || errorData.message || `Erro ${response.status}: ${response.statusText}`,
        )
      }

      const data = await response.json()
      console.log("Dados da semana:", data)
      setWeekReports(data.data || [])
    } catch (error) {
      console.error("Erro ao buscar relatórios da semana:", error)
      toast({
        title: "⚠️ Erro",
        description: error instanceof Error ? error.message : "Não foi possível carregar os relatórios da semana.",
        variant: "destructive",
      })
      setWeekReports([])
    } finally {
      setIsLoadingWeekReports(false)
    }
  }

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

            // Processar dados de tema
            const processedThemeData = processThemeData(data)
            setThemeData(processedThemeData)
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

  // Processar dados da semana
  const getWeekData = () => {
    if (!weekReports.length) return null

    const totalQuestions = weekReports.length
    const answeredQuestions = weekReports.filter((r) => r.status === "answered").length
    const correctAnswers = weekReports.filter((r) => {
      if (r.status !== "answered") return false
      const correctAnswer = r.question.answers.find((a) => a.correct)
      return correctAnswer && correctAnswer.id === r.answer_id
    }).length
    const wrongAnswers = answeredQuestions - correctAnswers
    const abandonedQuestions = weekReports.filter((r) => r.status !== "answered").length
    const correctRate = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0
    const wrongRate = answeredQuestions > 0 ? Math.round((wrongAnswers / answeredQuestions) * 100) : 0
    const averageTime =
      answeredQuestions > 0
        ? Math.round(
            weekReports.filter((r) => r.status === "answered").reduce((sum, r) => sum + r.time_to_answer, 0) /
              answeredQuestions,
          )
        : 0

    return {
      total: totalQuestions,
      answered: answeredQuestions,
      correct: correctAnswers,
      wrong: wrongAnswers,
      abandoned: abandonedQuestions,
      correct_rate: correctRate,
      wrong_rate: wrongRate,
      average_time: averageTime,
    }
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

  const weekData = getWeekData()

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
            <div className="flex items-center gap-3">
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
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
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

      {/* Desempenho por Tema/Semana */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#3FA110]">Desempenho</h2>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "theme" ? "default" : "outline"}
                onClick={() => setViewMode("theme")}
                className={`px-4 py-2 text-sm ${
                  viewMode === "theme"
                    ? "bg-[#3FA110] text-white hover:bg-[#2d7a0c]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Por Tema
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                onClick={() => setViewMode("week")}
                className={`px-4 py-2 text-sm flex items-center gap-2 ${
                  viewMode === "week"
                    ? "bg-[#3FA110] text-white hover:bg-[#2d7a0c]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Calendar size={16} />
                Por Semana
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {viewMode === "theme" ? (
            <div className="space-y-6">
              {themeData.length > 0 ? (
                themeData.map((theme) => (
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

                      {/* <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-xs text-gray-600">Tempo Médio</span>
                        </div>
                        <p className="text-lg font-bold text-purple-600">{formatTime(theme.average_time)}</p>
                      </div> */}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 flex flex-col items-center justify-center">
                  <div className="p-3 bg-blue-50 rounded-full mb-3">
                    <Info className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-gray-600 mb-2">Não há dados de desempenho por tema disponíveis.</p>
                  {statistics.answered_questions > 0 ? (
                    <p className="text-sm text-gray-500">
                      O usuário respondeu perguntas, mas os dados por tema não estão disponíveis.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">O usuário ainda não respondeu nenhuma pergunta.</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Seletor de Semana */}
              <div className="space-y-2">
                <Label htmlFor="week-select" className="text-[#146E37] font-medium text-sm">
                  Selecione uma semana para visualizar o desempenho:
                </Label>
                <select
                  id="week-select"
                  value={selectedWeekId}
                  onChange={(e) => {
                    setSelectedWeekId(e.target.value)
                    if (e.target.value) {
                      fetchWeekReports(e.target.value)
                    } else {
                      setWeekReports([])
                    }
                  }}
                  className="w-full max-w-md p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3FA110] focus:border-transparent"
                  disabled={isLoadingWeeks}
                >
                  <option value="">Escolha uma semana</option>
                  {availableWeeks.map((week) => (
                    <option key={week.id} value={week.id}>
                      {week.title} ({new Date(week.start_date).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(week.end_date).toLocaleDateString("pt-BR")})
                    </option>
                  ))}
                </select>
              </div>

              {/* Loading de semanas */}
              {isLoadingWeeks && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3FA110]"></div>
                  <span className="ml-2 text-gray-600">Carregando semanas...</span>
                </div>
              )}

              {/* Loading de relatórios */}
              {isLoadingWeekReports && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3FA110]"></div>
                  <span className="ml-2 text-gray-600">Carregando relatórios da semana...</span>
                </div>
              )}

              {/* Dados da semana */}
              {selectedWeekId && !isLoadingWeekReports && weekData && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {availableWeeks.find((w) => w.id === selectedWeekId)?.title}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="h-4 w-4 text-gray-600" />
                        <span className="text-xs text-gray-600">Total</span>
                      </div>
                      <p className="text-lg font-bold text-gray-600">{weekData.total}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-xs text-gray-600">Respondidas</span>
                      </div>
                      <p className="text-lg font-bold text-blue-600">{weekData.answered}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-gray-600">Corretas</span>
                      </div>
                      <p className="text-lg font-bold text-green-600">{weekData.correct}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-gray-600">Erradas</span>
                      </div>
                      <p className="text-lg font-bold text-red-600">{weekData.wrong}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-xs text-gray-600">Abandonadas</span>
                      </div>
                      <p className="text-lg font-bold text-orange-600">{weekData.abandoned}</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-[#3FA110]" />
                        <span className="text-xs text-gray-600">% Acerto</span>
                      </div>
                      <p className="text-lg font-bold text-[#3FA110]">{weekData.correct_rate}%</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                        <span className="text-xs text-gray-600">% Erro</span>
                      </div>
                      <p className="text-lg font-bold text-red-600">{weekData.wrong_rate}%</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span className="text-xs text-gray-600">Tempo Médio</span>
                      </div>
                      <p className="text-lg font-bold text-purple-600">{formatTime(weekData.average_time)}</p>
                    </div>
                  </div>

                  {/* Lista de perguntas da semana */}
                  {weekReports.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Perguntas da Semana</h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {weekReports.map((report) => (
                          <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 text-sm mb-1">{report.question.title}</h5>
                                <p className="text-xs text-gray-600 mb-2">{report.question.context}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>Tema: {report.question.theme.title}</span>
                                  <span>Departamento: {report.question.department.title}</span>
                                  <span>Personagem: {report.question.character.name}</span>
                                </div>
                                {/* Adicionar informações de resposta */}
                                {report.status === "answered" && (
                                  <div className="mt-2 space-y-1">
                                    <div className="text-xs">
                                      <span className="font-medium text-gray-700">Resposta do usuário:</span>{" "}
                                      <span className="text-gray-600">{report.answer.text}</span>
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium text-gray-700">Resposta Correta:</span>{" "}
                                      <span className="text-gray-600">
                                        {report.question.answers.find((a) => a.correct)?.text || "Não encontrada"}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    report.status === "answered"
                                      ? report.question.answers.find((a) => a.correct)?.id === report.answer_id
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                      : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {report.status === "answered"
                                    ? report.question.answers.find((a) => a.correct)?.id === report.answer_id
                                      ? "Correta"
                                      : "Incorreta"
                                    : "Abandonada"}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mensagem quando nenhuma semana está selecionada */}
              {!selectedWeekId && !isLoadingWeeks && (
                <div className="text-center py-8 text-gray-500">
                  Selecione uma semana para visualizar o desempenho detalhado.
                </div>
              )}

              {/* Mensagem quando não há dados para a semana selecionada */}
              {selectedWeekId && !isLoadingWeekReports && weekReports.length === 0 && (
                <div className="text-center py-8 text-gray-500">Nenhum dado encontrado para a semana selecionada.</div>
              )}
            </div>
          )}
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
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
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
