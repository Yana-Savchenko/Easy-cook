module.exports = (users, activePage, userQty) => {
    let usersOnPage = [];
    let num = activePage * userQty - userQty;
    users.map((user, index) => {
        if (index >= num && index < (num + userQty)) {
            usersOnPage.push(user);
        }
    });
    return usersOnPage;
}