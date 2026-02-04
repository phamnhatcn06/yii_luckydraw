<?php
// index.php
$yii = dirname(__FILE__) . '/framework/yii.php';          // đường dẫn tới yii.php
$config = dirname(__FILE__) . '/protected/config/main.php';

defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL', 3);

require_once($yii);
Yii::createWebApplication($config)->run();
