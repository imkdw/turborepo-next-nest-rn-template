import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingUp } from "lucide-react"

export default function RegionQuickAccess() {
  const regions = [
    { name: "서울", count: 1247, trend: "hot" },
    { name: "경기", count: 892, trend: "normal" },
    { name: "부산", count: 345, trend: "rising" },
    { name: "대구", count: 234, trend: "normal" },
    { name: "인천", count: 198, trend: "normal" },
    { name: "광주", count: 156, trend: "normal" },
    { name: "대전", count: 143, trend: "rising" },
    { name: "울산", count: 87, trend: "normal" }
  ]

  const seoulDistricts = [
    { name: "강남구", count: 127 },
    { name: "서초구", count: 98 },
    { name: "마포구", count: 89 },
    { name: "강서구", count: 76 },
    { name: "송파구", count: 65 },
    { name: "관악구", count: 54 }
  ]

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <span>📍</span>
                <span>지역별 PC방 현황</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {regions.map((region, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-3 sm:p-4 flex flex-col items-center space-y-1 sm:space-y-2 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className="font-semibold text-sm sm:text-base">{region.name}</span>
                      {region.trend === "hot" && (
                        <Badge className="bg-red-500 text-white text-xs">🔥</Badge>
                      )}
                      {region.trend === "rising" && (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{region.count}개 매장</div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <span>🏢</span>
                <span>서울 구별 인기 지역</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {seoulDistricts.map((district, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <MapPin className="w-3 sm:w-4 h-3 sm:h-4 text-blue-500" />
                      <span className="font-medium text-sm sm:text-base">{district.name}</span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {district.count}개 매장
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 sm:mt-6 text-center">
                <Button variant="outline" size="sm" className="text-sm">
                  서울 전체 구 보기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}