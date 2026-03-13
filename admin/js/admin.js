// ==============================================
// إعدادات Firebase - OdoNex Admin API
// ==============================================

const firebaseConfig = {
    apiKey: "AIzaSyCbaHb-x48AUNFnwifNgqcqjmSujcXpmZ0",
    authDomain: "odunex-project.firebaseapp.com",
    projectId: "odunex-project",
    storageBucket: "odunex-project.firebasestorage.app",
    messagingSenderId: "20189086682",
    appId: "1:20189086682:web:76574c7befec70c24df6e3",
    measurementId: "G-RREEW2EY4K"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// ==============================================
// تصدير الكائنات للاستخدام العام
// ==============================================
window.db = db;
window.auth = auth;
window.storage = storage;

// ==============================================
// دوال حفظ واسترجاع البيانات
// ==============================================

window.savePageData = async function(section, data) {
    try {
        await db.collection('pages').doc(section).set({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: auth.currentUser?.email || 'system'
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error saving page:', error);
        return false;
    }
};

window.loadPageContent = async function(section) {
    try {
        const doc = await db.collection('pages').doc(section).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error('Error loading page:', error);
        return null;
    }
};

window.saveSectionData = async function(section, items) {
    try {
        await db.collection('sections').doc(section).set({
            items: items,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: auth.currentUser?.email || 'system'
        }, { merge: true });
        return true;
    } catch (error) {
        console.error('Error saving section:', error);
        return false;
    }
};

window.loadSectionItems = async function(section) {
    try {
        const doc = await db.collection('sections').doc(section).get();
        return doc.exists ? doc.data().items || [] : [];
    } catch (error) {
        console.error('Error loading section items:', error);
        return [];
    }
};

window.getDashboardStats = async function() {
    try {
        const [pagesSnapshot, messagesSnapshot] = await Promise.all([
            db.collection('pages').get(),
            db.collection('messages').where('read', '==', false).get()
        ]);

        const pages = pagesSnapshot.docs.map(doc => doc.id);
        const arabicPages = pages.filter(p => p.startsWith('ar-')).length;
        const englishPages = pages.filter(p => p.startsWith('en-')).length;

        return {
            totalPages: pages.length,
            arabicPages: arabicPages,
            englishPages: englishPages,
            newMessages: messagesSnapshot.size
        };
    } catch (error) {
        console.error('Error getting stats:', error);
        return {
            totalPages: 10,
            arabicPages: 5,
            englishPages: 5,
            newMessages: 0
        };
    }
};

window.uploadImage = async function(file, folder = 'general') {
    try {
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${folder}/${fileName}`);
        await imageRef.put(file);
        const url = await imageRef.getDownloadURL();
        return url;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};

window.logoutUser = async function() {
    try {
        await auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
};
