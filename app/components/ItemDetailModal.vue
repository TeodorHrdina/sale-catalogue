<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="modal-overlay" 
      @click="closeModal"
    >
      <div 
        class="modal-content" 
        @click.stop
      >
        <button class="close-btn" @click="closeModal">
          ×
        </button>
        
        <div class="modal-body">
          <div class="image-section">
            <div class="main-image">
              <img 
                v-if="item.imageLinks && item.imageLinks.length > 0" 
                :src="item.imageLinks[currentImageIndex]" 
                :alt="item.name"
                @error="handleImageError"
              />
              <div v-else class="placeholder-image">
                <span class="placeholder-icon">{{ getCategoryIcon(item.category) }}</span>
              </div>
            </div>
            
            <div v-if="item.imageLinks && item.imageLinks.length > 1" class="image-thumbnails">
              <div 
                v-for="(image, index) in item.imageLinks" 
                :key="index"
                :class="['thumbnail', { 'active': index === currentImageIndex }]"
                @click="currentImageIndex = index"
              >
                <img :src="image" :alt="`${item.name} ${index + 1}`" />
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <div class="header-info">
              <h2 class="item-title">{{ item.name }}</h2>
              <span class="category-badge">{{ item.category }}</span>
            </div>
            
            <div class="price-stock-info">
              <div class="price">
                <span class="price-label">Price:</span>
                <span class="price-value">${{ item.price?.toFixed(2) || '0.00' }}</span>
              </div>
              <div class="stock">
                <span class="stock-label">Stock:</span>
                <span :class="['stock-value', getStockClass(item.count)]">
                  {{ item.count || 0 }} available
                </span>
              </div>
            </div>
            
            <div class="description-section">
              <h3>Description</h3>
              <p class="description">
                {{ item.description || 'No description available.' }}
              </p>
            </div>
            
            <div class="actions-section">
              <button 
                class="add-to-cart-btn" 
                :disabled="item.count === 0"
                @click="addToCart"
              >
                {{ item.count === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
              <button class="contact-btn" @click="contactSeller">
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Category } from '~/types'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['close', 'add-to-cart', 'contact-seller'])

// Data
const currentImageIndex = ref(0)

// Watchers
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    currentImageIndex.value = 0
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

// Methods
const closeModal = () => {
  emit('close')
}

const getCategoryIcon = (category) => {
  const iconMap = {
    [Category.PCs]: '🖥️',
    [Category.MonitorsAndTVs]: '📺',
    [Category.Laptops]: '💻',
    [Category.Tablets]: '📱',
    [Category.Headphones]: '🎧',
    [Category.Cables]: '🔌',
    [Category.Peripherals]: '⌨️',
    [Category.Misc]: '📦'
  }
  return iconMap[category] || '📦'
}

const getStockClass = (count) => {
  if (count === 0) return 'out-of-stock'
  if (count < 5) return 'low-stock'
  return 'in-stock'
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.classList.add('image-error')
}

const addToCart = () => {
  emit('add-to-cart', props.item)
}

const contactSeller = () => {
  emit('contact-seller', props.item)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
}

.image-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.placeholder-icon {
  font-size: 4rem;
  opacity: 0.8;
}

.image-thumbnails {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.thumbnail {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.thumbnail.active {
  border-color: #2196f3;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.category-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  align-self: flex-start;
}

.price-stock-info {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.price, .stock {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-label, .stock-label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
}

.stock-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.stock-value.in-stock {
  color: #059669;
}

.stock-value.low-stock {
  color: #f59e0b;
}

.stock-value.out-of-stock {
  color: #ef4444;
}

.description-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.description {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.actions-section {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.add-to-cart-btn {
  flex: 1;
  background: #2196f3;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #1976d2;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.contact-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.contact-btn:hover {
  background: #4b5563;
}

@media (max-width: 768px) {
  .modal-body {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .main-image {
    height: 250px;
  }
  
  .actions-section {
    flex-direction: column;
  }
}
</style>