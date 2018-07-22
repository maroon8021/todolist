<?php

session_start();

?>
<!DOCTYPE html>
<html>


<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="apple-mobile-web-app-capable" content="yes" />


  <title>Todo List</title>
</head>




<?php

require_once('php/scheduleController.php');

$scheduleController = new ScheduleController();
$scheduleList = json_encode($scheduleController->getTodoData());
$todoList = json_encode($scheduleController->getScheduleData());

$_SESSION['dataStore'] = $todoList; //Storeする機構がほしい気がする

?>


<script type="text/javascript">

  var postedData = JSON.parse('<?php echo $scheduleList; ?>');
  var timeRangeArray = JSON.parse('<?php echo $todoList; ?>');

</script>




<body class="layout-documentation page-layout has-navbar-fixed-top">
  <nav class="navbar is-fixed-top has-shadow" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="#">
      <img src="./img/todolist-icon.png" alt="TodoList" width="80" height="150">
    </a>

    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>
</nav>

<div id="main-container" class="columns main-area">
<main class="bd-main column list-area">
  <section class="section">
    <div class="container">
      <h1 class="title">Task list</h1>
      <h2 class="subtitle">What I have to do</h2>
      <table class="table" id="task-list-table">
        <thead>
          <tr>
            <th><abbr title="Position">Check</abbr></th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody id="test-list"  v-focus v-on:keyup.enter="onEnterLastInput" 
          @keydown.delete="onDelete" @keydown.enter="onKeyDownEnter" @keypress.enter="onKeyPressEnter" >
          <tr v-for="data in postedData">
            <th>
              <check-button :target-id="data.key" />
            </th>
            <td class="input-area">
              <t-input :target-id="data.key" :value="data.value" :type="data.type" @focused='onFocus'/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h1 class="title">Today's time list</h1>
      <h2 class="subtitle">Today's plan and do</h2>
      <table class="table" id="time-range-list-table">
        <thead>
          <tr>
            <th><abbr title="Position">time range</abbr></th>
            <th>Content</th>
          </tr>
        </thead>
        <time-range-list :time-range-array='timeRangeArray' @focused='onFocus' @input='onInput'/>
      </table>
    </div>
  </section>

</main>
<content-area :is-inputted-focused='isInputtedFocused' :title='title' />

</div>



<link rel="stylesheet" href="css/style.css">
<script src="js/vue.js"></script>
<script src="js/schedule.js"></script>

<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script defer src="https://use.fontawesome.com/releases/v5.0.7/js/all.js"></script>

<link rel="stylesheet" href="css/bulma-0.7.1/css/bulma.css">

</body>

</html>