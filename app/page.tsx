import Header from './components/Header'
import Footer from './components/Footer'
import ProjectCard from './components/ProjectCard'
import prisma from '@/lib/prisma'

export default async function Home() {
  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Мои Проекты
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

