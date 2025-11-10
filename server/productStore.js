const API_URL = 'https://fakestoreapi.com/products'

export async function fetchProductsApi() {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const data = await res.json()
  console.log('Fetched products from API:', data)
  return data
}
export async function createProductApi(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

export async function updateProductApi(id, payload) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

export async function deleteProductApi(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

