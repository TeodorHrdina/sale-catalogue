<template>
  <div class="category-selector">
    <h3 v-if="label" class="selector-label">{{ label }}</h3>
    <div class="category-grid">
      <div
        v-for="category in categories"
        :key="category.value"
        :class="[
          'category-item',
          { 'category-item--selected': modelValue === category.value }
        ]"
        @click="selectCategory(category.value)"
      >
        <div class="category-circle">
          <span class="category-icon">{{ category.icon }}</span>
        </div>
        <span class="category-name">{{ category.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Category } from '~/types'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Category data with icons
const categories = computed(() => [
  {
    value: null,
    label: 'All Items',
    icon: '📋'
  },
  {
    value: Category.PCs,
    label: 'PCs',
    icon: '🖥️'
  },
  {
    value: Category.MonitorsAndTVs,
    label: 'Monitors & TVs',
    icon: '📺'
  },
  {
    value: Category.Laptops,
    label: 'Laptops',
    icon: '💻'
  },
  {
    value: Category.Tablets,
    label: 'Tablets',
    icon: '📱'
  },
  {
    value: Category.Headphones,
    label: 'Headphones',
    icon: '🎧'
  },
  {
    value: Category.Cables,
    label: 'Cables',
    icon: '🔌'
  },
  {
    value: Category.Peripherals,
    label: 'Peripherals',
    icon: '⌨️'
  },
  {
    value: Category.Misc,
    label: 'Miscellaneous',
    icon: '📦'
  }
])

// Methods
const selectCategory = (categoryValue) => {
  emit('update:modelValue', categoryValue)
}
</script>

<style scoped>
.category-selector {
  margin-bottom: 1.5rem;
}

.selector-label {
  margin-bottom: 1rem;
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  justify-items: center;
}

/* Try to fit all items in one row on larger screens */
@media (min-width: 1200px) {
  .category-grid {
    grid-template-columns: repeat(9, 1fr);
  }
}

/* Adjust for medium screens */
@media (min-width: 900px) and (max-width: 1199px) {
  .category-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* Adjust for smaller screens */
@media (min-width: 600px) and (max-width: 899px) {
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  max-width: 140px;
}

.category-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: all 0.2s ease;
}

.category-item:hover .category-circle {
  transform: scale(1.1);
}

.category-item--selected .category-circle {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  transform: scale(1.1);
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  text-align: center;
  line-height: 1.2;
}

.category-item--selected .category-name {
  color: #2196f3;
  font-weight: 600;
}

@media (max-width: 599px) {
  .category-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
  }
  
  .category-item {
    padding: 0.75rem;
    max-width: 120px;
  }
  
  .category-circle {
    width: 50px;
    height: 50px;
  }
  
  .category-icon {
    font-size: 1.25rem;
  }
  
  .category-name {
    font-size: 0.8rem;
  }
}

@media (max-width: 400px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .category-item {
    padding: 0.5rem;
    max-width: 100px;
  }
  
  .category-name {
    font-size: 0.75rem;
  }
}
</style>