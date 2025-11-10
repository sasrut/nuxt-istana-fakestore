const API_URL = 'https://fakestoreapi.com/users'

export async function fetchUsersApi() {
  const res = await fetch(API_URL)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  const data = await res.json()
  console.log('Fetched users from API:', data)

  return data
}

export async function createUsersApi(payload) {
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

export async function fetchUsersById(id) {
  const res = await fetch(`${API_URL}/${id}`)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}

export async function updateUsersApi(id, payload) {
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

export async function deleteUsersApi(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }
  return res.json()
}