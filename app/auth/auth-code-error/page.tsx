import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-500">Authentication Error</h1>
      <p>Something went wrong during login. Please try again.</p>
      <Link href="/">
        <Button className="mt-6 bg-black text-white hover:bg-gray-800 transition">
          Back to Login
        </Button>
      </Link>
    </div>
  )
}