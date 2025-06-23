// Token constants
const TOKEN_NAME = "sicredi_auth_token"

// Get API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jornada-sicredi-b05e4d9c1032.herokuapp.com"

// Function to set the authentication token in cookies (client-side)
export const setAuthToken = (token: string) => {
  // Set the token with secure flags for security
  // Expires in 1 day
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 1)

  document.cookie = `${TOKEN_NAME}=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`
}

// Function to get the authentication token from cookies (client-side)
export const getAuthToken = (): string | undefined => {
  if (typeof document === "undefined") return undefined

  const cookies = document.cookie.split(";")
  const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith(`${TOKEN_NAME}=`))

  if (tokenCookie) {
    return tokenCookie.split("=")[1]
  }

  return undefined
}

// Function to remove the authentication token (logout)
export const removeAuthToken = () => {
  document.cookie = `${TOKEN_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`
}

// Function to check if the user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken()
  return !!token
}

// Login function that makes the API request
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    console.log("Resposta do login:", data)

    if (!response.ok) {
      // Handle error response
      throw new Error(data.error?.message || "Falha na autenticação")
    }

    // Verificar se o usuário tem role admin
    if (data.role !== "admin") {
      return {
        success: false,
        error: "Você não tem permissão para acessar a plataforma",
      }
    }

    // Return the token on successful login
    return { success: true, token: data.token, role: data.role }
  } catch (error) {
    // Handle network or other errors
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Function to get user profile
export const getUserProfile = async () => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao buscar perfil do usuário")
    }

    return { success: true, user: data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Function to get users with pagination
export const getUsers = async (page = 1, perPage = 10) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/users?page=${page}&perPage=${perPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao buscar usuários")
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Function to get ranking users with pagination (top users by points)
export const getRankingUsers = async (page = 1, perPage = 10) => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    // Buscar mais usuários para poder ordenar e paginar corretamente
    // Vamos buscar até 100 usuários para ter dados suficientes para ordenação
    const response = await fetch(`${API_BASE_URL}/users?page=1&perPage=100`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao buscar ranking")
    }

    // Sort users by points in descending order
    const sortedUsers = data.data.sort((a: any, b: any) => b.points - a.points)

    // Calculate pagination manually
    const totalUsers = sortedUsers.length
    const totalPages = Math.ceil(totalUsers / perPage)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex)

    return {
      success: true,
      data: {
        data: paginatedUsers,
        page: page,
        perPage: perPage,
        count: totalUsers,
        totalPages: totalPages,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}

// Function to get dashboard statistics
export const getDashboardStatistics = async () => {
  try {
    const token = getAuthToken()

    if (!token) {
      throw new Error("Token não encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/dashboard/participants-statistics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro ao buscar estatísticas")
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao conectar ao servidor",
    }
  }
}
