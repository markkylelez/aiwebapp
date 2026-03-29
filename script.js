const MOCK = [
    { id: 'RPT-1001', reporterId: 'USR-8821', reportedId: 'USR-0092', reportedName: 'ดาวดาว', feature: 'Chat', type: 'คำพูดเกลียดชัง', description: 'ส่งข้อความด่าทอด้วยถ้อยคำรุนแรงซ้ำๆ ในห้องแชทสาธารณะ ทำให้ผู้อื่นอึดอัด', status: 'pending', createdAt: Date.now() - 300000 },
    { id: 'RPT-1002', reporterId: 'USR-4432', reportedId: 'USR-7712', reportedName: 'เมฆขาว', feature: 'Post', type: 'สแปม', description: 'โพสต์ขายของและส่งลิงก์แปลกๆ ลงในหน้าฟีดบ่อยเกินไป', status: 'pending', createdAt: Date.now() - 900000 },
    { id: 'RPT-1003', reporterId: 'USR-1120', reportedId: 'USR-5541', reportedName: 'หมอกจาง', feature: 'Chat', type: 'เนื้อหาไม่เหมาะสม', description: 'แชร์รูปภาพที่ขัดต่อกฎระเบียบของชุมชนในแชทกลุ่ม', status: 'resolved', createdAt: Date.now() - 3600000 }
];

let reports = MOCK;

const STATUS_LABEL = { 
    pending: ['รอตรวจสอบ', 'b-yellow'], 
    resolved: ['จัดการแล้ว', 'b-green'], 
    dismissed: ['ยกเลิก', 'b-gray'] 
};

function renderTable() {
    const q = document.getElementById('q').value.toLowerCase();
    const fFeat = document.getElementById('f-feature').value;
    const fStat = document.getElementById('f-status').value;

    const filtered = reports.filter(r => {
        return (r.id.toLowerCase().includes(q))
            && (!fFeat || r.feature === fFeat)
            && (!fStat || r.status === fStat);
    });

    document.getElementById('row-count').textContent = filtered.length + ' รายการ';
    const tbody = document.getElementById('tbody');
    
    tbody.innerHTML = filtered.map(r => {
        const date = new Date(r.createdAt).toLocaleDateString('th-TH');
        const time = new Date(r.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        
        return `
        <tr>
            <td>
                <div style="font-weight:500">${date}</div>
                <div style="font-size:11px; color:var(--muted); font-family:var(--mono)">${time} น.</div>
            </td>
            <td><span class="badge ${r.feature === 'Chat' ? 'b-blue' : 'b-purple'}">${r.feature}</span></td>
            <td><span class="badge b-red">${r.type}</span></td>
            <td style="text-align: right;">
                <button class="btn" style="font-size:12px; background:rgba(255,255,255,0.05)" onclick="openDrawer('${r.id}')">รายละเอียด</button>
            </td>
        </tr>
    `}).join('');
}

function updateStatus(id, newStatus) {
    const r = reports.find(x => x.id === id);
    if(r) r.status = newStatus;
    toast('✅', 'ดำเนินการสำเร็จ');
    renderTable();
    closeDrawer();
}

function openDrawer(id) {
    const r = reports.find(x => x.id === id);
    if(!r) return;

    const [sLabel, sClass] = STATUS_LABEL[r.status];

    document.getElementById('d-body').innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:20px">
            <div class="detail-field">
                <div class="detail-label">Report ID</div>
                <div class="id-badge">${r.id}</div>
            </div>
            <span class="badge ${sClass}">${sLabel}</span>
        </div>

        <div style="background:rgba(255,255,255,0.02); padding:16px; border-radius:12px; border:1px solid var(--border); margin-bottom:20px">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom:12px">
                <div>
                    <div class="detail-label">ผู้ถูกรายงาน (ID)</div>
                    <div class="id-badge" style="color:var(--red)">${r.reportedId}</div>
                </div>
                <div>
                    <div class="detail-label">ผู้รายงาน (ID)</div>
                    <div class="id-badge">${r.reporterId}</div>
                </div>
            </div>
        </div>

        <div style="display:flex; gap:10px; margin-bottom:20px">
            <div style="flex:1">
                <div class="detail-label">ช่องทาง</div>
                <span class="badge ${r.feature === 'Chat' ? 'b-blue' : 'b-purple'}">${r.feature}</span>
            </div>
            <div style="flex:2">
                <div class="detail-label">ประเภทปัญหา</div>
                <span class="badge b-red">${r.type}</span>
            </div>
        </div>

        <div class="detail-field">
            <div class="detail-label">รายละเอียดเหตุการณ์</div>
            <div class="detail-val" style="background:var(--card); padding:16px; border-radius:10px; border:1px solid var(--border2)">
                ${r.description}
            </div>
        </div>

        <div style="margin-top:30px; display:flex; gap:10px">
            <button class="btn" style="background:var(--green); color:#000; border:none; font-weight:700; flex:1" onclick="updateStatus('${r.id}','resolved')">ยืนยันจัดการ</button>
            <button class="btn" style="flex:1" onclick="updateStatus('${r.id}','dismissed')">ยกเลิก</button>
        </div>
    `;
    document.getElementById('overlay').classList.add('open');
}

function closeDrawer(e) { 
    if(!e || e.target.id === 'overlay' || e.target.className === 'close-btn') {
        document.getElementById('overlay').classList.remove('open'); 
    }
}

function toast(icon, msg) {
    const el = document.getElementById('toast');
    el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
}

function fetchReports() {
    renderTable();
    document.getElementById('last-updated').textContent = new Date().toLocaleTimeString('th-TH');
}

fetchReports();