import { getAuthToken, removeAuthToken } from "./auth"

// Get API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

// Helper function for authenticated API requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken()
  if (!token) {
    // If no token, redirect to login immediately.
    window.location.href = "/"
    // Throw an error to stop the execution of the calling function.
    throw new Error("Token de autenticação não encontrado. Redirecionando para o login.")
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    // If unauthorized, remove the invalid token and redirect to login.
    removeAuthToken()
    window.location.href = "/"
    // Throw an error to be caught by the calling function, which can show a toast.
    throw new Error("Sua sessão expirou. Por favor, faça login novamente.")
  }

  return response
}

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
  week_id: string | null // Can be null
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
  } | null // Can be null
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
    const response = await fetchWithAuth(`${API_BASE_URL}/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao atualizar usuário")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para excluir um usuário
export const deleteUser = async (id: string) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/${id}`, { method: "DELETE" })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error?.message || `Erro ao excluir usuário: ${response.status} ${response.statusText}`)
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para download do ranking CSV
export const downloadRankingCSV = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/ranking/points?csv=true`, { method: "GET" })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || `Erro ${response.status}: ${response.statusText}`)
    }
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "ranking.csv"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para buscar personagens com paginação
export const getCharacters = async (page = 1, perPage = 10) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/characters?page=${page}&perPage=${perPage}`, {
      method: "GET",
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao buscar personagens")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para criar um novo personagem
export const createCharacter = async (characterData: CharacterInput) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/characters`, {
      method: "POST",
      body: JSON.stringify(characterData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao criar personagem")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para atualizar um personagem existente
export const updateCharacter = async (id: string, characterData: CharacterInput) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/characters/${id}`, {
      method: "PATCH",
      body: JSON.stringify(characterData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao atualizar personagem")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para excluir um personagem
export const deleteCharacter = async (id: string) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/characters/${id}`, { method: "DELETE" })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error?.message || "Erro ao excluir personagem")
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para buscar temas com paginação
export const getThemes = async (page = 1, perPage = 10) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/themes?page=${page}&perPage=${perPage}`, { method: "GET" })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao buscar temas")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para criar um novo tema
export const createTheme = async (themeData: ThemeInput) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/themes`, {
      method: "POST",
      body: JSON.stringify(themeData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao criar tema")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para atualizar um tema existente
export const updateTheme = async (id: string, themeData: ThemeInput) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/themes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(themeData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao atualizar tema")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para excluir um tema
export const deleteTheme = async (id: string) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/themes/${id}`, { method: "DELETE" })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error?.message || "Erro ao excluir tema")
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para buscar semanas com paginação
export const getWeeks = async (page = 1, perPage = 10) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/week?page=${page}&perPage=${perPage}`, { method: "GET" })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao buscar semanas")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Update the getQuestions function to support search parameter
export const getQuestions = async (page = 1, perPage = 10, weekId?: string, search?: string) => {
  try {
    let url = `${API_BASE_URL}/questions?page=${page}&perPage=${perPage}`

    if (search && search.trim()) {
      // Use search parameter instead of week_id when search is provided
      url += `&search=${encodeURIComponent(search.trim())}`
    } else if (weekId && weekId !== "all") {
      // 'none' will query for questions without a week
      url += `&week_id=${weekId === "none" ? "" : weekId}`
    }

    const response = await fetchWithAuth(url, { method: "GET" })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao buscar perguntas")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para criar uma nova pergunta
export const createQuestion = async (questionData: CreateQuestionInput & { week_id?: string }) => {
  try {
    const apiPayload = {
      title: questionData.title.trim(),
      context: questionData.context.trim(),
      answers: questionData.answers
        .filter((a) => a.text.trim())
        .map((a) => ({ text: a.text.trim(), correct: a.correct })),
      theme_id: questionData.theme_id,
      department_id: questionData.department_id,
      character_id: questionData.character_id,
    }
    const response = await fetchWithAuth(`${API_BASE_URL}/questions`, {
      method: "POST",
      body: JSON.stringify(apiPayload),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao criar pergunta")

    if (response.status === 201 && questionData.week_id && data.id) {
      await associateQuestionToWeek(data.id, questionData.week_id)
    }
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para atualizar uma pergunta (apenas title e context)
export const updateQuestion = async (id: string, questionData: { title?: string; context?: string }) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/questions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(questionData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao atualizar pergunta")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para atualizar uma resposta
export const updateAnswer = async (id: string, answerData: { text: string; correct: boolean }) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/answers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(answerData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao atualizar resposta")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para associar uma pergunta a uma semana
export const associateQuestionToWeek = async (questionId: string, weekId: string) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/questions/${questionId}/week/${weekId}`, { method: "PATCH" })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || "Erro ao associar semana")
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para desassociar uma pergunta de uma semana
export const deleteQuestionWeekAssociation = async (questionId: string) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/questions/${questionId}/week`, { method: "DELETE" })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || "Erro ao desassociar semana")
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para excluir uma pergunta
export const deleteQuestion = async (id: string) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/questions/${id}`, { method: "DELETE" })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error?.message || `Erro ao excluir pergunta: ${response.status} ${response.statusText}`)
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para criar uma nova semana
export const createWeek = async (weekData: WeekInput) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/week`, {
      method: "POST",
      body: JSON.stringify(weekData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao criar semana")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para atualizar uma semana existente
export const updateWeek = async (id: string, weekData: WeekInput) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/week/${id}`, {
      method: "PATCH",
      body: JSON.stringify(weekData),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao atualizar semana")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Função para excluir uma semana
export const deleteWeek = async (id: string) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/week/${id}`, { method: "DELETE" })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error?.message || `Erro ao excluir semana: ${response.status} ${response.statusText}`)
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Funções para Departamentos (CRUD)
export async function getDepartments(page = 1, perPage = 10) {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/departments?page=${page}&perPage=${perPage}`, {
      method: "GET",
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || "Erro ao buscar departamentos")
    }
    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar com o servidor" }
  }
}

// Função para criar departamento
export async function createDepartment(departmentData: DepartmentInput): Promise<{
  success: boolean
  data?: Department
  error?: string
}> {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/departments`, {
      method: "POST",
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
    const response = await fetchWithAuth(`${API_BASE_URL}/departments/${id}`, {
      method: "PATCH",
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
    const response = await fetchWithAuth(`${API_BASE_URL}/departments/${id}`, { method: "DELETE" })
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

// Add new function to get week details with question count
export const getWeekDetails = async (weekId: string) => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/week/${weekId}`, { method: "GET" })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao buscar detalhes da semana")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}

// Add new function to get departments
export const getDepartmentsList = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/departments`, { method: "GET" })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error?.message || "Erro ao buscar departamentos")
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erro ao conectar ao servidor" }
  }
}
