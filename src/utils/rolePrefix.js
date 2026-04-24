export const ROLE_PREFIXES = {
  admin: "/admin",
  supervisor: "/supervisor",
  kitchen: "/kitchen",
  delivery_agent: "/delivery",
  attendant: "/attendant",
};

export function getPrefixForRole(role) {
  return ROLE_PREFIXES[role] ?? "/admin";
}
