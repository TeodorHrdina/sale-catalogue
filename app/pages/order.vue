<template>
  <div class="order-page">
    <h1>Order Management</h1>
    <div class="order-sections">
      <div class="current-order">
        <h2>Current Order</h2>
        <p>Review your current order details</p>
      </div>
      <div class="order-history">
        <h2>Order History</h2>
        <p>View past orders and track shipments</p>
      </div>
    </div>
    <div class="order-actions">
      <button>View Cart</button>
      <button>Checkout</button>
      <button>Track Order</button>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.order-page {
  padding: 2rem;
}

.order-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
}

.current-order,
.order-history {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.order-actions {
  display: flex;
  gap: 1rem;
}

.order-actions button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
  cursor: pointer;
}

.order-actions button:hover {
  background: #e9e9e9;
}
</style>