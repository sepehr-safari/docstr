import { IMAGE_PROXY_URL } from '@/shared/config';

export const loader = (src: string, opt?: { w?: number; h?: number }) => {
  if (src.endsWith('.gif')) {
    return src;
  }

  let queries = '';
  if (opt) {
    queries = '?';
    if (opt.w) {
      queries += `w=${opt.w}&`;
    }
    if (opt.h) {
      queries += `h=${opt.h}`;
    }
  }

  return `${IMAGE_PROXY_URL}${encodeURIComponent(btoa(src))}${queries}`;
};
