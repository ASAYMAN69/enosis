(function() {
    // ---- 1. Inject Styles ----
    const fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(fa);

    const domPurifyScript = document.createElement('script');
    domPurifyScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.0.6/purify.min.js';
    document.head.appendChild(domPurifyScript);

    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            /* Website Palette */
            --website-color-a: #556B2F; /* Dark Green */
            --website-color-b: #D4E38A; /* Light Green/Yellow */
            --website-color-c: #FFFFFF; /* White */
            --website-color-d: #8FA31E; /* Olive Green */
            --website-color-dark-grey: #0a0a0a;
            --website-color-mid-grey: #555;
            --website-color-darker-olive: #6d7d16;

            /* RGB components for rgba usage */
            --website-color-a-rgb: 85, 107, 47;
            --website-color-b-rgb: 212, 227, 138;
            --website-color-c-rgb: 255, 255, 255;
            --website-color-d-rgb: 143, 163, 30;

            /* Chat Widget Colors, mapped to Website Palette */
            --chat-color-primary-dark: var(--website-color-dark-grey);
            --chat-color-primary-light: var(--website-color-c);
            --chat-color-accent-primary: var(--website-color-d); /* Used for main accents */
            --chat-color-accent-secondary: var(--website-color-darker-olive); /* Used for gradients with primary accent */
            --chat-color-text-faded: var(--website-color-mid-grey);
            --chat-color-border: rgba(var(--website-color-c-rgb), 0.1);
            --chat-color-input-bg: rgba(var(--website-color-c-rgb), 0.15);
            --chat-color-ripple: rgba(var(--website-color-b-rgb), 0.6);
            --chat-color-avatar-border: rgba(var(--website-color-a-rgb), 0.3);
            --chat-color-avatar-shadow: rgba(0,0,0,0.3);
            --chat-color-ai-strategist: var(--website-color-d);
            --chat-color-close-btn: var(--website-color-c);
            --chat-color-close-btn-hover: rgba(var(--website-color-c-rgb), 0.1);
            --chat-color-typing-dots: var(--website-color-a);
            --chat-color-chat-bg-gradient-start: rgba(var(--website-color-c-rgb), 0.95);
            --chat-color-toggle-shadow: rgba(0,0,0,0.3);
        }

        :root {
        @keyframes ripple {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes blink {
            0%, 80%, 100% { opacity: 0; }
            40% { opacity: 1; }
        }

        /* Ripple effect */
        .ripple-active::after {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--chat-color-ripple);
            border-radius: 9999px;
            z-index: -1;
            animation: ripple 2s infinite;
        }

        /* Hide scrollbar */
        .no-scrollbar::-webkit-scrollbar { display: none; }

        /* Chat message */
        .chat-message {
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s ease;
            display: inline-block;
            word-break: break-word;
        }
        .chat-message.show {
            transform: translateY(0);
            opacity: 1;
        }

        /* Typing dots */
        .typing-dots {
            display: inline-flex;
            gap: 3px;
            align-items: center;
            justify-content: center;
        }
        .typing-dots span {
            width: 6px;
            height: 6px;
            background-color: var(--chat-color-typing-dots);
            border-radius: 50%;
            animation: blink 1.4s infinite both;
        }
        .typing-dots span:nth-child(1) { animation-delay: 0s; }
        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        /* Icon transition */
        .icon-transition {
            transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
        }

        /* Chat container */
        #chatbot-container {
            position: fixed;
            bottom: 32px;
            right: 32px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-family: sans-serif;
        }

        /* Chat window */
        #chatbot-window {
            margin-bottom: 24px;
            width: 350px; /* Reduced width */
            max-width: 90vw;
            height: 550px; /* Reduced height */
            background: var(--chat-color-primary-light);
            border-radius: 24px;
            box-shadow: 0 25px 50px var(--chat-color-toggle-shadow);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--chat-color-border);
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            position: relative; /* Added for absolute positioning of children */
        }
        #chatbot-window.is-active {
            transform: translateY(0);
            opacity: 1;
        }

        /* Header */
        .glass-header {
            position: relative;
            padding: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--chat-color-primary-dark);
            color: var(--chat-color-primary-light);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            flex-shrink: 0;
        }
        .glass-header .top-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(to right, var(--chat-color-accent-primary), var(--chat-color-accent-secondary));
        }
        .user-info {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .avatar-wrapper {
            position: relative;
        }
        .avatar-wrapper img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid var(--chat-color-avatar-border);
            box-shadow: 0 4px 12px var(--chat-color-avatar-shadow);
        }
        .avatar-wrapper span {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 14px;
            height: 14px;
            background: var(--chat-color-accent-primary);
            border: 2px solid var(--chat-color-primary-dark);
            border-radius: 50%;
        }
        .user-text h4 {
            font-weight: bold;
            font-size: 1.125rem;
            line-height: 1;
        }
        .user-text span {
            font-size: 0.75rem;
            color: var(--chat-color-ai-strategist);
            font-weight: 500;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        /* Close button */
        #chatbot-close {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            color: var(--chat-color-close-btn);
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            outline: none; /* Remove outline on focus */
            -webkit-tap-highlight-color: transparent; /* Remove blue overlay on touch */
            font-size: 1.5rem; /* Increased size for the cross icon */
        }
        #chatbot-close:hover { background: var(--chat-color-close-btn-hover); }

        /* Messages */
        #chatbot-messages {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 24px;
            padding-bottom: 96px; /* Added to ensure space for floating form */
            gap: 16px;
            background: linear-gradient(to bottom, var(--chat-color-chat-bg-gradient-start), var(--chat-color-primary-light));
        }
        #chatbot-messages .date-separator {
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            color: var(--chat-color-text-faded);
            text-transform: uppercase;
            letter-spacing: 0.2em;
        }

        /* Input form */
        #chatbot-form {
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--chat-color-input-bg);
            border-radius: 24px;
            padding: 12px 20px;
            box-shadow: 0 8px 24px var(--chat-color-toggle-shadow); /* Shadow below */
            margin: 0 16px 16px 16px; /* Added margin to detach from edges */
            position: absolute; /* Changed to absolute to float it */
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 10; /* Ensure it's above other content */
        }
        #chatbot-input {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            font-size: 0.875rem;
        }
        #chatbot-form button {
            background: transparent;
            border: none;
            color: var(--chat-color-accent-primary);
            cursor: pointer;
            transition: transform 0.2s ease;
            outline: none; /* Remove outline on focus */
            -webkit-tap-highlight-color: transparent; /* Remove blue overlay on touch */
        }
        #chatbot-form button:hover { transform: scale(1.1); }

        /* Toggle button */
        #chatbot-toggle {
            position: relative;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: var(--chat-color-primary-dark);
            color: var(--chat-color-primary-light);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 25px 50px var(--chat-color-toggle-shadow);
            z-index: 10000;
            border: none;
            cursor: pointer;
            outline: none; /* Remove outline on focus */
            -webkit-tap-highlight-color: transparent; /* Remove blue overlay on touch */
        }
        #chatbot-toggle i { position: absolute; font-size: 1.8rem; }
        #icon-msg { opacity: 1; transform: rotate(0) scale(1); }
        #icon-close { opacity: 0; transform: rotate(-90deg) scale(0.5); }
    `;
    document.head.appendChild(style);

    // ---- 2. Session ID ----
    let session_id = sessionStorage.getItem('chatwidget_session_id');
    if (!session_id) {
        session_id = crypto.randomUUID();
        sessionStorage.setItem('chatwidget_session_id', session_id);
    }

    // ---- 3. Inject HTML ----
    const container = document.createElement('div');
    container.id = 'chatbot-container';
    container.innerHTML = `
        <div id="chatbot-window">
            <div class="glass-header">
                <div class="top-bar"></div>
                <div class="user-info">
                    <div class="avatar-wrapper">
                        <img src="assets/ai.svg" alt="avatar">
                        <span></span>
                    </div>
                    <div class="user-text">
                        <h4>Aria</h4>
                        <span>AI Strategist</span>
                    </div>
                </div>
                <button id="chatbot-close"><i class="fas fa-times"></i></button>
            </div>
            <div id="chatbot-messages">
                <div class="date-separator">Today • Online</div>
            </div>
            <form id="chatbot-form">
                <input type="text" id="chatbot-input" placeholder="Type a message..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                <button type="submit"><i class="fas fa-paper-plane"></i></button>
            </form>
        </div>

        <button id="chatbot-toggle" class="ripple-active">
            <i id="icon-msg" class="fas fa-comment-dots icon-transition"></i>
            <i id="icon-close" class="fas fa-chevron-down icon-transition"></i>
        </button>
    `;
    document.body.appendChild(container);

    // ---- 4. Toggle Logic ----
    const btn = document.getElementById('chatbot-toggle');
    const win = document.getElementById('chatbot-window');
    const iconMsg = document.getElementById('icon-msg');
    const iconClose = document.getElementById('icon-close');
    const closeBtn = document.getElementById('chatbot-close');

    function toggleChat() {
        const isActive = win.classList.contains('is-active');
        if (isActive) {
            win.classList.remove('is-active');
            iconMsg.style.opacity = '1';
            iconMsg.style.transform = 'rotate(0) scale(1)';
            iconClose.style.opacity = '0';
            iconClose.style.transform = 'rotate(-90deg) scale(0.5)';
            btn.style.backgroundColor = 'var(--chat-color-primary-dark)';
            btn.style.color = 'var(--chat-color-primary-light)';
            btn.classList.add('ripple-active');
        } else {
            win.classList.add('is-active');
            iconMsg.style.opacity = '0';
            iconMsg.style.transform = 'rotate(90deg) scale(0.5)';
            iconClose.style.opacity = '1';
            iconClose.style.transform = 'rotate(0) scale(1)';
            btn.style.backgroundColor = 'var(--chat-color-primary-light)';
            btn.style.color = 'var(--chat-color-primary-dark)';
            btn.classList.remove('ripple-active');
            input.focus(); // Auto-focus the input field
        }
    }
    btn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Close chat when clicking outside (using mousedown for better touch compatibility)
    document.body.addEventListener('mousedown', function(event) {
        const isClickInsideContainer = container.contains(event.target);
        const isChatActive = win.classList.contains('is-active');

        // Only close if chat is active and click is outside the entire chatbot container
        if (!isClickInsideContainer && isChatActive) {
            toggleChat();
        }
    });

    // Close chat when Escape key is pressed
    document.body.addEventListener('keydown', function(event) {
        const isChatActive = win.classList.contains('is-active');
        if (event.key === 'Escape' && isChatActive) {
            toggleChat();
        } else if (event.key === ' ' && !isChatActive) { // Spacebar
            event.preventDefault(); // Prevent scrolling
            toggleChat();
        }
    });

    // ---- 5. Message Sending + Typing ----
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        // User bubble
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message';
        userMsg.style.backgroundColor = 'var(--chat-color-primary-dark)';
        userMsg.style.color = 'var(--chat-color-primary-light)';
        userMsg.style.padding = '16px';
        userMsg.style.borderRadius = '24px';
        userMsg.style.borderBottomRightRadius = '0';
        userMsg.style.alignSelf = 'flex-end';
        userMsg.style.maxWidth = '80%';
        userMsg.innerText = text;
        messages.appendChild(userMsg);
        requestAnimationFrame(() => userMsg.classList.add('show'));
        messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
        input.value = '';

        // AI typing bubble
        const typingBubble = document.createElement('div');
        typingBubble.className = 'chat-message';
        typingBubble.style.backgroundColor = 'var(--chat-color-primary-light)';
        typingBubble.style.color = 'var(--chat-color-typing-dots)';
        typingBubble.style.padding = '16px';
        typingBubble.style.borderRadius = '24px';
        typingBubble.style.borderBottomLeftRadius = '0';
        typingBubble.style.alignSelf = 'flex-start';
        typingBubble.style.maxWidth = '80%';
        typingBubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        messages.appendChild(typingBubble);
        requestAnimationFrame(() => typingBubble.classList.add('show'));
        messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });

        // Send POST
        fetch('https://tahmidn8n.solven.app/webhook/enosisbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: text, session_id })
        })
        .then(res => res.json())
        .then(data => {
            typingBubble.innerHTML = DOMPurify.sanitize(data.output || '');
            messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
        });
    });
})();