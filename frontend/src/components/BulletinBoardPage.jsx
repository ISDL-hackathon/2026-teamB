import { Fragment, useEffect, useState } from "react";
import { requestBulletinJson } from "../api";
import bulletinLogo from "../assets/bulletin-logo.png";
import iconBackground from "../assets/icons/icon-background.png";
import iconFrame from "../assets/icons/maru.png";
import crownIconFrame from "../assets/icons/maru-crown.png";
import { getIconImage } from "./iconAssets";
import homeNavIcon from "../assets/nav-home.png";
import roomNavIcon from "../assets/nav-room.png";
import followNavIcon from "../assets/nav-follow.png";
import "./BulletinBoardPage.css";

function BulletinBoardPage({ currentUser, rankOneUserId, setCurrentUser, setPage }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [feedMode, setFeedMode] = useState("all");
  const [openProfileId, setOpenProfileId] = useState(null);
  const questPostTitles = {
    lunch: "昼飯クエスト完了",
    lab_photo: "今日の研究室の風景・完了",
  };

  useEffect(() => {
    requestBulletinJson(`/bulletin/posts?viewer_id=${currentUser.id}`)
      .then(setPosts)
      .catch((err) => setError(err.message));
  }, [currentUser.id]);

  const handleToggleFollow = (followedId) => {
    requestBulletinJson("/bulletin/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ follower_id: currentUser.id, followed_id: followedId }),
    })
      .then(({ following }) => {
        setPosts((current) => current.map((post) =>
          post.user_id === followedId ? { ...post, is_following: following } : post,
        ));
        setOpenProfileId(null);
      })
      .catch((err) => setError(err.message));
  };

  const handleToggleLike = (postId) => {
    requestBulletinJson("/bulletin/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id, post_id: postId }),
    })
      .then(({ liked, like_count: likeCount }) => {
        setPosts((current) => current.map((post) =>
          post.id === postId ? { ...post, is_liked: liked, like_count: likeCount } : post,
        ));
      })
      .catch((err) => setError(err.message));
  };

  const visiblePosts = feedMode === "following"
    ? posts.filter((post) => post.is_following)
    : posts;

  const getPostDate = (createdAt) => createdAt.slice(0, 10);
  const formatPostDate = (createdAt) => {
    const [year, month, day] = getPostDate(createdAt).split("-").map(Number);
    return `${year}年${month}月${day}日`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = content.trim();
    if ((!text && !imageData) || isPosting) return;

    setIsPosting(true);
    setError("");
    requestBulletinJson("/bulletin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id, content: text, image_data: imageData }),
    })
      .then((post) => {
        setPosts((current) => [post, ...current]);
        if (post.user) {
          setCurrentUser((current) => ({ ...current, ...post.user }));
        }
        setContent("");
        setImageData(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsPosting(false));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
      setError("画像はPNG・JPEG・GIF・WebPの1MB以下にしてください");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="bulletinPage">
      <section className="bulletinPhone" aria-label="研究室掲示板">
        <header className="bulletinHeader">
          <img alt="Isdlgram" className="bulletinLogo" src={bulletinLogo} />
        </header>

        <form className="bulletinComposer" onSubmit={handleSubmit}>
          <textarea
            maxLength={500}
            onChange={(event) => setContent(event.target.value)}
            placeholder="研究室のみんなに共有する..."
            value={content}
          />
          <div className="bulletinComposerActions">
            <span className="bulletinImageComingSoon">写真投稿は準備中</span>
            <button disabled={(!content.trim() && !imageData) || isPosting} type="submit">
              {isPosting ? "送信中..." : "投稿"}
            </button>
          </div>
        </form>

        <div className="bulletinFeed">
          {error && <p className="bulletinError">{error}</p>}
          {!error && visiblePosts.length === 0 && (
            <p className="bulletinEmpty">
              {feedMode === "following" ? "フォロー中の投稿はありません" : "まだ投稿はありません"}
            </p>
          )}
          {visiblePosts.map((post, index) => (
            <Fragment key={post.id}>
              {index > 0 && getPostDate(post.created_at) !== getPostDate(visiblePosts[index - 1].created_at) && (
                <div className="bulletinDateDivider"><span>{formatPostDate(post.created_at)}</span></div>
              )}
            <article className={post.quest_type ? "bulletinPost bulletinQuestPost" : "bulletinPost"}>
              {post.quest_type ? (
                <div className="bulletinQuestCompleteMark">
                  <strong>QUEST</strong>
                  <span>COMPLETE!</span>
                </div>
              ) : (
              <div className="bulletinAvatarArea">
                <button
                  aria-label={`${post.user_name}のフォローメニュー`}
                  className="bulletinAvatar"
                  onClick={() => setOpenProfileId((id) => id === post.user_id ? null : post.user_id)}
                  type="button"
                >
                  <img alt="" className="bulletinAvatarBackground" src={iconBackground} />
                  <img alt="" className="bulletinAvatarImage" src={getIconImage(post.user_icon)} />
                  <img
                    alt=""
                    className="bulletinAvatarFrame"
                    src={Number(post.user_id) === Number(rankOneUserId) ? crownIconFrame : iconFrame}
                  />
                </button>
                {openProfileId === post.user_id && post.user_id !== currentUser.id && (
                  <button
                    className="bulletinFollowMenu"
                    onClick={() => handleToggleFollow(post.user_id)}
                    type="button"
                  >
                    {post.is_following ? "フォロー解除" : "フォローする"}
                  </button>
                )}
              </div>
              )}
              <div>
                <div className="bulletinPostHeader">
                  <strong>{post.quest_type ? questPostTitles[post.quest_type] ?? "クエスト完了" : post.user_name}</strong>
                  {!post.quest_type && post.user_id !== currentUser.id && (
                    <button
                      aria-label="いいね"
                      className={post.is_liked ? "bulletinLikeButton bulletinLikeButtonActive" : "bulletinLikeButton"}
                      onClick={() => handleToggleLike(post.id)}
                      type="button"
                    >
                      ♥ {post.like_count ?? 0}
                    </button>
                  )}
                </div>
                <p>{post.content}</p>
                {post.image_data && (
                  <img alt="投稿画像" className="bulletinPostImage" src={post.image_data} />
                )}
                <span className="bulletinPostMeta">
                  {post.quest_type ? "クエスト達成" : post.user_grade} · {post.created_at.replace("T", " ").slice(0, 16)}
                </span>
              </div>
            </article>
            </Fragment>
          ))}
        </div>

        <nav className="bulletinNav" aria-label="掲示板メニュー">
          <button onClick={() => setPage("home")} type="button">
            <img alt="" className="bulletinNavIcon" src={homeNavIcon} />
            <span>ホーム</span>
          </button>
          <button onClick={() => setPage("room")} type="button">
            <img alt="" className="bulletinNavIcon" src={roomNavIcon} />
            <span>個人ルーム</span>
          </button>
          <button
            className={feedMode === "following" ? "bulletinNavActive" : ""}
            onClick={() => setFeedMode((mode) => mode === "following" ? "all" : "following")}
            type="button"
          >
            <img alt="" className="bulletinNavIcon" src={followNavIcon} />
            <span>フォロー投稿</span>
          </button>
        </nav>
      </section>
    </main>
  );
}

export default BulletinBoardPage;
