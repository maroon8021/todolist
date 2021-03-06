<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <title>Articles</title>
</head>

<!--
TODO
- checkbox's vue
- button's vue
- textarea's vue

-->

<?php
// Get view data
require_once('php/articleController.php');

$articleController = new ArticleController();
$tagList = json_encode($articleController->getTagData());

?>


<script type="text/javascript">
// To get Data from server-side
var tagList = JSON.parse('<?php echo $tagList; ?>');
console.log(tagList);

// temp
if(tagList.length === 0){
  tagList = [{tagId: '1', tagName: 'Diary'},{tagId: '2', tagName: 'Programing'}]
}

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
    <div id="article-manager" class="container">
      <h1 class="title">Add an Article</h1>
      <h2 class="subtitle">
        Add something new here
      </h2>

      <div class="field has-addons">
        <textarea class="textarea article-textarea" placeholder="e.g. Hello world" ></textarea>
      </div>

      <tag-manager ref="childCheckbox" :tag-list="tagList"></tag-manager>
      
      <div class="field has-addons">
        <p class="control">
          <input class="input new-tag-input" type="text" placeholder="New Tag">
        </p>
        <p class="control">
        <button class="button is-success" @click="onClickNewTag">
          Create New Tag
          </button>
        </p>
      </div>

      <div class="field has-addons">
        <div class="control">
          <button class="button is-link" @click="onClickSubmit" >Submit</button>
        </div>
      </div>

      <article class="message is-info">
        <div class="message-body">
        </div>
      </article>

    </div>
  </section>


</main>






<link rel="stylesheet" href="css/style.css">
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="js/vue.js"></script>
<script src="js/article.js"></script>
<script defer src="https://use.fontawesome.com/releases/v5.0.7/js/all.js"></script>
<link rel="stylesheet" href="css/bulma-0.7.1/css/bulma.css">

</body>

</html>