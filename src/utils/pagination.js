const paginationDotItems = (currentPage, pageCount) => {
    const visiblePages = 2;
    const firstInstance = Math.max(2, currentPage - visiblePages);
    const lastInstance = Math.min(pageCount - 1, currentPage + visiblePages)
    let list = [];

    for (let i = firstInstance; i <= lastInstance ; i++) {
        list.push(i);
    }

    if (currentPage - visiblePages > 2) {
        list.unshift("...");
    }
    if (currentPage + visiblePages < pageCount - 1) {
        list.push("...");
    }

    list.unshift(1);
    if (pageCount > 1) {
        list.push(pageCount);
    }
    return list;
};

export default paginationDotItems