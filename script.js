// تهيئة المتغيرات والوظائف العامة للنظام
// Switch tab functionality 
function switchTab(tabId) {
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
}

// Rank and degree calculations
function updateRankAndDegree() {
  const ranksList = ["جندي", "جندي أول", "عريف", "وكيل رقيب", "رقيب", "رقيب أول", "رئيس رقباء", "ملازم"];
  const oldRank = document.getElementById('old-rank').value;

  const oldRankIndex = ranksList.indexOf(oldRank);
  if (oldRankIndex >= 0 && oldRankIndex < ranksList.length - 1) {
    document.getElementById('new-rank').value = ranksList[oldRankIndex + 1];
  }

  updateSalaryScale();
}

function updateSalaryScale() {
  const oldRank = document.getElementById('old-rank').value;
  const newRank = document.getElementById('new-rank').value;
  const oldDegree = document.getElementById('old-degree').value;
  const newDegree = document.getElementById('new-degree').value;

  const oldSalaryElement = document.getElementById(`scale-${oldRank}-${oldDegree}`);
  const newSalaryElement = document.getElementById(`scale-${newRank}-${newDegree}`);

  if (!oldSalaryElement || !newSalaryElement) return;

  document.getElementById('old-basic-salary').value = oldSalaryElement.value;
  document.getElementById('new-basic-salary').value = newSalaryElement.value;

  calculateAllowances();
}

function updateBasedOnOldDegree() {
  const oldDegree = parseInt(document.getElementById('old-degree').value);
  const newDegree = Math.max(1, oldDegree - 1);
  document.getElementById('new-degree').value = newDegree.toString();

  updateSalaryScale();
}

// Modal functionality
function showAddAllowanceModal() {
  const modal = document.getElementById('add-allowance-modal');
  if (modal) modal.classList.remove('hidden');
}

// Allowance calculations
function toggleAllowanceCalculation(allowanceType) {
  const statusElement = document.getElementById(`${allowanceType}-calc-status`);
  const buttonElement = document.getElementById(`toggle-${allowanceType}-calc`);

  if (!statusElement || !buttonElement) return;

  const isAuto = statusElement.textContent === 'يدوي';
  statusElement.textContent = isAuto ? 'تلقائي' : 'يدوي';

  if (isAuto) {
    buttonElement.classList.remove('bg-yellow-100', 'text-yellow-700');
    buttonElement.classList.add('bg-blue-100', 'text-blue-700');
  } else {
    buttonElement.classList.remove('bg-blue-100', 'text-blue-700');
    buttonElement.classList.add('bg-yellow-100', 'text-yellow-700');
  }

  calculateAllowances();
}

function calculateAllowances() {
  // Basic salary calculations
  const oldBasicSalary = Number(document.getElementById('old-basic-salary').value) || 0;
  const newBasicSalary = Number(document.getElementById('new-basic-salary').value) || 0;

  // Calculate terrorism allowance
  if (window.allowanceCalculationMode.terrorism === 'auto') {
    const oldTerrorism = oldBasicSalary * 0.25;
    const newTerrorism = newBasicSalary * 0.25;
    document.getElementById('old-terrorism').value = oldTerrorism.toFixed(2);
    document.getElementById('new-terrorism').value = newTerrorism.toFixed(2);
  }

  // Calculate security allowance
  if (window.allowanceCalculationMode.security === 'auto') {
    const oldSecurity = oldBasicSalary * 0.25;
    const newSecurity = newBasicSalary * 0.25;
    document.getElementById('old-security').value = oldSecurity.toFixed(2);
    document.getElementById('new-security').value = newSecurity.toFixed(2);
  }

  // Calculate retirement
  if (window.allowanceCalculationMode.retirement === 'auto') {
    const oldRetirement = oldBasicSalary * 0.09;
    const newRetirement = newBasicSalary * 0.09;
    document.getElementById('old-retirement').value = oldRetirement.toFixed(2);
    document.getElementById('new-retirement').value = newRetirement.toFixed(2);
  }
}

