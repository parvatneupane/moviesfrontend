
        document.addEventListener('DOMContentLoaded', function() {
            // Tab functionality
            const tabs = document.querySelectorAll('.tab');
            const tabContents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.getAttribute('data-tab');
                    
                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Show correct tab content
                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === `${target}-tab`) {
                            content.classList.add('active');
                        }
                    });
                });
            });
            
            // Profile form validation
            const passwordForm = document.getElementById('passwordForm');
            const notification = document.getElementById('notification');
            
            if (passwordForm) {
                passwordForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const newUsername = document.getElementById('newusername').value;
                    const currentPassword = document.getElementById('currentPassword').value;
                    const newPassword = document.getElementById('newPassword').value;
                    const confirmPassword = document.getElementById('confirmPassword').value;
                    
                    // Basic validation
                    if (newPassword !== confirmPassword) {
                        showNotification('New passwords do not match!', 'error');
                        return;
                    }
                    
                    if (newPassword.length < 8) {
                        showNotification('Password should be at least 8 characters long!', 'error');
                        return;
                    }
                    
                    // In a real application, you would send this to the server
                    showNotification('Profile updated successfully!', 'success');
                    passwordForm.reset();
                });
            }
            
            // Show notification function
            function showNotification(message, type) {
                notification.textContent = message;
                notification.className = 'notification';
                if (type === 'error') {
                    notification.classList.add('error');
                } else {
                    notification.classList.add('show');
                }
                
                setTimeout(() => {
                    notification.classList.remove('show', 'error');
                }, 3000);
            }
            
            // Logout function
            window.handleLogout = function() {
                if (confirm('Are you sure you want to logout?')) {
                    showNotification('Logging out...', 'success');
                    // In a real application, this would redirect to logout endpoint
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                }
            };
        });
 
