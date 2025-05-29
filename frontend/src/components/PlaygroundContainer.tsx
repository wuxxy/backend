import { useRef } from "preact/hooks";

export default function PlaygroundContainer({
  id,
  onDrag,
  onResize,
  zoom,
  children,
}: {
  id: string;
  zoom: number;
  onDrag: (id: string, newPos: { x: number; y: number }) => void;
  onResize?: (id: string, direction: "left" | "right", delta: number) => void;
  children: any;
}) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cellSize = 20;

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const grid = (e.target as HTMLElement).closest(
      ".grid-editor"
    ) as HTMLElement;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const zoomMultiplier = 1 + zoom;

    const move = (ev: MouseEvent) => {
      const relativeX = (ev.clientX - rect.left) / zoomMultiplier;
      const relativeY = (ev.clientY - rect.top) / zoomMultiplier;

      const gridX = Math.floor(relativeX / cellSize);
      const gridY = Math.floor(relativeY / cellSize);

      onDrag(id, { x: gridX, y: gridY });
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleResize = (direction: "left" | "right", e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let lastX = e.clientX;

    const move = (ev: MouseEvent) => {
      const dx = ev.clientX - lastX;
      lastX = ev.clientX;

      const delta = Math.round(dx / (cellSize * (1 + zoom)));

      if (delta !== 0) {
        onResize?.(id, direction, delta);
      }
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };
  

  return (
    <div class="relative w-full h-full select-none">
      <div
        class="absolute top-0 left-0 m-2 rounded-full w-3 h-3 bg-sky-700 border border-sky-300 cursor-grab z-10"
        onMouseDown={onMouseDown}
      />
      <div class="absolute top-0 left-6 m-2 rounded-full w-3 h-3 bg-gray-300 ring-2 ring-gray-400 cursor-crosshair z-10 ring-inset" />
      <div class="bg-zinc-900 border border-zinc-700 rounded-sm p-4 shadow-md w-full h-full text-white text-xs space-y-3 select-none">
        {children}
      </div>
      {/* resize left side */}
      <div
        class="absolute left-0 bottom-[50%] w-2 h-10 bg-pink-950 border-rose-500 border rounded-r-md translate-y-[50%] cursor-ew-resize"
        onMouseDown={(e) => handleResize("left", e)}
      />
      {/* resize right side */}
      <div
        class="absolute right-0 bottom-[50%] w-2 h-10 bg-pink-950 border-rose-500 border rounded-l-md translate-y-[50%] cursor-ew-resize"
        onMouseDown={(e) => handleResize("right", e)}
      />
      <div class="absolute right-0 bottom-0 w-4 h-4 bg-pink-950 border-rose-500 border rounded-tl-full" />
      <div class="absolute left-0 bottom-0 w-4 h-4 bg-pink-950 border-rose-500 border rounded-tr-full" />
      <div class="absolute right-0 top-0 w-4 h-4 bg-pink-950 border-rose-500 border rounded-bl-full" />
    </div>
  );
}
