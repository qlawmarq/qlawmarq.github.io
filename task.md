# BIO の更新

`$LL.about()`や`$LL.contact()`などのBIO情報を更新します。
現在は、ハードコードされていますが、ブログのAboutページのリソースを読み込むように変更したいです。

以下のURLからAboutページのマークダウンファイルを取得できます。

- https://storage.googleapis.com/qlawmarq.net/pages/en/about.md
- https://storage.googleapis.com/qlawmarq.net/pages/ja/about.md

既存のBIO情報を表示しているコードを修正し、Aboutページの内容を反映させるようにしてください。

## 受け入れ基準

- [ ] `$LL.about()`や`$LL.contact()`が表示されている領域に、Aboutページの内容を正しく反映していること
- [ ] 英語と日本語の両方のAboutページに対応していること
- [ ] マークダウンファイルを正しくパースして表示していること
- [ ] 既存のスタイルやレイアウトが維持されていること
