import { useEffect, useRef, useState } from "preact/hooks";
import { ContextMenu, type ContextMenuItem } from "../components/ContextMenu";
import { GridEditor, type GridBlock } from "../components/PlaygroundGrid";
import PlaygroundContainer from "../components/PlaygroundContainer";
import { RequestBlock } from "../components/RequestBlock";

const Playground = () => {
  const playgroundRef = useRef<HTMLDivElement>();
  const [blocks, setBlocks] = useState<Set<GridBlock>>(new Set());
  const [contextMenuData, setContextMenuData] = useState<{
    x: number;
    y: number;
    menu: ContextMenuItem[];
  } | null>(null);

  const [zoom, setZoom] = useState(0);

  const handleWheelZoom = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((prev) => Math.max(-1, Math.min(1, prev + delta)));
  };

  useEffect(() => {
    window.addEventListener("wheel", handleWheelZoom, { passive: false });
    return () => window.removeEventListener("wheel", handleWheelZoom);
  }, []);

  useEffect(() => {
    const handleClick = () => setContextMenuData(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleDrag = (id: string, newPos: { x: number; y: number }) => {
    const cellSize = 20;
    const zoomMultiplier = 1 + zoom;

    const maxX = Math.floor(
      (playgroundRef.current?.offsetWidth || 1000) / (cellSize * zoomMultiplier)
    );
    const maxY = Math.floor(
      (playgroundRef.current?.offsetHeight || 1000) /
        (cellSize * zoomMultiplier)
    );
    console.log("test");
    setBlocks((prev) => {
      const updated = new Set<GridBlock>();
      for (const block of prev) {
        if (block.id === id) {
          const clampedX = Math.max(0, Math.min(newPos.x, maxX - block.w));
          const clampedY = Math.max(0, Math.min(newPos.y, maxY - block.h));
          updated.add({ ...block, x: clampedX, y: clampedY });
        } else {
          updated.add(block);
        }
      }
      return updated;
    });
  };
  const handleResize = (
    id: string,
    direction: "left" | "right",
    delta: number
  ) => {
    setBlocks((prev) => {
      const updated = new Set<GridBlock>();
      for (const block of prev) {
        if (block.id === id) {
          let newX = block.x;
          let newW = block.w;

          if (direction === "left") {
            newX = Math.max(0, newX + delta);
            newW = Math.max(25, Math.min(40, newW - delta));
          } else {
            newW = Math.max(25, Math.min(40, newW + delta));
          }

          updated.add({ ...block, x: newX, w: newW });
        } else {
          updated.add(block);
        }
      }
      return updated;
    });
  };
  const createContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    const rect = playgroundRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const zoomMultiplier = 1 + zoom;
    const maxCols = Math.floor(
      playgroundRef.current!.clientWidth / (20 * zoomMultiplier)
    );
    const maxRows = Math.floor(
      playgroundRef.current!.clientHeight / (20 * zoomMultiplier)
    );

    const gridX = Math.max(
      0,
      Math.min(Math.floor(x / (20 * zoomMultiplier)), maxCols - 25)
    ); // w = 25
    const gridY = Math.max(
      0,
      Math.min(Math.floor(y / (20 * zoomMultiplier)), maxRows - 15)
    ); // h = 15

    setContextMenuData({
      x,
      y,
      menu: [
        {
          label: "Create",
          children: [
            {
              label: "Request",
              onClick: () => {
                const id = `req-${Date.now()}`;
                setBlocks(
                  (b) =>
                    new Set([
                      ...b,
                      {
                        id,
                        x: gridX,
                        y: gridY,
                        w: 25,
                        h: 15,
                        content: (
                          <PlaygroundContainer
                            id={id}
                            onDrag={handleDrag}
                            onResize={handleResize}
                            zoom={zoom}
                          >
                            <RequestBlock />
                          </PlaygroundContainer>
                        ),
                      },
                    ])
                );
                setContextMenuData(null);
              },
            },
          ],
        },
      ],
    });
  };

  return (
    <div
      onContextMenu={createContextMenu}
      ref={playgroundRef as any}
      class="h-screen bg-black rounded-md m-4 ring-1 ring-inset ring-blue-800 shadow-md shadow-gray-950 relative border-t-2 border-l-2 border-pink-600"
    >
      <div class="absolute right-2 top-2 flex flex-col">
        <div class="absolute right-2 top-2 flex flex-col text-sm text-white">
          Zoom
          <div class="flex flex-col items-center justify-center gap-1">
            <span>-1</span>
            <div class="relative h-[100px] flex flex-col items-center">
              <span class="bg-gray-700 w-[2px] h-full z-0 rounded-md"></span>
              <span class="absolute top-1/2 bg-gray-700 w-4 h-[2px] rounded-md z-10"></span>
              <span
                class="bg-gray-400 w-[10px] h-[2px] rounded-md absolute z-20"
                style={{ top: `${50 - zoom * 50}%` }}
              ></span>
            </div>
            <span>+1</span>
          </div>
        </div>
      </div>

      {contextMenuData && (
        <ContextMenu
          coords={{ x: contextMenuData.x, y: contextMenuData.y }}
          menu={contextMenuData.menu}
        />
      )}
      <GridEditor cellSize={20} zoom={zoom} blocks={Array.from(blocks)} />
    </div>
  );
};

export default Playground;