document.addEventListener('DOMContentLoaded', function() {
    // تعريف دالة التنقل بين جداول سلم الرواتب
    window.showSalaryRangeTable = function(start, end) {
        // إخفاء جميع الجداول أولاً
        document.getElementById('salary-table-1-5').classList.add('hidden');
        document.getElementById('salary-table-6-10').classList.add('hidden');
        document.getElementById('salary-table-11-15').classList.add('hidden');
        
        // إظهار الجدول المطلوب فقط
        document.getElementById(`salary-table-${start}-${end}`).classList.remove('hidden');
    };
    
    // تعريف دالة تحديث الرتبة والدرجة
    window.updateRankAndDegree = updateRankAndDegree;

    // تعريف دالة تحديث الدرجة الحالية بناءً على الدرجة السابقة
    window.updateBasedOnOldDegree = updateBasedOnOldDegree;

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
    window.updateSalaryScale = updateSalaryScale;
    
    // تعريف دالة حساب العلاوات
    window.calculateAllowances = calculateAllowances;
    
    // تبديل الحساب التلقائي واليدوي للبدلات
    window.toggleAllowanceCalculation = toggleAllowanceCalculation;
    
    // تعريف دالة لإعادة حساب البدلات
    window.recalculateAllowances = function(type) {
        const basicSalary = Number(document.getElementById(`${type}-basic-salary`).value) || 0;
        
        if (window.allowanceCalculationMode.retirement === 'auto') {
            document.getElementById(`${type}-retirement`).value = (basicSalary * 0.09).toFixed(2);
        }
        
        if (window.allowanceCalculationMode.security === 'auto') {
            document.getElementById(`${type}-security`).value = (basicSalary * 0.25).toFixed(2);
        }
    };
    
    // إضافة دوال إضافية للنافذة العالمية
    window.updateOldRankFromNewRank = function() {
        const ranksList = ["جندي", "جندي أول", "عريف", "وكيل رقيب", "رقيب", "رقيب أول", "رئيس رقباء", "ملازم"];
        const newRank = document.getElementById('new-rank').value;
        
        // البحث عن الرتبة الحالية في قائمة الرتب
        const newRankIndex = ranksList.indexOf(newRank);
        
        // إذا كانت الرتبة موجودة وليست أول رتبة
        if (newRankIndex > 0) {
            // تعيين الرتبة السابقة كالرتبة التي تسبق الرتبة الحالية
            document.getElementById('old-rank').value = ranksList[newRankIndex - 1];
            
            // تحديث الرواتب بناءً على الرتبة والدرجة الجديدة
            window.updateSalaryScale();
        }
    };
    
    window.updateOldDegreeFromNewDegree = function() {
        const newDegree = parseInt(document.getElementById('new-degree').value);
        
        // الدرجة السابقة هي الدرجة الحالية + 1 (لا تتجاوز 15)
        const oldDegree = Math.min(newDegree + 1, 15);
        document.getElementById('old-degree').value = oldDegree.toString();
        
        // تحديث الرواتب بناءً على الرتبة والدرجة الجديدة
        window.updateSalaryScale();
    };
    
    window.findRankAndDegreeByBasicSalary = function(type) {
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
                window.calculateAllowances();
            } else {
                // في حالة "قديم"، حدّث الراتب الأساسي بالقيمة الدقيقة من سلم الرواتب
                const exactSalaryElement = document.getElementById(`scale-${closestRank}-${closestDegree}`);
                if (exactSalaryElement) {
                    basicSalaryElement.value = exactSalaryElement.value;
                }
                
                // حساب العلاوات والحسميات تلقائيًا
                window.calculateAllowances();
            }
        }
    };
    
    // إضافة متغير عام لتخزين وضع الحساب التلقائي واليدوي للبدلات
    window.allowanceCalculationMode = {
        terrorism: 'manual',
        security: 'manual',
        retirement: 'auto'
    };
    
    // دوال إضافية
    window.updateCustomAllowances = function() {
        // التحقق من وجود بدلات مخصصة
        if (!window.customAllowances || window.customAllowances.length === 0) return;
        
        const oldRank = document.getElementById('old-rank').value;
        const newRank = document.getElementById('new-rank').value;
        const oldDegree = document.getElementById('old-degree').value;
        const newDegree = document.getElementById('new-degree').value;
        const oldBasicSalary = Number(document.getElementById('old-basic-salary').value) || 0;
        const newBasicSalary = Number(document.getElementById('new-basic-salary').value) || 0;
        
        // الحصول على راتب الدرجة الأولى
        const oldRankFirstDegreeSalary = Number(document.getElementById(`scale-${oldRank}-1`)?.value) || 0;
        const newRankFirstDegreeSalary = Number(document.getElementById(`scale-${newRank}-1`)?.value) || 0;
        
        // تحديث كل بدل مخصص
        window.customAllowances.forEach(allowance => {
            const rowElement = document.querySelector(`tr[data-row-id="${allowance.id}"]`);
            if (!rowElement) return;
            
            const oldInput = document.getElementById(`old-${allowance.id}`);
            const newInput = document.getElementById(`new-${allowance.id}`);
            
            if (!oldInput || !newInput) return;
            
            // حساب قيم البدل بناءً على نوعه
            let oldValue = 0;
            let newValue = 0;
            
            switch (allowance.type) {
                case 'first-degree':
                    // نسبة من راتب الدرجة الأولى
                    oldValue = parseFloat((oldRankFirstDegreeSalary * (allowance.percentage / 100)).toFixed(2));
                    newValue = parseFloat((newRankFirstDegreeSalary * (allowance.percentage / 100)).toFixed(2));
                    break;
                case 'current-degree':
                    // نسبة من راتب الدرجة الحالية
                    oldValue = parseFloat((oldBasicSalary * (allowance.percentage / 100)).toFixed(2));
                    newValue = parseFloat((newBasicSalary * (allowance.percentage / 100)).toFixed(2));
                    break;
                case 'fixed':
                    // المبالغ الثابتة تبقى كما هي
                    return;
                case 'custom':
                    // البدلات المخصصة تتطلب إعادة حساب معقدة
                    // يمكن إضافة منطق خاص هنا إذا لزم الأمر
                    return;
            }
            
            // تحديث قيم البدل
            oldInput.value = oldValue;
            newInput.value = newValue;
        });
    };
    
    // حول hidden row
    window.hideRow = function(rowId) {
        const row = document.querySelector(`tr[data-row-id="${rowId}"]`);
        if (row) {
            row.style.display = 'none';
            if (typeof window.hiddenRows !== 'undefined') {
                window.hiddenRows.add(rowId);
            } else {
                window.hiddenRows = new Set([rowId]);
            }
            
            // تصفير قيم الحقول المخفية
            const oldInput = document.getElementById(`old-${rowId}`);
            const newInput = document.getElementById(`new-${rowId}`);
            
            if (oldInput) oldInput.value = '0';
            if (newInput) newInput.value = '0';
        }
    };
    
    // استعادة الصفوف المخفية
    window.restoreHiddenRows = function() {
        if (typeof window.hiddenRows !== 'undefined') {
            window.hiddenRows.forEach(rowId => {
                const row = document.querySelector(`tr[data-row-id="${rowId}"]`);
                if (row) {
                    row.style.display = 'table-row';
                }
            });
            window.hiddenRows.clear();
        }
    };
    
    // تحديث ظهور أزرار الحذف بناءً على نوع التعديل
    window.updateDeleteButtonsVisibility = function() {
        const changeType = document.getElementById('change-type').value;
        const deleteColumns = document.querySelectorAll('.delete-column');
        const deleteButtons = document.querySelectorAll('.delete-row-btn');
        
        // في حالة "ترقية"، يتم إخفاء أزرار الحذف
        if (changeType === 'ترقية') {
            deleteColumns.forEach(col => col.style.display = 'none');
        } else {
            // في حالات التعديل الأخرى، يتم إظهار أزرار الحذف
            deleteColumns.forEach(col => col.style.display = 'table-cell');
            
            // لا يمكن حذف الراتب الأساسي في كل الأحوال
            const basicSalaryDeleteButton = document.querySelector('tr[data-row-id="basic-salary"] .delete-row-btn');
            if (basicSalaryDeleteButton) basicSalaryDeleteButton.classList.add('hidden');
            
            // إظهار الصفوف المخفية مسبقًا
            window.restoreHiddenRows();
        }
    };
    
    // تهيئة المتغيرات العامة
    window.peopleList = [];
    window.differenceTotal = 0;
    window.calculatedData = {};
    window.customAllowances = []; // قائمة البدلات المخصصة
    window.deletedAllowances = []; // قائمة البدلات المحذوفة
    window.hiddenRows = new Set(); // قائمة بالصفوف المخفية
    
    // كائن لتخزين إعدادات التطبيق
    window.appSettings = {
        display: {
            showZeroRows: false,
            showTotals: false,
            darkMode: false
        },
        calculation: {
            autoTerrorism: false,  // افتراضيًا يدوي
            autoSecurity: false,   // افتراضيًا يدوي
            autoRetirement: true   // افتراضيًا تلقائي
        },
        defaults: {
            unit: "كتيبة الشرطة العسكرية الحادية عشر",
            changeType: "ترقية"
        }
    };
    
    // تحميل الإعدادات المحفوظة من localStorage
    window.loadSettings = function() {
        try {
            const savedSettings = localStorage.getItem('appSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                // دمج الإعدادات المحفوظة مع الإعدادات الافتراضية
                if (settings.display) Object.assign(window.appSettings.display, settings.display);
                if (settings.calculation) Object.assign(window.appSettings.calculation, settings.calculation);
                if (settings.defaults) Object.assign(window.appSettings.defaults, settings.defaults);
                
                // تحديث وضع حساب البدلات
                window.allowanceCalculationMode.terrorism = window.appSettings.calculation.autoTerrorism ? 'auto' : 'manual';
                window.allowanceCalculationMode.security = window.appSettings.calculation.autoSecurity ? 'auto' : 'manual';
                window.allowanceCalculationMode.retirement = window.appSettings.calculation.autoRetirement ? 'auto' : 'manual';
                
                // تطبيق الإعدادات
                const elementsToUpdate = [
                    { id: 'settings-show-zero-rows', path: 'display.showZeroRows', isCheckbox: true },
                    { id: 'settings-show-totals', path: 'display.showTotals', isCheckbox: true },
                    { id: 'settings-auto-terrorism', path: 'calculation.autoTerrorism', isCheckbox: true },
                    { id: 'settings-auto-security', path: 'calculation.autoSecurity', isCheckbox: true },
                    { id: 'settings-auto-retirement', path: 'calculation.autoRetirement', isCheckbox: true },
                    { id: 'settings-default-unit', path: 'defaults.unit', isCheckbox: false }
                ];
                
                elementsToUpdate.forEach(item => {
                    const element = document.getElementById(item.id);
                    if (element) {
                        const value = item.path.split('.').reduce((acc, part) => acc && acc[part], window.appSettings);
                        if (item.isCheckbox) {
                            element.checked = value;
                        } else {
                            element.value = value;
                        }
                    }
                });
                
                // تطبيق الإعدادات الافتراضية
                const unitElement = document.getElementById('unit');
                if (unitElement) {
                    unitElement.value = window.appSettings.defaults.unit;
                }
                
                // تطبيق خيارات العرض
                const zeroRowsToggle = document.getElementById('show-zero-rows-toggle');
                const totalsToggle = document.getElementById('show-totals-toggle');
                
                if (zeroRowsToggle) zeroRowsToggle.checked = window.appSettings.display.showZeroRows;
                if (totalsToggle) totalsToggle.checked = window.appSettings.display.showTotals;
            }
        } catch (error) {
            console.error('خطأ في تحميل الإعدادات:', error);
        }
    };
    
    // حفظ الإعدادات
    window.saveSettings = function() {
        try {
            localStorage.setItem('appSettings', JSON.stringify(window.appSettings));
        } catch (error) {
            console.error('خطأ في حفظ الإعدادات:', error);
        }
    };
    
    // تحميل قائمة الأشخاص من localStorage
    window.loadPeopleList = function() {
        try {
            const savedList = localStorage.getItem('peopleList');
            if (savedList) {
                window.peopleList = JSON.parse(savedList);
                window.updatePeopleTable();
            }
        } catch (error) {
            console.error('خطأ في تحميل القائمة:', error);
        }
    };
    
    // دالة لتحويل الأرقام الإنجليزية إلى أرقام عربية
    window.toArabicNumbers = function(num) {
        if (num === undefined || num === null) return '';
        return String(num).replace(/[0-9]/g, d => String.fromCharCode(d.charCodeAt(0) + 1584));
    };
    
    // تهيئة البيانات الأولية
    window.loadSettings();
    // تحميل سلم الرواتب من localStorage
    window.loadSalaryScale = function() {
        try {
            const savedScale = localStorage.getItem('salaryScale');
            if (savedScale) {
                const salaryScale = JSON.parse(savedScale);
                
                // تعبئة قيم سلم الرواتب
                for (const rank in salaryScale) {
                    for (const degree in salaryScale[rank]) {
                        const element = document.getElementById(`scale-${rank}-${degree}`);
                        if (element) {
                            element.value = salaryScale[rank][degree];
                        }
                    }
                }
            }
        } catch (error) {
            console.error('خطأ في تحميل سلم الرواتب:', error);
        }
    };
    window.loadSalaryScale();
    // تحميل قائمة الأشخاص من localStorage
    window.loadPeopleList();
    
    // ضبط حالة أزرار التبديل بين التلقائي واليدوي
    window.setInitialToggleButtonsState = function() {
        // بدل مكافحة الإرهاب
        const terrorismStatusElement = document.getElementById('terrorism-calc-status');
        const terrorismButtonElement = document.getElementById('toggle-terrorism-calc');
        if (terrorismStatusElement && terrorismButtonElement) {
            terrorismStatusElement.textContent = window.allowanceCalculationMode.terrorism === 'auto' ? 'تلقائي' : 'يدوي';
            if (window.allowanceCalculationMode.terrorism === 'auto') {
                terrorismButtonElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900', 'text-yellow-700', 'dark:text-yellow-300');
                terrorismButtonElement.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
            } else {
                terrorismButtonElement.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
                terrorismButtonElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900', 'text-yellow-700', 'dark:text-yellow-300');
            }
        }
        
        // علاوة الأمن
        const securityStatusElement = document.getElementById('security-calc-status');
        const securityButtonElement = document.getElementById('toggle-security-calc');
        if (securityStatusElement && securityButtonElement) {
            securityStatusElement.textContent = window.allowanceCalculationMode.security === 'auto' ? 'تلقائي' : 'يدوي';
            if (window.allowanceCalculationMode.security === 'auto') {
                securityButtonElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900', 'text-yellow-700', 'dark:text-yellow-300');
                securityButtonElement.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
            } else {
                securityButtonElement.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
                securityButtonElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900', 'text-yellow-700', 'dark:text-yellow-300');
            }
        }
        
        // التقاعد
        const retirementStatusElement = document.getElementById('retirement-calc-status');
        const retirementButtonElement = document.getElementById('toggle-retirement-calc');
        if (retirementStatusElement && retirementButtonElement) {
            retirementStatusElement.textContent = window.allowanceCalculationMode.retirement === 'auto' ? 'تلقائي' : 'يدوي';
            if (window.allowanceCalculationMode.retirement === 'auto') {
                retirementButtonElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900', 'text-yellow-700', 'dark:text-yellow-300');
                retirementButtonElement.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
            } else {
                retirementButtonElement.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300');
                retirementButtonElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900', 'text-yellow-700', 'dark:text-yellow-300');
            }
        }
    };
    
    window.setInitialToggleButtonsState();
    // تحديث ظهور أزرار الحذف بناءً على نوع التعديل
    window.updateDeleteButtonsVisibility();
    // Add event listeners for rank changes
    document.getElementById('old-rank')?.addEventListener('change', updateRankAndDegree);
    document.getElementById('new-rank')?.addEventListener('change', updateSalaryScale);

    // Add event listeners for degree changes
    document.getElementById('old-degree')?.addEventListener('change', updateBasedOnOldDegree);
    document.getElementById('new-degree')?.addEventListener('change', updateSalaryScale);

    // Default to first tab
    switchTab('data');
});

