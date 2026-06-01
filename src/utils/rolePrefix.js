export const ROLE_PREFIXES = {
  admin: "/admin",
  supervisor: "/supervisor",
  kitchen: "/kitchen",
  delivery_agent: "/delivery",
  attendant: "/attendant",
  store_keeper: "/store-keeper",
};

export function getPrefixForRole(role) {
  return ROLE_PREFIXES[role] ?? "/admin";
}
