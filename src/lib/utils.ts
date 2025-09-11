export function firstLastName(name: string | undefined) {
  if (!name) return "";

  if (name?.split(" ").length > 1) {
    return (
      name?.split(" ").filter(Boolean)[0] +
      " " +
      name?.split(" ").filter(Boolean).slice(-1)[0]
    );
  }

  return name?.split(" ").filter(Boolean);
}
