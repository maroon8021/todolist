
/*
var tagList = JSON.parse('<?php echo $tagList; ?>');
console.log(tagList);
*/

var checkbox = Vue.extend({
  data: function(){
    return {
      checked: false
    }
  },
  props:{
    tagId: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: null
    }
  },
  template:'<label class="checkbox"> ' +
           '<input type="checkbox" ' +
           ':data-tag-id="tagId" ' +
           ':value="value" ' +
           'v-model="checked"> ' +
           '{{label}} ' +
           '</label>',
  
  methods: {
    getChecked: function(){
      return this.checked;
    },
    getTagId: function(){
      return this.tagId;
    },
  }
})

Vue.component('tag-checkbox', checkbox);


var tagManager = Vue.extend({
  props:['tagList'],
  template:'<div class="field has-addons"> ' +
           '<div class="control"> ' +
           '<tag-checkbox ' + 
           'v-for="(tagData, index) in tagList" :key="tagData.tagId" ' + 
           ':tag-id="tagData.tagId" ' + 
           ':label="tagData.tagName" > ' +
           '</tag-checkbox> ' +
           '</div> ' +
           '</div>',
  methods:{
    getCheckedList(){
      var checkedList = [];
      for (let index = 0; index < this.$children.length; index++) {
        var isChecked = this.$children[index].getChecked();
        if(isChecked){
          checkedList.push(this.$children[index].getTagId())
        }
      }
      return checkedList;
    }
  }
});

Vue.component('tag-manager', tagManager);

/*
new Vue({
  el: '#tag-manager',
  data: {
    tagList: tagList
  },
  methods: {
    getCheckedList(){
      return console.log("Get!");
    }
  },
  components: {
    'tag-checkbox' : checkbox
  }
})
*/

new Vue({
  el: '#article-manager',
  data: {
    tagList: tagList
  },
  methods: {
    onClickSubmit(){
      var checkedTagList = this.$refs.childCheckbox.getCheckedList();
      var $textarea = this.$el.getElementsByClassName('article-textarea')[0];
      var articleValue = $textarea.value;

      let params = new URLSearchParams();
      params.append('tagList', checkedTagList);
      params.append('article', articleValue);
      params.append('type', 'new-article');
      axios.post('/php/articleController.php', params).then(response => {
        console.log(response.status);
        console.log(response);
      });
    },
    onClickNewTag(){
      var $input = this.$el.getElementsByClassName('new-tag-input')[0];
      var inputValue = $input.value;

      let params = new URLSearchParams();
      params.append('tagList', checkedTagList);
      params.append('article', articleValue);
      params.append('type', 'new-article');
    }

  },
  components: {
    'tag-manager' : tagManager
  },
})




var onClickEvent = function (e) {
  alert('click!!***');
}

var onClickButton = function (e) {
  let inputKey = this.$el.getAttribute('data-input-key');
  let params = new URLSearchParams();
  this.isSuccess = !this.isSuccess;
  params.append('isfiniched', this.isSuccess ? true : false);
  params.append('updateid', inputKey);
  axios.post('/php/dbupdate.php', params).then(response => {
    console.log(response.status);
    console.log(response);
  });

}

var onChangeEvent = function (e) {
  let params = new URLSearchParams();
  let targetURL;
  let inputKey = e.target.getAttribute('data-input-key');
  if(e.target.value === ''){
    params.append('deletetodoid', inputKey);
    targetURL = '/php/dbtest.php';
  }else{
    for (let index = 0; index < postedData.length; index++) {
      if(inputKey === postedData[index].key && e.target.value === postedData[index].value){
        return;
      } 
    }
    params.append('newtodo', e.target.value);
    targetURL = '/php/datapostaxios.php';
  }
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
           'class="input-transparent input-area" ' +
           'type="text" ' +
           'name="deletetodo" ' +
           ':data-input-key="targetId" ' +
           ':data-time-range="data" ' +
           ':placeholder="placeholder" '+
           ':value="value" '+
           //'v-on:click="onClick" '+
           'v-on:change="onChange" '+
           '/>',

  methods: {
    //onClick: onClickEvent,
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
  props:{
    targetId: {
      type: String,
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

/*
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
*/

/*
var app = new Vue({
  el: '#checkbutton1'
})
*/

/*
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
      if( $lastInput === e.target){
        let inputKey = parseInt(e.target.getAttribute('data-input-key'), 10);
        this.$set(this.postedData, this.postedData.length, {key: String(inputKey + 1), value: ''});
      }
      console.log("this is Enter on app");
    },
    onDelete: function(e){
      if(e.target.value === ''){
        let inputKey = e.target.getAttribute('data-input-key');
        for (let index = 0; index < this.postedData.length; index++) {
          const data = this.postedData[index];
          if(data.key === inputKey){
            this.$delete(this.postedData, String(index));
            onChangeEvent(e);
          } 
        }
      }
    }
  },
  mounted: function(){
    //this.$set(this.postedData, this.postedData.length, {key: 'testKey', value: 'testValue'});
  },
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