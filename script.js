const body = document.body;
const splash = document.createElement('div');
splash.className = 'splash';
splash.innerHTML = '<div class="splash-mark"><div class="splash-leaf">◆</div><strong>وصلني</strong><small>طلبك أقرب مما تتخيل</small></div>';
body.appendChild(splash);
setTimeout(() => {
  splash.classList.add('exit');
  setTimeout(() => { splash.remove(); showAuth(); }, 500);
}, 2000);

function showAuth() {
  if (localStorage.getItem('waslni-auth') === 'true') return;
  const auth = document.createElement('div');
  auth.className = 'auth-screen';
  const login = () => {
    auth.innerHTML = `<div class="auth-logo">◆</div><h1>مرحبًا بك في وصلني</h1><p>سجّل دخولك وابدأ طلبك القادم</p><form class="auth-form login-form"><label>رقم الجوال أو البريد الإلكتروني<input required type="text" placeholder="05xxxxxxxx أو name@email.com"></label><label>كلمة المرور<input required minlength="6" type="password" placeholder="••••••••"></label><button class="auth-submit" type="submit">تسجيل الدخول</button></form><div class="auth-divider"><span>أو المتابعة عبر</span></div><button class="social-btn" id="googleBtn">G&nbsp;&nbsp; المتابعة بحساب Google</button><div class="auth-footer">ليس لديك حساب؟ <button type="button" id="signupBtn">إنشاء حساب</button></div>`;
    auth.querySelector('.login-form').addEventListener('submit', event => { event.preventDefault(); completeAuth(); });
    auth.querySelector('#signupBtn').addEventListener('click', signup);
    auth.querySelector('#googleBtn').addEventListener('click', completeAuth);
  };
  const signup = () => {
    auth.innerHTML = `<div class="auth-logo">◆</div><h1>إنشاء حساب جديد</h1><p>أدخل بياناتك للمتابعة</p><form class="auth-form signup-form"><label>الاسم الأول<input required type="text" placeholder="أحمد"></label><label>الاسم الأخير<input required type="text" placeholder="محمد"></label><label>رقم الجوال<input required type="tel" pattern="[0-9+ ]{9,15}" placeholder="01xxxxxxxxx"></label><label>البريد الإلكتروني<input required type="email" placeholder="name@email.com"></label><label>كلمة المرور<input required minlength="6" type="password" placeholder="6 أحرف على الأقل"></label><button class="auth-submit" type="submit">إنشاء الحساب</button></form><div class="auth-footer"><button type="button" id="loginBtn">لديك حساب؟ تسجيل الدخول</button></div>`;
    auth.querySelector('.signup-form').addEventListener('submit', event => {
      event.preventDefault(); const fields = auth.querySelectorAll('.signup-form input');
      localStorage.setItem('waslni-profile', JSON.stringify({first:fields[0].value,last:fields[1].value,phone:fields[2].value,email:fields[3].value})); completeAuth();
    });
    auth.querySelector('#loginBtn').addEventListener('click', login);
  };
  const completeAuth = () => { localStorage.setItem('waslni-auth','true'); auth.classList.add('exit'); setTimeout(() => auth.remove(),350); showToast('تم تسجيل الدخول بنجاح'); };
  body.appendChild(auth); login();
}

const toast = document.getElementById('toast');
function showToast(text) { toast.textContent=text; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2200); }

