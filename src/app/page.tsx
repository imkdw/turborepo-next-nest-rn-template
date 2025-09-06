import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import RealtimeDashboard from "@/components/realtime-dashboard"
import TopPCBangRanking from "@/components/top-pcbang-ranking"
import RegionQuickAccess from "@/components/region-quick-access"
import RecommendedService from "@/components/recommended-service"
import CommunityFeatures from "@/components/community-features"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <RealtimeDashboard />
        <TopPCBangRanking />
        <RegionQuickAccess />
        <RecommendedService />
        <CommunityFeatures />
      </main>
      <footer className="bg-gray-900 text-white py-8 sm:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl sm:text-2xl">🎮</span>
                <h3 className="text-base sm:text-lg font-bold">PC방.리뷰</h3>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">
                대한민국 최대 PC방 리뷰 플랫폼
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">서비스</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>매장 검색</li>
                <li>리뷰 작성</li>
                <li>실시간 현황</li>
                <li>커뮤니티</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">지원</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>고객센터</li>
                <li>이용약관</li>
                <li>개인정보처리방침</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">연결</h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
                <li>공식 카카오톡</li>
                <li>공식 디스코드</li>
                <li>인스타그램</li>
                <li>유튜브</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            © 2024 PC방.리뷰. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
