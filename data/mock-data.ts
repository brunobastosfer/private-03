export const rankingData = [
  {
    id: 1,
    avatar: "/placeholder.svg?height=40&width=40",
    nome: "João Silva",
    cargo: "Desenvolvedor",
    pontos: 1250,
  },
  {
    id: 2,
    avatar: "/placeholder.svg?height=40&width=40",
    nome: "Maria Santos",
    cargo: "Designer",
    pontos: 1180,
  },
  {
    id: 3,
    avatar: "/placeholder.svg?height=40&width=40",
    nome: "Pedro Costa",
    cargo: "Analista",
    pontos: 1050,
  },
  {
    id: 4,
    avatar: "/placeholder.svg?height=40&width=40",
    nome: "Ana Oliveira",
    cargo: "Gerente",
    pontos: 980,
  },
  {
    id: 5,
    avatar: "/placeholder.svg?height=40&width=40",
    nome: "Carlos Lima",
    cargo: "Coordenador",
    pontos: 920,
  },
  {
    id: 6,
    avatar: "/placeholder.svg?height=40&width=40",
    nome: "Fernanda Rocha",
    cargo: "Analista",
    pontos: 890,
  },
]

export const statsCards = [
  {
    title: "Média de acerto por perguntas",
    value: "85%",
  },
  {
    title: "Total de perguntas respondidas",
    value: "247",
  },
  {
    title: "Posição no ranking geral",
    value: "3º",
  },
]

export const temasData = [
  {
    id: 1,
    titulo: "Tema #1",
    descricao: "Cooperativismo e seus princípios fundamentais",
    pontos: 250,
  },
  {
    id: 2,
    titulo: "Tema #2",
    descricao: "Sistema de crédito cooperativo e suas vantagens",
    pontos: 300,
  },
  {
    id: 3,
    titulo: "Tema #3",
    descricao: "Valores e cultura organizacional da Sicredi",
    pontos: 200,
  },
  {
    id: 4,
    titulo: "Tema #4",
    descricao: "Participação nos resultados e distribuição",
    pontos: 350,
  },
  {
    id: 5,
    titulo: "Tema #5",
    descricao: "Governança corporativa e tomada de decisões",
    pontos: 280,
  },
  {
    id: 6,
    titulo: "Tema #6",
    descricao: "Produtos e serviços financeiros oferecidos",
    pontos: 320,
  },
  {
    id: 7,
    titulo: "Tema #7",
    descricao: "Inovação e transformação digital",
    pontos: 400,
  },
  {
    id: 8,
    titulo: "Tema #8",
    descricao: "Sustentabilidade e responsabilidade social",
    pontos: 380,
  },
]

