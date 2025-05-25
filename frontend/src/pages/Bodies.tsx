import { useEffect, useState } from "preact/hooks";
import { read } from "../utils/Communicator";

/**
 * @param {{ bodies: Record<string, { key: string, type: string }[]>, onUpdate: (name: string) => void, onDelete: (name: string) => void }} props
 */
function BodiesTable({ bodies, onUpdate, onDelete }) {
  return (
    <div class="overflow-x-auto border border-gray-800 rounded-lg">
      <table class="min-w-full text-sm text-left bg-gray-950 text-gray-300">
        <thead class="bg-gray-900 text-xs uppercase text-gray-400">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Fields</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(bodies).map(([name, structure]) => (
            <tr key={name} class="border-t border-gray-800 hover:bg-gray-900">
              <td class="px-4 py-3 font-medium text-white">{name}</td>
              <td class="px-4 py-3">
                {structure.length} field{structure.length !== 1 ? "s" : ""}
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  onClick={() => onUpdate(name)}
                  class="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded hover:bg-blue-500/10"
                >
                  🖊 Update
                </button>
                <button
                  onClick={() => onDelete(name)}
                  class="text-red-400 hover:text-red-300 text-xs px-2 py-1 ml-2 rounded hover:bg-red-500/10"
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BodiesPage() {
  const [bodies, setBodies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    read("/requests/bodies")
      .then((res) => setBodies(res))
      .catch((err) => console.error("Failed to load bodies:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = (name) => {
    console.log("🖊 Update", name);
  };

  const handleDelete = (name) => {
    console.log("🗑 Delete", name);
  };

  return (
    <div class="min-h-screen bg-[#1f1f24] text-white p-6">
      <div class="max-w-6xl mx-auto space-y-8">
        <h1 class="text-3xl font-bold">Defined Bodies</h1>

        {loading ? (
          <p class="text-gray-400">Loading...</p>
        ) : Object.keys(bodies).length === 0 ? (
          <p class="text-gray-500 italic">No bodies defined.</p>
        ) : (
          <BodiesTable
            bodies={bodies}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
