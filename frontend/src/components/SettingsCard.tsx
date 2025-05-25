import { useState, useEffect } from "preact/hooks";

type SettingField = {
  label: string;
  key: string;
  type: "string" | "number";
  value: string | number;
};

type SettingsSection = {
  fields: SettingField[];
  note?: string;
  onSave: (
    values: Record<string, string | number>,
    onError: (message: string) => void,
    onSuccess: (message: string) => void
  ) => void;
};

export function SettingsCard({ fields, note, onSave }: SettingsSection) {
  const initialValues = Object.fromEntries(fields.map((f) => [f.key, f.value]));
  const [values, setValues] =
    useState<Record<string, string | number>>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const changed = Object.keys(initialValues).some(
      (key) => values[key] !== initialValues[key]
    );
    setDirty(changed);
  }, [values]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (key: string, val: string) => {
    const type = fields.find((f) => f.key === key)?.type;
    const parsed = type === "number" ? parseInt(val) : val;
    setValues((prev) => ({ ...prev, [key]: parsed }));
    setError(null);
  };

  const handleSave = () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    onSave(
      values,
      (msg) => {
        setLoading(false);
        setError(msg);
      },
      (msg) => {
        setLoading(false);
        setSuccess(msg);
      }
    );
  };

  return (
    <div class="w-full bg-zinc-900 rounded-2xl shadow-xl px-8 py-10 space-y-10">
      {note && (
        <div class="flex items-center gap-2 text-yellow-400 text-sm bg-gray-800 border border-yellow-500/30 px-4 py-2 rounded-lg">
          ⚠️ <span>{note}</span>
        </div>
      )}

      <div class="space-y-6 max-w-2xl">
        {fields.map((field) => (
          <div
            key={field.key}
            class="grid grid-cols-[150px_1fr] items-start gap-4"
          >
            <label class="text-sm text-gray-300 pt-2">{field.label}</label>
            <div class="w-full space-y-1">
              <input
                type={field.type === "number" ? "number" : "text"}
                value={values[field.key]}
                onInput={(e) =>
                  handleChange(field.key, (e.target as HTMLInputElement).value)
                }
                class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-gray-600 transition"
              />
              {error && (
                <div class="text-sm text-red-400 bg-gray-800 border border-red-500/30 px-3 py-1.5 rounded-md w-full">
                  {error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {dirty && (
        <div class="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            class="px-6 py-2.5 bg-blue-900 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
          >
            Save Changes
          </button>

          {loading && (
            <div class="text-sm text-blue-400 bg-gray-800 border border-blue-500/30 px-4 py-2 rounded-lg">
              Saving...
            </div>
          )}
        </div>
      )}

      {success && (
        <div class="text-sm text-green-400 bg-gray-800 border border-green-500/30 px-4 py-2 rounded-lg">
          {success}
        </div>
      )}
    </div>
  );
}
