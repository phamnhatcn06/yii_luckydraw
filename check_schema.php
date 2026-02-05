<?php
// check_schema.php
$columns = Yii::app()->db->schema->getTable('prizes')->columnNames;
print_r($columns);
if (!in_array('duration', $columns)) {
    echo "Adding duration column...\n";
    Yii::app()->db->createCommand("ALTER TABLE prizes ADD COLUMN duration INT DEFAULT 3000")->execute();
    echo "Added duration column.\n";
} else {
    echo "Column duration already exists.\n";
}
