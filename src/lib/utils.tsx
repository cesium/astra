export function firstLastName(name: string | undefined) {
  return (
    name?.split(" ").filter(Boolean)[0] +
    " " +
    name?.split(" ").filter(Boolean).slice(-1)[0]
  );
}
