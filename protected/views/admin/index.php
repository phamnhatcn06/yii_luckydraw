<div style="max-width:1100px;margin:0 auto;padding:18px;color:#fff;font-family:system-ui;background:#07010b;min-height:100vh">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <div>
            <h2 style="margin:0">Admin • Lucky Draw</h2>
            <div style="opacity:.85;margin-top:6px">
                Participants: <?php echo (int)$participantsCount; ?> (active <?php echo (int)$activeCount; ?>)
                • Rule: <b><?php echo $allowMulti ? 'Multi-win ON' : 'Chỉ trúng 1 lần'; ?></b>
            </div>
        </div>
        <div>
            <a href="/" style="color:#f7d36a">Mở màn hình quay</a>
            &nbsp;|&nbsp;
            <a href="<?php echo $this->createUrl('admin/logout'); ?>" style="color:#f7d36a">Đăng xuất</a>
        </div>
    </div>

    <div style="margin-top:12px;padding:14px;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(255,255,255,.06)">
        <h3 style="margin:0 0 10px">Quản lý giải thưởng</h3>
        <form method="post" action="<?php echo $this->createUrl('admin/savePrizes'); ?>">
            <table style="width:100%;border-collapse:collapse">
                <thead>
                <tr>
                    <th style="text-align:left;border-bottom:1px solid rgba(255,255,255,.12);padding:8px">Thứ tự</th>
                    <th style="text-align:left;border-bottom:1px solid rgba(255,255,255,.12);padding:8px">Tên giải</th>
                    <th style="text-align:left;border-bottom:1px solid rgba(255,255,255,.12);padding:8px">Số suất</th>
                </tr>
                </thead>
                <tbody>
                <?php foreach ($prizes as $p): ?>
                    <tr>
                        <td style="border-bottom:1px solid rgba(255,255,255,.12);padding:8px">
                            <input name="prize_order[<?php echo (int)$p->id; ?>]" value="<?php echo (int)$p->prize_order; ?>">
                        </td>
                        <td style="border-bottom:1px solid rgba(255,255,255,.12);padding:8px">
                            <input style="width:90%" name="prize_name[<?php echo (int)$p->id; ?>]" value="<?php echo CHtml::encode($p->prize_name); ?>">
                        </td>
                        <td style="border-bottom:1px solid rgba(255,255,255,.12);padding:8px">
                            <input name="quantity[<?php echo (int)$p->id; ?>]" value="<?php echo (int)$p->quantity; ?>">
                        </td>
                    </tr>
                <?php endforeach; ?>
                <tr>
                    <td style="padding:8px"><input name="new_prize_order" placeholder="99"></td>
                    <td style="padding:8px"><input style="width:90%" name="new_prize_name" placeholder="Giải mới"></td>
                    <td style="padding:8px"><input name="new_quantity" placeholder="1"></td>
                </tr>
                </tbody>
            </table>

            <button style="margin-top:10px;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:linear-gradient(180deg,#ff2a3a,#b4001b);color:#fff;font-weight:800;cursor:pointer">
                Lưu giải
            </button>
        </form>
    </div>

    <div style="margin-top:12px;padding:14px;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(255,255,255,.06)">
        <h3 style="margin:0 0 10px">Upload CSV participants</h3>
        <div style="opacity:.85;font-size:13px;margin-bottom:10px">Header: <b>code,full_name,department,company</b></div>
        <form method="post" enctype="multipart/form-data" action="<?php echo $this->createUrl('admin/uploadParticipants'); ?>">
            <input type="file" name="csv" accept=".csv,text/csv" required>
            <button style="padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);color:#fff;cursor:pointer">Upload</button>
        </form>
    </div>

    <div style="margin-top:12px;padding:14px;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(255,255,255,.06)">
        <h3 style="margin:0 0 10px">Reset winners</h3>
        <form method="post" action="<?php echo $this->createUrl('admin/resetWinners'); ?>" onsubmit="return confirm('Xóa toàn bộ winners?');">
            <button style="padding:10px 12px;border-radius:12px;border:1px solid rgba(255,42,58,.35);background:rgba(255,42,58,.14);color:#fff;cursor:pointer">
                RESET
            </button>
        </form>
    </div>

    <div style="margin-top:12px;padding:14px;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(255,255,255,.06)">
        <h3 style="margin:0 0 10px">Winners gần nhất</h3>
        <table style="width:100%;border-collapse:collapse">
            <thead>
            <tr>
                <th style="text-align:left;border-bottom:1px solid rgba(255,255,255,.12);padding:8px">Thời gian</th>
                <th style="text-align:left;border-bottom:1px solid rgba(255,255,255,.12);padding:8px">Giải</th>
                <th style="text-align:left;border-bottom:1px solid rgba(255,255,255,.12);padding:8px">Mã</th>
                <th style="text-align:left;border-bottom:1px solid rgba(255,255,255,.12);padding:8px">Tên</th>
                <th style="text-align:left;border-bottom:1px solid rgba(255,255,255,.12);padding:8px">Phòng ban</th>
                <th style="text-align:left;border-bottom:1px solid rgba(255,255,255,.12);padding:8px">Công ty</th>
            </tr>
            </thead>
            <tbody>
            <?php foreach ($lastWinners as $w): ?>
                <tr>
                    <td style="border-bottom:1px solid rgba(255,255,255,.12);padding:8px"><?php echo CHtml::encode($w['won_at']); ?></td>
                    <td style="border-bottom:1px solid rgba(255,255,255,.12);padding:8px"><?php echo CHtml::encode($w['prize_name']); ?></td>
                    <td style="border-bottom:1px solid rgba(255,255,255,.12);padding:8px"><b><?php echo CHtml::encode($w['code']); ?></b></td>
                    <td style="border-bottom:1px solid rgba(255,255,255,.12);padding:8px"><?php echo CHtml::encode($w['full_name']); ?></td>
                    <td style="border-bottom:1px solid rgba(255,255,255,.12);padding:8px"><?php echo CHtml::encode($w['department']); ?></td>
                    <td style="border-bottom:1px solid rgba(255,255,255,.12);padding:8px"><?php echo CHtml::encode($w['company']); ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
