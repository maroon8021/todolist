var onClickButton = function (e) {
  let inputKey = this.$el.getAttribute('data-input-key');
  let params = new URLSearchParams();
  this.isSuccess = !this.isSuccess;
  params.append('isfiniched', this.isSuccess ? 1 : 0);
  params.append('updateid', inputKey);
  params.append('type', 'task-complete-button');
  axios.post('php/scheduleController.php', params).then(response => {
    console.log(response.status);
    console.log(response);
  });

}

var onChangeEvent = function (e) {
  let params = new URLSearchParams();
  let targetURL;
  let inputKey = e.target.getAttribute('data-input-key');
  let action = '';
  if(e.target.value === ''){
    params.append('deletetodoid', inputKey);
    action = 'delete-';
  }else{
    var targetIndex = null;
    for (let index = 0; index < postedData.length; index++) {
      targetIndex = parseInt(inputKey, 10) === postedData[index].key ? index : targetIndex;
      if(inputKey === postedData[index].key && e.target.value === postedData[index].value){
        return;
      } 
    }
    params.append('new_value', e.target.value);
    params.append('key', inputKey);
    action = targetIndex === null ? 'new-' : 'update-';
  }
  targetURL = 'php/scheduleController.php';
  params.append('type', action + e.target.getAttribute('data-type'));
  axios.post(targetURL, params).then(response => {
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
      type: [Number, String],
      default: null
    },
    value: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },

  template:'<input ' +
           'class="input-transparent input-area" ' +
           'type="text" ' +
           'name="deletetodo" ' +
           ':data-input-key="targetId" ' +
           ':data-time-range="data" ' +
           ':data-type="type" ' +
           ':placeholder="placeholder" '+
           ':value="value" '+
           'v-on:focus="onFocus" '+
           'v-on:change="onChange" '+
           '/>',

  methods: {
    onChange: onChangeEvent,
    onFocus: function(e){
      console.log("focused");
      this.$emit('hogehoge');
    }
  }
})

Vue.component('t-input', input);


var checkButton = Vue.extend({
  data: function(){
    return {
      isSuccess: false
    }
  },
  props:{
    targetId: {
      type: [Number, String],
      default: null
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
           ':data-input-key="targetId" ' +
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

  template:'<span class="tag is-light is-medium time-range-left-item" > ' +
           '{{ partimeStr }} '+
           '</span> '
})

Vue.component('time-range', timeRange);



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
      console.log("this is clicked on app");
    },
    onEnterLastInput: function(e){
      let $inputs = this.$el.getElementsByClassName('input-area');
      let $lastInput = $inputs[$inputs.length - 1];
      if( $lastInput === e.target && this.isKeyPressed){
        let inputKey = parseInt(e.target.getAttribute('data-input-key'), 10);
        this.$set(this.postedData, this.postedData.length, {key: String(inputKey + 1), value: '', type: 'todo'});
      }
    },
    onKeyDownEnter: function(e){
      this.isKeyPressed = false;
    },
    onKeyPressEnter: function(e){
      this.isKeyPressed = true;
    },
    onDelete: function(e){
      if(e.target.value === ''){
        let inputKey = e.target.getAttribute('data-input-key');
        for (let index = 0; index < this.postedData.length; index++) {
          const data = this.postedData[index];
          if(data.key === parseInt(inputKey,10)){
            this.$delete(this.postedData, String(index));
            onChangeEvent(e);
          } 
        }
      }
    },
  },
  mounted: function(){
    //this.$set(this.postedData, this.postedData.length, {key: 'testKey', value: 'testValue'});
  },
  directives: {
    focus : {
      componentUpdated : function(el){
        let $inputs = el.getElementsByClassName('input-area');
        $inputs[$inputs.length - 1].focus();
      }
    }
  },
})


var app = new Vue({
  el: '#time-range-list',
  data: {
    timeRangeArray: timeRangeArray,
    timeRangePlaceholder: 'Add your schedule'
  },
  components: {
    'time-range' : timeRange,
    't-input' : input
  },
  methods: {
    onFocusInnerInput: function(e){
      console.log("focused?");
    },
  }
})
