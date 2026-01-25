import {
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { UserDropdownMenu } from './user-dropdown-menu'

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserDropdownMenu user={user} />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