export const perguntasData = [
  {
    id: 1,
    titulo: "Pergunta #1",
    descricao: "Qual é a principal função de um cooperado na Sicredi?",
    tema: "Tema #1", // Referencia o título do tema, não a descrição
    porcentagem: 85,
    pontos: 250, // Agora os pontos são iguais aos do tema
    introducao: "O cooperativismo é um dos pilares fundamentais da Sicredi.",
    respostas: [
      { texto: "Participar das decisões da cooperativa", correta: true },
      { texto: "Apenas utilizar os serviços bancários", correta: false },
      { texto: "Trabalhar na cooperativa", correta: false },
      { texto: "Investir em ações da empresa", correta: false },
    ],
    local: "1",
    personagem: "1",
    semana: "1",
  },
  {
    id: 2,
    titulo: "Pergunta #2",
    descricao: "Como funciona o sistema de crédito cooperativo?",
    tema: "Tema #2", // Referencia o título do tema
    porcentagem: 72,
    pontos: 300, // Agora os pontos são iguais aos do tema
    introducao: "O sistema de crédito cooperativo possui características únicas.",
    respostas: [
      { texto: "Baseado na confiança mútua", correta: true },
      { texto: "Igual ao sistema bancário tradicional", correta: false },
      { texto: "Sem análise de crédito", correta: false },
      { texto: "Apenas para empresas", correta: false },
    ],
    local: "2",
    personagem: "2",
    semana: "2",
  },
  {
    id: 3,
    titulo: "Pergunta #3",
    descricao: "Quais são os valores fundamentais da Sicredi?",
    tema: "Tema #3", // Referencia o título do tema
    porcentagem: 90,
    pontos: 200, // Agora os pontos são iguais aos do tema
    introducao: "Os valores da Sicredi orientam todas as suas ações.",
    respostas: [
      { texto: "Honestidade, transparência e responsabilidade", correta: true },
      { texto: "Lucro, crescimento e expansão", correta: false },
      { texto: "Competitividade e agressividade", correta: false },
      { texto: "Individualismo e autonomia", correta: false },
    ],
    local: "1",
    personagem: "3",
    semana: "3",
  },
  {
    id: 4,
    titulo: "Pergunta #4",
    descricao: "Como é calculada a participação nos resultados?",
    tema: "Tema #4", // Referencia o título do tema
    porcentagem: 65,
    pontos: 350, // Agora os pontos são iguais aos do tema
    introducao: "A distribuição de resultados é uma característica importante das cooperativas.",
    respostas: [
      { texto: "Proporcional ao movimento financeiro do cooperado", correta: true },
      { texto: "Igual para todos os cooperados", correta: false },
      { texto: "Baseado no tempo de cooperado", correta: false },
      { texto: "Não há distribuição de resultados", correta: false },
    ],
    local: "3",
    personagem: "1",
    semana: "4",
  },
  {
    id: 5,
    titulo: "Pergunta #5",
    descricao: "Qual a diferença entre banco e cooperativa de crédito?",
    tema: "Tema #1", // Referencia o título do tema
    porcentagem: 78,
    pontos: 250, // Agora os pontos são iguais aos do tema
    introducao: "Entender as diferenças é fundamental para valorizar o cooperativismo.",
    respostas: [
      { texto: "Cooperativa é sem fins lucrativos", correta: true },
      { texto: "Não há diferença", correta: false },
      { texto: "Banco oferece mais serviços", correta: false },
      { texto: "Cooperativa é mais cara", correta: false },
    ],
    local: "2",
    personagem: "2",
    semana: "1",
  },
  {
    id: 6,
    titulo: "Pergunta #6",
    descricao: "Como funciona o processo de tomada de decisões na cooperativa?",
    tema: "Tema #5", // Referencia o título do tema
    porcentagem: 82,
    pontos: 280, // Agora os pontos são iguais aos do tema
    introducao: "A governança cooperativa é democrática e participativa.",
    respostas: [
      { texto: "Através de assembleias com os cooperados", correta: true },
      { texto: "Decisões tomadas apenas pela diretoria", correta: false },
      { texto: "Por votação online", correta: false },
      { texto: "Não há processo definido", correta: false },
    ],
    local: "1",
    personagem: "3",
    semana: "5",
  },
  {
    id: 7,
    titulo: "Pergunta #7",
    descricao: "Quais são os produtos e serviços oferecidos pela Sicredi?",
    tema: "Tema #6", // Referencia o título do tema
    porcentagem: 88,
    pontos: 320, // Agora os pontos são iguais aos do tema
    introducao: "A Sicredi oferece uma gama completa de produtos financeiros.",
    respostas: [
      { texto: "Conta corrente, poupança, crédito e investimentos", correta: true },
      { texto: "Apenas conta corrente", correta: false },
      { texto: "Somente empréstimos", correta: false },
      { texto: "Apenas investimentos", correta: false },
    ],
    local: "3",
    personagem: "1",
    semana: "6",
  },
  {
    id: 8,
    titulo: "Pergunta #8",
    descricao: "Como é feita a distribuição dos resultados entre os cooperados?",
    tema: "Tema #4", // Referencia o título do tema
    porcentagem: 70,
    pontos: 350, // Agora os pontos são iguais aos do tema
    introducao: "A distribuição de resultados segue princípios cooperativistas.",
    respostas: [
      { texto: "Baseada no relacionamento e movimentação", correta: true },
      { texto: "Dividida igualmente", correta: false },
      { texto: "Apenas para grandes cooperados", correta: false },
      { texto: "Não há distribuição", correta: false },
    ],
    local: "2",
    personagem: "2",
    semana: "4",
  },
]

export const semanasData = [
  {
    id: 1,
    titulo: "Semana #1",
    dataInicio: "11/05/2025",
    dataFim: "17/05/2025",
    tema: "Cooperativismo",
    dificuldade: "Normal",
  },
  {
    id: 2,
    titulo: "Semana #2",
    dataInicio: "18/05/2025",
    dataFim: "24/05/2025",
    tema: "Crédito",
    dificuldade: "Fácil",
  },
  {
    id: 3,
    titulo: "Semana #3",
    dataInicio: "25/05/2025",
    dataFim: "31/05/2025",
    tema: "Valores",
    dificuldade: "Difícil",
  },
  {
    id: 4,
    titulo: "Semana #4",
    dataInicio: "01/06/2025",
    dataFim: "07/06/2025",
    tema: "Resultados",
    dificuldade: "Normal",
  },
  {
    id: 5,
    titulo: "Semana #5",
    dataInicio: "08/06/2025",
    dataFim: "14/06/2025",
    tema: "Governança",
    dificuldade: "Difícil",
  },
  {
    id: 6,
    titulo: "Semana #6",
    dataInicio: "15/06/2025",
    dataFim: "21/06/2025",
    tema: "Produtos",
    dificuldade: "Fácil",
  },
  {
    id: 7,
    titulo: "Semana #7",
    dataInicio: "22/06/2025",
    dataFim: "28/06/2025",
    tema: "Inovação",
    dificuldade: "Normal",
  },
  {
    id: 8,
    titulo: "Semana #8",
    dataInicio: "29/06/2025",
    dataFim: "05/07/2025",
    tema: "Sustentabilidade",
    dificuldade: "Difícil",
  },
]

