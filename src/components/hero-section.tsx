import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Star, DollarSign, Flame } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12 md:py-16 px-4">
      <div className="container mx-auto text-center">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="block sm:inline">🎮 대한민국 최대</span>
            <span className="block sm:inline"> PC방 리뷰 플랫폼 🎮</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
            내 주변 PC방, 리뷰로 먼저 확인하고 가자!
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
              <Input 
                placeholder="어떤 PC방을 찾고 계신가요?" 
                className="pl-9 sm:pl-10 h-11 sm:h-12 text-base sm:text-lg"
              />
            </div>
            <Button className="h-11 sm:h-12 px-6 sm:px-8 text-base sm:text-lg bg-blue-600 hover:bg-blue-700">
              검색하기
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
          <Button variant="outline" className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2">
            <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden xs:inline">내 근처 PC방</span>
            <span className="xs:hidden">근처</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2">
            <Star className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden xs:inline">인기 매장</span>
            <span className="xs:hidden">인기</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2">
            <DollarSign className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden xs:inline">가성비 매장</span>
            <span className="xs:hidden">가성비</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2">
            <Flame className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="hidden xs:inline">신규 매장</span>
            <span className="xs:hidden">신규</span>
          </Button>
        </div>
      </div>
    </section>
  )
}