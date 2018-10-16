module.exports = (users, activePage = 1, usersQty = 2) => {
    const pagesQty = Math.ceil(users / usersQty);
    let pages = [];
    for( let i = 1; i <= pagesQty; i++) {
        if (i !== +activePage) {
            pages.push({content: i, isActive: false});
        } else {
            pages.push({content: i, isActive: true});
        }
        
    }
    return pages;
}
