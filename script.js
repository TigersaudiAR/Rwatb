
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
    
    // تعريف دالة التنقل بين التبويبات
    window.switchTab = function(tabId) {
        const tabContents = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabContents.length; i++) {
            tabContents[i].classList.add('hidden');
        }
        
        const tabButtons = document.querySelectorAll('#tabs button');
        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove('border-primary');
            tabButtons[i].classList.add('border-transparent');
            tabButtons[i].ariaSelected = "false";
        }
        
        document.getElementById(`${tabId}-content`).classList.remove('hidden');
        document.getElementById(`${tabId}-tab`).classList.add('border-primary');
        document.getElementById(`${tabId}-tab`).classList.remove('border-transparent');
        document.getElementById(`${tabId}-tab`).ariaSelected = "true";
    };

    // تعريف دالة تحديث الرتبة والدرجة
    window.updateRankAndDegree = function() {
        const ranksList = ["جندي", "جندي أول", "عريف", "وكيل رقيب", "رقيب", "رقيب أول", "رئيس رقباء", "ملازم"];
        const oldRank = document.getElementById('old-rank').value;
        
        // تحديد الرتبة التالية
        const oldRankIndex = ranksList.indexOf(oldRank);
        if (oldRankIndex >= 0 && oldRankIndex < ranksList.length - 1) {
            document.getElementById('new-rank').value = ranksList[oldRankIndex + 1];
        }
        
        updateSalaryScale();
    };

    // تعريف دالة تحديث الدرجة الحالية بناءً على الدرجة السابقة
    window.updateBasedOnOldDegree = function() {
        const oldDegree = parseInt(document.getElementById('old-degree').value);
        const newDegree = Math.max(1, oldDegree - 1); // الدرجة الحالية هي الدرجة السابقة - 1 (لا تقل عن 1)
        document.getElementById('new-degree').value = newDegree.toString();
        
        // البحث عن الراتب المناسب بناءً على الراتب السابق
        findOptimalDegreeBasedOnSalary();
        
        updateSalaryScale();
    };

    // تعريف دالة البحث عن الدرجة المناسبة للرتبة الجديدة
    window.findOptimalDegreeBasedOnSalary = function() {
        const oldRank = document.getElementById('old-rank').value;
        const newRank = document.getElementById('new-rank').value;
        const oldDegree = document.getElementById('old-degree').value;
        
        // التحقق من وجود العناصر قبل الوصول إليها
        const oldSalaryElement = document.getElementById(`scale-${oldRank}-${oldDegree}`);
        if (!oldSalaryElement) return; // التحقق من وجود العنصر
        
        const oldSalary = Number(oldSalaryElement.value);
        
        // البحث عن أقرب درجة في الرتبة الجديدة بحيث يكون راتبها ليس أقل من الراتب السابق
        let foundDegree = 15; // نبدأ من أعلى درجة
        for (let i = 15; i >= 1; i--) {
            const degreeElement = document.getElementById(`scale-${newRank}-${i}`);
            if (!degreeElement) continue;
            
            const newSalary = Number(degreeElement.value);
            if (newSalary >= oldSalary) {
                foundDegree = i;
            }
        }
        
        // تحديث الدرجة الحالية
        document.getElementById('new-degree').value = foundDegree.toString();
    };

    // تعريف دالة تحديث سلم الرواتب
    window.updateSalaryScale = function() {
        const oldRank = document.getElementById('old-rank').value;
        const newRank = document.getElementById('new-rank').value;
        const oldDegree = document.getElementById('old-degree').value;
        const newDegree = document.getElementById('new-degree').value;
        
        // التحقق من وجود العناصر قبل الوصول إليها
        const oldSalaryElement = document.getElementById(`scale-${oldRank}-${oldDegree}`);
        const newSalaryElement = document.getElementById(`scale-${newRank}-${newDegree}`);
        
        if (!oldSalaryElement || !newSalaryElement) {
            console.error("بعض عناصر سلم الرواتب غير موجودة");
            return;
        }
        
        // جلب البيانات من سلم الرواتب
        const oldSalary = oldSalaryElement.value;
        const newSalary = newSalaryElement.value;
        
        // تحديث قيم الراتب الأساسي
        document.getElementById('old-basic-salary').value = oldSalary;
        document.getElementById('new-basic-salary').value = newSalary;
        
        // حساب العلاوات
        calculateAllowances();
    };

    // تعريف دالة حساب العلاوات
    window.calculateAllowances = function() {
        const oldRank = document.getElementById('old-rank').value;
        const newRank = document.getElementById('new-rank').value;
        const oldBasicSalary = Number(document.getElementById('old-basic-salary').value) || 0;
        const newBasicSalary = Number(document.getElementById('new-basic-salary').value) || 0;
        
        // الحصول على راتب الدرجة الأولى للرتبة السابقة والحالية
        const oldRankFirstDegreeElement = document.getElementById(`scale-${oldRank}-1`);
        const newRankFirstDegreeElement = document.getElementById(`scale-${newRank}-1`);
        
        if (!oldRankFirstDegreeElement || !newRankFirstDegreeElement) {
            console.error("لا يمكن العثور على عناصر راتب الدرجة الأولى");
            return;
        }
        
        const oldRankFirstDegreeSalary = Number(oldRankFirstDegreeElement.value) || 0;
        const newRankFirstDegreeSalary = Number(newRankFirstDegreeElement.value) || 0;
        
        // تحديث بدل مكافحة الإرهاب فقط إذا كان وضع الحساب تلقائيًا
        if (window.allowanceCalculationMode && window.allowanceCalculationMode.terrorism === 'auto') {
            const oldTerrorismValue = parseFloat((oldRankFirstDegreeSalary * 0.25).toFixed(2));
            const newTerrorismValue = parseFloat((newRankFirstDegreeSalary * 0.25).toFixed(2));
            
            const oldTerrorismElement = document.getElementById('old-terrorism');
            const newTerrorismElement = document.getElementById('new-terrorism');
            
            if (oldTerrorismElement && newTerrorismElement) {
                oldTerrorismElement.value = oldTerrorismValue;
                newTerrorismElement.value = newTerrorismValue;
            }
        }
        
        // تحديث علاوة الأمن فقط إذا كان وضع الحساب تلقائيًا
        if (window.allowanceCalculationMode && window.allowanceCalculationMode.security === 'auto') {
            const oldSecurityValue = parseFloat((oldBasicSalary * 0.25).toFixed(2));
            const newSecurityValue = parseFloat((newBasicSalary * 0.25).toFixed(2));
            
            const oldSecurityElement = document.getElementById('old-security');
            const newSecurityElement = document.getElementById('new-security');
            
            if (oldSecurityElement && newSecurityElement) {
                oldSecurityElement.value = oldSecurityValue;
                newSecurityElement.value = newSecurityValue;
            }
        }
        
        // حساب التقاعد (9%) تلقائيًا من الراتب الأساسي - فقط إذا كان وضع الحساب تلقائيًا
        if (window.allowanceCalculationMode && window.allowanceCalculationMode.retirement === 'auto') {
            const oldRetirementValue = parseFloat((oldBasicSalary * 0.09).toFixed(2));
            const newRetirementValue = parseFloat((newBasicSalary * 0.09).toFixed(2));
            
            const oldRetirementElement = document.getElementById('old-retirement');
            const newRetirementElement = document.getElementById('new-retirement');
            
            if (oldRetirementElement && newRetirementElement) {
                oldRetirementElement.value = oldRetirementValue;
                newRetirementElement.value = newRetirementValue;
            }
        }
        
        // تحديث البدلات المخصصة إن وجدت
        if (typeof updateCustomAllowances === 'function') {
            updateCustomAllowances();
        }
    };

    // تعريف دالة لإعادة حساب البدلات
    window.recalculateAllowances = function(type) {
        if (type === 'old') {
            const oldBasicSalary = Number(document.getElementById('old-basic-salary').value) || 0;
            
            // تحديث مبلغ التقاعد تلقائيًا
            if (window.allowanceCalculationMode && window.allowanceCalculationMode.retirement === 'auto') {
                const oldRetirementElement = document.getElementById('old-retirement');
                if (oldRetirementElement) {
                    oldRetirementElement.value = parseFloat((oldBasicSalary * 0.09).toFixed(2));
                }
            }
            
            // تحديث علاوة الأمن (شرطة عسكرية) تلقائيًا
            if (window.allowanceCalculationMode && window.allowanceCalculationMode.security === 'auto') {
                const oldSecurityElement = document.getElementById('old-security');
                if (oldSecurityElement) {
                    oldSecurityElement.value = parseFloat((oldBasicSalary * 0.25).toFixed(2));
                }
            }
            
            // البحث عن الدرجة المقابلة للراتب
            const oldRank = document.getElementById('old-rank').value;
            const oldDegreeElement = document.getElementById('old-degree');
            
            if (oldDegreeElement) {
                for (let i = 1; i <= 15; i++) {
                    const salaryElement = document.getElementById(`scale-${oldRank}-${i}`);
                    if (salaryElement && Number(salaryElement.value) === oldBasicSalary) {
                        oldDegreeElement.value = i.toString();
                        break;
                    }
                }
            }
        } else if (type === 'new') {
            const newBasicSalary = Number(document.getElementById('new-basic-salary').value) || 0;
            
            // تحديث مبلغ التقاعد تلقائيًا
            if (window.allowanceCalculationMode && window.allowanceCalculationMode.retirement === 'auto') {
                const newRetirementElement = document.getElementById('new-retirement');
                if (newRetirementElement) {
                    newRetirementElement.value = parseFloat((newBasicSalary * 0.09).toFixed(2));
                }
            }
            
            // تحديث علاوة الأمن (شرطة عسكرية) تلقائيًا
            if (window.allowanceCalculationMode && window.allowanceCalculationMode.security === 'auto') {
                const newSecurityElement = document.getElementById('new-security');
                if (newSecurityElement) {
                    newSecurityElement.value = parseFloat((newBasicSalary * 0.25).toFixed(2));
                }
            }
            
            // البحث عن الدرجة المقابلة للراتب
            const newRank = document.getElementById('new-rank').value;
            const newDegreeElement = document.getElementById('new-degree');
            
            if (newDegreeElement) {
                for (let i = 1; i <= 15; i++) {
                    const salaryElement = document.getElementById(`scale-${newRank}-${i}`);
                    if (salaryElement && Number(salaryElement.value) === newBasicSalary) {
                        newDegreeElement.value = i.toString();
                        break;
                    }
                }
            }
        }
    };

    // تبديل الحساب التلقائي واليدوي للبدلات
    window.toggleAllowanceCalculation = function(allowanceType) {
        // تأكد من وجود المتغير العام
        if (!window.allowanceCalculationMode) {
            window.allowanceCalculationMode = {
                terrorism: 'manual',
                security: 'manual',
                retirement: 'auto'
            };
        }

        const oldInputId = `old-${allowanceType}`;
        const newInputId = `new-${allowanceType}`;
        const statusId = `${allowanceType}-calc-status`;
        const buttonId = `toggle-${allowanceType}-calc`;
        
        const oldInput = document.getElementById(oldInputId);
        const newInput = document.getElementById(newInputId);
        const statusElement = document.getElementById(statusId);
        const buttonElement = document.getElementById(buttonId);
        
        if (!oldInput || !newInput || !statusElement || !buttonElement) return;
        
        // تبديل الحالة
        if (window.allowanceCalculationMode[allowanceType] === 'auto') {
            window.allowanceCalculationMode[allowanceType] = 'manual';
            statusElement.textContent = 'يدوي';
            buttonElement.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
            buttonElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900', 'text-yellow-700', 'dark:text-yellow-300');
            
            // تحديث الإعدادات
            if (window.appSettings && window.appSettings.calculation) {
                window.appSettings.calculation[`auto${allowanceType.charAt(0).toUpperCase() + allowanceType.slice(1)}`] = false;
            }
        } else {
            window.allowanceCalculationMode[allowanceType] = 'auto';
            statusElement.textContent = 'تلقائي';
            buttonElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900', 'text-yellow-700', 'dark:text-yellow-300');
            buttonElement.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
            
            // تحديث الإعدادات
            if (window.appSettings && window.appSettings.calculation) {
                window.appSettings.calculation[`auto${allowanceType.charAt(0).toUpperCase() + allowanceType.slice(1)}`] = true;
            }
            
            // إعادة حساب البدل تلقائيًا
            calculateAllowances();
        }
        
        // حفظ الإعدادات بعد التعديل
        if (typeof saveSettings === 'function') {
            saveSettings();
        }
    };

    // تفعيل باقي الدوال
    if (typeof updateOldRankFromNewRank === 'function') {
        // مستمع تغيير الرتبة الحالية
        document.getElementById('new-rank').addEventListener('change', function() {
            // إذا تغيرت الرتبة الحالية، قم بتحديث الرتبة السابقة بناءً على الترتيب
            updateOldRankFromNewRank();
        });
    }
    
    if (typeof updateOldDegreeFromNewDegree === 'function') {
        // مستمع تغيير الدرجة الحالية
        document.getElementById('new-degree').addEventListener('change', function() {
            // إذا تغيرت الدرجة الحالية، قم بتحديث الدرجة السابقة
            updateOldDegreeFromNewDegree();
        });
    }
    
    if (typeof findRankAndDegreeByBasicSalary === 'function') {
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
    }
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
        if (typeof updateSalaryScale === 'function') {
            updateSalaryScale();
        }
    }
}

