import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-white">404 - Page Not Found</h2>
      <p className="text-gray-500 mt-2">Oops! We couldn&apos;t find that page.</p>
      
      <Button asChild className="mt-4">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}