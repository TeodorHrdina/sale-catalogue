<template>
  <div class="inventory-table">
    <h2>Current Inventory</h2>
    
    <div v-if="loading" class="loading">
      Loading inventory...
    </div>
    
    <div v-else-if="error" class="error">
      Error loading inventory: {{ error }}
    </div>
    
    <div v-else-if="products.length === 0" class="empty">
      No products in inventory
    </div>
    
    <table v-else class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id" class="product-row">
          <td>
            <span v-if="editingId !== product.id">{{ product.name }}</span>
            <input 
              v-else 
              v-model="editForm.name" 
              type="text" 
              class="edit-input"
            />
          </td>
          
          <td>
            <span v-if="editingId !== product.id">{{ product.category }}</span>
            <select v-else v-model="editForm.category" class="edit-select">
              <option v-for="category in categoryOptions" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </td>
          
          <td>
            <span v-if="editingId !== product.id">${{ product.price?.toFixed(2) || '0.00' }}</span>
            <input 
              v-else 
              v-model.number="editForm.price" 
              type="number" 
              min="0" 
              step="0.01" 
              class="edit-input price-input"
            />
          </td>
          
          <td>
            <span v-if="editingId !== product.id" :class="{ 'low-stock': product.count < 5 }">
              {{ product.count || 0 }}
            </span>
            <input 
              v-else 
              v-model.number="editForm.count" 
              type="number" 
              min="0" 
              class="edit-input count-input"
            />
          </td>
          
          <td>
            <span v-if="editingId !== product.id" class="description">
              {{ product.description || 'No description' }}
            </span>
            <textarea 
              v-else 
              v-model="editForm.description" 
              class="edit-textarea"
              rows="2"
            ></textarea>
          </td>
          
          <td class="actions">
            <div v-if="editingId !== product.id" class="action-buttons">
              <button @click="startEditing(product)" class="edit-btn">
                Edit
              </button>
              <button @click="deleteProduct(product.id)" class="delete-btn">
                Delete
              </button>
            </div>
            <div v-else class="action-buttons">
              <button @click="saveChanges(product.id)" class="save-btn" :disabled="updating">
                {{ updating ? 'Saving...' : 'Save' }}
              </button>
              <button @click="cancelEditing" class="cancel-btn">
                Cancel
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    
    <button @click="refreshInventory" class="refresh-btn" :disabled="loading">
      {{ loading ? 'Loading...' : 'Refresh' }}
    </button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Category } from '~/types'
import { useFirestore } from '~/composables/useFirestore'
import { useNotifications } from '~/composables/useNotifications'

const { getCollection, updateDocument, deleteDocument } = useFirestore()
const { showSuccess, showError } = useNotifications()

const products = ref([])
const loading = ref(false)
const error = ref(null)
const updating = ref(false)
const editingId = ref(null)

const categoryOptions = Object.values(Category)

const editForm = reactive({
  name: '',
  category: Category.Misc,
  description: '',
  price: 0,
  count: 0
})

const loadInventory = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await getCollection('products')
    if (result.error) {
      error.value = result.error
    } else {
      products.value = result.data
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const startEditing = (product) => {
  editingId.value = product.id
  editForm.name = product.name
  editForm.category = product.category
  editForm.description = product.description || ''
  editForm.price = product.price || 0
  editForm.count = product.count || 0
}

const cancelEditing = () => {
  editingId.value = null
  Object.assign(editForm, {
    name: '',
    category: Category.Misc,
    description: '',
    price: 0,
    count: 0
  })
}

const saveChanges = async (productId) => {
  updating.value = true
  
  try {
    const updateData = {
      name: editForm.name,
      category: editForm.category,
      description: editForm.description,
      price: editForm.price,
      count: editForm.count
    }
    
    const result = await updateDocument('products', productId, updateData)
    
    if (result.error) {
      showError(`Failed to update product: ${result.error}`)
    } else {
      // Update local product data
      const productIndex = products.value.findIndex(p => p.id === productId)
      if (productIndex !== -1) {
        Object.assign(products.value[productIndex], updateData)
      }
      cancelEditing()
      showSuccess(`Product "${editForm.name}" updated successfully!`)
    }
  } catch (err) {
    showError(`Error updating product: ${err.message}`)
  } finally {
    updating.value = false
  }
}

const deleteProduct = async (productId) => {
  if (!confirm('Are you sure you want to delete this product?')) {
    return
  }
  
  const productName = products.value.find(p => p.id === productId)?.name || 'Unknown'
  
  try {
    const result = await deleteDocument('products', productId)
    
    if (result.error) {
      showError(`Failed to delete product: ${result.error}`)
    } else {
      products.value = products.value.filter(p => p.id !== productId)
      showSuccess(`Product "${productName}" deleted successfully!`)
    }
  } catch (err) {
    showError(`Error deleting product: ${err.message}`)
  }
}

const refreshInventory = () => {
  loadInventory()
}

onMounted(() => {
  loadInventory()
})
</script>

<style scoped>
.inventory-table {
  margin-top: 2rem;
}

.inventory-table h2 {
  margin-bottom: 1rem;
  color: #333;
}

.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.product-row:hover {
  background: #f8f9fa;
}

.edit-input,
.edit-select,
.edit-textarea {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.price-input,
.count-input {
  width: 80px;
}

.description {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.low-stock {
  color: #dc3545;
  font-weight: 600;
}

.actions {
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.save-btn {
  padding: 0.25rem 0.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.edit-btn:hover,
.save-btn:hover:not(:disabled) {
  background: #0056b3;
}

.delete-btn {
  padding: 0.25rem 0.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.delete-btn:hover {
  background: #c82333;
}

.cancel-btn {
  padding: 0.25rem 0.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.cancel-btn:hover {
  background: #545b62;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.refresh-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.refresh-btn:hover:not(:disabled) {
  background: #218838;
}

.refresh-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>