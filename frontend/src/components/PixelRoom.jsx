import { useEffect, useState } from "react";
import arrowDownImg from "../assets/controls/arrow-down.png";
import arrowLeftImg from "../assets/controls/arrow-left.png";
import arrowRightImg from "../assets/controls/arrow-right.png";
import arrowUpImg from "../assets/controls/arrow-up.png";
import {
  SHOW_GRID,
  defaultRoomTheme,
  floorFrameColors,
  floorTextureOptions,
  roomGrids,
  roomItems,
  tileTextures,
  wallFrameColors,
  wallTextureOptions,
} from "./pixelRoomConfig";
import "./PixelRoom.css";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function moveItem(item, deltaCol, deltaRow) {
  const grid = roomGrids[item.surface];
  const colSpan = item.colSpan ?? 1;
  const rowSpan = item.rowSpan ?? 1;
  const maxCol = grid.cols - colSpan + 1;
  const minRow =
    item.surface === "wall" && item.anchor === "bottomLeft" ? rowSpan : 1;
  const maxRow =
    item.anchor === "bottomLeft" ? grid.rows : grid.rows - rowSpan + 1;

  return {
    ...item,
    col: clamp(item.col + deltaCol, 1, maxCol),
    row: clamp(item.row + deltaRow, minRow, maxRow),
  };
}

function applySavedItem(item, savedItem) {
  return moveItem({
    ...item,
    col: savedItem.surface === item.surface ? savedItem.col ?? item.col : item.col,
    row: savedItem.surface === item.surface ? savedItem.row ?? item.row : item.row,
    colSpan:
      savedItem.surface === item.surface
        ? savedItem.colSpan ?? item.colSpan
        : item.colSpan,
    rowSpan:
      savedItem.surface === item.surface
        ? savedItem.rowSpan ?? item.rowSpan
        : item.rowSpan,
    z: item.z,
    anchor: savedItem.anchor ?? item.anchor,
  }, 0, 0);
}

function createInitialPlacedItems(itemDefinitions, savedLayout = [], ownedItemIds = []) {
  const savedItemsById = new Map(savedLayout.map((item) => [item.id, item]));
  const ownedItemIdSet = new Set(ownedItemIds);

  return itemDefinitions.flatMap((item) => {
    const savedItem = savedItemsById.get(item.id);

    if (item.isFixed) {
      return savedItem ? applySavedItem(item, savedItem) : item;
    }

    return savedItem && ownedItemIdSet.has(item.id)
      ? applySavedItem(item, savedItem)
      : [];
  });
}

function createSavedLayout(items) {
  return items.map(
    ({ id, surface, col, row, colSpan, rowSpan, z, anchor, isFixed }) => ({
      id,
      surface,
      col,
      row,
      colSpan,
      rowSpan,
      z,
      anchor,
      isFixed,
    }),
  );
}

function applyAvatar(items, avatarSrc) {
  return avatarSrc
    ? items.map((item) => item.id === "chara" ? { ...item, src: avatarSrc } : item)
    : items;
}

function createInitialRoomTheme(savedTheme = {}) {
  return {
    ...defaultRoomTheme,
    ...savedTheme,
  };
}

function getGridStyle(surface) {
  const grid = roomGrids[surface];

  return {
    gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
  };
}

function createGridCells(surface) {
  const grid = roomGrids[surface];

  return Array.from({ length: grid.cols * grid.rows }, (_, index) => {
    const isTopRow = index < grid.cols;
    const isLeftColumn = index % grid.cols === 0;

    return (
      <div
        className={`roomGridCell ${isTopRow ? "roomGridCellTop" : ""} ${
          isLeftColumn ? "roomGridCellLeft" : ""
        }`}
        key={`${surface}-grid-${index}`}
      />
    );
  });
}

