CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(40) DEFAULT 'patient',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  patient_name VARCHAR(120) NOT NULL,
  age INTEGER,
  gender VARCHAR(40),
  mobile VARCHAR(30),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emergencies (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
  type VARCHAR(60) NOT NULL,
  priority VARCHAR(30) DEFAULT 'high',
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status VARCHAR(40) DEFAULT 'new',
  assigned_resource VARCHAR(80),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  status VARCHAR(40) DEFAULT 'available',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  payload_kg NUMERIC(6,2) DEFAULT 5,
  battery_percent INTEGER DEFAULT 100
);

CREATE TABLE IF NOT EXISTS hospitals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  emergency_available BOOLEAN DEFAULT TRUE,
  beds_available INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pharmacies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  open_now BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS medicines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  requires_prescription BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS medicine_requests (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
  medicine_id INTEGER REFERENCES medicines(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  delivery_latitude DOUBLE PRECISION,
  delivery_longitude DOUBLE PRECISION,
  status VARCHAR(40) DEFAULT 'requested',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO drones (name, status, latitude, longitude, payload_kg, battery_percent)
SELECT 'MediDrone Alpha', 'available', 16.3067, 80.4365, 5, 94
WHERE NOT EXISTS (SELECT 1 FROM drones);

INSERT INTO drones (name, status, latitude, longitude, payload_kg, battery_percent)
SELECT 'MediDrone Beta', 'available', 16.3000, 80.4300, 8, 81
WHERE NOT EXISTS (SELECT 1 FROM drones WHERE name='MediDrone Beta');

INSERT INTO hospitals (name, address, latitude, longitude, emergency_available, beds_available)
SELECT 'MediCare General Hospital', 'Guntur, Andhra Pradesh', 16.3067, 80.4365, TRUE, 18
WHERE NOT EXISTS (SELECT 1 FROM hospitals);

INSERT INTO hospitals (name, address, latitude, longitude, emergency_available, beds_available)
SELECT 'City Emergency Care', 'Guntur, Andhra Pradesh', 16.2990, 80.4420, TRUE, 7
WHERE NOT EXISTS (SELECT 1 FROM hospitals WHERE name='City Emergency Care');

INSERT INTO pharmacies (name, address, latitude, longitude, open_now)
SELECT 'MediCare Pharmacy', 'Guntur, Andhra Pradesh', 16.3040, 80.4380, TRUE
WHERE NOT EXISTS (SELECT 1 FROM pharmacies);

INSERT INTO medicines (name, category, stock, requires_prescription)
SELECT 'Paracetamol', 'Pain & Fever', 120, FALSE
WHERE NOT EXISTS (SELECT 1 FROM medicines WHERE name='Paracetamol');

INSERT INTO medicines (name, category, stock, requires_prescription)
SELECT 'Oral Rehydration Salts', 'Hydration', 80, FALSE
WHERE NOT EXISTS (SELECT 1 FROM medicines WHERE name='Oral Rehydration Salts');

INSERT INTO medicines (name, category, stock, requires_prescription)
SELECT 'First Aid Antiseptic', 'Emergency Supplies', 45, FALSE
WHERE NOT EXISTS (SELECT 1 FROM medicines WHERE name='First Aid Antiseptic');
