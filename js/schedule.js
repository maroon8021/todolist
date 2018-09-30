// TODO Each components have to be excluded to other files

// Initialize order of todo
let postedData = [];
let targetKey = 0;
let postedDataObj = {};
rowPostedData.forEach(data => {
  postedDataObj[data['key']] = data;
  targetKey = data['before-todo'] === 0 ? data.key : targetKey;
});
for (let index = 0; index < Object.keys(postedDataObj).length; index++) {
  postedData.push(postedDataObj[targetKey]);
  targetKey = postedDataObj[targetKey]['after-todo'];
}


// TODO need to change place of this method below
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
// TODO need to change place of this method below
var onChangeEvent = function (e) {
  let params = new URLSearchParams();
  let targetURL;
  let inputKey = e.target.getAttribute('data-input-key');
  let action = '';
  let inputtedValue = null;
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
    inputtedValue = e.target.value;
    params.append('new_value', inputtedValue);
    params.append('key', inputKey);
    action = targetIndex === null ? 'new-' : 'update-';
  }
  targetURL = 'php/scheduleController.php';
  params.append('type', action + e.target.getAttribute('data-type'));
  axios.post(targetURL, params)
  .then(response => {
    console.log(response.status);
    console.log(response);
  })
  .catch(error => {
    console.log(error.response);
    // window.alert('There are unacceptable strings\n please fix and input it again\n' +
    // inputtedValue);
    this.$emit('reject-save', inputtedValue);
  });
}

/**
 * Input component for any situation
 * Any features are added on this
 */
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
           'v-on:input="onInput" '+
           '@keyup.right="onMoveFocus" '+
           '/>',

  methods: {
    onChange: onChangeEvent,
    onFocus: function(e){
      console.log("focused");
      e.data = this.targetId
      this.$emit('focused', e);
    },
    onInput: function(e){
      console.log("inputting");
      this.$emit('input', e);
    },
    onMoveFocus: function(e){
      console.log("called");
      // TODO: need to support 'meta' key
      if(e.altKey === false || e.ctrlKey === false){
        return false;
      }
      e.data = this.$el;
      this.$emit('move-focus', e);
    }

  }
})

Vue.component('t-input', input);

/**
 * Check button to decide a task is done or not
 */
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

/**
 * time-range component this will show inputs separated by time
 */
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


var timeRangeList = Vue.extend({
  template: '<tbody id="time-range-list">' +
            '<tr v-for="(pertime, index) in timeRangeArray">' +
            '<th>' +
            '<time-range :timestr="pertime.timeRange"/>' +
            '</th>' +
            '<td class="input-area">' +
            '<t-input @focused="onFocusInnerInput" @input="onInput" @move-focus="onMoveFocus" :target-id="pertime.key" :value="pertime.value" :type="pertime.type" :placeholder="timeRangePlaceholder"/>' +
            '</td>' +
            '</tr>' +
            '</tbody>',
  props:{
    timeRangeArray: {
      type: [Array],
      default: null
    },
    timeRangePlaceholder: {
      type: [String],
      default: 'Add your schedule'
    }
  },
  
  components: {
    'time-range' : timeRange,
    't-input' : input
  },
  methods: {
    onFocusInnerInput: function(e){
      this.$emit('focused', e);
    },
    onInput: function(e){
      this.$emit('input', e);
    },
    onMoveFocus: function(e){
      this.$emit('move-focus', e);
    }
  }
})

Vue.component('time-range-list', timeRangeList);


/**
 * time-range component this will show inputs separated by time
 */
var modal = Vue.extend({
  props:['isActive', 'text'],

  template:'<div class="modal" :class="isActiveClass" @click="onClose">' +
             '<div class="modal-background"></div>' +
             '<div class="modal-content">' +
               '<article class="message is-danger">' +
               '<div class="message-header">'+
               '<p>Danger : Fix and write it again</p>'+
               '<button class="delete" aria-label="delete"></button>'+
               '</div>'+
               '<div class="message-body">' +
               '{{errorText}}' +
               '</div>'+
               '</article>'+
             '</div>' +
             '<button class="modal-close is-large" aria-label="close" ' +
              '@click="onClose">' +
             '</button>' +
           '</div>',
  
   computed: {
     isActiveClass: function(){
       return {
         'is-active': this.isActive === true
        }
      },
      errorText: function(){
        return this.text;
      }
    },
    methods: {
      onClose: function(e){
        if(!e.target.classList.contains("message-body")){
          this.$emit('close');
        }
      }
    }
  
})

