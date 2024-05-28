<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import addIcon from "../images/add-icon.png";
import "@vuepic/vue-datepicker/dist/main.css";
import StoriesServices from "../services/StoriesServices.js";

const route = useRoute();

const props = defineProps({
  viewType: String,
  storyEditId: null,
  getUpdatedStories: Function,
  closePopupEvent: Function,
  showSnackbar: Function,
});

const storyDetails = ref({
  storyId: null,
  title: "",
  genre: "",
  storyLength: 100,
  storyContent: "",
  charactersDetails: [],
  storyTheme: "",
  storyLaguage: "English",
  updatedDate: null,
});

const characterInfo = ref({
  name: "",
  role: "",
});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  if (props.storyEditId != null && props.viewType == "edit") {
    await getStory();
  }
});

async function getStory() {
  await StoriesServices.getStoryByStoryId(props.storyEditId)
    .then((response) => {
      let tempStory = {
        storyId: response.data.storyId,
        title: response.data.title,
        genre: response.data.genre,
        storyLength: response.data.storyLength,
        storyContent: response.data.storyContent,
        charactersDetails: response.data.charactersDetails,
        storyTheme: response.data.storyTheme,
        storyLaguage: response.data.storyLaguage,
        updatedDate: response.data.updatedDate,
      };
      storyDetails.value = tempStory;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateStory() {
  let payload = {
    userId: JSON.parse(localStorage.getItem("user")).id,
    ...storyDetails.value,
  };
  if (props.viewType == "edit") {
    await StoriesServices.updateStory(props.storyEditId, payload)
      .then((response) => {
        props.showSnackbar("green", response.data.message);
        if (response.data.status == "success") {
          props.getUpdatedStories();
        }
      })
      .catch((error) => {
        console.log(error);
        props.showSnackbar("error", error.message);
      });
  } else {
    await StoriesServices.addStory(payload)
      .then((response) => {
        props.showSnackbar("green", response.data.message);
        if (response.data.status == "success") {
          props.getUpdatedStories();
        }
      })
      .catch((error) => {
        console.log(error);
        props.showSnackbar("error", error.message);
      });
  }
}

const removeCharacter = (storyDetails, removeItem) => {
  let tempCharacters = [...storyDetails.charactersDetails];
  storyDetails.charactersDetails = tempCharacters.filter((e) => e != removeItem);
};

const closeParentPopup = () => {
  props.closePopupEvent();
};

function closeSnackBar() {
  snackbar.value.value = false;
}

const addCharacterClick = (char) => {
  if (char.name?.length > 0 && char.role?.length > 0) {
    storyDetails.charactersDetails?.push(char);
    char.name = "";
    char.role = "";
  }
};
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">{{ props.viewType == "add" ? "Add" : "Edit"
          }} Story
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card color="#232323" class="rounded-lg elevation-5 d-flex align-center">
          <v-card-text>
            <v-row align="center">
              <v-col cols="4">
                <v-text-field class="w-100" v-model="storyDetails.title" label="Story Title*" required></v-text-field>

              </v-col>
              <v-col cols="4"><v-text-field class="w-100" v-model="storyDetails.storyTheme" label="Theme*"
                  required></v-text-field>

              </v-col>
              <v-col cols="4"><v-text-field class="w-100" v-model="storyDetails.genre" label="Genre*"
                  required></v-text-field>

              </v-col>
              <v-col cols="4"><v-text-field class="w-100" v-model="storyDetails.storyLaguage" label="Language*"
                  required></v-text-field>

              </v-col>
              <v-col cols="4"><v-text-field class="w-100" v-model.number="storyDetails.storyLength" label="Max length*"
                  type="number" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <p class="font-italic text-left">
                  Characters:
                  <template v-if="storyDetails.charactersDetails.length == 0"><span v-bind:style="{
                    color: '#707070',
                    'font-size': '14px',
                  }">Please enter character role and name below and click on add to
                      list them..</span></template>
                  <template v-for="(character, cIndex) in storyDetails.charactersDetails" :key="{ cIndex }">
                    <v-chip class="ma-2" closable
                      @click:close="removeCharacter(storyDetails.charactersDetails, character)">
                      {{ character?.name }} - {{ character?.role }}
                    </v-chip>
                  </template>
                </p>
                <v-row no-gutters>
                  <v-col cols="4" class="d-flex justify-start">
                    <v-responsive max-width="350">
                      <v-text-field
                        v-model="characterInfo.name"
                        v-on:keyup.enter="addCharacterClick(characterInfo)"
                        label="Enter character name.."
                        clearable
                      ></v-text-field>
                    </v-responsive>
                  </v-col>
                  <v-col cols="4" class="d-flex justify-start">
                    <v-responsive max-width="350">
                      <v-text-field
                        v-model="characterInfo.role"
                        v-on:keyup.enter="addCharacterClick(characterInfo)"
                        label="Enter role name.."
                        clearable
                      ></v-text-field>
                    </v-responsive>
                  </v-col>
                  <v-col cols="1" class="d-flex mt-3"
                    ><div @click="addCharacterClick(characterInfo)">
                      <v-img
                        class="mx-2"
                        :src="addIcon"
                        height="30"
                        width="30"
                        v-bind:style="{ cursor: 'pointer' }"
                        contain
                      ></v-img></div></v-col
                ></v-row>
              </v-col>

            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex flex-row-reverse">
        <div>
          <v-btn class="mr-3" variant="flat" color="secondary" @click="closeParentPopup()">Cancel</v-btn>
          <v-btn v-if="props.viewType == 'add'" variant="flat" color="primary" @click="updateStory()" :disabled="!storyDetails?.title ||
            !storyDetails?.genre ||
            !storyDetails?.storyTheme ||
            !storyDetails?.storyLaguage ||
            !storyDetails?.storyLength
            ">Add Story</v-btn>
          <v-btn v-else variant="flat" color="primary" @click="updateStory()" :disabled="!storyDetails?.title ||
            !storyDetails?.genre ||
            !storyDetails?.storyTheme ||
            !storyDetails?.storyLaguage ||
            !storyDetails?.storyLength
            ">Update Story</v-btn>
        </div>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