// Make functions globally available
window.switchTab = switchTab;
window.updateRankAndDegree = updateRankAndDegree;
window.updateSalaryScale = updateSalaryScale;
window.updateBasedOnOldDegree = updateBasedOnOldDegree;
window.showAddAllowanceModal = showAddAllowanceModal;
window.toggleAllowanceCalculation = toggleAllowanceCalculation;


// وظائف إضافية خارج نطاق DOMContentLoaded
// تحديث جدول الأشخاص
window.updatePeopleTable = function() {
    const tableBody = document.querySelector('#people-table tbody');
    if (!tableBody) return;
    
    // إفراغ الجدول
    tableBody.innerHTML = '';
    
    // إذا كانت القائمة فارغة، عرض رسالة
    if (!window.peopleList || window.peopleList.length === 0) {
        tableBody.innerHTML = `
            <tr class="text-center">
                <td colspan="8" class="border border-gray-300 dark:border-gray-600 p-4 text-gray-500 dark:text-gray-400">
                    لا توجد بيانات. قم بإضافة أشخاص من شاشة إدخال البيانات.
                </td>
            </tr>
        `;
        return;
    }
    
    // ملء الجدول بالبيانات
    window.peopleList.forEach(person => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="border border-gray-300 dark:border-gray-600 p-2">${person.name}</td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">${person.generalNumber}</td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">${person.unit}</td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">${person.rank}</td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">${new Date(person.startDate).toLocaleDateString()}</td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">${new Date(person.endDate).toLocaleDateString()}</td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">${person.amount.toLocaleString()}</td>
            <td class="border border-gray-300 dark:border-gray-600 p-2">
                <button class="text-blue-600 hover:text-blue-800 mr-2" onclick="loadPersonData('${person.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
                <button class="text-red-600 hover:text-red-800" onclick="deletePersonFromList('${person.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
};

// حذف شخص من القائمة
window.deletePersonFromList = function(personId) {
    if (!confirm('هل أنت متأكد من حذف هذا الشخص من القائمة؟')) return;
    
    const personIndex = window.peopleList.findIndex(person => person.id === personId);
    if (personIndex !== -1) {
        window.peopleList.splice(personIndex, 1);
        
        // حفظ القائمة في localStorage
        window.savePeopleList();
        
        // تحديث عرض القائمة
        window.updatePeopleTable();
    }
};

// تحميل بيانات شخص من القائمة
window.loadPersonData = function(personId) {
    const person = window.peopleList.find(p => p.id === personId);
    if (!person) return;
    
    // تعبئة نموذج البيانات بالبيانات المحفوظة
    document.getElementById('name').value = person.name;
    document.getElementById('general-number').value = person.generalNumber;
    document.getElementById('unit').value = person.unit;
    document.getElementById('start-date').value = person.startDate;
    document.getElementById('end-date').value = person.endDate;
    
    // الانتقال إلى تبويب إدخال البيانات
    window.switchTab('data');
};

// حفظ قائمة الأشخاص في localStorage
window.savePeopleList = function() {
    try {
        localStorage.setItem('peopleList', JSON.stringify(window.peopleList));
    } catch (error) {
        console.error('خطأ في حفظ القائمة:', error);
    }
};

// حفظ سلم الرواتب في localStorage
window.saveSalaryScale = function() {
    try {
        const ranks = ["جندي", "جندي أول", "عريف", "وكيل رقيب", "رقيب", "رقيب أول", "رئيس رقباء", "ملازم"];
        const salaryScale = {};
        
        // جمع قيم سلم الرواتب
        ranks.forEach(rank => {
            salaryScale[rank] = {};
            for (let degree = 1; degree <= 15; degree++) {
                const element = document.getElementById(`scale-${rank}-${degree}`);
                if (element) {
                    salaryScale[rank][degree] = Number(element.value) || 0;
                }
            }
        });
        
        localStorage.setItem('salaryScale', JSON.stringify(salaryScale));
        alert('تم حفظ سلم الرواتب بنجاح');
    } catch (error) {
        console.error('خطأ في حفظ سلم الرواتب:', error);
        alert('حدث خطأ أثناء حفظ سلم الرواتب');
    }
};

// تحميل سلم الرواتب من localStorage
window.loadSalaryScale = function() {
    try {
        const savedScale = localStorage.getItem('salaryScale');
        if (savedScale) {
            const salaryScale = JSON.parse(savedScale);
            
            // تعبئة قيم سلم الرواتب
            for (const rank in salaryScale) {
                for (const degree in salaryScale[rank]) {
                    const element = document.getElementById(`scale-${rank}-${degree}`);
                    if (element) {
                        element.value = salaryScale[rank][degree];
                    }
                }
            }
        }
    } catch (error) {
        console.error('خطأ في تحميل سلم الرواتب:', error);
    }
};

// تحديث إعدادات العرض
window.toggleDisplaySetting = function(settingName, value) {
    if (settingName === 'showZeroRows') {
        window.appSettings.display.showZeroRows = value;
        
        // تحديث التبديل في صفحة الإعدادات أيضًا
        const settingsToggle = document.getElementById('settings-show-zero-rows');
        if (settingsToggle) settingsToggle.checked = value;
    } else if (settingName === 'showTotals') {
        window.appSettings.display.showTotals = value;
        
        // تحديث التبديل في صفحة الإعدادات أيضًا
        const settingsToggle = document.getElementById('settings-show-totals');
        if (settingsToggle) settingsToggle.checked = value;
    }
    
    // إعادة عرض النموذج الحالي
    if (document.getElementById('difference-form').classList.contains('hidden')) {
        window.previewDeclarationForm();
    } else {
        window.previewDifferenceForm();
    }
    
    // حفظ الإعدادات
    window.saveSettings();
};

// تحديث إعدادات الحساب التلقائي
window.updateCalculationSetting = function(settingType, value) {
    // تحديث الإعدادات
    if (settingType === 'terrorism') {
        window.appSettings.calculation.autoTerrorism = value;
        window.allowanceCalculationMode.terrorism = value ? 'auto' : 'manual';
    } else if (settingType === 'security') {
        window.appSettings.calculation.autoSecurity = value;
        window.allowanceCalculationMode.security = value ? 'auto' : 'manual';
    } else if (settingType === 'retirement') {
        window.appSettings.calculation.autoRetirement = value;
        window.allowanceCalculationMode.retirement = value ? 'auto' : 'manual';
    }
    
    // تحديث حالة الأزرار
    window.setInitialToggleButtonsState();
    
    // إعادة حساب العلاوات إذا كانت تلقائية
    window.calculateAllowances();
    
    // حفظ الإعدادات
    window.saveSettings();
};

// تحديث إعدادات النظام
window.updateSetting = function(category, name, value) {
    if (category === 'display') {
        window.appSettings.display[name] = value;
    } else if (category === 'calculation') {
        window.appSettings.calculation[name] = value;
    } else if (category === 'defaults') {
        window.appSettings.defaults[name] = value;
        
        // تطبيق الإعدادات الافتراضية
        if (name === 'unit') {
            document.getElementById('unit').value = value;
        }
    }
};

// أمثلة لدوال أخرى
window.showAddAllowanceModal = showAddAllowanceModal;

window.hideAddAllowanceModal = function() {
    const modal = document.getElementById('add-allowance-modal');
    if (modal) modal.classList.add('hidden');
};

window.updateAllowanceTypeFields = function() {
    const allowanceType = document.getElementById('allowance-type').value;
    const percentageContainer = document.getElementById('percentage-container');
    const fixedAmountContainer = document.getElementById('fixed-amount-container');
    const customSearchContainer = document.getElementById('custom-search-container');
    const allowanceTypeDescription = document.getElementById('allowance-type-description');
    
    if (!percentageContainer || !fixedAmountContainer || !customSearchContainer || !allowanceTypeDescription) return;
    
    // إخفاء كل الحقول
    percentageContainer.classList.add('hidden');
    fixedAmountContainer.classList.add('hidden');
    customSearchContainer.classList.add('hidden');
    
    // إظهار الحقول المناسبة حسب نوع البدل
    if (allowanceType === 'first-degree') {
        percentageContainer.classList.remove('hidden');
        allowanceTypeDescription.textContent = 'يتم حساب البدل كنسبة من راتب الدرجة الأولى للرتبة (مثل بدل مكافحة الإرهاب)';
    } else if (allowanceType === 'current-degree') {
        percentageContainer.classList.remove('hidden');
        allowanceTypeDescription.textContent = 'يتم حساب البدل كنسبة من راتب الدرجة الحالية للرتبة (مثل علاوة الأمن)';
    } else if (allowanceType === 'fixed') {
        fixedAmountContainer.classList.remove('hidden');
        allowanceTypeDescription.textContent = 'يتم إدخال مبلغ ثابت للبدل (مثل بدل النقل)';
    } else if (allowanceType === 'custom') {
        customSearchContainer.classList.remove('hidden');
        allowanceTypeDescription.textContent = 'يتم البحث عن البدل بناءً على معايير البحث المخصصة';
    }
};

window.previewCustomSearch = function() {
    const oldRank = document.getElementById('old-rank').value;
    const newRank = document.getElementById('new-rank').value;
    const oldDegree = document.getElementById('old-degree').value;
    const newDegree = document.getElementById('new-degree').value;
    
    // البحث عن رتبة ودرجة البدل السابق
    const searchRankOldSelect = document.getElementById('search-rank-old');
    const searchDegreeOldSelect = document.getElementById('search-degree-old');
    
    if (!searchRankOldSelect || !searchDegreeOldSelect) {
        console.error("لم يتم العثور على عناصر البحث المخصص");
        return;
    }
    
    let searchRankOld = searchRankOldSelect.value;
    let searchDegreeOld = searchDegreeOldSelect.value;
    
    // إذا كانت الرتبة هي "نفس الرتبة السابقة" أو "نفس الرتبة الحالية"
    if (searchRankOld === 'old-rank') {
        searchRankOld = oldRank;
    } else if (searchRankOld === 'new-rank') {
        searchRankOld = newRank;
    }
    
    // إذا كانت الدرجة هي "نفس الدرجة السابقة"
    if (searchDegreeOld === 'old-degree') {
        searchDegreeOld = oldDegree;
    }
    
    // البحث عن رتبة ودرجة البدل الحالي
    const searchRankNewSelect = document.getElementById('search-rank-new');
    const searchDegreeNewSelect = document.getElementById('search-degree-new');
    
    if (!searchRankNewSelect || !searchDegreeNewSelect) {
        console.error("لم يتم العثور على عناصر البحث المخصص");
        return;
    }
    
    let searchRankNew = searchRankNewSelect.value;
    let searchDegreeNew = searchDegreeNewSelect.value;
    
    // إذا كانت الرتبة هي "نفس الرتبة السابقة" أو "نفس الرتبة الحالية"
    if (searchRankNew === 'old-rank') {
        searchRankNew = oldRank;
    } else if (searchRankNew === 'new-rank') {
        searchRankNew = newRank;
    }
    
    // إذا كانت الدرجة هي "نفس الدرجة الحالية"
    if (searchDegreeNew === 'new-degree') {
        searchDegreeNew = newDegree;
    }
    
    // البحث عن القيم في سلم الرواتب
    const oldScaleElement = document.getElementById(`scale-${searchRankOld}-${searchDegreeOld}`);
    const newScaleElement = document.getElementById(`scale-${searchRankNew}-${searchDegreeNew}`);
    
    const previewOldAmountElement = document.getElementById('preview-old-amount');
    const previewNewAmountElement = document.getElementById('preview-new-amount');
    
    if (!previewOldAmountElement || !previewNewAmountElement) {
        console.error("لم يتم العثور على عناصر معاينة البحث");
        return;
    }
    
    // التحقق من وجود العناصر
    if (oldScaleElement) {
        const oldValue = Number(oldScaleElement.value) || 0;
        // تطبيق النسبة المئوية
        const percentageElement = document.getElementById('allowance-custom-percentage');
        const percentage = percentageElement ? (Number(percentageElement.value) || 100) : 100;
        
        previewOldAmountElement.textContent = Math.round(oldValue * percentage / 100).toString();
    } else {
        previewOldAmountElement.textContent = "غير موجود";
    }
    
    if (newScaleElement) {
        const newValue = Number(newScaleElement.value) || 0;
        // تطبيق النسبة المئوية
        const percentageElement = document.getElementById('allowance-custom-percentage');
        const percentage = percentageElement ? (Number(percentageElement.value) || 100) : 100;
        
        previewNewAmountElement.textContent = Math.round(newValue * percentage / 100).toString();
    } else {
        previewNewAmountElement.textContent = "غير موجود";
    }
};

window.addNewAllowance = function() {
    const allowanceNameInput = document.getElementById('allowance-name');
    const allowanceTypeSelect = document.getElementById('allowance-type');
    
    if (!allowanceNameInput || !allowanceTypeSelect) {
        console.error("لم يتم العثور على عناصر إضافة البدل");
        return;
    }
    
    const allowanceName = allowanceNameInput.value.trim();
    const allowanceType = allowanceTypeSelect.value;
    
    if (!allowanceName) {
        alert('يرجى إدخال اسم البدل');
        return;
    }
    
    let oldValue = 0;
    let newValue = 0;
    
    if (allowanceType === 'fixed') {
        const oldAmountInput = document.getElementById('allowance-amount-old');
        const newAmountInput = document.getElementById('allowance-amount-new');
        
        if (oldAmountInput && newAmountInput) {
            oldValue = Number(oldAmountInput.value) || 0;
            newValue = Number(newAmountInput.value) || 0;
        }
    } else if (allowanceType === 'custom') {
        // استخدام البحث المخصص
        const oldRank = document.getElementById('old-rank').value;
        const newRank = document.getElementById('new-rank').value;
        const oldDegree = document.getElementById('old-degree').value;
        const newDegree = document.getElementById('new-degree').value;
        
        // البحث عن رتبة ودرجة البدل السابق
        const searchRankOldSelect = document.getElementById('search-rank-old');
        const searchDegreeOldSelect = document.getElementById('search-degree-old');
        
        if (!searchRankOldSelect || !searchDegreeOldSelect) {
            console.error("لم يتم العثور على عناصر البحث المخصص");
            return;
        }
        
        let searchRankOld = searchRankOldSelect.value;
        let searchDegreeOld = searchDegreeOldSelect.value;
        
        // إذا كانت الرتبة هي "نفس الرتبة السابقة" أو "نفس الرتبة الحالية"
        if (searchRankOld === 'old-rank') {
            searchRankOld = oldRank;
        } else if (searchRankOld === 'new-rank') {
            searchRankOld = newRank;
        }
        
        // إذا كانت الدرجة هي "نفس الدرجة السابقة"
        if (searchDegreeOld === 'old-degree') {
            searchDegreeOld = oldDegree;
        }
        
        // البحث عن رتبة ودرجة البدل الحالي
        const searchRankNewSelect = document.getElementById('search-rank-new');
        const searchDegreeNewSelect = document.getElementById('search-degree-new');
        
        if (!searchRankNewSelect || !searchDegreeNewSelect) {
            console.error("لم يتم العثور على عناصر البحث المخصص");
            return;
        }
        
        let searchRankNew = searchRankNewSelect.value;
        let searchDegreeNew = searchDegreeNewSelect.value;
        
        // إذا كانت الرتبة هي "نفس الرتبة السابقة" أو "نفس الرتبة الحالية"
        if (searchRankNew === 'old-rank') {
            searchRankNew = oldRank;
        } else if (searchRankNew === 'new-rank') {
            searchRankNew = newRank;
        }
        
        // إذا كانت الدرجة هي "نفس الدرجة الحالية"
        if (searchDegreeNew === 'new-degree') {
            searchDegreeNew = newDegree;
        }
        
        // البحث عن القيم في سلم الرواتب
        const oldScaleElement = document.getElementById(`scale-${searchRankOld}-${searchDegreeOld}`);
        const newScaleElement = document.getElementById(`scale-${searchRankNew}-${searchDegreeNew}`);
        
        // التحقق من وجود العناصر
        if (oldScaleElement) {
            oldValue = Number(oldScaleElement.value) || 0;
        }
        
        if (newScaleElement) {
            newValue = Number(newScaleElement.value) || 0;
        }
        
        // تطبيق النسبة المئوية
        const percentageElement = document.getElementById('allowance-custom-percentage');
        const percentage = percentageElement ? (Number(percentageElement.value) || 100) : 100;
        
        oldValue = Math.round(oldValue * percentage / 100);
        newValue = Math.round(newValue * percentage / 100);
        
    } else {
        const percentageInput = document.getElementById('allowance-percentage');
        if (!percentageInput) {
            console.error("لم يتم العثور على عنصر النسبة المئوية");
            return;
        }
        
        const percentage = Number(percentageInput.value) || 0;
        const oldRank = document.getElementById('old-rank').value;
        const newRank = document.getElementById('new-rank').value;
        
        if (allowanceType === 'first-degree') {
            // نسبة من راتب الدرجة الأولى
            const oldRankFirstDegreeElement = document.getElementById(`scale-${oldRank}-1`);
            const newRankFirstDegreeElement = document.getElementById(`scale-${newRank}-1`);
            
            if (oldRankFirstDegreeElement && newRankFirstDegreeElement) {
                const oldRankFirstDegreeSalary = Number(oldRankFirstDegreeElement.value) || 0;
                const newRankFirstDegreeSalary = Number(newRankFirstDegreeElement.value) || 0;
                
                oldValue = Math.round(oldRankFirstDegreeSalary * (percentage / 100));
                newValue = Math.round(newRankFirstDegreeSalary * (percentage / 100));
            }
        } else {
            // نسبة من راتب الدرجة الحالية
            const oldBasicSalaryInput = document.getElementById('old-basic-salary');
            const newBasicSalaryInput = document.getElementById('new-basic-salary');
            
            if (oldBasicSalaryInput && newBasicSalaryInput) {
                const oldBasicSalary = Number(oldBasicSalaryInput.value) || 0;
                const newBasicSalary = Number(newBasicSalaryInput.value) || 0;
                
                oldValue = Math.round(oldBasicSalary * (percentage / 100));
                newValue = Math.round(newBasicSalary * (percentage / 100));
            }
        }
    }
    
    // إضافة البدل إلى الجدول مع زر حذف
    const tableBody = document.querySelector('#allowances-table tbody');
    if (!tableBody) {
        console.error("لم يتم العثور على جدول البدلات");
        return;
    }
    
    const allowanceId = Date.now().toString();
    const newRow = document.createElement('tr');
    newRow.setAttribute('data-row-id', allowanceId);
    newRow.setAttribute('data-type', 'allowance');
    
    // التحقق مما إذا كان يجب إظهار زر الحذف
    const showDeleteButton = document.getElementById('change-type').value !== 'ترقية';
    
    newRow.innerHTML = `
        <td class="relative">
            ${allowanceName}
        </td>
        <td><input type="number" id="old-${allowanceId}" class="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-base" value="${oldValue}" min="0"></td>
        <td><input type="number" id="new-${allowanceId}" class="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-base" value="${newValue}" min="0"></td>
        <td class="delete-column" style="display: ${showDeleteButton ? 'table-cell' : 'none'};">
            <span class="delete-row-btn" onclick="hideRow('${allowanceId}')">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </span>
        </td>
    `;
    tableBody.appendChild(newRow);
    
    // تخزين البدل للاستخدام لاحقًا
    window.customAllowances.push({
        id: allowanceId,
        name: allowanceName,
        type: allowanceType,
        percentage: allowanceType !== 'fixed' ? (Number(document.getElementById('allowance-percentage')?.value) || 0) : 0
    });
    
    window.hideAddAllowanceModal();
};

window.calculateDifferences = function() {
    const nameInput = document.getElementById('name');
    const generalNumberInput = document.getElementById('general-number');
    const unitInput = document.getElementById('unit');
    
    if (!nameInput || !generalNumberInput || !unitInput) {
        console.error("لم يتم العثور على حقول البيانات الأساسية");
        return;
    }
    
    const name = nameInput.value.trim();
    const generalNumber = generalNumberInput.value.trim();
    const unit = unitInput.value.trim();
    
    if (!name || !generalNumber || !unit) {
        alert('يرجى إدخال الاسم والرقم العام والوحدة');
        return;
    }
    
    // الحصول على تواريخ الحسبة
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    if (!startDateInput || !endDateInput) {
        console.error("لم يتم العثور على حقول التواريخ");
        return;
    }
    
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('يرجى إدخال تاريخ بداية ونهاية الحسبة');
        return;
    }
    
    // حساب عدد الأيام 
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1; // إضافة 1 لتضمين اليوم الأخير
    
    // جمع معلومات الرتبة
    const oldRankSelect = document.getElementById('old-rank');
    const newRankSelect = document.getElementById('new-rank');
    
    if (!oldRankSelect || !newRankSelect) {
        console.error("لم يتم العثور على عناصر الرتبة");
        return;
    }
    
    const oldRank = oldRankSelect.value;
    const newRank = newRankSelect.value;
    
    // جمع جميع البدلات والحسميات
    const allowances = [];
    const deductions = [];
    
    // جمع الراتب الأساسي ومكافحة الإرهاب وعلاوة الأمن
    const oldBasicSalary = Number(document.getElementById('old-basic-salary').value) || 0;
    const newBasicSalary = Number(document.getElementById('new-basic-salary').value) || 0;
    
    const basicDiff = newBasicSalary - oldBasicSalary;
    const basicDiffAmount = parseFloat(((basicDiff / 30) * daysDiff).toFixed(2));
    
    // إضافة الراتب الأساسي فقط إذا كان الصف غير مخفي
    if (!window.hiddenRows.has('basic-salary')) {
        if (basicDiffAmount > 0) {
            allowances.push({
                type: "الراتب الأساسي",
                oldAmount: oldBasicSalary,
                newAmount: newBasicSalary,
                days: daysDiff,
                diffAmount: basicDiffAmount
            });
        } else if (basicDiffAmount < 0) {
            deductions.push({
                type: "الراتب الأساسي",
                oldAmount: oldBasicSalary,
                newAmount: newBasicSalary,
                days: daysDiff,
                diffAmount: Math.abs(basicDiffAmount)
            });
        }
    }
    
    // إضافة بدل مكافحة الإرهاب إذا لم يكن مخفيًا
    if (!window.hiddenRows.has('terrorism')) {
        const oldTerrorism = Number(document.getElementById('old-terrorism').value) || 0;
        const newTerrorism = Number(document.getElementById('new-terrorism').value) || 0;
        const terrorismDiff = newTerrorism - oldTerrorism;
        const terrorismDiffAmount = parseFloat(((terrorismDiff / 30) * daysDiff).toFixed(2));
        
        if (terrorismDiffAmount > 0) {
            allowances.push({
                type: "بدل مكافحة الإرهاب",
                oldAmount: oldTerrorism,
                newAmount: newTerrorism,
                days: daysDiff,
                diffAmount: terrorismDiffAmount
            });
        } else if (terrorismDiffAmount < 0) {
            deductions.push({
                type: "بدل مكافحة الإرهاب",
                oldAmount: oldTerrorism,
                newAmount: newTerrorism,
                days: daysDiff,
                diffAmount: Math.abs(terrorismDiffAmount)
            });
        }
    }
    
    // إضافة علاوة الأمن إذا لم تكن مخفية
    if (!window.hiddenRows.has('security')) {
        const oldSecurity = Number(document.getElementById('old-security').value) || 0;
        const newSecurity = Number(document.getElementById('new-security').value) || 0;
        const securityDiff = newSecurity - oldSecurity;
        const securityDiffAmount = parseFloat(((securityDiff / 30) * daysDiff).toFixed(2));
        
        if (securityDiffAmount > 0) {
            allowances.push({
                type: "علاوة الأمن (شرطة عسكرية)",
                oldAmount: oldSecurity,
                newAmount: newSecurity,
                days: daysDiff,
                diffAmount: securityDiffAmount
            });
        } else if (securityDiffAmount < 0) {
            deductions.push({
                type: "علاوة الأمن (شرطة عسكرية)",
                oldAmount: oldSecurity,
                newAmount: newSecurity,
                days: daysDiff,
                diffAmount: Math.abs(securityDiffAmount)
            });
        }
    }
    
    // إضافة حسم التقاعد إذا لم يكن مخفيًا
    if (!window.hiddenRows.has('retirement')) {
        const oldRetirement = Number(document.getElementById('old-retirement').value) || 0;
        const newRetirement = Number(document.getElementById('new-retirement').value) || 0;
        const retirementDiff = newRetirement - oldRetirement;
        const retirementDiffAmount = parseFloat(((retirementDiff / 30) * daysDiff).toFixed(2));
        
        if (retirementDiffAmount > 0) {
            deductions.push({
                type: "التقاعد",
                oldAmount: oldRetirement,
                newAmount: newRetirement,
                days: daysDiff,
                diffAmount: retirementDiffAmount
            });
        } else if (retirementDiffAmount < 0) {
            allowances.push({
                type: "التقاعد",
                oldAmount: oldRetirement,
                newAmount: newRetirement,
                days: daysDiff,
                diffAmount: Math.abs(retirementDiffAmount)
            });
        }
    }
    
    // جمع البدلات المخصصة
    document.querySelectorAll('#allowances-table tbody tr[data-allowance-id]').forEach(row => {
        if (row.style.display === 'none') return; // تجاهل الصفوف المخفية
        
        if (!row.cells || row.cells.length < 3) return;
        
        const name = row.cells[0].textContent.trim();
        const inputs = row.querySelectorAll('input');
        
        if (inputs.length < 2) return;
        
        const oldAmount = Number(inputs[0].value) || 0;
        const newAmount = Number(inputs[1].value) || 0;
        
        // حساب الفرق
        const diff = newAmount - oldAmount;
        const diffAmount = Math.round(((diff / 30) * daysDiff));
        
        // تصنيف البدل بناءً على الفرق
        if (diffAmount > 0) {
            allowances.push({
                type: name,
                oldAmount,
                newAmount,
                days: daysDiff,
                diffAmount: diffAmount
            });
        } else if (diffAmount < 0) {
            deductions.push({
                type: name,
                oldAmount,
                newAmount,
                days: daysDiff,
                diffAmount: Math.abs(diffAmount)
            });
        }
    });
    
    // حساب إجمالي الفروقات والحسميات
    let totalPositiveDiff = 0;
    let totalNegativeDiff = 0;
    
    allowances.forEach(item => {
        totalPositiveDiff += item.diffAmount;
    });
    
    deductions.forEach(item => {
        totalNegativeDiff += item.diffAmount;
    });
    
    // حساب صافي الفروقات
    const netDiff = totalPositiveDiff - totalNegativeDiff;
    window.differenceTotal = netDiff;
    
    // تخزين النتائج للعرض لاحقًا
    window.calculatedData = {
        name,
        generalNumber,
        idNumber: document.getElementById('id-number')?.value.trim() || '',
        unit,
        commencementDate: document.getElementById('commencement-date')?.value || '',
        startDate: startDateInput.value,
        endDate: endDateInput.value,
        oldRank,
        newRank,
        oldDegree: document.getElementById('old-degree')?.value || '1',
        newDegree: document.getElementById('new-degree')?.value || '1',
        daysDiff,
        differences: allowances,
        deductions: deductions,
        totalPositiveDiff,
        totalNegativeDiff,
        netDiff
    };
    
    // تبديل إلى نموذج فروقات الترقية
    window.switchTab('forms');
    window.previewDifferenceForm();
};

