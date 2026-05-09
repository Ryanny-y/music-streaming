import { Activity, FolderOpen, Music2, Radio, Tags, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

import {
  DataTable,
  EmptyState,
  LoadingState,
  PageHeader,
  SongList,
  StatCard,
  type DataTableColumn,
} from '@/components/common'
import { adminService } from '@/services'
import type { AdminDashboard, Song } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load admin dashboard right now.'
}

export function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    adminService
      .getAdminDashboard()
      .then((adminDashboard) => {
        if (isMounted) {
          setDashboard(adminDashboard)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setDashboard(null)
          setErrorMessage(getErrorMessage(error))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const columns: DataTableColumn<Song>[] = [
    { key: 'title', header: 'Song', cell: (song) => <span className="font-medium">{song.title}</span> },
    { key: 'artist', header: 'Artist', cell: (song) => song.artist },
    { key: 'status', header: 'Status', cell: (song) => <StatusBadge label={song.status} /> },
    { key: 'plays', header: 'Plays', cell: (song) => song.playCount.toLocaleString() },
  ]

  if (isLoading) {
    return <LoadingState label="Loading admin dashboard" />
  }

  if (errorMessage || !dashboard) {
    return (
      <EmptyState
        title="Could not load admin dashboard"
        description={errorMessage || 'Dashboard data is unavailable.'}
      />
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin overview"
        title="Dashboard"
        description="Monitor catalog health, user activity, and content performance."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total users" value={dashboard.totalUsers} icon={<Users className="size-5" />} />
        <StatCard title="Active users" value={dashboard.activeUsers} icon={<Activity className="size-5" />} />
        <StatCard title="Total songs" value={dashboard.totalSongs} icon={<Music2 className="size-5" />} />
        <StatCard title="Published songs" value={dashboard.publishedSongs} icon={<Radio className="size-5" />} />
        <StatCard title="Total categories" value={dashboard.totalCategories} icon={<FolderOpen className="size-5" />} />
        <StatCard title="Total tags" value={dashboard.totalTags} icon={<Tags className="size-5" />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-5">
          <PageHeader title="Most Played Songs" />
          <DataTable
            columns={columns}
            data={dashboard.mostPlayedSongs}
            emptyMessage="No played songs yet"
            getRowKey={(song) => song.id}
          />
        </div>
        <div className="rounded-lg border border-border bg-card/80 p-5">
          <h2 className="text-xl font-semibold">Publishing Summary</h2>
          <dl className="mt-6 grid gap-4 text-sm">
            <Summary label="Active users" value={`${dashboard.activeUsers} of ${dashboard.totalUsers}`} />
            <Summary label="Published songs" value={`${dashboard.publishedSongs} of ${dashboard.totalSongs}`} />
            <Summary label="Categories" value={dashboard.totalCategories.toLocaleString()} />
            <Summary label="Tags" value={dashboard.totalTags.toLocaleString()} />
          </dl>
        </div>
      </section>

      <section className="space-y-5">
        <PageHeader title="Recently Uploaded Songs" />
        <SongList songs={dashboard.recentlyUploadedSongs} />
      </section>
    </div>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  )
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-primary/30 bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
      {label}
    </span>
  )
}
