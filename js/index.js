var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
})

var onClickEvent = function (e) {
  alert('click!!***');
}

var onClickButton = function (e) {
  alert('Button is clicked');
  this.isSuccess = true;
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
    },
    data: {
      type: [Object, String],
      default: null
    },
    targetId: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    }
  },
  /*
  computed: {
    value: function(){
      return this.data ? this.data : ''
    },
    targetId: function(){
      return this.targetId ? this.targetId : ''
    }
  },*/

  template:'<input ' +
           'class="input-transparent" ' +
           'type="text" ' +
           'name="deletetodo" ' +
           ':data-input-key="targetId" ' +
           ':data-time-range="data" ' +
           ':placeholder="placeholder" '+
           ':value="value" '+
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


var checkButton = Vue.extend({
  data: function(){
    return {
      isSuccess: false
    }
  },
  computed: {
    classObject: function(){
      return {
        'is-success': this.isSuccess === true
      }
    }
  },
  name: 'check-button',

  template:'<a class="button is-rounded" ' +
           'v-bind:class="classObject" ' + //v-bind can be removed
           'v-on:click="onClick"> ' +
           '<span class="icon is-small"> ' +
           '<i class="fas fa-check"></i> ' +
           '</span> ' +
           '</a>',

  methods: {
    onClick: onClickButton
  }
})

Vue.component('check-button', checkButton);

var timeRange = Vue.extend({
  props:['timestr'],
  data:function(){
    return {
      partimeStr : this.timestr
    }
  },
  /*
  computed: {
    pertimeStr: function(){
      return this.timestr;
    }
  },
  */
/*
  mounted: function(){
    this.$set(this.timestr, this.timestr);
  },

  {{ partimeStr }}
  */


  template:'<span class="tag is-light is-medium time-range-left-item" :data-hoge="partimeStr" > ' +
           '{{ partimeStr }} '+
           '</span> '
})

Vue.component('time-range', timeRange);



var customList = Vue.extend({
  props:{
    lists: {
      type: Array,
      default: null
    },
    listType: {
      type: String,
      default: null
    }
  },

  template:'<tbody> ' +
           '<tr v-for="(list, index) in lists"> ' +
           '<th> ' +
           '<slot slot-scope="checkbutton" list-index="index"></slot> ' + //@bind:list="list"
           '</th> ' +
           '<td> ' +
           '<t-input id="t-input-1" :data="list"/>' +
           '</td> ' +
           '</tr>' +
           '</tbody> ',
 })

Vue.component('custom-list', customList);


/*
var app = new Vue({
  el: '#t-input-1',
  methods: {
    onClick: onClickEvent
  }
})
*/

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

/*
var app = new Vue({
  el: '#checkbutton1'
})
*/


var $table = document.getElementById("task-list-table");
var $customList = document.getElementById("test-list");
$table.appendChild($customList);

var $table = document.getElementById("time-range-list-table");
var $customList = document.getElementById("time-range-list");
//$table.appendChild($customList);
var app = new Vue({
  el: '#test-list',
  data: {
    postedData: postedData
  },
  components: {
    'check-button' : checkButton,
    't-input' : input
  },
  methods: {
    console: function(e){
      console.log("this is clicked on app")
    }
  }
})


var app = new Vue({
  el: '#time-range-list',
  data: {
    timeRangeArray: timeRangeArray
  },
  components: {
    'time-range' : timeRange,
    't-input' : input
  }
})


/*
var app = new Vue({
  el: '#time-range-list'
})

var app = new Vue({
  el: '#time-range-item'
})
*/

/*
var timeRangeLeftItems = document.getElementsByClassName('time-range-left-item');
for (var i = 0; i < timeRangeLeftItems.length; i++) {
  timeRangeLeftItems[i].textContent = timeRangeArray[i];
}
*/