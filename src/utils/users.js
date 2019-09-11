const users = [];

// add user
const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if (!username || !room) return { error: 'Username and room are required' };

    // Check for duplicate username
    const existingUser = users.find((user) => {
        return user.room === room && username === username;
    });

    if (existingUser) return { error: 'This username is already taken!'}


    // Store user
    const user = { id, username, room }
    users.push(user);
    return { user }
}
// remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id );

    if(indesx !== -1) return users.splice(index, 1)[0]; // remove user with their index in the array
}

// get user
const getUser = (id) => {
    return users.find(user => user.id === id)
}

// get all users in the room
const getAllUsers = (room) => {
    room = room.trim().toLowerCase()
    return users.filter(user => user.room === room)
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getAllUsers
}