function getItemStyle(item) {
  if (item.anchor === "bottomLeft") {
    const grid = roomGrids[item.surface];
    const colSpan = item.colSpan ?? 1;
    const rowSpan = item.rowSpan ?? 1;

    return {
      position: "absolute",
      left: `${((item.col - 1) / grid.cols) * 100}%`,
      bottom: `${((grid.rows - item.row) / grid.rows) * 100}%`,
      width: `${(colSpan / grid.cols) * 100}%`,
      height: `${(rowSpan / grid.rows) * 100}%`,
      zIndex: item.z ?? 1,
    };
  }

  const rowSpan = item.rowSpan ?? 1;

  return {
    gridColumn: `${item.col} / span ${item.colSpan ?? 1}`,
    gridRow: `${item.row} / span ${rowSpan}`,
    zIndex: item.z ?? 1,
  };
}

function RoomItem({ item, isEditing, isSelected, onActivate, onSelect }) {
  return (
    <img
      alt={item.alt}
      className={`roomItem ${item.className ?? ""} ${
        isEditing ? "roomItemEditable" : ""
      } ${isSelected ? "roomItemSelected" : ""}`}
      onClick={
        isEditing
          ? () => onSelect(item.id)
          : ["bulletin_board", "game_cabinet", "quest_board"].includes(item.id)
            ? () => onActivate?.(item.id)
            : undefined
      }
      src={item.src}
      style={getItemStyle(item)}
    />
  );
}

function RoomBag({ items, onAddItem }) {
  return (
    <div className="roomBag" aria-label="Furniture bag">
      <span className="roomBagLabel">家具バッグ</span>
      {items.length > 0 ? (
        <div className="roomBagItems">
          {items.map((item) => (
            <button
              className="roomBagItem"
              key={item.id}
              onClick={() => onAddItem(item.id)}
              type="button"
            >
              <img alt="" className="roomBagItemImage" src={item.src} />
              <span>{item.name ?? item.id}</span>
            </button>
          ))}
        </div>
      ) : (
        <span className="roomBagEmpty">All placed</span>
      )}
    </div>
  );
}

function ArrowButton({ alt, disabled, icon, onClick }) {
  return (
    <button
      aria-label={alt}
      className="roomMoveButton roomArrowButton"
      disabled={disabled}
      onClick={onClick}
      title={alt}
      type="button"
    >
      <img alt="" className="roomArrowIcon" src={icon} />
    </button>
  );
}

function RoomGridOverlay({ surface }) {
  return (
    <div className="roomGridOverlay" style={getGridStyle(surface)}>
      {createGridCells(surface)}
    </div>
  );
}

function createTexturePanels(count, className, textureId) {
  const texture = tileTextures[textureId];
  return Array.from({ length: count }, (_, index) => (
    <div
      className={className}
      key={`${textureId}-${index}`}
      style={{
        backgroundImage: `url(${Array.isArray(texture) ? texture[index % texture.length] : texture})`,
      }}
    />
  ));
}

