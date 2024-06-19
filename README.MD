# 📲 Skrip Broadcast Pesan WhatsApp 📲

Ini adalah skrip Node.js yang memungkinkan Anda untuk mengirim pesan broadcast ke daftar kontak WhatsApp 
yang diambil dari file JSON. Skrip ini menggunakan berbagai modul Node.js untuk melakukan autentikasi, 
menghasilkan ID unik, dan mengelola pengiriman pesan dengan logika retry.

## 🚀 Persyaratan

- **Node.js**: Versi terbaru disarankan.
- **npm**: Node Package Manager.

## ⚙️ Instalasi

1. Clone repositori:
    ```bash
    git clone https://github.com/ajrulamilinm/backend-leads-boost.git
    ```

2. Masuk ke direktori proyek:
    ```bash
    cd backend-bootcamp
    ```

3. Instal dependensi:
    ```bash
    npm install
    ```

## 🛠️ Konfigurasi

1. Buat file `targets.json` di root proyek dengan struktur berikut:
    ```json
    {
        "targets": [
            "contact1",
            "contact2",
            "contact3"
        ]
    }
    ```
   Ganti `contact1`, `contact2`, `contact3`, dll. dengan nomor telepon atau identifikasi kontak yang 
sebenarnya.

## 📜 Penggunaan

Jalankan skrip menggunakan Node.js:
```bash
node broadcastlink.js

