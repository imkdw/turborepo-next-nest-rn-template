import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function RealtimeDashboard() {
  const gameStats = [
    { name: "리그 오브 레전드", players: 4231, percentage: 89 },
    { name: "배틀그라운드", players: 1847, percentage: 38 },
    { name: "오버워치 2", players: 1205, percentage: 25 }
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔥</span>
              <span>지금 이 순간 PC방 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2,847개</div>
                <div className="text-gray-600">📊 전국 등록 매장</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12,394명</div>
                <div className="text-gray-600">🔥 현재 이용자</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">8,921개</div>
                <div className="text-gray-600">⭐ 이번 달 리뷰</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">156개</div>
                <div className="text-gray-600">💬 활성 채팅방</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">📈 실시간 인기 게임:</h3>
              <div className="space-y-4">
                {gameStats.map((game, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 w-48">
                      <span className="text-lg">{index + 1}️⃣</span>
                      <span className="font-medium">{game.name}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">({game.players.toLocaleString()}명)</span>
                        <span className="text-sm font-medium">{game.percentage}%</span>
                      </div>
                      <Progress value={game.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}