// عرض نموذج فروقات الترقية - يعرض الصفوف الصفرية حسب الإعدادات
window.previewDifferenceForm = function() {
    if (!window.calculatedData.name) {
        alert('يرجى حساب الفروقات أولاً');
        return;
    }
    
    // إخفاء جميع النماذج
    document.querySelectorAll('.preview-form').forEach(form => {
        if (form) form.classList.add('hidden');
    });
    
    // عرض نموذج فروقات الترقية
    const differenceForm = document.getElementById('difference-form');
    if (!differenceForm) {
        console.error("لم يتم العثور على نموذج فروقات الترقية");
        return;
    }
    
    differenceForm.classList.remove('hidden');
    
    try {
        // تحويل التواريخ
        const startDate = new Date(window.calculatedData.startDate);
        const endDate = new Date(window.calculatedData.endDate);
        
        // استخدام toLocaleDateString لعرض التاريخ بالتنسيق العربي
        const startDateFormatted = startDate.toLocaleDateString('ar-SA', { 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric',
            calendar: 'islamic' 
        });
        
        const endDateFormatted = endDate.toLocaleDateString('ar-SA', { 
            year: 'numeric', 
            month: 'numeric', 
            day: 'numeric',
            calendar: 'islamic' 
        });
        
        // تحويل الرقم العام والسجل المدني إلى أرقام عربية
        const arabicGeneralNumber = window.toArabicNumbers(window.calculatedData.generalNumber);
        const arabicIdNumber = window.toArabicNumbers(window.calculatedData.idNumber);
        
        // التحقق من خيار إظهار الصفوف ذات القيمة صفر
        const showZeroRows = window.appSettings.display.showZeroRows;
        
        // بناء محتوى النموذج مع وضع التواريخ في منتصف الصفحة
        let htmlContent = `
            <div class="text-center font-bold text-xl mb-6" style="text-align: center !important; font-weight: bold !important;">فروقات ترقية</div>
            
            <table class="print-table">
                <tr>
                    <th>الاسم</th>
                    <th>الرتبة</th>
                    <th>الرقم العام</th>
                    <th>تاريخ المباشرة</th>
                    <th>الوحدة</th>
                </tr>
                <tr>
                    <td>${window.calculatedData.name}</td>
                    <td>${window.calculatedData.newRank}</td>
                    <td>${arabicGeneralNumber}</td>
                    <td>${window.calculatedData.commencementDate ? new Date(window.calculatedData.commencementDate).toLocaleDateString('ar-SA', { calendar: 'islamic' }) : '-'}</td>
                    <td>${window.calculatedData.unit}</td>
                </tr>
            </table>
            
            <div class="text-center my-4 font-bold" style="text-align: center !important; font-weight: bold !important; width: 100%; display: block;">
                من تاريخ: ${startDateFormatted} إلى تاريخ: ${endDateFormatted}
            </div>
            
            <table class="print-table">
                <tr>
                    <th>م</th>
                    <th>نوع الفرق</th>
                    <th>المبلغ السابق</th>
                    <th>المبلغ الحالي</th>
                    <th>عدد أيام الفرق</th>
                    <th>مبلغ الفرق</th>
                </tr>
                ${window.calculatedData.differences.map((diff, index) => `
                    <tr class="${diff.diffAmount === 0 ? (showZeroRows ? '' : 'hidden print:table-row') : ''}">
                        <td>${window.toArabicNumbers(index + 1)}</td>
                        <td>${diff.type}</td>
                        <td>${diff.oldAmount.toLocaleString('ar-SA')}</td>
                        <td>${diff.newAmount.toLocaleString('ar-SA')}</td>
                        <td>${window.toArabicNumbers(diff.days)}</td>
                        <td>${diff.diffAmount.toLocaleString('ar-SA')}</td>
                    </tr>
                `).join('')}`;
        
        // إضافة صف المجموع فقط إذا كان خيار العرض مفعل
        if (window.appSettings.display.showTotals) {
            htmlContent += `
                <tr>
                    <td colspan="5" class="text-center font-bold">الإجمالي</td>
                    <td class="font-bold">${window.calculatedData.totalPositiveDiff.toLocaleString('ar-SA')}</td>
                </tr>`;
        }
        
        htmlContent += `</table>
            
            <div class="text-center font-bold my-4" style="text-align: center !important; font-weight: bold !important; width: 100%; display: block;">الحسميات</div>
            
            <table class="print-table">
                <tr>
                    <th>م</th>
                    <th>نوع الحسم</th>
                    <th>المبلغ السابق</th>
                    <th>المبلغ الحالي</th>
                    <th>عدد أيام الحسم</th>
                    <th>مبلغ الحسم</th>
                </tr>
                ${window.calculatedData.deductions.map((ded, index) => `
                    <tr class="${ded.diffAmount === 0 ? (showZeroRows ? '' : 'hidden print:table-row') : ''}">
                        <td>${window.toArabicNumbers(index + 1)}</td>
                        <td>${ded.type}</td>
                        <td>${ded.oldAmount.toLocaleString('ar-SA')}</td>
                        <td>${ded.newAmount.toLocaleString('ar-SA')}</td>
                        <td>${window.toArabicNumbers(ded.days)}</td>
                        <td>${ded.diffAmount.toLocaleString('ar-SA')}</td>
                    </tr>
                `).join('')}`;
        
        // إضافة صف المجموع فقط إذا كان خيار العرض مفعل
        if (window.appSettings.display.showTotals) {
            htmlContent += `
                <tr>
                    <td colspan="5" class="text-center font-bold">الإجمالي</td>
                    <td class="font-bold">${window.calculatedData.totalNegativeDiff.toLocaleString('ar-SA')}</td>
                </tr>`;
        }
        
        htmlContent += `</table>
            
            <div class="text-center mt-6" style="text-align: center !important; width: 100%; display: block;">
                <div class="font-bold" style="font-weight: bold !important;">صافي المبلغ: ${window.calculatedData.netDiff.toLocaleString('ar-SA')} ريال</div>
            </div>
            
            <!-- زر التحكم بالإعدادات - يظهر فقط في واجهة المستخدم وليس عند الطباعة -->
            <div class="mt-6 mb-2 text-center no-print">
                <button id="toggle-settings-btn" class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded" onclick="switchTab('settings');">
                    تعديل الإعدادات
                </button>
            </div>
        `;
        
        differenceForm.innerHTML = htmlContent;
        
        // تحديث النسخة المطبوعة
        const printDifferenceForm = document.getElementById('print-difference-form');
        if (printDifferenceForm) {
            // إزالة الأزرار من نسخة الطباعة
            const contentToPrint = htmlContent.replace(/<div class="mt-6 mb-2 text-center no-print">[\s\S]*?<\/div>/g, '');
            printDifferenceForm.innerHTML = contentToPrint;
        }
    } catch (error) {
        console.error("خطأ في عرض نموذج فروقات الترقية:", error);
        differenceForm.innerHTML = `
            <div class="p-4 bg-red-100 text-red-700 rounded-md">
                <p class="font-bold">حدث خطأ أثناء عرض النموذج:</p>
                <p>${error.message}</p>
                <p>يرجى المحاولة مرة أخرى أو التحقق من البيانات المدخلة.</p>
            </div>
        `;
    }
};

