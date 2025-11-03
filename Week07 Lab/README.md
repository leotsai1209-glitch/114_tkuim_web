README
  必備驗證條件
	•姓名：必填
	•Email：格式 name@domain.tld
	•手機：^09\d{8}$（09開頭 + 8 位數）
	•密碼：至少 8 碼，同時含英文字母與數字
	•確認密碼：需與密碼一致
	•興趣標籤：至少勾 1 項（事件委派於父層 #tags）
	•服務條款：必勾
  即時驗證策略
	•blur 後開始顯示錯誤；input 中即時更新
	•自訂錯誤使用 setCustomValidity() + <p id="*-error"> 寫入
	•與欄位透過 aria-describedby 連結，可被螢幕報讀
  送出攔截與防重送
	•submit 攔截，逐欄驗證，聚焦第一個錯誤
	•模擬送出 1 秒、顯示成功訊息、按鈕 Loading/disabled
  加分
	•密碼強度條（弱/中/強）
	•localStorage 暫存未送出內容
	•重設按鈕清空欄位/錯誤/強度/草稿