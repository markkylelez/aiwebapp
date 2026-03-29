// --- ข้อมูลแยกกล่องกันจริง ---
let CHAT_REPORTS = [
    { id: 'C101', reporter: 'สายฟ้า', reporterID: 'ID-223', reportedID: 'ID-882', type: 'คำพูดหยาบคาย', system: 'Chat', desc: 'ด่ากราดในห้องแชทสุ่ม', time: '14:20' }
];

let POST_REPORTS = [
    { id: 'P505', reporter: 'ก้อนเมฆ', reporterID: 'ID-442', reportedID: 'ID-007', type: 'ขายของ/สแปม', system: 'Post', desc: 'โพสต์ลิงก์เว็บพนันรัวๆ', time: '15:10' }
];

let ALL_REPORTS = [];

let currentPage = 'all';

// ฟังก์ชันสลับหน้า
function switchPage(page) {
    currentPage = page;
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${page}`).classList.add('active');
    document.getElementById('title').innerText = "รายงาน: " + page;
    updateTable();
}

async function fetchReports() {
    try {
        const res = await fetch('https://healjaiapi.onrender.com/admin/dashboards');

        if (!res.ok) {
            throw new Error('โหลดข้อมูลไม่สำเร็จ');
        }

        const data = await res.json();

        // เก็บไว้ใช้ทั้งระบบ
        ALL_REPORTS = data;
        console.log(ALL_REPORTS);

        // render ตารางใหม่
        updateTable();

        console.log('โหลด reports สำเร็จ:', data);

    } catch (err) {
        console.error('เกิด error:', err);
    }
}

// ฟังก์ชันวาดตาราง
function updateTable() {
    const tbody = document.getElementById('table-body');
    let list = [];

    if (currentPage === 'Chat') {
        list = ALL_REPORTS.filter(item => item.Feature === 'Chat');
    }
    else if (currentPage === 'Post') {
        list = ALL_REPORTS.filter(item => item.Feature === 'Post');
    }
    else {
        list = ALL_REPORTS;
    }
    tbody.innerHTML = list.map(item => `
        <tr>
            <td>${item.Date} น.</td>
            <td><b style="color:#fd7d7e">${item.Type}</b></td>
            <td><b style="color:#FFFFFF">${item.Feature}</b></td>
            <td style="text-align:right">
                <button class="btn-refresh" 
    style="padding:5px 15px; cursor:pointer;" 
    onclick="openDrawer('${item._id}', '${item.Feature}')">
    ตรวจสอบ →
            </button>
            </td>
        </tr>
    `).join('');


}

// เปิดดูรายละเอียด
function openDrawer(id, source) {
    // const data = (source === 'Chat') ? CHAT_REPORTS : POST_REPORTS;
    const data = ALL_REPORTS;
    const item = data.find(x => x._id === id);

    let content = '';

    if (source === 'Chat') {
        content = `
            <div class="info-box">
                <small style="color:var(--red)">💬 RoomID แชทที่ถูกรายงาน</small>
                <p style="font-size:14px;">${item.RoomId}</p>
            </div>

            <div class="info-box">
                <small style="color:var(--accent)">💬 รายละเอียดเพิ่มเติม</small>
                <p style="font-size:14px;">${item.Detail}</p>
            </div>

            <div class="info-box">
                <small>⚠️ ประเภท</small>
                <b style="color:#fd7d7e">${item.Type}</b>
            </div>
        `;
    } else if (source === 'Post') {
        content = `
            <div class="info-box">
                <small style="color:var(--red)">📢 ID โพสต์ที่ถูกรายงาน</small>
                <p style="font-size:14px;">${item.PostId}</p>
            </div>

            <div class="info-box">
                <small style="color:var(--accent)">👤 ID เจ้าของโพสต์</small>
                <code>${item.UserId_reciver}</code>
            </div>

            <div class="info-box">
                <small style="color:var(--accent)">💬 รายละเอียดเพิ่มเติม</small>
                <p style="font-size:14px;">${item.Detail}</p>
            </div>

            <div class="info-box">
                <small>🔗 ประเภทโพสต์</small>
                <b style="color:#fd7d7e">${item.Type}</b>
            </div>
        `;
    }

    document.getElementById('drawer-content').innerHTML = `
        ${content}

        <div class="info-box">
            <small>👤 ผู้แจ้งเหตุ</small>
            <div>${item.UserId_sender}</div>
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
fetchReports();
updateTable();