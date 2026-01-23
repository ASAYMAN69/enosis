(function() {
    // ---- 1. Inject Styles ----
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

        /* Animations */
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
            background: rgba(222, 114, 213, 0.4);
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
            background-color: black;
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
            width: 384px;
            max-width: 90vw;
            height: 600px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border: 1px solid #e2e8f0;
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
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
            background: rgba(15,23,42,0.9);
            color: white;
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
            background: linear-gradient(to right, #10b981, #06b6d4);
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
            border: 2px solid rgba(16,185,129,0.3);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .avatar-wrapper span {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 14px;
            height: 14px;
            background: #10b981;
            border: 2px solid #0f172a;
            border-radius: 50%;
        }
        .user-text h4 {
            font-weight: bold;
            font-size: 1.125rem;
            line-height: 1;
        }
        .user-text span {
            font-size: 0.75rem;
            color: #4ade80;
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
            color: #cbd5e1;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }
        #chatbot-close:hover { background: rgba(255,255,255,0.1); }

        /* Messages */
        #chatbot-messages {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 24px;
            gap: 16px;
            background: linear-gradient(to bottom, #f8fafc, white);
        }
        #chatbot-messages .date-separator {
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.2em;
        }

        /* Input form */
        #chatbot-form {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #f1f5f9;
            border-radius: 24px;
            padding: 12px 20px;
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
            color: #10b981;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        #chatbot-form button:hover { transform: scale(1.1); }

        /* Toggle button */
        #chatbot-toggle {
            position: relative;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: #0f172a;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 25px 50px rgba(0,0,0,0.1);
            z-index: 10000;
            border: none;
            cursor: pointer;
        }
        #chatbot-toggle i { position: absolute; }
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
            <div>
                <form id="chatbot-form">
                    <input type="text" id="chatbot-input" placeholder="Type a message..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                    <button type="submit"><i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
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
            btn.style.backgroundColor = '#0f172a';
            btn.style.color = '#ffffff';
            btn.classList.add('ripple-active');
        } else {
            win.classList.add('is-active');
            iconMsg.style.opacity = '0';
            iconMsg.style.transform = 'rotate(90deg) scale(0.5)';
            iconClose.style.opacity = '1';
            iconClose.style.transform = 'rotate(0) scale(1)';
            btn.style.backgroundColor = '#ffffff';
            btn.style.color = '#0f172a';
            btn.classList.remove('ripple-active');
        }
    }
    btn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

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
        userMsg.style.backgroundColor = '#0f172a';
        userMsg.style.color = 'white';
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
        typingBubble.style.backgroundColor = 'white';
        typingBubble.style.color = 'black';
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
            typingBubble.innerHTML = data.output || '';
            messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
        });
    });
})();