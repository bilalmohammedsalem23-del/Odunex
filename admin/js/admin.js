
// ==============================================
// إعدادات Firebase - OdoNex Admin API
// ==============================================

// إعدادات Firebase (من مشروعك)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "odunex-project.firebaseapp.com",
    projectId: "odunex-project",
    storageBucket: "odunex-project.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// ==============================================
// التحقق من تسجيل الدخول
// ==============================================
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        // تحميل بيانات المستخدم
        document.getElementById('adminName').textContent = user.email || 'مدير النظام';
        
        // تحميل البيانات حسب القسم الحالي
        const currentSection = sessionStorage.getItem('currentSection') || 'dashboard';
        loadSectionData(currentSection);
    }
});

// ==============================================
// دوال حفظ واسترجاع البيانات
// ==============================================

// حفظ محتوى الصفحة
window.savePageContent = async function(section, data) {
    try {
        document.getElementById('loadingBar').style.display = 'block';
        
        await db.collection('pages').doc(section).set({
            content: data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: auth.currentUser?.email || 'system'
        }, { merge: true });
        
        showToast('success', 'تم حفظ التغييرات بنجاح');
        return true;
    } catch (error) {
        showToast('error', 'حدث خطأ في حفظ البيانات');
        console.error(error);
        return false;
    } finally {
        document.getElementById('loadingBar').style.display = 'none';
    }
};

// استرجاع محتوى الصفحة
window.loadPageContent = async function(section) {
    try {
        const doc = await db.collection('pages').doc(section).get();
        if (doc.exists) {
            return doc.data().content;
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// ==============================================
// تحميل بيانات القسم
// ==============================================
async function loadSectionData(section) {
    if (section === 'dashboard') return;
    
    const data = await loadPageContent(section);
    if (data) {
        // تعبئة النماذج بالبيانات المحفوظة
        fillFormWithData(section, data);
    }
}

// تعبئة النماذج بالبيانات
function fillFormWithData(section, data) {
    // هذا يعتمد على هيكل كل صفحة
    console.log('Loading data for:', section, data);
}

// ==============================================
// إدارة الصور
// ==============================================
window.uploadImage = async function(file, path = 'general') {
    try {
        document.getElementById('loadingBar').style.display = 'block';
        
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${path}/${file.name}`);
        await imageRef.put(file);
        
        const url = await imageRef.getDownloadURL();
        showToast('success', 'تم رفع الصورة بنجاح');
        return url;
    } catch (error) {
        showToast('error', 'فشل رفع الصورة');
        console.error(error);
        return null;
    } finally {
        document.getElementById('loadingBar').style.display = 'none';
    }
};

// ==============================================
// إدارة الرسائل
// ==============================================
window.loadMessages = async function() {
    try {
        const snapshot = await db.collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(50)
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error(error);
        return [];
    }
};

// ==============================================
// تحديث دالة showSection
// ==============================================
const originalShowSection = window.showSection;
window.showSection = function(section) {
    // حفظ القسم الحالي
    sessionStorage.setItem('currentSection', section);
    
    // استدعاء الدالة الأصلية
    if (originalShowSection) {
        originalShowSection(section);
    }
    
    // تحميل البيانات للقسم
    setTimeout(() => {
        loadSectionData(section);
    }, 500);
};

// ==============================================
// تحديث دوال الحفظ
// ==============================================
window.savePage = async function() {
    const section = sessionStorage.getItem('currentSection');
    if (!section) return;
    
    // جمع البيانات من النموذج
    const formData = collectFormData();
    
    const success = await savePageContent(section, formData);
    if (success) {
        // تحديث المعاينة إذا لزم الأمر
    }
};

window.saveSection = window.savePage;

window.saveItem = async function() {
    // حفظ عنصر فردي (للإضافات الجديدة)
    const section = sessionStorage.getItem('currentSection');
    const itemData = collectItemData();
    
    // إضافة إلى مصفوفة العناصر في Firestore
    const doc = await db.collection('sections').doc(section).get();
    const items = doc.exists ? doc.data().items || [] : [];
    items.push(itemData);
    
    await db.collection('sections').doc(section).set({ items }, { merge: true });
    showToast('success', 'تمت الإضافة بنجاح');
    closeModal();
};

// ==============================================
// دوال المساعدة
// ==============================================
function collectFormData() {
    // جمع بيانات النموذج - حسب احتياجك
    const data = {};
    
    document.querySelectorAll('[data-field]').forEach(el => {
        data[el.dataset.field] = el.value;
    });
    
    return data;
}

function collectItemData() {
    // جمع بيانات عنصر من النافذة المنبثقة
    const data = {};
    
    document.querySelectorAll('#modalContent [data-field]').forEach(el => {
        data[el.dataset.field] = el.value;
    });
    
    return data;
}

// ==============================================
// تصدير الدوال للاستخدام العام
// ==============================================
window.db = db;
window.auth = auth;
window.storage = storage;
