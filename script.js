// تهيئة المتغيرات والوظائف العامة للنظام
document.addEventListener('DOMContentLoaded', function() {
    // التأكد من أن دالة التنقل بين جداول سلم الرواتب موجودة
    window.showSalaryRangeTable = function(start, end) {
        // إخفاء جميع الجداول أولاً
        document.getElementById('salary-table-1-5').classList.add('hidden');
        document.getElementById('salary-table-6-10').classList.add('hidden');
        document.getElementById('salary-table-11-15').classList.add('hidden');
        
        // إظهار الجدول المطلوب فقط
        document.getElementById(`salary-table-${start}-${end}`).classList.remove('hidden');
    };
    
    // إضافة مستمعي الأحداث للحقول لتفعيل الاحتساب التلقائي
    
    // مستمع تغيير الرتبة الحالية
    document.getElementById('new-rank').addEventListener('change', function() {
        // إذا تغيرت الرتبة الحالية، قم بتحديث الرتبة السابقة بناءً على الترتيب
        updateOldRankFromNewRank();
    });
    
    // مستمع تغيير الدرجة الحالية
    document.getElementById('new-degree').addEventListener('change', function() {
        // إذا تغيرت الدرجة الحالية، قم بتحديث الدرجة السابقة
        updateOldDegreeFromNewDegree();
    });
    
    // مستمع تغيير الراتب الأساسي الحالي
    document.getElementById('new-basic-salary').addEventListener('change', function() {
        // عند تغيير الراتب الأساسي الحالي، ابحث عن الرتبة والدرجة المطابقة
        findRankAndDegreeByBasicSalary('new');
    });
    
    // مستمع تغيير الراتب الأساسي السابق
    document.getElementById('old-basic-salary').addEventListener('change', function() {
        // عند تغيير الراتب الأساسي السابق، ابحث عن الرتبة والدرجة المطابقة
        findRankAndDegreeByBasicSalary('old');
    });
    
    // مستمع تغيير علاوة الأمن الحالية
    document.getElementById('new-security').addEventListener('change', function() {
        // إذا كان وضع الحساب يدوي، قم بحساب الراتب الأساسي الحالي من علاوة الأمن
        if (allowanceCalculationMode.security === 'manual') {
            const securityValue = parseFloat(this.value);
            if (!isNaN(securityValue) && securityValue > 0) {
                // علاوة الأمن تمثل 25% من الراتب الأساسي
                const basicSalary = securityValue * 4; // الراتب الأساسي = علاوة الأمن ÷ 0.25
                document.getElementById('new-basic-salary').value = basicSalary.toFixed(2);
                // ابحث عن الرتبة والدرجة بناء على الراتب الأساسي
                findRankAndDegreeByBasicSalary('new');
            }
        }
    });
    
    // مستمع تغيير علاوة الأمن السابقة
    document.getElementById('old-security').addEventListener('change', function() {
        // إذا كان وضع الحساب يدوي، قم بحساب الراتب الأساسي السابق من علاوة الأمن
        if (allowanceCalculationMode.security === 'manual') {
            const securityValue = parseFloat(this.value);
            if (!isNaN(securityValue) && securityValue > 0) {
                // علاوة الأمن تمثل 25% من الراتب الأساسي
                const basicSalary = securityValue * 4; // الراتب الأساسي = علاوة الأمن ÷ 0.25
                document.getElementById('old-basic-salary').value = basicSalary.toFixed(2);
                // ابحث عن الرتبة والدرجة بناء على الراتب الأساسي
                findRankAndDegreeByBasicSalary('old');
            }
        }
    });
    
    // مستمع تغيير حسم التقاعد الحالي
    document.getElementById('new-retirement').addEventListener('change', function() {
        // إذا كان وضع الحساب يدوي، قم بحساب الراتب الأساسي الحالي من حسم التقاعد
        if (allowanceCalculationMode.retirement === 'manual') {
            const retirementValue = parseFloat(this.value);
            if (!isNaN(retirementValue) && retirementValue > 0) {
                // حسم التقاعد يمثل 9% من الراتب الأساسي
                const basicSalary = retirementValue / 0.09; // الراتب الأساسي = حسم التقاعد ÷ 0.09
                document.getElementById('new-basic-salary').value = basicSalary.toFixed(2);
                // ابحث عن الرتبة والدرجة بناء على الراتب الأساسي
                findRankAndDegreeByBasicSalary('new');
            }
        }
    });
    
    // مستمع تغيير حسم التقاعد السابق
    document.getElementById('old-retirement').addEventListener('change', function() {
        // إذا كان وضع الحساب يدوي، قم بحساب الراتب الأساسي السابق من حسم التقاعد
        if (allowanceCalculationMode.retirement === 'manual') {
            const retirementValue = parseFloat(this.value);
            if (!isNaN(retirementValue) && retirementValue > 0) {
                // حسم التقاعد يمثل 9% من الراتب الأساسي
                const basicSalary = retirementValue / 0.09; // الراتب الأساسي = حسم التقاعد ÷ 0.09
                document.getElementById('old-basic-salary').value = basicSalary.toFixed(2);
                // ابحث عن الرتبة والدرجة بناء على الراتب الأساسي
                findRankAndDegreeByBasicSalary('old');
            }
        }
    });
});

