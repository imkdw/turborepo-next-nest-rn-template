"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, MapPin, TrendingUp, Menu, X } from "lucide-react"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 햄버거 메뉴 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* 모바일 메뉴 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 메뉴 패널 */}
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎮</span>
                <h1 className="text-lg font-bold text-blue-600">PC방.리뷰</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <nav className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start space-x-2">
                <Search className="w-4 h-4" />
                <span>매장검색</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start space-x-2">
                <MapPin className="w-4 h-4" />
                <span>지역별</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>실시간현황</span>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}