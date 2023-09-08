let page = 1;
let totalPage = 0;
let pageStart = 1;
let pageShow = 5;

const onPageClick = (index) => {
    page = pageStart + index;
    if (index == 0 && pageStart > 1) {
        $('.page-numbers').each((i, element) => {
            let pNumber = parseInt(element.dataset.page) - 1;
            element.dataset.page = pNumber;
            element.children[0].innerHTML = pNumber;
        });
        pageStart--;
    }
    else if (index == pageShow - 1 && pageStart + pageShow < totalPage) {
        $('.page-numbers').each((i, element) => {
            let pNumber = parseInt(element.dataset.page) + 1;
            element.dataset.page = pNumber;
            element.children[0].innerHTML = pNumber;
        });
        pageStart++;
    }
    refreshPage(page);
}

const onPrevClick = () => {
    if (page == 1) return;
    page--;
    onPageClick(page - pageStart);
}

const onNextClick = () => {
    if (page == totalPage) return;
    page++;
    onPageClick(page - pageStart);
}