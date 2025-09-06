import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, TrendingUp, User } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎮</span>
            <h1 className="text-xl font-bold text-blue-600">PC방.리뷰</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="flex items-center space-x-1">
              <Search className="w-4 h-4" />
              <span>매장검색</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>지역별</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>실시간현황</span>
            </Button>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>로그인</span>
          </Button>
        </div>
      </div>
    </header>
  )
}