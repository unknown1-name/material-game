      
        let materials = [];
        let score = 0;
        let currentMaterialIndex = 0;


        const isProduction = window.location.hostname === 'https://material-game.vercel.app';
        const baseURL = 'https://material-game.vercel.app';
        

        let isLoggedIn = false; // حالة تسجيل الدخول

        document.getElementById("signup-form").addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("signup-username").value;
            const password = document.getElementById("signup-password").value;
            const email = document.getElementById("signup-email").value;
            const phone = document.getElementById("signup-phone").value;
            const childName = document.getElementById('child-name').value;
            const childAge = document.getElementById('child-age').value;

            // التحقق من إدخال رقم هاتف مصري
            const egyptianPhoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
            if (!egyptianPhoneRegex.test(phone)) {
                document.getElementById("signup-error").textContent = "Please enter a valid Egyptian phone number.";
                return;
            }
            
            // إرسال البيانات إلى السيرفر
            const response = await fetch(`${baseURL}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, email, phone, childName, childAge}),
            });

            if (response.ok) {
                alert("Sign up successful! Please sign in.");
                showLogin();
            } else {
                const error = await response.text();
                document.getElementById("signup-error").textContent = error;
            }
        });
        async function signup() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const childName = document.getElementById('child-name').value;
            const childAge = document.getElementById('child-age').value;
        
            try {
                const response = await fetch(`${baseURL}/api/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password, email, phone, childName, childAge}),
                });
        
                if (!response.ok) {
                    throw new Error('Sign Up failed.');
                }
        
                alert('Sign Up successful.');
                document.getElementById('signup-page').style.display = 'none';
                document.getElementById('login-page').style.display = 'block';
            } catch (err) {
                console.error(err.message);
                alert('Sign Up failed.');
            }
        }
        
        document.getElementById("signin-form").addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("signin-username").value;
            const password = document.getElementById("signin-password").value;

            // إرسال بيانات تسجيل الدخول
            const response = await fetch(`${baseURL}/api/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                isLoggedIn = true;
                updateUIAfterLogin(username);
            } else {
                const error = await response.text();
                document.getElementById("signin-error").textContent = error;
            }
        });

        async function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
        
            try {
                const response = await fetch(`${baseURL}/api/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });
        
                if (!response.ok) {
                    throw new Error('Login failed.');
                }
        
                // حفظ اسم المستخدم في localStorage
                localStorage.setItem('username', username);
                showParentInfo(username);
                alert('Login successful.');
            } catch (err) {
                console.error(err.message);
                alert('Login failed.');
            }
        }

        function showParentInfo(username) {
            // إخفاء صفحة تسجيل الدخول
            document.getElementById("signin-section").style.display = "none";
            document.getElementById("game-section").style.display = "none";
            document.getElementById("leaderboard-section").style.display = "none";
            document.getElementById("parent-info-section").style.display = "block";
            document.getElementById("game-settings").style.display = "block";

            // جلب وعرض بيانات المستخدم
            fetchUserInfo(username);
        }

        function updateUIAfterLogin(username) {
            alert(`Welcome, ${username}!`);
            localStorage.setItem("isLoggedIn", "true"); // تخزين حالة تسجيل الدخول
            localStorage.setItem("username", username); // تخزين اسم المستخدم
            updateButtons(); // تحديث الأزرار
            showGame(); // العودة إلى اللعبة
        }

        function logout() {
            localStorage.removeItem("isLoggedIn"); // إزالة حالة تسجيل الدخول
            localStorage.removeItem("username"); // إزالة اسم المستخدم
            updateButtons(); // تحديث الأزرار
            alert("You have logged out.");
            location.reload();
        }

        function updateButtons() {
            const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

            if (isLoggedIn) {
                document.getElementById("login-btn").style.display = "none";
                document.getElementById("signup-btn").style.display = "none";
                document.getElementById("login-btn2").style.display = "none";
                document.getElementById("signup-btn2").style.display = "none";
                document.getElementById("logout-btn").style.display = "inline-block";
                document.getElementById("logout-btn2").style.display = "inline-block";
                document.getElementById("parent-info-btn").disabled = false;
                document.getElementById("parent-info-btn2").disabled = false;
            } else {
                document.getElementById("login-btn").style.display = "inline-block";
                document.getElementById("signup-btn").style.display = "inline-block";
                document.getElementById("login-btn2").style.display = "inline-block";
                document.getElementById("signup-btn2").style.display = "inline-block";
                document.getElementById("logout-btn").style.display = "none";
                document.getElementById("logout-btn2").style.display = "none";
                document.getElementById("parent-info-btn").disabled = true;
                document.getElementById("parent-info-btn2").disabled = true;
            }
        }

        // استعادة حالة تسجيل الدخول عند تحميل الصفحة
        window.onload = function () {
            updateButtons();
        };

        function showLogin() {
            document.getElementById("signup-section").style.display = "none";
            document.getElementById("signin-section").style.display = "block";
            document.getElementById("game-section").style.display = "none";
            document.getElementById("game-settings").style.display = "none";
            document.getElementById("leaderboard-section").style.display = "none";
        }

        function showSignUp() {
            document.getElementById("signup-section").style.display = "block";
            document.getElementById("game-settings").style.display = "none";
            document.getElementById("leaderboard-section").style.display = "none";
            document.getElementById("signin-section").style.display = "none";
            document.getElementById("game-section").style.display = "none";
        }

        async function fetchUserInfo() {
            const username = localStorage.getItem('username'); // اسم المستخدم المخزن عند تسجيل الدخول
            if (!username) {
                console.error('User is not logged in.');
                return;
            }
            console.log(`Fetching info for user: ${username}`); // تتبع العملية
            try {
                const response = await fetch(`${baseURL}/api/user-info/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user information.');
                }
        
                const userInfo = await response.json();
                console.log("User Info:", userInfo); // طباعة البيانات للتحقق
                displayUserInfo(userInfo);
            } catch (err) {
                console.error(err.message);
            }
        }
        
        function displayUserInfo(userInfo) {
            const parentInfoDiv = document.getElementById('info-card1');
            parentInfoDiv.innerHTML = `
                <div class="info-item">
                    <i class="fas fa-user"></i>
                    <span class="info-label">Username:</span>
                    <span class="styleDa" id="parent-name">${userInfo.username}</span>
                </div>
        
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <span class="info-label">Email:</span>
                    <span class="styleDa" id="parent-email">${userInfo.email}</span>
                </div>
        
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <span class="info-label">PhoneNumber:</span>
                    <span class="styleDa" id="parent-phone">${userInfo.phone}</span>
                </div>
            `;

            const parentInfoDiv2 = document.getElementById('info-card2');
            parentInfoDiv2.innerHTML = `
                <div class="info-item">
                    <i class="fas fa-child"></i>
                    <span class="info-label">Child Name:</span>
                    <span class="styleDa" id="parent-child-name">${userInfo.childName}</span>
                </div>
        
                <div class="info-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span class="info-label">Child Age:</span>
                    <span class="styleDa" id="parent-child-age">${userInfo.childAge}</span>
                </div>
            `
        }
        
        // استدعاء الدالة بعد تحميل الصفحة
        document.addEventListener('DOMContentLoaded', fetchUserInfo);
        
        const apiBaseUrl = baseURL;
       

        async function fetchMaterials() {
            try {
                const response = await fetch(`${baseURL}/api/materials`);
                if (!response.ok) {
                    throw new Error('Failed to fetch materials');
                }
                materials = await response.json();  // تخزين البيانات في المصفوفة
                
                // التأكد من أن المصفوفة غير فارغة
                if (materials && Array.isArray(materials) && materials.length > 0) {
                    renderMaterials(materials);  // عرض المواد
                    startGame();  // بدء اللعبة بعد تحميل المواد
                } else {
                    alert("No materials available to start the game.");
                }
            } catch (error) {
                console.error(error.message);
                alert("Error fetching materials.");
            }
        }

        function renderMaterials(materials) {
            const materialsList = document.getElementById("materials-list");

            materialsList.innerHTML = "";
            // التأكد من وجود عناصر في المصفوفة
            if (materials && Array.isArray(materials) && materials.length > 0) {
                materials.forEach((material) => {
                    const li = document.createElement("li");
                    li.classList.add("list-group-item");
                    li.innerHTML = `
                                ${material.name} (${material.isGood ? "Good" : "Bad"}) 
                                <button onclick="removeMaterial('${material.name}')">Remove</button>            
                    `;
                    materialsList.appendChild(li);
                 
                });
            } else {
                materialsList.innerHTML = "No materials to display.";
            }
        }

        async function addMaterial() {
            const name = document.getElementById("new-material-name").value.trim();
            const isGood = document.getElementById("new-material-type").value === "true";
            const description = document.getElementById("materialDescription").value.trim();

            if (name && description) {
                await fetch(`${baseURL}/api/materials`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, isGood, description })
                });
        
                // تحديث قائمة المواد بعد إضافة المادة الجديدة
                fetchMaterials(); // استدعاء الدالة لجلب المواد المحدثة من الخادم
            }
        }

        async function removeMaterial(name) {
            await fetch(`${baseURL}/api/materials/${name}`, {
                method: "DELETE"
            });
            fetchMaterials();
        }

        async function updateScoreLimit() {
            const scoreLimit = parseInt(document.getElementById("score-limit").value, 10);
            if (!isNaN(scoreLimit)) {
                await fetch(`${baseURL}/score-limit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ scoreLimit })
                });
            }
        }

        fetchMaterials();

        

        function showToast() {
            const toast = new bootstrap.Toast(document.getElementById('success-toast'));
            toast.show();
        }
        

        async function startGame() {
            if (materials.length === 0) {
                alert("No materials available to start the game.");
                return;
            }

            const playerName = document.getElementById("player-name").value;
            if (!playerName) {
                document.getElementById("alR").style.display = "block";
                return;
            } else {
                document.getElementById("alR").style.display = "none";
            }
            
            document.getElementById("start-game").style.display = "none";
            document.getElementById("game-play").style.display = "block";
            score = 0;
            currentMaterialIndex = 0;
            updateScore();
            showNextMaterial();
            document.querySelector(".cong").innerHTML = `🎉 Congratulations! ${playerName} 🎉`
        }

        function classifyMaterial(isGood) {
            const material = materials[currentMaterialIndex];
            if (material.isGood === isGood) {
                score++;
                document.querySelector(".message").innerHTML = "Correct ✅"
            } else {
                document.querySelector(".message").innerHTML = "Wrong ❌"
            }
            // تحديث النتيجة على الشاشة
            updateScore();

            document.getElementById("Dec").textContent = material.description;
            // تفعيل زر "Next"
            document.getElementById("next-btn").style.display = "inline-block";

        }

        function showNextMaterial() {
            const material = materials[currentMaterialIndex];
            document.getElementById("material-info").textContent = material.name;

            // إعادة تعيين العناصر
            document.querySelector(".message").innerHTML = "";
            document.getElementById("Dec").textContent = "";
            document.getElementById("next-btn").style.display = "none"; // إخفاء زر "Next"
        }

        function updateScore() {
            document.getElementById("score").textContent = `Score: ${score}`;
        }

        function nextMaterial() {
            currentMaterialIndex++;
            if (currentMaterialIndex < materials.length) {
                showNextMaterial();
            } else {
                endGame();
            }
        }

        function endGame() {
            document.getElementById("game-play").style.display = "none";
            document.getElementById("certificate").style.display = "block";
            document.getElementById("final-score").textContent = score;

            const playerName = document.getElementById("player-name").value;
            saveScore(playerName, score);
        }

        async function saveScore(name, score) {
            await fetch(`${baseURL}/api/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, score }),
            });
        }
        // استدعاء الدالة عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', fetchMaterials);
        
        async function showLeaderboard() {
            document.getElementById("game-section").style.display = "none";
            document.getElementById("signup-section").style.display = "none";
            document.getElementById("signin-section").style.display = "none";
            document.getElementById("parent-info-section").style.display = "none";
            document.getElementById("game-settings").style.display = "none";
            document.getElementById("leaderboard-section").style.display = "block";

            
            const response = await fetch(`${baseURL}/api/leaderboard`);
            const leaderboard = await response.json();
            const leaderboardList = document.getElementById("leaderboard-list");

            leaderboardList.innerHTML = '';
            leaderboard.forEach((player, index) => {
                const li = document.createElement("li");
                li.textContent = `${index + 1}. ${player.name} - The Score is: ${player.score}`;
                leaderboardList.appendChild(li);
            });
        }

        function playAgain() {
            document.getElementById("certificate").style.display = "none";
            document.getElementById("start-game").style.display = "block";
        }

        function showGame() {
            document.getElementById("game-section").style.display = "block";
            document.getElementById("signup-section").style.display = "none";
            document.getElementById("signin-section").style.display = "none";
            document.getElementById("leaderboard-section").style.display = "none";
            document.getElementById("parent-info-section").style.display = "none";
            document.getElementById("game-settings").style.display = "none";
        }


        async function clearLeaderboardData() {
            const confirmation = confirm("Are you sure you want to clear all player data?");
            if (confirmation) {
                try {
                    // إرسال طلب لمسح البيانات من الـ Database
                    const response = await fetch(`${baseURL}/api/leaderboard`, {
                        method: "DELETE", // نستخدم DELETE لأننا نريد مسح البيانات
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
        
                    if (response.ok) {
                        alert("Leaderboard data has been cleared successfully.");
                        // تحديث قائمة الـ leaderboard بعد المسح
                        document.getElementById("leaderboard-list").innerHTML = "";
                    } else {
                        alert("Failed to clear leaderboard data.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Error while clearing data.");
                }
            }
        }
        
        let menu = document.getElementById("menuIcon");
        let sideId = document.getElementById("sideId");

        menu.onclick = function() {
            sideId.classList.toggle("noneS");
        }

        let movedId = document.getElementById("movedId");
        let GamesSt = document.getElementById("GamesSt");
        let car1 = document.getElementById("car1");
        let mat1 = document.getElementById("mat1");
        let gams = document.getElementById("gams");

        movedId.onclick = function() {
            GamesSt.classList.toggle("moved");
            car1.classList.toggle("moved");
            mat1.classList.toggle("moved");
        }

        if (gams.classList = "non") {
            GamesSt.classList.remove("moved");
            car1.classList.remove("moved");
            mat1.classList.remove("moved");
        }
