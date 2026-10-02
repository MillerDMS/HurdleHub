import Link from "next/link";

export default function Navbar() {
    return (
        <header className="border-b border-gray-800 bg-black/50">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight"
                >
                    HurdleHub
                </Link>

                <nav className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="rounded-lg px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/projects/new"
                        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
                    >
                        + New Project
                    </Link>
                </nav>
            </div>
        </header>
    );
}