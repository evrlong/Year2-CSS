// export function myProfileCards(post) {
//   const card = document.createElement('div');
//   card.className = 'bg-white min-h-52 w-140 m-4 shadow-md rounded-lg w-60';

//   const title = document.createElement('h2');
//   title.className = 'text-lg font-bold text-gray-800 p-2';
//   title.textContent = post.title || 'Post Title'; // Fallback title
//   card.appendChild(title);

//   const media = document.createElement('img');
//   const fallbackImage =
//     'https://raw.githubusercontent.com/evrlong/Year2-CSS/js2/img/avatars/catavatar.png';

//   // Sjekk for gyldig bilde-URL
//   const imageUrl = post.media?.url || fallbackImage;
//   media.src = imageUrl;
//   media.alt = post.media?.alt || 'Default fallback image';
//   media.className = 'h-40 w-full mx-auto object-cover ring-green-500';

//   // Håndter feil under lasting av bilde
//   media.onerror = () => {
//     if (media.src !== fallbackImage) {
//       console.error('Image failed to load, using fallback image.');
//       media.src = fallbackImage;
//     }
//   };

//   card.appendChild(media);

//   const body = document.createElement('p');
//   body.className = 'text-gray-600 p-2';
//   body.textContent = post.body || 'Post content goes here'; // Fallback content
//   card.appendChild(body);

//   return card;
// }