// تحديث الرتبة السابقة بناءً على الرتبة الحالية
function updateOldRankFromNewRank() {
    const ranksList = ["جندي", "جندي أول", "عريف", "وكيل رقيب", "رقيب", "رقيب أول", "رئيس رقباء", "ملازم"];
    const newRank = document.getElementById('new-rank').value;
    
    // البحث عن الرتبة الحالية في قائمة الرتب
    const newRankIndex = ranksList.indexOf(newRank);
    
    // إذا كانت الرتبة موجودة وليست أول رتبة
    if (newRankIndex > 0) {
        // تعيين الرتبة السابقة كالرتبة التي تسبق الرتبة الحالية
        document.getElementById('old-rank').value = ranksList[newRankIndex - 1];
        
        // تحديث الرواتب بناءً على الرتبة والدرجة الجديدة
        updateSalaryScale();
    }
}

// تحديث الدرجة السابقة بناءً على الدرجة الحالية
function updateOldDegreeFromNewDegree() {
    const newDegree = parseInt(document.getElementById('new-degree').value);
    
    // الدرجة السابقة هي الدرجة الحالية + 1 (لا تتجاوز 15)
    const oldDegree = Math.min(newDegree + 1, 15);
    document.getElementById('old-degree').value = oldDegree.toString();
    
    // تحديث الرواتب بناءً على الرتبة والدرجة الجديدة
    updateSalaryScale();
}

// البحث عن الرتبة والدرجة المناسبة بناءً على الراتب الأساسي
function findRankAndDegreeByBasicSalary(type) {
    // الحصول على الراتب الأساسي
    const basicSalaryElement = document.getElementById(`${type}-basic-salary`);
    if (!basicSalaryElement) return;
    
    const basicSalary = parseFloat(basicSalaryElement.value);
    if (isNaN(basicSalary) || basicSalary <= 0) return;
    
    // قائمة الرتب
    const ranksList = ["جندي", "جندي أول", "عريف", "وكيل رقيب", "رقيب", "رقيب أول", "رئيس رقباء", "ملازم"];
    
    // متغيرات لتخزين أقرب رتبة ودرجة
    let closestRank = "";
    let closestDegree = 1;
    let smallestDifference = Number.MAX_VALUE;
    
    // البحث في جميع الرتب والدرجات
    for (const rank of ranksList) {
        for (let degree = 1; degree <= 15; degree++) {
            const salaryElement = document.getElementById(`scale-${rank}-${degree}`);
            if (salaryElement) {
                const salary = parseFloat(salaryElement.value);
                if (!isNaN(salary)) {
                    // حساب الفرق بين الراتب المدخل والراتب في سلم الرواتب
                    const difference = Math.abs(salary - basicSalary);
                    
                    // إذا كان الفرق أقل من أصغر فرق تم العثور عليه حتى الآن
                    if (difference < smallestDifference) {
                        smallestDifference = difference;
                        closestRank = rank;
                        closestDegree = degree;
                        
                        // إذا كان الراتب مطابقًا تمامًا، توقف عن البحث
                        if (difference === 0) break;
                    }
                }
            }
        }
    }
    
    // إذا تم العثور على أقرب رتبة ودرجة
    if (closestRank && closestDegree) {
        // تعيين الرتبة والدرجة
        document.getElementById(`${type}-rank`).value = closestRank;
        document.getElementById(`${type}-degree`).value = closestDegree;
        
        // تحديث باقي الحقول
        if (type === 'new') {
            // في حالة "جديد"، حدّث الراتب الأساسي بالقيمة الدقيقة من سلم الرواتب
            const exactSalaryElement = document.getElementById(`scale-${closestRank}-${closestDegree}`);
            if (exactSalaryElement) {
                basicSalaryElement.value = exactSalaryElement.value;
            }
            
            // حساب العلاوات والحسميات تلقائيًا
            calculateAllowances();
        } else {
            // في حالة "قديم"، حدّث الراتب الأساسي بالقيمة الدقيقة من سلم الرواتب
            const exactSalaryElement = document.getElementById(`scale-${closestRank}-${closestDegree}`);
            if (exactSalaryElement) {
                basicSalaryElement.value = exactSalaryElement.value;
            }
            
            // حساب العلاوات والحسميات تلقائيًا
            calculateAllowances();
        }
    }
}