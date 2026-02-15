# 実装プラン: 初回表示時のロケール検出・データ取得の不具合修正

## 概要

ブラウザのデフォルト言語が日本語の場合、初回表示時に以下の症状が発生する不具合を修正する。

1. プロフィール（About）セクションが英語で表示される
2. ブログ投稿（RSS）セクションが英語で表示される
3. 「私のプロジェクト」セクションの GlitchText アニメーションが途中で止まり、ランダム文字が残ったまま表示される

言語セレクタから手動で再選択した場合は正常に動作する。コンソールエラーはなし。

## 根本原因分析

調査の結果、**3 つの相互に関連するバグ**が特定された。

### バグ 1: ロケール検出のリージョンコード未対応（主因）

**箇所:** `src/routes/+layout.svelte` 13-26 行目

現在のコードは `navigator.languages[0]` の値を `isLocale()` で完全一致チェックしている。

```typescript
// 現在の実装
const getLocaleFromBrowser = () => {
  if (navigator.languages != undefined) return navigator.languages[0];
  return navigator.language;
};

onMount(() => {
  const detectedLocale = getLocaleFromBrowser();
  if (isLocale(detectedLocale)) {      // ← "ja-JP" は "ja" と一致しない！
    setLocale(detectedLocale);
  } else {
    setLocale("en");                    // ← フォールバックで英語のまま
  }
});
```

`isLocale()` は `locales.includes()` で `["en", "ja"]` との完全一致を確認する（`src/i18n/i18n-util.ts` 26-27 行目）。

`navigator.languages[0]` のブラウザ別返却値：

| プラットフォーム | ブラウザ | 返却値 |
|---|---|---|
| macOS | Safari | `"ja"`（iOS 13.4 以降、プライバシー対応でリージョン削除） |
| macOS | Chrome | `"ja"` または `"ja-JP"`（ユーザー設定依存） |
| Windows | Chrome/Edge | `"ja"` または `"ja-JP"`（ユーザー設定依存） |
| Android | Chrome | `"ja-JP"`（一般的） |

`"ja-JP"` が返却された場合、`isLocale("ja-JP")` は `false` を返し、ロケールは `"en"` のままになる。

