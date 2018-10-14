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
  if(targetKey !== -1){
    postedData.push(postedDataObj[targetKey]);
    targetKey = postedDataObj[targetKey]['after-todo'];
  }
}

let originalLoadedData = postedData.slice();
let previousData = originalLoadedData.slice();

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

  let actionType = this.isSuccess ? 'delete' : 'uncheck' ;
  let targetItems = changeOrder(getItemData(postedData, parseInt(inputKey, 10)), actionType);
  for (let index = 0; index < targetItems.length; index++) {
    params = new URLSearchParams();
    if(targetItems[index] === null){
      return;
    }
    params.append('new_value', targetItems[index]['value']);
    params.append('key', targetItems[index]['key']);
    params.append('before-todo', targetItems[index]['before-todo']);
    params.append('after-todo', targetItems[index]['after-todo']);
    params.append('type', 'update-todo');
    axios.post('php/scheduleController.php', params).then(response => {
      console.log(response.status);
      console.log(response);
    });
  }

  // This above should be one request
  // Have to consider rolling back ?

}
// TODO need to change place of this method below
var onChangeEvent = function (e) {
  let params = new URLSearchParams();
  let targetURL;
  let inputKey = e.target.getAttribute('data-input-key');
  let action = '';
  let inputtedValue = null;
  let targetItems = [];
  if(e.target.value === ''){
    params.append('deletetodoid', inputKey);
    action = 'delete-';
    //Something is needed to add
    let targetItems = changeOrder(getItemData(postedData, parseInt(inputKey, 10)), 'delete');
    for (let index = 0; index < targetItems.length; index++) {
      if(targetItems[index] === null){
        return;
      }
      params.append('new_value', targetItems[index]['value']);
      params.append('key', targetItems[index]['key']);
      params.append('before-todo', targetItems[index]['before-todo']);
      params.append('after-todo', targetItems[index]['after-todo']);
      params.append('type', 'update-todo');
      axios.post('php/scheduleController.php', params).then(response => {
        console.log(response.status);
        console.log(response);
      });
    }
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
    params.append('before-todo', postedData[targetIndex]['before-todo']);
    params.append('after-todo', postedData[targetIndex]['after-todo']);
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
      if($lastInput === e.target && this.isKeyPressed){
        let inputKey = parseInt(e.target.getAttribute('data-input-key'), 10);
        let previousLastData = this.postedData[this.postedData.length-1];
        let newItemKey = inputKey + 1;
        previousLastData['after-todo'] = newItemKey;
        let params = new URLSearchParams();
        let targetURL = 'php/scheduleController.php'; // Need to be CONST
        let lastInsertedId = null;

        this.$set(this.postedData, this.postedData.length, 
          {
            key: newItemKey, 
            value: '', 
            type: 'todo',
            'before-todo': previousLastData.key,
            'after-todo': -1
          }
        );
        params.append('new_value', '');
        params.append('type', 'new-todo');
        params.append('before-todo', previousLastData.key);
        params.append('after-todo', -1);
        axios.post(targetURL, params)
        .then(response => {
          console.log(response.status);
          console.log(response);
          lastInsertedId = response.data;

          params.append('key', previousLastData['key']);
          params.append('new_value', previousLastData['value']);
          params.append('type', 'update-todo');
          params.append('before-todo', previousLastData['before-todo']);
          params.append('after-todo', lastInsertedId);

          axios.post(targetURL, params)
          .then(response => {
            console.log(response.status);
            console.log(response);
          })
          .catch(error => {
            console.log(error.response);
            this.$emit('reject-save', inputtedValue);
          });
        })
        .catch(error => {
          console.log(error.response);
          this.$emit('reject-save', inputtedValue);
        });


        
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
      }, 500); //.bind(this)
      //this.$emit('focused', e);
      e.preventDefault();
    },
    onMouseUp: function(e){
      this.hoverClass = false;
      this.isHovered = false;
      var $targetElement = e.target;
      let isChanged = false;
      let vueInstance = this;
      for (let index = 0; index < e.path.length; index++) {
        if($targetElement.tagName !== 'TR'){
          $targetElement = $targetElement.parentElement;
        }else if(!isChanged){
          isChanged = true;
          let $targetInput = $targetElement.querySelector('input');
          let targetKey = parseInt($targetInput.dataset.inputKey, 10); // This key means the key which is input replaced 
          if(this.hoveringTarget === targetKey){
            return;
          }
          let hoveringItemData = getItemData(postedData, this.hoveringTarget);
        
          let previousBeforeTodoData = getItemData(postedData, hoveringItemData['before-todo']);
          let previousAfterTodoData = getItemData(postedData, hoveringItemData['after-todo']);

          let targetItemData = getItemData(postedData, targetKey);
          let targetAfterItemData = getItemData(postedData, targetItemData['after-todo']);

          if(previousBeforeTodoData){ // If first todo, previousBeforeTodoData is null
            previousBeforeTodoData['after-todo'] = hoveringItemData['after-todo'];
          }
          if(previousAfterTodoData){ // If last todo, previousAfterTodoData is null
            previousAfterTodoData['before-todo'] = hoveringItemData['before-todo'];
          } 
          
          if(targetAfterItemData){ // pattern of -1
            targetAfterItemData['before-todo'] = hoveringItemData['key'];
          }
          targetItemData['after-todo'] = hoveringItemData['key'];

          hoveringItemData['before-todo'] = targetItemData['key'];
          if(targetAfterItemData && hoveringItemData['key'] !== targetAfterItemData['key']){
            hoveringItemData['after-todo'] = targetAfterItemData['key']
          }

          let updatedItemsData = [previousBeforeTodoData, previousAfterTodoData, targetAfterItemData, targetItemData, hoveringItemData];
          let params;
          for (let index = 0; index < updatedItemsData.length; index++) {
            if(!updatedItemsData[index]){
              return;
            }
            params = new URLSearchParams();
            params.append('new_value', updatedItemsData[index]['value']);
            params.append('key', updatedItemsData[index]['key']);
            params.append('before-todo', updatedItemsData[index]['before-todo']);
            params.append('after-todo', updatedItemsData[index]['after-todo']);
            params.append('type', 'update-todo');
            axios.post('php/scheduleController.php', params).then(response => {
              console.log(response.status);
              console.log(response);
            });
          }
          
          let nextKey = 0;
          let itemData;
          let newOrderData = [];
          postedData.forEach(function(item, index, array){ 
            if(nextKey === 0){
              itemData = getItemData(array, nextKey, 'before-todo');
            }else{
              itemData = getItemData(array, nextKey);
            }

            if(itemData === null){
              throw new Error("itemData is null and cannot change data order");
            }
            nextKey = itemData['after-todo'];
            newOrderData.push(itemData);
            
          });

          newOrderData.forEach(function(item, index){
            vueInstance.$set(vueInstance.postedData, index, item);
          });
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

/**
 * 
 * @param {*} targetItemData 
 * @param {*} changeType 
 * @param {*} optionalItemData 
 */
function changeOrder(targetItemData, changeType, optionalItemData){
  let beforeKey;
  let afterKey;
  let beforeItem;
  let afterItem;
 switch (changeType) {
   case 'add':
   break;

   case 'delete':
   beforeKey = parseInt(targetItemData['before-todo'], 10);
   afterKey = parseInt(targetItemData['after-todo'], 10);
   beforeItem = getItemData(postedData, beforeKey);
   afterItem = getItemData(postedData, afterKey);

   if(beforeItem){
    beforeItem['after-todo'] = afterKey;
   }
   if(afterItem){
    afterItem['before-todo'] = beforeKey;
   }
   return [beforeItem, afterItem];
   break;

   case 'uncheck':
   beforeKey = parseInt(targetItemData['before-todo'], 10);
   afterKey = parseInt(targetItemData['after-todo'], 10);
   beforeItem = getItemData(postedData, beforeKey);
   afterItem = getItemData(postedData, afterKey);
   
   beforeItem['after-todo'] = beforeItem ? targetItemData['key'] : 0;
   afterItem['before-todo'] = afterItem ? targetItemData['key'] : -1;

   return [beforeItem, afterItem];
   break;
 
   default:
   break;
 } 
}

/**
 * 
 * @param {Array} data 
 * @param {Number} key
 * @param {?String} opt_targetKey 'before-todo' or 'after-todo'  
 */
function getItemData(data, key, opt_targetKey){
  let targetData = null;
  data.forEach(item => {
    if(opt_targetKey === 'before-todo' && item['before-todo'] === key){
      targetData = item;
    }else if(opt_targetKey === 'after-todo' && item['before-todo'] === key){
      targetData = item;
    }else if(item.key === key && !opt_targetKey){
      targetData = item;
    }
  });
  return targetData;
}

