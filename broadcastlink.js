const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');

// Definisikan username dan password untuk login
const username = 'testuser';
const password = 'testpassword';

// Function to get token from login endpoint
const getToken = async () => {
    try {
        const response = await axios.post('https://pabarstudio-wa-services.vercel.app/login', {
            username: username,
            password: password
        });
        console.log('Login response:', response.data);
        if (response.data && response.data.token) {
            return response.data.token;
        } else {
            throw new Error('Invalid login response');
        }
    } catch (error) {
        if (error.response) {
            console.error('Error getting token:', error.response.status, error.response.data);
        } else {
            console.error('Error getting token:', error.message);
        }
        throw new Error('Failed to get token');
    }
};

// Function to send message with retry logic
const sendMessageWithRetry = async (target, message, retries = 3) => {
    try {
        const token = await getToken();
        const payload = { target, message };

        const response = await axios.post('https://pabarstudio-wa-services.vercel.app/send-message', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            console.log('Message sent to', target, ':', response.data);
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        if (error.response) {
            console.error(`Error sending message to ${target}:`, error.response.status, error.response.data);
        } else {
            console.error(`Error sending message to ${target}:`, error.message);
        }
        if (retries > 0) {
            console.log(`Retrying... (${4 - retries} of 3)`);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds before retrying
            return sendMessageWithRetry(target, message, retries - 1);
        } else {
            console.error(`Max retries reached for ${target}, unable to send message`);
            throw new Error('Max retries reached, unable to send message');
        }
    }
};

// Function to generate unique id based on nocontact and timestamp
const generateUniqueId = (nocontact, timestamp) => {
    const data = `${nocontact}-${timestamp}`;
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return hash;
};

// Function to encode data using base64
const encodeData = (data) => {
    const jsonString = JSON.stringify(data);
    return Buffer.from(jsonString).toString('base64');
};

// Function to send messages to all contacts
const sendMessages = async () => {
    try {
        // Baca file konfigurasi untuk mendapatkan daftar nomor telepon
        const rawConfig = fs.readFileSync('targets.json');
        const config = JSON.parse(rawConfig);
        const targets = config.targets;

        console.log('Retrieved contacts:', targets);

        const sendMessagesPromises = targets.map(async (target) => {
            const date = new Date().toISOString().split('T')[0]; // Mengambil tanggal saat ini (YYYY-MM-DD)
            const id = generateUniqueId(target, date);
            const data = {
                id,
                target,
                timestamp: date
            };
            const encodedData = encodeData(data);
            const link = `https://leadboost.vercel.app/register?data=${encodedData}`;
            const message = `Special untukmu! Solusi terbaik untuk kebutuhan pembiayaan pendidikan, kendaraan dan modal usahamu.\n\n*Apply Sekarang*\n\n Link : ${link}`;

            try {
                await sendMessageWithRetry(target, message);
            } catch (error) {
                console.error(`Error sending message to ${target}:`, error.message);
            }
        });

        await Promise.all(sendMessagesPromises);

        console.log('All messages processed.');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Panggil fungsi untuk mengirim pesan
sendMessages();