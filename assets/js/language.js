// language.js - ملف التحويل بين اللغات

// دالة التحويل بين اللغات
function switchLanguage(lang) {
    // تحديد الصفحة الحالية
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    let newPage = '';
    
    // إذا كانت الصفحة الحالية هي العربية
    if (currentPage === 'index.html' || currentPage === '') {
        newPage = lang === 'en' ? 'index-en.html' : 'index.html';
    }
    // إذا كانت الصفحة الحالية هي الإنجليزية
    else if (currentPage === 'index-en.html') {
        newPage = lang === 'ar' ? 'index.html' : 'index-en.html';
    }
    // إذا كانت صفحة features
    else if (currentPage === 'features.html') {
        newPage = lang === 'en' ? 'features-en.html' : 'features.html';
    }
    else if (currentPage === 'features-en.html') {
        newPage = lang === 'ar' ? 'features.html' : 'features-en.html';
    }
    // إذا كانت صفحة pricing
    else if (currentPage === 'pricing.html') {
        newPage = lang === 'en' ? 'pricing-en.html' : 'pricing.html';
    }
    else if (currentPage === 'pricing-en.html') {
        newPage = lang === 'ar' ? 'pricing.html' : 'pricing-en.html';
    }
    // إذا كانت صفحة gallery
    else if (currentPage === 'gallery.html') {
        newPage = lang === 'en' ? 'gallery-en.html' : 'gallery.html';
    }
    else if (currentPage === 'gallery-en.html') {
        newPage = lang === 'ar' ? 'gallery.html' : 'gallery-en.html';
    }
    // إذا كانت صفحة contact
    else if (currentPage === 'contact.html') {
        newPage = lang === 'en' ? 'contact-en.html' : 'contact.html';
    }
    else if (currentPage === 'contact-en.html') {
        newPage = lang === 'ar' ? 'contact.html' : 'contact-en.html';
    }
    // إذا كانت الصفحة غير معروفة
    else {
        newPage = lang === 'en' ? 'index-en.html' : 'index.html';
    }
    
    // التوجيه إلى الصفحة الجديدة
    window.location.href = newPage;
}

// تحديد اللغة الحالية
function getCurrentLanguage() {
    let path = window.location.pathname;
    if (path.includes('-en.html')) {
        return 'en';
    } else {
        return 'ar';
    }
}

// تحديث أزرار اللغة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    let currentLang = getCurrentLanguage();
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // تحديث أزرار اللغة
    document.querySelectorAll('.lang-btn, .lang-text').forEach(btn => {
        if (btn.classList.contains('lang-text')) {
            // هذا للنسخة الإنجليزية
            if (currentLang === 'ar') {
                btn.textContent = 'EN';
            } else {
                btn.textContent = 'عربي';
            }
        } else {
            // للأزرار العادية
            if (btn.dataset.lang === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });
    
    // تحديث الرابط النشط في القائمة
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        let href = link.getAttribute('href');
        
        if (currentLang === 'ar') {
            if (currentPage === href) {
                link.classList.add('active');
            }
        } else {
            let enHref = href.replace('.html', '-en.html');
            if (currentPage === enHref) {
                link.classList.add('active');
            }
        }
    });
    
    // تعيين اتجاه الصفحة
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
});
