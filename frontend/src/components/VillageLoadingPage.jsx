import { useEffect } from "react";
import villageLoading from "../assets/village_load.gif";
import "./VillageLoadingPage.css";

const LOADING_DURATION_MS = 3600;

function VillageLoadingPage({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, LOADING_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <main className="villageLoadingPage" aria-label="研究室へ移動中">
      <img alt="研究室へ移動中" className="villageLoadingImage" src={villageLoading} />
    </main>
  );
}

export default VillageLoadingPage;
