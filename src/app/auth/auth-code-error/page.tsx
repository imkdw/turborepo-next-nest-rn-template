import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🎮</span>
            <h1 className="text-2xl font-bold text-blue-600">PC방.리뷰</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">인증 오류</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-600">인증에 실패했습니다</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              인증 링크가 만료되었거나 유효하지 않습니다.
            </p>
            <p className="text-sm text-gray-500">
              새로운 인증 이메일을 요청해 주세요.
            </p>
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full">로그인 페이지로 이동</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="w-full">회원가입 페이지로 이동</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}