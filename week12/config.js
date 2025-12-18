
// 後端 base URL（例如 http://localhost:3000）
window.API_BASE = "http://localhost:3000";

// Auth routes
window.ROUTE_SIGNUP = "/auth/signup";
window.ROUTE_LOGIN  = "/auth/login";

// 受保護的「取得自己資訊」路由（推薦你後端做 /auth/me）
// 如果你後端沒有 /auth/me，改成你有套 authMiddleware 的路由也可以
window.ROUTE_ME = "/auth/me";

// 一個受保護 API（你後端真的存在、且有 authMiddleware 的路由）
// 例如：/api/signup  /api/registrations  /api/posts ...（依你作業）
window.ROUTE_PROTECTED = "/api/protected";

// 故意打不存在的路由，用來顯示 404
window.ROUTE_404 = "/api/this-route-does-not-exist";