// عرض نموذج عدم أسبقية الصرف
window.previewDeclarationForm = function() {
    if (!window.calculatedData.name) {
        alert('يرجى حساب الفروقات أولاً');
        return;
    }
    
    // إخفاء جميع النماذج
    document.querySelectorAll('.preview-form').forEach(form => {
        if (form) form.classList.add('hidden');
    });
    
    // عرض نموذج عدم أسبقية الصرف
    const declarationForm = document.getElementById('declaration-form');
    if (!declarationForm) {
        console.error("لم يتم العثور على نموذج عدم أسبقية الصرف");
        return;
    }
    
    declarationForm.classList.remove('hidden');
    
    try {
        // تحويل تاريخ المباشرة
        const commencementDate = window.calculatedData.commencementDate ? new Date(window.calculatedData.commencementDate) : null;
        
        // العنوان والمحتوى
        let htmlContent = `
            <div class="text-center font-bold text-xl mb-6">إقرار عدم أسبقية صرف</div>
            
            <div class="text-center mb-8">
                <p class="mb-2">أقر أنا/ ${window.calculatedData.name}</p>
                <p class="mb-2">رقم الهوية: ${window.calculatedData.idNumber ? window.toArabicNumbers(window.calculatedData.idNumber) : '_________________'}</p>
                <p class="mb-2">الرقم العام: ${window.toArabicNumbers(window.calculatedData.generalNumber)}</p>
                <p class="mb-2">الرتبة: ${window.calculatedData.newRank}</p>
                <p class="mb-2">الوحدة: ${window.calculatedData.unit}</p>
            </div>
            
            <div class="mb-8">
                <p class="mb-4">بأنه لم يسبق لي صرف فروقات مالية خاصة بترقيتي من رتبة ${window.calculatedData.oldRank} إلى رتبة ${window.calculatedData.newRank} اعتباراً من تاريخ ${commencementDate ? commencementDate.toLocaleDateString('ar-SA', { calendar: 'islamic' }) : '_________________'}</p>
                <p class="mb-4">وفي حال ثبت خلاف ذلك فإنني أتحمل كامل المسؤولية وإعادة المبالغ التي تم صرفها لي دون وجه حق.</p>
            </div>
            
            <div class="mt-12">
                <div class="flex justify-around">
                    <div class="text-center">
                        <p class="font-bold mb-2">المقر بما فيه</p>
                        <p class="mb-1">الاسم: ${window.calculatedData.name}</p>
                        <p class="mb-1">التوقيع: _______________</p>
                        <p>التاريخ: _______________</p>
                    </div>
                    <div class="text-center">
                        <p class="font-bold mb-2">قائد الوحدة</p>
                        <p class="mb-1">الاسم: _______________</p>
                        <p class="mb-1">التوقيع: _______________</p>
                        <p>التاريخ: _______________</p>
                    </div>
                </div>
            </div>
        `;
        
        declarationForm.innerHTML = htmlContent;
        
        // تحديث النسخة المطبوعة
        const printDifferenceForm = document.getElementById('print-difference-form');
        if (printDifferenceForm) {
            printDifferenceForm.innerHTML = htmlContent;
        }
    } catch (error) {
        console.error("خطأ في عرض نموذج عدم أسبقية الصرف:", error);
        declarationForm.innerHTML = `
            <div class="p-4 bg-red-100 text-red-700 rounded-md">
                <p class="font-bold">حدث خطأ أثناء عرض النموذج:</p>
                <p>${error.message}</p>
                <p>يرجى المحاولة مرة أخرى أو التحقق من البيانات المدخلة.</p>
            </div>
        `;
    }
};

