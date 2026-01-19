// Replace with YOUR actual ngrok URL from Colab
export const API_BASE_URL = ' https://unspringing-myah-encomiastically.ngrok-free.dev'
export const API_ENDPOINTS = {
  predict: `${API_BASE_URL}/predict`,
  analytics: `${API_BASE_URL}/analytics`,
  hotspots: `${API_BASE_URL}/hotspots`,
  modelInfo: `${API_BASE_URL}/model-info`,
  states: `${API_BASE_URL}/states`,
  reserves: `${API_BASE_URL}/reserves`,
  speciesRisk: `${API_BASE_URL}/species-risk`,
  trends: `${API_BASE_URL}/trends`,           // ✅ ADD THIS
  alerts: `${API_BASE_URL}/alerts`,           // ✅ ADD THIS
  health: `${API_BASE_URL}/health`,
  articles: `${API_BASE_URL}/articles`,
}

// Log for debugging
console.log('🌐 API Base URL:', API_BASE_URL)