export const personagensData = [
  {
    id: 1,
    nome: "Personagem 1",
  },
  {
    id: 2,
    nome: "Personagem 2",
  },
  {
    id: 3,
    nome: "Personagem 3",
  },
  {
    id: 4,
    nome: "Personagem 4",
  },
  {
    id: 5,
    nome: "Personagem 5",
  },
  {
    id: 6,
    nome: "Personagem 6",
  },
  {
    id: 7,
    nome: "Personagem 7",
  },
  {
    id: 8,
    nome: "Personagem 8",
  },
]

export const conquistasData = [
  {
    id: 1,
    nome: "Conquista 1",
    imagem: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 2,
    nome: "Conquista 2",
    imagem: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 3,
    nome: "Conquista 3",
    imagem: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 4,
    nome: "Conquista 4",
    imagem: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 5,
    nome: "Conquista 5",
    imagem: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 6,
    nome: "Conquista 6",
    imagem: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 7,
    nome: "Conquista 7",
    imagem: "/placeholder.svg?height=48&width=48",
  },
  {
    id: 8,
    nome: "Conquista 8",
    imagem: "/placeholder.svg?height=48&width=48",
  },
]

export const locaisData = [
  {
    id: 1,
    nome: "Agência Central",
  },
  {
    id: 2,
    nome: "Agência Norte",
  },
  {
    id: 3,
    nome: "Agência Sul",
  },
  {
    id: 4,
    nome: "Agência Leste",
  },
  {
    id: 5,
    nome: "Agência Oeste",
  },
  {
    id: 6,
    nome: "Sede Administrativa",
  },
  {
    id: 7,
    nome: "Centro de Treinamento",
  },
  {
    id: 8,
    nome: "Posto de Atendimento",
  },
]

export const usuariosData = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@sicredi.com",
    cargo: "Desenvolvedor",
    avatar: "/placeholder.svg?height=40&width=40",
    pontos: 1250,
    dataIngresso: "15/03/2024",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria.santos@sicredi.com",
    cargo: "Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    pontos: 1180,
    dataIngresso: "22/01/2024",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Pedro Costa",
    email: "pedro.costa@sicredi.com",
    cargo: "Analista",
    avatar: "/placeholder.svg?height=40&width=40",
    pontos: 1050,
    dataIngresso: "08/05/2024",
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Ana Oliveira",
    email: "ana.oliveira@sicredi.com",
    cargo: "Gerente",
    avatar: "/placeholder.svg?height=40&width=40",
    pontos: 980,
    dataIngresso: "12/02/2024",
    status: "Ativo",
  },
  {
    id: 5,
    nome: "Carlos Lima",
    email: "carlos.lima@sicredi.com",
    cargo: "Coordenador",
    avatar: "/placeholder.svg?height=40&width=40",
    pontos: 920,
    dataIngresso: "30/04/2024",
    status: "Inativo",
  },
  {
    id: 6,
    nome: "Fernanda Rocha",
    email: "fernanda.rocha@sicredi.com",
    cargo: "Analista",
    avatar: "/placeholder.svg?height=40&width=40",
    pontos: 890,
    dataIngresso: "18/06/2024",
    status: "Ativo",
  },
]

