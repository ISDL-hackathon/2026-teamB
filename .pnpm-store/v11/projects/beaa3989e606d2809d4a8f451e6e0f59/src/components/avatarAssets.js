import izumiAvatar from "../assets/izumi.gif";
import naganoAvatar from "../assets/avatars/nagano256.gif";
import abeAvatar from "../assets/avatars/abe256.gif";

export const avatarAssets = {
  izumi: izumiAvatar,
  nagano: naganoAvatar,
  abe: abeAvatar,
};

export function getAvatarImage(avatarId) {
  return avatarAssets[avatarId] ?? avatarAssets.izumi;
}
