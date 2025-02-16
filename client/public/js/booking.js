let currentRoom = null;
let pricePerNight = 0;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    
    if (!roomId) {
        window.location.href = '/rooms.html';
        return;
    }

    loadRoomDetails(roomId);
    setupBookingForm();
});

async function loadRoomDetails(roomId) {
    try {
        const response = await fetch(`/api/rooms/${roomId}`);
        currentRoom = await response.json();
        pricePerNight = currentRoom.price;

        document.getElementById('roomDetails').innerHTML = `
            <div class="flex items-center gap-4">
                <img src="${currentRoom.image_url}" alt="${currentRoom.room_type}" 
                    class="w-24 h-24 object-cover rounded">
                <div>
                    <h2 class="text-xl font-semibold">${currentRoom.room_type}</h2>
                    <p class="text-gray-600">Room ${currentRoom.room_number}</p>
                    <p class="text-lg font-bold">$${currentRoom.price}/night</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading room details:', error);
        alert('Error loading room details. Please try again.');
    }
}

function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    const checkInInput = form.querySelector('[name="checkInDate"]');
    const checkOutInput = form.querySelector('[name="checkOutDate"]');

    // Set minimum dates
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    checkInInput.min = tomorrow.toISOString().split('T')[0];

    checkInInput.addEventListener('change', updateCheckOutMin);
    [checkInInput, checkOutInput].forEach(input => {
        input.addEventListener('change', calculateTotal);
    });

    form.addEventListener('submit', handleBooking);
}

function updateCheckOutMin() {
    const checkInInput = document.querySelector('[name="checkInDate"]');
    const checkOutInput = document.querySelector('[name="checkOutDate"]');
    
    const checkInDate = new Date(checkInInput.value);
    const minCheckOut = new Date(checkInDate);
    minCheckOut.setDate(minCheckOut.getDate() + 1);
    
    checkOutInput.min = minCheckOut.toISOString().split('T')[0];
    if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
        checkOutInput.value = minCheckOut.toISOString().split('T')[0];
    }
}

function calculateTotal() {
    const checkInDate = new Date(document.querySelector('[name="checkInDate"]').value);
    const checkOutDate = new Date(document.querySelector('[name="checkOutDate"]').value);

    if (checkInDate && checkOutDate) {
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const total = nights * pricePerNight;
        document.getElementById('totalPrice').textContent = `Total: $${total}`;
        return total;
    }
    return 0;
}

async function handleBooking(e) {
    e.preventDefault();

    const checkInDate = document.querySelector('[name="checkInDate"]').value;
    const checkOutDate = document.querySelector('[name="checkOutDate"]').value;
    const totalPrice = calculateTotal();

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return;
        }

        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                roomId: currentRoom.id,
                checkInDate,
                checkOutDate,
                totalPrice
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Booking successful! Check your email for confirmation.');
            window.location.href = '/bookings.html';
        } else {
            alert(data.message || 'Error creating booking');
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        alert('Error creating booking. Please try again.');
    }
} 