<template>
  <!-- Responsive Testing Controller -->
  <div class="responsive-tester" v-if="showTester">
    <div class="tester-header">
      <h5>Responsive Testing Tool</h5>
      <button class="btn btn-sm btn-outline-secondary" @click="toggleTester">×</button>
    </div>
    <div class="tester-content">
      <label>Screen Width: {{ currentWidth }}px</label>
      <input 
        type="range" 
        v-model="currentWidth" 
        min="320" 
        max="1920" 
        step="10"
        class="form-range"
        @input="updateViewport"
      >
      <div class="preset-buttons">
        <button class="btn btn-sm btn-outline-primary" @click="setWidth(375)">Mobile</button>
        <button class="btn btn-sm btn-outline-primary" @click="setWidth(768)">Tablet</button>
        <button class="btn btn-sm btn-outline-primary" @click="setWidth(1024)">Desktop</button>
        <button class="btn btn-sm btn-outline-primary" @click="setWidth(1920)">Large Screen</button>
      </div>
    </div>
  </div>

  <!-- Testing Tool Toggle Button -->
  <div class="toggle-tester">
    <button class="btn btn-sm btn-primary" @click="toggleTester">
      {{ showTester ? 'Hide' : 'Show' }} Testing Tool
    </button>
  </div>

  <div class="container mt-5" :style="{ maxWidth: currentWidth + 'px', margin: '0 auto' }">
    <div class="row">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 offset-sm-1 offset-md-2 offset-lg-3">
        <h1 class="text-center">User Information Form</h1>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-12 col-md-6 mb-3 mb-md-0">
              <label for="username" class="form-label">Username *</label>
              <input type="text" class="form-control" id="username" 
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username" 
                placeholder="Enter your username..." />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            <div class="col-12 col-md-6">
              <label for="password" class="form-label">Password *</label>
              <input type="password" class="form-control" id="password" 
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password" 
                placeholder="Enter your password..." />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12 col-md-6 mb-3 mb-md-0">
              <div class="form-check">
                <input type="checkbox" class="form-check-input" id="isAustralian" 
                  @change="validateResident"
                  v-model="formData.isAustralian">
                <label class="form-check-label" for="isAustralian">Australian Resident? *</label>
              </div>
              <div v-if="errors.resident" class="text-danger">{{ errors.resident }}</div>
            </div>
            <div class="col-12 col-md-6">
              <label for="gender" class="form-label">Gender *</label>
              <select class="form-select" id="gender" 
                @blur="validateGender"
                @change="validateGender"
                v-model="formData.gender">
                <option value="">Please select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.gender" class="text-danger">{{ errors.gender }}</div>
            </div>
          </div>
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining *</label>
            <textarea class="form-control" id="reason" rows="3" 
              @blur="() => validateReason(true)"
              @input="() => validateReason(false)"
              v-model="formData.reason"
              placeholder="Enter your reason for joining..."></textarea>
            <div v-if="errors.reason" class="text-danger">{{ errors.reason }}</div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2 mb-2 mb-sm-0">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="container mt-5" v-if="submittedCards.length">
    <div class="row">
      <div class="col-12">
        <h2 class="text-center mb-4">Submitted User Information</h2>
        <DataTable 
          :value="submittedCards" 
          :paginator="true" 
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20]"
          tableStyle="min-width: 50rem"
          :responsive="true"
          class="p-datatable-striped"
        >
          <Column field="username" header="Username" sortable>
            <template #body="slotProps">
              <strong>{{ slotProps.data.username }}</strong>
            </template>
          </Column>
          <Column field="password" header="Password" sortable>
            <template #body="slotProps">
              <span class="password-mask">{{ '*'.repeat(slotProps.data.password.length) }}</span>
            </template>
          </Column>
          <Column field="isAustralian" header="Australian Resident" sortable>
            <template #body="slotProps">
              <Tag 
                :value="slotProps.data.isAustralian ? 'Yes' : 'No'" 
                :severity="slotProps.data.isAustralian ? 'success' : 'secondary'"
              />
            </template>
          </Column>
          <Column field="gender" header="Gender" sortable>
            <template #body="slotProps">
              <i class="pi" :class="{
                'pi-mars text-blue-500': slotProps.data.gender === 'male',
                'pi-venus text-pink-500': slotProps.data.gender === 'female',
                'pi-user text-gray-500': slotProps.data.gender === 'other'
              }"></i>
              {{ slotProps.data.gender ? slotProps.data.gender.charAt(0).toUpperCase() + slotProps.data.gender.slice(1) : '' }}
            </template>
          </Column>
          <Column field="reason" header="Reason for Joining" sortable>
            <template #body="slotProps">
              <div class="reason-text" :title="slotProps.data.reason">
                {{ slotProps.data.reason.length > 50 ? slotProps.data.reason.substring(0, 50) + '...' : slotProps.data.reason }}
              </div>
            </template>
          </Column>
          <Column header="Actions">
            <template #body="slotProps">
              <Button 
                icon="pi pi-trash" 
                severity="danger" 
                text 
                rounded 
                @click="deleteUser(slotProps.index)"
                v-tooltip="'Delete User'"
              />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>



