import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, MessageCircle, Users, Zap } from "lucide-react"

export default function CommunityFeatures() {
  const recentReviews = [
    {
      user: "게이머123",
      shop: "옵티멈존 강남점",
      rating: 5,
      comment: "사양 진짜 좋고 음식도 맛있어요",
      time: "2분 전",
      isNew: true
    },
    {
      user: "프로게이머",
      shop: "PC플러스 홍대점",
      rating: 4,
      comment: "접근성이 좋아서 자주 가는 곳",
      time: "5분 전",
      isNew: true
    },
    {
      user: "롤러",
      shop: "게임존 신촌점",
      rating: 5,
      comment: "144Hz 모니터 진짜 좋음",
      time: "8분 전",
      isNew: false
    }
  ]

  const chatRooms = [
    { region: "강남", members: 234, active: true, lastMessage: "누가 같이 롤할 사람?" },
    { region: "홍대", members: 189, active: true, lastMessage: "홍대 어느 PC방이 좋나요?" },
    { region: "신촌", members: 156, active: false, lastMessage: "오늘 할인하는 곳 있나요?" },
    { region: "건대", members: 145, active: true, lastMessage: "배그 같이 하실분?" }
  ]

  const notifications = [
    {
      type: "seat",
      icon: "🪑",
      title: "옵티멈존 강남점",
      message: "빈자리 10석 발생",
      time: "방금 전",
      urgent: true
    },
    {
      type: "discount",
      icon: "💰",
      title: "게임존 홍대점",
      message: "심야 시간 20% 할인 시작",
      time: "3분 전",
      urgent: false
    },
    {
      type: "party",
      icon: "👥",
      title: "강남 지역 채팅방",
      message: "롤 랭크 파티 모집 중",
      time: "5분 전",
      urgent: false
    }
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">💬 커뮤니티</h2>
          <p className="text-gray-600">실시간으로 소통하고 정보를 공유해보세요</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 실시간 리뷰 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>실시간 리뷰</span>
                <Badge className="bg-red-500 text-white text-xs">LIVE</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{review.user}</span>
                          {review.isNew && (
                            <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{review.shop}</div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                          ))}
                        </div>
                        <p className="text-sm">{review.comment}</p>
                        <div className="text-xs text-gray-500 mt-1">{review.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                더 많은 리뷰 보기
              </Button>
            </CardContent>
          </Card>

          {/* 지역별 채팅방 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>지역별 채팅방</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chatRooms.map((room, index) => (
                  <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{room.region} 지역</span>
                        {room.active && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{room.members}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                채팅방 더보기
              </Button>
            </CardContent>
          </Card>

          {/* 실시간 알림 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>실시간 알림</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div key={index} className={`p-3 border rounded-lg transition-colors ${
                    notification.urgent ? 'border-red-200 bg-red-50' : 'hover:bg-gray-50'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{notification.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{notification.title}</span>
                          {notification.urgent && (
                            <Badge className="bg-red-500 text-white text-xs">긴급</Badge>
                          )}
                        </div>
                        <p className="text-sm">{notification.message}</p>
                        <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                알림 설정
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}