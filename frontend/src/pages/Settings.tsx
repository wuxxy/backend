import { useState } from "preact/hooks";
import { SettingsCard } from "../components/SettingsCard";
import { update } from "../utils/Communicator";

export default function Settings() {
  const [port, setPort] = useState(3000);

  return (
    <div class="min-h-screen bg-[#1f1f24] text-white p-6">
      <div class="max-w-2xl mx-auto space-y-8">
        <h1 class="text-3xl font-bold">Settings</h1>

        <SettingsCard
          fields={[
            {
              label: "Port",
              key: "port",
              type: "number",
              value: port,
            },
          ]}
          note="Changing the port will require a server restart to take effect."
          onSave={async (values, onError, onSuccess) => {
            if (
              typeof values.port !== "number" ||
              values.port < 1000 ||
              values.port > 65535
            ) {
              onError("Port must be between 1000 and 65535.");
              return;
            }

            try {
              const attemptPortChange = await update("/settings/port", {
                port: values.port.toString(),
              });

              if (attemptPortChange.error as any) {
                onError("Failed to update port.");
              } else {
                setPort(values.port);
                onSuccess("Successfully changed port.");
              }
            } catch (error) {
              onError("An error occurred.");
            }
          }}
        />
      </div>
    </div>
  );
}
