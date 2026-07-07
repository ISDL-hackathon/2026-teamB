import { useEffect, useState } from "react";
import charaImg from "../assets/chara.png";
import wallImg from "../assets/room/wall.png";
import floorImg from "../assets/room/floor.png";
import bedImg from "../assets/furniture/bed_pink.png";
import bookshelfImg from "../assets/furniture/bookshelf.png";
import clockImg from "../assets/furniture/clock.png";
import shelfImg from "../assets/furniture/shelf.png";
import stoveImg from "../assets/furniture/suto-bu.png";
import windowImg from "../assets/furniture/window.png";
import "./PixelRoom.css";

const SHOW_GRID = false;

const roomGrids = {
  wall: {
    cols: 12,
    rows: 3,
  },
  floor: {
    cols: 12,
    rows: 7,
  },
};

const tileTextures = {
  wall: wallImg,
  floor: floorImg,
};

const roomItems = [
  {
    id: "window",
    surface: "wall",
    minLevel: 1,
    src: windowImg,
    alt: "window",
    col: 8,
    row: 2,
    colSpan: 2,
    rowSpan: 2,
    z: 6,
    anchor: "bottomLeft",
  },
  {
    id: "clock",
    surface: "wall",
    minLevel: 1,
    src: clockImg,
    alt: "clock",
    col: 11,
    row: 1,
    colSpan: 1,
    rowSpan: 1,
    z: 7,
    anchor: "bottomLeft",
  },
  {
    id: "stove",
    surface: "wall",
    minLevel: 1,
    src: stoveImg,
    alt: "stove",
    col: 5,
    row: 3,
    colSpan: 2,
    rowSpan: 3,
    z: 7,
    anchor: "bottomLeft",
  },
  {
    id: "bookshelf",
    surface: "floor",
    minLevel: 3,
    src: bookshelfImg,
    alt: "bookshelf",
    col: 2,
    row: 1,
    colSpan: 2,
    rowSpan: 3,
    z: 8,
    anchor: "bottomLeft",
  },
  {
    id: "shelf",
    surface: "floor",
    minLevel: 4,
    src: shelfImg,
    alt: "shelf",
    col: 6,
    row: 1,
    colSpan: 2,
    rowSpan: 3,
    z: 8,
    anchor: "bottomLeft",
  },
  {
    id: "bed",
    surface: "floor",
    minLevel: 5,
    src: bedImg,
    alt: "bed",
    col: 8,
    row: 3,
    colSpan: 2,
    rowSpan: 2,
    z: 7,
    anchor: "bottomLeft",
  },
  {
    id: "chara",
    surface: "floor",
    minLevel: 1,
    src: charaImg,
    alt: "character",
    col: 6,
    row: 5,
    colSpan: 1.5,
    rowSpan: 1.5,
    z: 10,
    className: "roomChara",
    anchor: "bottomLeft",
  },
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createTiles(surface, texture) {
  const grid = roomGrids[surface];

  return Array.from({ length: grid.cols * grid.rows }, (_, index) => ({
    id: `${surface}-${index}`,
    texture,
  }));
}

const roomTiles = {
  wall: createTiles("wall", "wall"),
  floor: createTiles("floor", "floor"),
};

function moveItem(item, deltaCol, deltaRow) {
  const grid = roomGrids[item.surface];
  const colSpan = item.colSpan ?? 1;
  const rowSpan = item.rowSpan ?? 1;
  const maxCol = grid.cols - colSpan + 1;
  const maxRow =
    item.anchor === "bottomLeft" ? grid.rows : grid.rows - rowSpan + 1;

  return {
    ...item,
    col: clamp(item.col + deltaCol, 1, maxCol),
    row: clamp(item.row + deltaRow, 1, maxRow),
  };
}

function applySavedLayout(items, savedLayout = []) {
  const savedItemsById = new Map(savedLayout.map((item) => [item.id, item]));

  return items.map((item) => {
    const savedItem = savedItemsById.get(item.id);

    if (!savedItem) {
      return item;
    }

    return {
      ...item,
      col: savedItem.col ?? item.col,
      row: savedItem.row ?? item.row,
      colSpan: savedItem.colSpan ?? item.colSpan,
      rowSpan: savedItem.rowSpan ?? item.rowSpan,
      z: savedItem.z ?? item.z,
      anchor: savedItem.anchor ?? item.anchor,
    };
  });
}

function createSavedLayout(items) {
  return items.map(
    ({ id, surface, col, row, colSpan, rowSpan, z, anchor }) => ({
      id,
      surface,
      col,
      row,
      colSpan,
      rowSpan,
      z,
      anchor,
    }),
  );
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

function RoomTile({ tile }) {
  return (
    <div
      className="roomTile"
      style={{
        backgroundImage: `url(${tileTextures[tile.texture]})`,
      }}
    />
  );
}

function RoomItem({ item, isEditing, isSelected, onSelect }) {
  return (
    <img
      alt={item.alt}
      className={`roomItem ${item.className ?? ""} ${
        isEditing ? "roomItemEditable" : ""
      } ${isSelected ? "roomItemSelected" : ""}`}
      onClick={isEditing ? () => onSelect(item.id) : undefined}
      src={item.src}
      style={getItemStyle(item)}
    />
  );
}

function RoomGridOverlay({ surface }) {
  return (
    <div className="roomGridOverlay" style={getGridStyle(surface)}>
      {createGridCells(surface)}
    </div>
  );
}

function WallSurface({ items, isEditing, selectedItemId, onSelectItem }) {
  return (
    <div className="roomSurface roomWallSurface">
      <div className="roomWallTextureLayer">
        <div className="roomWallTexturePanel" />
        <div className="roomWallTexturePanel" />
        <div className="roomWallTexturePanel" />
      </div>

      <div
        className={`roomObjectLayer roomWallObjectLayer ${
          isEditing ? "roomObjectLayerEditing" : ""
        }`}
        style={{
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
        }}
      >
        {items.map((item) => (
          <RoomItem
            item={item}
            isEditing={isEditing}
            isSelected={selectedItemId === item.id}
            key={item.id}
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
  tiles,
  items,
  isEditing,
  selectedItemId,
  onSelectItem,
}) {
  const gridStyle = getGridStyle(surface);

  return (
    <div
      className={`roomSurface ${
        surface === "wall" ? "roomWallSurface" : "roomFloorSurface"
      }`}
    >
      <div className="roomTileLayer" style={gridStyle}>
        {tiles.map((tile) => (
          <RoomTile tile={tile} key={tile.id} />
        ))}
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
            onSelect={onSelectItem}
          />
        ))}
      </div>

      {(SHOW_GRID || isEditing) && <RoomGridOverlay surface={surface} />}
    </div>
  );
}

function PixelRoom({ level, savedLayout = [], onSaveLayout }) {
  const [items, setItems] = useState(() =>
    applySavedLayout(roomItems, savedLayout),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    setItems(applySavedLayout(roomItems, savedLayout));
  }, [savedLayout]);

  const visibleItems = items.filter((item) => level >= item.minLevel);
  const wallItems = visibleItems.filter((item) => item.surface === "wall");
  const floorItems = visibleItems.filter((item) => item.surface === "floor");
  const selectedItem = visibleItems.find((item) => item.id === selectedItemId);

  const handleToggleEditing = () => {
    setIsEditing((current) => !current);
    setSelectedItemId(null);
  };

  const handleMoveSelectedItem = (deltaCol, deltaRow) => {
    if (!selectedItemId) {
      return;
    }

    setItems((currentItems) => {
      const nextItems = currentItems.map((item) =>
        item.id === selectedItemId ? moveItem(item, deltaCol, deltaRow) : item,
      );

      onSaveLayout?.(createSavedLayout(nextItems));
      return nextItems;
    });
  };

  return (
    <div className="isoRoom" aria-label={`room level ${level}`}>
      <div className="roomEditBar">
        <button
          className="compactButton secondaryButton"
          onClick={handleToggleEditing}
          type="button"
        >
          {isEditing ? "Done" : "Edit"}
        </button>

        {isEditing && (
          <div className="roomMoveControls">
            <span className="roomSelectedLabel">
              {selectedItem ? selectedItem.id : "Select item"}
            </span>
            <button
              className="roomMoveButton"
              disabled={!selectedItem}
              onClick={() => handleMoveSelectedItem(0, -1)}
              type="button"
            >
              ↑
            </button>
            <button
              className="roomMoveButton"
              disabled={!selectedItem}
              onClick={() => handleMoveSelectedItem(-1, 0)}
              type="button"
            >
              ←
            </button>
            <button
              className="roomMoveButton"
              disabled={!selectedItem}
              onClick={() => handleMoveSelectedItem(1, 0)}
              type="button"
            >
              →
            </button>
            <button
              className="roomMoveButton"
              disabled={!selectedItem}
              onClick={() => handleMoveSelectedItem(0, 1)}
              type="button"
            >
              ↓
            </button>
          </div>
        )}
      </div>

      <WallSurface
        items={wallItems}
        isEditing={isEditing}
        onSelectItem={setSelectedItemId}
        selectedItemId={selectedItemId}
      />
      <RoomSurface
        surface="floor"
        tiles={roomTiles.floor}
        items={floorItems}
        isEditing={isEditing}
        onSelectItem={setSelectedItemId}
        selectedItemId={selectedItemId}
      />
    </div>
  );
}

export default PixelRoom;
