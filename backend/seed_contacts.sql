-- Seed file for recent contacts
INSERT INTO users (id, full_name, email, password_hash, balance, avatar_url)
VALUES 
('alice-uuid', 'Alice Johnson', 'alice@example.com', 'dummy_hash', 1000.00, 'https://cdn.quasar.dev/img/avatar1.jpg'),
('bob-uuid', 'Bob Smith', 'bob@example.com', 'dummy_hash', 1000.00, 'https://cdn.quasar.dev/img/avatar2.jpg'),
('charlie-uuid', 'Charlie Brown', 'charlie@example.com', 'dummy_hash', 1000.00, 'https://cdn.quasar.dev/img/avatar3.jpg'),
('david-uuid', 'David Wilson', 'david@example.com', 'dummy_hash', 1000.00, 'https://cdn.quasar.dev/img/avatar4.jpg');