Vue.component('modal', modal);


/**
 * content area for showing detail
 */
var contentArea = Vue.extend({
  template: '<main class="column content-area" ' +
            ':class="isDisplayed" ' +
            '@keyup.left="onMoveFocus" ' +
            ' >' +
            '<nav class="panel">' +
            '<p class="panel-heading">' +
            '{{ title }} ' +
            '</p>' +
            '<div class="panel-block">' +
            '<p class="control">' +
            '<textarea class="textarea is-info content-area-textarea" ' + 
              'type="text" placeholder="Input any contents" :value="content" v-on:change="onChange"></textarea> ' +
            '</p>' +
            '</div>' +
            '</nav>' +
            '</main>',
  props:{
    isInputtedFocused: {
      type: [Boolean],
      default: false
    },
    title: {
      type: [String],
      default: null
    },
    content: {
      type: [String],
      default: null
    },
    targetId: {
      type: [String, Number],
      default: null
    },
    isContentAreaFocused: {
      type: [Boolean],
      default: false
    }
  },

  computed: {
    isDisplayed: function(){
      return {
        'display-none': this.isInputtedFocused === false
      }
    }
  },

  watch: {
    isContentAreaFocused: function(val){
      if(val){
        let $textarea = this.$el.getElementsByTagName('textarea')[0];
        $textarea.focus();
      }
    }
  },

  methods: {
    onChange: function(e){
      let params = new URLSearchParams();
      let inputtedValue = e.target.value;
      params.append('type', 'update-comment');
      params.append('targetId', this.targetId);
      params.append('comment', e.target.value);
      targetURL = 'php/scheduleController.php';
      axios.post(targetURL, params)
      .then(response => {
        console.log(response.status);
        console.log(response);
      })
      .catch(error => {
        console.log(error.response);
        // window.alert('There are unacceptable strings\n please fix and input it again\n' +
        // inputtedValue);
        this.$emit('reject-save', inputtedValue);
      });
    },
    onMoveFocus: function(e){
      console.log("called");
      // TODO: need to support 'meta' key
      if(e.altKey === false || e.ctrlKey === false){
        return false;
      }
      e.isCalledFromContentArea = true;
      this.$emit('move-focus', e);
    }
  }
})

Vue.component('content-area', contentArea);

/**
 * task list
 */
var taskList = Vue.extend({
  template: `<tbody id="test-list"` +  
            `v-focus v-on:keyup.enter="onEnterLastInput"` + 
            `@keydown.delete="onDelete" @keydown.enter="onKeyDownEnter"` + 
            `@keypress.enter="onKeyPressEnter"` +
            `:class="hover"` + 
            `>` +
            `<tr v-for="data in postedData">` +
            `<td class="dragger-position" @mousedown="onMouseDown" ` +
            `@mouseup="onMouseUp">` +
            `<i class="fas fa-sort"></i></td>` +
            `<td>` +
            `<check-button :target-id="data.key" />` +
            `</td>` +
            `<td class="input-area">` +
            `<t-input :target-id="data.key" :value="data.value"` + 
            `:type="data.type" @focused='onFocus'/>` +
            `</td>` +
            `</tr>` +
            `</tbody>`,
  props: {
    postedData: {
      type: [Array],
      default: null
    }
  },
  data: function(){
    return {
      isHovered : false,
      hoverClass : false,
      hoveringTarget : null
    }
  },
  computed: {
    hover: function(){
      return {
        'hovered': this.hoverClass === true
      }
    }
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
    onFocus: function(e){
      if(this.isHovered){
        return;
      }
      this.$emit('focused', e);
    },
    onMouseDown: function(e){
      console.log('hoge');
      this.isHovered = true;
      let $hoveringElement = e.target;
      setTimeout(() => {
        if(this.isHovered){
          this.hoverClass = true;
          for (let index = 0; index < 4; index++) { //TODO fix 4
            if($hoveringElement.tagName !== 'TR'){
              $hoveringElement = $hoveringElement.parentElement;
            }else{
              let $hoveringInput = $hoveringElement.querySelector('input');
              this.hoveringTarget = parseInt($hoveringInput.dataset.inputKey, 10);
            }
            
          }
        }
      }, 1000); //.bind(this)
      //this.$emit('focused', e);
      e.preventDefault();
    },
    onMouseUp: function(e){
      this.hoverClass = false;
      this.isHovered = false;
      var $targetElement = e.target;
      for (let index = 0; index < 3; index++) { //TODO fix 3
        if($targetElement.tagName !== 'TR'){
          $targetElement = $targetElement.parentElement;
        }else{
          let $targetInput = $targetElement.querySelector('input');
          let targetKey = parseInt($targetInput.dataset.inputKey, 10);
          if(this.hoveringTarget === targetKey){
            return;
          }
          let previousAfterTodoKey;
          for (let index = 0; index < this.postedData.length; index++) {
            if(this.postedData[index].key === targetKey){
              previousAfterTodoKey = this.postedData[index]['after-todo'];
              this.postedData[index]['after-todo'] = this.hoveringTarget;
              this.postedData[this.hoveringTarget]['before-todo'] = targetKey;
              this.postedData[this.hoveringTarget]['after-todo'] = previousAfterTodoKey;
              this.postedData[previousAfterTodoKey]['before-todo'] = this.hoveringTarget;
            }
          }

          let newKey = this.postedData[0].key === this.hoveringTarget ? this.postedData[0]['after-todo'] : this.postedData[0].key;

          for (let index = 0; index < this.postedData.length; index++) {
            if(index === 0){
              this.postedData[newKey]['before-todo'] = 0;
            }else if(index === this.postedData.length - 1){
              this.postedData[newKey]['after-todo'] = -1;
            }

            this.$set(this.postedData, index, this.postedData[newKey]);
            newKey = this.postedData[newKey]['after-todo'];
          }

        }
        
      }
      this.hoveringTarget = null;
    },

  },
  /*
  mounted: function(){
    console.log('mounted');
    this.$el.addEventListener('touchstart', this.onMouseDown, false);
    this.$el.addEventListener('mousedown', this.onMouseDown);
  },
  */
  directives: {
    focus : {
      componentUpdated : function(el, binding, vnode){
        if(vnode.context.isHovered){
          return;
        }
        let $inputs = el.getElementsByClassName('input-area');
        $inputs[$inputs.length - 1].focus();
      }
    }
  },
})

