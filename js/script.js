new Vue({
  el: "#app",
  data: {
    headers: [
      "Пользователь",
      "Шасси",
      "Операционная система",
      "Архитек.",
      "Инв.номер",
      "Профиль",
    ],
    filtersEnable: [],
    filtersInput: [],
    itemsAll: [],
    items: [],
  },
  created() {
    for (let i=0;i<this.headers.length;i++) {
      this.filtersEnable.push(false)
    }
    axios.get('http://inventory:9000/api/all')
    .then((response) => {
      this.itemsAll = this.unique(response.data.filter((item) => {
        return item.computer.chassis
      }))
    this.items = this.itemsAll
    })
  },
  methods: {
    unique(arr) {
      let result = [];
      result.push(this.pushedItem(arr[0]));
      for (let i=1;i<arr.length;i++) {
        if (arr[i].computer.name !== arr[i-1].computer.name) {
          result.push(this.pushedItem(arr[i]));
        }
      }
      return result;
    },
    pushedItem(item) {
      let result = [
      item.computer.name,
      item.computer.chassis.split(" ")[0],
      item.computer.os.name + ' [' + item.computer.os.version + ']',
      item.computer.os.architecture,
      item.computer.inventory_number,
      item.profile.slice(19),
      ]
      return result;
    },
    filterOn(index) {
      for (let i=0;i<this.filtersEnable.length;i++) {
        Vue.set(this.filtersEnable, i, i===index)
      }
      this.$nextTick(() => {
          this.$refs['header_'+index][0].focus();
      });
    },
    filterOff(index) {
      this.items = this.itemsAll;
      this.filtersInput = [];
      Vue.set(this.filtersEnable, index, false);
    },
    filtered(index) {
      if (this.filtersInput.length < index) {return}
      this.items = this.itemsAll.filter((item) => {
        return item[index].toLowerCase().includes(this.filtersInput[index].toLowerCase());
      })
    }
  },
});