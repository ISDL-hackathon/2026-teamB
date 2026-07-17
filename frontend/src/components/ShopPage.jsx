import { useMemo, useState } from "react";
import magicStreetImg from "../assets/shop/magic-street.png";
import robotImg from "../assets/shop/dopamine-robot.gif";
import gachaCoinImg from "../assets/gacha/coin128.png";
import { roomItems, roomThemePackages, tileTextures } from "./pixelRoomConfig";

const furnitureById = new Map(roomItems.map((item) => [item.id, item]));
const themePackageById = new Map(roomThemePackages.map((item) => [item.id, item]));
const functionalFurnitureIds = new Set([
  "bulletin_board",
  "quest_board",
  "game_cabinet",
]);

const furnitureStyleFilters = [
  { id: "all", label: "すべて" },
  { id: "lab", label: "研究室家具" },
  { id: "western", label: "洋風家具" },
  { id: "japanese", label: "和風家具" },
  { id: "palace", label: "宮殿風家具" },
];

const furnitureCategoryLabels = {
  lab: "研究室家具",
  western: "洋風家具",
  japanese: "和風家具",
  palace: "宮殿風家具",
};

const furnitureSurfaceFilters = [
  { id: "all", label: "すべて" },
  { id: "floor", label: "床置き" },
  { id: "wall", label: "壁掛け" },
];

const furnitureSurfaceLabels = {
  floor: "床置き",
  wall: "壁掛け",
};

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
        const isFunctional = functionalFurnitureIds.has(item.id);
        const canBuy =
          item.unlocked && !item.owned && currentPoint >= item.price;
        const buttonLabel = item.owned
          ? "購入済み"
          : item.unlocked
            ? "購入"
            : "ロック中";
        const category = item.category ?? furniture?.category;
        const categoryLabel = furnitureCategoryLabels[category] ?? category;
        const surface = item.surface ?? furniture?.surface;

        return (
          <div
            className={`furnitureShopItem ${
              !item.unlocked ? "furnitureShopItemLocked" : ""
            } ${isFunctional ? "furnitureShopItemFunctional" : ""}`}
            key={item.id}
          >
            <div className="furnitureShopPreview">
              {furniture && (
                <img alt="" className="furnitureShopImage" src={furniture.src} />
              )}
              {isFunctional && (
                <span className="furnitureRecommendedBadge">{"\u63a8\u5968"}</span>
              )}
            </div>

            <div className="furnitureShopInfo">
              <div className="furnitureShopTitleRow">
                <strong>{item.name}</strong>
                <span className="furnitureShopLevel">Lv.{item.min_level}</span>
              </div>
              <span className="furnitureShopMeta">
                {categoryLabel} / {furnitureSurfaceLabels[surface] ?? surface}
              </span>
              {isFunctional && (
                <span className="furnitureFeatureBadge">{"\u6a5f\u80fd\u89e3\u7981"}</span>
              )}
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

function ThemeShelf({ currentPoint, items, onPurchaseFurniture }) {
  return (
    <div className="furnitureShopGrid themeShopGrid">
      {items.map((item) => {
        const theme = themePackageById.get(item.id);
        if (!theme) return null;
        const wallTexture = tileTextures[theme.wall];
        const floorTexture = tileTextures[theme.floor];
        const wallPreview = Array.isArray(wallTexture) ? wallTexture[2] : wallTexture;
        const floorPreview = Array.isArray(floorTexture) ? floorTexture[0] : floorTexture;
        const canBuy = item.unlocked && !item.owned && currentPoint >= item.price;

        return (
          <div
            className={`furnitureShopItem themeShopItem ${!item.unlocked ? "furnitureShopItemLocked" : ""}`}
            key={item.id}
          >
            <div className="themePackagePreview" aria-hidden="true">
              <span style={{ backgroundImage: `url(${wallPreview})` }} />
              <span style={{ backgroundImage: `url(${floorPreview})` }} />
            </div>
            <div className="furnitureShopInfo">
              <div className="furnitureShopTitleRow">
                <strong>{item.name}</strong>
                <span className="furnitureShopLevel">Lv.{item.min_level}</span>
              </div>
              <span className="furnitureShopMeta">壁＋床セット</span>
              <span className="furnitureShopStatus">{getFurnitureStatus(item, currentPoint)}</span>
              <span className="furnitureShopPrice">{item.price} pt</span>
            </div>
            <button
              className="compactButton"
              disabled={!canBuy}
              onClick={() => onPurchaseFurniture(item.id)}
              type="button"
            >
              {item.owned ? "購入済み" : item.unlocked ? "購入" : "ロック中"}
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

function ShopPage({ onPurchaseFurniture, onPurchaseGachaCoin, room, setPage }) {
  const [shopTab, setShopTab] = useState("furniture");
  const [styleFilter, setStyleFilter] = useState("all");
  const [surfaceFilter, setSurfaceFilter] = useState("all");
  const [coinQuantity, setCoinQuantity] = useState(1);
  const shopItems = room?.shop_items ?? [];
  const currentPoint = room?.user?.point ?? 0;

  const filteredShopItems = useMemo(
    () =>
      shopItems.filter((item) => {
        const furniture = furnitureById.get(item.id);
        const category = item.category ?? furniture?.category;
        const surface = item.surface ?? furniture?.surface;

        return (
          category !== "theme" &&
          (styleFilter === "all" || category === styleFilter) &&
          (surfaceFilter === "all" || surface === surfaceFilter)
        );
      }),
    [shopItems, styleFilter, surfaceFilter],
  );
  const themeShopItems = shopItems.filter((item) => item.category === "theme");

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
              active={shopTab === "themes"}
              onClick={() => setShopTab("themes")}
            >
              内装
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
          ) : shopTab === "themes" ? (
            <ThemeShelf
              currentPoint={currentPoint}
              items={themeShopItems}
              onPurchaseFurniture={onPurchaseFurniture}
            />
          ) : (
            <>
            <div className="gachaCoinShopItem">
              <img alt="" className="gachaCoinIcon" src={gachaCoinImg} />
              <div>
                <strong>{"\u30ac\u30c1\u30e3\u30b3\u30a4\u30f3"}</strong>
                <p>{"\u30ac\u30c1\u30e3\u30921\u56de\u56de\u305b\u308b\u30b3\u30a4\u30f3"}</p>
                <span className="furnitureShopPrice">10 pt</span>
              </div>
              <div className="gachaCoinPurchaseControls">
                <label>
                  <span>購入枚数</span>
                  <input
                    max="99"
                    min="1"
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setCoinQuantity(Math.max(1, Math.min(99, Number.isFinite(value) ? Math.floor(value) : 1)));
                    }}
                    step="1"
                    type="number"
                    value={coinQuantity}
                  />
                </label>
                <small>合計 {coinQuantity * 10} pt</small>
                <button
                  disabled={currentPoint < coinQuantity * 10}
                  onClick={() => onPurchaseGachaCoin(coinQuantity)}
                  type="button"
                >
                  {"\u8cfc\u5165"}
                </button>
              </div>
              <button className="gachaCoinGoButton" onClick={() => setPage("gacha")} type="button">
                <span>ガチャマシンへ</span>
                <strong>ガチャを回しに行く　▶</strong>
              </button>
            </div>
            <div className="shopEmptyShelf" hidden>
              <strong>Coming soon</strong>
              <span>アイテムは次に追加予定です。</span>
            </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default ShopPage;
