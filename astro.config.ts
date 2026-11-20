import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import nimbus, { defineConfig as defineNimbusConfig } from '@cloudflare/nimbus-docs';
import { tableScroll } from '@cloudflare/nimbus-docs/markdown';

import { deployment } from './scripts/deployment';
const { site, base } = deployment(process.env);
const config = defineNimbusConfig({
  site: site,
  title: 'Grand Voyage 항해 안내서',
  description: '3D 항해 게임 Grand Voyage의 조작과 항해 준비, 이야기 「세 깃발의 바다」를 담은 안내서.',
  locale: 'ko',
  homeLabel: '안내서 첫 장',
  // 새 그룹은 아래 목록에 한 줄을 더하고 src/content/docs/<폴더>/ 에 문서를 두면 됩니다.
  // 문서가 생기기 전에는 그룹을 만들지 않습니다(빈 「준비 중」 그룹 금지).
  sidebar: { defaultCollapsed: true, items: [
    { label: '업데이트 내역', collapsed: false, items: [
      { autogenerate: { directory: 'updates' } },
    ] },
    { label: '안내서 첫 장', link: '/' },
    { label: '시작하기', autogenerate: { directory: 'start' }, collapsed: false },
    { label: '시스템과 규칙', autogenerate: { directory: 'systems' }, collapsed: true },
    { label: '항해 도감', autogenerate: { directory: 'atlas' }, collapsed: true },
    { label: '소설', autogenerate: { directory: 'novel' }, collapsed: false },
  ] },
  github: null,
  editPattern: null,
  socialImageAlt: 'Grand Voyage 항해 안내서',
});
export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  vite: { plugins: [tailwindcss()] },
  integrations: [nimbus(config, {
    rules: { 'nimbus/frontmatter-shape': 'error', 'nimbus/internal-link': 'error' },
    markdown: { hastPlugins: [tableScroll()] },
  })],
});