const homePage=document.querySelector('.hero'), ordersPage=document.getElementById('ordersPage'), accountPage=document.getElementById('accountPage');
function showPage(page){
  homePage.classList.toggle('hidden',page==='orders'||page==='account'||page==='category'||page==='custom'||page==='detail');
  ordersPage.classList.toggle('hidden',page!== 'orders'); accountPage.classList.toggle('hidden',page!== 'account');
  document.querySelectorAll('.category-page,.custom-page,.detail-page').forEach(p=>p.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(i=>i.classList.toggle('active',i.dataset.page===page)); window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('.nav-item').forEach(i=>i.addEventListener('click',()=>showPage(i.dataset.page)));
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',()=>showPage('home')));

const backdrop=document.getElementById('sheetBackdrop'), filterSheet=document.getElementById('filterSheet'), languageSheet=document.getElementById('languageSheet');
function openSheet(s){backdrop.classList.add('open');s.classList.add('open')} function closeSheets(){backdrop.classList.remove('open');document.querySelectorAll('.bottom-sheet').forEach(s=>s.classList.remove('open'))}
document.getElementById('filterBtn')?.addEventListener('click',()=>openSheet(filterSheet)); document.getElementById('languageBtn')?.addEventListener('click',()=>openSheet(languageSheet));
backdrop?.addEventListener('click',closeSheets); document.querySelectorAll('.sheet-close,.apply-btn').forEach(b=>b.addEventListener('click',closeSheets));
document.querySelectorAll('.price-options button,.rating-options button,.language-list button').forEach(btn=>btn.addEventListener('click',()=>{
  if(btn.parentElement.classList.contains('language-list')){btn.parentElement.querySelectorAll('button').forEach(b=>{b.classList.remove('active');b.querySelector('i').textContent=''});btn.classList.add('active');btn.querySelector('i').textContent='✓';setTimeout(closeSheets,250)}else{btn.parentElement.querySelectorAll('button').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}
}));

const categoryData={
  'الكل':['ذا برجر كوتشر','بيتزا هانا','كافيه ليل'], 'عروض':['عرض البرجر الكبير','عرض البيتزا','عرض القهوة'],
  'برجر':['ذا برجر كوتشر','برجر كلاسيك','برجر هاوس'], 'بيتزا':['بيتزا هانا','بيتزا رومانو','دومينو مصر'],
  'حلويات':['حلويات البلد','زعبير حلواني','دريم كيك'], 'قهوة':['كافيه ليل','عشبة','كافيه 70'],
  'بقالات':['كارفور ماركت','ابن مصر','سوبر ماركت العائلة'], 'صيدليات':['صيدليات العزبي','روزيتا','رشدي ماركت'
]};
const icons={'الكل':'✦','عروض':'٪','برجر':'🍔','بيتزا':'🍕','حلويات':'🍰','قهوة':'☕','بقالات':'🛒','صيدليات':'⚕'};

function openCategory(name){
  let page=document.getElementById('categoryPage'); if(!page){page=document.createElement('section');page.id='categoryPage';page.className='page-view category-page';document.querySelector('main').appendChild(page)}
  const names=categoryData[name]||[];
  page.innerHTML=`<div class="page-header"><button class="back-btn back-home">‹</button><h2>${icons[name]} ${name}</h2><button class="icon-btn">•••</button></div><div class="category-banner"><small>${name==='بقالات'||name==='صيدليات'?'توصيل سريع إلى باب منزلك':'أفضل الاختيارات بالقرب منك'}</small><h3>${name==='الصيدليات'?'صحتك أقرب':name==='بقالات'?'احتياجاتك اليومية':'استمتع بـ'+name}</h3></div><div class="section-heading"><h3>${name==='بقالات'? 'البقالات القريبة':name==='صيدليات'?'الصيدليات القريبة':'المطاعم المختارة'}</h3><button>عرض الكل</button></div><div class="category-list">${names.map((n,i)=>`<article><div class="category-store-icon">${icons[name]}</div><div><b>${n}</b><small>${20+i*5}-${30+i*5} دقيقة • توصيل ${i?30:25} ج</small></div><span>★ ${(4.7+i*.1).toFixed(1)}</span><button data-store="${n}">فتح</button></article>`).join('')}</div>`;
  page.classList.remove('hidden'); homePage.classList.add('hidden'); ordersPage.classList.add('hidden'); accountPage.classList.add('hidden'); document.querySelectorAll('.custom-page,.detail-page').forEach(p=>p.classList.add('hidden')); window.scrollTo({top:0,behavior:'smooth'});
  page.querySelector('.back-home').addEventListener('click',()=>showPage('home')); page.querySelectorAll('[data-store]').forEach(b=>b.addEventListener('click',()=>openStore(b.dataset.store,name)));
}
document.querySelectorAll('.category').forEach(c=>c.addEventListener('click',()=>{document.querySelectorAll('.category').forEach(x=>x.classList.remove('active'));c.classList.add('active');openCategory(c.dataset.category)}));

function openStore(store,category){let page=document.querySelector('.detail-page')||document.createElement('section');if(!page.classList.contains('detail-page')){page.className='page-view detail-page';page.id='detailPage';document.querySelector('main').appendChild(page)}page.innerHTML=`<div class="page-header"><button class="back-btn detail-back">‹</button><h2>${store}</h2><button class="icon-btn">♡</button></div><div class="store-cover"><span>${category}</span><strong>خصم حتى 30٪</strong></div><div class="store-meta"><div><b>★ 4.9</b><small>التقييم</small></div><div><b>25–35 دقيقة</b><small>وقت التوصيل</small></div><div><b>30 ج</b><small>رسوم التوصيل</small></div></div><div class="menu-head"><h3>الأكثر طلبًا</h3></div><div class="menu-list"><article><div>🍔</div><span><b>عرض مزدوج</b><small>عبوة مميزة مع بطاطس ومشروب</small><strong>285 ج</strong></span><button>＋</button></article><article><div>🍟</div><span><b>بطاطس حارة</b><small>بطاطس مقرمشة</small><strong>95 ج</strong></span><button>＋</button></article><article><div>🥤</div><span><b>مشروب غازي</b><small>330 مل</small><strong>45 ج</strong></span><button>＋</button></article></div>`;document.querySelectorAll('.category-page,.hero,.page-view:not(.detail-page)').forEach(p=>{if(p!==ordersPage&&p!==accountPage)p.classList.add('hidden')});ordersPage.classList.add('hidden');accountPage.classList.add('hidden');page.classList.remove('hidden');page.querySelector('.detail-back').addEventListener('click',()=>openCategory(category));page.querySelectorAll('.menu-list button').forEach(b=>b.addEventListener('click',()=>{b.textContent='✓';b.classList.add('added');showToast('تمت الإضافة إلى السلة')}));}

document.querySelectorAll('.heart').forEach(h=>h.addEventListener('click',()=>{h.textContent=h.textContent==='♡'?'♥':'♡';h.classList.toggle('liked')}));

const searchInput=document.getElementById('searchInput');const searchBox=searchInput?.closest('.search-row');if(searchBox){const suggestions=document.createElement('div');suggestions.className='search-suggestions';searchBox.appendChild(suggestions);searchInput.addEventListener('input',()=>{const term=searchInput.value.trim().toLowerCase();if(!term){suggestions.classList.remove('open');suggestions.innerHTML='';return}const catalog=[...Object.values(categoryData).flat(),...Object.keys(categoryData),'كنافة','شاورما','باندا ماركت','خدمة طوارئ'];const matches=catalog.filter(x=>x.toLowerCase().includes(term)).slice(0,7);suggestions.innerHTML=matches.map(x=>`<button><span>⌕</span><b>${x}</b><small>اقتراح بحث</small></button>`).join('')||'<div class="no-results">لا توجد اقتراحات مطابقة</div>';suggestions.classList.add('open');suggestions.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const chosen=b.querySelector('b').textContent;searchInput.value=chosen;suggestions.classList.remove('open');if(categoryData[chosen])openCategory(chosen);}))});document.addEventListener('click',e=>{if(!searchBox.contains(e.target))suggestions.classList.remove('open')})}

