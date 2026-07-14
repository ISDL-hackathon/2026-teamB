import PixelTown from "./PixelTown";

function VillageSlotSelectPage({
    currentUser,
    onSelectSlot,
    setPage,
    village,
    villageSlots,
}) {
    return (
        <div className="card villageCard">
            <h2>共有街の場所を選択</h2>

            <PixelTown
                level={village?.level ?? 1}
                mode="select"
                slots={villageSlots}
                onSlotSelect={onSelectSlot}
            />
        </div>
    );
}

export default VillageSlotSelectPage;