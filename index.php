<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="apple-mobile-web-app-capable" content="yes" />


  <title>Todo List</title>
</head>




<?php
//////////////////////////////////////

//テンプレ
define('DB_HOST', 'localhost'); //定数化

$dsn = 'mysql:dbname=todolist;host='.DB_HOST.';charset=utf8mb4'; //utf8の指定が必要
$user = 'root';
$password = 'root';

$dbh_json;
$sql_json;
try{
  $dbh = new PDO($dsn, $user, $password);
    $dbh_json = $dbh;

    $sql = 'select * from todo';
    $sql_json = $sql;
    foreach ($dbh->query($sql) as $row) {
        print($row['todoid'].',');
        print($row['title']);
        print('<br />');
    }
}catch (PDOException $e){
    print('Error:'.$e->getMessage());
    die();
}

$dbh = null;

$dbh_json = json_encode($dbh_json);
$sql_json = json_encode($sql_json);


$postedData='';
if($_SERVER['REQUEST_METHOD'] === 'POST'){

    $postedData = $_POST['comment'];
    $stmt = $dbh->prepare("INSERT INTO staffname (name) VALUES (:value)"); // $dbh already has staff
    //$stmt->bindParam(':name', $name, PDO::PARAM_STR);
    //$stmt->bindValue(':value', 1, PDO::PARAM_INT);
    $stmt->bindValue(':value', $postedData, PDO::PARAM_STR);
    $stmt->execute();
  }

$serverRequest_json = json_encode($_SERVER['REQUEST_METHOD']);
$postedData_json = json_encode($postedData);

$myPath = __FILE__;
$basename = pathinfo($myPath, PATHINFO_BASENAME);

////////////////////////////////////////
?>


<script type="text/javascript">
    var serverRequest = JSON.parse('<?php echo $serverRequest_json; ?>');
    console.log(serverRequest);

    var postedData = JSON.parse('<?php echo $postedData_json; ?>');
    console.log("$postedData : "+postedData);
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

<main class="bd-main">
  <section class="section">
    <div class="container">
      <h1 class="title">Section</h1>
      <h2 class="subtitle">
        A simple container to divide your page into <strong>sections</strong>, like the one you're currently reading
      </h2>
      <div id="app">
      {{ message }}
    </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h1 class="title">Add Todo</h1>
      <h2 class="subtitle">
        A simple container to divide your page into <strong>sections</strong>, like the one you're currently reading
      </h2>

      <form action = "/php/datapost.php" method = "post">
      <div class="field has-addons">
        <div class="control">
          <input class="input" type="text" name="newtodo" placeholder="Add your todo here">
          <input type="hidden" name="url" value="../index.php">
        </div>
        <div class="control">
          <button class="button is-link">Submit</button>
        </div>
      </div>
      </form>

      <form action = "/php/dbtest.php" method = "post">
      <div class="field has-addons">
        <div class="control">
          <!--
          <div class="select">
            <select>
              <option>Select dropdown</option>
              <option>With options</option>
            </select>
          </div>
        -->
        <input class="input" type="text" name="deletetodoid" placeholder="Add your todo to delete">

          <input type="hidden" name="url" value="../index.php">
        </div>
        <div class="control">
          <button class="button is-link">Submit</button>
        </div>
      </div>
      </form>

      <form action = "/php/dbupdate.php" method = "post">
      <div class="field has-addons">
        <div class="control">
          <!--
          <div class="select">
            <select>
              <option>Select dropdown</option>
              <option>With options</option>
            </select>
          </div>
        -->
        <input class="input" type="text" name="updatetodocontent" placeholder="Add your todo to delete">

          <input type="hidden" name="url" value="../index.php">
        </div>
        <div class="control">
          <button class="button is-link">Submit</button>
        </div>
      </div>
      </form>

    </div>
  </section>

  <section class="section">
    <div class="container">
      <h1 class="title">What you have to do</h1>
      <h2 class="subtitle">
        This is main todo list you need to do
      </h2>

      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <!--
            <th><abbr title="Position">Check</abbr></th>
            <th>Content</th>
          -->
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>
              <a class="button is-rounded is-success">
                <span class="icon is-small">
                  <i class="fas fa-check"></i>
                </span>
              </a>
            </th>
            <td><a class="button is-success">
              <span class="icon is-small">
                <i class="fas fa-check"></i>
              </span>
              <span>Save</span>
            </a></td>
          </tr>
        <tr>
          <th>2</th>
          <td><a href="https://en.wikipedia.org/wiki/Arsenal_F.C." title="Arsenal F.C.">ArsenalArsenalArsenalArsenalArsenalArsenalArsenal</a></td>
        </tr>

      </tbody>
    </table>
  </div>
</section>

  <section class="section">
    <div class="container">
      <h1 class="title">Today's time list</h1>
      <h2 class="subtitle">
        Today's plan and do
      </h2>

      <table class="table">
  <thead>
    <tr>
      <th><abbr title="Position">Check</abbr></th>
      <th>Content</th>
    </tr>
  </thead>
  <!--
  <tfoot>
    <tr>
      <th><abbr title="Position">Pos</abbr></th>
      <th>Team</th>
      <th><abbr title="Played">Pld</abbr></th>
      <th><abbr title="Won">W</abbr></th>
      <th><abbr title="Drawn">D</abbr></th>
      <th><abbr title="Lost">L</abbr></th>
      <th><abbr title="Goals for">GF</abbr></th>
      <th><abbr title="Goals against">GA</abbr></th>
      <th><abbr title="Goal difference">GD</abbr></th>
      <th><abbr title="Points">Pts</abbr></th>
      <th>Qualification or relegation</th>
    </tr>
  </tfoot>
-->
  <tbody>
    <tr>
      <th><a class="button is-rounded is-success">
        <span class="icon is-small">
          <i class="fas fa-check"></i>
        </span>
      </a></th>
      <td><a class="button is-success">
    <span class="icon is-small">
      <i class="fas fa-check"></i>
    </span>
    <span>Save</span>
  </a></strong>
      </td>
    </tr>
    <tr>
      <th>2</th>
      <td><a href="https://en.wikipedia.org/wiki/Arsenal_F.C." title="Arsenal F.C.">ArsenalArsenalArsenalArsenalArsenalArsenalArsenal</a></td>
    </tr>

    <tr>
      <th>3</th>
      <td><t-input id="t-input-1" ></td>
    </tr>

    <tr>
      <th>4</th>
      <td><t-input id="t-input-2" placeholder="test render" v-on:click="onClick2"></td>
    </tr>

  </tbody>
</table>
    </div>
  </section>

</main>





<link rel="stylesheet" href="css/bulma-0.7.1/css/bulma.css">
<link rel="stylesheet" href="css/style.css">
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="js/vue.js"></script>
<script src="js/index.js"></script>
<script defer src="https://use.fontawesome.com/releases/v5.0.7/js/all.js"></script>


</body>

</html>