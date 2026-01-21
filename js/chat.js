(function() {

    // ---- 1. Inject Styles ----
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

        @keyframes ripple {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.6); opacity: 0; }
        }

        @keyframes blink {
            0%, 80%, 100% { opacity: 0; }
            40% { opacity: 1; }
        }

        .ripple-active::after {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(222, 114, 213, 0.4);
            border-radius: 50%;
            z-index: -1;
            animation: ripple 2s infinite;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }

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

        .icon-transition { transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }

        /* Container positioning */
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
            width: 384px;
            max-width: 90vw;
            height: 600px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border: 1px solid #e2e8f0;
            position: relative;
            transform-origin: bottom right;
            opacity: 0;
            transform: scale(0.5) translateY(20px);
            transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
        }

        #chatbot-window.is-active {
            opacity: 1;
            transform: scale(1) translateY(0);
        }

        /* Header */
        .glass-header {
            padding: 24px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            overflow: hidden;
            background: rgba(15,23,42,0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            flex-shrink: 0;
        }

        .glass-header .header-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(to right, #10b981, #06b6d4);
        }

        .glass-header .profile {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .glass-header .profile img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 2px solid rgba(16,185,129,0.3);
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .glass-header .status-dot {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 14px;
            height: 14px;
            background: #10b981;
            border: 2px solid #0f172a;
            border-radius: 50%;
        }

        .glass-header .profile-text h4 {
            font-weight: bold;
            font-size: 1.125rem;
            margin: 0;
            line-height: 1.2;
        }

        .glass-header .profile-text span {
            font-size: 0.625rem;
            color: #34d399;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        #chatbot-close {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            color: #cbd5e1;
            border: none;
            cursor: pointer;
            transition: background 0.2s;
        }

        #chatbot-close:hover {
            background: rgba(255,255,255,0.1);
        }

        /* Messages */
        #chatbot-messages {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 24px;
            gap: 16px;
            background: linear-gradient(to bottom, #f8fafc, #ffffff);
        }

        #chatbot-messages .timestamp {
            text-align: center;
            font-size: 10px;
            font-weight: bold;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.2em;
        }

        /* Input area */
        #chatbot-form {
            display: flex;
            gap: 12px;
            padding: 24px;
            background: #f1f5f9;
            border-top: 1px solid #e2e8f0;
            border-radius: 16px;
        }

        #chatbot-input {
            flex: 1;
            font-size: 0.875rem;
            border: none;
            outline: none;
            background: transparent;
        }

        #chatbot-form button {
            font-size: 1.125rem;
            color: #10b981;
            border: none;
            background: transparent;
            cursor: pointer;
            transition: transform 0.2s;
        }

        #chatbot-form button:hover {
            transform: scale(1.1);
        }

        /* Toggle button */
        #chatbot-toggle {
            position: relative;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: #0f172a;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        }

        #chatbot-toggle i {
            position: absolute;
        }

        #icon-close {
            opacity: 0;
            transform: rotate(-90deg) scale(0.5);
        }

        /* Active chat icons */
        #chatbot-window.is-active ~ #chatbot-toggle #icon-msg {
            opacity: 0;
            transform: rotate(90deg) scale(0.5);
        }

        #chatbot-window.is-active ~ #chatbot-toggle #icon-close {
            opacity: 1;
            transform: rotate(0deg) scale(1);
        }
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
                <div class="header-bar"></div>
                <div class="profile">
                    <div style="position: relative;">
                        <img src="https://ui-avatars.com/api/?name=AI&background=10b981&color=fff">
                        <span class="status-dot"></span>
                    </div>
                    <div class="profile-text">
                        <h4>Aria</h4>
                        <span>AI Strategist</span>
                    </div>
                </div>
                <button id="chatbot-close"><i class="fas fa-times"></i></button>
            </div>

            <div id="chatbot-messages">
                <div class="timestamp">Today • Online</div>
            </div>

            <form id="chatbot-form">
                <input type="text" id="chatbot-input" placeholder="Type a message..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
                <button type="submit"><i class="fas fa-paper-plane"></i></button>
            </form>
        </div>

        <button id="chatbot-toggle" class="ripple-active">
            <i id="icon-msg" class="fas fa-comment-dots"></i>
            <i id="icon-close" class="fas fa-chevron-down"></i>
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
        win.classList.toggle('is-active');
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

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message';
        userMsg.style.background = '#0f172a';
        userMsg.style.color = 'white';
        userMsg.style.padding = '16px';
        userMsg.style.borderRadius = '24px';
        userMsg.style.borderBottomRightRadius = '4px';
        userMsg.style.alignSelf = 'flex-end';
        userMsg.style.maxWidth = '80%';
        userMsg.innerText = text;
        messages.appendChild(userMsg);
        requestAnimationFrame(() => userMsg.classList.add('show'));
        messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
        input.value = '';

        const typingBubble = document.createElement('div');
        typingBubble.className = 'chat-message';
        typingBubble.style.background = 'white';
        typingBubble.style.color = 'black';
        typingBubble.style.padding = '16px';
        typingBubble.style.borderRadius = '24px';
        typingBubble.style.borderBottomLeftRadius = '4px';
        typingBubble.style.alignSelf = 'flex-start';
        typingBubble.style.maxWidth = '80%';
        typingBubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
        messages.appendChild(typingBubble);
        requestAnimationFrame(() => typingBubble.classList.add('show'));
        messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });

        fetch('https://tahmidn8n.solven.app/webhook-test/retain-chatwidget', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_msg: text, session_id })
        })
        .then(res => res.json())
        .then(data => {
            typingBubble.innerHTML = data.reply || '';
            messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
        });
    });

})();