Vue.component('task-list', taskList);


/**
 * Main component on schedule
 */
var app = new Vue({
  el: '#main-container',
  data: {
    timeRangeArray: timeRangeArray,
    timeRangePlaceholder: 'Add your schedule',
    isInputtedFocused: false,
    title: 'dummy',
    postedData: postedData,
    content: '',
    targetId: '',
    isModalActive: false,
    errorMessage: '',
    targetScheduleInput: '',
    isContentAreaFocused: false
  },
  components: {
    'time-range-list' : timeRangeList,
    'content-area' : contentArea,
    'task-list' : taskList,
    'modal' : modal
  },
  methods: {
    onFocus: function(e){
      this.$el.classList.add('width-auto');
      this.isInputtedFocused = true;
      this.title = e.target.value;
      this.targetId = e.data;

      // contentの呼び出し
      let params = new URLSearchParams();
      params.append('targetId', e.data);
      params.append('type', 'content');
      axios.get('php/scheduleController.php', {params}).then(response => {
        console.log(response.status);
        console.log(response);
        this.content = response.data;
      });
    },
    onInput: function(e){
      this.title = e.target.value;
    },
    escapeKeyListener: function(e){
      if (e.keyCode === 27 && this.isInputtedFocused) {
        this.isInputtedFocused = false;
      }
    },
    showErrorMessage: function(e){
      this.isModalActive = true;
      this.errorMessage = e;
    },
    onClose: function(e){
      this.isModalActive = false;
    },
    onMoveFocus: function(e){
      console.log('called');
      if(e.isCalledFromContentArea === undefined){
        this.targetScheduleInput = e.data;
        this.isContentAreaFocused = true;
      }else{
        this.targetScheduleInput.focus();
        this.isContentAreaFocused = false;
      }
      
    }
  },
  created: function() {
    document.addEventListener('keyup', this.escapeKeyListener);
    
    // This is just added to show loading-spinner
    // If I get board to see it, this will be removed
    setTimeout(function(){
      document.body.removeChild(document.getElementById("initial-layer"));
      document.getElementById("main-container").classList.remove('display-none');
    }, 2000);
  },
  destroyed: function() {
    document.removeEventListener('keyup', this.escapeKeyListener);
  },
})

afterRendered();

// Some functions below

/**
 * after all of vue methods called
 */
function afterRendered(){
  var $table = document.getElementById("task-list-table");
  var $customList = document.getElementById("test-list");
  $table.appendChild($customList);
  
  var $table = document.getElementById("time-range-list-table");
  var $customList = document.getElementById("time-range-list");
  $table.appendChild($customList);
}

