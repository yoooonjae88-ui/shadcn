import { FolderKanban, LayoutDashboard, Settings, Users } from "lucide-react"

import {
  Menu,
  MenuItem,
  MenuLabel,
  MenuLink,
  MenuList,
  MenuSeparator,
} from "@/registry/menu/menu"

export function MenuDemo() {
  return (
    <Menu className="max-w-56">
      <MenuLabel>Workspace</MenuLabel>
      <MenuList>
        <MenuItem>
          <MenuLink href="#" active>
            <LayoutDashboard /> Dashboard
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="#">
            <FolderKanban /> Projects
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink href="#">
            <Users /> Team
          </MenuLink>
        </MenuItem>
      </MenuList>
      <MenuSeparator />
      <MenuList>
        <MenuItem>
          <MenuLink href="#">
            <Settings /> Settings
          </MenuLink>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
