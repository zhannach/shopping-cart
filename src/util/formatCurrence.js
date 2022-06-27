const formatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'USD',
})

export default function formatCurrency(amount) {
  return formatter.format(amount)
}
