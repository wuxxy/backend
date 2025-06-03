import React, { useEffect, useRef, useState } from "react";
import { Circle, Layer, Stage } from "react-konva";
import { Html } from "react-konva-utils";
import { useStrictMode } from "react-konva";
import type Konva from "konva";
import { ContextMenu } from "~/components/ui/context-menu";
import { CustomContextMenu } from "./PlaygroundContextMenu";
import { useInstanceStore, useViewportStore, type PlaygroundObject } from "~/lib/playgroundStore";
import { MethodFormCard } from "./PlaygroundCards";
import {
  BadgeX,
  Cross,
  Delete,
  GripVertical,
  Home,
  HomeIcon,
  SplinePointer,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import PlaygroundComponent from "./PlaygroundComponent";
import { Button } from "~/components/ui/button";

useStrictMode(true);

export function MacMenubar({ save }: { save: any }) {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    now.getDay()
  ];

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between h-6 px-3 text-[11px] font-medium text-white bg-black/80 backdrop-blur-sm shadow-sm select-none">
      {/* Left side: app + menus */}
      <div className="flex items-center gap-4 text-white/80">
        <span className="text-xs font-semibold tracking-wide text-white">
          Spline
        </span>

        <DropdownMenu key={"File"}>
          <DropdownMenuTrigger className="p-2 transition-colors hover:text-white">
            File
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-1 text-white border rounded-sm bg-neutral-900 border-white/10">
            <DropdownMenuItem
              onClick={save}
              className="cursor-pointer hover:bg-white/10"
            >
              Save
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/10">
              Another Option
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right side: time + status */}
      <div className="flex items-center gap-3 font-normal text-white/60">
        <span>
          {hours}:{minutes} {ampm} {weekday}
        </span>
        <span>🔋 100%</span>
      </div>
    </div>
  );
}

