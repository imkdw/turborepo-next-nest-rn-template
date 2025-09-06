import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/(auth)/actions'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  const user = data.user

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4 max-w-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl sm:text-3xl">🎮</span>
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">PC방.리뷰</h1>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">프로필</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">사용자 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700">이메일</label>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-md break-all">{user.email}</p>
              </div>
              
              {user.user_metadata?.name && (
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">이름</label>
                  <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-md">{user.user_metadata.name}</p>
                </div>
              )}
              
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700">가입일</label>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-md">
                  {new Date(user.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
              
              <div>
                <label className="text-xs sm:text-sm font-medium text-gray-700">마지막 로그인</label>
                <p className="text-sm sm:text-base text-gray-900 bg-gray-50 p-2 sm:p-3 rounded-md">
                  {user.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleDateString('ko-KR')
                    : '정보 없음'
                  }
                </p>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 border-t space-y-3">
              <div className="flex flex-col gap-3">
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full h-11 sm:h-10">
                    홈으로 돌아가기
                  </Button>
                </Link>
                <form action={signOut} className="w-full">
                  <Button variant="destructive" className="w-full h-11 sm:h-10" type="submit">
                    로그아웃
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            이 페이지는 로그인한 사용자만 접근할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}