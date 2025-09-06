"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ImageThumbnail from "@/components/ui/image-thumbnail"
import ImageGalleryModal from "@/components/ui/image-gallery-modal"
import { Star, MapPin, MessageSquare, Trophy } from "lucide-react"
import { useState } from "react"

export default function TopPCBangRanking() {
  const [selectedImages, setSelectedImages] = useState<{ src: string; alt: string }[]>([])
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

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
      comment: "컴퓨터 사양 미쳤고 24시간 운영이라 개꿀...",
      images: ["/images/pcbang/optimum-gangnam.jpg"]
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
      comment: "홍대 한복판에 있어서 접근성 짱, 분위기도 좋음",
      images: ["/images/pcbang/game-zone-hongdae.jpg"]
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
      comment: "가격도 저렴하고 음식도 맛있어요!",
      images: ["/images/pcbang/pc-plus-sinchon.jpg"]
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
      comment: "",
      images: ["/images/pcbang/pro-gamer-gundae.jpg"]
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
      comment: "",
      images: ["/images/pcbang/optimum-oedae.jpg"]
    }
  ]

  const handleImageClick = (images: string[], pcbangName: string) => {
    const galleryImages = images.map(src => ({ src, alt: pcbangName }))
    setSelectedImages(galleryImages)
    setIsGalleryOpen(true)
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <span>🏆</span>
              <span>이번 주 인기 매장 TOP 5</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 sm:space-y-6">
              {topPCBangs.map((pcbang, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-2 sm:min-w-0">
                    {pcbang.emoji && (
                      <span className="text-xl sm:text-2xl">{pcbang.emoji}</span>
                    )}
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">{pcbang.rank}위</span>
                  </div>
                  
                  {/* 썸네일 이미지 */}
                  <div className="flex-shrink-0">
                    <ImageThumbnail
                      src={pcbang.images[0] || "/images/pcbang/fallback.jpg"}
                      alt={pcbang.name}
                      width={100}
                      height={70}
                      onClick={() => handleImageClick(pcbang.images, pcbang.name)}
                    />
                  </div>
                  
                  <div className="flex-1 sm:min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                      <h3 className="font-semibold text-base sm:text-lg">{pcbang.name}</h3>
                      <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500 fill-current" />
                          <span className="font-medium text-sm sm:text-base">{pcbang.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="text-sm sm:text-base">{pcbang.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-600">
                          <MessageSquare className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span className="text-sm sm:text-base">{pcbang.reviews}개</span>
                        </div>
                        {pcbang.badge && (
                          <Badge className={`text-white text-xs sm:text-sm ${pcbang.badgeColor}`}>
                            {pcbang.badge === "HOT" ? "🔥" : "✨"} {pcbang.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {pcbang.comment && (
                      <p className="text-gray-600 italic text-sm sm:text-base">&ldquo;{pcbang.comment}&rdquo;</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-6 sm:mt-8">
              <Button variant="outline" className="flex items-center space-x-2 mx-auto text-sm sm:text-base px-4 sm:px-6">
                <Trophy className="w-4 h-4" />
                <span>전체 럭킹 보기</span>
              </Button>
            </div>
          </CardContent>
        </Card>
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