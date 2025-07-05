const bcrypt = require('bcryptjs');
const config = require('../config');

// Initialize with hashed password for default user
let users = [];

// Hash the default user password on startup
const initializeDefaultUser = async () => {
    try {
        const hashedPassword = await bcrypt.hash('pass1', config.bcryptSaltRounds);
        users.push({ username: 'fraser', password: hashedPassword });
    } catch (error) {
        console.error('Error initializing default user:', error);
    }
};

// Initialize default user
initializeDefaultUser();

class User {
    static getAll() {
        return users;
    }
    
    static findByUsername(username) {
        return users.find(user => user.username === username);
    }
    
    static exists(username) {
        return users.some(user => user.username === username);
    }
    
    static async create(username, password) {
        if (this.exists(username)) {
            return false;
        }
        
        try {
            // Hash the password before storing
            const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);
            users.push({ username, password: hashedPassword });
            return true;
        } catch (error) {
            console.error('Error hashing password:', error);
            return false;
        }
    }
    
    static async authenticate(username, password) {
        const user = this.findByUsername(username);
        if (!user) {
            return false;
        }
        
        try {
            // Compare the provided password with the hashed password
            return await bcrypt.compare(password, user.password);
        } catch (error) {
            console.error('Error comparing passwords:', error);
            return false;
        }
    }
}

module.exports = User;
