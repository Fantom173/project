import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Создаем уникальное имя файла
    const filename = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    const filepath = path.join(uploadDir, filename)

    // Сохраняем файл
    await writeFile(filepath, buffer)

    // Создаем запись в базе данных
    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl: `/uploads/${filename}`,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error in POST /api/projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

