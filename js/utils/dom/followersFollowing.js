import { fallbackImage } from '../../components/fallbackImage.js';

export function createFollowerCard(follower) {
  //count following

  const isImageCompatible = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const followerCard = document.createElement('div');
  followerCard.className = 'follower-card';

  const avatarUrl = follower.avatar?.url || fallbackImage;

  isImageCompatible(avatarUrl).then((isCompatible) => {
    const finalAvatarUrl = isCompatible ? avatarUrl : fallbackImage;
    followerCard.innerHTML = `
      <div class="follower-info">
        <a href="../viewProfile/index.html?user=${follower.name}">
          <img src="${finalAvatarUrl}" alt="Avatar" class="w-7 h-7 sm:w-10 sm:h-10 rounded-full object-cover" />
        </a>
      </div>
    `;
  });

  return followerCard;
}

export function createFollowingCard(following) {
  const isImageCompatible = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const followingCard = document.createElement('div');
  followingCard.className =
    'following-card flex items-center wrap justify-between';

  const avatarUrl = following.avatar?.url || fallbackImage;

  isImageCompatible(avatarUrl).then((isCompatible) => {
    const finalAvatarUrl = isCompatible ? avatarUrl : fallbackImage;
    followingCard.innerHTML = `
      <div class="following-info">
        <a href="../viewProfile/index.html?user=${following.name}">
          <img src="${finalAvatarUrl}" alt="Avatar" class="w-7 h-7 sm:w-10 sm:h-10 rounded-full object-cover" />
        </a>
      </div>
    `;
  });

  return followingCard;
}
