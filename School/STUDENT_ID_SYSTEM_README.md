# Student ID System

A comprehensive student identification and attendance management system designed for educational institutions. This system provides physical ID cards with multi-format support (RFID, NFC, QR codes, barcodes), real-time attendance tracking, building access control, and administrative management tools.

## Features

### 🆔 Multi-Format ID Cards
- **RFID/NFC Support**: Physical cards with embedded chips for secure access
- **QR Codes**: Digital check-ins and mobile integration
- **Barcodes**: Traditional scanning compatibility
- **Visual Design**: Customizable card templates with photos and information

### 📊 Real-Time Attendance Tracking
- **Automatic Logging**: Track entry/exit times for classrooms and buildings
- **Location Awareness**: GPS and access point-based location tracking
- **Validation System**: Prevent duplicate or invalid entries
- **Historical Records**: Complete attendance history with timestamps

### 🔐 Access Control System
- **Building Access**: Control entry to different campus areas
- **Classroom Management**: Track student presence in specific classes
- **Emergency Features**: Quick emergency contact access
- **Lost/Stolen Card Management**: Immediate deactivation capabilities

### 📱 Mobile Integration
- **Digital Wallet**: Mobile app for digital ID cards
- **Quick Actions**: Emergency contacts and QR code display
- **Offline Support**: Basic functionality without internet connection
- **Push Notifications**: Real-time alerts for access events

### 🛠️ Hardware Integration
- **RFID Readers**: Connect to physical access points
- **Barcode Scanners**: Traditional scanning device support
- **Turnstiles**: Automated entry systems
- **WebSocket Communication**: Real-time device communication

### 👨‍💼 Administrative Tools
- **Dashboard**: Comprehensive system overview
- **Card Management**: Issue, deactivate, and track cards
- **Reports**: Generate attendance and access reports
- **User Management**: Student and staff account management

## System Architecture

```
Frontend (React)
├── Student Portal
├── Admin Dashboard
├── Mobile App
└── Hardware Integration

Backend (Django REST Framework)
├── User Management
├── ID Card System
├── Attendance Tracking
├── Access Control
└── Hardware API

Database (PostgreSQL)
├── Student Records
├── Attendance Logs
├── Access Events
└── System Configuration

Hardware Layer
├── RFID/NFC Readers
├── Barcode Scanners
├── Access Points
└── Security Systems
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Redis (for WebSocket support)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/student-id-system.git
   cd student-id-system/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database**
   ```bash
   # Create PostgreSQL database
   createdb student_id_system

   # Update settings.py with database credentials
   nano config/settings.py
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../src
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoints**
   ```bash
   # Update API base URL in src/api.js
   nano src/api.js
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Hardware Setup

1. **Install hardware drivers**
   ```bash
   # For RFID readers
   pip install pyscard

   # For barcode scanners
   pip install pyzbar
   ```

2. **Configure access points**
   ```bash
   # Update hardware configuration
   nano backend/config/hardware.py
   ```

3. **Start hardware service**
   ```bash
   python manage.py hardware_service
   ```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login/
Login with username and password.

**Request:**
```json
{
  "username": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "student@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "student"
  }
}
```

### ID Card Endpoints

#### GET /api/auth/id/my_card/
Get current user's ID card information.

#### POST /api/auth/id/id-cards/
Request a new ID card.

**Request:**
```json
{
  "card_type": "standard",
  "emergency_contact_name": "Jane Doe",
  "emergency_contact_phone": "+1234567890",
  "medical_info": "No known allergies"
}
```

#### POST /api/auth/id/id-cards/{id}/report_lost/
Report a card as lost or stolen.

### Attendance Endpoints

#### GET /api/auth/attendance/
Get attendance records.

**Query Parameters:**
- `card`: Filter by card ID
- `date_from`: Start date (YYYY-MM-DD)
- `date_to`: End date (YYYY-MM-DD)
- `limit`: Number of records to return

#### POST /api/auth/attendance/check-in/
Manual check-in (for testing).

### Access Control Endpoints

#### GET /api/auth/id/access-points/
List all access points.

#### POST /api/auth/id/access-points/
Create a new access point.

**Request:**
```json
{
  "name": "Main Entrance",
  "location": "Front Door",
  "access_point_type": "rfid_reader",
  "building": "A",
  "floor": "1",
  "room": "101"
}
```

#### POST /api/auth/id/access-points/{id}/connect/
Connect to an access point.

## Hardware Integration

### Supported Devices

1. **RFID Readers**
   - ACR122U
   - PN532
   - MFRC522

2. **Barcode Scanners**
   - USB scanners
   - Camera-based scanners
   - Industrial scanners

3. **Access Points**
   - Door locks
   - Turnstiles
   - Gates

### Device Configuration

```python
# backend/config/hardware.py
HARDWARE_CONFIG = {
    'rfid_reader': {
        'driver': 'acr122u',
        'port': '/dev/ttyUSB0',
        'baudrate': 9600
    },
    'barcode_scanner': {
        'driver': 'usb',
        'vendor_id': '0x1234',
        'product_id': '0x5678'
    }
}
```

### WebSocket Communication

The system uses WebSocket for real-time communication between hardware devices and the server.

**Connection URL:** `ws://your-server/ws/hardware/`

