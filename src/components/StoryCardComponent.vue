<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import StoriesServices from "../services/StoriesServices";

const router = useRouter();

const showDeleteConf = ref(false);
const showDetails = ref(false);
const user = ref(null);

const props = defineProps({
  story: {
    required: true,
  },
  openEditPopup: Function,
  getUpdatedStories: Function,
  showSnackbar: Function,
  openDeletePopup: Function,
  getStories: Function,
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function deleteStory() {
  await StoriesServices.deleteStory(props.story.storyId)
    .then((response) => {
      props.showSnackbar("green", response.data.message);
      if (response.data.status == "success") {
        showDeleteConf.value = false;
        props.getUpdatedStories();
      }
    })
    .catch((error) => {
      console.log(error);
      props.showSnackbar("error", error.message);
    });
}

function navigateToEdit(e) {
  e?.stopPropagation();
  props.openEditPopup(props.story.storyId);
}

function getFormattedDate(date) {
  date = new Date(date);
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;

  return month + "/" + day + "/" + year;
}

function openDeletePopup(e) {
  e?.stopPropagation();
  showDeleteConf.value = true;
}

function closeDeletePopup() {
  showDeleteConf.value = false;
}
</script>

<template>
  <v-card class="rounded-lg elevation-5 mb-8" @click="showDetails = !showDetails">
    <v-card-title class="headline">
      <v-row align="center">
        <v-col>
          {{ story.title }} /
          <!-- <v-icon start icon="mdi-airplane-takeoff"></v-icon> -->
          <i>Genre :</i>
          {{ story.genre?.genreName }}
          <v-chip class="ma-2" color="purple-darken-2" label>
            <v-icon start icon="mdi-account"></v-icon>
            Max length : {{ story.storyLength }}
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <template v-if="user !== null">
            <router-link :to="{ name: 'storyById', params: { id: story?.id } }">
              <v-icon class="mr-3" size="small" icon="mdi-eye"></v-icon>
            </router-link>
          </template>
          <template v-if="user !== null">
            <v-icon class="mr-3" size="small" icon="mdi-delete" @click="(e) => openDeletePopup(e)"></v-icon>
          </template>
          <template v-if="user !== null">
            <v-icon size="small" icon="mdi-pencil" @click="(e) => navigateToEdit(e)"></v-icon>
          </template>
        </v-col>
      </v-row>
      <v-row>
        <p class="font-italic text-left">
          Characters:
          <template v-if="props.story.charactersDetails.length == 0"><span v-bind:style="{
            color: '#707070',
            'font-size': '14px',
          }">No characters available..</span></template>
          <template v-for="(character, cIndex) in story.charactersDetails" :key="{ cIndex }">
            <v-chip class="ma-2">
              {{ character?.name }} - {{ character?.role }}
            </v-chip>
          </template>
        </p>
      </v-row>
    </v-card-title>
  </v-card>
  <v-dialog persistent v-model="showDeleteConf" width="600">
    <v-container>
      <v-card class="rounded-lg elevation-5">
        <div class="pb-2 pl-5 pt-5 pr-5">Are you sure want to delete the story?
          <v-row class="mt-3">
            <v-col class="d-flex justify-end">
              <v-btn class="mr-3" variant="flat" color="secondary" @click="closeDeletePopup()">Cancel</v-btn>
              <v-btn variant="flat" color="primary" @click="deleteStory()">Confirm</v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-container>
  </v-dialog>
</template>