<script setup>
// Our logic will go here
import { ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
  
const formData = ref({
    username: '',
    password: '',
    isAustralian: false,
    reason: '',
    gender: ''
});

const submittedCards = ref([]);

// Responsive testing tool
const showTester = ref(false);
const currentWidth = ref(1200);

const toggleTester = () => {
    showTester.value = !showTester.value;
};

const setWidth = (width) => {
    currentWidth.value = width;
    updateViewport();
};

const updateViewport = () => {
    // 这里可以添加额外的逻辑来响应宽度变化
    console.log('Current test width:', currentWidth.value + 'px');
};

const clearForm = () => {
    formData.value = {
        username: '',
        password: '',
        isAustralian: false,
        reason: '',
        gender: ''
    };
    // Clear all error messages
    errors.value = {
        username: null,
        password: null,
        resident: null,
        gender: null,
        reason: null
    };
};

const submitForm = () => {
  validateName(true);
  validatePassword(true);
  validateResident();
  validateGender();
  validateReason(true);
  
  if (!errors.value.username && !errors.value.password && 
      !errors.value.resident && !errors.value.gender && 
      !errors.value.reason) {
    submittedCards.value.push({ ...formData.value });
    clearForm();
  }
};


const errors = ref({
  username: null,
  password: null,
  resident: null,
  gender: null,
  reason: null
});

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = "Name must be at least 3 characters";
  } else {
    errors.value.username = null;
  }
};

const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    if (blur) errors.value.password = "Password must contain at least one uppercase letter.";
  } else if (!hasLowercase) {
    if (blur) errors.value.password = "Password must contain at least one lowercase letter.";
  } else if (!hasNumber) {
    if (blur) errors.value.password = "Password must contain at least one number.";
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = "Password must contain at least one special character.";
  } else {
    errors.value.password = null;
  }
};

const validateResident = () => {
  // For Australian resident status, we require users to confirm (check the checkbox)
  if (!formData.value.isAustralian) {
    errors.value.resident = "Please confirm your Australian residency status.";
  } else {
    errors.value.resident = null;
  }
};

const validateGender = () => {
  if (!formData.value.gender || formData.value.gender === '') {
    errors.value.gender = "Please select your gender.";
  } else {
    errors.value.gender = null;
  }
};

const validateReason = (blur) => {
  const reason = formData.value.reason.trim();
  const minLength = 10;
  
  if (reason.length === 0) {
    if (blur) errors.value.reason = "Please provide a reason for joining.";
  } else if (reason.length < minLength) {
    if (blur) errors.value.reason = `Reason must be at least ${minLength} characters long.`;
  } else {
    errors.value.reason = null;
  }
};

const deleteUser = (index) => {
  submittedCards.value.splice(index, 1);
};
</script>

<style scoped>
/* Responsive testing tool styles */
.responsive-tester {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #fff;
  border: 2px solid #007bff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 280px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.tester-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9ecef;
}

.tester-header h5 {
  margin: 0;
  color: #007bff;
  font-size: 16px;
  font-weight: 600;
}

.tester-content label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.form-range {
  width: 100%;
  margin-bottom: 15px;
}

.preset-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.preset-buttons .btn {
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 6px;
}

.toggle-tester {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}

.toggle-tester .btn {
  border-radius: 20px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

/* Card styling */
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 0; /* Prevent card from growing too wide */
}

.card-header {
  background-color: #275FDA;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}

.list-group-item {
  padding: 10px;
  word-wrap: break-word; /* Handle long text */
}

/* Form validation styles */
.text-danger {
  font-size: 0.875rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-control:focus, .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control.is-invalid, .form-select.is-invalid {
  border-color: #dc3545;
}

.form-check-label {
  font-weight: 500;
  cursor: pointer;
}

.form-check-input {
  cursor: pointer;
}

/* Required field indicator */
.form-label::after {
  content: "";
}

.form-label:has(+ input[required])::after,
.form-label:has(+ select[required])::after,
.form-label:has(+ textarea[required])::after {
  content: " *";
  color: #dc3545;
}

/* Success state */
.form-control.is-valid, .form-select.is-valid {
  border-color: #28a745;
}

.form-control.is-valid:focus, .form-select.is-valid:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

/* PrimeVue DataTable styles */
.p-datatable {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.p-datatable .p-datatable-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.p-datatable .p-datatable-thead > tr > th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background-color: #f8f9fa;
}

.password-mask {
  font-family: monospace;
  letter-spacing: 2px;
  color: #6c757d;
}

.reason-text {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: help;
}

.text-blue-500 { color: #3b82f6; }
.text-pink-500 { color: #ec4899; }
.text-gray-500 { color: #6b7280; }

/* Responsive adjustments */
@media (max-width: 576px) {
  .container {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .btn:last-child {
    margin-bottom: 0;
  }

  .responsive-tester {
    position: relative;
    top: auto;
    right: auto;
    margin: 10px;
    min-width: auto;
    width: calc(100% - 20px);
  }

  .toggle-tester {
    position: relative;
    top: auto;
    right: auto;
    text-align: center;
    margin: 10px 0;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .card {
    min-width: 250px;
  }
}

@media (min-width: 769px) {
  .card {
    min-width: 280px;
  }
}
</style>