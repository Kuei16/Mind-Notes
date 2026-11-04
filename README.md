# Mind Notes｜心理學知識百科

用生活案例認識心理學的繁體中文靜態網站。初期有四篇文章：確認偏誤、從眾效應、情緒感染、月暈效應。提供分類篩選與統一文章閱讀模板。

## 作業核心：AGENTS.md

先閱讀 [`AGENTS.md`](AGENTS.md)。這份文件定義專案目的、視覺風格、檔案結構、JSON 文章格式與 AI 新增內容的步驟。**新增文章不用複製 HTML 頁面**，只需新增 JSON 並更新文章清單，就會出現在首頁與分類列表。

## 本機預覽

本專案使用 `fetch()` 讀取 JSON。請透過 HTTP Server 開啟，**不要直接雙擊 `index.html` 使用 `file://` 預覽**，部分瀏覽器會擋下資料讀取。

在專案根目錄執行：

```bash
python -m http.server 8000
```

接著開啟 http://localhost:8000/ 。使用 VS Code 的 Live Server 延伸模組也可以。

## GitHub Pages 發布

1. 在 GitHub 建立公開 repository，例如 `mind-notes`。
2. 把**專案根目錄中的全部檔案**（包含 `AGENTS.md`、`index.html`、`article.html`、`css/`、`js/`、`content/`）上傳到 repository 根目錄；不要多包一層 `mind-notes/` 資料夾。
3. 至 GitHub repository 的 **Settings → Pages**，在 **Build and deployment** 選擇 **Deploy from a branch**。
4. 選擇 `main` branch 和 `/(root)`，然後儲存。
5. 部署完成後，GitHub Pages 網址一般是 `https://<使用者名稱>.github.io/mind-notes/`（實際以 GitHub 顯示的網址為準）。
6. 測試四篇文章與分類是否能使用。

此專案全部使用相對路徑，適合部署在 GitHub Pages 的專案子路徑。

## 示範：AI 如何新增第 5 篇

可以對 AI 下指令：

> 請先閱讀 AGENTS.md，再依規則新增一篇「聚光燈效應（Spotlight Effect）」文章；新增 `content/spotlight-effect.json`，更新 `content/articles.json`，並檢查文章頁與分類是否能找到。不要新增其他 HTML 頁面。

AI 應該做到：

1. 讀取現有規則與文章範例。
2. 新增完整 JSON（五個固定章節與參考資料）。
3. 在 `content/articles.json` 加入卡片資訊。
4. 測試現有模板可以顯示新文章，且原本四篇不受影響。

## 檔案架構

```text
mind-notes/
├── AGENTS.md
├── README.md
├── index.html
├── css/style.css
├── js/main.js
├── js/article.js
└── content/
    ├── articles.json
    ├── confirmation-bias.json
    ├── conformity.json
    ├── emotional-contagion.json
    └── halo-effect.json
```

> 本網站僅供心理學知識學習，不提供心理疾病診斷或治療建議。
