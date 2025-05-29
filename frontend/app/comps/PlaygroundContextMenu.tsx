import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRight } from "lucide-react";
import { addRequest } from "~/lib/PlaygroundManager";
import { useInstanceStore, useViewportStore } from "~/lib/playgroundStore";

export function CustomContextMenu({
  position,
  worldPosition,
  open,
  onOpenChange,
}: {
  position: { x: number; y: number };
  worldPosition: () => { x: number; y: number };

  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const instanceStore = useInstanceStore((s) => s.addInstanceObject);
  const stageScale = useViewportStore((s) => s.stageScale);
  const stagePosition = useViewportStore((s) => s.stagePosition);
  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            zIndex: 1000,
          }}
          className="min-w-[220px] rounded-md bg-gradient-to-br from-rose-900/25 to-blue-900/15 text-white shadow-lg ring-1 ring-rose-600/30 p-1 shadow-md select-none"
        >
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="flex items-center justify-between px-3 py-2 rounded cursor-pointer hover:bg-blue-600/10">
              <span>Create</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent className="min-w-[200px] ml-2 rounded-md bg-gradient-to-br from-rose-900/20 to-blue-900/10 text-white shadow-lg ring-1 ring-white/10 p-1">
              <DropdownMenu.Item
                onClick={() => addRequest(instanceStore, worldPosition())}
                className="px-3 py-2 rounded hover:bg-blue-600/10"
              >
                Request
              </DropdownMenu.Item>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger className="flex items-center justify-between px-3 py-2 rounded hover:bg-blue-600/10">
                  <span>Dashboard</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent className="min-w-[180px] ml-2 rounded-md bg-gradient-to-br from-rose-900/20 to-blue-900/10 text-white shadow-lg ring-1 ring-white/10 p-1">
                  <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-blue-600/10">
                    Schemas
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-blue-600/10">
                    Collection
                  </DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-blue-600/10">
                Type
              </DropdownMenu.Item>
              <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-blue-600/10">
                Response
              </DropdownMenu.Item>
              <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-blue-600/10">
                Middleware
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>

          <DropdownMenu.Separator className="h-px my-1 bg-gradient-to-br from-rose-900/50 to-blue-900/50" />

          <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-blue-600/10">
            Delete
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-blue-600/10">
            Undo
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-blue-600/10">
            Redo
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-blue-600/10">
            Copy
          </DropdownMenu.Item>
          <DropdownMenu.Item className="px-3 py-2 rounded hover:bg-blue-600/10">
            Paste
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
