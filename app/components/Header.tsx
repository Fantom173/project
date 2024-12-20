import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-gray-200 transition duration-300">
            Мои Проекты
          </Link>
          <Link 
            href="/admin" 
            className="bg-white text-blue-500 hover:bg-gray-100 px-6 py-2 rounded-full transition duration-300 font-semibold"
          >
            Админ
          </Link>
        </nav>
      </div>
    </header>
  )
}

