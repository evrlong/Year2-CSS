import { fallbackImage } from '../../components/fallbackImage.js';

/**
 * Creates a follower card element.
 * @param {Object} follower - The follower object.
 * @param {string} follower.name - The name of the follower.
 * @param {Object} follower.avatar - The avatar object of the follower.
 * @param {string} [follower.avatar.url] - The URL of the avatar image.
 * @returns {Promise<HTMLElement>} - A Promise that resolves to the follower card element.
 */
export function createFollowerCard(follower) {
  /**
   * Checks if an image URL is compatible by attempting to load the image.
   * @param {string} url - The URL of the image.
   * @returns {Promise<boolean>} - A Promise that resolves to true if the image loads successfully, otherwise false.
   */
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

/**
 * Creates a following card element.
 * @param {Object} following - The following object.
 * @param {string} following.name - The name of the following user.
 * @param {Object} following.avatar - The avatar object of the following user.
 * @param {string} [following.avatar.url] - The URL of the avatar image.
 * @returns {Promise<HTMLElement>} - A Promise that resolves to the following card element.
 */
export function createFollowingCard(following) {
  /**
   * Checks if an image URL is compatible by attempting to load the image.
   * @param {string} url - The URL of the image.
   * @returns {Promise<boolean>} - A Promise that resolves to true if the image loads successfully, otherwise false.
   */
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
