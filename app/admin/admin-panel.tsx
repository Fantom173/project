'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
}

export default function AdminPanel() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот проект?')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Обновляем список проектов после успешного удаления
        setProjects(projects.filter(project => project.id !== id))
        alert('Проект успешно удален')
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при удалении проекта')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Произошла ошибка при удалении проекта')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert('Пожалуйста, выберите изображение')
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setTitle('')
        setDescription('')
        setFile(null)
        fetchProjects() // Обновляем список проектов
        alert('Проект успешно добавлен')
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при создании проекта')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Произошла ошибка при создании проекта')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Админ-панель</h1>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Выйти
            </button>
          </div>

          {/* Форма добавления проекта */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Добавить новый проект</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                  Название проекта
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                  Описание
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
                  Изображение
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Добавление...' : 'Добавить проект'}
              </button>
            </form>
          </div>

          {/* Список проектов */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Список проектов</h2>
            <div className="grid gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col md:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="relative w-full md:w-48 h-32">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
                    <p className="text-gray-600 mt-1">{project.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Удаление...' : 'Удалить'}
                  </button>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-gray-600 text-center py-4">Нет добавленных проектов</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

