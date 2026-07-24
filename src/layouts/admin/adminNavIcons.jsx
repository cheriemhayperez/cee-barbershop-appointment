import {
  Calendar,
  Element3,
  Menu,
  Profile,
  Scissor,
  Setting2,
  User,
} from "iconsax-react";

export const ICON_SIZE = {
  nav: 18,
  topbar: 20,
};

export function IconUser(props) {
  return (
    <User
      size={ICON_SIZE.topbar}
      color="currentColor"
      variant="Outline"
      {...props}
    />
  );
}

export const adminNavItems = [
  { to: "/admin", label: "Dashboard", end: true, Icon: Element3 },
  { to: "/admin/appointments", label: "Appointments", Icon: Calendar },
  { to: "/admin/barbers", label: "Barbers", Icon: Scissor },
  { to: "/admin/services", label: "Services", Icon: Menu },
  { to: "/admin/customers", label: "Customers", Icon: Profile },
  { to: "/admin/settings", label: "Settings", end: false, Icon: Setting2 },
];

export function getAdminPageTitle(pathname) {
  const match = adminNavItems.find(({ to, end }) =>
    end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`)
  );

  return match?.label ?? "Admin";
}

export function NavIcon({ Icon, ...props }) {
  return (
    <Icon
      size={ICON_SIZE.nav}
      color="currentColor"
      variant="Outline"
      {...props}
    />
  );
}
