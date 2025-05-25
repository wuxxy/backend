export default function NotFound() {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center bg-[#1f1f24] text-gray-300 p-6">
      <h1 class="text-6xl font-bold mb-4">404</h1>
      <p class="text-xl mb-6">Page not found</p>
      <a
        href="/"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
      >
        Go Home
      </a>
    </div>
  );
}
