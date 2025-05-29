import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

export interface GridBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
  content: ComponentChildren;
}

interface GridEditorProps {
  cellSize: number;
  blocks: GridBlock[];
  zoom?: number; // from -1 to 1, where 0 = normal
  onBlocksResolved?: (blocks: GridBlock[]) => void;
}

export function GridEditor({
  cellSize,
  blocks,
  zoom = 0,
  onBlocksResolved,
}: GridEditorProps) {
  const [resolvedBlocks, setResolvedBlocks] = useState<GridBlock[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const clampedZoom = Math.max(-1, Math.min(1, zoom));
  const scale = 1 + clampedZoom;
  const effectiveCellSize = cellSize * scale;

  const doesOverlap = (a: GridBlock, b: GridBlock) => {
    return (
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
  };

  const resolveBlockPosition = (
    block: GridBlock,
    others: GridBlock[]
  ): GridBlock => {
    let newBlock = { ...block };
    let tries = 0;
    while (others.some((b) => doesOverlap(newBlock, b)) && tries < 100) {
      newBlock.y++;
      tries++;
    }
    return newBlock;
  };

  useEffect(() => {
    const resolved: GridBlock[] = [];
    for (const block of blocks) {
      const adjusted = resolveBlockPosition(block, resolved);
      resolved.push(adjusted);
    }
    setResolvedBlocks(resolved);
    if (onBlocksResolved) onBlocksResolved(resolved);
  }, [blocks]);

  const maxX = Math.max(...resolvedBlocks.map((b) => b.x + b.w), 0);
  const maxY = Math.max(...resolvedBlocks.map((b) => b.y + b.h), 0);

  return (
    <div class="grid-editor w-full h-full relative">
      <div
        ref={containerRef}
        class="absolute left-0 top-0"
        style={{
          width: maxX * effectiveCellSize,
          height: maxY * effectiveCellSize,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
        }}
      >
        {resolvedBlocks.map((block) => (
          <div
            key={block.id}
            class="absolute"
            style={{
              left: block.x * effectiveCellSize,
              top: block.y * effectiveCellSize,
              width: block.w * effectiveCellSize,
              height: block.h * effectiveCellSize,
            }}
          >
            {block.content}
          </div>
        ))}
      </div>
    </div>
  );
}