**一方、typesafe-i18n は `detectLocale` 関数を提供しており**、リージョンコード付きのロケール（例: `"ja-JP"` → `"ja"` にフォールバック）を自動で処理する。この関数は `findMatchingLocale` 内部で `locale.split('-')[0]` を使い、ベース言語コードも候補に含める（[typesafe-i18n ソースコード](https://github.com/codingcommons/typesafe-i18n/blob/main/packages/detectors/src/detect.mts)）。

### バグ 2: データ取得のレースコンディション（複合原因）

**箇所:** `src/routes/+page.svelte` 133-156 行目

ロケール検出が成功した場合（`navigator.languages[0]` が `"ja"` を返す場合）でも問題がある。以下のタイムラインでレースコンディションが発生する。

```
t=0   [+layout.svelte モジュールスコープ] setLocale("en")
t=1   [+page.svelte $effect]    $locale="en" ≠ currentLocale="" → getAndSetData() Call A 開始（lang="en"）
t=2   [+layout.svelte onMount]  detectLocale → "ja" → setLocale("ja")
t=3   [+page.svelte $effect]    $locale="ja" ≠ currentLocale="en" → getAndSetData() Call B 開始（lang="ja"）
```

**Call A と Call B が同時に実行される。** キャンセル機構がないため、解決順序によって最終状態が決まる。

```
【正常パターン】Call A → Call B の順に解決
  Call A 解決: 英語データ設定
  Call B 解決: 日本語データで上書き → 正しい結果

【異常パターン】Call B → Call A の順に解決
  Call B 解決: 日本語データ設定
  Call A 解決: 英語データで上書き → 英語が残る！
```

RSS と About コンテンツは言語依存のため、英語版が後から上書きすると英語のまま表示される。GitHub リポジトリデータは言語非依存のため影響を受けない。

### バグ 3: GlitchText のカウンターリセット漏れ（アニメーション停止の原因）

**箇所:** `src/components/GlitchText.svelte` 24 行目、30-39 行目

`text` プロップが変更された際、`$effect` が `renderGlitchText()` を再実行するが、`counter` が `-1` にリセットされない。

```typescript
let counter = $state(-1);

const renderGlitchText = () => {
  isStarted = true;
  output = "";
  // ← counter がリセットされない！
  setTimeout(() => {
    // ...
    glitch();  // counter の現在値から開始
  }, delay);
};
```

レースコンディション（バグ 2）により `{#key $locale}` ブロック内のコンポーネントの `text` プロップが変更された場合：

1. 日本語データで GlitchText アニメーション開始（counter: -1 → 0 → 1 → ...）
2. 英語データが遅れて到着し、RSS アイテムの `text` が変更される
3. `$effect` が `renderGlitchText()` を再呼び出し
4. **counter はリセットされず、前のアニメーションの位置から開始**
5. 先頭部分のランダム文字が復号されないまま残る = 「グリッチしたまま」

また、古い `glitch()` の `setTimeout` チェーンが残存し、新しいチェーンと同時に `counter` をインクリメントするため、アニメーションが破壊される。

### 3 つのバグの相互作用

```
バグ 1（ロケール未検出）の場合:
  → ロケール = "en" のまま → 英語コンテンツ表示 → レースコンディションなし
  → ただし GlitchText は正常に動作するはず（テキスト変更なし）

バグ 2（レースコンディション）+ バグ 3（カウンター未リセット）の場合:
  → ロケール = "ja" に変更成功 → 2 つのフェッチが競合
  → 英語フェッチが後から上書き → テキスト変更 → GlitchText のカウンター破壊
  → 結果: 英語プロフィール/ブログ + グリッチしたプロジェクトセクション
```

## 設計案

### 方針: 「根本原因の排除」アプローチ

レースコンディションを修正する（症状の対処）のではなく、**レースコンディション自体を発生させない**設計にする。

核心的な変更点: **ロケール検出をモジュールスコープ（同期的）に移動し、`onMount` の遅延をなくす。**

#### 変更 1: ロケール検出をモジュールスコープに移動（`+layout.svelte`）

```typescript
// 修正後
import { browser } from '$app/environment';
import { detectLocale } from '../i18n/i18n-util';
import { navigatorDetector } from 'typesafe-i18n/detectors';

loadAllLocales();

if (browser) {
  // ブラウザ環境: navigator.languages から正しくロケール検出
  const detectedLocale = detectLocale(navigatorDetector);
  setLocale(detectedLocale);
  document.documentElement.lang = detectedLocale;
} else {
  // ビルド時（プリレンダリング）: デフォルト英語
  setLocale("en");
}
```

**なぜこれで解決するか:**

- `$app/environment` の `browser` はコンパイル時定数。ビルド時は `false`、ブラウザでは `true`
- ブラウザでのモジュールスコープ実行は、コンポーネント初期化（`$effect` 含む）の **前** に完了する
- `+page.svelte` の `$effect` が初回実行される時点で、`$locale` は既に正しい値（例: `"ja"`）
- `currentLocale = ""` との比較で 1 回だけ `getAndSetData()` が呼ばれる
- **2 回目のフェッチが発生しない = レースコンディション解消**

```
修正後のタイムライン:
t=0   [+layout.svelte モジュールスコープ] detectLocale → "ja" → setLocale("ja")
t=1   [+page.svelte $effect]    $locale="ja" ≠ currentLocale="" → getAndSetData()（lang="ja"）
                                ← 1 回だけフェッチ。レースコンディションなし
```

#### 変更 2: `$effect` 内のロケール変更の HTML lang 属性同期（`+layout.svelte`）

```typescript
// ヘッダーからのロケール変更時にも HTML lang 属性を同期
$effect(() => {
  if (browser) {
    document.documentElement.lang = $locale;
  }
});
```

これにより `Header.svelte` での手動 `document.querySelector("html")!.setAttribute("lang", value)` が不要になる。ただし、Header.svelte の変更はスコープ外のため、この設計では最小限の変更として `+layout.svelte` 側のみ対応する。

#### 変更 3: GlitchText のカウンターリセットとアニメーションチェーン管理（`GlitchText.svelte`）

```typescript
let counter = $state(-1);
let animationId = 0;  // アニメーション世代管理

const renderGlitchText = () => {
  const currentId = ++animationId;  // 古いチェーンを無効化
  isStarted = true;
  counter = -1;                      // カウンターリセット
  output = "";
  delay = delay ? delay : 0;
  setTimeout(() => {
    if (currentId !== animationId) return;  // 古い呼び出しを破棄
    for (let i = 0; i < text.length + factor; i++) {
      output += getRandamString();
    }
    glitch(currentId);
  }, delay);
};

const glitch = (id: number) => {
  setTimeout(
    () => {
      if (id !== animationId) return;  // 古いチェーンを停止
      counter++;
      if (counter < text.length) {
        // ... 既存のアニメーションロジック
        glitch(id);
      }
    },
    Math.floor(Math.random() * (maxMilsec - minMilsec) + minMilsec),
  );
};
```

#### 変更 4: データ取得のステイルガード（`+page.svelte`、防御的修正）

```typescript
let fetchVersion = 0;

async function getAndSetData() {
  const version = ++fetchVersion;
  ownedRepos = [];
  starredRepos = [];
  rssItems = [];
  aboutContent = null;
  const data = await fetchData();
  if (version !== fetchVersion) return;  // ステイルなフェッチを破棄
  ownedRepos = data.githubRepo;
  starredRepos = data.githubStaredRepo;
  rssItems = data.rss;
  aboutContent = data.about;
}
```

主要な修正（変更 1）でレースコンディションは解消されるが、ユーザーが言語セレクタを素早く切り替えた場合にも同様の問題が起こり得るため、防御的にステイルガードを追加する。

### 設計判断の根拠

| 選択肢 | 利点 | 欠点 | 採用 |
|---|---|---|---|
| **A: モジュールスコープでロケール検出** | レースコンディション根本排除、コード量削減 | `$app/environment` への依存追加 | **採用** |
| B: onMount 内で AbortController 使用 | 既存構造を維持 | 複雑性増大、タイミング問題は残存 | 不採用 |
| C: $effect.pre でロケール検出 | DOM 更新前に実行 | onMount と同じタイミング問題 | 不採用 |
| D: +page.svelte の onMount でロケール検出 | 同一コンポーネント内で完結 | +layout の onMount より先に実行されるため、レイアウト側のロケール検出と競合 | 不採用 |

**`{#key $locale}` ブロックの維持について:**

- 維持する。ロケール変更時にカードのスライドインアニメーションを再生し、全 GlitchText を新鮮な状態で再生成するため、UX 上有益
- GlitchText カウンターリセットの修正（変更 3）により、`{#key}` なしでも正しく動作するが、一貫した UX を提供するために維持

## 機能受入条件

### AC1: ロケール検出の正確性

- `navigator.languages[0]` が `"ja"`, `"ja-JP"`, `"ja-jp"` のいずれを返す場合でも、日本語ロケールとして正しく検出されること
- `navigator.languages[0]` が `"en"`, `"en-US"`, `"en-GB"` のいずれを返す場合でも、英語ロケールとして正しく検出されること
- 未対応のロケール（例: `"fr"`, `"zh"`）の場合、英語にフォールバックすること

### AC2: 初回表示の正確性（日本語ブラウザ）

- ブラウザのデフォルト言語が日本語の場合、初回表示でプロフィール（About）が日本語で表示されること
- ブラウザのデフォルト言語が日本語の場合、初回表示でブログ投稿（RSS）が日本語で表示されること
- ブラウザのデフォルト言語が日本語の場合、初回表示で「私のプロジェクト」セクションの GlitchText アニメーションが正常に完了すること
- 初回表示でレースコンディションによる英語コンテンツの上書きが発生しないこと

### AC3: 言語切替の正常動作

- 言語セレクタから英語→日本語に切り替えた場合、全セクションが日本語で表示されること
- 言語セレクタから日本語→英語に切り替えた場合、全セクションが英語で表示されること
- 素早い言語切替（連打）でデータの不整合が発生しないこと

### AC4: GlitchText アニメーションの完全性

- GlitchText の `text` プロップが変更された場合、アニメーションが最初からやり直されること
- アニメーション中に `text` が変更されても、ランダム文字が残ったままにならないこと

### AC5: ビルド・プリレンダリングの正常動作

- `pnpm build` がエラーなく完了すること
- プリレンダリング時（`browser = false`）に `navigator` 参照エラーが発生しないこと

### AC6: 既存 E2E テストの維持

- `pnpm e2e:test` が既存テストを全てパスすること（スナップショットの更新が必要な場合は `pnpm e2e:update` で対応）

## 実装手順

### ステップ 1: `+layout.svelte` のロケール検出を修正

1. `$app/environment` から `browser` をインポート
2. `typesafe-i18n/detectors` から `navigatorDetector` をインポート
3. `detectLocale` を `../i18n/i18n-util` からインポート
4. `getLocaleFromBrowser` 関数と `onMount` 内のロケール検出を削除
5. モジュールスコープに `browser` チェック付きのロケール検出を追加
6. `$effect` で HTML `lang` 属性を同期（locale の値でドキュメント属性更新）

**修正後の `+layout.svelte` script ブロック:**

```typescript
import Header from "../components/Header.svelte";
import Footer from "../components/Footer.svelte";
import "./reset.css";
import "./layout.css";
import { browser } from "$app/environment";
import { locale, setLocale } from "../i18n/i18n-svelte";
import { detectLocale } from "../i18n/i18n-util";
import { loadAllLocales } from "../i18n/i18n-util.sync";
import { navigatorDetector } from "typesafe-i18n/detectors";

loadAllLocales();

if (browser) {
  const detectedLocale = detectLocale(navigatorDetector);
  setLocale(detectedLocale);
} else {
  setLocale("en");
}

$effect(() => {
  if (browser) {
    document.documentElement.lang = $locale;
  }
});
```

- `onMount` のインポートも不要になるため削除

### ステップ 2: `GlitchText.svelte` のアニメーション修正

1. `animationId` 変数を追加（`let animationId = 0;`）
2. `renderGlitchText()` 内で `counter = -1;` を追加（カウンターリセット）
3. `renderGlitchText()` 内で `animationId++` を追加（古いチェーン無効化）
4. `setTimeout` コールバック内でステイルチェック（`if (currentId !== animationId) return;`）を追加
5. `glitch()` に `id` パラメータを追加し、各チェーンステップでステイルチェック

### ステップ 3: `+page.svelte` のデータ取得にステイルガードを追加

1. `fetchVersion` 変数を追加（`let fetchVersion = 0;`）
2. `getAndSetData()` 内でバージョンインクリメントとステイルチェックを追加
3. `await fetchData()` の後に `if (version !== fetchVersion) return;` を追加

### ステップ 4: 動作確認

1. `pnpm check` で型チェック
2. `pnpm build` でビルドエラーがないことを確認
3. `pnpm dev` で開発サーバー起動
4. ブラウザの言語設定を日本語（`ja` および `ja-JP`）に変更して初回表示を確認
5. 言語セレクタからの切替を確認
6. `pnpm e2e:test` で既存テストをパスすることを確認

### 参照ファイル

| ファイルパス | 変更内容 |
|---|---|
| `src/routes/+layout.svelte` | ロケール検出をモジュールスコープに移動、`onMount` 削除、`$effect` で HTML lang 同期 |
| `src/components/GlitchText.svelte` | カウンターリセット追加、アニメーションチェーン管理追加 |
| `src/routes/+page.svelte` | データ取得のステイルガード追加 |

### 変更しないファイル

| ファイルパス | 理由 |
|---|---|
| `src/i18n/i18n-util.ts` | 自動生成ファイル。`detectLocale` は既に実装済み |
| `src/components/Header.svelte` | 言語セレクタのロケール変更ロジックはそのまま維持（HTML lang 属性設定は `+layout.svelte` の `$effect` と重複するが、Header 側を削除すると影響範囲が広がるため最小変更に留める） |

## 参考資料

- [typesafe-i18n detectors ソースコード（findMatchingLocale の実装）](https://github.com/codingcommons/typesafe-i18n/blob/main/packages/detectors/src/detect.mts) - リージョンコード付きロケールのフォールバックマッチング実装
- [typesafe-i18n detectors README](https://github.com/codingcommons/typesafe-i18n/tree/main/packages/detectors) - `navigatorDetector` の使用方法
- [MDN: Navigator.languages](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages) - ブラウザ間での返却値の違い
- [SvelteKit $app/environment](https://svelte.dev/docs/kit/$app-environment) - `browser` 変数の仕様
- [Svelte 5 $effect 公式ドキュメント](https://svelte.dev/docs/svelte/$effect) - `$effect` の再実行条件と非同期操作の扱い
- [Svelte 5 {#key} ブロック](https://svelte.dev/docs/svelte/key) - `{#key}` の破棄・再生成タイミング
- [Svelte stores safe_not_equal の実装](https://github.com/sveltejs/svelte/issues/2886) - ストアの同値チェック仕様
- [Avoid Async Effects in Svelte](https://joyofcode.xyz/avoid-async-effects-in-svelte) - 非同期 $effect のベストプラクティス
