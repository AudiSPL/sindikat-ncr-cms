import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to Serbian version by default
  redirect('/sr');
}