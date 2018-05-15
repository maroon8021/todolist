var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})

var onClickEvent = function (e) {
  alert('click!!***');
}

var onChangeEvent = function (e) {
  let params = new URLSearchParams();
  params.append('newtodo', e.target.value);
  axios.post('/php/datapostaxios.php', params).then(response => {
    console.log(response.status);
    console.log(response);
  });
}

var input = Vue.extend({
  props:{
    placeholder: {
      type: String,
      default: "Add your todo to delete"
    }
  },

  template:'<input ' +
           'class="input-transparent" ' +
           'type="text" ' +
           'name="deletetodo" ' +
           ':placeholder="placeholder" '+
           'v-on:click="onClick" '+
           'v-on:change="onChange" '+
           '/>',

  methods: {
    onClick: onClickEvent,
    onChange: onChangeEvent,
  }
  /*
  methods: {
    onClick: function (e) {
      alert('click!!');
    },
  }

  */
})

Vue.component('t-input', input);


var app = new Vue({
  el: '#t-input-1',
  methods: {
    onClick: onClickEvent
  }
})

var app = new Vue({
  el: '#t-input-2',
  methods: {
    onClick2: function(e) {
      const data = { newtodo : 'test-post-axios' };
      axios.post('/php/datapostaxios.php', data).then(response => {
    console.log(response => console.log(response.status));
});
    },
  },
})
