<template>
  <form @submit.prevent="handleSubmit" class="product-form">
    <h2>Add New Product</h2>
    
    <div class="form-group">
      <label for="name">Product Name *</label>
      <input 
        id="name"
        v-model="form.name" 
        type="text" 
        required 
        placeholder="Enter product name"
      />
    </div>

    <div class="form-group">
      <label for="category">Category</label>
      <select id="category" v-model="form.category">
        <option v-for="category in categoryOptions" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea 
        id="description"
        v-model="form.description" 
        placeholder="Enter product description"
        rows="4"
      ></textarea>
    </div>

    <div class="form-group">
      <label for="price">Price *</label>
      <input 
        id="price"
        v-model.number="form.price" 
        type="number" 
        min="0" 
        step="0.01" 
        required 
        placeholder="0.00"
      />
    </div>

    <div class="form-group">
      <label for="count">Amount in Stock *</label>
      <input 
        id="count"
        v-model.number="form.count" 
        type="number" 
        min="0" 
        required 
        placeholder="0"
      />
    </div>

    <div class="form-group">
      <label for="imageLinks">Image URLs</label>
      <div class="image-links">
        <input 
          v-for="(link, index) in form.imageLinks" 
          :key="index"
          v-model="form.imageLinks[index]"
          type="url" 
          :placeholder="`Image URL ${index + 1}`"
          class="image-input"
        />
        <button type="button" @click="addImageLink" class="add-image-btn">
          + Add Image URL
        </button>
        <button 
          v-if="form.imageLinks.length > 1" 
          type="button" 
          @click="removeImageLink" 
          class="remove-image-btn"
        >
          - Remove Last
        </button>
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? 'Adding...' : 'Add Product' }}
      </button>
      <button type="button" @click="resetForm" class="reset-btn">
        Reset
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Category } from '~/types'
import { useFirestore } from '~/composables/useFirestore'
import { useNotifications } from '~/composables/useNotifications'

const { createDocument } = useFirestore()
const { showSuccess, showError } = useNotifications()
const loading = ref(false)

const categoryOptions = Object.values(Category)

const form = reactive({
  name: '',
  category: Category.Misc,
  description: '',
  price: 0,
  count: 0,
  imageLinks: ['']
})

const addImageLink = () => {
  form.imageLinks.push('')
}

const removeImageLink = () => {
  if (form.imageLinks.length > 1) {
    form.imageLinks.pop()
  }
}

const resetForm = () => {
  form.name = ''
  form.category = Category.Misc
  form.description = ''
  form.price = 0
  form.count = 0
  form.imageLinks = ['']
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    const productData = {
      name: form.name,
      category: form.category,
      description: form.description,
      price: form.price,
      count: form.count,
      imageLinks: form.imageLinks.filter(link => link.trim() !== '')
    }

    const result = await createDocument('products', productData)
    
    if (result.error) {
      showError(`Failed to add product: ${result.error}`)
    } else {
      showSuccess(`Product "${form.name}" added successfully!`)
      resetForm()
    }
  } catch (error) {
    showError(`Error adding product: ${error.message}`)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.product-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.product-form h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
}

.image-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-input {
  margin-bottom: 0.5rem;
}

.add-image-btn,
.remove-image-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.add-image-btn:hover,
.remove-image-btn:hover {
  background: #f0f0f0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn {
  flex: 1;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.reset-btn {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.reset-btn:hover {
  background: #545b62;
}
</style>