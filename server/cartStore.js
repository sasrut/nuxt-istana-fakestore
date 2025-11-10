const API_URL = 'https://fakestoreapi.com/carts'

export async function fetchCartApi() {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const data = await res.json()
  console.log('Fetched products from API:', data)
  return data
}

export async function createCartApi(payload) {
    const res = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    return res.json()
}

export async function fetchCartById(id) {
    const res = await fetch(`${API_URL}/${id}`,{
    //  method: 'GET',
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    return res.json()
}

export async function deleteCartById(id) { 
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    return res.json()
}