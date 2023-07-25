<template>
  <div>
    <Info @click="showModal = true" />
    <n-modal v-model:show="showModal">
      <n-card
        v-if="showData"
        :style="{ width: '1000px' }"
        :title="showData.name"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <div @click="showModal = false">Close</div>
        </template>
        <div class="" v-if="showData">
          <div class="flex flex-col md:flex-row overflow-y-scroll">
            <div class="md:w-1/3">
              <img
                v-if="showData.image"
                :src="showData.image.original"
                class="rounded-lg aspect-auto w-full h-auto"
                :alt="title"
              />
              <div v-else class="">No image</div>
            </div>
            <div class="mt-4 md:w-2/3 md:ml-2 md:mt-0">
              <div>
                <div class="inline-flex space-x-2 mb-4">
                  <div
                    class="rounded text-base bg-slate-400/70 inline-block text-white p-2"
                  >
                    <div
                      v-if="showData && showData.rating.average"
                      class="flex items-center"
                    >
                      {{ showData.rating.average
                      }}<Star class="ml-1" :size="18" />
                    </div>
                    <div v-else>no rating</div>
                  </div>
                  <div
                    class="rounded text-base bg-slate-400/70 inline-block text-white p-2"
                  >
                    <div v-if="showData.averageRuntime">
                      {{ showData.averageRuntime }} min
                    </div>
                    <div v-else>unknown runtime</div>
                  </div>
                  <div>
                    <div
                      v-if="showData.premiered || showData.ended"
                      class="flex rounded text-base bg-slate-400/70 inline-block text-white p-2"
                    >
                      <div class="">
                        <div v-if="showData.premiered">
                          {{ showData.premiered.slice(0, 4) }}
                        </div>
                      </div>
                      <div>-</div>
                      <div class="">
                        <div v-if="showData.ended">
                          {{ showData.ended.slice(0, 4) }}
                        </div>
                        <div v-else>ongoing</div>
                      </div>
                    </div>
                    <div v-else class="">unknown date</div>
                  </div>
                </div>
              </div>

              <div v-if="showData.genres && showData.genres.length > 0">
                Genre(s) :
                <span v-for="(genre, index) in showData.genres" :key="index">
                  {{ genre
                  }}<span v-if="index < showData.genres.length - 1">, </span>
                </span>
              </div>
              <div v-else>No genres</div>
              <div>
                <div>Status: {{ showData.status }}</div>
                <div>
                  Airing:
                  <span
                    v-if="
                      showData.schedule &&
                      showData.schedule.days.length > 0 &&
                      showData.schedule.time
                    "
                  >
                    {{ showData.schedule.days.join(", ") }} at
                    {{ showData.schedule.time }}
                  </span>
                  <span v-else>unknown schedule</span>
                </div>
                <div>
                  Network:
                  {{ showData.network ? showData.network.name : "Unknown" }}
                </div>

                <div class="mt-4">
                  Summary:
                  <span
                    v-html="showData.summary || 'No summary available'"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div
            v-if="showData && showData.officialSite"
            class="flex justify-center"
          >
            <a
              :href="showData.officialSite"
              target="_blank"
              class="btn btn-primary"
              ><n-button>Link to Official Website</n-button></a
            >
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { NButton, NModal, NCard } from "naive-ui";
import { ref, watch, toRef } from "vue";
import { Info } from "lucide-vue-next";

import { Star } from "lucide-vue-next";

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const id = toRef(props, "id");
const showModal = ref(false);
let showData = ref(null);
let fetchError = ref(null);

watch(showModal, async (newValue) => {
  if (newValue === true) {
    try {
      showData.value = await fetchData();
      console.log("data value from modal", showData.value);
    } catch (error) {
      fetchError.value = error;
      console.error("Error fetching data in modal:", error);
    }
  }
});

async function fetchData() {
  const response = await fetch(`http://api.tvmaze.com/shows/${id.value}`);
  if (!response.ok) {
    throw new Error(`error! status: ${response.status}`);
  }
  console.log("id value from modal", id.value);
  return await response.json();
}
</script>
