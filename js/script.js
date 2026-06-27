// داتا الباقات (مطابقة تماماً للصور)
const packagesData = {
    vodafone: [
        { name: "20 جيجا + 1500 دقيقة", price: "400" },
        { name: "25 جيجا + 1500 دقيقة", price: "450" },
        { name: "30 جيجا + 1500 دقيقة", price: "500" },
        { name: "40 جيجا + 1500 دقيقة", price: "600" },
        { name: "50 جيجا + 1500 دقيقة", price: "650" },
        { name: "65 جيجا + 1500 دقيقة", price: "800" },
        { name: "80 جيجا + 1500 دقيقة", price: "900" }
    ],
    orange: [
        { name: "10 جيجا + 1000 دقيقة", price: "280" },
        { name: "14 جيجا + 1000 دقيقة", price: "325" },
        { name: "20 جيجا + 1500 دقيقة", price: "395" },
        { name: "28 جيجا + 1500 دقيقة", price: "450" },
        { name: "40 جيجا + 1500 دقيقة", price: "580" },
        { name: "2000 دقيقة فقط", price: "150" }
    ],
    etisalat: [
        { name: "14 جيجا + 1500 دقيقة", price: "290" },
        { name: "20 جيجا + 1500 دقيقة", price: "345" },
        { name: "30 جيجا + 1500 دقيقة", price: "450" },
        { name: "35 جيجا + 1500 دقيقة", price: "475" },
        { name: "40 جيجا + 1700 دقيقة", price: "520" },
        { name: "50 جيجا + 1700 دقيقة", price: "600" },
        { name: "65 جيجا + 1700 دقيقة", price: "700" },
        { name: "80 جيجا + 1700 دقيقة", price: "850" }
    ],
    we: [
        { name: "5 جيجا + 500 دقيقة", price: "190" },
        { name: "10 جيجا + 500 دقيقة", price: "220" },
        { name: "15 جيجا + 750 دقيقة", price: "250" },
        { name: "20 جيجا + 1000 دقيقة", price: "290" },
        { name: "25 جيجا + 1000 دقيقة", price: "350" },
        { name: "30 جيجا + 1500 دقيقة", price: "350" },
        { name: "35 جيجا + 1500 دقيقة", price: "400" },
        { name: "40 جيجا + 1500 دقيقة", price: "450" },
        { name: "50 جيجا + 1500 دقيقة", price: "550" },
        { name: "60 جيجا + 1500 دقيقة", price: "600" },
        { name: "70 جيجا + 1500 دقيقة", price: "700" }
    ]
};

let currentOrder = { networkName: '', packageName: '', price: '' };

// التنقل بين الخطوات
function goToStep(step) {
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('step-3').classList.add('hidden');
    
    document.getElementById(`step-${step}`).classList.remove('hidden');
    
    // تحديث الـ Tracker
    document.querySelectorAll('.step-item').forEach((item, index) => {
        if (index + 1 <= step) item.classList.add('active');
        else item.classList.remove('active');
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// اختيار الشبكة
function selectNetwork(id, name) {
    currentOrder.networkName = name;
    renderPackages(id);
    goToStep(2);
}

// عرض الباقات
function renderPackages(id) {
    const container = document.getElementById('packages-list');
    container.innerHTML = '';
    packagesData[id].forEach(plan => {
        const div = document.createElement('div');
        div.className = 'pkg-card';
        div.innerHTML = `
            <div class="pkg-info">
                <h4>${plan.name}</h4>
                <p>سعر الباقة</p>
            </div>
            <div class="pkg-price">${plan.price} ج</div>
            <button class="btn-select" style="background: var(--primary);" 
                    onclick="selectPackage('${plan.name}', '${plan.price}')">اختيار</button>
        `;
        container.appendChild(div);
    });
}

// اختيار الباقة والانتقال لخطوة الدفع
function selectPackage(name, price) {
    currentOrder.packageName = name;
    currentOrder.price = price;
    document.getElementById('summary-network').innerText = "الشركة: " + currentOrder.networkName;
    document.getElementById('summary-package').innerText = currentOrder.packageName;
    document.getElementById('summary-price').innerText = currentOrder.price + ' جنيه';
    goToStep(3);
}

// تغيير اسم الملف
function updateFileName(input) {
    const display = document.getElementById('file-name-display');
    if (input.files && input.files[0]) {
        display.innerHTML = `<span style="color:var(--success)">تم اختيار: ${input.files[0].name}</span>`;
    }
}

async function submitOrder() {
    const name = document.getElementById('client-name').value;
    const phone = document.getElementById('client-phone').value;
    const transferCode = document.getElementById('transfer-code').value;
    const notes = document.getElementById('transfer-notes').value || "لا يوجد";
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const fileInput = document.getElementById('receipt-file');
    const file = fileInput.files[0];

    // التأكد من وجود البيانات والصورة
    if (!name || !phone || !transferCode || !file) {
        alert("برجاء ملء جميع البيانات ورفع صورة الإيصال");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Image = e.target.result.split(',')[1];
        
        // إظهار رسالة انتظار
        alert("جاري رفع البيانات والإيصال... انتظر لحظة");

        try {
            await fetch('https://script.google.com/macros/s/AKfycbygH3cNXT5mPHQ2Wqjiw0yRJ3-C89ogmWz5ZgK3wIO9vJ43B0BSpSZWjn2BKRPvmA6s8Q/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({ 
                    name: name,
                    phone: phone,
                    network: currentOrder.networkName,
                    package: currentOrder.packageName,
                    price: currentOrder.price,
                    payment: paymentMethod,
                    transferCode: transferCode,
                    notes: notes,
                    image: base64Image,
                    mimeType: file.type,
                    fileName: file.name
                })
            });

            // لو وصل هنا يبقى رفع بنجاح 
            alert("تم إرسال الطلب بنجاح! سيتم تحويلك للواتساب لتأكيد التفعيل...");
            
            // تجهيز رسالة الواتساب
            const message = `*طلب حجز جديد (تيم النزلاوي)* 🚀\n\n` +
                            `🌐 الشركة: ${currentOrder.networkName}\n` +
                            `📦 الباقة: ${currentOrder.packageName}\n` +
                            `💰 السعر: ${currentOrder.price} جنيه\n\n` +
                            `👤 الاسم: ${name}\n` +
                            `📞 رقم التفعيل: ${phone}\n` +
                            `💳 الدفع: ${paymentMethod}\n` +
                            `🔢 آخر 4 أرقام: ${transferCode}\n` +
                            `📝 ملاحظات: ${notes}`;

            // الحل الإجباري لتحويل الصفحة فوراً للواتساب بدون فتح تاب جديدة (عشان نتخطى الحظر)
            window.location.href = `https://wa.me/201121844925?text=${encodeURIComponent(message)}`;
            
        } catch (error) {
            console.error("خطأ:", error);
            alert("حدث خطأ، لكن قد يكون تم الرفع بنجاح. يرجى مراجعة الشيت.");
        }
    };
    reader.readAsDataURL(file);
}