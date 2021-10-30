import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>404, page not found ¯\_(ツ)_/¯</h1>
      <Link href="/">Go back</Link>
    </div>
  );
}
