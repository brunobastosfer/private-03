import { getAuthToken } from "./auth"

// Get API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

// Interface para semanas
export interface Week {
  id: string
  title: string
  start_date: string
  end_date: string
  bonus: boolean
  difficulty: string
  question?: Question[]
}

// Interface para questões
export interface Question {
  id: string
  title: string
  context: string
  theme_id: string
  department_id: string
  character_id: string
  week_id: string
  answers: Answer[]
  theme: {
    id: string
    title: string
    worth: number
  }
  week: {
    id: string
    title: string
    start_date: string
    end_date: string
    bonus: boolean
    difficulty: string
  }
  department?: {
    id: string
    title: string
  }
  character?: {
    name: string
  }
}

// Interface para respostas
export interface Answer {
  id: string
  text: string
  question_id: string
  correct: boolean
}

// Interface para criar/atualizar semana
export interface WeekInput {
  title: string
  start_date: string
  end_date: string
  bonus: boolean
  difficulty: string
}

// Interface para temas
export interface Theme {
  id: string
  title: string
  worth: number
  questions?: Question[]
}

// Interface para criar/atualizar tema
export interface ThemeInput {
  title: string
  worth: number
}

// Interface para personagens
export interface Character {
  id: string
  name: string
  questions?: Question[]
}

// Interface para criar/atualizar personagem
export interface CharacterInput {
  name: string
}

// Interface para departamentos
export interface Department {
  id: string
  title: string
  created_at: string
  updated_at: string
}

// Interface para criar/atualizar departamento
export interface DepartmentInput {
  title: string
}

// Interface para criar pergunta (ajustada para o formato EXATO da API)
export interface CreateQuestionInput {
  title: string
  context: string
  answers: {
    text: string
    correct: boolean
  }[]
  theme_id: string
  department_id: string
  character_id: string
}

// Interface para usuário
export interface UserInput {
  name: string
  email: string
  role?: string
}

