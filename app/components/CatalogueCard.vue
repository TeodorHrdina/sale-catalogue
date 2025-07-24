<template>
  <div class="catalogue-card" @click="$emit('click', item)">
    <div class="card-image">
      <img 
        v-if="item.imageLinks && item.imageLinks.length > 0" 
        :src="item.imageLinks[0]" 
        :alt="item.name"
        @error="handleImageError"
      />
      <div v-else class="placeholder-image">
        <span class="placeholder-icon">{{ getCategoryIcon(item.category) }}</span>
      </div>
      <div v-if="item.count < 5" class="low-stock-badge">
        Low Stock
      </div>
      <div v-if="item.count === 0" class="out-of-stock-badge">
        Out of Stock
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="item-name">{{ item.name }}</h3>
      <p class="item-category">{{ item.category }}</p>
      <p class="item-description" v-if="item.description">
        {{ truncateDescription(item.description) }}
      </p>
      
      <div class="card-footer">
        <div class="price-section">
          <span class="price">${{ item.price?.toFixed(2) || '0.00' }}</span>
        </div>
        <div class="stock-section">
          <span :class="['stock-count', { 'low-stock': item.count < 5, 'out-of-stock': item.count === 0 }]">
            {{ item.count || 0 }} in stock
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Category } from '~/types'

// Props
defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Emits
defineEmits(['click'])

// Methods
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

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 100 ? description.substring(0, 100) + '...' : description
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  event.target.parentElement.classList.add('image-error')
}
</script>

<style scoped>
.catalogue-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.catalogue-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #f8f9fa;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.catalogue-card:hover .card-image img {
  transform: scale(1.05);
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
  font-size: 3rem;
  opacity: 0.8;
}

.image-error .placeholder-image {
  display: flex;
}

.low-stock-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ff9800;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.out-of-stock-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #f44336;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.card-content {
  padding: 1.25rem;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
}

.item-category {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

.item-description {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.4;
  margin: 0 0 1rem 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
}

.price-section .price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #059669;
}

.stock-section .stock-count {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.stock-count.low-stock {
  color: #f59e0b;
  font-weight: 600;
}

.stock-count.out-of-stock {
  color: #ef4444;
  font-weight: 600;
}

@media (max-width: 768px) {
  .card-image {
    height: 160px;
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .item-name {
    font-size: 1rem;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>