**Message Types:**
- `card_scan`: Card scanned at access point
- `access_granted`: Access granted
- `access_denied`: Access denied
- `device_status`: Device status update

## Usage Guide

### For Students

1. **Request ID Card**
   - Log in to student portal
   - Navigate to "My ID Card"
   - Click "Request New Card"
   - Fill in emergency contact information

2. **Use Digital Card**
   - Open mobile app
   - View digital ID card
   - Show QR code for check-ins
   - Access emergency contacts

3. **Check Attendance**
   - View attendance history
   - See real-time status
   - Export attendance reports

### For Administrators

1. **Manage Cards**
   - View all student cards
   - Activate/deactivate cards
   - Handle lost/stolen reports

2. **Monitor Attendance**
   - Real-time attendance dashboard
   - Generate reports
   - Export data for analysis

3. **Configure Access Points**
   - Add new access points
   - Test device connections
   - Monitor device status

## Security Features

### Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based permissions system
- **Audit Logs**: Complete logging of all system activities

### Card Security
- **Unique Identifiers**: Each card has multiple unique identifiers
- **Anti-Counterfeiting**: Holographic overlays and security features
- **Immediate Deactivation**: Lost/stolen cards can be deactivated instantly

### Network Security
- **HTTPS Only**: All communications encrypted
- **API Authentication**: JWT tokens with expiration
- **Rate Limiting**: Protection against brute force attacks

## Customization

### Card Templates
Customize ID card designs by modifying the template files in `/backend/templates/cards/`.

### Branding
Update colors, logos, and branding in:
- Frontend: `/src/styles/theme.css`
- Backend: `/backend/templates/base.html`

### Business Logic
Extend functionality by modifying:
- Models: `/backend/users/models_student_id.py`
- Views: `/backend/users/views.py`
- Serializers: `/backend/users/serializers.py`

## Troubleshooting

### Common Issues

1. **Hardware Not Connecting**
   - Check USB connections
   - Verify device drivers
   - Check device permissions

2. **Cards Not Scanning**
   - Verify card format
   - Check reader configuration
   - Test with known working card

3. **WebSocket Connection Failed**
   - Check firewall settings
   - Verify WebSocket server is running
   - Check network connectivity

### Logs
View system logs at:
- Backend: `/backend/logs/`
- Hardware: `/var/log/hardware-service.log`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@studentidsystem.com
- Documentation: https://docs.studentidsystem.com
- Issues: https://github.com/your-org/student-id-system/issues

## Changelog

### Version 1.0.0
- Initial release
- Basic ID card functionality
- Attendance tracking
- Hardware integration
- Mobile app support

### Version 1.1.0 (Upcoming)
- Enhanced security features
- Advanced reporting
- Mobile app improvements
- API enhancements

---

**Built with ❤️ for educational institutions worldwide**
