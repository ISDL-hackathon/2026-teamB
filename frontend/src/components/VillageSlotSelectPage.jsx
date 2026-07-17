import { getAvatarImage } from "./avatarAssets";
import PixelTown from "./PixelTown";

function VillageSlotSelectPage({
    currentUser,
    onSelectSlot,
    setPage,
    village,
    villageSlots,
}) {
    const hasAvailableSlot = villageSlots.some((slot) => !slot.occupied);
    const hasSelectedSlot = Boolean(currentUser.village_slot_id);

    return (
        <div className="card villageCard">
            <h2>{hasSelectedSlot ? "座席を変更する" : "座席を選ぶ"}</h2>

            {hasAvailableSlot ? (
                <p>
                    空いている座席を選択してください。座席はあとから変更できます。
                </p>
            ) : (
                <p className="villageSlotNotice" role="status">
                    現在、空いている座席がありません。ホームへ進み、あとからもう一度お試しください。
                </p>
            )}

            <PixelTown
                centralAvatarSrc={getAvatarImage(currentUser.selected_avatar)}
                level={village?.level ?? 1}
                mode="select"
                slots={villageSlots}
                onSlotSelect={onSelectSlot}
            />

            <div className="villageSlotActions">
                <button
                    className={hasAvailableSlot ? "secondaryButton" : undefined}
                    onClick={() => setPage("home")}
                    type="button"
                >
                    {hasSelectedSlot ? "変更せずホームへ戻る" : "あとで選ぶ"}
                </button>
            </div>
        </div>
    );
}

export default VillageSlotSelectPage;
