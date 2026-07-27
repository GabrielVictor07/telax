// Utilitário para gerar cores vibrantes e iniciais dinâmicas para avatares de usuários

const AVATAR_GRADIENTS = [
  'from-indigo-600 to-purple-700 text-white',
  'from-pink-600 to-rose-700 text-white',
  'from-cyan-600 to-blue-700 text-white',
  'from-emerald-600 to-teal-700 text-white',
  'from-amber-500 to-orange-600 text-white',
  'from-violet-600 to-fuchsia-700 text-white',
  'from-red-600 to-pink-700 text-white',
  'from-blue-600 to-indigo-700 text-white',
  'from-teal-600 to-emerald-700 text-white',
];

export function getAvatarGradient(identifier: string = ''): string {
  if (!identifier) return AVATAR_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

export function getAvatarInitial(name?: string, email?: string): string {
  const target = (name || email || 'U').trim();
  return target.charAt(0).toUpperCase();
}
