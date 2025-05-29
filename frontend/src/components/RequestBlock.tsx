export function RequestBlock() {
  return (
    <div class="flex flex-col gap-2 w-full">
      <h3 class="text-sm font-semibold">Request</h3>

      <input
        class="w-full px-3 py-2 bg-[#1f1f1f] text-sm text-white border border-gray-600 rounded placeholder-gray-400"
        placeholder="Name..."
        type="text"
      />

      <input
        class="w-full px-3 py-2 bg-[#1f1f1f] text-sm text-white border border-gray-600 rounded placeholder-gray-400"
        placeholder="Path..."
        type="text"
      />

      <div class="relative">
        <select class="w-full px-3 py-2 bg-[#1f1f1f] text-white text-sm border border-gray-600 rounded appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        <div class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          ▼
        </div>
      </div>
    </div>
  );
}