// Função para atualizar um usuário existente
export const updateUser = async (id: string, userData: UserInput) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    console.log("=== ATUALIZANDO USUÁRIO ===")
    console.log("User ID:", id)
    console.log("URL:", `${API_BASE_URL}/users/${id}`)
    console.log("Dados:", userData)

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })

    console.log("Status da resposta:", response.status)

    const data = await response.json()

    if (!response.ok) {
      console.error("Erro ao atualizar usuário:", data)
      throw new Error(data.error?.message || "Erro ao atualizar usuário")
    }

    console.log("=== USUÁRIO ATUALIZADO COM SUCESSO ===")
    return { success: true, data }
  } catch (error) {
    console.error("=== ERRO AO ATUALIZAR USUÁRIO ===")
    console.error("Erro completo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para excluir um usuário
export const deleteUser = async (id: string) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    console.log("=== EXCLUINDO USUÁRIO ===")
    console.log("User ID:", id)
    console.log("URL:", `${API_BASE_URL}/users/${id}`)

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("Status da resposta:", response.status)

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.error("Erro ao excluir usuário:", data)
      throw new Error(data.error?.message || `Erro ao excluir usuário: ${response.status} ${response.statusText}`)
    }

    console.log("=== USUÁRIO EXCLUÍDO COM SUCESSO ===")
    return { success: true }
  } catch (error) {
    console.error("=== ERRO AO EXCLUIR USUÁRIO ===")
    console.error("Erro completo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para download do ranking CSV
export const downloadRankingCSV = async () => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    console.log("=== FAZENDO DOWNLOAD DO RANKING CSV ===")
    console.log("URL:", `${API_BASE_URL}/users/ranking/points?file=csv`)

    // Abrir nova aba para download
    const newTab = window.open("", "_blank")

    if (!newTab) {
      throw new Error("Não foi possível abrir nova aba. Verifique se o bloqueador de pop-ups está desabilitado.")
    }

    const response = await fetch(`${API_BASE_URL}/users/ranking/points?csv=true`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("Status da resposta:", response.status)

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

    console.log("=== DOWNLOAD DO RANKING CSV CONCLUÍDO ===")
    return { success: true }
  } catch (error) {
    console.error("=== ERRO AO FAZER DOWNLOAD DO RANKING CSV ===")
    console.error("Erro completo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para buscar personagens com paginação
export const getCharacters = async (page = 1, perPage = 10) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    console.log(`Buscando personagens: page=${page}, perPage=${perPage}`)

    const response = await fetch(`${API_BASE_URL}/characters?page=${page}&perPage=${perPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao buscar personagens")
    }

    console.log("Resposta da API de personagens:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Erro ao buscar personagens:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para criar um novo personagem
export const createCharacter = async (characterData: CharacterInput) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/characters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(characterData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao criar personagem")
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para atualizar um personagem existente
export const updateCharacter = async (id: string, characterData: CharacterInput) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/characters/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(characterData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao atualizar personagem")
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para excluir um personagem
export const deleteCharacter = async (id: string) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/characters/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error?.message || "Erro ao excluir personagem")
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para buscar temas com paginação
export const getThemes = async (page = 1, perPage = 10) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    console.log(`Buscando temas: page=${page}, perPage=${perPage}`)

    const response = await fetch(`${API_BASE_URL}/themes?page=${page}&perPage=${perPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao buscar temas")
    }

    console.log("Resposta da API de temas:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Erro ao buscar temas:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para criar um novo tema
export const createTheme = async (themeData: ThemeInput) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/themes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(themeData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao criar tema")
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para atualizar um tema existente
export const updateTheme = async (id: string, themeData: ThemeInput) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/themes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(themeData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao atualizar tema")
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para excluir um tema
export const deleteTheme = async (id: string) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/themes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error?.message || "Erro ao excluir tema")
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para buscar semanas com paginação
export const getWeeks = async (page = 1, perPage = 10) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    console.log(`Buscando semanas: page=${page}, perPage=${perPage}`)

    const response = await fetch(`${API_BASE_URL}/week?page=${page}&perPage=${perPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao buscar semanas")
    }

    console.log("Resposta da API de semanas:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Erro ao buscar semanas:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para buscar perguntas com paginação
export const getQuestions = async (page = 1, perPage = 10) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    console.log(`Buscando perguntas: page=${page}, perPage=${perPage}`)

    const response = await fetch(`${API_BASE_URL}/questions?page=${page}&perPage=${perPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao buscar perguntas")
    }

    console.log("Resposta da API de perguntas:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Erro ao buscar perguntas:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para criar uma nova pergunta (FORMATO EXATO CONFORME ESPECIFICADO)
export const createQuestion = async (questionData: CreateQuestionInput & { week_id?: string }) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    // Validar dados antes de enviar
    if (!questionData.title || !questionData.title.trim()) {
      throw new Error("Título da pergunta é obrigatório")
    }

    if (!questionData.context || !questionData.context.trim()) {
      throw new Error("Contexto da pergunta é obrigatório")
    }

    if (!questionData.answers || questionData.answers.length < 2) {
      throw new Error("É necessário pelo menos 2 respostas")
    }

    if (!questionData.theme_id) {
      throw new Error("Tema é obrigatório")
    }

    if (!questionData.department_id) {
      throw new Error("Departamento é obrigatório")
    }

    if (!questionData.character_id) {
      throw new Error("Personagem é obrigatório")
    }

    if (!questionData.week_id) {
      throw new Error("Semana é obrigatória")
    }

    // Verificar se pelo menos uma resposta está marcada como correta
    const hasCorrectAnswer = questionData.answers.some((answer) => answer.correct)
    if (!hasCorrectAnswer) {
      throw new Error("É necessário marcar pelo menos uma resposta como correta")
    }

    // Preparar payload SEM week_id conforme especificado
    const apiPayload = {
      title: questionData.title.trim(),
      context: questionData.context.trim(),
      answers: questionData.answers
        .filter((answer) => answer.text && answer.text.trim()) // Filtrar respostas vazias
        .map((answer) => ({
          text: answer.text.trim(),
          correct: answer.correct,
        })),
      theme_id: questionData.theme_id,
      department_id: questionData.department_id,
      character_id: questionData.character_id,
      // week_id removido do payload inicial
    }

    // Validar se ainda temos respostas suficientes após filtrar
    if (apiPayload.answers.length < 2) {
      throw new Error("É necessário pelo menos 2 respostas válidas")
    }

    // Log dos dados que serão enviados
    console.log("=== CRIANDO PERGUNTA ===")
    console.log("URL:", `${API_BASE_URL}/questions`)
    console.log("Payload EXATO conforme especificado (SEM week_id):")
    console.log(JSON.stringify(apiPayload, null, 2))

    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiPayload),
    })

    // Log da resposta
    console.log("=== RESPOSTA DA API ===")
    console.log("Status:", response.status)
    console.log("Status Text:", response.statusText)

    // Tentar ler a resposta como texto primeiro
    const responseText = await response.text()
    console.log("Resposta (texto):", responseText)

    let data
    try {
      data = JSON.parse(responseText)
      console.log("Resposta (JSON):", data)
    } catch (parseError) {
      console.error("Erro ao fazer parse da resposta:", parseError)
      throw new Error(`Resposta inválida do servidor: ${responseText}`)
    }

    if (!response.ok) {
      // Extrair mensagem de erro mais detalhada
      const errorMessage =
        data?.error?.message ||
        data?.message ||
        data?.error ||
        (Array.isArray(data?.message) ? data.message.join(", ") : "") ||
        `Erro HTTP ${response.status}: ${response.statusText}`

      console.error("Erro da API:", errorMessage)
      console.error("Dados completos do erro:", data)
      throw new Error(errorMessage)
    }

    console.log("=== PERGUNTA CRIADA COM SUCESSO ===")

    // Se a pergunta foi criada com sucesso (status 201) e temos week_id, fazer o PATCH
    if (response.status === 201 && questionData.week_id && data.id) {
      console.log("=== ASSOCIANDO PERGUNTA À SEMANA ===")
      console.log("Question ID:", data.id)
      console.log("Week ID:", questionData.week_id)

      try {
        const patchResponse = await fetch(`${API_BASE_URL}/questions/${data.id}/week/${questionData.week_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!patchResponse.ok) {
          const patchErrorData = await patchResponse.json()
          console.error("Erro ao associar pergunta à semana:", patchErrorData)
          // Não falhar a criação da pergunta se o PATCH falhar
          console.warn("Pergunta criada, mas não foi possível associar à semana")
        } else {
          console.log("=== PERGUNTA ASSOCIADA À SEMANA COM SUCESSO ===")
        }
      } catch (patchError) {
        console.error("Erro no PATCH para associar semana:", patchError)
        // Não falhar a criação da pergunta se o PATCH falhar
        console.warn("Pergunta criada, mas não foi possível associar à semana")
      }
    }

    return { success: true, data }
  } catch (error) {
    console.error("=== ERRO AO CRIAR PERGUNTA ===")
    console.error("Tipo do erro:", typeof error)
    console.error("Erro completo:", error)

    if (error instanceof Error) {
      console.error("Mensagem:", error.message)
      console.error("Stack:", error.stack)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido ao conectar ao servidor",
    }
  }
}

// Função para atualizar uma pergunta existente
export const updateQuestion = async (id: string, questionData: any) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    // Preparar dados no mesmo formato da criação
    const apiPayload = {
      title: questionData.title?.trim(),
      context: questionData.context?.trim(),
      answers: questionData.answers
        ?.filter((answer: any) => answer.text && answer.text.trim())
        .map((answer: any) => ({
          text: answer.text.trim(),
          correct: answer.correct,
        })),
      theme_id: questionData.theme_id,
      department_id: questionData.department_id,
      character_id: questionData.character_id,
      week_id: questionData.week_id,
    }

    console.log("Atualizando pergunta com dados:", apiPayload)

    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(apiPayload),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao atualizar pergunta")
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para excluir uma pergunta
export const deleteQuestion = async (id: string) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    console.log("=== EXCLUINDO PERGUNTA ===")
    console.log("Question ID:", id)
    console.log("URL:", `${API_BASE_URL}/questions/${id}`)

    const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("Status da resposta:", response.status)

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.error("Erro ao excluir pergunta:", data)
      throw new Error(data.error?.message || `Erro ao excluir pergunta: ${response.status} ${response.statusText}`)
    }

    console.log("=== PERGUNTA EXCLUÍDA COM SUCESSO ===")
    return { success: true }
  } catch (error) {
    console.error("=== ERRO AO EXCLUIR PERGUNTA ===")
    console.error("Erro completo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para criar uma nova semana
export const createWeek = async (weekData: WeekInput) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/week`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(weekData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao criar semana")
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para atualizar uma semana existente
export const updateWeek = async (id: string, weekData: WeekInput) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/week/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(weekData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao atualizar semana")
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para excluir uma semana
export const deleteWeek = async (id: string) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    console.log("=== EXCLUINDO SEMANA ===")
    console.log("Semana ID:", id)
    console.log("URL:", `${API_BASE_URL}/week/${id}`)

    const response = await fetch(`${API_BASE_URL}/week/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("Status da resposta:", response.status)

    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      console.error("Erro ao excluir semana:", data)
      throw new Error(data.error?.message || `Erro ao excluir semana: ${response.status} ${response.statusText}`)
    }

    console.log("=== SEMANA EXCLUÍDA COM SUCESSO ===")
    return { success: true }
  } catch (error) {
    console.error("=== ERRO AO EXCLUIR SEMANA ===")
    console.error("Erro completo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Função para buscar departamentos
export async function getDepartments(
  page = 1,
  perPage = 10,
): Promise<{
  success: boolean
  data?: {
    data: Department[]
    page: number
    perPage: number
    count: number
  }
  error?: string
}> {
  try {
    const token = getAuthToken()
    if (!token) {
      return { success: false, error: "Token não encontrado" }
    }

    const response = await fetch(`${API_BASE_URL}/departments?page=${page}&perPage=${perPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error?.message || "Erro ao buscar departamentos" }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Erro ao buscar departamentos:", error)
    return { success: false, error: "Erro ao conectar com o servidor" }
  }
}

// Função para criar departamento
export async function createDepartment(departmentData: DepartmentInput): Promise<{
  success: boolean
  data?: Department
  error?: string
}> {
  try {
    const token = getAuthToken()
    if (!token) {
      return { success: false, error: "Token não encontrado" }
    }

    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(departmentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error?.message || "Erro ao criar departamento" }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Erro ao criar departamento:", error)
    return { success: false, error: "Erro ao conectar com o servidor" }
  }
}

// Função para atualizar departamento
export async function updateDepartment(
  id: string,
  departmentData: DepartmentInput,
): Promise<{
  success: boolean
  data?: Department
  error?: string
}> {
  try {
    const token = getAuthToken()
    if (!token) {
      return { success: false, error: "Token não encontrado" }
    }

    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(departmentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error?.message || "Erro ao atualizar departamento" }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error("Erro ao atualizar departamento:", error)
    return { success: false, error: "Erro ao conectar com o servidor" }
  }
}

// Função para deletar departamento
export async function deleteDepartment(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const token = getAuthToken()
    if (!token) {
      return { success: false, error: "Token não encontrado" }
    }

    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error?.message || "Erro ao deletar departamento" }
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar departamento:", error)
    return { success: false, error: "Erro ao conectar com o servidor" }
  }
}
