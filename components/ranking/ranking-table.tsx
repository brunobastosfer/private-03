import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RankingUser {
  id: number
  avatar: string
  nome: string
  cargo: string
  pontos: number
}

interface RankingTableProps {
  users: RankingUser[]
}

export function RankingTable({ users }: RankingTableProps) {
  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 md:p-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-6">
                      <div className="flex items-center justify-between w-full">
                        {/* Left side: Avatar, Nome e Cargo */}
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10 md:h-12 md:w-12">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col md:flex-row md:items-center md:gap-8">
                            <span className="text-base font-medium text-black mb-1 md:mb-0">{user.nome}</span>
                            <span className="text-sm text-[#5A645A]">{user.cargo}</span>
                          </div>
                        </div>

                        {/* Right side: Pontos */}
                        <div className="text-right">
                          <span className="text-base font-medium text-black">{user.pontos}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
