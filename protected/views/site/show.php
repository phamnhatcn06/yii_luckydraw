<?php $baseUrl = Yii::app()->baseUrl; ?>
<!doctype html>
<html lang="vi">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Lucky Draw Show</title>
    <link rel="stylesheet" href="<?php echo $baseUrl; ?>/css/lucky.css" />
</head>

<body>
    <style>
        body {
            background: url("/images/background.jpg") no-repeat;
            background-size: cover;
        }
    </style>
    <canvas id="fxCanvas" class="fx"></canvas>
    <canvas id="petalCanvas" class="fx"></canvas>

    <div id="lightSweep" class="light-sweep"></div>
    <div class="screen">
        <div class="spin-area">
            <div id="prizeName" class="prize">—</div>
            <div id="specialMsg" class="special-msg hidden">Ai sẽ là người may mắn nhất hôm nay......</div>
            <div class="board hidden" id="board">
                <div class="dice-wrap">
                    <!-- scale wrapper: nhỏ lúc chờ, to khi quay -->
                    <div id="diceWrap" class="diceWrap hidden isIdle">
                        <div class="dice-row">
                            <div class="scene">
                                <div class="cube" id="c1"></div>
                            </div>
                            <div class="scene">
                                <div class="cube" id="c2"></div>
                            </div>
                            <div class="scene">
                                <div class="cube" id="c3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>

    <!-- Khu vực hiển thị người trúng giải duy nhất (nếu giải có quantity=1) -->
    <div id="winnerCenter"
        class="winner-center <?= (isset($prize) && $prize['quantity'] == 1 && count($winnerList) > 0) ? '' : 'hidden' ?>">
        <ul id="winnerListCenter">
            <?php if (isset($prize) && $prize['quantity'] == 1): ?>
                <?php foreach ($winnerList as $w): ?>
                    <li>
                        <span class="center-content">
                            <span class="numberBlock"><?= CHtml::encode($w['code']) ?></span>
                            <div class="info-block">
                                <span class="partname"><?= CHtml::encode($w['full_name']) ?></span>
                                <span class="job"><?= CHtml::encode($w['department']) ?></span>
                            </div>
                        </span>
                        <button class="btn-delete" data-id="<?= $w['id'] ?>" data-prize="<?= $w['prize_id'] ?>"
                            title="Huỷ người này">🗑</button>
                    </li>
                <?php endforeach; ?>
            <?php endif; ?>
        </ul>
    </div>

    <!-- Cánh gà trái (chỉ hiện nếu quantity > 1) -->
    <div id="winnersLeft"
        class="winners-side left <?= (isset($prize) && $prize['quantity'] > 1 && count($winnerList) > 0) ? '' : 'hidden' ?>">
        <!--    <div class="side-title">🎉 Người trúng giải</div>-->
        <ul id="winnerListLeft">
            <?php foreach ($winnerList as $i => $w): ?>
                <?php if ($i % 2 === 0): ?>
                    <li>
                        <span class="numberBlock">
                            <b><?= CHtml::encode($w['code']) ?></b>
                        </span>
                        <span class="partInfo">
                            <span class="partname"><?= CHtml::encode($w['full_name']) ?></span>
                            <br />
                            <span class="job"><?= CHtml::encode($w['department']) ?></span>
                        </span>
                        <button class="btn-delete" data-id="<?= $w['id'] ?>" data-prize="<?= $w['prize_id'] ?>"
                            title="Huỷ người này">❌</button>
                    </li>
                <?php endif; ?>
            <?php endforeach; ?>
        </ul>
    </div>

    <!-- Cánh gà phải -->
    <div id="winnersRight"
        class="winners-side right <?= (isset($prize) && $prize['quantity'] > 1 && count($winnerList) > 0) ? '' : 'hidden' ?>">
        <ul id="winnerListRight">
            <?php foreach ($winnerList as $i => $w): ?>
                <?php if ($i % 2 === 1): ?>
                    <li>
                        <span class="numberBlock">
                            <b><?= CHtml::encode($w['code']) ?></b>
                        </span>
                        <span class="partInfo">
                            <span class="partname"><?= CHtml::encode($w['full_name']) ?></span>
                            <br />
                            <span class="job"><?= CHtml::encode($w['department']) ?></span>
                        </span>
                        <button class="btn-delete" data-id="<?= $w['id'] ?>" data-prize="<?= $w['prize_id'] ?>"
                            title="Huỷ người này">❌</button>
                    </li>
                <?php endif; ?>
            <?php endforeach; ?>
        </ul>
    </div>
    <!-- Overlay -->
    <div id="winnerOverlay" class="overlay hidden"></div>

    <!-- Popup -->
    <div id="winnerPopup" class="winner-popup hidden">
        <div class="popup-header">
            🎉 XIN CHÚC MỪNG
        </div>

        <div class="popup-body">
            <div id="bigCode" class="code">----</div>
            <div id="fullName" class="line fullname">—</div>
            <div id="department" class="line sub position">—</div>
            <div id="company" class="line sub division">—</div>
        </div>

        <div class="popup-actions">
            <button class="btn cancel" onclick="cancelWinner()">❌ Hủy</button>
            <button class="btn confirm" onclick="confirmWinner()">✅ Xác nhận</button>
        </div>
    </div>

    <div class="hint">
        Nhấn <b>SPACE</b> để quay
        <span id="remaining" class="pill">—</span>
    </div>
    <button id="btnNextPrize" class="btn-next next-price">➡ Tiếp</button>
    <script>
        window.__API = {
            spin: "<?php echo $baseUrl; ?>/api/spin",
            prize: "<?php echo $baseUrl; ?>/api/prize",
            status: "<?php echo $baseUrl; ?>/api/status",
            confirm: "<?php echo $baseUrl; ?>/api/confirmWinner",
            cancel: "<?php echo $baseUrl; ?>/api/cancelWinner",
            nextPrize: "<?php echo $baseUrl; ?>/api/nextPrize",
        };
    </script>
    <script src="<?php echo $baseUrl; ?>/js/fireworks-modern.js"></script>
    <script src="<?php echo $baseUrl; ?>/js/lucky-show.js"></script>
</body>

</html>