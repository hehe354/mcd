# 智能取餐看板

適合 iPad 使用的餐廳取餐紀錄系統。每間餐廳用自己的三位數餐廳號碼和 PIN 登入，資料會由伺服器端的 Cloudflare D1 資料庫分開保存。

## 功能

- 000–999 號碼看板；綠色為已取餐、黃色為未取餐
- 快速登記輸入號碼即標記已取餐；重複輸入會彈出明顯提示
- 點按號碼可手動切換取餐狀態
- 結束一輪時，自動把本輪其餘號碼列為未取餐並保存歷史
- 清除餐廳資料必須再輸入該餐廳 PIN
- 每間餐廳的帳戶、各輪紀錄與號碼狀態互相獨立

## 本機開發

需要 Node.js 22.13 或以上。

```bash
npm install
npm run dev
```

## 正式部署

此版本使用 Cloudflare D1 作為資料庫。先建立一個 D1 database，將 `DB` binding 加到部署環境，然後依序執行 `drizzle/0000_mute_ezekiel_stane.sql` 和 `drizzle/0001_strange_proudstar.sql` 的 migration，最後部署 Worker。

注意：資料庫沒有儲存於 GitHub；每個 Cloudflare 環境都必須自行建立和遷移 D1 database。
