import { useState } from "react";
import magicStreetImg from "../assets/shop/magic-street.png";
import robotImg from "../assets/shop/dopamine-robot.png";
import { roomItems } from "./pixelRoomConfig";

const furnitureById = new Map(roomItems.map((item) => [item.id, item]));

function ShopCategoryButton({ active, children, onClick }) {
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

function FurnitureShelf({ currentPoint, items, onPurchaseFurniture }) {
  return (
    <div className="furnitureShopGrid">
      {items.map((item) => {
        const furniture = furnitureById.get(item.id);
        const canBuy =
          item.unlocked && !item.owned && currentPoint >= item.price;

        return (
          <div className="furnitureShopItem" key={item.id}>
            {furniture && (
              <img alt="" className="furnitureShopImage" src={furniture.src} />
            )}
            <div>
              <strong>{item.name}</strong>
              <span>{item.price} pt</span>
            </div>
            <button
              className="compactButton"
              disabled={!canBuy}
              onClick={() => onPurchaseFurniture(item.id)}
              type="button"
            >
              {item.owned
                ? "Owned"
                : item.unlocked
                  ? "Buy"
                  : `Lv.${item.min_level}`}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ShopPage({ onPurchaseFurniture, room, setPage }) {
  const [category, setCategory] = useState("furniture");
  const shopItems = room?.shop_items ?? [];
  const currentPoint = room?.user?.point ?? 0;

  return (
    <>
      <div className="pageHeader shopPageHeader">
        <button className="secondaryButton" onClick={() => setPage("home")}>
          ホームへ
        </button>
        <button className="secondaryButton" onClick={() => setPage("room")}>
          個人ルーム
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
              <h2>Dopamine Store</h2>
            </div>
            <strong>{currentPoint} pt</strong>
          </div>

          <div className="shopCategoryRow">
            <ShopCategoryButton
              active={category === "furniture"}
              onClick={() => setCategory("furniture")}
            >
              家具
            </ShopCategoryButton>
            <ShopCategoryButton
              active={category === "items"}
              onClick={() => setCategory("items")}
            >
              アイテム
            </ShopCategoryButton>
          </div>

          {category === "furniture" ? (
            <FurnitureShelf
              currentPoint={currentPoint}
              items={shopItems}
              onPurchaseFurniture={onPurchaseFurniture}
            />
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
