import { Eye, UserCheck, UserX } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { DataTable, LoadingState, PageHeader, SearchBar, type DataTableColumn } from '@/components/common'
import { Button } from '@/components/ui'
import { adminService } from '@/services'
import type { ApiUserRole, User } from '@/types'

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    adminService
      .getUsers()
      .then(setUsers)
      .finally(() => setIsLoading(false))
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

  const toggleStatus = async (user: User) => {
    const updatedUser = await adminService.updateUserStatus(user.id, !user.isActive)
    setUsers((items) => items.map((item) => (item.id === updatedUser.id ? updatedUser : item)))
  }

  const updateRole = async (user: User, role: ApiUserRole) => {
    const updatedUser = await adminService.updateUserRole(user.id, role)
    setUsers((items) => items.map((item) => (item.id === updatedUser.id ? updatedUser : item)))
  }

  const columns: DataTableColumn<User>[] = [
    { key: 'name', header: 'Full name', cell: (user) => <span className="font-medium">{user.fullName}</span> },
    { key: 'username', header: 'Username', cell: (user) => user.username },
    { key: 'email', header: 'Email', cell: (user) => user.email },
    { key: 'role', header: 'Role', cell: (user) => <Badge tone={user.role === 'ADMIN' ? 'primary' : 'neutral'}>{user.role}</Badge> },
    { key: 'status', header: 'Status', cell: (user) => <Badge tone={user.isActive ? 'success' : 'muted'}>{user.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'created', header: 'Created', cell: (user) => formatDate(user.createdAt) },
    {
      key: 'actions',
      header: 'Actions',
      cell: (user) => (
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" type="button" onClick={() => toggleStatus(user)}>
            {user.isActive ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
            {user.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <select
            className="h-9 rounded-md border border-border bg-secondary px-2 text-xs text-foreground"
            value={user.role}
            onChange={(event) => updateRole(user, event.target.value as ApiUserRole)}
            aria-label="Change user role"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <Button variant="ghost" size="sm" type="button">
            <Eye className="size-4" />
            View
          </Button>
        </div>
      ),
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

      {isLoading ? <LoadingState label="Loading users" /> : <DataTable columns={columns} data={filteredUsers} getRowKey={(user) => user.id} />}
    </div>
  )
}

function Filter({ children, label, onChange, value }: { children: ReactNode; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <select className="h-11 rounded-full border border-border bg-secondary/70 px-4 text-sm text-foreground outline-none" value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
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
