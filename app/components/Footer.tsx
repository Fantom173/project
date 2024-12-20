export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-lg">© 2023 Мои Проекты. Все права защищены.</p>
          <p className="mt-2">
            Свяжитесь со мной:{' '}
            <a 
              href="mailto:example@email.com" 
              className="underline hover:text-gray-200 transition duration-300"
            >
              example@email.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

