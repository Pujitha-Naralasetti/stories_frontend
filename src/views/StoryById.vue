<script setup>
import { onMounted, ref } from "vue";
import StoriesServices from "../services/StoriesServices";
import { useRoute } from "vue-router";

const router = useRoute();

const user = ref({
    email: "",
    firstName: "",
    lastName: "",
    id: null,
    token: "",
});

const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const longStringContent = ref(``);
const story = ref({
    id: null,
    title: "",
    genre: null,
    storyLength: null,
    content: ``,
    characters: [],
    storyTheme: null,
    storyLaguage: null,
    updatedDate: null,
});

onMounted(async () => {
    user.value = JSON.parse(localStorage.getItem("user"));
    await getStory(router?.params?.id);
});

async function getStory(storyId) {
    await StoriesServices.getStoryByStoryId(storyId)
        .then((response) => {
            story.value = response?.data?.data;
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

</script>
<template>
    <v-container>
        <v-card class="rounded-lg elevation-5" color="#232323" dark>
            <v-card-title>{{ story.title }}</v-card-title>
            <v-card-subtitle>{{ story.genre?.genreName }}</v-card-subtitle>
            <v-card-text>
                <div class="long-content">{{ story?.content }}</div>
            </v-card-text>
            <v-card-actions>
                <v-btn class="mr-3" variant="flat" color="secondary" :to="{ name: 'stories' }">Back</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<style scoped>
.long-content {
    white-space: pre-line;
    /* CSS to handle new lines */
    color: #fff;
    margin-top: 20px;
}
</style>