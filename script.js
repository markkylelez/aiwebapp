// --- ข้อมูลแยกกล่องกันจริง ---
let CHAT_REPORTS = [
    { id: 'C101', reporter: 'สายฟ้า', reporterID: 'ID-223', reportedID: 'ID-882', type: 'คำพูดหยาบคาย', desc: 'ด่ากราดในห้องแชทสุ่ม', time: '14:20' }
];

let POST_REPORTS = [
    { id: 'P505', reporter: 'ก้อนเมฆ', reporterID: 'ID-442', reportedID: 'ID-007', type: 'ขายของ/สแปม', desc: 'โพสต์ลิงก์เว็บพนันรัวๆ', time: '15:10' }
];

let currentPage = 'all';

// ฟังก์ชันสลับหน้า
function switchPage(page) {
    currentPage = page;
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${page}`).classList.add('active');
    document.getElementById('title').innerText = "รายงาน: " + page;
    updateTable();
}

// ฟังก์ชันวาดตาราง
function updateTable() {
    const tbody = document.getElementById('table-body');
    let list = [];
    
    if (currentPage === 'Chat') list = CHAT_REPORTS;
    else if (currentPage === 'Post') list = POST_REPORTS;
    else list = [...CHAT_REPORTS, ...POST_REPORTS];

    tbody.innerHTML = list.map(item => `
        <tr>
            <td>${item.time} น.</td>
            <td><b style="color:#fd7d7e">${item.type}</b></td>
            <td style="text-align:right">
                <button class="btn-refresh" style="padding:5px 15px; cursor:pointer;" onclick="openDrawer('${item.id}', '${item.id.startsWith('C') ? 'Chat' : 'Post'}')">ตรวจสอบ →</button>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('last-update').innerText = "Update: " + new Date().toLocaleTimeString();
}

// เปิดดูรายละเอียด
function openDrawer(id, source) {
    const data = (source === 'Chat') ? CHAT_REPORTS : POST_REPORTS;
    const item = data.find(x => x.id === id);

    document.getElementById('drawer-content').innerHTML = `
        <div class="info-box">
            <small style="color:var(--red)">🚩 ผู้ถูกรายงาน (Reported User)</small>
            <code style="color:var(--muted)">ID: ${item.reportedID}</code>
        </div>
        <div class="info-box">
            <small style="color:var(--accent)">👤 ผู้แจ้งเหตุ (Reporter)</small>
            <div>${item.reporterID}</div>
        </div>
        <div class="info-box">
            <small>📝 รายละเอียด (Source: ${source})</small>
            <p style="font-size:14px; line-height:1.5;">${item.desc}</p>
        </div>
        <div style="margin-top:30px;">
            <button class="btn-action btn-green" onclick="handleAction('${item.id}', 'resolved')">ยืนยันการจัดการ</button>
            <button class="btn-action btn-outline" onclick="handleAction('${item.id}', 'dismissed')">ยกเลิกรายการนี้</button>
        </div>
    `;
    document.getElementById('drawer').style.display = 'flex';
}

// ฟังก์ชันจัดการ (ยืนยัน/ยกเลิก)
function handleAction(id, action) {
    // ลบข้อมูลออกจาก List (จำลองการจัดการเสร็จ)
    CHAT_REPORTS = CHAT_REPORTS.filter(x => x.id !== id);
    POST_REPORTS = POST_REPORTS.filter(x => x.id !== id);

    const msg = action === 'resolved' ? '✅ จัดการเรียบร้อยแล้ว' : '📁 ยกเลิกรายงานแล้ว';
    showToast(msg);
    closeDrawer();
    updateTable();
}

function closeDrawer() { document.getElementById('drawer').style.display = 'none'; }

function showToast(msg) {
    const t = document.getElementById('toast');
    t.innerText = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
}

// รันครั้งแรก
updateTable();