import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { signUp } from "@/app/(auth)/actions"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

interface RegisterPageProps {
  searchParams: SearchParams
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams
  const error = params.error as string
  const message = params.message as string

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-md mx-2 sm:mx-0">
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4 hover:opacity-80 transition-opacity">
            <span className="text-2xl sm:text-3xl">🎮</span>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">PC방.리뷰</h1>
          </Link>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">회원가입</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">새 계정을 만드세요</p>
        </div>

        <Card>
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-center text-lg sm:text-xl">회원가입</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            <form action={signUp} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  이름
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  className="h-11 sm:h-10"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  이메일
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  className="h-11 sm:h-10"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="h-11 sm:h-10"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 mr-2 mt-1" 
                  required 
                />
                <span className="text-sm text-gray-600">
                  <Link href="/terms" className="text-blue-600 hover:underline">이용약관</Link>과{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">개인정보처리방침</Link>에 동의합니다.
                </span>
              </div>

              <Button type="submit" className="w-full h-11 sm:h-10">
                회원가입
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                이미 계정이 있으신가요?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  로그인
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}