// طباعة النموذج الحالي
window.printCurrentForm = function() {
    window.print();
};

// تصدير النموذج الحالي كملف Word
window.downloadAsWordDoc = function() {
    alert('سيتم تطوير خاصية التصدير إلى Word قريبًا');
};

// إضافة العسكري إلى القائمة
window.addToList = function() {
    if (!window.calculatedData.name) {
        alert('يرجى حساب الفروقات أولاً');
        return;
    }
    
    // إضافة البيانات إلى القائمة
    const person = {
        id: Date.now().toString(),
        name: window.calculatedData.name,
        generalNumber: window.calculatedData.generalNumber,
        unit: window.calculatedData.unit,
        rank: window.calculatedData.newRank,
        startDate: window.calculatedData.startDate,
        endDate: window.calculatedData.endDate,
        amount: window.calculatedData.netDiff
    };
    
    window.peopleList.push(person);
    
    // حفظ القائمة في localStorage
    window.savePeopleList();
    
    // تحديث عرض القائمة
    window.updatePeopleTable();
    
    // عرض رسالة نجاح
    alert(`تم إضافة ${window.calculatedData.name} إلى القائمة بنجاح`);
    
    // الانتقال إلى تبويب القائمة
    window.switchTab('list');
};

// باقي الوظائف
window.exportList = function() {
    if (window.peopleList.length === 0) {
        alert('لا توجد بيانات للتصدير');
        return;
    }
    
    try {
        // إنشاء نص CSV
        let csvContent = 'الاسم,الرقم العام,الوحدة,الرتبة,من تاريخ,إلى تاريخ,المبلغ\n';
        
        window.peopleList.forEach(person => {
            csvContent += `"${person.name}","${person.generalNumber}","${person.unit}","${person.rank}","${new Date(person.startDate).toLocaleDateString()}","${new Date(person.endDate).toLocaleDateString()}","${person.amount.toLocaleString()}"\n`;
        });
        
        // إنشاء رابط التنزيل
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'قائمة_فروقات_الترقية.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('خطأ في تصدير القائمة:', error);
        alert('حدث خطأ أثناء تصدير القائمة');
    }
};

