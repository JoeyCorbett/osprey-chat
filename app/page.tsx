import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-4xl font-bold">Osprey Chat</h1>
      <p className="mt-2 text-lg text-gray-600">Connect with Stockton students instantly.</p>

      <Link href="/login">
        <Button className="mt-6 bg-black text-white hover:bg-gray-800 transition">
          Get Started
        </Button>
      </Link>
    </div>
  );
}