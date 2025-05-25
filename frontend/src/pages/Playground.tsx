import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import { useRef, useState, useEffect } from "preact/hooks";
import { nanoid } from "nanoid";

function RequestBox({ id, x, y, onDelete, onContextMenu, onDrag }) {
  const boxRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const bounds = boxRef.current.parentElement.getBoundingClientRect();
      onDrag(id, {
        x: e.clientX - bounds.left - offset.current.x,
        y: e.clientY - bounds.top - offset.current.y,
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [id, onDrag]);

  return (
    <div
      ref={boxRef}
      class="absolute pointer-events-auto bg-[#2a2a2a] rounded-lg p-4 shadow-lg border border-gray-700 w-max space-y-4"
      style={{ left: x, top: y }}
      onContextMenu={onContextMenu}
    >
      <div class="flex flex-col gap-2 w-full">
        <h3 class="text-sm font-bold text-white">Request</h3>

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
            <option value="POST">POST</option>
            <option value="READ">READ</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
          <div class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            ▼
          </div>
        </div>

        <div class="w-full flex justify-center pt-2">
          <div class="w-3 h-3 rounded-full bg-blue-500"></div>
        </div>
      </div>

      <div
        class="absolute w-4 h-4 bottom-1 right-1 rounded-full bg-white border border-gray-500 cursor-grab"
        onMouseDown={(e) => {
          isDragging.current = true;
          const bounds = boxRef.current.getBoundingClientRect();
          offset.current = {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top,
          };
        }}
      ></div>
    </div>
  );
}

const Playground = () => {
  const pixiRef = useRef(null);
  const htmlOverlayRef = useRef(null);
  const [boxes, setBoxes] = useState<{ id: string; x: number; y: number }[]>(
    []
  );
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    targetId: string;
  } | null>(null);

  const updateBoxPosition = (id, pos) => {
    setBoxes((prev) =>
      prev.map((box) => (box.id === id ? { ...box, ...pos } : box))
    );
  };

  useEffect(() => {
    const initPixi = async () => {
      const app = new Application();
      await app.init({ background: "#000000", resizeTo: window });
      pixiRef.current.appendChild(app.canvas);

      const MENU_TREE = [
        {
          label: "Create",
          children: [
            {
              label: "Request",
              onClick: (coords: { x: number; y: number }) => {
                setBoxes((prev) => [
                  ...prev,
                  { id: nanoid(), x: coords.x, y: coords.y },
                ]);
              },
            },
          ],
        },
      ];

      const createMenu = (items, x, y, closeAll, rootCoords) => {
        const container = new Container();
        const padding = 12;
        const itemHeight = 30;
        const width = 160;
        const height = items.length * itemHeight;

        const bg = new Graphics();
        bg.beginFill(0x1f1f24);
        bg.lineStyle(1, 0x3a3a3a);
        bg.drawRoundedRect(0, 0, width, height, 6);
        bg.endFill();
        container.addChild(bg);

        items.forEach((item, index) => {
          const text = new Text({
            text: item.label,
            style: new TextStyle({
              fill: "#e0e0e0",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }),
          });
          text.x = padding;
          text.y = index * itemHeight + 6;

          const hitArea = new Graphics();
          hitArea.beginFill(0xffffff, 0);
          hitArea.drawRect(0, index * itemHeight, width, itemHeight);
          hitArea.endFill();
          hitArea.eventMode = "static";
          hitArea.cursor = "pointer";

          let submenu = null;
          let hideTimer = null;

          const cancelHide = () => {
            if (hideTimer) {
              clearTimeout(hideTimer);
              hideTimer = null;
            }
          };

          const tryHideSubmenu = () => {
            hideTimer = setTimeout(() => {
              if (submenu) {
                container.removeChild(submenu);
                submenu.destroy({ children: true });
                submenu = null;
              }
            }, 150);
          };

          hitArea.on("pointerover", () => {
            cancelHide();
            if (item.children && !submenu) {
              submenu = createMenu(
                item.children,
                width + 4,
                index * itemHeight,
                closeAll,
                rootCoords
              );
              container.addChild(submenu);

              submenu.eventMode = "static";
              submenu.on("pointerover", cancelHide);
              submenu.on("pointerout", tryHideSubmenu);
            }
          });

          hitArea.on("pointerout", () => {
            tryHideSubmenu();
          });

          hitArea.on("pointerdown", (e) => {
            e.stopPropagation();
            if (item.onClick) {
              item.onClick(rootCoords);
              closeAll();
            }
          });

          container.addChild(hitArea);
          container.addChild(text);
        });

        container.x = x;
        container.y = y;
        container.eventMode = "static";
        return container;
      };

      const stage = app.stage;
      let activeMenu = null;

      const closeMenu = () => {
        if (activeMenu) {
          stage.removeChild(activeMenu);
          activeMenu = null;
        }
      };

      app.canvas.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        closeMenu();
        const bounds = app.canvas.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        const coords = { x, y };
        const menu = createMenu(MENU_TREE, x, y, closeMenu, coords);
        activeMenu = menu;
        stage.addChild(menu);
      });

      app.canvas.addEventListener("click", () => {
        closeMenu();
      });
    };

    initPixi();
  }, []);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div class="relative w-full h-full">
      <div
        ref={pixiRef}
        class="absolute top-0 left-0 w-full h-full z-0 p-2"
      ></div>
      <div
        ref={htmlOverlayRef}
        class="absolute top-0 left-0 w-full h-full z-10 p-2 pointer-events-none"
      >
        {boxes.map((box) => (
          <RequestBox
            key={box.id}
            id={box.id}
            x={box.x}
            y={box.y}
            onDelete={() =>
              setBoxes((prev) => prev.filter((b) => b.id !== box.id))
            }
            onContextMenu={(e) => {
              e.preventDefault();
              const bounds = htmlOverlayRef.current?.getBoundingClientRect();
              const relX = e.clientX - bounds.left;
              const relY = e.clientY - bounds.top;
              setContextMenu({
                x: relX,
                y: relY,
                targetId: box.id,
              });
            }}
            onDrag={updateBoxPosition}
          />
        ))}

        {contextMenu && (
          <div
            class="absolute html-context-menu pointer-events-auto bg-[#1f1f24] border border-gray-700 text-white text-sm rounded shadow z-50"
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`,
            }}
            onClick={() => {
              setBoxes((prev) =>
                prev.filter((box) => box.id !== contextMenu.targetId)
              );
              setContextMenu(null);
            }}
          >
            <div class="px-4 py-2 hover:bg-red-600/20 cursor-pointer gap-2">
              🗑 Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playground;
