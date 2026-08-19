


// active class

document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.navbar-nav .nav-link');
    links.forEach(link => {
        link.addEventListener('click', function () {
            links.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// button to move top



function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("backToTopBtn").style.display = "block";
    } else {
        document.getElementById("backToTopBtn").style.display = "none";
    }
}
function scrollToTop() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
}
window.onscroll = function () {
    scrollFunction();
};



// Select All Bullets
const allBullets = document.querySelectorAll(".nav-bullets .bullet");

function scrollToSection(elements) {
    elements.forEach(ele => {
        ele.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector(e.currentTarget.dataset.section).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

scrollToSection(allBullets);

// contact us

/**
 * Sends the enquiry form. The previous version posted whatever was typed and
 * reported failures only to the console, so a visitor saw no response at all
 * when the request failed.
 */
function sendMessage() {
    const button = document.getElementById('sendMessageButton');
    const status = document.getElementById('contactStatus');
    const utils = window.AppUtils;

    const fields = {
        name: document.getElementById('Name').value.trim(),
        phone: document.getElementById('Phone').value.trim(),
        email: document.getElementById('Email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('Message').value.trim(),
    };

    if (!fields.name || !fields.phone || !fields.subject || !fields.message) {
        utils.setStatus(status, 'error', 'يرجى تعبئة الاسم ورقم الجوال والموضوع والرسالة.');
        return;
    }
    if (!/^05\d{8}$/.test(fields.phone)) {
        utils.setStatus(status, 'error', 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.');
        return;
    }

    if (button) button.disabled = true;
    utils.setStatus(status, 'loading', 'جارٍ إرسال رسالتك…');

    axios
        .post(API.url('/message/addMessage'), fields)
        .then(() => {
            utils.setStatus(status, 'empty', 'تم إرسال رسالتك بنجاح. سنتواصل معك قريبًا.');
            document.getElementById('contactForm').reset();
        })
        .catch((error) => {
            utils.setStatus(status, 'error', utils.errorMessage(error));
        })
        .then(() => {
            if (button) button.disabled = false;
        });
}
