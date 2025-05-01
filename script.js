// تهيئة المتغيرات
document.addEventListener('DOMContentLoaded', function() {
    // التأكد من أن هذه الدالة موجودة للتنقل بين جداول سلم الرواتب
    if (typeof window.showSalaryRangeTable === 'undefined') {
        window.showSalaryRangeTable = function(start, end) {
            // إخفاء جميع الجداول أولاً
            document.getElementById('salary-table-1-5').classList.add('hidden');
            document.getElementById('salary-table-6-10').classList.add('hidden');
            document.getElementById('salary-table-11-15').classList.add('hidden');
            
            // إظهار الجدول المطلوب فقط
            document.getElementById(`salary-table-${start}-${end}`).classList.remove('hidden');
        };
    }
});