function openCustomRequest(){let page=document.querySelector('.custom-page')||document.createElement('section');if(!page.classList.contains('custom-page')){page.className='page-view custom-page';page.id='customPage';document.querySelector('main').appendChild(page)}page.innerHTML=`<div class="page-header"><button class="back-btn custom-back">‹</button><h2>اطلب أي حاجة</h2><button class="icon-btn">•••</button></div><div class="custom-hero"><span>＋</span><div><b>طلب حر</b><small>اطلب منتجًا أو وجبة غير متوفرة في التطبيق</small></div></div><form class="custom-form"><label>ما الذي تريد طلبه؟<textarea required placeholder="مثال: شحنة دواء، وجبة من مطعم، هدية..."></textarea></label><label>مكان الشراء <button type="button" class="location-input">⌖ اختر المتجر أو الموقع</button></label><label>ميزانية مناسبة<input type="number" min="0" placeholder="أدخل المبلغ بالجنيه"></label><label>صورة توضيحية<button type="button" class="upload-input">📷 إرفاق صورة</button></label><div class="custom-note"><span>ℹ</span><p>سيتم تأكيد السعر معك قبل تنفيذ الطلب.</p></div><button class="apply-btn custom-submit" type="submit">إرسال الطلب الحر</button></form>`;homePage.classList.add('hidden');ordersPage.classList.add('hidden');accountPage.classList.add('hidden');document.querySelectorAll('.category-page,.detail-page').forEach(p=>p.classList.add('hidden'));page.classList.remove('hidden');page.querySelector('.custom-back').addEventListener('click',()=>showPage('home'));page.querySelector('.custom-form').addEventListener('submit',e=>{e.preventDefault();showToast('تم إرسال الطلب وسيتم تأكيد السعر');setTimeout(()=>showPage('orders'),900)});page.querySelector('.location-input').addEventListener('click',()=>showToast('اختر موقع الشراء من الخريطة'));
}
document.getElementById('requestBtn')?.addEventListener('click',openCustomRequest);

