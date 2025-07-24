<template>
  <div class="admin-page">
    <h1>Admin Dashboard</h1>
    <p>Manage your sale catalogue</p>
    
    <div v-if="!showAddProduct" class="dashboard-content">
      <div class="admin-actions">
        <button @click="showAddProduct = true">Add Product</button>
        <button>Manage Orders</button>
        <button>View Analytics</button>
      </div>
      
      <InventoryTable />
    </div>

    <div v-if="showAddProduct" class="product-form-container">
      <button @click="showAddProduct = false" class="back-btn">← Back to Dashboard</button>
      <ProductAddForm />
    </div>

    <NotificationBanner />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductAddForm from '~/components/ProductAddForm.vue'
import InventoryTable from '~/components/InventoryTable.vue'
import NotificationBanner from '~/components/NotificationBanner.vue'

definePageMeta({
  middleware: 'admin'
})

const showAddProduct = ref(false)
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

.product-form-container {
  margin-top: 2rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  margin-bottom: 1rem;
}

.back-btn:hover {
  background: #0056b3;
}
</style>