import { Button } from "@/components/ui/button"
import { Search, MapPin, TrendingUp, User, LogOut } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { signOut } from "@/app/(auth)/actions"
import MobileMenu from "./mobile-menu"

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
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
          <MobileMenu />
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 hidden md:block">
                {user.user_metadata?.name || user.email}
              </span>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">프로필</span>
                </Button>
              </Link>
              <form action={signOut}>
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">로그아웃</span>
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">로그인</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}