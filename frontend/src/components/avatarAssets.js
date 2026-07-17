import izumiAvatar from "../assets/izumi.gif";
import naganoAvatar from "../assets/avatars/nagano256.gif";
import abeAvatar from "../assets/avatars/abe256.gif";
import daikiAvatar from "../assets/avatars/daiki256.gif";
import maieAvatar from "../assets/avatars/maie256.gif";
import giantRobotAvatar from "../assets/avatars/giant-robot256.gif";
import nariAvatar from "../assets/avatars/nari.gif";
import initialMaleAvatar from "../assets/avatars/initial-male.gif";
import initialFemaleAvatar from "../assets/avatars/initial-female.gif";
import nakazonoAvatar from "../assets/avatars/nakazono.gif";
import goldenDopamineAvatar from "../assets/avatars/dopamine-prize.gif";

export const avatarAssets = {
  initial_male: initialMaleAvatar,
  initial_female: initialFemaleAvatar,
  izumi: izumiAvatar,
  nari: nariAvatar,
  nakazono: nakazonoAvatar,
  golden_dopamine: goldenDopamineAvatar,
  nagano: naganoAvatar,
  abe: abeAvatar,
  daiki: daikiAvatar,
  maie: maieAvatar,
  giant_robot: giantRobotAvatar,
};

export function getAvatarImage(avatarId) {
  return avatarAssets[avatarId] ?? avatarAssets.initial_male;
}
