import defaultIcon from "../assets/chara.png";
import icon1 from "../assets/icons/icon1.png";

export const iconAssets = {
  hero: defaultIcon,
  icon1,
};

export function getIconImage(iconId) {
  return iconAssets[iconId] ?? iconAssets.hero;
}
