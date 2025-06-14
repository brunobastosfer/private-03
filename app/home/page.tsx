"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  getAuthToken,
  removeAuthToken,
  getUserProfile,
  getUsers,
  getDashboardStatistics,
  getRankingUsers,
} from "@/lib/auth"
import {
  getWeeks,
  createWeek,
  updateWeek,
  deleteWeek,
  getQuestions,
  deleteQuestion,
  type Week,
  type WeekInput,
  type Question,
  updateQuestion,
  createQuestion,
  getThemes,
  createTheme,
  updateTheme,
  deleteTheme,
  type Theme,
  type ThemeInput,
  getCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  type Character,
  getDepartments,
  type Department,
  type CreateQuestionInput,
  updateUser,
  deleteUser,
  downloadRankingCSV,
  type UserInput,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { StatsCards } from "@/components/ranking/stats-cards"
import { RankingTable } from "@/components/ranking/ranking-table"
import { PerguntasList } from "@/components/perguntas/perguntas-list"
import { NovaPerguntaButton } from "@/components/perguntas/nova-pergunta-button"
import { NovaPerguntaForm } from "@/components/perguntas/nova-pergunta-form"
import { SemanasList } from "@/components/semanas/semanas-list"
import { NovaSemanaButton } from "@/components/semanas/nova-semana-button"
import { NovaSemanaForm } from "@/components/semanas/nova-semana-form"
import { TemasList } from "@/components/temas/temas-list"
import { NovoTemaButton } from "@/components/temas/novo-tema-button"
import { NovoTemaForm } from "@/components/temas/novo-tema-form"
import { PersonagensList } from "@/components/personagens/personagens-list"
import { NovoPersonagemButton } from "@/components/personagens/novo-personagem-button"
import { NovoPersonagemForm } from "@/components/personagens/novo-personagem-form"
import { ConquistasList } from "@/components/conquistas/conquistas-list"
import { NovaConquistaButton } from "@/components/conquistas/nova-conquista-button"
import { NovaConquistaForm } from "@/components/conquistas/nova-conquista-form"
import { UsuariosList } from "@/components/usuarios/usuarios-list"
import { NovoUsuarioForm } from "@/components/usuarios/novo-usuario-form"
import { RelatorioUsuarioDetalhado } from "@/components/usuarios/relatorio-usuario-detalhado"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Dados mockados (mantidos para outras seções)
import { conquistasData as initialConquistasData, semanasData as initialSemanasData } from "@/data/mock-data"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  points: number
  role: string
}

interface ApiUser {
  id: string
  name: string
  email: string
  avatar: string
  points: number
  role: string
  gamerole: {
    id: string
    title: string
    points_to_achieve: number
  }
}

interface DashboardStats {
  week_participants: number
  participation_rate: number
  questions_answered: number
  answer_time_average: number
  correct_rate: number
  incorrect_rate: number
}

