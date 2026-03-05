<template>
  <div class="flex w-full">
    <div
      class="pb-2 my-2 mx-2 shadow-2xl inline-block w-40 h-fit border border-black"
    >
      <h1
        class="text-5xl border border-black px-2 bg-black text-white w-100 h-[110px] cursor-pointer"
      >
        Army List
      </h1>
      <ul>
        <li
          @dragstart="startDrag($event, name)"
          @dragend="isDragging = false"
          class="hover:bg-green-700 active:bg-green-600 hover:text-white focus:bg-green-500 text-medium font-medium mx-2 my-1 px-2.5 py-0.5 rounded"
          v-for="(id, name) in CCStateList"
          :key="id"
          draggable="true"
          :class="{ 'cursor-move': isDragging }"
        >
          <router-link
            class="inline-block w-full text-center"
            :to="'/armies/' + id"
            draggable="true"
            :class="{ 'cursor-move': isDragging }"
            >{{ name }}</router-link
          >
        </li>
      </ul>
      <div class="text-center p-2">
        <button
          v-if="!isDragging"
          class="btn-add-state rounded-xl"
          @click="toggleModal($event, 'showAddStateModal')"
        >
          <font-awesome-icon
            icon="fa-solid fa-plus"
            class="text-white text-5xl"
          ></font-awesome-icon>
        </button>
        <button
          @drop="onDrop"
          v-else
          class="btn-delete-state rounded-xl"
          :class="{ 'bg-red-200': isDraggingOverTrash }"
          @dragenter.prevent
          @dragover.prevent="isDraggingOverTrash = true"
          @dragleave="isDraggingOverTrash = false"
        >
          <font-awesome-icon
            icon="fa-solid fa-trash"
            class="text-white text-5xl"
          ></font-awesome-icon>
        </button>
      </div>
    </div>
    <add-state-modal
      @submitModal="addNewState"
      @closeModal="toggleModal($event, 'showAddStateModal')"
      :show="showAddStateModal"
    ></add-state-modal>
    <confirmation-modal
      @submitModal="replenishUnit"
      :show="showConfirmationModal"
      @closeModal="toggleModal($event, 'showConfirmationModal')"
    >
    </confirmation-modal>
    <div
      v-if="$route.fullPath === '/armies'"
      class="h-fit pb-2 px-0 ml-0 mr-0 my-2 shadow-2xl w-full border border-black grow flex flex-col space-y-3"
    >
      <div v-if="!isLoading">
        <h1
          class="w-full text-white bg-black text-center font-bold py-3 text-2xl border border-black border-xl mb-2"
        >
          Home
        </h1>
        <p class="p-4 text-center font-semibold text-lg">
          Welcome to the Clancraft Army Manager Application. In this app, You
          can manage different armies from different states as well as add new
          ones. You can begin by clicking a state in the state-list on the left
          or start by adding a new state. There will be many functionality in
          this app, but a very specific one is the replenishment button. The
          replenishment button below will automatically replenish all units in
          the app across all states depending on their size, location status,
          and unit type. Please tread this button with caution.
        </p>
        <div
          class="rounded-full border border-gray-100 w-full flex justify-center items-center"
        >
          <div
            class="p-8 h-fit border-gray-100 border-2 flex-col flex items-center justify-center space-y-2"
          >
            <h1 class="text-xl font-bold">Replenish Unit Button</h1>
            <button
              @click="showConfirmationModal = true"
              class="hover:bg-blue-200 text-5xl bg-blue-500 p-8 border-white border text-white rounded-full"
            >
              <font-awesome-icon icon="fa-solid fa-briefcase-medical ">
              </font-awesome-icon>
              <h3 class="text-lg">Click to Replenish Unit</h3>
            </button>
          </div>
        </div>
      </div>
    </div>
    <router-view v-else></router-view>
  </div>
  <transition name="fade-in">
    <user-alert
      :show="showDeleteStateAlert"
      @hide="showAlertDeleteStateAlert = false"
    >
      <template v-slot:title
        >State {{ draggedItem }} has been deleted.</template
      >
      <template v-slot:body>
        The state {{ draggedItem }} no longer exist in the database!</template
      >
    </user-alert>
  </transition>
</template>
<script>
import AddStateModal from '@/components/AddStateModal.vue';
import axios from 'axios';
import ConfirmationModal from '../components/ConfirmationModal.vue';
export default {
  inject: [
    'clancraftUnits',
    'stateList',
    'currency',
    'stateMap',
    'sortObjectKeys',
  ],
  components: {
    AddStateModal,
    ConfirmationModal,
  },
  mounted() {},
  computed: {
    CCStateList() {
      return this.$store.getters.getStateList;
    },
  },
  data() {
    return {
      showAddStateModal: false,
      showConfirmationModal: false,
      draggedItem: null,
      isDragging: false,
      isDraggingOverTrash: false,
      showDeleteStateAlert: false,
    };
  },
  methods: {
    deleteState(name) {
      this.$store.dispatch('deleteState', name);
    },

    async replenishAllUnits() {
      try {
        await axios.post(process.env.VUE_APP_REPLENISH_ALL_UNITS_URL);
      } catch (err) {
        throw new Error(err);
      }
    },
    replenishUnit() {
      this.showConfirmationModal = false;
      this.replenishAllUnits();
    },
    startDrag(evt, id) {
      this.isDragging = true;
      evt.dataTransfer.dropEffect = 'move';
      evt.dataTransfer.effectAllowed = 'move';
      this.draggedItem = id;
    },
    onDrop() {
      console.log('karama', this.draggedItem);
      this.showDeleteStateAlert = true;
      setTimeout(() => {
        (this.draggedItem = null), (this.showDeleteStateAlert = false);
      }, 1000);
      this.deleteState(this.draggedItem);
      this.isDragging = false;
    },
    toggleModal(evt, property) {
      console.log(property, 'property of his majesty');
      this[property] = !this[property];
    },

    addNewState(stateData) {
      this.showAddStateModal = false;
      const newCurrencyList = {
        ...this.$store.getters.getCurrencyList,
        [stateData.name]: stateData.currency,
      };

      const newStateList = {
        ...this.$store.getters.getStateList,
        [stateData.name]: stateData.id,
      };

      const newStateMap = {
        ...this.$store.getters.getStateMap,
        [stateData.name]: stateData.map,
      };
      this.$store.dispatch('addNewState', {
        stateMap: newStateMap,
        stateList: newStateList,
        currency: newCurrencyList,
      });
    },
  },
};
</script>
