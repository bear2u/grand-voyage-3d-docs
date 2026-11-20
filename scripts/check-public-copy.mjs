import fs from 'node:fs';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

// 공개 문구 검사: 이용자에게 보이는 본문(소스 .mdx와 빌드된 출력)에
// 개발 용어·개인정보·다른 게임 이름이 섞이면 빌드를 멈춘다.
// 비공개 작업 기록이나 코드에는 적용하지 않는다.

/** 개발·내부 표현 */
export const internalTerms = /codex\/|\/Users\/|PLAYTEST[-_]|\b(?:PlayerId|README|Unity|GameHost|StreamingAssets)\b|C#|(?:Assets|Packages|Logs|Tools|ArtSource)\/[\w/.-]+|\b[\w.-]+\.(?:cs|asmdef|unity|prefab)\b|브랜치|저장소|커밋|개발 소스|개발자 판|테스트 계정|자동 테스트|시험 계정|검증 로그/g;

/** 다른 게임·리메이크를 가리키는 말 (Grand Voyage는 독립 오리지널 게임) */
export const otherGameTerms = /대항해\s*시대|Uncharted\s*Waters|\bKOEI\b|\bKoei\b|코에이|리메이크|원작|\buw2\b|\bUW2\b|AI\s*부관|카드\s*게임/gi;

export function findForbidden(copy) {
  const text = copy
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^import\s.*?;?\s*$/gm, '')
    .replace(/<[^>]*>/g, ' ');
  const hits = [...text.matchAll(internalTerms), ...text.matchAll(otherGameTerms)].map(h => h[0]);
  return [...new Set(hits)];
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const path = new URL(e.name + (e.isDirectory() ? '/' : ''), dir);
    return e.isDirectory() ? walk(path) : [path];
  });
}

function main() {
  const built = process.argv.includes('--built');
  const root = new URL(built ? '../dist/' : '../src/content/docs/', import.meta.url);
  assert.ok(fs.existsSync(root), `Missing ${built ? 'built site' : 'document sources'}`);
  const files = walk(root).filter(p => built ? /\.(?:html|md|txt)$/.test(p.pathname) : /\.mdx?$/.test(p.pathname));
  assert.ok(files.length > 0, 'No public documents found');
  const failures = [];
  for (const file of files) {
    const hits = findForbidden(fs.readFileSync(file, 'utf8'));
    if (hits.length) failures.push(`${file.pathname}: ${hits.join(', ')}`);
  }
  assert.equal(failures.length, 0, '공개 문서에 넣으면 안 되는 말이 있습니다:\n' + failures.join('\n'));
  console.log(`공개 문구 검사 통과: ${built ? '배포 출력' : '본문'} ${files.length}개 파일`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
