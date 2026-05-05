<template>
  <q-page class="tickets-page q-pa-md q-pa-md-xl">
    <div class="row items-center q-mb-xl">
      <q-btn flat round icon="arrow_back" color="primary" @click="$router.back()" class="q-mr-md" />
      <div>
        <div class="text-h4 text-weight-bolder text-primary tracking-tight">Tickets & Events</div>
        <div class="text-subtitle1 text-grey-7">Book movies, travel, and events instantly</div>
      </div>
    </div>

    <!-- Search Section -->
    <q-card class="search-card border-radius-24 q-pa-lg q-mb-xl shadow-2 no-border">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-input outlined rounded v-model="searchQuery" placeholder="Search for movies, events, or destinations..." bg-color="white">
            <template v-slot:prepend>
              <q-icon name="search" color="primary" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-4">
          <q-btn color="primary" unelevated rounded class="full-width full-height text-weight-bold" label="Search" no-caps />
        </div>
      </div>
    </q-card>

    <!-- Categories Grid -->
    <div class="text-h6 text-weight-bold q-mb-md">Categories</div>
    <div class="row q-col-gutter-md q-mb-xl">
      <div v-for="cat in categories" :key="cat.label" class="col-6 col-sm-3">
        <q-card class="category-card text-center q-pa-lg cursor-pointer transition-hover no-shadow border-radius-20" @click="selectCategory(cat)">
          <q-avatar :color="cat.color + '-1'" :text-color="cat.color" :icon="cat.icon" size="64px" class="q-mb-md" />
          <div class="text-subtitle2 text-weight-bold">{{ cat.label }}</div>
          <div class="text-caption text-grey-6">{{ cat.count }} available</div>
        </q-card>
      </div>
    </div>

    <!-- Featured Events -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold">Upcoming Events</div>
      <q-btn flat color="primary" label="View All" no-caps />
    </div>
    
    <div class="row q-col-gutter-lg">
      <div v-for="event in featuredEvents" :key="event.title" class="col-12 col-sm-6 col-md-4">
        <q-card class="event-card overflow-hidden no-shadow border-radius-24 cursor-pointer">
          <q-img :src="event.image" height="200px">
            <div class="absolute-top-right q-ma-sm">
              <q-badge color="white" text-color="dark" class="text-weight-bold q-pa-sm border-radius-12 shadow-1">
                {{ event.price }}
              </q-badge>
            </div>
          </q-img>
          <q-card-section class="q-pa-lg">
            <div class="row items-center q-mb-xs">
              <q-icon name="event" color="grey-6" size="xs" class="q-mr-xs" />
              <div class="text-caption text-grey-7">{{ event.date }}</div>
            </div>
            <div class="text-h6 text-weight-bold q-mb-sm line-clamp-1">{{ event.title }}</div>
            <div class="row items-center text-grey-7">
              <q-icon name="location_on" size="xs" class="q-mr-xs" />
              <div class="text-caption">{{ event.location }}</div>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-px-lg q-pb-lg">
            <q-btn unelevated color="primary" label="Book Now" rounded no-caps class="q-px-lg text-weight-bold" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')

const categories = [
  { label: 'Movies', icon: 'movie', color: 'red', count: 12 },
  { label: 'Bus', icon: 'directions_bus', color: 'blue', count: 45 },
  { label: 'Flights', icon: 'flight', color: 'indigo', count: 8 },
  { label: 'Events', icon: 'local_activity', color: 'orange', count: 24 }
]

const featuredEvents = [
  {
    title: 'Interstellar - IMAX Re-Release',
    date: 'Oct 15, 2026 • 08:30 PM',
    location: 'Universal Cineplex, Karachi',
    price: 'Rs 1,500',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&h=400&fit=crop'
  },
  {
    title: 'Tech Summit 2026',
    date: 'Nov 02, 2026 • 09:00 AM',
    location: 'Expo Center, Lahore',
    price: 'Rs 3,000',
    image: '/events/tech_summit.png'
  },
  {
    title: 'Soulify Musical Night',
    date: 'Dec 12, 2026 • 07:00 PM',
    location: 'Arts Council, Islamabad',
    price: 'Rs 2,500',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&h=400&fit=crop'
  }
]

interface Category {
  label: string
  icon: string
  color: string
  count: number
}

const selectCategory = (cat: Category) => {
  console.log('Category selected:', cat.label)
}
</script>

<style scoped>
.tickets-page {
  background: #fbfcfe;
}

.search-card {
  background: white;
  border: 1px solid rgba(0,0,0,0.05);
}

.category-card {
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.category-card:hover {
  transform: translateY(-5px);
  border-color: var(--q-primary);
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05) !important;
}

.event-card {
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1) !important;
}

.border-radius-24 { border-radius: 24px !important; }
.border-radius-20 { border-radius: 20px !important; }
.border-radius-12 { border-radius: 12px !important; }

.tracking-tight { letter-spacing: -0.03em; }
.tracking-widest { letter-spacing: 0.1em; }

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
