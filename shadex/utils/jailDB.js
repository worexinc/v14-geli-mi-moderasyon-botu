const fs   = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/jail.json');

// data klasörü yoksa oluştur
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '{}', 'utf8');
}

function readDB() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
    // Üyeyi jail'e ekle
    set(userId, roles) {
        const db = readDB();
        db[userId] = roles;
        writeDB(db);
    },

    // Üyenin eski rollerini al
    get(userId) {
        const db = readDB();
        return db[userId] || null;
    },

    // Üyeyi jail'den çıkar
    delete(userId) {
        const db = readDB();
        delete db[userId];
        writeDB(db);
    },

    // Jail'de olan tüm kullanıcılar
    all() {
        return readDB();
    }
};
