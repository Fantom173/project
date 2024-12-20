import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    // Получаем информацию о проекте перед удалением
    const project = await prisma.project.findUnique({
      where: { id },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Удаляем файл изображения
    const imagePath = project.imageUrl.replace('/uploads/', '')
    const fullImagePath = path.join(process.cwd(), 'public', 'uploads', imagePath)
    
    try {
      await fs.unlink(fullImagePath)
    } catch (error) {
      console.error('Error deleting image file:', error)
    }

    // Удаляем проект из базы данных
    await prisma.project.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Error deleting project' }, { status: 500 })
  }
}

