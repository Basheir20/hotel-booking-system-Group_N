-- Then create the tables
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT UNIQUE NOT NULL,
    room_type TEXT NOT NULL,
    price REAL NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT,
    image_url TEXT,
    is_available INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Delete existing rooms first to avoid conflicts
DELETE FROM rooms;

-- Then insert sample room data
INSERT OR REPLACE INTO rooms (room_number, room_type, price, capacity, description, image_url, is_available) VALUES
('101', 'standard', 100.00, 2, 'Comfortable standard room with city view', '/images/rooms/standard1.jpg', 1),
('102', 'standard', 120.00, 2, 'Modern standard room with garden view', '/images/rooms/standard2.jpg', 1),
('201', 'deluxe', 150.00, 2, 'Spacious deluxe room with ocean view', '/images/rooms/deluxe1.jpg', 1),
('202', 'deluxe', 180.00, 3, 'Premium deluxe room with balcony', '/images/rooms/deluxe2.jpg', 1),
('301', 'suite', 250.00, 4, 'Luxury suite with separate living area', '/images/rooms/suite1.jpg', 1),
('302', 'suite', 300.00, 4, 'Executive suite with panoramic view', '/images/rooms/suite2.jpg', 1); 