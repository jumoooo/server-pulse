import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
        <span className="text-2xl font-bold text-gray-400">404</span>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mt-1.5 text-sm text-gray-400">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </div>
      <Link
        href="/dashboard"
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        대시보드로 돌아가기
      </Link>
    </div>
  );
}
