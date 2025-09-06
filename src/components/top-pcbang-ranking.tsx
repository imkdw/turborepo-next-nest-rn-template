import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, MessageSquare, Trophy } from "lucide-react"

export default function TopPCBangRanking() {
  const topPCBangs = [
    {
      rank: 1,
      emoji: "🥇",
      name: "옵티멈존 강남점",
      rating: 4.8,
      location: "강남구",
      reviews: 324,
      badge: "HOT",
      badgeColor: "bg-red-500",
      comment: "컴퓨터 사양 미쳤고 24시간 운영이라 개꿀..."
    },
    {
      rank: 2,
      emoji: "🥈",
      name: "게임존 홍대점",
      rating: 4.7,
      location: "마포구",
      reviews: 298,
      badge: "NEW",
      badgeColor: "bg-green-500",
      comment: "홍대 한복판에 있어서 접근성 짱, 분위기도 좋음"
    },
    {
      rank: 3,
      emoji: "🥉",
      name: "PC플러스 신촌점",
      rating: 4.6,
      location: "서대문구",
      reviews: 267,
      badge: null,
      badgeColor: "",
      comment: "가격도 저렴하고 음식도 맛있어요!"
    },
    {
      rank: 4,
      emoji: "",
      name: "프로게이머 건대점",
      rating: 4.5,
      location: "광진구",
      reviews: 241,
      badge: null,
      badgeColor: "",
      comment: ""
    },
    {
      rank: 5,
      emoji: "",
      name: "옵티멈존 외대점",
      rating: 4.4,
      location: "동대문구",
      reviews: 233,
      badge: null,
      badgeColor: "",
      comment: ""
    }
  ]

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🏆</span>
              <span>이번 주 인기 매장 TOP 5</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topPCBangs.map((pcbang, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2 min-w-0">
                    {pcbang.emoji && (
                      <span className="text-2xl">{pcbang.emoji}</span>
                    )}
                    <span className="font-semibold text-gray-700">{pcbang.rank}위</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{pcbang.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{pcbang.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{pcbang.location}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <span>{pcbang.reviews}개</span>
                      </div>
                      {pcbang.badge && (
                        <Badge className={`text-white ${pcbang.badgeColor}`}>
                          {pcbang.badge === "HOT" ? "🔥" : "✨"} {pcbang.badge}
                        </Badge>
                      )}
                    </div>
                    {pcbang.comment && (
                      <p className="text-gray-600 italic">"{pcbang.comment}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" className="flex items-center space-x-2 mx-auto">
                <Trophy className="w-4 h-4" />
                <span>전체 랭킹 보기</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}