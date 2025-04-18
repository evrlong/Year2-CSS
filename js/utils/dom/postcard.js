export function createPostCard(post) {
  const card = document.createElement('div');
  card.className =
    ' post-card bg-white min-h-52 w-140 m-4 shadow-md rounded-lg w-60';

  // Top profile/date row
  const topRow = document.createElement('div');
  topRow.className =
    'bg-white rounded-t-md p-2 flex justify-between items-center text-xs';

  // Profile image
  const profileImg = document.createElement('img');
  profileImg.src =
    post.author.avatar.url &&
    typeof post.author.avatar.url === 'string' &&
    post.author.avatar.url.trim().startsWith('http')
      ? post.author.avatar.url
      : '../img/noimg.png';
  profileImg.alt = `profile picture of ${post.author?.name || 'user'}`;
  profileImg.className =
    'bg-blue-100 shadow-md rounded-full h-7 w-7 object-cover';

  // Lag lenke rundt profilbildet
  const profileLink = document.createElement('a');
  profileLink.href = `../viewProfile/index.html?user=${encodeURIComponent(post.author.name)}`;
  profileLink.appendChild(profileImg);

  // Created date
  const createdDate = post.created?.split('T')[0] || 'Date';
  const dateText = document.createTextNode(createdDate);

  // Legg til i topRow
  topRow.appendChild(profileLink); // Bildet med lenke
  topRow.appendChild(dateText);

  // Content image
  const contentImg = document.createElement('img');
  contentImg.src =
    post.media &&
    typeof post.media.url === 'string' &&
    post.media.url.trim().startsWith('http')
      ? post.media.url
      : '../img/noimg.jpg';

  contentImg.alt =
    post.media && typeof post.media.alt === 'string'
      ? post.media.alt
      : 'Default fallback image';

  contentImg.className = 'h-40 w-full w-3 mx-auto object-cover ring-green-500';

  // Bottom content
  const bottom = document.createElement('div');
  bottom.className = 'bg-white py-1 rounded-b-md';

  const heartIcon = document.createElement('i');
  heartIcon.className = 'fa-solid fa-heart fa-sm px-0.5 pl-4 text-red-600';

  const commentIcon = document.createElement('i');
  commentIcon.className = 'fa-regular fa-comment fa-sm px-0.5';

  const textWrapper = document.createElement('div');
  textWrapper.className = 'flex flex-row';

  const paragraph = document.createElement('p');
  paragraph.className = 'text-[12px] px-0.5 py-1 pl-4';

  const userSpan = document.createElement('span');
  userSpan.className = 'pr-1 font-bold';
  userSpan.textContent = `@${post.author?.name || 'user'}:`;

  const postText = document.createTextNode(post.body || '');

  paragraph.appendChild(userSpan);

  paragraph.appendChild(postText);
  textWrapper.appendChild(paragraph);

  bottom.appendChild(heartIcon);
  bottom.appendChild(commentIcon);
  bottom.appendChild(textWrapper);

  // Put it all together
  card.appendChild(topRow);
  card.appendChild(contentImg);
  card.appendChild(bottom);

  // Legg til data-attributter for søk
  card.dataset.title = post.title || '';
  card.dataset.body = post.body || '';
  card.dataset.tags = (post.tags || []).join(',');
  card.dataset.author = post.author?.name || '';
  card.dataset.created = post.created || '';

  return card;
}