function MaterialSelect({ label, options, value, level, onChange, ownedItemIds = [] }) {
  const ownedItemIdSet = new Set(ownedItemIds);
  const unlockedOptions = options.filter(
    (option) => level >= option.minLevel && (!option.purchaseId || ownedItemIdSet.has(option.purchaseId)),
  );

  return (
    <label className="roomMaterialSelect">
      <span>{label}</span>
      <select
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {unlockedOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function WallSurface({
  items,
  isEditing,
  onActivateItem,
  selectedItemId,
  onSelectItem,
  wallTexture,
}) {
  return (
    <div className="roomSurface roomWallSurface">
      <div className="roomWallTextureLayer">
        {createTexturePanels(4, "roomWallTexturePanel", wallTexture)}
      </div>

      <div
        className={`roomObjectLayer roomWallObjectLayer ${
          isEditing ? "roomObjectLayerEditing" : ""
        }`}
        style={getGridStyle("wall")}
      >
        {items.map((item) => (
          <RoomItem
            item={item}
            isEditing={isEditing}
            isSelected={selectedItemId === item.id}
            key={item.id}
            onActivate={onActivateItem}
            onSelect={onSelectItem}
          />
        ))}
      </div>

      {(SHOW_GRID || isEditing) && <RoomGridOverlay surface="wall" />}
    </div>
  );
}

function RoomSurface({
  surface,
  items,
  isEditing,
  selectedItemId,
  onSelectItem,
  onActivateItem,
  textureId,
}) {
  const gridStyle = getGridStyle(surface);

  return (
    <div
      className={`roomSurface ${
        surface === "wall" ? "roomWallSurface" : "roomFloorSurface"
      }`}
    >
      <div
        className="roomFloorTextureLayer"
      >
        {createTexturePanels(16, "roomFloorTexturePanel", textureId)}
      </div>

      <div
        className={`roomObjectLayer ${
          isEditing ? "roomObjectLayerEditing" : ""
        }`}
        style={gridStyle}
      >
        {items.map((item) => (
          <RoomItem
            item={item}
            isEditing={isEditing}
            isSelected={selectedItemId === item.id}
            key={item.id}
            onActivate={onActivateItem}
            onSelect={onSelectItem}
          />
        ))}
      </div>

      {(SHOW_GRID || isEditing) && <RoomGridOverlay surface={surface} />}
    </div>
  );
}

function PixelRoom({
  avatarSrc,
  level,
  ownedItemIds = [],
  savedLayout = [],
  savedTheme = {},
  onSaveLayout,
  onOpenBulletinBoard,
  onOpenGameSelect,
  onOpenQuestBoard,
  readonly = false,
}) {
  const [items, setItems] = useState(() =>
    applyAvatar(createInitialPlacedItems(roomItems, savedLayout, ownedItemIds), avatarSrc),
  );
  const [roomTheme, setRoomTheme] = useState(() =>
    createInitialRoomTheme(savedTheme),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    setItems(applyAvatar(createInitialPlacedItems(roomItems, savedLayout, ownedItemIds), avatarSrc));
    setRoomTheme(createInitialRoomTheme(savedTheme));
  }, [avatarSrc, ownedItemIds, savedLayout, savedTheme]);

  useEffect(() => {
    if (readonly) {
      setIsEditing(false);
      setSelectedItemId(null);
    }
  }, [readonly]);

  const placedItemIds = new Set(items.map((item) => item.id));
  const ownedItemIdSet = new Set(ownedItemIds);
  const bagItems = roomItems.filter(
    (item) =>
      !item.isFixed && ownedItemIdSet.has(item.id) && !placedItemIds.has(item.id),
  );
  const wallItems = items.filter((item) => item.surface === "wall");
  const floorItems = items.filter((item) => item.surface === "floor");
  const selectedItem = items.find((item) => item.id === selectedItemId);

  const handleActivateItem = (itemId) => {
    if (itemId === "bulletin_board") onOpenBulletinBoard?.();
    if (itemId === "game_cabinet") onOpenGameSelect?.();
    if (itemId === "quest_board") onOpenQuestBoard?.();
  };

  const saveRoomState = (nextItems, nextTheme = roomTheme) => {
    if (readonly) {
      return;
    }

    onSaveLayout?.({
      items: createSavedLayout(nextItems),
      theme: nextTheme,
    });
  };

  const handleToggleEditing = () => {
    if (readonly) {
      return;
    }

    setIsEditing((current) => !current);
    setSelectedItemId(null);
  };

  const handleMoveSelectedItem = (deltaCol, deltaRow) => {
    if (readonly || !selectedItemId) {
      return;
    }

    setItems((currentItems) => {
      const nextItems = currentItems.map((item) =>
        item.id === selectedItemId ? moveItem(item, deltaCol, deltaRow) : item,
      );

      saveRoomState(nextItems);
      return nextItems;
    });
  };

  const handleAddItem = (itemId) => {
    if (readonly) {
      return;
    }

    const itemToAdd = roomItems.find((item) => item.id === itemId);

    if (!itemToAdd || itemToAdd.isFixed || !ownedItemIdSet.has(itemToAdd.id)) {
      return;
    }

    setItems((currentItems) => {
      if (currentItems.some((item) => item.id === itemId)) {
        return currentItems;
      }

      const nextItems = [...currentItems, moveItem(itemToAdd, 0, 0)];
      saveRoomState(nextItems);
      setSelectedItemId(itemId);
      return nextItems;
    });
  };

  const handleRemoveSelectedItem = () => {
    if (readonly || !selectedItem || selectedItem.isFixed) {
      return;
    }

    setItems((currentItems) => {
      const nextItems = currentItems.filter(
        (item) => item.id !== selectedItem.id,
      );

      saveRoomState(nextItems);
      setSelectedItemId(null);
      return nextItems;
    });
  };

  const handleChangeTheme = (surface, value) => {
    if (readonly) {
      return;
    }

    setRoomTheme((currentTheme) => {
      const nextTheme = {
        ...currentTheme,
        [surface]: value,
      };

      saveRoomState(items, nextTheme);
      return nextTheme;
    });
  };

  return (
    <div className={`roomEditorShell ${isEditing ? "roomEditorShellEditing" : ""}`}>
      {!readonly && (
        <div className="roomEditBar">
          <button
            className="compactButton secondaryButton"
            onClick={handleToggleEditing}
            type="button"
          >
            {isEditing ? "編集完了" : "家具を編集"}
          </button>

          {isEditing && (
            <div className="roomMoveControls">
              <span className="roomSelectedLabel">
                {selectedItem ? selectedItem.name ?? selectedItem.id : "家具を選択してください"}
              </span>
              <MaterialSelect
                label="壁"
                level={level}
                onChange={(value) => handleChangeTheme("wall", value)}
                options={wallTextureOptions}
                ownedItemIds={ownedItemIds}
                value={roomTheme.wall}
              />
              <MaterialSelect
                label="床"
                level={level}
                onChange={(value) => handleChangeTheme("floor", value)}
                options={floorTextureOptions}
                ownedItemIds={ownedItemIds}
                value={roomTheme.floor}
              />
              <ArrowButton
                alt="上へ移動"
                disabled={!selectedItem}
                icon={arrowUpImg}
                onClick={() => handleMoveSelectedItem(0, -1)}
              />
              <ArrowButton
                alt="左へ移動"
                disabled={!selectedItem}
                icon={arrowLeftImg}
                onClick={() => handleMoveSelectedItem(-1, 0)}
              />
              <ArrowButton
                alt="右へ移動"
                disabled={!selectedItem}
                icon={arrowRightImg}
                onClick={() => handleMoveSelectedItem(1, 0)}
              />
              <ArrowButton
                alt="下へ移動"
                disabled={!selectedItem}
                icon={arrowDownImg}
                onClick={() => handleMoveSelectedItem(0, 1)}
              />
              <button
                className="roomMoveButton roomRemoveButton"
                disabled={!selectedItem || selectedItem.isFixed}
                onClick={handleRemoveSelectedItem}
                type="button"
              >
                削除
              </button>
            </div>
          )}
        </div>
      )}

      {!readonly && isEditing && (
        <RoomBag items={bagItems} onAddItem={handleAddItem} />
      )}

      <div
        className="isoRoom"
        aria-label={`room level ${level}`}
        style={{
          "--room-wall-frame": wallFrameColors[roomTheme.wall] ?? wallFrameColors.labWall,
          "--room-floor-frame": floorFrameColors[roomTheme.floor] ?? floorFrameColors.labFloor,
        }}
      >

        <WallSurface
          items={wallItems}
          isEditing={isEditing}
        onActivateItem={handleActivateItem}
          onSelectItem={setSelectedItemId}
          selectedItemId={selectedItemId}
          wallTexture={roomTheme.wall}
        />
        <RoomSurface
          surface="floor"
          items={floorItems}
        isEditing={isEditing}
        onActivateItem={handleActivateItem}
          onSelectItem={setSelectedItemId}
          selectedItemId={selectedItemId}
          textureId={roomTheme.floor}
        />
      </div>
    </div>
  );
}

export default PixelRoom;
