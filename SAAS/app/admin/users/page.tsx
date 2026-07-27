import { getUsers } from '@/lib/actions/user';
import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await getUsers();

  return <UsersClient initialUsers={users} />;
}
