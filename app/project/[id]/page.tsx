import Image from 'next/image'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import prisma from '@/lib/prisma'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: PageProps) {
  // Await the params before using them
  const { id } = await params
  
  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    return <div>Проект не найден</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="container mx-auto px-4 py-8">
          <Link 
            href="/" 
            className="inline-block mb-6 text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Вернуться к проектам
          </Link>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">{project.title}</h1>
            <div className="relative w-full mb-6 rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
              <Image 
                src={project.imageUrl} 
                alt={project.title} 
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{project.description}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

