const body = document.body;

const splash = document.createElement('div');
splash.className = 'splash';
splash.innerHTML = `<div class="splash-mark"><div class="splash-leaf">◆</div><strong>وصلني</strong><small>طلبك أقرب مما تتخيل</small></div>`;
body.appendChild(splash);

setTimeout(() => {
  splash.classList.add('exit');
  setTimeout(() => {
    splash.remove();
    showAuth();
  }, 500);
}, 2000);

function showAuth() {
  if (localStorage.getItem('waslni-auth') === 'true') return;
  const auth = document.createElement('div');
  auth.className = 'auth-screen';
  auth.innerHTML = `<div class="auth-logo">◆</div><h1>مرحبًا بك في وصلني</h1><p>سجّل دخولك وابدأ طلبك القادم</p><form class="auth-form"><label>رقم الجوال أو البريد الإلكتروني<input id="authInput" type="text" placeholder="05xxxxxxxx أو name@email.com"></label><label>كلمة المرور<input type="password" placeholder="••••••••"></label><button class="auth-submit" type="submit">تسجيل الدخول</button></form><div class="auth-divider"><span>أو المتابعة عبر</span></div><button class="social-btn">G&nbsp;&nbsp; المتابعة بحساب Google</button><div class="auth-footer">ليس لديك حساب؟ <button id="signupBtn">إنشاء حساب</button></div>`;
  body.appendChild(auth);
  auth.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    localStorage.setItem('waslni-auth', 'true');
    auth.classList.add('exit'); setTimeout(() => auth.remove(), 350);
  });
  document.getElementById('signupBtn')?.addEventListener('click', () => showToast('سنبدأ خطوات إنشاء حسابك'));
}

const navItems = document.querySelectorAll('.nav-item');
const homePage = document.querySelector('.hero');
const ordersPage = document.getElementById('ordersPage');
const accountPage = document.getElementById('accountPage');

function showPage(page) {
  homePage.classList.toggle('hidden', page !== 'home');
  ordersPage.classList.toggle('hidden', page !== 'orders');
  accountPage.classList.toggle('hidden', page !== 'account');
  navItems.forEach(item => item.classList.toggle('active', item.dataset.page === page));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => item.addEventListener('click', () => showPage(item.dataset.page)));
document.querySelectorAll('[data-back]').forEach(btn => btn.addEventListener('click', () => showPage('home')));

const backdrop = document.getElementById('sheetBackdrop');
const filterSheet = document.getElementById('filterSheet');
const languageSheet = document.getElementById('languageSheet');
function openSheet(sheet) { backdrop.classList.add('open'); sheet.classList.add('open'); }
function closeSheets() { backdrop.classList.remove('open'); document.querySelectorAll('.bottom-sheet').forEach(s => s.classList.remove('open')); }
document.getElementById('filterBtn').addEventListener('click', () => openSheet(filterSheet));
document.getElementById('languageBtn').addEventListener('click', () => openSheet(languageSheet));
backdrop.addEventListener('click', closeSheets);
document.querySelectorAll('.sheet-close,.apply-btn').forEach(btn => btn.addEventListener('click', closeSheets));

document.querySelectorAll('.price-options button,.rating-options button,.language-list button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.parentElement.classList.contains('language-list')) {
      btn.parentElement.querySelectorAll('button').forEach(b => { b.classList.remove('active'); b.querySelector('i').textContent = ''; });
      btn.classList.add('active'); btn.querySelector('i').textContent = '✓';
      setTimeout(closeSheets, 250);
    } else {
      btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active')); btn.classList.add('active');
    }
  });
});

const categories = document.querySelectorAll('.category');
categories.forEach(category => category.addEventListener('click', () => {
  categories.forEach(c => c.classList.remove('active')); category.classList.add('active');
}));

document.querySelectorAll('.heart').forEach(heart => heart.addEventListener('click', () => {
  heart.textContent = heart.textContent === '♡' ? '♥' : '♡';
  heart.classList.toggle('liked');
}));

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const term = searchInput.value.trim();
  document.querySelectorAll('.restaurant-card').forEach(card => {
    card.style.display = card.dataset.name.includes(term) ? 'block' : 'none';
  });
});

const toast = document.getElementById('toast');
function showToast(text) { toast.textContent = text; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
document.getElementById('requestBtn').addEventListener('click', () => showToast('يمكنك الآن كتابة طلبك الحر'));
document.querySelector('.code-card').addEventListener('click', () => showToast('أدخل رمز الخصم الخاص بك'));
document.querySelectorAll('.past-orders button').forEach(btn => btn.addEventListener('click', () => showToast('تمت إضافة الطلب للسلة')));

document.querySelector('.promo-copy button').addEventListener('click', () => showToast('تم تطبيق خصم العرض الأول'));
document.querySelector('.location-pill').addEventListener('click', () => showToast('اختر عنوان التوصيل'));
