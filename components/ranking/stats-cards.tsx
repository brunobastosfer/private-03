interface StatCard {
  title: string
  value: string
}

interface StatsCardsProps {
  cards: StatCard[]
}

export function StatsCards({ cards }: StatsCardsProps) {
  return (
    <div className="w-full lg:w-80">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="flex flex-col justify-between h-28 md:h-32">
              <h3 className="text-sm text-gray-600 text-left leading-relaxed">{card.title}</h3>
              <div className="text-right">
                <span className="text-2xl md:text-3xl font-bold text-[#3FA110]">{card.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
