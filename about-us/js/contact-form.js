/* Contact Form Submission */

function submitContactForm(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const interest = document.getElementById('interest').value;
    const message = document.getElementById('message').value.trim() || '';
    const ownerOrBuyer = document.querySelector('input[name="owner_or_buyer"]:checked')?.value || 'owner';
    const location = document.getElementById('location').value.trim() || '';

    if (!name || !email || !phone || !interest) {
        alert('Please fill in all required fields');
        return;
    }

    const payload = {
        name: name,
        email: email,
        phone: phone,
        interest: interest,
        owner_or_buyer: ownerOrBuyer,
        location: location,
        message: message
    };

    fetch('https://n8n.enosisltd.com/webhook/contact-us', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        showContactConfirmation();
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('interest').value = '';
        document.getElementById('location').value = '';
        document.getElementById('message').value = '';
    })
    .catch(error => {
        console.error('Contact form error:', error);
        showContactConfirmation();
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('interest').value = '';
        document.getElementById('location').value = '';
        document.getElementById('message').value = '';
    });
}

function showContactConfirmation() {
    document.getElementById('contactModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
