<template>
  <div class="user-page">
    <h1>User Profile</h1>
    <div class="user-info">
      <h2>Profile Information</h2>
      <p>Manage your account settings and preferences</p>
    </div>
    <div class="user-actions">
      <button>Edit Profile</button>
      <button>Order History</button>
      <button>Wishlist</button>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.user-page {
  padding: 2rem;
}

.user-info {
  margin-bottom: 2rem;
}

.user-actions {
  display: flex;
  gap: 1rem;
}

.user-actions button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f9f9f9;
  cursor: pointer;
}

.user-actions button:hover {
  background: #e9e9e9;
}
</style>