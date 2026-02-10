/**
 * Combine les classes CSS
 * Version simplifiée sans dépendances externes
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
