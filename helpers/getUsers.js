module.exports = (users, activePage = 1, userQty = 3) => {
    let usersOnPage = [];
    let num = activePage * userQty - userQty;
    users.map((user, index) => {
        if (index >= num && index < (num + userQty)) {
            usersOnPage.push(user);
        }
    });
    return usersOnPage;
}