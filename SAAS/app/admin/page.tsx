import { getMovies } from '@/lib/actions/movie';
import { getCategories } from '@/lib/actions/category';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const movies = await getMovies();
  const categories = await getCategories();

  return <AdminClient initialMovies={movies} categories={categories} />;
}