// Replace language-style voucher action with a dedicated modal
const codeCard=document.querySelector('.code-card'); codeCard?.addEventListener('click',()=>{closeSheets();let modal=document.getElementById('voucherModal');if(!modal){modal=document.createElement('div');modal.id='voucherModal';modal.className='voucher-modal';modal.innerHTML=`<div><button class="voucher-close">×</button><span>🎁</span><h3>قسائم الخصم</h3><label>Got a code?<input id="voucherCode" placeholder="أدخل رمز الخصم"></label><small>Add your code and save</small><button id="applyVoucher">تطبيق الرمز</button></div>`;body.appendChild(modal)}modal.classList.add('open');modal.querySelector('.voucher-close').addEventListener('click',()=>modal.classList.remove('open'));modal.querySelector('#applyVoucher').addEventListener('click',()=>{modal.classList.remove('open');showToast('تم التحقق من رمز الخصم')})});

const accountPages={'معلومات الحساب':'الاسم الأول والاسم الأخير، البريد الإلكتروني، رقم الجوال وتاريخ الميلاد','العناوين المحفوظة':'إضافة وتعديل عناوين التوصيل واستلام الطلبات','الإشعارات':'إدارة إشعارات العروض والطلبات والدعم','المكافآت':'شاهد نقاطك والمكافآت المتاحة','طلباتي':'سجل طلباتك الحالية والسابقة','ادعُ صديقًا':'شاركه كوبونًا واحصلوا على خصومات','قسائم الخصم':'رموز الخصم والقسائم المتاحة','احصل على المساعدة':'الدردشة والمساعدة في الطلبات والمدفوعات','حول التطبيق':'الإصدار 2.4.1 وسياسة الخصوصية والشروط','سجل كشريك':'التقديم كمطعم أو مندوب توصيل'};
document.querySelectorAll('.account-card button,.account-grid button').forEach(b=>b.addEventListener('click',()=>{const title=b.textContent.replace(/\s+/g,' ').trim().split(' ')[0];const key=Object.keys(accountPages).find(k=>b.textContent.includes(k));openDetailPage(key||title)}));
function openDetailPage(title){let page=document.querySelector('.detail-page')||document.createElement('section');if(!page.classList.contains('detail-page')){page.className='page-view detail-page';page.id='detailPage';document.querySelector('main').appendChild(page)}page.innerHTML=`<div class="page-header"><button class="back-btn detail-account-back">‹</button><h2>${title}</h2></div><div class="info-page-card"><h3>${title}</h3><p>${accountPages[title]||'إعدادات الخدمة وإدارة المعلومات المتعلقة بحسابك.'}</p>${title==='معلومات الحساب'?'<form class="info-form"><label>الاسم الأول<input value="أحمد"></label><label>الاسم الأخير<input value="محمد"></label><label>البريد الإلكتروني<input value="ahmed@email.com"></label><label>رقم الجوال<input value="01012345678"></label><button type="button">حفظ التغييرات</button></form>':'<button class="info-action">متابعة</button>'}</div>`;page.classList.remove('hidden');accountPage.classList.add('hidden');homePage.classList.add('hidden');ordersPage.classList.add('hidden');document.querySelectorAll('.category-page,.custom-page').forEach(p=>p.classList.add('hidden'));page.querySelector('.detail-account-back').addEventListener('click',()=>showPage('account'));page.querySelector('.info-action')?.addEventListener('click',()=>showToast('تمت المتابعة بنجاح'));page.querySelector('.info-form button')?.addEventListener('click',()=>showToast('تم حفظ بيانات الحساب'))}

document.querySelector('.logout-btn')?.addEventListener('click',()=>{localStorage.removeItem('waslni-auth');location.reload()});
document.querySelector('.location-pill')?.addEventListener('click',()=>showToast('اختر عنوان التوصيل الجديد'));
const savedProfile=JSON.parse(localStorage.getItem('waslni-profile')||'null');if(savedProfile){const profileName=document.querySelector('.account-head h2');const avatar=document.querySelector('.profile-avatar');if(profileName)profileName.textContent=`${savedProfile.first} ${savedProfile.last}`;if(avatar)avatar.textContent=(savedProfile.first||'م').charAt(0);}
