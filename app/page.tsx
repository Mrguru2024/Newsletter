
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8 font-comic">
      <h1 className="text-4xl mb-6">Comic Newsletter</h1>
      <Link 
        href="/newsletter/1" 
        className="bg-pow hover:bg-boom px-4 py-2 rounded-lg text-black transition-colors"
      >
        Read Latest Issue
      </Link>
    </main>
  )
}
