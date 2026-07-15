import izumiAvatar from "../assets/izumi.gif";
import naganoAvatar from "../assets/avatars/nagano256.gif";
import abeAvatar from "../assets/avatars/abe256.gif";
import daikiAvatar from "../assets/avatars/daiki256.gif";

export const avatarAssets = {
  izumi: izumiAvatar,
  nagano: naganoAvatar,
  abe: abeAvatar,
  daiki: daikiAvatar,
};

export function getAvatarImage(avatarId) {
  return avatarAssets[avatarId] ?? avatarAssets.izumi;
}
