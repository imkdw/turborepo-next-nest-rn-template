"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ImageThumbnail from "@/components/ui/image-thumbnail"
import ImageGalleryModal from "@/components/ui/image-gallery-modal"
import { Gamepad2, Clock, DollarSign } from "lucide-react"
import { useState } from "react"

export default function RecommendedService() {
  const [selectedImages, setSelectedImages] = useState<{ src: string; alt: string }[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const gameRecommendations = [
    { 
      game: "리그 오브 레전드", 
      icon: "⚔️", 
      shops: 234, 
      avgPrice: "1,200원/시간",
      features: ["144Hz 모니터", "기계식 키보드", "게이밍 마우스"],
      image: "/images/pcbang/optimum-gangnam.jpg"
    },
    { 
      game: "배틀그라운드", 
      icon: "🔫", 
      shops: 189, 
      avgPrice: "1,500원/시간",
      features: ["고사양 그래픽", "헤드셋 제공", "넓은 화면"],
      image: "/images/pcbang/game-zone-hongdae.jpg"
    },
    { 
      game: "오버워치 2", 
      icon: "🎯", 
      shops: 156, 
      avgPrice: "1,300원/시간",
      features: ["고주사율", "저지연", "RGB 키보드"],
      image: "/images/pcbang/pc-plus-sinchon.jpg"
    }
  ]

  const handleImageClick = (image: string, gameName: string) => {
    setSelectedImages([{ src: image, alt: `${gameName} 추천 PC방` }])
    setIsGalleryOpen(true)
  }

  const timeSlots = [
    { time: "오전 (9AM-12PM)", status: "한산", color: "green", discount: "20% 할인" },
    { time: "오후 (12PM-6PM)", status: "보통", color: "yellow", discount: "10% 할인" },
    { time: "저녁 (6PM-10PM)", status: "혼잡", color: "red", discount: "할인없음" },
    { time: "심야 (10PM-6AM)", status: "한산", color: "green", discount: "15% 할인" }
  ]

  const budgetRanges = [
    { range: "~1,000원", count: 89, type: "저가형" },
    { range: "1,000-1,500원", count: 234, type: "중가형" },
    { range: "1,500-2,000원", count: 156, type: "고가형" },
    { range: "2,000원~", count: 45, type: "프리미엄" }
  ]

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">🎯 맞춤 추천 서비스</h2>
          <p className="text-sm sm:text-base text-gray-600">게임, 시간, 예산에 맞는 최적의 PC방을 찾아보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* 게임별 추천 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Gamepad2 className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>게임별 추천</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {gameRecommendations.map((item, index) => (
                  <div key={index} className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <span className="text-xl sm:text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-sm sm:text-base">{item.game}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{item.shops}개 매장 • {item.avgPrice}</div>
                      </div>
                      <div className="flex-shrink-0">
                        <ImageThumbnail
                          src={item.image}
                          alt={`${item.game} 추천 PC방`}
                          width={60}
                          height={45}
                          onClick={() => handleImageClick(item.image, item.game)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 시간대별 추천 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>시간대별 추천</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="p-3 sm:p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm sm:text-base">{slot.time}</div>
                      <Badge 
                        className={`text-xs sm:text-sm ${
                          slot.color === 'green' ? 'bg-green-100 text-green-800' :
                          slot.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {slot.status}
                      </Badge>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{slot.discount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 예산별 필터 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <DollarSign className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>예산별 필터</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                {budgetRanges.map((budget, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full p-3 sm:p-4 h-auto flex justify-between items-center hover:bg-blue-50"
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm sm:text-base">{budget.range}</div>
                      <div className="text-xs sm:text-sm text-gray-600">{budget.type}</div>
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600 font-medium">
                      {budget.count}개 매장
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 이미지 갤러리 모달 */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={selectedImages}
      />
    </section>
  )
}