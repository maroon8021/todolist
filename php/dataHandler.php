<?php

class DataHander {
    protected $dbh;
    protected $actionType;
    protected $targetTable;
    protected $targetColumn;

    public function __construct($dsn, $user, $password) {
        $this->dbh = new PDO($dsn, $user, $password, array(
            PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ));;
    }

    /**
     * @param {String} $actionType
     */
    public function setActionType($actionType) {
        $this->actionType = $actionType;
    }

    /**
     * @param {String} $targetTable
     */
    public function setTargetTable($targetTable) {
        $this->targetTable = $targetTable;
    }

    /**
     * @param {String} $targetColumn
     */
    public function setTargetColumn($targetColumn) {
        $this->targetColumn = $targetColumn;
    }

    /**
     * 
     */
    public function execute($content) {
        $stmt = null;
        switch($this->actionType){
            case 'insert':
              $stmt = $dbh->prepare("INSERT INTO .$this->targetTable. (.$this->targetColumn.) VALUES (:value)");
              break;
        }
        $stmt->bindValue(':value', $content, PDO::PARAM_STR);
        $stmt->execute();
    }


    
}

?>