window.clearList = function() {
    if (window.peopleList.length === 0) {
        alert('القائمة فارغة بالفعل');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف جميع الأسماء من القائمة؟')) {
        window.peopleList = [];
        window.savePeopleList();
        window.updatePeopleTable();
        alert('تم حذف جميع الأسماء من القائمة بنجاح');
    }
};

window.resetForm = function() {
    if (confirm('هل أنت متأكد من إعادة تعيين النموذج؟')) {
        // إعادة تعيين حقول البيانات الأساسية
        document.getElementById('name').value = '';
        document.getElementById('general-number').value = '';
        document.getElementById('id-number').value = '';
        document.getElementById('unit').value = window.appSettings.defaults.unit;
        document.getElementById('start-date').value = '';
        document.getElementById('end-date').value = '';
        document.getElementById('commencement-date').value = '';
        
        // إعادة تعيين الرتبة والدرجة
        document.getElementById('old-rank').value = 'جندي';
        document.getElementById('new-rank').value = 'جندي أول';
        document.getElementById('old-degree').value = '1';
        document.getElementById('new-degree').value = '1';
        
        // إعادة تعيين مفردات الراتب
        document.getElementById('old-basic-salary').value = '';
        document.getElementById('new-basic-salary').value = '';
        document.getElementById('old-terrorism').value = '';
        document.getElementById('new-terrorism').value = '';
        document.getElementById('old-security').value = '';
        document.getElementById('new-security').value = '';
        document.getElementById('old-retirement').value = '';
        document.getElementById('new-retirement').value = '';
        
        // حذف البدلات الإضافية
        const allowanceRows = document.querySelectorAll('#allowances-table tbody tr[data-allowance-id]');
        allowanceRows.forEach(row => row.remove());
        
        // إعادة تعيين قوائم البدلات
        window.customAllowances = [];
        window.deletedAllowances = [];
        
        // استعادة الصفوف المخفية
        window.restoreHiddenRows();
        
        // تحديث سلم الرواتب
        window.updateSalaryScale();
    }
};

// Initialize event listeners  (Added to the end for clarity)
document.getElementById('old-rank').addEventListener('change', window.updateRankAndDegree);
document.getElementById('new-rank').addEventListener('change', window.updateSalaryScale);
document.getElementById('old-degree').addEventListener('change', window.updateBasedOnOldDegree);
document.getElementById('new-degree').addEventListener('change', window.updateSalaryScale);
});