const PlaygroundCanvas = () => {
  const pgParentRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [cursorPos, setCursorPos] = useState<[number, number]>([0, 0]);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  // 📐 Resize observer
  useEffect(() => {
    const updateSize = () => {
      if (pgParentRef.current) {
        setDimensions({
          width: pgParentRef.current.clientWidth,
          height: pgParentRef.current.clientHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  // 📋 Context menu handler
  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    if (!pgParentRef.current) return;

    const container = pgParentRef.current.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;

    // Set raw cursor position
    setCursorPos([x, y]);

    setContextMenuOpen(true);
  };

  // 👇 Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const menu = contextMenuRef.current;
      if (!menu) return;

      // If the click target is NOT inside the context menu
      if (!menu.contains(e.target as Node)) {
        setContextMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 🧠 Clamp position after menu is open
  useEffect(() => {
    if (!contextMenuOpen) return;

    const frame = requestAnimationFrame(() => {
      const container = pgParentRef.current;
      const menu = contextMenuRef.current;
      if (!container || !menu) return;

      const maxX = container.clientWidth - menu.offsetWidth;
      const maxY = container.clientHeight - menu.offsetHeight;

      const [rawX, rawY] = cursorPos;
      const x = Math.max(0, Math.min(rawX, maxX));
      const y = Math.max(0, Math.min(rawY, maxY));

      if (x !== rawX || y !== rawY) {
        setCursorPos([x, y]);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [contextMenuOpen]);
  const stageScale = useViewportStore((s) => s.stageScale);
  const stagePosition = useViewportStore((s) => s.stagePosition);
  const setStageScale = useViewportStore((s) => s.setStageScale);
  const setStagePosition = useViewportStore((s) => s.setStagePosition);
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const stage = e.target.getStage();
    if (!stage) return;

    const oldScale = stage.scaleX();

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);
    stage.batchDraw();

    setStageScale(newScale);
    setStagePosition(newPos);
  };
  const stageRef = useRef<Konva.Stage>(null);
  useEffect(() => {
    if (!pgParentRef.current || !stageRef.current) return;

    const container = pgParentRef.current;
    const centerX = container.clientWidth / 2;
    const centerY = container.clientHeight / 2;

    stageRef.current.position({ x: centerX, y: centerY });
    setStagePosition({ x: centerX, y: centerY });
  }, [dimensions.width, dimensions.height]);
  const VIRTUAL_RADIUS = 2000;
  const WORLD_RADIUS = 5000;
  const [canvasCenterCoords, setCanvasCenterCoords] = useState({ x: 0, y: 0 });
  const [worldCursorCoords, setWorldCursorCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!stageRef.current || !pgParentRef.current) return;

    const stage = stageRef.current;
    const container = pgParentRef.current;

    const viewCenterX = container.clientWidth / 2;
    const viewCenterY = container.clientHeight / 2;

    const scale = stage.scaleX();
    const stagePos = stage.position();

    const worldX = (viewCenterX - stagePos.x) / scale;
    const worldY = (viewCenterY - stagePos.y) / scale;

    setCanvasCenterCoords({ x: worldX, y: worldY });
  }, [stagePosition, stageScale, dimensions]);
  const instanceData = useInstanceStore((s) => s.instance);

  const loadInstance = useInstanceStore((s) => s.loadInstanceFromLocalStorage);
  const saveInstance = useInstanceStore((s) => s.saveInstanceToLocalStorage);

  useEffect(() => {
    loadInstance();
  }, []);

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Ignore right-click
    if (e.evt.button !== 0) return;

    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const scale = stage.scaleX();
    const pos = stage.position();

    const worldX = (pointer.x - pos.x) / scale;
    const worldY = (pointer.y - pos.y) / scale;
  };
  const worldToScreen = (worldX: number, worldY: number) => {
    const scale = stageScale;
    const offsetX = stagePosition.x;
    const offsetY = stagePosition.y;

    return {
      left: worldX * scale + offsetX,
      top: worldY * scale + offsetY,
    };
  };
  const screenToWorld = (screenX: number, screenY: number) => {
    const scale = stageScale;
    const offsetX = stagePosition.x;
    const offsetY = stagePosition.y;

    const worldX = (screenX - offsetX) / scale;
    const worldY = (screenY - offsetY) / scale;

    return { x: worldX, y: worldY };
  };

  const [hoveredInstances, setHoveredInstances] = useState<PlaygroundObject[]>(
    []
  );
  const [cursorWorld, setCursorWorld] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!pgParentRef.current || !stageRef.current) return;

      const rect = pgParentRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const stage = stageRef.current;
      const scale = stage.scaleX();
      const pos = stage.position();

      const worldX = (screenX - pos.x) / scale;
      const worldY = (screenY - pos.y) / scale;

      setCursorWorld({ x: worldX, y: worldY });

      const hovered = instanceData.filter((inst) => {
        const w = 500; // your base size
        const size = w * scale;
        return (
          worldX >= inst.position.x - size / 2 / scale &&
          worldX <= inst.position.x + size / 2 / scale &&
          worldY >= inst.position.y - size / 2 / scale &&
          worldY <= inst.position.y + size / 2 / scale
        );
      });

      setHoveredInstances(hovered);
    };

    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, [instanceData, stageScale, stagePosition]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!draggingId) return;

      const { stageScale, stagePosition } = useViewportStore.getState();
      const screenX = e.clientX;
      const screenY = e.clientY;

      // Convert screen coords to world coords, minus drag offset
      const worldX = (screenX - dragOffset.x - stagePosition.x) / stageScale;
      const worldY = (screenY - dragOffset.y - stagePosition.y) / stageScale;

      const prev = useInstanceStore.getState().instance;
      const updated = prev.map((obj) =>
        obj.id === draggingId
          ? { ...obj, position: { x: worldX, y: worldY } }
          : obj
      );
      useInstanceStore.getState().setInstance(updated);
    };

    const stop = () => setDraggingId(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stop);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stop);
    };
  }, [draggingId, dragOffset]);
  function deleteBlock(id: string) {}
  return (
    <div
      ref={pgParentRef}
      onContextMenu={handleContextMenu}
      onMouseMove={(e) => {
        if (!pgParentRef.current) return;
        const bounds = pgParentRef.current.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const world = screenToWorld(mouseX, mouseY);
        setWorldCursorCoords(world);
      }}
      className="relative h-full overflow-hidden rounded-md shadow-xl select-none ring ring-rose-500/30 shadow-blue-900/20"
    >
      <MacMenubar save={() => saveInstance()} />

      <div className="absolute z-50 flex flex-col gap-2 m-2">
        <div className="px-3 py-1 text-xs text-white rounded bg-black/80 ring-1 ring-white/10">
          <div>
            Center: ({canvasCenterCoords.x.toFixed(1)},{" "}
            {canvasCenterCoords.y.toFixed(1)})
          </div>
          <div>
            Cursor: ({worldCursorCoords.x.toFixed(1)},{" "}
            {worldCursorCoords.y.toFixed(1)})
          </div>
          <div>
            {hoveredInstances
              .map((s) => ({ type: s.type, id: s.id }))
              .map(({ type, id }) => (
                <span key={id}>
                  {type}:{id}
                </span>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 px-3 py-1 text-xs text-white rounded bg-black/80 ring-1 ring-white/10 w-max">
          {instanceData.map((c) => {
            const isHovered = hoveredInstances.some((h) => h.id === c.id);

            return (
              <div className="flex flex-row items-center justify-center p-1 px-3 rounded-md ring-1 ring-pink-400">
                {c.type}
                <div className="">
                  <button
                    onClick={() => {}}
                    className="p-2 text-xs text-red-300 transition-all duration-75 hover:text-red-500"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {contextMenuOpen && (
        <CustomContextMenu
          position={{ x: cursorPos[0], y: cursorPos[1] }}
          open={contextMenuOpen}
          worldPosition={() => screenToWorld(cursorPos[0], cursorPos[1])}
          onOpenChange={setContextMenuOpen}
        />
      )}

      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={stageScale}
        scaleY={stageScale}
        draggable
        x={stagePosition.x}
        y={stagePosition.y}
        onDragMove={(e) => {
          const pos = e.target.position();
          setStagePosition({ x: pos.x, y: pos.y }); // updates live
        }}
        onDragEnd={(e) => {
          const stage = e.target.getStage();
          if (!stage) return;

          const scale = stage.scaleX();
          const containerWidth = dimensions.width;
          const containerHeight = dimensions.height;

          // Viewport size in canvas world units
          const viewHalfWidth = containerWidth / 2 / scale;
          const viewHalfHeight = containerHeight / 2 / scale;

          const proposedPos = e.target.position();

          // Center of viewport in canvas coordinates
          const centerX = (containerWidth / 2 - proposedPos.x) / scale;
          const centerY = (containerHeight / 2 - proposedPos.y) / scale;

          const distFromOrigin = Math.sqrt(centerX ** 2 + centerY ** 2);

          if (
            distFromOrigin + Math.max(viewHalfWidth, viewHalfHeight) >
            WORLD_RADIUS
          ) {
            // Reject drag by reverting to previous safe position
            stage.position(stagePosition);
            stage.batchDraw();
            return;
          }

          // Accept drag
          setStagePosition({
            x: proposedPos.x,
            y: proposedPos.y,
          });
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        dragBoundFunc={(pos) => {
          const centerX = dimensions.width / 2;
          const centerY = dimensions.height / 2;

          const dx = pos.x - centerX;
          const dy = pos.y - centerY;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance <= VIRTUAL_RADIUS) return pos;

          const angle = Math.atan2(dy, dx);

          return {
            x: centerX + VIRTUAL_RADIUS * Math.cos(angle),
            y: centerY + VIRTUAL_RADIUS * Math.sin(angle),
          };
        }}
      >
        <Layer></Layer>
      </Stage>
      {instanceData.map((c) => {
        const { left, top } = worldToScreen(c.position.x, c.position.y);
        const baseSize = 300;

        const isHovered = hoveredInstances.some((h) => h.id === c.id);

        return (
          <div
            key={c.id}
            className="absolute"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${(4 / 3) * baseSize}px`,
              height: `${baseSize}px`,
              transform: `translate(-50%, -50%) scale(${stageScale})`,
              transformOrigin: "center",
              zIndex: 20,
              pointerEvents: "auto",
            }}
          >
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                setDraggingId(c.id);

                const cardRect = (
                  e.currentTarget.parentElement as HTMLDivElement
                ).getBoundingClientRect();
                const offsetX = e.clientX - cardRect.left;
                const offsetY = e.clientY - cardRect.top;
                setDragOffset({ x: offsetX, y: offsetY });
              }}
              className="absolute top-0 right-0 m-4 text-white cursor-grab hover:text-pink-400"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <PlaygroundComponent obj={c} key={c.id} />
          </div>
        );
      })}
    </div>
  );
};

export default PlaygroundCanvas;
