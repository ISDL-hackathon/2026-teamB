import defaultIcon from "../assets/chara.png";
import icon1 from "../assets/icons/icon1.png";
import icon2 from "../assets/icons/icon2.png";
import icon3 from "../assets/icons/icon3.png";
import icon4 from "../assets/icons/icon4.png";
import icon5 from "../assets/icons/icon5.png";

export const iconAssets = {
  hero: defaultIcon,
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
};

export function getIconImage(iconId) {
  return iconAssets[iconId] ?? iconAssets.hero;
}
