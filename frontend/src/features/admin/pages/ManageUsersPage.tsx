import { Eye, UserCheck, UserX } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import {
  DataTable,
  EmptyState,
  LoadingState,
  PageHeader,
  SearchBar,
  type DataTableColumn,
} from '@/components/common'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { ApiUserRole, User } from '@/types'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unable to load users right now.'
}

export function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [updatingUserIds, setUpdatingUserIds] = useState<string[]>([])

  const loadUsers = async () => {
    setErrorMessage('')
    const userList = await adminService.getUsers()
    setUsers(userList)
  }

  useEffect(() => {
    let isMounted = true

    adminService
      .getUsers()
      .then((userList) => {
        if (isMounted) {
          setUsers(userList)
        }
      })
      .catch((error) => {
        if (isMounted) {
          setUsers([])
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

  const filteredUsers = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.fullName, user.username, user.email, user.role].join(' ').toLowerCase().includes(query)
      const matchesRole = !roleFilter || user.role === roleFilter
      const matchesStatus =
        !statusFilter ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive)

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [roleFilter, searchValue, statusFilter, users])

  const withRowUpdate = async (userId: string, update: () => Promise<unknown>) => {
    setErrorMessage('')
    setUpdatingUserIds((current) => [...current, userId])

    try {
      await update()
      await loadUsers()
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setUpdatingUserIds((current) => current.filter((id) => id !== userId))
    }
  }

  const toggleStatus = async (user: User) => {
    await withRowUpdate(user.id, () => adminService.updateUserStatus(user.id, !user.isActive))
  }

  const updateRole = async (user: User, role: ApiUserRole) => {
    if (user.role === role) {
      return
    }

    await withRowUpdate(user.id, () => adminService.updateUserRole(user.id, role))
  }

  const columns: DataTableColumn<User>[] = [
    { key: 'name', header: 'Full name', cell: (user) => <span className="font-medium">{user.fullName}</span> },
    { key: 'username', header: 'Username', cell: (user) => user.username },
    { key: 'email', header: 'Email', cell: (user) => user.email },
    {
      key: 'role',
      header: 'Role',
      cell: (user) => <Badge tone={user.role === 'ADMIN' ? 'primary' : 'neutral'}>{user.role}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (user) => <Badge tone={user.isActive ? 'success' : 'muted'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    { key: 'created', header: 'Created', cell: (user) => formatDate(user.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      cell: (user) => {
        const isUpdating = updatingUserIds.includes(user.id)

        return (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              disabled={isUpdating}
              onClick={() => void toggleStatus(user)}
            >
              {user.isActive ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
              {isUpdating ? 'Updating' : user.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <select
              className="h-9 rounded-md border border-border bg-secondary px-2 text-xs text-foreground disabled:opacity-50"
              value={user.role}
              disabled={isUpdating}
              onChange={(event) => void updateRole(user, event.target.value as ApiUserRole)}
              aria-label="Change user role"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <Button variant="ghost" size="sm" type="button" disabled={isUpdating}>
              <Eye className="size-4" />
              View
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Admin" title="Users" description="Search users, manage roles, and control account access." />

      <section className="grid gap-4 rounded-lg border border-border bg-card/70 p-4 md:grid-cols-[1fr_12rem_12rem]">
        <SearchBar value={searchValue} onChange={setSearchValue} placeholder="Search users" />
        <Filter value={roleFilter} onChange={setRoleFilter} label="Role">
          <option value="">All roles</option>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </Filter>
        <Filter value={statusFilter} onChange={setStatusFilter} label="Status">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Filter>
      </section>

      {errorMessage ? (
        <EmptyState title="Could not load users" description={errorMessage} />
      ) : isLoading ? (
        <LoadingState label="Loading users" />
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          emptyMessage="No users found"
          getRowKey={(user) => user.id}
        />
      )}
    </div>
  )
}

function Filter({
  children,
  label,
  onChange,
  value,
}: {
  children: ReactNode
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <select
      className="h-11 rounded-full border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={label}
    >
      {children}
    </select>
  )
}

function Badge({ children, tone }: { children: ReactNode; tone: 'primary' | 'neutral' | 'success' | 'muted' }) {
  const className =
    tone === 'primary'
      ? 'border-primary/30 bg-primary/15 text-primary'
      : tone === 'success'
        ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
        : tone === 'muted'
          ? 'border-border bg-secondary text-muted-foreground'
          : 'border-border bg-secondary text-foreground'

  return <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}>{children}</span>
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}
