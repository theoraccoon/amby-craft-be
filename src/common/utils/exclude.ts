export default function exclude<T, K extends keyof T>(user: T, keys: K[]): Omit<T, K> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}
