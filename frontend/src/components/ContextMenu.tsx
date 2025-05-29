import { useRef, useState } from "preact/hooks";

export type ContextMenuItem = {
  label: string;
  onClick?: (coords?: { x: number; y: number }) => void;
  children?: ContextMenuItem[];
};
export function ContextMenu({
  coords,
  menu,
  depth = 0,
}: {
  coords: { x: number; y: number };
  menu: ContextMenuItem[];
  depth?: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (index: number) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    // delay hiding submenu to allow diagonal movement
    hideTimer.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 200);
  };

  return (
    <div
      style={{
        top: coords.y,
        left: coords.x,
      }}
      class="absolute bg-zinc-900 text-white rounded-md shadow-xl ring-1 ring-zinc-700 text-xs py-1 px-1 min-w-[140px] z-[999]"
    >
      {menu.map((item, i) => {
        const hasChildren = item.children?.length;
        const submenuOpen = hoveredIndex === i;

        return (
          <div
            class="relative"
            key={i}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!hasChildren && item.onClick) item.onClick(coords);
              }}
              class="flex items-center justify-between px-3 py-2 rounded hover:bg-pink-800 transition cursor-default"
            >
              <span>{item.label}</span>
              {hasChildren && <span class="text-gray-400">▶</span>}
            </div>

            {hasChildren && submenuOpen && (
              <ContextMenu
                coords={{
                  x: 140,
                  y: i * 28,
                }}
                menu={item.children!}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}