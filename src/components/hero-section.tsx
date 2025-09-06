import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Star, DollarSign, Flame } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            🎮 대한민국 최대 PC방 리뷰 플랫폼 🎮
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            내 주변 PC방, 리뷰로 먼저 확인하고 가자!
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="어떤 PC방을 찾고 계신가요?" 
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button className="h-12 px-8 text-lg bg-blue-600 hover:bg-blue-700">
              검색하기
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>내 근처 PC방</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>인기 매장</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>가성비 매장</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Flame className="w-4 h-4" />
            <span>신규 매장</span>
          </Button>
        </div>
      </div>
    </section>
  )
}