export const relatoriosUsuarios = {
  1: [
    {
      id: 1,
      icone: "✅",
      texto: "Respondeu corretamente a pergunta da Semana 3 - Tema: Cooperativismo",
      horario: "2:32 pm",
    },
    {
      id: 2,
      icone: "❌",
      texto: "Errou a pergunta bônus da Semana 2 - Tema: Cultura Organizacional",
      horario: "2:32 pm",
    },
    {
      id: 3,
      icone: "🏅",
      texto: 'Conquistou o selo "Mente Brilhante" por 5 acertos consecutivos',
      horario: "2:32 pm",
    },
    {
      id: 4,
      icone: "🔼",
      texto: "Subiu para a 2ª posição no ranking semanal",
      horario: "2:32 pm",
    },
    {
      id: 5,
      icone: "🎯",
      texto: "Acertou 80% das perguntas da Semana 4",
      horario: "2:32 pm",
    },
    {
      id: 6,
      icone: "📅",
      texto: "Jogou pela primeira vez na plataforma em 22/05/2025",
      horario: "2:32 pm",
    },
    {
      id: 7,
      icone: "🕓",
      texto: "Respondeu todas as perguntas da Semana 1 em menos de 5 minutos",
      horario: "2:32 pm",
    },
    {
      id: 8,
      icone: "🔔",
      texto: "Recebeu notificação de nova rodada de perguntas da Semana 5",
      horario: "2:32 pm",
    },
    {
      id: 9,
      icone: "🏆",
      texto: "Manteve a liderança no ranking por 3 semanas consecutivas",
      horario: "2:32 pm",
    },
  ],
  2: [
    {
      id: 1,
      icone: "✅",
      texto: "Respondeu corretamente a pergunta da Semana 4 - Tema: Resultados",
      horario: "1:45 pm",
    },
    {
      id: 2,
      icone: "🎯",
      texto: "Acertou 95% das perguntas da Semana 3",
      horario: "1:30 pm",
    },
    {
      id: 3,
      icone: "🏅",
      texto: 'Conquistou o selo "Designer Expert" por performance excepcional',
      horario: "12:15 pm",
    },
    {
      id: 4,
      icone: "🔼",
      texto: "Subiu para a 3ª posição no ranking geral",
      horario: "11:20 am",
    },
    {
      id: 5,
      icone: "📅",
      texto: "Completou 30 dias consecutivos jogando",
      horario: "10:00 am",
    },
  ],
  3: [
    {
      id: 1,
      icone: "❌",
      texto: "Errou a pergunta da Semana 5 - Tema: Governança",
      horario: "3:15 pm",
    },
    {
      id: 2,
      icone: "✅",
      texto: "Respondeu corretamente a pergunta da Semana 4 - Tema: Resultados",
      horario: "2:50 pm",
    },
    {
      id: 3,
      icone: "🎯",
      texto: "Acertou 70% das perguntas da Semana 4",
      horario: "2:30 pm",
    },
    {
      id: 4,
      icone: "🔔",
      texto: "Recebeu notificação de nova rodada de perguntas da Semana 6",
      horario: "1:00 pm",
    },
  ],
  4: [
    {
      id: 1,
      icone: "🏆",
      texto: "Alcançou a 1ª posição no ranking mensal",
      horario: "4:20 pm",
    },
    {
      id: 2,
      icone: "✅",
      texto: "Respondeu corretamente a pergunta da Semana 5 - Tema: Governança",
      horario: "3:45 pm",
    },
    {
      id: 3,
      icone: "🏅",
      texto: 'Conquistou o selo "Líder Nato" por liderar equipe',
      horario: "2:10 pm",
    },
    {
      id: 4,
      icone: "🎯",
      texto: "Acertou 100% das perguntas da Semana 5",
      horario: "1:30 pm",
    },
    {
      id: 5,
      icone: "🕓",
      texto: "Respondeu todas as perguntas da Semana 5 em tempo recorde",
      horario: "1:25 pm",
    },
  ],
  5: [
    {
      id: 1,
      icone: "🔔",
      texto: "Recebeu notificação de retorno à plataforma",
      horario: "5:00 pm",
    },
    {
      id: 2,
      icone: "❌",
      texto: "Perdeu sequência de 10 dias consecutivos",
      horario: "9:00 am",
    },
    {
      id: 3,
      icone: "📅",
      texto: "Último acesso há 5 dias",
      horario: "2:30 pm",
    },
  ],
  6: [
    {
      id: 1,
      icone: "✅",
      texto: "Respondeu corretamente a pergunta da Semana 6 - Tema: Produtos",
      horario: "4:10 pm",
    },
    {
      id: 2,
      icone: "🎯",
      texto: "Acertou 85% das perguntas da Semana 6",
      horario: "3:55 pm",
    },
    {
      id: 3,
      icone: "🔼",
      texto: "Subiu 2 posições no ranking semanal",
      horario: "3:30 pm",
    },
    {
      id: 4,
      icone: "🏅",
      texto: 'Conquistou o selo "Analista Dedicado" por consistência',
      horario: "2:45 pm",
    },
    {
      id: 5,
      icone: "📅",
      texto: "Completou primeira semana na plataforma",
      horario: "10:00 am",
    },
  ],
}
