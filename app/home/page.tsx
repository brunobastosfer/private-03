"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Componentes
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { RankingTable } from "@/components/ranking/ranking-table"
import { StatsCards } from "@/components/ranking/stats-cards"
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
import { NovoUsuarioButton } from "@/components/usuarios/novo-usuario-button"
import { NovoUsuarioForm } from "@/components/usuarios/novo-usuario-form"
import { RelatorioUsuario } from "@/components/usuarios/relatorio-usuario"
import { Toaster } from "@/components/ui/toaster"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

// Dados
import {
  rankingData as initialRankingData,
  statsCards,
  perguntasData as initialPerguntasData,
  semanasData as initialSemanasData,
  temasData as initialTemasData,
  personagensData as initialPersonagensData,
  conquistasData as initialConquistasData,
  usuariosData as initialUsuariosData,
  relatoriosUsuarios,
  locaisData,
} from "@/data/mock-data"

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [activeItem, setActiveItem] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Estados para formulários
  const [showPerguntaForm, setShowPerguntaForm] = useState(false)
  const [showSemanaForm, setShowSemanaForm] = useState(false)
  const [showTemaForm, setShowTemaForm] = useState(false)
  const [showPersonagemForm, setShowPersonagemForm] = useState(false)
  const [showConquistaForm, setShowConquistaForm] = useState(false)
  const [showUsuarioForm, setShowUsuarioForm] = useState(false)

  // Estados para edição
  const [editingPergunta, setEditingPergunta] = useState<any>(null)
  const [editingSemana, setEditingSemana] = useState<any>(null)
  const [editingTema, setEditingTema] = useState<any>(null)
  const [editingPersonagem, setEditingPersonagem] = useState<any>(null)
  const [editingConquista, setEditingConquista] = useState<any>(null)
  const [editingUsuario, setEditingUsuario] = useState<any>(null)

  // Estados para relatório de usuário
  const [showUsuarioReport, setShowUsuarioReport] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null)

  // Estados para os dados mockados
  const [perguntasData, setPerguntasData] = useState(initialPerguntasData)
  const [semanasData, setSemanasData] = useState(initialSemanasData)
  const [temasData, setTemasData] = useState(initialTemasData)
  const [personagensData, setPersonagensData] = useState(initialPersonagensData)
  const [conquistasData, setConquistasData] = useState(initialConquistasData)
  const [usuariosData, setUsuariosData] = useState(initialUsuariosData)
  const [rankingData, setRankingData] = useState(initialRankingData)

  // Função para atualizar perguntas quando dados relacionados mudarem
  const updateRelatedPerguntasData = (type: string, oldValue: string, newValue: string, additionalData?: any) => {
    console.log(`Atualizando perguntas: ${type}, de "${oldValue}" para "${newValue}"`, additionalData)

    setPerguntasData((prevPerguntas) =>
      prevPerguntas.map((pergunta) => {
        if (type === "tema" && pergunta.tema === oldValue) {
          console.log(`Pergunta encontrada para atualizar: ${pergunta.titulo}`)

          // Se estamos atualizando um tema e temos dados adicionais (pontos)
          if (additionalData && additionalData.pontos !== undefined) {
            return {
              ...pergunta,
              tema: newValue, // Atualiza o título do tema
              pontos: additionalData.pontos, // Atualiza os pontos da pergunta para serem iguais aos do tema
            }
          }
          // Mesmo se não tivermos dados adicionais, atualizamos o título do tema
          return { ...pergunta, tema: newValue }
        }
        return pergunta
      }),
    )
  }

  // Função para remover referências quando dados relacionados forem excluídos
  const removeRelatedPerguntasData = (type: string, value: string) => {
    setPerguntasData((prevPerguntas) =>
      prevPerguntas.map((pergunta) => {
        if (type === "tema" && pergunta.tema === value) {
          return { ...pergunta, tema: "Tema removido" }
        }
        return pergunta
      }),
    )
  }

  // Funções para excluir itens
  const handleDeletePergunta = (id: number) => {
    toast({
      title: "⚠️ Confirmar Exclusão",
      description: "Tem certeza que deseja excluir esta pergunta? Esta ação não pode ser desfeita.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Confirmar exclusão"
          onClick={() => {
            setPerguntasData(perguntasData.filter((pergunta) => pergunta.id !== id))
            toast({
              title: "✅ Pergunta Excluída",
              description: "A pergunta foi excluída com sucesso.",
              variant: "default",
            })
          }}
        >
          Confirmar
        </ToastAction>
      ),
    })
  }

  const handleDeleteSemana = (id: number) => {
    const semana = semanasData.find((s) => s.id === id)
    toast({
      title: "⚠️ Confirmar Exclusão",
      description: "Tem certeza que deseja excluir esta semana? Esta ação não pode ser desfeita.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Confirmar exclusão"
          onClick={() => {
            if (semana) {
              removeRelatedPerguntasData("semana", semana.titulo)
            }
            setSemanasData(semanasData.filter((s) => s.id !== id))
            toast({
              title: "✅ Semana Excluída",
              description: "A semana foi excluída com sucesso.",
              variant: "default",
            })
          }}
        >
          Confirmar
        </ToastAction>
      ),
    })
  }

  const handleDeleteTema = (id: number) => {
    const tema = temasData.find((t) => t.id === id)
    toast({
      title: "⚠️ Confirmar Exclusão",
      description: "Tem certeza que deseja excluir este tema? Esta ação não pode ser desfeita.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Confirmar exclusão"
          onClick={() => {
            if (tema) {
              removeRelatedPerguntasData("tema", tema.titulo)
            }
            setTemasData(temasData.filter((t) => t.id !== id))
            toast({
              title: "✅ Tema Excluído",
              description: "O tema foi excluído com sucesso.",
              variant: "default",
            })
          }}
        >
          Confirmar
        </ToastAction>
      ),
    })
  }

  const handleDeletePersonagem = (id: number) => {
    const personagem = personagensData.find((p) => p.id === id)
    toast({
      title: "⚠️ Confirmar Exclusão",
      description: "Tem certeza que deseja excluir este personagem? Esta ação não pode ser desfeita.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Confirmar exclusão"
          onClick={() => {
            if (personagem) {
              removeRelatedPerguntasData("personagem", personagem.nome)
            }
            setPersonagensData(personagensData.filter((p) => p.id !== id))
            toast({
              title: "✅ Personagem Excluído",
              description: "O personagem foi excluído com sucesso.",
              variant: "default",
            })
          }}
        >
          Confirmar
        </ToastAction>
      ),
    })
  }

  const handleDeleteConquista = (id: number) => {
    toast({
      title: "⚠️ Confirmar Exclusão",
      description: "Tem certeza que deseja excluir esta conquista? Esta ação não pode ser desfeita.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Confirmar exclusão"
          onClick={() => {
            setConquistasData(conquistasData.filter((conquista) => conquista.id !== id))
            toast({
              title: "✅ Conquista Excluída",
              description: "A conquista foi excluída com sucesso.",
              variant: "default",
            })
          }}
        >
          Confirmar
        </ToastAction>
      ),
    })
  }

  const handleDeleteUsuario = (id: number) => {
    toast({
      title: "⚠️ Confirmar Exclusão",
      description: "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.",
      variant: "destructive",
      action: (
        <ToastAction
          altText="Confirmar exclusão"
          onClick={() => {
            setUsuariosData(usuariosData.filter((usuario) => usuario.id !== id))
            toast({
              title: "✅ Usuário Excluído",
              description: "O usuário foi excluído com sucesso.",
              variant: "default",
            })
          }}
        >
          Confirmar
        </ToastAction>
      ),
    })
  }

  const handleLogout = () => {
    router.push("/")
  }

  // Handlers para Perguntas
  const handleEditPergunta = (id: number) => {
    const pergunta = perguntasData.find((p) => p.id === id)
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

  const handleSavePergunta = (perguntaData: any) => {
    if (editingPergunta) {
      const temaEncontrado = temasData.find((t) => t.id.toString() === perguntaData.tema)
      const perguntaAtualizada = {
        ...editingPergunta,
        introducao: perguntaData.introducao,
        descricao: perguntaData.pergunta,
        tema: temaEncontrado ? temaEncontrado.titulo : editingPergunta.tema,
        pontos: temaEncontrado ? temaEncontrado.pontos : editingPergunta.pontos, // Usar os pontos do tema
        respostas: perguntaData.respostas,
        local: perguntaData.local,
        personagem: perguntaData.personagem,
        semana: perguntaData.semana,
      }

      setPerguntasData(perguntasData.map((p) => (p.id === editingPergunta.id ? perguntaAtualizada : p)))
      toast({
        title: "✅ Pergunta Atualizada",
        description: "A pergunta foi atualizada com sucesso.",
        variant: "default",
      })
    } else {
      const temaEncontrado = temasData.find((t) => t.id.toString() === perguntaData.tema)
      const novaPergunta = {
        id: Math.max(...perguntasData.map((p) => p.id)) + 1,
        titulo: `Pergunta #${perguntasData.length + 1}`,
        descricao: perguntaData.pergunta,
        tema: temaEncontrado ? temaEncontrado.titulo : "Sem tema",
        porcentagem: Math.floor(Math.random() * 100),
        pontos: temaEncontrado ? temaEncontrado.pontos : 0, // Usar os pontos do tema
        introducao: perguntaData.introducao,
        respostas: perguntaData.respostas,
        local: perguntaData.local,
        personagem: perguntaData.personagem,
        semana: perguntaData.semana,
      }
      setPerguntasData([...perguntasData, novaPergunta])
      toast({
        title: "✅ Pergunta Criada",
        description: "A nova pergunta foi criada com sucesso.",
        variant: "default",
      })
    }
    setShowPerguntaForm(false)
    setEditingPergunta(null)
  }

  // Handlers para Semanas
  const handleEditSemana = (id: number) => {
    const semana = semanasData.find((s) => s.id === id)
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

  const handleSaveSemana = (semanaData: any) => {
    if (editingSemana) {
      const oldTitulo = editingSemana.titulo
      const semanaAtualizada = {
        ...editingSemana,
        titulo: semanaData.titulo,
        dataInicio: semanaData.dataInicio,
        dataFim: semanaData.dataFim,
        tema: semanaData.tema,
        dificuldade: semanaData.dificuldade,
      }

      if (oldTitulo !== semanaData.titulo) {
        updateRelatedPerguntasData("semana", oldTitulo, semanaData.titulo)
      }

      setSemanasData(semanasData.map((s) => (s.id === editingSemana.id ? semanaAtualizada : s)))
      toast({
        title: "✅ Semana Atualizada",
        description: "A semana foi atualizada com sucesso.",
        variant: "default",
      })
    } else {
      const novaSemana = {
        id: Math.max(...semanasData.map((s) => s.id)) + 1,
        titulo: semanaData.titulo,
        dataInicio: semanaData.dataInicio,
        dataFim: semanaData.dataFim,
        tema: semanaData.tema,
        dificuldade: semanaData.dificuldade,
      }
      setSemanasData([...semanasData, novaSemana])
      toast({
        title: "✅ Semana Criada",
        description: "A nova semana foi criada com sucesso.",
        variant: "default",
      })
    }
    setShowSemanaForm(false)
    setEditingSemana(null)
  }

  // Handlers para Temas
  const handleEditTema = (id: number) => {
    const tema = temasData.find((t) => t.id === id)
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

  const handleSaveTema = (temaData: any) => {
    if (editingTema) {
      const oldTitulo = editingTema.titulo
      const oldPontos = editingTema.pontos
      const newPontos = Number.parseInt(temaData.pontos)
      const newTitulo = temaData.titulo

      console.log(`Salvando tema: ${oldTitulo} -> ${newTitulo}, pontos: ${oldPontos} -> ${newPontos}`)

      const temaAtualizado = {
        ...editingTema,
        titulo: newTitulo,
        descricao: temaData.descricao,
        pontos: newPontos,
      }

      // Atualizar o tema primeiro
      setTemasData(temasData.map((t) => (t.id === editingTema.id ? temaAtualizado : t)))

      // Depois atualizar as perguntas relacionadas
      if (oldTitulo !== newTitulo || oldPontos !== newPontos) {
        updateRelatedPerguntasData("tema", oldTitulo, newTitulo, { pontos: newPontos })
      }

      toast({
        title: "✅ Tema Atualizado",
        description: "O tema foi atualizado com sucesso. Perguntas relacionadas também foram atualizadas.",
        variant: "default",
      })
    } else {
      const novoTema = {
        id: Math.max(...temasData.map((t) => t.id)) + 1,
        titulo: temaData.titulo,
        descricao: temaData.descricao,
        pontos: Number.parseInt(temaData.pontos),
      }
      setTemasData([...temasData, novoTema])
      toast({
        title: "✅ Tema Criado",
        description: "O novo tema foi criado com sucesso.",
        variant: "default",
      })
    }
    setShowTemaForm(false)
    setEditingTema(null)
  }

  // Handlers para Personagens
  const handleEditPersonagem = (id: number) => {
    const personagem = personagensData.find((p) => p.id === id)
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

  const handleSavePersonagem = (personagemData: any) => {
    if (editingPersonagem) {
      const oldNome = editingPersonagem.nome
      const personagemAtualizado = {
        ...editingPersonagem,
        nome: personagemData.nome,
      }

      if (oldNome !== personagemData.nome) {
        updateRelatedPerguntasData("personagem", oldNome, personagemData.nome)
      }

      setPersonagensData(personagensData.map((p) => (p.id === editingPersonagem.id ? personagemAtualizado : p)))
      toast({
        title: "✅ Personagem Atualizado",
        description: "O personagem foi atualizado com sucesso.",
        variant: "default",
      })
    } else {
      const novoPersonagem = {
        id: Math.max(...personagensData.map((p) => p.id)) + 1,
        nome: personagemData.nome,
      }
      setPersonagensData([...personagensData, novoPersonagem])
      toast({
        title: "✅ Personagem Criado",
        description: "O novo personagem foi criado com sucesso.",
        variant: "default",
      })
    }
    setShowPersonagemForm(false)
    setEditingPersonagem(null)
  }

  // Handlers para Conquistas
  const handleEditConquista = (id: number) => {
    const conquista = conquistasData.find((c) => c.id === id)
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

  const handleSaveConquista = (conquistaData: any) => {
    if (editingConquista) {
      const conquistaAtualizada = {
        ...editingConquista,
        nome: conquistaData.nome,
        imagem: conquistaData.imagem,
      }

      setConquistasData(conquistasData.map((c) => (c.id === editingConquista.id ? conquistaAtualizada : c)))
      toast({
        title: "✅ Conquista Atualizada",
        description: "A conquista foi atualizada com sucesso.",
        variant: "default",
      })
    } else {
      const novaConquista = {
        id: Math.max(...conquistasData.map((c) => c.id)) + 1,
        nome: conquistaData.nome,
        imagem: conquistaData.imagem || "/placeholder.svg?height=48&width=48",
      }
      setConquistasData([...conquistasData, novaConquista])
      toast({
        title: "✅ Conquista Criada",
        description: "A nova conquista foi criada com sucesso.",
        variant: "default",
      })
    }
    setShowConquistaForm(false)
    setEditingConquista(null)
  }

  // Handlers para Usuários
  const handleEditUsuario = (id: number) => {
    const usuario = usuariosData.find((u) => u.id === id)
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

  const handleSaveUsuario = (usuarioData: any) => {
    if (editingUsuario) {
      const usuarioAtualizado = {
        ...editingUsuario,
        nome: usuarioData.nome,
        email: usuarioData.email,
        cargo: usuarioData.cargo,
        status: usuarioData.status,
      }

      setUsuariosData(usuariosData.map((u) => (u.id === editingUsuario.id ? usuarioAtualizado : u)))
      toast({
        title: "✅ Usuário Atualizado",
        description: "O usuário foi atualizado com sucesso.",
        variant: "default",
      })
    } else {
      const novoUsuario = {
        id: Math.max(...usuariosData.map((u) => u.id)) + 1,
        nome: usuarioData.nome,
        email: usuarioData.email,
        cargo: usuarioData.cargo,
        avatar: "/placeholder.svg?height=40&width=40",
        pontos: 0,
        dataIngresso: new Date().toLocaleDateString("pt-BR"),
        status: usuarioData.status,
      }
      setUsuariosData([...usuariosData, novoUsuario])
      toast({
        title: "✅ Usuário Criado",
        description: "O novo usuário foi criado com sucesso.",
        variant: "default",
      })
    }
    setShowUsuarioForm(false)
    setEditingUsuario(null)
  }

  const handleViewUsuarioReport = (id: number) => {
    const usuario = usuariosData.find((u) => u.id === id)
    if (usuario) {
      setSelectedUsuario(usuario)
      setShowUsuarioReport(true)
    }
  }

  const handleNavigation = (itemId: string) => {
    setActiveItem(itemId)
    setSidebarOpen(false)
    // Reset todos os formulários
    setShowPerguntaForm(false)
    setShowSemanaForm(false)
    setShowTemaForm(false)
    setShowPersonagemForm(false)
    setShowConquistaForm(false)
    setShowUsuarioForm(false)
    setShowUsuarioReport(false)
    // Reset todos os estados de edição
    setEditingPergunta(null)
    setEditingSemana(null)
    setEditingTema(null)
    setEditingPersonagem(null)
    setEditingConquista(null)
    setEditingUsuario(null)
    setSelectedUsuario(null)
  }

  const renderContent = () => {
    if (activeItem === "perguntas") {
      if (showPerguntaForm) {
        return (
          <NovaPerguntaForm
            onCancel={handleCancelPerguntaForm}
            onSave={handleSavePergunta}
            temas={temasData}
            locais={locaisData}
            personagens={personagensData}
            semanas={semanasData}
            editingPergunta={editingPergunta}
            isEditing={!!editingPergunta}
          />
        )
      }
      return (
        <>
          <NovaPerguntaButton onClick={handleNovaPergunta} />
          <PerguntasList
            perguntas={perguntasData}
            temas={temasData}
            onEdit={handleEditPergunta}
            onDelete={handleDeletePergunta}
          />
        </>
      )
    }

    if (activeItem === "semanas") {
      if (showSemanaForm) {
        return (
          <NovaSemanaForm
            onCancel={handleCancelSemanaForm}
            onSave={handleSaveSemana}
            editingSemana={editingSemana}
            isEditing={!!editingSemana}
          />
        )
      }
      return (
        <>
          <NovaSemanaButton onClick={handleNovaSemana} />
          <SemanasList semanas={semanasData} onEdit={handleEditSemana} onDelete={handleDeleteSemana} />
        </>
      )
    }

    if (activeItem === "tema") {
      if (showTemaForm) {
        return (
          <NovoTemaForm
            onCancel={handleCancelTemaForm}
            onSave={handleSaveTema}
            editingTema={editingTema}
            isEditing={!!editingTema}
          />
        )
      }
      return (
        <>
          <NovoTemaButton onClick={handleNovoTema} />
          <TemasList temas={temasData} onEdit={handleEditTema} onDelete={handleDeleteTema} />
        </>
      )
    }

    if (activeItem === "personagens") {
      if (showPersonagemForm) {
        return (
          <NovoPersonagemForm
            onCancel={handleCancelPersonagemForm}
            onSave={handleSavePersonagem}
            editingPersonagem={editingPersonagem}
            isEditing={!!editingPersonagem}
          />
        )
      }
      return (
        <>
          <NovoPersonagemButton onClick={handleNovoPersonagem} />
          <PersonagensList
            personagens={personagensData}
            onEdit={handleEditPersonagem}
            onDelete={handleDeletePersonagem}
          />
        </>
      )
    }

    if (activeItem === "conquistas") {
      if (showConquistaForm) {
        return (
          <NovaConquistaForm
            onCancel={handleCancelConquistaForm}
            onSave={handleSaveConquista}
            editingConquista={editingConquista}
            isEditing={!!editingConquista}
          />
        )
      }
      return (
        <>
          <NovaConquistaButton onClick={handleNovaConquista} />
          <ConquistasList conquistas={conquistasData} onEdit={handleEditConquista} onDelete={handleDeleteConquista} />
        </>
      )
    }

    if (activeItem === "usuario-admin") {
      if (showUsuarioReport && selectedUsuario) {
        const atividades = relatoriosUsuarios[selectedUsuario.id] || []
        return <RelatorioUsuario usuario={selectedUsuario} atividades={atividades} />
      }
      if (showUsuarioForm) {
        return (
          <NovoUsuarioForm
            onCancel={handleCancelUsuarioForm}
            onSave={handleSaveUsuario}
            editingUsuario={editingUsuario}
            isEditing={!!editingUsuario}
          />
        )
      }
      return (
        <>
          <NovoUsuarioButton onClick={handleNovoUsuario} />
          <UsuariosList
            usuarios={usuariosData}
            onEdit={handleEditUsuario}
            onDelete={handleDeleteUsuario}
            onViewReport={handleViewUsuarioReport}
          />
        </>
      )
    }

    // Conteúdo padrão (Ranking)
    return (
      <>
        <h1 className="text-2xl md:text-3xl font-bold text-[#3FA110] mb-6 md:mb-8 self-start">Ranking</h1>
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
          <RankingTable users={rankingData} />
          <StatsCards cards={statsCards} />
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:z-auto`}
      >
        <Sidebar
          activeItem={activeItem}
          onNavigate={handleNavigation}
          isMobile={true}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen md:ml-0">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} onLogout={handleLogout} />

        {/* Content */}
        <main className="flex-1 flex flex-col items-center justify-start pt-2 md:pt-4 p-4 md:p-8 overflow-hidden">
          {renderContent()}
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