// تحديث الدرجة السابقة بناءً على الدرجة الحالية
function updateOldDegreeFromNewDegree() {
    const newDegree = parseInt(document.getElementById('new-degree').value);
    
    // الدرجة السابقة هي الدرجة الحالية + 1 (لا تتجاوز 15)
    const oldDegree = Math.min(newDegree + 1, 15);
    document.getElementById('old-degree').value = oldDegree.toString();
    
    // تحديث الرواتب بناءً على الرتبة والدرجة الجديدة
    if (typeof updateSalaryScale === 'function') {
        updateSalaryScale();
    }
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
            if (typeof calculateAllowances === 'function') {
                calculateAllowances();
            }
        } else {
            // في حالة "قديم"، حدّث الراتب الأساسي بالقيمة الدقيقة من سلم الرواتب
            const exactSalaryElement = document.getElementById(`scale-${closestRank}-${closestDegree}`);
            if (exactSalaryElement) {
                basicSalaryElement.value = exactSalaryElement.value;
            }
            
            // حساب العلاوات والحسميات تلقائيًا
            if (typeof calculateAllowances === 'function') {
                calculateAllowances();
            }
        }
    }
}

// إضافة متغير عام لتخزين وضع الحساب التلقائي واليدوي للبدلات
if (typeof window.allowanceCalculationMode === 'undefined') {
    window.allowanceCalculationMode = {
        terrorism: 'manual',
        security: 'manual',
        retirement: 'auto'
    };
}
