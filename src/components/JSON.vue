<!-- JSONLab.vue -->
<template>
  <div class="json-lab">
    <h1>🗄️ JSON Data & Vue Directives Lab</h1>

    <section class="lab-section">
      <h2>📚 Working with JSON Arrays</h2>
      <p>Our <code>authors.json</code> contains an array of author objects.</p>

      <h3>Iterating through Arrays</h3>
      <!-- Activity 6: Render a list containing author names and their birth years. Hint: Make use of the v-for directive to iterate through the array of authors. -->
      <!-- TODO: CODE TO RENDER LIST OF AUTHORS HERE -->
      <ul>
        <li v-for="author in authors" :key="author.id">
          {{ author.name }} ({{ author.birthYear }})
        </li>
      </ul>
      
      <h3>Filtering Arrays</h3>
      <!-- Activity 7: Render a list containing authors born after 1850. Hint: Make use of the v-for directive to iterate through the array of authors that you have filtered out. -->
      <p>Authors born after 1850:</p>
      <!-- TODO: CODE TO RENDER LIST OF AUTHORS HERE -->
      <ul>
        <li v-for="author in modernAuthors" :key="author.id"> 
          {{ author.name }} ({{ author.birthYear }})
        </li>
      </ul>

      <h3>Mapping Arrays</h3>
      <p>Famous works:</p>
      <ul>
        <!-- Activity 8: Render a list of all famous works. Hint: Use the v-for directive to iterate through the array of authors that you have filtered out. -->
        <!-- TODO: CODE TO RENDER LIST OF FAMOUS WORKS HERE -->
        <li v-for="work in allFamousWorks" :key="work">
          {{ work }}
        </li>
      </ul>

      <h3>Finding in Arrays</h3>
      <p>Finding by property: {{ orwell?.name }}</p>

      <h3>Nested Arrays/Objects</h3>
      <p>{{ austen?.name }}'s works:</p>
      <!-- Activity 9: Render a list of Austen's works. Hint: Use the v-for directive to iterate through the array of authors that you have filtered out. -->
      <!-- TODO: CODE TO RENDER LIST OF AUSTEN'S WORKS HERE -->
      <ul>
        <li v-for="work in austen?.famousWorks" :key="work.title">
          {{ work.title }} ({{ work.year }})
        </li>
      </ul>
    </section>

    <section class="lab-section">
      <h2>🏢 Working with JSON Objects</h2>
      <p>Our <code>bookstores.json</code> is a JSON object.</p>

      <h3>Accessing Properties</h3>
      <p>
        Company:
        <!-- Activity 9a: Get the company name from the bookstores object. -->
        <!-- TODO: CODE TO GET COMPANY NAME HERE -->
         {{ bookstores.name }}
      </p>

      <p>
        Total Stores:
        <!-- Activity 9b: Get the total number of stores from the bookstores object. -->
         {{ bookstores.totalStores }}
        <!-- TODO: CODE TO GET TOTAL STORES HERE -->
      </p>

      <h3>Iterating Object Properties</h3>
      <p>Store Types:</p>
      <!-- Activity 10: Iterate through the storeTypes array and display the store type and the number of stores that use that type. -->
      <!-- TODO: CODE TO RENDER LIST OF STORE TYPES HERE -->
      <ul>
        <li v-for="(count, type) in bookstores.storeTypes" :key="type">
          {{ type }}: {{ count }} stores
        </li>
      </ul>

      <h3>Nested Objects</h3>
      <p>Opening Hours:</p>
      <!-- Activity 11: Iterate through the openingHours object and display the day of the week and the opening and closing times. -->
      <!-- TODO: CODE TO RENDER LIST OF OPENING HOURS HERE -->
      <ul>
        <li v-for="(hours, day) in bookstores.openingHours" :key="day">
          {{ day }}: {{ hours.open }} - {{ hours.close }}
        </li>
      </ul>

      <h3>Working with Arrays in Objects</h3>
      <!-- Activity 12: Get the top sellers from the bookstores object. -->
      <!-- TODO: CODE TO GET TOP SELLERS HERE -->
      <p>We operate in:</p>
      <ul>
        <li v-for="country in bookstores.countries" :key="country">
          {{ country }}
        </li>
      </ul>
      <p>Our #1 seller: {{ bookstores.topSellers[0] }}</p>
    </section>

    <section class="lab-section">
      <h2>v-if & v-else</h2>
      <p>Toggle visibility based on a condition.</p>
      <!-- Activity 13: Toggle the message visibility when the button is clicked. -->
      <!-- TODO: CODE TO TOGGLE MESSAGE VISIBILITY HERE. Hint: Use the v-if directive. -->
      <button @click="showMessage = !showMessage">Toggle Message</button>
        <p v-if="showMessage" class="message success">
          ✨ You're a Vue superstar! ✨
        </p>
        <p v-else class="message">Click the button to see a message.</p>
    </section>

    <section class="lab-section">
      <h2>Attribute, Class and Style Binding with <code>v-bind</code></h2>
      <p>Highlighting Specific Authors:</p>
      
      <div class="author-highlight-demo">
        <h3>Authors List - George Orwell is highlighted:</h3>
        
        <div class="author-selector">
          <button 
            v-for="author in authors" 
            :key="author.id"
            :class="{ 'orwell-highlight': author.name === 'George Orwell' }"
            :style="{ 
              backgroundColor: author.name === 'George Orwell' ? '#ff6b6b' : '#f9f9f9',
              color: author.name === 'George Orwell' ? 'white' : '#333',
              fontWeight: author.name === 'George Orwell' ? 'bold' : 'normal'
            }"
            :title="author.name === 'George Orwell' ? 'This is George Orwell - Famous Author!' : `Author: ${author.name}`"
          >
            {{ author.name }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"

// Activity 1: Import JSON files (authors.json and bookstores.json)
// TODO: CODE TO IMPORT JSON FILES HERE
import authors from "../assets/json/authors.json"
import bookstores from "../assets/json/bookstores.json"

const showMessage = ref(false)



// Activity 2: Get authors born after 1850
const modernAuthors = computed(() => {
  // TODO: CODE TO FILTER ARRAY OF AUTHORS HERE
  return authors.filter((author) => author.birthYear > 1850)
})

// Activity 3: Get all famous works
const allFamousWorks = computed(() => {
  // TODO: CODE TO GET ALL FAMOUS WORKS HERE
  return authors.flatMap((author) => author.famousWorks.map((work) => work.title))
})

// Activity 4: Find author by name
const orwell = computed(() => {
  // TODO: CODE TO FIND AUTHOR BY NAME HERE
  return authors.find((author) => author.name === "George Orwell")
})

// Activity 5: Find author by ID
const austen = computed(() => {
  // TODO: CODE TO FIND AUTHOR BY ID HERE
  return authors.find((author) => author.id === 2)
})
</script>

<style scoped>
.json-lab {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  width: 100%;
  margin: 0;
  padding: 20px;
  background-color: #ffffff;
  color: #333333;
  box-sizing: border-box;
}

h1,
h2 {
  color: #222222;
}
h1 {
  text-align: center;
}

h3 {
  color: #333333;
}

p {
  color: #444444;
}

.lab-section {
  background-color: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message {
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}

.success {
  background-color: #e7faf3;
  color: #42b883;
  border: 1px solid #42b883;
}

.highlight {
  background-color: #42b883;
}

.orwell-highlight {
  border: 3px solid #ff6b6b !important;
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(255, 107, 107, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 6px 12px rgba(255, 107, 107, 0.4); }
  50% { box-shadow: 0 8px 16px rgba(255, 107, 107, 0.8); }
  100% { box-shadow: 0 6px 12px rgba(255, 107, 107, 0.4); }
}

.active {
  background-color: #42b883;
  color: white;
  border: 2px solid #42b883;
}

button {
  padding: 8px 16px;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 5px;
}

button:hover {
  background-color: #e9e9e9;
}

/* Author highlighting styles */
.author-highlight-demo {
  margin-top: 20px;
}

.author-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.author-selector button {
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.author-selector button.orwell-highlight {
  border-width: 3px;
}

code {
  background-color: #e0e0e0;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: "Courier New", Courier, monospace;
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  background-color: #f0f0f0;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
}
</style>
