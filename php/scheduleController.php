<?php

require_once('dbConst.php');
require_once('dataHandler.php');

define('TIME_RANGE', array(
    '10:00 ~ 11:00',
    '11:00 ~ 12:00',
    '12:00 ~ 13:00',
    '13:00 ~ 14:00',
    '14:00 ~ 15:00',
    '15:00 ~ 16:00',
    '16:00 ~ 17:00',
    '17:00 ~ 18:00',
    '18:00 ~ 19:00',
    '19:00 ~ 20:00',
    '20:00 ~ 21:00'
  ));

/**
 * DBScheme
 * -todo
 *  └ todoid
 *  └ title
 *  └ isFinished
 * -schedule
 *  └ scheduleid
 *  └ title
 *  └ time_stamp
 *  *└ comments
 */

class ScheduleController{
    public function __construct() {
        //$this->setName($name);
    }

    public function getTodoData() {
        $todoList = array(); 
        $dataHandler = new DataHandler(DSN, USER, PASSWORD); //毎回newしないほうがいい
        $dataHandler->setActionType('select');
        $dataHandler->setTargetTable('todo');
        $dataHandler->setQuery('WHERE isfinished IS false');
        $dataHandler->execute();
        
        $rowTodoList = $dataHandler->fetchAll(); //fetchAllってなんだっけ？
        foreach ($rowTodoList as $todo) { //なんかこの辺ってよろしくやってくれそうなmethodありそう
            array_push($todoList, array(
                'key' => $todo['todoid'],
                'value' => $todo['title'],
                'type' => 'todo'
            ));
        }
        return $todoList;
    }

    public function getScheduleData() {
        $scheduleList = array();
        $dataHandler = new DataHandler(DSN, USER, PASSWORD);
        $dataHandler->setTargetTable('schedule');
        $this->initialize($dataHandler);

        $dataHandler->setActionType('select');
        $dataHandler->execute();

        $rowScheduleList = $dataHandler->fetchAll();

        foreach ($rowScheduleList as $key => $arr) {
            array_push($scheduleList, array(
              'key' => $arr['scheduleid'],
              'value' => $arr['title'],
              'timeRange' => TIME_RANGE[$key],
              'type' => 'schedule'
            ));
        }
        
        return $scheduleList;
    }

    /**
     * 日付が今日じゃないものを取得する
     * titleが残ってたら消す
     * 日付も消す
     */
    private function initialize($dataHandler){
        // TODO
        $dataHandler->setActionType('update');
        $today = date("Y/m/d");
        $dataHandler->setUpdateTarget('title = ?, time_stamp = ?');
        $dataHandler->setQuery('time_stamp != '.$today);
        var_dump('WHERE time_stamp != '.$today);
        $dataHandler->execute(array('',''));
        $dataHandler->setQuery('');
        var_dump('initialized');
        

        // reset any querys
    }

}


// When POST

/**
 * param = {
 *   tagList: Array
 *   article: String
 *   type: String
 * }
 * 
 * table \ colmun?
 */
if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $dataHandler = new DataHandler(DSN, USER, PASSWORD);

    switch($_POST['type']){
        case 'task-complete-button':
        $updateId = array_key_exists('updateid', $_POST) ? $_POST['updateid'] : null;
        $isFiniched = array_key_exists('isfiniched', $_POST) ? (bool)$_POST['isfiniched'] : '';

        $dataHandler->setActionType('update');
        $dataHandler->setTargetTable('todo'); // const化したい
        $dataHandler->setUpdateTarget('isfinished = ?');
        $dataHandler->setQuery('todoid = ?');
        $dataHandler->execute(array($isFiniched, $updateId));

        break;

        case 'new-todo':
        $dataHandler->setActionType('insert'); // const化したい
        $dataHandler->setTargetTable('todo'); // const化したい
        $dataHandler->setTargetColumns(array('title'));
        $dataHandler->execute(array($_POST['new_value']));

        break;

        case 'update-todo':
        $dataHandler->setActionType('update'); // const化したい
        $dataHandler->setTargetTable('todo'); // const化したい
        $dataHandler->setUpdateTarget('title = ?');
        $dataHandler->setQuery('todoid = ?');
        $dataHandler->execute(array($_POST['new_value'], $_POST['key']));

        break;

        case 'new-schedule':
        case 'update-schedule':
        $dataHandler->setActionType('update'); // const化したい
        $dataHandler->setTargetTable('schedule'); // const化したい
        $dataHandler->setUpdateTarget('title = ?, time_stamp = ?');
        $dataHandler->setQuery('scheduleid = ?');
        $today = date("Y/m/d");
        $dataHandler->execute(array($_POST['new_value'], $today, $_POST['key']));

        break;

        case 'delete-todo':
        $dataHandler->setActionType('delete'); // const化したい
        $dataHandler->setTargetTable('todo'); // const化したい
        $dataHandler->setQuery('todoid = ?');
        $dataHandler->execute(array($_POST['deletetodoid']));

        break;

        case 'delete-schedule':
        $dataHandler->setActionType('update'); // const化したい
        $dataHandler->setTargetTable('schedule'); // const化したい
        $dataHandler->setUpdateTarget('title = ?');
        $dataHandler->setQuery('scheduleid = ?');
        $dataHandler->execute(array('' ,$_POST['deletetodoid']));

        break;
    }
    

    
    
    
    

    //$article = $_POST['article'];
    //$type = $_POST['type'];
    //if($type == 'new-article'){
        // $stmt = $dbh->prepare('UPDATE schedule set title = :is_finished where todoid = :update_id');
    //}
    //$stmt = $dbh->prepare("INSERT INTO article (content) VALUES (:value)"); // $dbh already has staff
    //$stmt->bindParam(':name', $name, PDO::PARAM_STR);
    //$stmt->bindValue(':value', 1, PDO::PARAM_INT);
    //$stmt->bindValue(':value', $article, PDO::PARAM_STR);
    //$stmt->execute();


    
}

/**
 * @param {DataHandler} $dataHandler
 */
function insertNewArticle($dataHandler){
    $dataHandler->setActionType('insert');
    $dataHandler->setTargetTable('article'); // const化したい
    $dataHandler->setTargetColumns(array('content'));
    $dataHandler->execute(array($_POST['article']));
}

/**
 * @param {DataHandler} $dataHandler
 */
function insertNewTag($dataHandler){
    $insertedId = $dataHandler->getLastInsertedId();
    $dataHandler->setTargetTable('tag_map');
    $dataHandler->setTargetColumns(array('article_id', 'tag_id'));
    $tagList = explode(',', $_POST['tagList']);
        
    for ($i=0; $i < count($tagList); $i++) {
        $dataHandler->execute(array($insertedId, $tagList[$i]));
    }
}

?>
