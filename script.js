document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const heroImage = document.getElementById('hero-image');
    const themeToggle = document.getElementById('theme-toggle');
    const userAvatar = document.getElementById('user-avatar');
    const userMenu = document.getElementById('user-menu');
    const registerBtn = document.getElementById('register-btn');
    const signupModal = document.getElementById('signup-modal');
    const loginModal = document.getElementById('login-modal');
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const runCodeBtn = document.getElementById('run-code-btn');
    const codeEditor = document.getElementById('code-editor');
    const outputContainer = document.getElementById('output-container');
    const loginLinkFromSignup = document.getElementById('login-link-from-signup');
    const signupLinkFromLogin = document.getElementById('signup-link-from-login');

    // Simulated Firebase Configuration
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Simulated Firebase Implementation
    const firebaseApp = {
        initializeApp: (config) => {
            console.log('Firebase Initialized (Simulated):', config);
        },
        auth: () => ({
            createUserWithEmailAndPassword: (email, password) => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (email && password) {
                            console.log(`User created (Simulated): ${email}`);
                            resolve({ user: { email } });
                        } else {
                            reject(new Error('Invalid email or password'));
                        }
                    }, 1000);
                });
            },
            signInWithEmailAndPassword: (email, password) => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        if (email && password) {
                            console.log(`User signed in (Simulated): ${email}`);
                            resolve({ user: { email } });
                        } else {
                            reject(new Error('Invalid email or password'));
                        }
                    }, 1000);
                });
            },
            signOut: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        console.log('User signed out (Simulated)');
                        resolve();
                    }, 500);
                });
            }
        }),
        firestore: () => ({
            collection: (collectionName) => ({
                add: (data) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            console.log(`Data added to ${collectionName} (Simulated):`, data);
                            resolve({ id: 'simulated_doc_id' });
                        }, 500);
                    });
                },
                doc: (docId) => ({
                    set: (data) => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                console.log(`Data set for document ${docId} in ${collectionName} (Simulated):`, data);
                                resolve();
                            }, 500);
                        });
                    }
                })
            }),
            doc: (path) => ({
                get: () => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            console.log(`Got document at ${path} (Simulated)`);
                            resolve({
                                exists: true,
                                data: () => ({ name: 'Simulated User', email: 'simulated@example.com' })
                            });
                        }, 500);
                    });
                }
            })
        })
    };

    firebaseApp.initializeApp(firebaseConfig);

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hero Image Load Animation
    if (heroImage) {
        heroImage.onload = () => {
            heroImage.classList.add('loaded');
        };
    }

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeToggle.querySelector('i').className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('theme', newTheme);
    });

    // Load Saved Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.querySelector('i').className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

    // User Menu Toggle
    userAvatar.addEventListener('click', () => {
        userMenu.classList.toggle('active');
    });

    // Close User Menu on Outside Click
    document.addEventListener('click', (e) => {
        if (!userAvatar.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });

    // Signup Modal Toggle
    registerBtn.addEventListener('click', () => {
        signupModal.classList.add('active');
    });

    // Toggle Between Modals
    loginLinkFromSignup.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    signupLinkFromLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    });

    // Close Modals
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            signupModal.classList.remove('active');
            loginModal.classList.remove('active');
        });
    });

    // Close Modals on Outside Click
    signupModal.addEventListener('click', (e) => {
        if (e.target === signupModal) {
            signupModal.classList.remove('active');
        }
    });

    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

    // Handle Signup Form Submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = signupForm.querySelector('#signup-name').value;
        const email = signupForm.querySelector('#signup-email').value;
        const password = signupForm.querySelector('#signup-password').value;
        const submitBtn = signupForm.querySelector('button[type="submit"]');

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const userCredential = await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            await firebaseApp.firestore().collection('users').doc(user.email).set({
                name,
                email,
                createdAt: new Date().toISOString()
            });

            alert('Account created successfully! (Simulated)');
            signupModal.classList.remove('active');
            signupForm.reset();
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Handle Login Form Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('#login-email').value;
        const password = loginForm.querySelector('#login-password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const userCredential = await firebaseApp.auth().signInWithEmailAndPassword(email, password);
            alert('Signed in successfully! (Simulated)');
            loginModal.classList.remove('active');
            loginForm.reset();
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Interactive Code Editor
    runCodeBtn.addEventListener('click', () => {
        const code = codeEditor.value;
        outputContainer.textContent = '';

        try {
            const originalConsoleLog = console.log;
            let output = '';
            console.log = (msg) => {
                output += `${msg}\n`;
            };

            const func = new Function(code);
            func();

            console.log = originalConsoleLog;
            outputContainer.textContent = output || 'No output';
            outputContainer.style.color = '#fff';
        } catch (error) {
            outputContainer.textContent = `Error: ${error.message}`;
            outputContainer.style.color = '#ff6b6b';
        }
    });
});