interface Conquista {
  id: string
  title: string
  description: string
  badge: string
  condition: string
  more_than?: number | null
  theme?: string | null
}

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [activeItem, setActiveItem] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  // Estados para controlar os dialogs de confirmação
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string; title?: string } | null>(null)

  // Estados para usuários da API
  const [apiUsuarios, setApiUsuarios] = useState<ApiUser[]>([])
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [perPage] = useState(10)

  // Estados para ranking da API
  const [rankingUsers, setRankingUsers] = useState<ApiUser[]>([])
  const [isLoadingRanking, setIsLoadingRanking] = useState(true)
  const [rankingCurrentPage, setRankingCurrentPage] = useState(1)
  const [rankingTotalPages, setRankingTotalPages] = useState(1)
  const [rankingPerPage] = useState(10)

  // Estados para semanas da API
  const [apiSemanas, setApiSemanas] = useState<Week[]>([])
  const [isLoadingSemanas, setIsLoadingSemanas] = useState(false)
  const [semanasCurrentPage, setSemanasCurrentPage] = useState(1)
  const [semanasTotalPages, setSemanasTotalPages] = useState(1)
  const [semanasPerPage] = useState(10)

  // Estados para perguntas da API
  const [apiPerguntas, setApiPerguntas] = useState<Question[]>([])
  const [isLoadingPerguntas, setIsLoadingPerguntas] = useState(false)
  const [perguntasCurrentPage, setPerguntasCurrentPage] = useState(1)
  const [perguntasTotalPages, setPerguntasTotalPages] = useState(1)
  const [perguntasPerPage] = useState(10)

  // Estados para temas da API
  const [apiTemas, setApiTemas] = useState<Theme[]>([])
  const [isLoadingTemas, setIsLoadingTemas] = useState(false)
  const [temasCurrentPage, setTemasCurrentPage] = useState(1)
  const [temasTotalPages, setTemasTotalPages] = useState(1)
  const [temasPerPage] = useState(10)

  // Estados para personagens da API
  const [apiPersonagens, setApiPersonagens] = useState<Character[]>([])
  const [isLoadingPersonagens, setIsLoadingPersonagens] = useState(false)
  const [personagensCurrentPage, setPersonagensCurrentPage] = useState(1)
  const [personagensTotalPages, setPersonagensTotalPages] = useState(1)
  const [personagensPerPage] = useState(10)

  // Estados para departamentos da API
  const [apiDepartamentos, setApiDepartamentos] = useState<Department[]>([])
  const [isLoadingDepartamentos, setIsLoadingDepartamentos] = useState(false)

  // Estados para estatísticas
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Estados para os dados mockados (mantidos para outras seções)
  const [conquistasData, setConquistasData] = useState(initialConquistasData)
  const [semanasData, setSemanasData] = useState(initialSemanasData)

  // Estados para formulários
  const [showPerguntaForm, setShowPerguntaForm] = useState(false)
  const [showSemanaForm, setShowSemanaForm] = useState(false)
  const [showTemaForm, setShowTemaForm] = useState(false)
  const [showPersonagemForm, setShowPersonagemForm] = useState(false)
  const [showConquistaForm, setShowConquistaForm] = useState(false)
  const [showUsuarioForm, setShowUsuarioForm] = useState(false)

  // Estados para edição
  const [editingPergunta, setEditingPergunta] = useState<Question | null>(null)
  const [editingSemana, setEditingSemana] = useState<Week | null>(null)
  const [editingTema, setEditingTema] = useState<Theme | null>(null)
  const [editingPersonagem, setEditingPersonagem] = useState<Character | null>(null)
  const [editingConquista, setEditingConquista] = useState<any>(null)
  const [editingUsuario, setEditingUsuario] = useState<any>(null)

  // Estados para relatório de usuário
  const [showUsuarioReport, setShowUsuarioReport] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null)

  // Estados para conquistas
  const [apiConquistas, setApiConquistas] = useState<Conquista[]>([])
  const [isLoadingConquistas, setIsLoadingConquistas] = useState(false)
  const [conquistasCurrentPage, setConquistasCurrentPage] = useState(1)
  const [conquistasTotalPages, setConquistasTotalPages] = useState(1)
  const [conquistasPerPage] = useState(10)

  // Estado para download
  const [isDownloadingRanking, setIsDownloadingRanking] = useState(false)

  // Preparar dados dos cards com estatísticas reais
  const statsCards = [
    {
      title: "Média de acerto por perguntas",
      value: dashboardStats ? `${dashboardStats.correct_rate}%` : "0%",
      isLoading: isLoadingStats,
    },
    {
      title: "Total de perguntas respondidas",
      value: dashboardStats ? dashboardStats.questions_answered.toString() : "0",
      isLoading: isLoadingStats,
    },
    {
      title: "Média de tempo das respostas",
      value: dashboardStats ? `${dashboardStats.answer_time_average}s` : "0s",
      isLoading: isLoadingStats,
    },
  ]

  // Verificar autenticação e buscar perfil do usuário
  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push("/")
      return
    }

    // Buscar perfil do usuário
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true)
        const result = await getUserProfile()

        if (result.success && result.user) {
          setUser(result.user)
        } else {
          console.error("Erro ao buscar perfil:", result.error)
          toast({
            title: "⚠️ Erro",
            description: "Não foi possível carregar o perfil do usuário.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error)
        toast({
          title: "⚠️ Erro",
          description: "Erro ao conectar com o servidor.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [router, toast])

  // Buscar estatísticas do dashboard
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoadingStats(true)
        const result = await getDashboardStatistics()

        if (result.success && result.data) {
          setDashboardStats(result.data)
        } else {
          console.error("Erro ao buscar estatísticas:", result.error)
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchDashboardStats()
  }, [])

  // Função para download do ranking CSV
  const handleDownloadRankingCSV = async () => {
    try {
      setIsDownloadingRanking(true)
      const result = await downloadRankingCSV()

      if (result.success) {
        toast({
          title: "✅ Download Iniciado",
          description: "O download do ranking CSV foi iniciado.",
          variant: "default",
        })
      } else {
        toast({
          title: "⚠️ Erro",
          description: result.error || "Erro ao fazer download do ranking.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao fazer download do ranking:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    } finally {
      setIsDownloadingRanking(false)
    }
  }

  // Buscar ranking quando necessário
  const fetchRanking = async (page = 1) => {
    try {
      setIsLoadingRanking(true)
      const result = await getRankingUsers(page, rankingPerPage)

      if (result.success && result.data) {
        setRankingUsers(result.data.data)
        setRankingCurrentPage(result.data.page)
        setRankingTotalPages(result.data.totalPages)
      } else {
        console.error("Erro ao buscar ranking:", result.error)
      }
    } catch (error) {
      console.error("Erro ao buscar ranking:", error)
    } finally {
      setIsLoadingRanking(false)
    }
  }

  useEffect(() => {
    if (activeItem === "home") {
      fetchRanking(1)
    }
  }, [activeItem])

  // Buscar usuários quando necessário
  const fetchUsuarios = async (page = 1) => {
    try {
      setIsLoadingUsuarios(true)
      const result = await getUsers(page, perPage)

      if (result.success && result.data) {
        setApiUsuarios(result.data.data)
        setCurrentPage(result.data.page)
        setTotalPages(Math.ceil(result.data.count / result.data.perPage))
      } else {
        console.error("Erro ao buscar usuários:", result.error)
        toast({
          title: "⚠️ Erro",
          description: "Não foi possível carregar os usuários.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingUsuarios(false)
    }
  }

  // Buscar semanas quando necessário
  const fetchSemanas = async (page = 1) => {
    try {
      setIsLoadingSemanas(true)
      const result = await getWeeks(page, semanasPerPage)

      if (result.success && result.data) {
        setApiSemanas(result.data.data)
        setSemanasCurrentPage(result.data.page)

        // Calcular o número total de páginas
        const totalItems = result.data.count || 0
        const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / semanasPerPage))
        setSemanasTotalPages(calculatedTotalPages)

        console.log(`Semanas carregadas: página ${page} de ${calculatedTotalPages}, total de ${totalItems} itens`)
      } else {
        console.error("Erro ao buscar semanas:", result.error)
        toast({
          title: "⚠️ Erro",
          description: "Não foi possível carregar as semanas.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar semanas:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingSemanas(false)
    }
  }

  // Buscar perguntas quando necessário
  const fetchPerguntas = async (page = 1) => {
    try {
      setIsLoadingPerguntas(true)
      const result = await getQuestions(page, perguntasPerPage)

      if (result.success && result.data) {
        setApiPerguntas(result.data.data)
        setPerguntasCurrentPage(result.data.page)

        // Calcular o número total de páginas
        const totalItems = result.data.count || 0
        const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / perguntasPerPage))
        setPerguntasTotalPages(calculatedTotalPages)

        console.log(`Perguntas carregadas: página ${page} de ${calculatedTotalPages}, total de ${totalItems} itens`)
      } else {
        console.error("Erro ao buscar perguntas:", result.error)
        toast({
          title: "⚠️ Erro",
          description: "Não foi possível carregar as perguntas.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingPerguntas(false)
    }
  }

  // Buscar temas quando necessário
  const fetchTemas = async (page = 1) => {
    try {
      setIsLoadingTemas(true)
      const result = await getThemes(page, temasPerPage)

      if (result.success && result.data) {
        setApiTemas(result.data.data)
        setTemasCurrentPage(result.data.page)

        // Calcular o número total de páginas
        const totalItems = result.data.count || 0
        const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / temasPerPage))
        setTemasTotalPages(calculatedTotalPages)

        console.log(`Temas carregados: página ${page} de ${calculatedTotalPages}, total de ${totalItems} itens`)
      } else {
        console.error("Erro ao buscar temas:", result.error)
        toast({
          title: "⚠️ Erro",
          description: "Não foi possível carregar os temas.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar temas:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingTemas(false)
    }
  }

  // Buscar personagens quando necessário
  const fetchPersonagens = async (page = 1) => {
    try {
      setIsLoadingPersonagens(true)
      const result = await getCharacters(page, personagensPerPage)

      if (result.success && result.data) {
        setApiPersonagens(result.data.data)
        setPersonagensCurrentPage(result.data.page)

        // Calcular o número total de páginas
        const totalItems = result.data.count || 0
        const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / personagensPerPage))
        setPersonagensTotalPages(calculatedTotalPages)

        console.log(`Personagens carregados: página ${page} de ${calculatedTotalPages}, total de ${totalItems} itens`)
      } else {
        console.error("Erro ao buscar personagens:", result.error)
        toast({
          title: "⚠️ Erro",
          description: "Não foi possível carregar os personagens.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar personagens:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingPersonagens(false)
    }
  }

  // Buscar departamentos quando necessário
  const fetchDepartamentos = async () => {
    try {
      setIsLoadingDepartamentos(true)
      const result = await getDepartments(1, 100) // Buscar até 100 departamentos

      if (result.success && result.data) {
        setApiDepartamentos(result.data.data)
        console.log(`Departamentos carregados: ${result.data.data.length} itens`)
      } else {
        console.error("Erro ao buscar departamentos:", result.error)
        toast({
          title: "⚠️ Erro",
          description: "Não foi possível carregar os departamentos.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar departamentos:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingDepartamentos(false)
    }
  }

  // Buscar conquistas quando necessário
  const fetchConquistas = async (page = 1) => {
    try {
      setIsLoadingConquistas(true)
      const token = getAuthToken()

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"
      const response = await fetch(`${API_BASE_URL}/achievements?page=${page}&perPage=${conquistasPerPage}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Erro ao buscar conquistas")
      }

      setApiConquistas(data.data)
      setConquistasCurrentPage(data.page)

      // Calcular o número total de páginas
      const totalItems = data.count || 0
      const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / conquistasPerPage))
      setConquistasTotalPages(calculatedTotalPages)

      console.log(`Conquistas carregadas: página ${page} de ${calculatedTotalPages}, total de ${totalItems} itens`)
    } catch (error) {
      console.error("Erro ao buscar conquistas:", error)
      toast({
        title: "⚠️ Erro",
        description: "Não foi possível carregar as conquistas.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingConquistas(false)
    }
  }

  // Buscar usuários quando a aba de usuários for ativada
  useEffect(() => {
    if (activeItem === "usuarios") {
      fetchUsuarios(1)
    }
  }, [activeItem])

  // Buscar perguntas e dados relacionados quando a aba de perguntas for ativada
  useEffect(() => {
    if (activeItem === "perguntas") {
      // Buscar perguntas
      fetchPerguntas(1)

      // Buscar todos os temas (sem paginação para o select)
      const fetchAllTemas = async () => {
        try {
          const result = await getThemes(1, 100) // Buscar até 100 temas
          if (result.success && result.data) {
            setApiTemas(result.data.data)
          }
        } catch (error) {
          console.error("Erro ao buscar temas para perguntas:", error)
        }
      }

      // Buscar todos os personagens (sem paginação para o select)
      const fetchAllPersonagens = async () => {
        try {
          const result = await getCharacters(1, 100) // Buscar até 100 personagens
          if (result.success && result.data) {
            setApiPersonagens(result.data.data)
          }
        } catch (error) {
          console.error("Erro ao buscar personagens para perguntas:", error)
        }
      }

      // Buscar todas as semanas (sem paginação para o select)
      const fetchAllSemanas = async () => {
        try {
          const result = await getWeeks(1, 100) // Buscar até 100 semanas
          if (result.success && result.data) {
            setApiSemanas(result.data.data)
          }
        } catch (error) {
          console.error("Erro ao buscar semanas para perguntas:", error)
        }
      }

      // Executar todas as buscas
      fetchAllTemas()
      fetchAllPersonagens()
      fetchAllSemanas()
      fetchDepartamentos() // Buscar departamentos também
    }
  }, [activeItem])

  // Buscar temas quando a aba de temas for ativada
  useEffect(() => {
    if (activeItem === "tema") {
      fetchTemas(1)
    }
  }, [activeItem])

  // Buscar personagens quando a aba de personagens for ativada
  useEffect(() => {
    if (activeItem === "personagens") {
      fetchPersonagens(1)
    }
  }, [activeItem])

  // Buscar semanas quando a aba de semanas for ativada
  useEffect(() => {
    if (activeItem === "semanas") {
      fetchSemanas(1)
    }
  }, [activeItem])

  // Buscar conquistas quando a aba de conquistas for ativada
  useEffect(() => {
    if (activeItem === "conquistas") {
      fetchConquistas(1)
    }
  }, [activeItem])

  // Função para abrir o dialog de confirmação
  const openDeleteDialog = (id: string, type: string, title?: string) => {
    console.log(`=== ABRINDO DIALOG DE EXCLUSÃO ===`)
    console.log(`ID: ${id}, Tipo: ${type}, Título: ${title}`)

    setItemToDelete({ id, type, title })
    setDeleteDialogOpen(true)
  }

  // Função para confirmar a exclusão
  const confirmDelete = async () => {
    if (!itemToDelete) return

    console.log(`=== CONFIRMANDO EXCLUSÃO ===`)
    console.log(`Item a excluir:`, itemToDelete)

    try {
      let result = { success: false, error: "Tipo não reconhecido" }

      switch (itemToDelete.type) {
        case "pergunta":
          console.log(`Excluindo pergunta ID: ${itemToDelete.id}`)
          result = await deleteQuestion(itemToDelete.id)
          if (result.success) {
            // Atualizar a lista de perguntas após a exclusão
            console.log("Pergunta excluída com sucesso, atualizando lista...")
            await fetchPerguntas(perguntasCurrentPage)
          }
          break

        case "semana":
          console.log(`Excluindo semana ID: ${itemToDelete.id}`)
          result = await deleteWeek(itemToDelete.id)
          if (result.success) {
            // Atualizar a lista de semanas após a exclusão
            console.log("Semana excluída com sucesso, atualizando lista...")
            await fetchSemanas(semanasCurrentPage)
          }
          break

        case "tema":
          console.log(`Excluindo tema ID: ${itemToDelete.id}`)
          result = await deleteTheme(itemToDelete.id)
          if (result.success) {
            // Atualizar a lista de temas após a exclusão
            await fetchTemas(temasCurrentPage)
          }
          break

        case "personagem":
          console.log(`Excluindo personagem ID: ${itemToDelete.id}`)
          result = await deleteCharacter(itemToDelete.id)
          if (result.success) {
            // Atualizar a lista de personagens após a exclusão
            await fetchPersonagens(personagensCurrentPage)
          }
          break

        case "conquista":
          console.log(`Excluindo conquista ID: ${itemToDelete.id}`)
          try {
            const token = getAuthToken()
            if (!token) {
              throw new Error("Token não encontrado")
            }

            const API_BASE_URL =
              process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

            console.log("URL:", `${API_BASE_URL}/achievements/${itemToDelete.id}`)

            const response = await fetch(`${API_BASE_URL}/achievements/${itemToDelete.id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            })

            console.log("Status da resposta:", response.status)

            if (!response.ok) {
              const data = await response.json().catch(() => ({}))
              console.error("Erro ao excluir conquista:", data)
              throw new Error(
                data.error?.message || `Erro ao excluir conquista: ${response.status} ${response.statusText}`,
              )
            }

            result = { success: true }
            await fetchConquistas(conquistasCurrentPage)
          } catch (error) {
            console.error("Erro ao excluir conquista:", error)
            result = {
              success: false,
              error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
            }
          }
          break

        case "usuario":
          console.log(`Excluindo usuário ID: ${itemToDelete.id}`)
          result = await deleteUser(itemToDelete.id)
          if (result.success) {
            // Atualizar a lista de usuários após a exclusão
            await fetchUsuarios(currentPage)
          }
          break
      }

      if (result.success) {
        console.log(`=== EXCLUSÃO BEM-SUCEDIDA ===`)
        toast({
          title: "✅ Item Excluído",
          description: `${itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1)} excluído(a) com sucesso.`,
          variant: "default",
        })
      } else {
        console.error(`Erro ao excluir ${itemToDelete.type}:`, result.error)
        toast({
          title: "⚠️ Erro",
          description: result.error || `Erro ao excluir ${itemToDelete.type}.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error(`Erro ao excluir ${itemToDelete.type}:`, error)
      toast({
        title: "⚠️ Erro",
        description: error instanceof Error ? error.message : "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  // Funções para excluir itens (agora usando o dialog)
  const handleDeletePergunta = (id: string) => {
    const pergunta = apiPerguntas.find((p) => p.id === id)
    openDeleteDialog(id, "pergunta", pergunta?.title)
  }

  const handleDeleteSemana = (id: string) => {
    const semana = apiSemanas.find((s) => s.id === id)
    openDeleteDialog(id, "semana", semana?.title)
  }

  const handleDeleteTema = (id: string) => {
    const tema = apiTemas.find((t) => t.id === id)
    openDeleteDialog(id, "tema", tema?.title)
  }

  const handleDeletePersonagem = (id: string) => {
    const personagem = apiPersonagens.find((p) => p.id === id)
    openDeleteDialog(id, "personagem", personagem?.name)
  }

  const handleDeleteConquista = (id: string) => {
    const conquista = apiConquistas.find((c) => c.id === id)
    openDeleteDialog(id, "conquista", conquista?.title)
  }

  const handleDeleteUsuario = (id: string) => {
    const usuario = apiUsuarios.find((u) => u.id === id)
    openDeleteDialog(id, "usuario", usuario?.name)
  }

  const handleLogout = () => {
    removeAuthToken()
    router.push("/")
  }

  // Handlers para Perguntas
  const handleEditPergunta = (id: string) => {
    const pergunta = apiPerguntas.find((p) => p.id === id)
    if (pergunta) {
      setEditingPergunta(pergunta)
      setShowPerguntaForm(true)
    }
  }

  const handleNovaPergunta = () => {
    setEditingPergunta(null)
    setShowPerguntaForm(true)
  }

  const handleCancelPerguntaForm = () => {
    setShowPerguntaForm(false)
    setEditingPergunta(null)
  }

  const handleSavePergunta = async (perguntaData: CreateQuestionInput & { week_id?: string }) => {
    try {
      console.log("=== INICIANDO SALVAMENTO DE PERGUNTA ===")
      console.log("Dados recebidos do formulário:", perguntaData)
      console.log("Modo de edição:", !!editingPergunta)

      if (editingPergunta && editingPergunta.id) {
        // Atualizar pergunta existente - MODO DE EDIÇÃO
        console.log("=== MODO DE EDIÇÃO ===")
        console.log("ID da pergunta:", editingPergunta.id)
        console.log("Dados para atualização:", perguntaData)

        const result = await updateQuestion(editingPergunta.id, perguntaData)

        console.log("=== RESULTADO DA ATUALIZAÇÃO ===")
        console.log("Success:", result.success)
        console.log("Data:", result.data)
        console.log("Error:", result.error)

        if (result.success) {
          // Recarregar a lista de perguntas após a atualização
          console.log("Recarregando lista de perguntas...")
          await fetchPerguntas(perguntasCurrentPage)

          toast({
            title: "✅ Pergunta Atualizada",
            description: "A pergunta foi atualizada com sucesso.",
            variant: "default",
          })

          // Fechar o formulário
          setShowPerguntaForm(false)
          setEditingPergunta(null)
        } else {
          console.error("Erro ao atualizar pergunta:", result.error)
          toast({
            title: "⚠️ Erro",
            description: result.error || "Erro ao atualizar pergunta.",
            variant: "destructive",
          })
        }
      } else {
        // Criar nova pergunta
        console.log("=== MODO DE CRIAÇÃO ===")

        // Validações para nova pergunta
        if (!perguntaData.title?.trim()) {
          toast({
            title: "⚠️ Erro de Validação",
            description: "O título da pergunta é obrigatório.",
            variant: "destructive",
          })
          return
        }

        if (!perguntaData.context?.trim()) {
          toast({
            title: "⚠️ Erro de Validação",
            description: "O contexto da pergunta é obrigatório.",
            variant: "destructive",
          })
          return
        }

        if (!perguntaData.answers || perguntaData.answers.length < 2) {
          toast({
            title: "⚠️ Erro de Validação",
            description: "É necessário pelo menos 2 respostas.",
            variant: "destructive",
          })
          return
        }

        if (!perguntaData.theme_id) {
          toast({
            title: "⚠️ Erro de Validação",
            description: "É necessário selecionar um tema.",
            variant: "destructive",
          })
          return
        }

        if (!perguntaData.department_id) {
          toast({
            title: "⚠️ Erro de Validação",
            description: "É necessário selecionar um departamento.",
            variant: "destructive",
          })
          return
        }

        if (!perguntaData.character_id) {
          toast({
            title: "⚠️ Erro de Validação",
            description: "É necessário selecionar um personagem.",
            variant: "destructive",
          })
          return
        }

        if (!perguntaData.week_id) {
          toast({
            title: "⚠️ Erro de Validação",
            description: "É necessário selecionar uma semana.",
            variant: "destructive",
          })
          return
        }

        const hasCorrectAnswer = perguntaData.answers.some((answer) => answer.correct)
        if (!hasCorrectAnswer) {
          toast({
            title: "⚠️ Erro de Validação",
            description: "É necessário marcar pelo menos uma resposta como correta.",
            variant: "destructive",
          })
          return
        }

        // Mostrar toast de loading
        toast({
          title: "⏳ Criando Pergunta",
          description: "Aguarde enquanto a pergunta está sendo criada e associada à semana...",
          variant: "default",
        })

        const result = await createQuestion(perguntaData)

        if (result.success) {
          // Loading de 2 segundos para permitir o PATCH da semana
          console.log("Aguardando 2 segundos para finalizar associação com a semana...")
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Recarregar a lista de perguntas após a criação
          fetchPerguntas(1) // Voltar para a primeira página para ver a nova pergunta

          toast({
            title: "✅ Pergunta Criada",
            description: "A nova pergunta foi criada e associada à semana com sucesso.",
            variant: "default",
          })

          // Fechar o formulário
          setShowPerguntaForm(false)
          setEditingPergunta(null)
        } else {
          console.error("Erro ao criar pergunta:", result.error)
          toast({
            title: "⚠️ Erro",
            description: result.error || "Erro ao criar pergunta.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("=== ERRO GERAL AO SALVAR PERGUNTA ===")
      console.error("Erro completo:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    }
  }

  const handlePerguntasPageChange = (page: number) => {
    console.log(`Mudando para a página ${page} de perguntas`)
    setPerguntasCurrentPage(page)
    fetchPerguntas(page)
  }

  // Handlers para Semanas
  const handleEditSemana = (id: string) => {
    const semana = apiSemanas.find((s) => s.id === id)
    if (semana) {
      setEditingSemana(semana)
      setShowSemanaForm(true)
    }
  }

  const handleNovaSemana = () => {
    setEditingSemana(null)
    setShowSemanaForm(true)
  }

  const handleCancelSemanaForm = () => {
    setShowSemanaForm(false)
    setEditingSemana(null)
  }

  const handleSaveSemana = async (semanaData: WeekInput) => {
    try {
      // Garantir que as datas estão no formato ISO-8601 completo
      const formattedData = {
        ...semanaData,
        start_date: semanaData.start_date.includes("T")
          ? semanaData.start_date
          : new Date(semanaData.start_date + "T00:00:00.000Z").toISOString(),
        end_date: semanaData.end_date.includes("T")
          ? semanaData.end_date
          : new Date(semanaData.end_date + "T23:59:59.999Z").toISOString(),
      }

      if (editingSemana) {
        // Atualizar semana existente
        const result = await updateWeek(editingSemana.id, formattedData)

        if (result.success) {
          // Recarregar a lista de semanas após a atualização
          fetchSemanas(semanasCurrentPage)

          toast({
            title: "✅ Semana Atualizada",
            description: "A semana foi atualizada com sucesso.",
            variant: "default",
          })
        } else {
          toast({
            title: "⚠️ Erro",
            description: result.error || "Erro ao atualizar semana.",
            variant: "destructive",
          })
        }
      } else {
        // Criar nova semana
        const result = await createWeek(formattedData)

        if (result.success) {
          // Recarregar a lista de semanas após a criação
          fetchSemanas(1) // Voltar para a primeira página para ver a nova semana

          toast({
            title: "✅ Semana Criada",
            description: "A nova semana foi criada com sucesso.",
            variant: "default",
          })
        } else {
          toast({
            title: "⚠️ Erro",
            description: result.error || "Erro ao criar semana.",
            variant: "destructive",
          })
        }
      }

      setShowSemanaForm(false)
      setEditingSemana(null)
    } catch (error) {
      console.error("Erro ao salvar semana:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    }
  }

  const handleSemanasPageChange = (page: number) => {
    console.log(`Mudando para a página ${page} de semanas`)
    setSemanasCurrentPage(page)
    fetchSemanas(page)
  }

  // Handlers para Temas
  const handleEditTema = (id: string) => {
    const tema = apiTemas.find((t) => t.id === id)
    if (tema) {
      setEditingTema(tema)
      setShowTemaForm(true)
    }
  }

  const handleNovoTema = () => {
    setEditingTema(null)
    setShowTemaForm(true)
  }

  const handleCancelTemaForm = () => {
    setShowTemaForm(false)
    setEditingTema(null)
  }

  const handleSaveTema = async (temaData: ThemeInput) => {
    try {
      if (editingTema) {
        // Atualizar tema existente
        const result = await updateTheme(editingTema.id, temaData)

        if (result.success) {
          // Recarregar a lista de temas após a atualização
          fetchTemas(temasCurrentPage)

          toast({
            title: "✅ Tema Atualizado",
            description: "O tema foi atualizado com sucesso.",
            variant: "default",
          })
        } else {
          toast({
            title: "⚠️ Erro",
            description: result.error || "Erro ao atualizar tema.",
            variant: "destructive",
          })
        }
      } else {
        // Criar novo tema
        const result = await createTheme(temaData)

        if (result.success) {
          // Recarregar a lista de temas após a criação
          fetchTemas(1) // Voltar para a primeira página para ver o novo tema

          toast({
            title: "✅ Tema Criado",
            description: "O novo tema foi criado com sucesso.",
            variant: "default",
          })
        } else {
          toast({
            title: "⚠️ Erro",
            description: result.error || "Erro ao criar tema.",
            variant: "destructive",
          })
        }
      }

      setShowTemaForm(false)
      setEditingTema(null)
    } catch (error) {
      console.error("Erro ao salvar tema:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    }
  }

  const handleTemasPageChange = (page: number) => {
    console.log(`Mudando para a página ${page} de temas`)
    setTemasCurrentPage(page)
    fetchTemas(page)
  }

  // Handlers para Personagens
  const handleEditPersonagem = (id: string) => {
    const personagem = apiPersonagens.find((p) => p.id === id)
    if (personagem) {
      setEditingPersonagem(personagem)
      setShowPersonagemForm(true)
    }
  }

  const handleNovoPersonagem = () => {
    setEditingPersonagem(null)
    setShowPersonagemForm(true)
  }

  const handleCancelPersonagemForm = () => {
    setShowPersonagemForm(false)
    setEditingPersonagem(null)
  }

  const handleSavePersonagem = async (personagemData: any) => {
    try {
      if (editingPersonagem) {
        // Atualizar personagem existente
        const result = await updateCharacter(editingPersonagem.id, personagemData)

        if (result.success) {
          // Recarregar a lista de personagens após a atualização
          fetchPersonagens(personagensCurrentPage)

          toast({
            title: "✅ Personagem Atualizado",
            description: "O personagem foi atualizado com sucesso.",
            variant: "default",
          })
        } else {
          toast({
            title: "⚠️ Erro",
            description: result.error || "Erro ao atualizar personagem.",
            variant: "destructive",
          })
        }
      } else {
        // Criar novo personagem
        const result = await createCharacter(personagemData)

        if (result.success) {
          // Recarregar a lista de personagens após a criação
          fetchPersonagens(1) // Voltar para a primeira página para ver o novo personagem

          toast({
            title: "✅ Personagem Criado",
            description: "O novo personagem foi criado com sucesso.",
            variant: "default",
          })
        } else {
          toast({
            title: "⚠️ Erro",
            description: result.error || "Erro ao criar personagem.",
            variant: "destructive",
          })
        }
      }

      setShowPersonagemForm(false)
      setEditingPersonagem(null)
    } catch (error) {
      console.error("Erro ao salvar personagem:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    }
  }

  const handlePersonagensPageChange = (page: number) => {
    console.log(`Mudando para a página ${page} de personagens`)
    setPersonagensCurrentPage(page)
    fetchPersonagens(page)
  }

  // Handlers para Conquistas
  const handleEditConquista = (id: string) => {
    const conquista = apiConquistas.find((c) => c.id === id)
    if (conquista) {
      setEditingConquista(conquista)
      setShowConquistaForm(true)
    }
  }

  const handleNovaConquista = () => {
    setEditingConquista(null)
    setShowConquistaForm(true)
  }

  const handleCancelConquistaForm = () => {
    setShowConquistaForm(false)
    setEditingConquista(null)
  }

  const handleSaveConquista = async (conquistaData: any) => {
    try {
      const token = getAuthToken()

      if (!token) {
        throw new Error("Token não encontrado")
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

      console.log("=== SALVANDO CONQUISTA ===")
      console.log("Dados recebidos:", conquistaData)

      // Validar dados antes de enviar
      if (!conquistaData.title || !conquistaData.title.trim()) {
        throw new Error("Título da conquista é obrigatório")
      }

      if (!conquistaData.description || !conquistaData.description.trim()) {
        throw new Error("Descrição da conquista é obrigatória")
      }

      if (!conquistaData.badge || !conquistaData.badge.trim()) {
        throw new Error("Badge da conquista é obrigatório")
      }

      if (!conquistaData.condition || !conquistaData.condition.trim()) {
        throw new Error("Condição da conquista é obrigatória")
      }

      // Preparar o payload conforme o novo formato
      const payload = {
        title: conquistaData.title.trim(),
        description: conquistaData.description.trim(),
        badge: conquistaData.badge.trim(),
        condition: conquistaData.condition.trim(),
        more_than: conquistaData.more_than,
        theme: conquistaData.theme,
      }

      console.log("=== PAYLOAD FINAL ===")
      console.log(
        "URL:",
        editingConquista ? `${API_BASE_URL}/achievements/${editingConquista.id}` : `${API_BASE_URL}/achievements`,
      )
      console.log("Method:", editingConquista ? "PATCH" : "POST")
      console.log("Payload:", JSON.stringify(payload, null, 2))

      const url = editingConquista
        ? `${API_BASE_URL}/achievements/${editingConquista.id}`
        : `${API_BASE_URL}/achievements`

      const method = editingConquista ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      console.log("=== RESPOSTA DA API ===")
      console.log("Status:", response.status)
      console.log("Status Text:", response.statusText)
      console.log("Headers:", Object.fromEntries(response.headers.entries()))

      // Tentar ler a resposta como texto primeiro
      const responseText = await response.text()
      console.log("Response Text:", responseText)

      let data
      try {
        data = responseText ? JSON.parse(responseText) : {}
        console.log("Response JSON:", data)
      } catch (parseError) {
        console.error("Erro ao fazer parse da resposta:", parseError)
        console.error("Response text que causou erro:", responseText)
        throw new Error(`Resposta inválida do servidor (Status ${response.status}): ${responseText}`)
      }

      if (!response.ok) {
        console.error("=== ERRO NA RESPOSTA DA API ===")
        console.error("Status:", response.status)
        console.error("Status Text:", response.statusText)
        console.error("Data:", data)

        // Extrair mensagem de erro mais detalhada
        let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`

        if (data) {
          if (data.error?.message) {
            errorMessage = data.error.message
          } else if (data.message) {
            if (Array.isArray(data.message)) {
              errorMessage = data.message.join(", ")
            } else {
              errorMessage = data.message
            }
          } else if (data.error) {
            errorMessage = typeof data.error === "string" ? data.error : JSON.stringify(data.error)
          } else if (typeof data === "string") {
            errorMessage = data
          }
        }

        // Adicionar informações específicas para erro 400
        if (response.status === 400) {
          console.error("=== ERRO 400 - BAD REQUEST ===")
          console.error("Possíveis causas:")
          console.error("1. Campos obrigatórios faltando")
          console.error("2. Formato de dados incorreto")
          console.error("3. Validação de schema falhou")
          console.error("4. Valores inválidos nos campos")
          console.error("Payload enviado:", payload)

          errorMessage = `Erro de validação (400): ${errorMessage}`
        }

        throw new Error(errorMessage)
      }

      console.log("=== CONQUISTA SALVA COM SUCESSO ===")
      console.log("Dados retornados:", data)

      // Recarregar a lista de conquistas
      if (editingConquista) {
        await fetchConquistas(conquistasCurrentPage)
        toast({
          title: "✅ Conquista Atualizada",
          description: "A conquista foi atualizada com sucesso.",
          variant: "default",
        })
      } else {
        await fetchConquistas(1) // Voltar para a primeira página
        toast({
          title: "✅ Conquista Criada",
          description: "A nova conquista foi criada com sucesso.",
          variant: "default",
        })
      }

      setShowConquistaForm(false)
      setEditingConquista(null)
    } catch (error) {
      console.error("=== ERRO AO SALVAR CONQUISTA ===")
      console.error("Tipo do erro:", typeof error)
      console.error("Erro completo:", error)

      if (error instanceof Error) {
        console.error("Mensagem:", error.message)
        console.error("Stack:", error.stack)
      }

      toast({
        title: "⚠️ Erro ao Salvar",
        description: error instanceof Error ? error.message : "Erro desconhecido ao conectar com o servidor.",
        variant: "destructive",
      })
    }
  }

  // Handlers para Usuários
  const handleEditUsuario = (id: string) => {
    const usuario = apiUsuarios.find((u) => u.id === id)
    if (usuario) {
      setEditingUsuario(usuario)
      setShowUsuarioForm(true)
    }
  }

  const handleNovoUsuario = () => {
    setEditingUsuario(null)
    setShowUsuarioForm(true)
  }

  const handleCancelUsuarioForm = () => {
    setShowUsuarioForm(false)
    setEditingUsuario(null)
  }

  const handleSaveUsuario = async (usuarioData: any) => {
    try {
      if (editingUsuario) {
        // Atualizar usuário existente
        const userData: UserInput = {
          name: usuarioData.nome,
          email: usuarioData.email,
          role: usuarioData.cargo,
        }

        const result = await updateUser(editingUsuario.id, userData)

        if (result.success) {
          // Recarregar a lista de usuários após a atualização
          fetchUsuarios(currentPage)

          toast({
            title: "✅ Usuário Atualizado",
            description: "O usuário foi atualizado com sucesso.",
            variant: "default",
          })
        } else {
          toast({
            title: "⚠️ Erro",
            description: result.error || "Erro ao atualizar usuário.",
            variant: "destructive",
          })
        }
      } else {
        // Criar novo usuário (mock - implementar quando API estiver disponível)
        const newId = Math.random().toString(36).substring(2, 15)
        setApiUsuarios([
          ...apiUsuarios,
          {
            id: newId,
            name: usuarioData.nome,
            email: usuarioData.email,
            avatar: "/placeholder.svg?height=40&width=40",
            points: 0,
            role: usuarioData.cargo,
            gamerole: {
              id: "1",
              title: "Iniciante",
              points_to_achieve: 0,
            },
          },
        ])
        toast({
          title: "✅ Usuário Criado",
          description: "O novo usuário foi criado com sucesso.",
          variant: "default",
        })
      }

      setShowUsuarioForm(false)
      setEditingUsuario(null)
    } catch (error) {
      console.error("Erro ao salvar usuário:", error)
      toast({
        title: "⚠️ Erro",
        description: "Erro ao conectar com o servidor.",
        variant: "destructive",
      })
    }
  }

  const handleViewUsuarioReport = (id: string) => {
    const usuario = apiUsuarios.find((u) => u.id === id)
    if (usuario) {
      setSelectedUsuario(usuario)
      setShowUsuarioReport(true)
    }
  }

  const handleCloseUsuarioReport = () => {
    setShowUsuarioReport(false)
    setSelectedUsuario(null)
  }

  const handleRankingPageChange = (page: number) => {
    setRankingCurrentPage(page)
    fetchRanking(page)
  }

  const handleUsuariosPageChange = (page: number) => {
    setCurrentPage(page)
    fetchUsuarios(page)
  }

  const handleConquistasPageChange = (page: number) => {
    console.log(`Mudando para a página ${page} de conquistas`)
    setConquistasCurrentPage(page)
    fetchConquistas(page)
  }

  // Função para renderizar o conteúdo com base no item ativo
  const renderContent = () => {
    switch (activeItem) {
      case "home":
        return (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-[#3FA110]">Dashboard</h1>
              <Button
                onClick={handleDownloadRankingCSV}
                disabled={isDownloadingRanking}
                className="bg-[#3FA110] hover:bg-[#2d7a0c] text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
              >
                {isDownloadingRanking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Baixando...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Baixar Ranking CSV
                  </>
                )}
              </Button>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <RankingTable
                users={rankingUsers}
                isLoading={isLoadingRanking}
                currentPage={rankingCurrentPage}
                totalPages={rankingTotalPages}
                onPageChange={handleRankingPageChange}
              />
              <StatsCards cards={statsCards} />
            </div>
          </div>
        )
      case "perguntas":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#3FA110] mb-8">Perguntas</h1>
            {showPerguntaForm ? (
              <NovaPerguntaForm
                onCancel={handleCancelPerguntaForm}
                onSave={handleSavePergunta}
                temas={apiTemas.map((tema) => ({ id: tema.id, titulo: tema.title }))}
                locais={apiDepartamentos.map((dept) => ({ id: dept.id, nome: dept.title }))}
                personagens={apiPersonagens.map((personagem) => ({
                  id: personagem.id,
                  nome: personagem.name,
                }))}
                semanas={apiSemanas.map((semana) => ({ id: semana.id, titulo: semana.title }))}
                editingPergunta={editingPergunta}
                isEditing={!!editingPergunta}
              />
            ) : (
              <>
                <NovaPerguntaButton onClick={handleNovaPergunta} />
                <PerguntasList
                  perguntas={apiPerguntas}
                  onEdit={handleEditPergunta}
                  onDelete={handleDeletePergunta}
                  currentPage={perguntasCurrentPage}
                  totalPages={perguntasTotalPages}
                  onPageChange={handlePerguntasPageChange}
                  isLoading={isLoadingPerguntas}
                />
              </>
            )}
          </div>
        )
      case "semanas":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#3FA110] mb-8">Semanas</h1>
            {showSemanaForm ? (
              <NovaSemanaForm
                onCancel={handleCancelSemanaForm}
                onSave={handleSaveSemana}
                editingSemana={editingSemana}
                isEditing={!!editingSemana}
              />
            ) : (
              <>
                <NovaSemanaButton onClick={handleNovaSemana} />
                <SemanasList
                  semanas={apiSemanas}
                  onEdit={handleEditSemana}
                  onDelete={handleDeleteSemana}
                  currentPage={semanasCurrentPage}
                  totalPages={semanasTotalPages}
                  onPageChange={handleSemanasPageChange}
                  isLoading={isLoadingSemanas}
                />
              </>
            )}
          </div>
        )
      case "tema":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#3FA110] mb-8">Temas</h1>
            {showTemaForm ? (
              <NovoTemaForm
                onCancel={handleCancelTemaForm}
                onSave={handleSaveTema}
                editingTema={editingTema}
                isEditing={!!editingTema}
              />
            ) : (
              <>
                <NovoTemaButton onClick={handleNovoTema} />
                <TemasList
                  temas={apiTemas}
                  onEdit={handleEditTema}
                  onDelete={handleDeleteTema}
                  currentPage={temasCurrentPage}
                  totalPages={temasTotalPages}
                  onPageChange={handleTemasPageChange}
                  isLoading={isLoadingTemas}
                />
              </>
            )}
          </div>
        )
      case "personagens":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#3FA110] mb-8">Personagens</h1>
            {showPersonagemForm ? (
              <NovoPersonagemForm
                onCancel={handleCancelPersonagemForm}
                onSave={handleSavePersonagem}
                editingPersonagem={editingPersonagem}
                isEditing={!!editingPersonagem}
              />
            ) : (
              <>
                <NovoPersonagemButton onClick={handleNovoPersonagem} />
                <PersonagensList
                  personagens={apiPersonagens}
                  onEdit={handleEditPersonagem}
                  onDelete={handleDeletePersonagem}
                  currentPage={personagensCurrentPage}
                  totalPages={personagensTotalPages}
                  onPageChange={handlePersonagensPageChange}
                  isLoading={isLoadingPersonagens}
                />
              </>
            )}
          </div>
        )
      case "conquistas":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#3FA110] mb-8">Conquistas</h1>
            {showConquistaForm ? (
              <NovaConquistaForm
                onCancel={handleCancelConquistaForm}
                onSave={handleSaveConquista}
                editingConquista={editingConquista}
                isEditing={!!editingConquista}
              />
            ) : (
              <>
                <NovaConquistaButton onClick={handleNovaConquista} />
                <ConquistasList
                  conquistas={apiConquistas}
                  onEdit={handleEditConquista}
                  onDelete={handleDeleteConquista}
                  currentPage={conquistasCurrentPage}
                  totalPages={conquistasTotalPages}
                  onPageChange={handleConquistasPageChange}
                  isLoading={isLoadingConquistas}
                />
              </>
            )}
          </div>
        )
      case "usuarios":
        return (
          <div className="p-4">
            {showUsuarioForm ? (
              <NovoUsuarioForm
                onCancel={handleCancelUsuarioForm}
                onSave={handleSaveUsuario}
                editingUsuario={editingUsuario}
                isEditing={!!editingUsuario}
              />
            ) : showUsuarioReport && selectedUsuario ? (
              <>
                <div className="w-full max-w-[1400px] mb-8 flex justify-end">
                  <button
                    onClick={handleCloseUsuarioReport}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg flex items-center gap-2 text-base"
                  >
                    Voltar para a lista
                  </button>
                </div>
                <RelatorioUsuarioDetalhado
                  usuario={{
                    id: selectedUsuario.id,
                    nome: selectedUsuario.name,
                    cargo: selectedUsuario.gamerole?.title || "Usuário",
                    avatar: selectedUsuario.avatar,
                  }}
                />
              </>
            ) : (
              <UsuariosList
                usuarios={apiUsuarios}
                onEdit={handleEditUsuario}
                onDelete={handleDeleteUsuario}
                onViewReport={handleViewUsuarioReport}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handleUsuariosPageChange}
                isLoading={isLoadingUsuarios}
              />
            )}
          </div>
        )
      default:
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#3FA110]">Página não encontrada</h1>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeItem={activeItem}
        onNavigate={(item) => setActiveItem(item)}
        isMobile={false}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-80">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} user={user} />

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-100">{renderContent()}</main>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#3FA110]">Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Tem certeza que deseja excluir{" "}
              {itemToDelete?.title ? `"${itemToDelete.title}"` : `este(a) ${itemToDelete?.type}`}?
              <br />
              <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
