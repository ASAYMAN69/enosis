/* Subscribe Form Logic */

function subscribeUser() {
    const name = document.getElementById('subscribeName').value.trim();
    const email = document.getElementById('subscribeEmail').value.trim();

    if (!name || !email) {
        alert('Please fill in both name and email');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    const payload = {
        name: name,
        email: email
    };

    fetch('https://n8n.enosisltd.com/webhook/keep-updated-main-page', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        showSubscribeConfirmation();
        document.getElementById('subscribeName').value = '';
        document.getElementById('subscribeEmail').value = '';
    })
    .catch(error => {
        console.error('Subscription error:', error);
        showSubscribeConfirmation();
        document.getElementById('subscribeName').value = '';
        document.getElementById('subscribeEmail').value = '';
    });
}

function showSubscribeConfirmation() {
    document.getElementById('subscribeModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
