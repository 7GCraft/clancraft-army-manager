<template>
  <div
    class="h-fit pb-2 px-0 ml-0 mr-0 my-2 shadow-2xl inline-block border border-black grow"
  >
    <h1
      class="text-white bg-black text-center font-bold py-3 text-2xl border border-black border-xl mb-2"
    >
      {{ armyName }}
    </h1>
    <div class="px-2">
      <army-table
        :armyName="armyName"
        :baseUnit="stateCurrency"
        @deleteRow="removeUnit"
        @updateTable="updateArmy"
        @updateRow="updateUnit"
        @importExcel="loadImportedUnits"
        :armyList="armyList"
      ></army-table>
      <div class="mb-4">
        <button
          @click="toggleForm('showAddUnit')"
          class="active:bg-green-400 active:font-bold mx-2 hover:font-semibold hover:bg-green-500 h-12 border px-2 text-white border-black bg-green-600 mt-2"
        >
          {{ formVisibility.showAddUnit ? 'Close' : 'Open' }} Factional Unit
          Adder
        </button>
        <button
          @click="toggleForm('showUnitGenerator')"
          class="active:bg-sky-400 active:font-bold hover:font-semibold hover:bg-sky-500 h-12 border px-2 text-white border-black bg-sky-600 mt-2"
        >
          {{ formVisibility.showUnitGenerator ? 'Close' : 'Open' }} Unit
          Generator
        </button>
        <button
          @click="toggleForm('showSpecialAddUnit')"
          class="active:bg-yellow-400 active:font-bold mx-2 hover:font-semibold hover:bg-yellow-500 h-12 border px-2 text-white border-black bg-yellow-600 mt-2"
        >
          {{ formVisibility.showSpecialAddUnit ? 'Close' : 'Open' }} Special
          Unit Adder
        </button>
      </div>
      <div class="mb-8 mx-2">
        <add-unit-form
          :baseUnit="stateCurrency"
          v-if="formVisibility.showAddUnit"
          @submit="addNewUnits"
          :units="sortedAvailableUnits"
        ></add-unit-form>

        <unit-generator-form
          :baseUnit="stateCurrency"
          v-if="formVisibility.showUnitGenerator"
          @add-units="addNewUnits"
          :units="sortedAvailableUnits"
        />
        <special-unit-form
          :baseUnit="stateCurrency"
          @submit="addNewUnits"
          v-if="formVisibility.showSpecialAddUnit"
        />
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import ArmyTable from '@/components/ArmyTable.vue';
import AddUnitForm from '@/components/AddUnitForm.vue';
import UnitGeneratorForm from '@/components/UnitGeneratorForm.vue';
import SpecialUnitForm from '@/components/SpecialUnitForm.vue';
export default {
  inject: ['clancraftUnits', 'calculateUnitSize', 'findUpkeep', 'unitUpkeep'],
  components: { ArmyTable, AddUnitForm, UnitGeneratorForm, SpecialUnitForm },
  created() {
    if (!Object.values(this.stateList).includes(this.$route.params.armyId)) {
      this.$router.push('/');
    }

    this.fetchArmyList();
    console.log(this.armyList, 'yotsuba');
  },

  data() {
    return {
      armyList: [],
      formVisibility: {
        showAddUnit: true,
        showUnitGenerator: false,
        showSpecialAddUnit: false,
      },
    };
  },
  watch: {
    armyName() {
      this.fetchArmyList();
      this.formVisiblity = {
        showAddUnit: true,
        showUnitGenerator: false,
        showSpecialAddUnit: false,
      };
    },
  },
  methods: {
    toggleForm(target) {
      for (let key in this.formVisibility) {
        if (key == target) {
          this.formVisibility[key] = !this.formVisibility[key];
          console.log(this.formVisibility.showSpecialAddUnit, 'cournelis');
        } else {
          this.formVisibility[key] = false;
        }
      }
    },
    loadImportedUnits(importedUnits){
      console.log(importedUnits,'import barang')
      let newUnits = []
      console.log(this.sortedAvailableUnits,'army list lebron')
      for(let unit of importedUnits){
        console.log(unit,'unit')
   
        let targetUnit = this.sortedAvailableUnits.find(availableUnit=>{
          unit['Unit Name'] = unit['Unit Name'].replace('*','')
          return unit['Unit Name'].includes(availableUnit['CC Units']) || availableUnit['CC Units'].includes(unit['Unit Name'])
        })
        console.log(this.sortedAvailableUnits,'mas bro ada ga ya')
        let newUnit = {};
        if(!targetUnit){
          newUnit = {
            Tier: `Tier ${unit['Tier Level']} ${unit['Type']}`,
            Name:unit['Unit Name'],
            Structure: unit['Structure'], 
            Size:unit['Size'],
            SubStructure: unit['Sub Structure'],

          }
        }else{
            newUnit = {...targetUnit,
              Name:unit['Unit Name'],
           Structure: unit['Structure'], 
           Size:unit['Size'],
           SubStructure: unit['Sub Structure']}
        }
 
        newUnits.push(newUnit)
      }
      this.addNewUnits(newUnits)
    },
    addBasicDetails(newUnits) {
      const newArmy = [];
      let newNumber = this.armyList.length + 1;
      for (let newUnit of newUnits) {
       
        newUnit = {
          ...newUnit,
          Number: newNumber,
          upkeepModifier: 0,
          localStatus: 'F',
          BaseUpkeep:
            this.findUpkeep(newUnit.Tier, this.unitUpkeep) ||
            newUnit.baseUpkeep,
        };
        if(!newUnit.Size){
          newUnit.Size = this.calculateUnitSize(newUnit.Tier)
        }
        newNumber++;
        newArmy.push(newUnit);
      }
      return newArmy;
    },
    addNewUnits(newUnits) {
      console.log(newUnits, 'laser');
      const newArmy = this.addBasicDetails(newUnits);
      const newArmyList = [...this.armyList, ...newArmy];
      this.updateArmy(newArmyList);
    },
    updateArmy(newArmyList) {
      localStorage.setItem(
        `armies/${this.armyName}`,
        JSON.stringify(newArmyList)
      );
      this.armyList = [...newArmyList];
      this.setArmyList(newArmyList);
      this.showUnitGenerator = false;
    },
    async setArmyList(armyList) {
      const method = 'post';
      const targetLink = '/api/save-army-data';
      const reqBody = {
        armyData: armyList,
        armyName: this.armyName,
      };

      let response;
      try {
        response = await axios[method](targetLink, reqBody);
      } catch (err) {
        console.log(err);
        throw Error('Failed to save army data!');
      }

      if ((response.status <= 200) & (response.status >= 300)) {
        throw Error('Failed to save army data!');
      }
    },
    async fetchArmyList() {
      const targetLink = `/api/get-army-data?armyName=${this.armyName}`;

      let response;
      try {
        response = await axios.get(targetLink);
      } catch (err) {
        if (response.status != 404) {
          throw Error('Network error!!');
        }
      }
      console.log(response.data, 'responsive');
      let responseData;
      if (200 < response.status && response.status < 300) {
        responseData = [];
      } else {
        responseData = response.data;
      }

      console.log(responseData, 'responsiveData');
      localStorage.setItem(
        `armies/${this.armyName}`,
        JSON.stringify(responseData)
      );
      this.armyList = responseData ? responseData : [];
    },
    removeUnit(unitIdx) {
      const targetedUnitIdx = this.armyList.findIndex(
        unit => unit.Number == unitIdx
      );
      const newArmyList = [...this.armyList];
      newArmyList.splice(targetedUnitIdx, 1);
      let counter = 1;
      for (let unit of newArmyList) {
        unit.Number = counter;
        counter++;
      }
      this.armyList = [...newArmyList];

      this.setArmyList(newArmyList);
    },
    updateUnit(newUnit) {
      console.log('428', newUnit.Number);
      const newArmyList = [...this.armyList];
      const targetUnitIdx = newArmyList.findIndex(
        unit => unit.Number == newUnit.Number
      );
      newArmyList.splice(targetUnitIdx, 1, newUnit);
      localStorage.setItem(
        `armies/${this.armyName}`,
        JSON.stringify(newArmyList)
      );
      this.setArmyList(newArmyList);
      this.armyList = [...newArmyList];
    },
  },
  computed: {
    armyName() {
      for (const state in this.stateList) {
        if (this.stateList[state] === this.$route.params.armyId) {
          return state;
        }
      }
      return null;
    },
    armyFaction() {
      return this.stateMap[this.armyName];
    },
    sortedAvailableUnits() {
      const availableUnits = this.clancraftUnits.filter(
        unit =>
          unit['CC Faction'] == this.armyFaction || unit['CC Faction'] === ''
      );
      return availableUnits.sort((a, b) =>
        a['CC Units'].localeCompare(b['CC Units'])
      );
    },
    stateCurrency() {
      return this.$store.getters.getCurrencyList[this.armyName];
    },
    stateList() {
      return this.$store.getters.getStateList;
    },
    stateMap() {
      return this.$store.getters.getStateMap;
    },
  },
};
</script>
