import {
  getUsers,
  approveUserAction,
  rejectUserAction,
  changeRoleAction,
} from "@/app/actions/admin-users";
import type { AdminUserListItem, UserStatus } from "@/types/user";

export const metadata = { title: "사용자 관리" };

const STATUS_CONFIG: Record<
  UserStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "대기",
    className: "bg-status-warn-bg text-status-warn-fg border border-status-warn-border",
  },
  active: {
    label: "활성",
    className: "bg-status-ok-bg text-status-ok-fg border border-status-ok-border",
  },
  rejected: {
    label: "거절",
    className: "bg-status-error-bg text-status-error-fg border border-status-error-border",
  },
  disabled: {
    label: "비활성",
    className: "bg-status-unknown-bg text-status-unknown-fg border border-status-unknown-border",
  },
};

function StatusBadge({ status }: { status: UserStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "admin";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isAdmin
          ? "border border-border-default bg-interactive-accent/10 text-interactive-accent"
          : "border border-border-default bg-bg-elevated text-fg-base"
      }`}
    >
      {isAdmin ? "관리자" : "사용자"}
    </span>
  );
}

async function handleApprove(formData: FormData) {
  "use server";
  await approveUserAction(formData);
}

async function handleReject(formData: FormData) {
  "use server";
  await rejectUserAction(formData);
}

async function handleChangeRole(formData: FormData) {
  "use server";
  await changeRoleAction(formData);
}

function PendingActions({ user }: { user: AdminUserListItem }) {
  return (
    <div className="flex justify-end gap-2">
      <form action={handleApprove}>
        <input type="hidden" name="userId" value={user.id} />
        <button
          type="submit"
          className="rounded-md bg-interactive-primary px-3 py-1.5 text-xs font-medium text-fg-on-primary hover:bg-interactive-primary-hover transition-colors"
        >
          승인
        </button>
      </form>
      <form action={handleReject}>
        <input type="hidden" name="userId" value={user.id} />
        <button
          type="submit"
          className="rounded-md bg-status-error-bg px-3 py-1.5 text-xs font-medium text-status-error-fg hover:opacity-80 transition-colors"
        >
          거절
        </button>
      </form>
    </div>
  );
}

function RoleActions({ user }: { user: AdminUserListItem }) {
  const currentRole = user.roles.includes("admin") ? "admin" : "user";
  const targetRole = currentRole === "admin" ? "user" : "admin";
  const label = currentRole === "admin" ? "사용자로 변경" : "관리자로 변경";

  return (
    <form action={handleChangeRole}>
      <input type="hidden" name="userId" value={user.id} />
      <input type="hidden" name="roleName" value={targetRole} />
      <button
        type="submit"
        className="rounded-md border border-border-default bg-bg-surface px-3 py-1.5 text-xs font-medium text-fg-muted hover:bg-bg-elevated transition-colors"
      >
        {label}
      </button>
    </form>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-fg-base">사용자 관리</h1>
        <span className="text-sm text-fg-muted">
          총 {users.length}명
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-default bg-bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-base">
                <th className="whitespace-nowrap px-4 py-3 font-medium text-fg-muted">
                  이메일
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-fg-muted">
                  이름
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-fg-muted">
                  상태
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-fg-muted">
                  역할
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-medium text-fg-muted">
                  가입일
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-fg-muted">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-fg-muted"
                  >
                    등록된 사용자가 없습니다.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-bg-elevated/50 transition-colors"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-fg-base">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-fg-base">
                      {user.displayName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <RoleBadge key={role} role={role} />
                          ))
                        ) : (
                          <span className="text-xs text-fg-muted">-</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-fg-muted">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {user.status === "pending" && (
                        <PendingActions user={user} />
                      )}
                      {user.status === "active" && (
                        <RoleActions user={user} />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
