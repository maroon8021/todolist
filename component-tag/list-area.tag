<list-area>
	<table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
        <thead>
          <tr>
            <th class="mdl-data-table__cell--non-numeric">Task</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody onchange={change}>
          <tr each={content in contents}>
            <td class="mdl-data-table__cell--non-numeric">{content.title}</td>
            <td class="mdl-data-table__cell--non-numeric">{content.content}</td>
          </tr>
        </tbody>
      </table>


<script >
if(time == "day-time"){
  this.contents = dayTimeLists;
}else{
  this.contents = nightTimeLists;
}

change(e) {
  var event = new CustomEvent(taskList.EventType.ITEMCHANGE, {'title' : null, 'isChecked' : null});
  document.body.dispatchEvent(event);
}


</script>

</list-area>