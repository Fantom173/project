import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import AdminPanel from './admin-panel'

export default async function AdminPage() {
  const session = await getServerSession()

  if (!session) {
    redirect('/admin/login')
  }

  return <AdminPanel />
}

