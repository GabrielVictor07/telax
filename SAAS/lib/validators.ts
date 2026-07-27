import { z } from 'zod';

// Schema para Cadastro de Usuário
export const registerSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' }).max(100),
  email: z.string().email({ message: 'E-mail em formato inválido.' }).toLowerCase().trim(),
  password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }).max(100),
});

// Schema para Atualização do Perfil do Usuário
export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' }).optional(),
});

// Schema para Criação e Edição de Filmes pelo Admin
export const movieSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório.' }).max(200),
  description: z.string().min(1, { message: 'Descrição é obrigatória.' }),
  year: z.number().int().min(1900).max(2100),
  rating: z.number().min(0).max(10),
  duration: z.string().min(1),
  posterUrl: z.string().url({ message: 'URL da capa inválida.' }),
  bannerUrl: z.string().url({ message: 'URL do banner inválida.' }),
  videoUrl: z.string().min(1, { message: 'URL do vídeo é obrigatória.' }),
  isFeatured: z.boolean().default(false),
  categoryId: z.string().min(1, { message: 'Categoria é obrigatória.' }),
});

// Schema para Atualização de Usuário pelo Admin
export const adminUserUpdateSchema = z.object({
  userId: z.string().min(1, { message: 'UserID é obrigatório.' }),
  role: z.enum(['USER', 'ADMIN']).optional(),
  plan: z.enum(['GOLD', 'PLATINUM', 'DIAMOND']).optional(),
});

// Schema para Criação e Edição de Categorias pelo Admin
export const categorySchema = z.object({
  name: z.string().min(1, { message: 'Nome da categoria é obrigatório.' }).max(100),
  slug: z.string().min(1, { message: 'Slug é obrigatório.' }).max(100),
});
