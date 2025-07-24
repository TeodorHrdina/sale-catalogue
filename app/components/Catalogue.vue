<template>
  <div class="catalogue">
    <div class="catalogue-header">
      <h2>{{ title }}</h2>
      <div class="results-info">
        <span v-if="loading">Loading products...</span>
        <span v-else-if="error" class="error-text">{{ error }}</span>
        <span v-else>{{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }} found</span>
      </div>
    </div>
    
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading products...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="loadProducts" class="retry-btn">Try Again</button>
    </div>
    
    <div v-else-if="filteredProducts.length === 0" class="empty-state">
      <div class="empty-icon">📦</div>
      <h3>No products found</h3>
      <p v-if="selectedCategory">No products available in the {{ selectedCategory }} category.</p>
      <p v-else>No products available at the moment.</p>
    </div>
    
    <div v-else class="products-grid">
      <CatalogueCard 
        v-for="product in filteredProducts" 
        :key="product.id"
        :item="product"
        @click="openProductDetail"
      />
    </div>
    
    <ItemDetailModal 
      :is-open="showDetailModal"
      :item="selectedProduct"
      @close="closeProductDetail"
      @add-to-cart="handleAddToCart"
      @contact-seller="handleContactSeller"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useFirestore } from '~/composables/useFirestore'
import { useNotifications } from '~/composables/useNotifications'
import CatalogueCard from './CatalogueCard.vue'
import ItemDetailModal from './ItemDetailModal.vue'

// Props
const props = defineProps({
  selectedCategory: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: 'Product Catalogue'
  }
})

// Composables
const { getCollection } = useFirestore()
const { showSuccess, showInfo } = useNotifications()

// Data
const products = ref([])
const loading = ref(false)
const error = ref(null)
const showDetailModal = ref(false)
const selectedProduct = ref({})

// Computed
const filteredProducts = computed(() => {
  if (!props.selectedCategory) {
    return products.value
  }
  return products.value.filter(product => product.category === props.selectedCategory)
})

// Methods
const loadProducts = async () => {
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

const openProductDetail = (product) => {
  selectedProduct.value = product
  showDetailModal.value = true
}

const closeProductDetail = () => {
  showDetailModal.value = false
  selectedProduct.value = {}
}

const handleAddToCart = (product) => {
  // This would typically integrate with a cart system
  showSuccess(`Added "${product.name}" to cart!`)
  closeProductDetail()
}

const handleContactSeller = (product) => {
  // This would typically open a contact form or redirect to contact page
  showInfo(`Contact information for "${product.name}" will be provided soon.`)
}

// Watchers
watch(() => props.selectedCategory, () => {
  // Optionally reload products when category changes
  // or just rely on computed filteredProducts
})

// Lifecycle
onMounted(() => {
  loadProducts()
})
</script>

<style scoped>
.catalogue {
  padding: 2rem 0;
}

.catalogue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.catalogue-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.results-info {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

.error-text {
  color: #ef4444;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-left: 4px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1.5rem;
}

.error-message {
  color: #ef4444;
  font-size: 1.1rem;
  text-align: center;
  margin: 0;
}

.retry-btn {
  background: #2196f3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #1976d2;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .catalogue {
    padding: 1rem 0;
  }
  
  .catalogue-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .loading-state,
  .error-state,
  .empty-state {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>