import { useMemo, useState } from "react";
import magicStreetImg from "../assets/shop/magic-street.png";
import robotImg from "../assets/shop/dopamine-robot.gif";
import { roomItems } from "./pixelRoomConfig";

const furnitureById = new Map(roomItems.map((item) => [item.id, item]));

const furnitureStyleFilters = [
  { id: "all", label: "All" },
  { id: "lab", label: "研究室家具" },
  { id: "western", label: "洋風家具" },
];

const furnitureSurfaceFilters = [
  { id: "all", label: "All" },
  { id: "floor", label: "Floor" },
  { id: "wall", label: "Wall" },
];

function ShopFilterButton({ active, children, onClick }) {
  return (
    <button
      className={`shopCategoryButton ${active ? "shopCategoryButtonActive" : ""}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function getFurnitureStatus(item, currentPoint) {
  if (item.owned) {
    return "購入済み";
  }

  if (!item.unlocked) {
    return `Lv.${item.min_level}で解放`;
  }

  return currentPoint >= item.price ? "購入できます" : "ポイント不足";
}

function FurnitureShelf({ currentPoint, items, onPurchaseFurniture }) {
  if (items.length === 0) {
    return (
      <div className="shopEmptyShelf">
        <strong>商品がありません</strong>
        <span>別の条件を選んでください。</span>
      </div>
    );
  }

  return (
    <div className="furnitureShopGrid">
      {items.map((item) => {
        const furniture = furnitureById.get(item.id);
        const canBuy =
          item.unlocked && !item.owned && currentPoint >= item.price;
        const buttonLabel = item.owned
          ? "購入済み"
          : item.unlocked
            ? "購入"
            : "ロック中";
        const categoryLabel =
          (item.category ?? furniture?.category) === "lab"
            ? "研究室家具"
            : "洋風家具";

        return (
          <div
            className={`furnitureShopItem ${
              !item.unlocked ? "furnitureShopItemLocked" : ""
            }`}
            key={item.id}
          >
            <div className="furnitureShopPreview">
              {furniture && (
                <img alt="" className="furnitureShopImage" src={furniture.src} />
              )}
            </div>

            <div className="furnitureShopInfo">
              <div className="furnitureShopTitleRow">
                <strong>{item.name}</strong>
                <span className="furnitureShopLevel">Lv.{item.min_level}</span>
              </div>
              <span className="furnitureShopMeta">
                {categoryLabel} /{" "}
                {item.surface ?? furniture?.surface}
              </span>
              <span className="furnitureShopStatus">
                {getFurnitureStatus(item, currentPoint)}
              </span>
              <span className="furnitureShopPrice">{item.price} pt</span>
            </div>

            <button
              className="compactButton"
              disabled={!canBuy}
              onClick={() => onPurchaseFurniture(item.id)}
              type="button"
            >
              {buttonLabel}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function FilterGroup({ label, filters, value, onChange }) {
  return (
    <div className="shopFilterGroup">
      <span>{label}</span>
      <div className="shopFilterButtons">
        {filters.map((filter) => (
          <ShopFilterButton
            active={value === filter.id}
            key={filter.id}
            onClick={() => onChange(filter.id)}
          >
            {filter.label}
          </ShopFilterButton>
        ))}
      </div>
    </div>
  );
}

function ShopPage({ onPurchaseFurniture, room, setPage }) {
  const [shopTab, setShopTab] = useState("furniture");
  const [styleFilter, setStyleFilter] = useState("all");
  const [surfaceFilter, setSurfaceFilter] = useState("all");
  const shopItems = room?.shop_items ?? [];
  const currentPoint = room?.user?.point ?? 0;

  const filteredShopItems = useMemo(
    () =>
      shopItems.filter((item) => {
        const furniture = furnitureById.get(item.id);
        const category = item.category ?? furniture?.category;
        const surface = item.surface ?? furniture?.surface;

        return (
          (styleFilter === "all" || category === styleFilter) &&
          (surfaceFilter === "all" || surface === surfaceFilter)
        );
      }),
    [shopItems, styleFilter, surfaceFilter],
  );

  return (
    <>
      <div className="pageHeader shopPageHeader">
        <button className="secondaryButton" onClick={() => setPage("home")}>
          ホームへ
        </button>
        <button className="secondaryButton" onClick={() => setPage("room")}>
          個人ルームへ
        </button>
      </div>

      <section className="shopScene" aria-label="shop">
        <div
          className="shopBackdrop"
          style={{ backgroundImage: `url(${magicStreetImg})` }}
        >
          <div className="shopBackdropShade" />
          <img alt="" className="shopRobotImage" src={robotImg} />
        </div>

        <div className="shopCounterPanel">
          <div className="shopCounterHeader">
            <div>
              <span className="eyebrow">SHOP</span>
              <h2>家具ショップ</h2>
            </div>
            <div className="shopPointBadge">
              <span>所持ポイント</span>
              <strong>{currentPoint} pt</strong>
            </div>
          </div>

          <div className="shopCategoryRow">
            <ShopFilterButton
              active={shopTab === "furniture"}
              onClick={() => setShopTab("furniture")}
            >
              家具
            </ShopFilterButton>
            <ShopFilterButton
              active={shopTab === "items"}
              onClick={() => setShopTab("items")}
            >
              アイテム
            </ShopFilterButton>
          </div>

          {shopTab === "furniture" ? (
            <>
              <div className="shopFilterPanel">
                <FilterGroup
                  filters={furnitureStyleFilters}
                  label="種類"
                  onChange={setStyleFilter}
                  value={styleFilter}
                />
                <FilterGroup
                  filters={furnitureSurfaceFilters}
                  label="置き場所"
                  onChange={setSurfaceFilter}
                  value={surfaceFilter}
                />
              </div>

              <FurnitureShelf
                currentPoint={currentPoint}
                items={filteredShopItems}
                onPurchaseFurniture={onPurchaseFurniture}
              />
            </>
          ) : (
            <div className="shopEmptyShelf">
              <strong>Coming soon</strong>
              <span>アイテムは次に追加予定です。</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default ShopPage;
