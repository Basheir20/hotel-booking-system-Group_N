let currentUser = null;
let currentBookings = [];

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    loadUserProfile();
    loadBookings();
});

async function loadUserProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        currentUser = await response.json();

        // Update greeting
        document.getElementById('userGreeting').textContent = `Welcome, ${currentUser.username}!`;

        // Update profile section
        document.getElementById('userProfile').innerHTML = `
            <div class="space-y-2">
                <p class="text-gray-600">Username</p>
                <p class="font-medium">${currentUser.username}</p>
            </div>
            <div class="space-y-2">
                <p class="text-gray-600">Email</p>
                <p class="font-medium">${currentUser.email}</p>
            </div>
            <div class="space-y-2">
                <p class="text-gray-600">Member Since</p>
                <p class="font-medium">${new Date(currentUser.created_at).toLocaleDateString()}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error loading profile:', error);
        alert('Error loading profile. Please try again.');
    }
}

async function loadBookings(filter = 'upcoming') {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/bookings/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        currentBookings = await response.json();

        // Filter bookings
        const today = new Date();
        const filteredBookings = currentBookings.filter(booking => {
            const checkOutDate = new Date(booking.check_out_date);
            return filter === 'upcoming' ? checkOutDate >= today : checkOutDate < today;
        });

        // Update bookings list
        document.getElementById('bookingsList').innerHTML = filteredBookings.map(booking => `
            <div class="py-4">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-semibold">${booking.room_type} - Room ${booking.room_number}</h3>
                        <p class="text-gray-600">
                            ${new Date(booking.check_in_date).toLocaleDateString()} - 
                            ${new Date(booking.check_out_date).toLocaleDateString()}
                        </p>
                        <p class="text-gray-600">Status: <span class="capitalize">${booking.status}</span></p>
                    </div>
                    <p class="font-bold">$${booking.total_price}</p>
                </div>
                ${booking.status === 'pending' && new Date(booking.check_in_date) > today ? `
                    <div class="mt-2">
                        <button onclick="cancelBooking(${booking.id})" 
                            class="text-red-600 hover:text-red-800 text-sm">
                            Cancel Booking
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('') || '<p class="text-gray-600">No bookings found</p>';
    } catch (error) {
        console.error('Error loading bookings:', error);
        alert('Error loading bookings. Please try again.');
    }
}

function filterBookings(filter) {
    loadBookings(filter);
    // Update button styles
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.toLowerCase().includes(filter)) {
            btn.classList.replace('bg-gray-100', 'bg-blue-100');
            btn.classList.replace('text-gray-600', 'text-blue-600');
        } else {
            btn.classList.replace('bg-blue-100', 'bg-gray-100');
            btn.classList.replace('text-blue-600', 'text-gray-600');
        }
    });
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Booking cancelled successfully');
            loadBookings();
        } else {
            const data = await response.json();
            alert(data.message || 'Error cancelling booking');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking. Please try again.');
    }
}

function showEditProfile() {
    const modal = document.getElementById('editProfileModal');
    const form = document.getElementById('editProfileForm');
    
    // Pre-fill form
    form.username.value = currentUser.username;
    form.email.value = currentUser.email;
    
    modal.classList.remove('hidden');
}

function hideEditProfile() {
    document.getElementById('editProfileModal').classList.add('hidden');
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updates = Object.fromEntries(formData.entries());

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            alert('Profile updated successfully');
            hideEditProfile();
            loadUserProfile();
        } else {
            const data = await response.json();
            alert(data.message || 'Error updating profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Event Listeners
document.getElementById('editProfileForm').addEventListener('submit', handleProfileUpdate); 