import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-200 to-red-100 flex flex-col items-center justify-center font-comic">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center py-20">
        <div className="absolute top-8 left-8 animate-bounce">
          <span className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg rotate-[-12deg]">
            BAM!
          </span>
        </div>
        <div className="absolute top-16 right-16 animate-pulse">
          <span className="text-4xl font-extrabold text-purple-500 drop-shadow-lg rotate-[8deg]">
            WOW!
          </span>
        </div>
        <div className="absolute bottom-8 right-1/3 animate-bounce delay-200">
          <span className="text-4xl font-extrabold text-red-500 drop-shadow-lg rotate-[-6deg]">
            POW!
          </span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-center text-black drop-shadow-lg mb-4 tracking-tight comic-outline">
          Access Granted
        </h1>
        <p className="text-2xl md:text-3xl text-center text-gray-800 max-w-2xl mb-8">
          Your monthly dose of stories, case studies, and fun—delivered in comic
          style!
        </p>
        <Link
          href="/newsletter/1"
          className="bg-yellow-300 hover:bg-red-400 text-black font-bold px-8 py-4 rounded-full text-2xl shadow-lg transition-all duration-200 border-4 border-red-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 animate-wiggle"
        >
          Read Latest Issue
        </Link>
      </section>
      {/* Featured Issues Section */}
      <section className="w-full max-w-5xl px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="relative bg-white border-4 border-red-400 rounded-2xl p-6 shadow-xl group hover:scale-105 transition-transform cursor-pointer">
          <div className="absolute -top-6 left-4 text-xl font-extrabold text-blue-500 group-hover:animate-bounce">
            NEW!
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Case Study: The Rise of SuperTech
          </h2>
          <p className="text-gray-700 mb-4">
            How innovation is changing the world, one hero at a time.
          </p>
          <Link
            href="/newsletter/2"
            className="text-red-500 font-bold underline"
          >
            Read More
          </Link>
        </div>
        <div className="relative bg-white border-4 border-yellow-400 rounded-2xl p-6 shadow-xl group hover:scale-105 transition-transform cursor-pointer">
          <div className="absolute -top-6 left-4 text-xl font-extrabold text-yellow-500 group-hover:animate-bounce">
            HOT!
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Article: Comic Storytelling Secrets
          </h2>
          <p className="text-gray-700 mb-4">
            Discover the art of visual storytelling from the pros.
          </p>
          <Link
            href="/newsletter/3"
            className="text-yellow-500 font-bold underline"
          >
            Read More
          </Link>
        </div>
        <div className="relative bg-white border-4 border-purple-400 rounded-2xl p-6 shadow-xl group hover:scale-105 transition-transform cursor-pointer">
          <div className="absolute -top-6 left-4 text-xl font-extrabold text-purple-500 group-hover:animate-bounce">
            WOW!
          </div>
          <h2 className="text-2xl font-bold mb-2">Fun: Create Your Own Hero</h2>
          <p className="text-gray-700 mb-4">
            Interactive comic builder—unleash your imagination!
          </p>
          <Link
            href="/newsletter/4"
            className="text-purple-500 font-bold underline"
          >
            Try Now
          </Link>
        </div>
      </section>
    </main>
  );
}
