document.addEventListener('DOMContentLoaded', () => {
    loadRooms();
    setupFilters();
});

async function loadRooms(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`http://localhost:5000/api/rooms?${queryParams}`);
        const rooms = await response.json();

        const roomsGrid = document.getElementById('roomsGrid');
        roomsGrid.innerHTML = rooms.map(room => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img src="${room.image_url}" alt="${room.room_type}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-semibold text-[#4A4238]">${room.room_type}</h3>
                    <p class="text-[#8B7355]">Room ${room.room_number}</p>
                    <p class="text-[#8B7355]">Capacity: ${room.capacity} persons</p>
                    <p class="text-lg font-bold mt-2 text-[#4A4238]">$${room.price}/night</p>
                    <div class="mt-4 space-y-2">
                        <button onclick="bookRoom(${room.id})" 
                            class="w-full bg-[#B68D40] text-white px-4 py-2 rounded-md hover:bg-[#A67C30] transition-colors duration-300">
                            Book Now
                        </button>
                        <a href="/booking.html?roomId=${room.id}" 
                            class="block text-center w-full border-2 border-[#B68D40] text-[#B68D40] px-4 py-2 rounded-md hover:bg-[#B68D40] hover:text-white transition-colors duration-300">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading rooms:', error);
        alert('Error loading rooms. Please try again.');
    }
}

function setupFilters() {
    const filterForm = document.getElementById('filterForm');
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(filterForm);
        const filters = Object.fromEntries(formData.entries());
        loadRooms(filters);
    });
}

async function bookRoom(roomId) {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Redirect to booking page with room ID
    window.location.href = `/booking.html?roomId=${roomId}`;
} 