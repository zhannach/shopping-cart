import items from './items.json'
import formatCurrency from './util/formatCurrence'
import addGlobalEventListener from './util/addGlobalEventListener'

const cartButton = document.querySelector('[data-cart-button]')
const cartWrapper = document.querySelector('[data-cart-item-wrapper]')
let shoppingCart = []
const IMAGE_URL = 'https://dummyimage.com/210x130'
const cartItemTemplate = document.querySelector('.cart-item-template')
const cartItemContainer = document.querySelector('[data-cart-items]')
const cartQuantity = document.querySelector('[data-cart-quantity]')
const cartTotal = document.querySelector('[data-cart-total]')
const cart = document.querySelector('[data-cart]')
const SESSION_STORAGE_KEY = 'SHOPPING-CART-cart'

export function setupShoppingCart() {
  addGlobalEventListener('click', '[data-remove-from-cart-button]', (e) => {
    const id = e.target.closest('[data-item ]').dataset.itemId
    removeFromCart(parseInt(id))
  })
  shoppingCart = loadCart()
  renderCart()

  cartButton.addEventListener('click', () => {
    cartWrapper.classList.toggle('invisible')
  })
}

function loadCart() {
  const item = sessionStorage.getItem(SESSION_STORAGE_KEY)
  return JSON.parse(item) || []
}

function saveCart() {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(shoppingCart))
}

export function addCart(id) {
  const exictingItem = shoppingCart.find((entry) => entry.id === id)
  if (exictingItem) {
    exictingItem.quantity++
  } else {
    shoppingCart.push({ id, quantity: 1 })
  }
  renderCart()
  saveCart()
}

function removeFromCart(id) {
  const exictingItem = shoppingCart.find((entry) => entry.id === id)
  if (exictingItem == null) {
    return
  }
  shoppingCart = shoppingCart.filter((entry) => entry.id !== id)
  renderCart()
  saveCart()
}

function renderCart() {
  if (shoppingCart.length === 0) {
    hideCart()
  } else {
    showCart()
    renderCartItems()
  }
}

function hideCart() {
  cart.classList.add('invisible')
  cartWrapper.classList.add('invisible')
}

function showCart() {
  cart.classList.remove('invisible')
}

function renderCartItems() {
  cartQuantity.innerText = shoppingCart.length

  const totalCents = shoppingCart.reduce((sum, entry) => {
    const item = items.find((i) => entry.id === i.id)
    return sum + item.priceCents * entry.quantity
  }, 0)

  cartTotal.innerHTML = formatCurrency(totalCents / 100)

  cartItemContainer.innerText = ''
  shoppingCart.forEach((entry) => {
    const item = items.find((i) => entry.id === i.id)
    const cartItem = cartItemTemplate.content.cloneNode(true)

    const container = cartItem.querySelector('[data-item]')
    container.dataset.itemId = item.id

    const name = cartItem.querySelector('[data-name]')
    name.innerText = item.name

    if (entry.quantity > 1) {
      const quantity = cartItem.querySelector('[data-quantity]')
      quantity.innerText = `x${entry.quantity}`
    }

    const image = cartItem.querySelector('[data-image]')
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`

    const price = cartItem.querySelector('[data-price]')
    price.innerText = formatCurrency((item.priceCents * entry.quantity) / 100)

    cartItemContainer.append(cartItem)
  })
}
