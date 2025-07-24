<template>
  <div class="admin-page">
    <h1>Admin Dashboard</h1>
    <p>Manage your sale catalogue</p>
    <div class="admin-actions">
      <button>Add Product</button>
      <button>Manage Orders</button>
      <button>View Analytics</button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'admin'
})
</script>

<style scoped>
.admin-page {
  padding: 2rem;
}

.admin-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.admin-actions button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
  cursor: pointer;
}

.admin-actions button:hover {
  background: #e9e9e9;
}
</style>